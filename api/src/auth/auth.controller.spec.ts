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
import { applyMiddleware } from '../utils/middleware';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './controller/auth.controller';
import { GoogleController } from './controller/google.controller';
import { GitHubController } from './controller/github.controller';
import { JwtStrategy } from './jwt.straregy';
import { JwtModule } from '@nestjs/jwt';
import { multerModuleFactory } from '../utils/modules';
import { cleanTestDir, getTestDir, resetDatabase } from '../utils/test';
import { join } from 'path';
import { readFileSync } from 'fs';

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
	avatar: null,
	background: null,
	location: null,
	bio: null,
};

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
			controllers: [AuthController, GoogleController, GitHubController],
			providers: [AuthService, JwtStrategy],
			imports: [
				PrismaModule,
				JwtModule.register({
					secret: process.env.SECRET_KEY,
					signOptions: { expiresIn: '24h' },
				}),
				multerModuleFactory('./upload/__test__'),
			],
			exports: [AuthService],
		}).compile();
		app = module.createNestApplication();
		applyMiddleware(app);
		await app.init();

		service = module.get<AuthService>(AuthService);
		prisma = module.get<PrismaService>(PrismaService);

		cleanTestDir();
		await resetDatabase(prisma);
	});

	beforeEach(async () => {
		user = await createUser(prisma, userData);
		token = service.generateToken(user);
	});

	afterEach(async () => {
		await resetDatabase(prisma);
		cleanTestDir();
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

	it('GET /lookup', async () => {
		let response: request.Response;

		response = await request(app.getHttpServer())
			.get('/auth/lookup')
			.query({ email: user.email });
		expect(response.status).toBe(200);
		expect(response.body.isAvailable).toBe(false);

		response = await request(app.getHttpServer())
			.get('/auth/lookup')
			.query({ email: '0' + user.email });
		expect(response.status).toBe(200);
		expect(response.body.isAvailable).toBe(true);

		response = await request(app.getHttpServer())
			.get('/auth/lookup')
			.query({ username: user.username });
		expect(response.status).toBe(200);
		expect(response.body.isAvailable).toBe(false);

		response = await request(app.getHttpServer())
			.get('/auth/lookup')
			.query({ username: '0' + user.username });
		expect(response.status).toBe(200);
		expect(response.body.isAvailable).toBe(true);

		response = await request(app.getHttpServer()).get('/auth/lookup');
		expect(response.status).toBe(400);
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

	it('POST /signup - avatar', async () => {
		const testDir = getTestDir();
		const sample = join(getTestDir(), 'sample', 'avatar.png');
		const payload = {
			name: 'name',
			email: 'sample@mail.com',
			username: 'username',
			password: 'password',
			birth: new Date().toJSON(),
		};
		const response = await request(app.getHttpServer())
			.post('/auth/signup')
			.field('name', payload.name)
			.field('email', payload.email)
			.field('username', payload.username)
			.field('password', payload.password)
			.field('birth', payload.birth)
			.attach('avatar', sample);
		expect(response.statusCode).toBe(201);
		const user = await prisma.user.findUnique({
			where: { username: payload.username },
		});
		expect(user.avatar).not.toBeNull();
		expect(readFileSync(join(testDir, user.avatar), 'base64')).toBe(
			readFileSync(sample, 'base64'),
		);
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
		applyMiddleware(app);
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
