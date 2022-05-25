import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { applyMiddleware } from '../utils/middleware';
import { UserController } from './user.controller';
import { UserModule } from './user.module';
import { UserService } from './user.service';
import { faker } from '@faker-js/faker';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';
import * as request from 'supertest';
import { PrismaModule } from '../prisma/prisma.module';
import { multerModuleFactory } from '../utils/modules';
import * as fs from 'fs';
import { extname, join } from 'path';

const testDir = join(process.cwd(), 'upload', '__test__');

async function generateUsers(
	total: number,
	prisma: PrismaService,
): Promise<User[]> {
	const index = (await prisma.user.count()) + 1;
	const users: User[] = [];

	while (users.length < total) {
		const data = {
			id: faker.datatype.uuid(),
			name: faker.name.firstName(),
			email: index + faker.internet.email(),
			username: index + faker.name.lastName(),
			gitHubId: null,
			googleId: null,
			password: faker.random.alpha(10),
			birth: new Date(),
			createdAt: new Date(),
			updatedAt: new Date(),
			avatar: null,
			background: null,
			location: null,
			bio: null,
		};
		users.push(await prisma.user.create({ data }));
	}
	return users;
}

async function resetDatabase(prisma: PrismaService): Promise<void> {
	const user = prisma.user.deleteMany();
	const tweet = prisma.tweet.deleteMany();
	const like = prisma.like.deleteMany();
	await prisma.$transaction([user, tweet, like]);
}

function cleanDirectory() {
	fs.readdir(testDir, (err, files) => {
		for (const file of files) {
			if (extname(file)) {
				fs.unlinkSync(join(testDir, file));
			}
		}
	});
}

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

		cleanDirectory();

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
		cleanDirectory();
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
