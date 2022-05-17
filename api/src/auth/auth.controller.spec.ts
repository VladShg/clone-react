import { User } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { hashPassword } from '../utils/bcrypt';
import { LoginByCredentialsDto } from './dto/login-credentials.dto';
import { SignUpDto } from './dto/signup.dto';
import { AuthModule } from './auth.module';
import { GoogleTokenDto } from './dto/google-token.dto';
import { GitHubCodeDto } from './dto/github-code.dto';

const userData: User = {
	id: faker.datatype.uuid(),
	name: faker.name.firstName(),
	email: faker.internet.email(),
	username: faker.name.lastName(),
	gitHubId: Number.parseInt(faker.random.numeric(10)),
	googleId: faker.datatype.uuid(),
	password: 'password',
	birth: new Date(),
	createdAt: new Date(),
	updatedAt: new Date(),
};

async function resetDatabase(prisma: PrismaService) {
	await prisma.$transaction([
		prisma.user.deleteMany(),
		prisma.like.deleteMany(),
		prisma.tweet.deleteMany(),
	]);
}
async function createUser(prisma: PrismaService, data: User): Promise<User> {
	return await prisma.user.create({
		data: {
			...data,
			password: await hashPassword(data.password),
		},
	});
}

describe('AuthController', () => {
	let service: AuthService;
	let app: INestApplication;
	let prisma: PrismaService;
	let user: User;
	let token: string;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [AuthModule],
		}).compile();
		app = module.createNestApplication();
		await app.init();

		service = module.get<AuthService>(AuthService);
		prisma = module.get<PrismaService>(PrismaService);

		await resetDatabase(prisma);
	});

	beforeEach(async () => {
		user = await createUser(prisma, userData);
		token = service.generateToken(user);
	});

	afterEach(async () => {
		await resetDatabase(prisma);
	});

	afterAll(async () => {
		await app.close();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('POST /login', async () => {
		let payload: LoginByCredentialsDto = {
			login: user.email,
			password: userData.password,
		};
		let response: request.Response = await request(app.getHttpServer())
			.post('/auth/login')
			.send(payload);
		expect(response.ok).toBe(true);

		payload = {
			login: user.email,
			password: 'wrong password',
		};
		response = await request(app.getHttpServer())
			.post('/auth/login')
			.send(payload);
		expect(response.ok).toBe(false);
	});

	it('GET /account', async () => {
		let response: request.Response = await request(app.getHttpServer())
			.get('/auth/account')
			.auth(token, { type: 'bearer' });
		expect(response.ok).toBe(true);
		expect(response.body.id).toBe(user.id);

		response = await request(app.getHttpServer())
			.get('/auth/account')
			.auth('wrong token', { type: 'bearer' });
		expect(response.ok).toBe(false);
	});

	it('POST /signup', async () => {
		let response: request.Response;
		const payload: SignUpDto = {
			name: 'name',
			email: 'sample@mail.com',
			username: 'username',
			password: 'password',
			birth: new Date().toJSON(),
			gitHubId: null,
			googleId: null,
		};
		response = await request(app.getHttpServer())
			.post('/auth/signup')
			.send(payload);
		expect(response.statusCode).toBe(201);
		const userToken = response.body.accessToken;

		response = await request(app.getHttpServer())
			.get('/auth/account')
			.auth(userToken, { type: 'bearer' });
		expect(response.ok).toBe(true);
		expect(response.body.name).toBe(payload.name);

		response = await request(app.getHttpServer())
			.post('/auth/signup')
			.send(payload);
		expect(response.ok).toBe(false);
	});
});

describe('AuthController - social', () => {
	let service: AuthService;
	let app: INestApplication;
	let prisma: PrismaService;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [AuthModule],
		}).compile();
		app = module.createNestApplication();
		await app.init();

		service = module.get<AuthService>(AuthService);
		prisma = module.get<PrismaService>(PrismaService);

		const mock = {
			getGoogleUser: async () => {
				return { id: userData.googleId };
			},
			getGitHubUser: async () => {
				return { id: userData.gitHubId };
			},
		};

		jest.spyOn(service, 'getGitHubUser').mockImplementation(mock.getGitHubUser);
		jest.spyOn(service, 'getGoogleUser').mockImplementation(mock.getGoogleUser);
		await resetDatabase(prisma);
	});

	beforeEach(async () => {
		await createUser(prisma, userData);
	});

	afterEach(async () => {
		await resetDatabase(prisma);
	});

	afterAll(async () => {
		await app.close();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('POST /google/login', async () => {
		const payload: GoogleTokenDto = {
			token: 'mock token',
		};

		let response = await request(app.getHttpServer())
			.post('/auth/google/login')
			.send(payload);
		expect(response.statusCode).toBe(201);
		expect(response.body.accessToken).toBeDefined();

		response = await request(app.getHttpServer())
			.get('/auth/account')
			.auth(response.body.accessToken, { type: 'bearer' });
		expect(response.statusCode).toBe(200);
		expect(response.body.id).toBe(userData.id);
	});

	it('GET /google/connect', async () => {
		const payload: GoogleTokenDto = {
			token: 'mock token',
		};

		let response = await request(app.getHttpServer())
			.post('/auth/google/connect')
			.send(payload);
		expect(response.statusCode).toBe(409);

		await prisma.user.deleteMany();

		response = await request(app.getHttpServer())
			.post('/auth/google/connect')
			.send(payload);
		expect(response.statusCode).toBe(201);
	});

	it('POST /github/login', async () => {
		const payload: GitHubCodeDto = {
			code: 'mock code',
		};

		let response = await request(app.getHttpServer())
			.post('/auth/github/login')
			.send(payload);
		expect(response.statusCode).toBe(201);
		expect(response.body.accessToken).toBeDefined();

		response = await request(app.getHttpServer())
			.get('/auth/account')
			.auth(response.body.accessToken, { type: 'bearer' });
		expect(response.statusCode).toBe(200);
		expect(response.body.id).toBe(userData.id);
	});

	it('GET /github/connect', async () => {
		const payload: GitHubCodeDto = {
			code: 'mock code',
		};

		let response = await request(app.getHttpServer())
			.post('/auth/github/connect')
			.send(payload);
		expect(response.statusCode).toBe(409);

		await prisma.user.deleteMany();

		response = await request(app.getHttpServer())
			.post('/auth/github/connect')
			.send(payload);
		expect(response.statusCode).toBe(201);
	});
});
