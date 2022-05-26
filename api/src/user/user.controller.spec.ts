import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { applyMiddleware } from '../utils/middleware';
import { UserController } from './user.controller';
import { UserModule } from './user.module';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';
import * as request from 'supertest';
import { PrismaModule } from '../prisma/prisma.module';
import { multerModuleFactory } from '../utils/modules';
import * as fs from 'fs';
import {
	cleanTestDir,
	generateUsers,
	getTestDir,
	resetDatabase,
} from '../utils/test';
import { join } from 'path';

describe('UserController', () => {
	let controller: UserController;
	let auth: AuthService;
	let prisma: PrismaService;
	let app: INestApplication;

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			imports: [UserModule, AuthModule],
		}).compile();

		controller = module.get<UserController>(UserController);
		auth = module.get<AuthService>(AuthService);
		prisma = module.get<PrismaService>(PrismaService);

		app = module.createNestApplication();
		applyMiddleware(app);
		await app.init();
		await resetDatabase(prisma);
	});

	afterEach(async () => {
		await prisma.user.deleteMany();
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	it('GET /:username - authorized', async () => {
		const users: User[] = await generateUsers(2, prisma);

		const token = auth.generateToken(users[0]);
		const response: request.Response = await request(app.getHttpServer())
			.get(`/user/${users[1].username}`)
			.auth(token, { type: 'bearer' });
		expect(response.ok).toBe(true);
		expect(response.body.username).toBe(users[1].username);
	});

	it('GET /:username - unauthorized', async () => {
		const users: User[] = await generateUsers(2, prisma);

		const response = await request(app.getHttpServer()).get(
			`/user/${users[1].username}`,
		);
		expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
	});

	it('GET /:username - user does not exist', async () => {
		const users: User[] = await generateUsers(2, prisma);
		const token = auth.generateToken(users[0]);

		const response = await request(app.getHttpServer())
			.get(`/user/9fake_username`)
			.auth(token, { type: 'bearer' });
		expect(response.status).toBe(HttpStatus.NOT_FOUND);
	});

	it('PATCH /:username - without files', async () => {
		const users = await generateUsers(1, prisma);
		const user = users[0];

		const name = 'UpdatedName';
		const location = 'UpdatedLocation';
		const bio = 'UpdatedBio';
		const response = await request(app.getHttpServer())
			.patch(`/user/${user.username}`)
			.auth(auth.generateToken(user), { type: 'bearer' })
			.field('name', name)
			.field('location', location)
			.field('bio', bio);
		expect(response.ok).toBe(true);
		expect(response.body.name).toBe(name);
		expect(response.body.location).toBe(location);
		expect(response.body.bio).toBe(bio);
	});
});

describe('UserController - files', () => {
	let controller: UserController;
	let service: UserService;
	let auth: AuthService;
	let prisma: PrismaService;
	let app: INestApplication;
	const testDir = getTestDir();

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			imports: [
				PrismaModule,
				multerModuleFactory('./upload/__test__'),
				AuthModule,
			],
			controllers: [UserController],
			providers: [UserService],
		}).compile();

		cleanTestDir();

		controller = module.get<UserController>(UserController);
		service = module.get<UserService>(UserService);
		auth = module.get<AuthService>(AuthService);
		prisma = module.get<PrismaService>(PrismaService);

		app = module.createNestApplication();
		applyMiddleware(app);
		await app.init();
		await resetDatabase(prisma);
		jest.spyOn(service, 'getFilePath').mockImplementation((filename) => {
			return join(testDir, filename);
		});
	});

	afterEach(() => {
		cleanTestDir();
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	it('PATCH /:username - avatar', async () => {
		const sample = join(testDir, 'sample', 'avatar.png');
		const users = await generateUsers(1, prisma);
		let user = users[0];

		let response = await request(app.getHttpServer())
			.patch(`/user/${user.username}`)
			.auth(auth.generateToken(user), { type: 'bearer' })
			.attach('avatar', sample);

		user = await service.get(user.username);
		response = await request(app.getHttpServer())
			.get(`/user/${user.username}/avatar`)
			.auth(auth.generateToken(user), { type: 'bearer' });

		expect(response.ok).toBe(true);
		expect(response.body.image).toBe(fs.readFileSync(sample, 'base64'));
		expect(user.avatar).not.toBeNull();
		expect(fs.existsSync(join(testDir, user.avatar))).toBe(true);
	});

	it('PATCH /:username - background', async () => {
		const sample = join(testDir, 'sample', 'background.png');
		const users = await generateUsers(1, prisma);
		let user = users[0];

		let response = await request(app.getHttpServer())
			.patch(`/user/${user.username}`)
			.auth(auth.generateToken(user), { type: 'bearer' })
			.attach('background', sample);

		user = await service.get(user.username);
		response = await request(app.getHttpServer())
			.get(`/user/${user.username}/background`)
			.auth(auth.generateToken(user), { type: 'bearer' });

		expect(response.ok).toBe(true);
		expect(response.body.image).toBe(fs.readFileSync(sample, 'base64'));
		expect(user.background).not.toBeNull();
		expect(fs.existsSync(join(testDir, user.background))).toBe(true);
	});
});
