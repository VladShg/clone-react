import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { TweetController } from './tweet.controller';
import { TweetService } from './tweet.service';
import { faker } from '@faker-js/faker';
import { Tweet, User } from '@prisma/client';
import { ExecutionContext, HttpStatus, INestApplication } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateTweetDto } from './dto/create.dto';
import { DeleteTweetDto } from './dto/delete.dto';

describe('TweetController', () => {
	let controller: TweetController;
	let service: TweetService;
	let prisma: PrismaService;
	let user: User;
	let app: INestApplication;
	const userData: User = {
		id: faker.datatype.uuid(),
		name: faker.name.firstName(),
		email: faker.internet.email(),
		username: faker.name.lastName(),
		gitHubId: null,
		googleId: null,
		password: faker.random.alpha(10),
		birth: new Date(),
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	async function resetDatabase(): Promise<void> {
		const user = prisma.user.deleteMany();
		const tweet = prisma.tweet.deleteMany();
		const like = prisma.like.deleteMany();

		await prisma.$transaction([user, tweet, like]);
	}

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			imports: [PrismaModule],
			controllers: [TweetController],
			providers: [TweetService],
		})
			.overrideGuard(AuthGuard('jwt'))
			.useValue({
				canActivate: function (context: ExecutionContext): boolean {
					const request = context.switchToHttp().getRequest();
					request.user = userData;
					return true;
				},
			})
			.compile();

		controller = module.get<TweetController>(TweetController);
		service = module.get<TweetService>(TweetService);
		prisma = module.get<PrismaService>(PrismaService);

		app = module.createNestApplication();
		await app.init();
		await resetDatabase();
	});

	beforeEach(async () => {
		user = await prisma.user.create({ data: userData });
	});

	afterEach(async () => {
		await resetDatabase();
	});

	afterAll(async () => {
		await app.close();
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
		expect(service).toBeDefined();
		expect(prisma).toBeDefined();
	});

	it('GET /', async () => {
		const tweet = await service.create(
			{ message: faker.random.words(5) },
			user.id,
		);
		return request(app.getHttpServer())
			.get(`/tweet/${tweet.id}`)
			.expect(200)
			.expect(JSON.stringify(await service.get(tweet.id)));
	});

	it('GET /feed', async () => {
		const tweets = [];
		for (let i = 0; i < 10; i++) {
			tweets.unshift(
				await service.create({ message: faker.random.words(5) }, user.id),
			);
		}
		return request(app.getHttpServer())
			.get(`/tweet/feed`)
			.expect(200)
			.expect(JSON.stringify(tweets));
	});

	it('DELETE /tweet', async () => {
		const tweet = await service.create(
			{ message: faker.random.words(5) },
			user.id,
		);

		const payload: DeleteTweetDto = {
			id: tweet.id,
		};
		return request(app.getHttpServer())
			.delete(`/tweet/`)
			.send(payload)
			.expect(200);
	});

	it('CREATE /tweet', async () => {
		const payload: CreateTweetDto = {
			message: faker.random.words(5),
		};
		const create: request.Response = await request(app.getHttpServer())
			.post('/tweet/')
			.send(payload);
		const tweet: Tweet = create.body;
		expect(create.status).toEqual(HttpStatus.CREATED);
		const get: request.Response = await request(app.getHttpServer())
			.get(`/tweet/${tweet.id}`)
			.expect(HttpStatus.OK);
		expect(create.body.message).toEqual(get.body.message);
	});

	it('GET /replies - tweet', async () => {
		const REPLIES_COUNT = 10;
		const withReplies = await service.create(
			{ message: faker.random.words(5) },
			user.id,
		);
		for (let i = 0; i < REPLIES_COUNT; i++) {
			await service.reply(
				{ message: faker.random.words(5), replyId: withReplies.id },
				user.id,
			);
		}
		const withoutReplies = await service.create(
			{ message: faker.random.words(5) },
			user.id,
		);
		const withRepliesRequest = await request(app.getHttpServer())
			.get(`/tweet/replies`)
			.query({ tweetId: withReplies.id });
		const withoutRepliesRequest = await request(app.getHttpServer())
			.get(`/tweet/replies`)
			.query({ tweetId: withoutReplies.id });
		expect(withRepliesRequest.status).toBe(200);
		expect(withoutRepliesRequest.status).toBe(200);
		expect(withRepliesRequest.body.length).toBe(REPLIES_COUNT);
		expect(withoutRepliesRequest.body.length).toBe(0);
	});

	it('GET /replies - username', async () => {
		const REPLIES_COUNT = 10;
		const withoutReplies = await prisma.user.create({
			data: {
				...userData,
				email: faker.internet.email(),
				username: faker.random.alpha(10),
				id: faker.datatype.uuid(),
			},
		});
		let tweet = await service.create(
			{ message: faker.random.words(5) },
			withoutReplies.id,
		);
		for (let i = 0; i < 10; i++) {
			await service.reply(
				{
					message: faker.random.words(REPLIES_COUNT),
					replyId: tweet.id,
				},
				user.id,
			);
		}
		const withRepliesRequest = await request(app.getHttpServer())
			.get(`/tweet/replies`)
			.query({ username: user.username });
		const withoutRepliesRequest = await request(app.getHttpServer())
			.get(`/tweet/replies`)
			.query({ username: withoutReplies.username });
		expect(withRepliesRequest.status).toBe(200);
		expect(withoutRepliesRequest.status).toBe(200);
		expect(withRepliesRequest.body.length).toBe(REPLIES_COUNT);
		expect(withoutRepliesRequest.body.length).toBe(0);
	});
});
