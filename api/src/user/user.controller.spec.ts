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
import * as FormData from 'form-data';

describe('UserController', () => {
	let controller: UserController;
	let service: UserService;
	let auth: AuthService;
	let prisma: PrismaService;
	let app: INestApplication;

	async function generateUsers(total: number): Promise<User[]> {
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

	async function resetDatabase(): Promise<void> {
		const user = prisma.user.deleteMany();
		const tweet = prisma.tweet.deleteMany();
		const like = prisma.like.deleteMany();

		await prisma.$transaction([user, tweet, like]);
	}

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			imports: [UserModule, AuthModule],
		}).compile();

		controller = module.get<UserController>(UserController);
		service = module.get<UserService>(UserService);
		auth = module.get<AuthService>(AuthService);
		prisma = module.get<PrismaService>(PrismaService);

		app = module.createNestApplication();
		applyMiddleware(app);
		await app.init();
		await resetDatabase();
	});

	afterEach(async () => {
		await prisma.user.deleteMany();
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	it('GET /:username - authorized', async () => {
		const users: User[] = await generateUsers(2);

		const token = auth.generateToken(users[0]);
		const response: request.Response = await request(app.getHttpServer())
			.get(`/user/${users[1].username}`)
			.auth(token, { type: 'bearer' });
		expect(response.ok).toBe(true);
		expect(response.body.username).toBe(users[1].username);
	});

	it('GET /:username - unauthorized', async () => {
		const users: User[] = await generateUsers(2);

		const response = await request(app.getHttpServer()).get(
			`/user/${users[1].username}`,
		);
		expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
	});

	it('GET /:username - user does not exist', async () => {
		const users: User[] = await generateUsers(2);
		const token = auth.generateToken(users[0]);

		const response = await request(app.getHttpServer())
			.get(`/user/9fake_username`)
			.auth(token, { type: 'bearer' });
		expect(response.status).toBe(HttpStatus.NOT_FOUND);
	});

	it('PATCH /:username - without files', async () => {
		const users = await generateUsers(1);
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
