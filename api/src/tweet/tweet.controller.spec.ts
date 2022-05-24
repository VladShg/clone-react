import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { TweetController } from './tweet.controller';
import { TweetService } from './tweet.service';
import { faker } from '@faker-js/faker';
import { Tweet, User } from '@prisma/client';
import { ExecutionContext, HttpStatus, INestApplication } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateTweetDto } from './dto/create.dto';
import { DeleteTweetDto } from './dto/delete.dto';
import { ReplyDto } from './dto/reply.dto';
import { LikeTweetDto } from './dto/like.dto';
import { RetweetDto } from './dto/retweet.dto';
import { TweetModule } from './tweet.module';
import { applyMiddleware } from '../utils/middleware';

describe('TweetController', () => {
	let controller: TweetController;
	let service: TweetService;
	let prisma: PrismaService;
	let user: User;
	let tweet: Tweet;
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
		avatar: null,
		background: null,
		location: null,
		bio: null,
	};

	async function resetDatabase(): Promise<void> {
		const user = prisma.user.deleteMany();
		const tweet = prisma.tweet.deleteMany();
		const like = prisma.like.deleteMany();

		await prisma.$transaction([user, tweet, like]);
	}

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			imports: [TweetModule],
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
		applyMiddleware(app);
		await app.init();
		await resetDatabase();
	});

	beforeEach(async () => {
		user = await prisma.user.create({ data: userData });
		tweet = await service.create({ message: faker.random.word() }, user.id);
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

	it('GET /:id', async () => {
		const response = await request(app.getHttpServer()).get(
			`/tweet/${tweet.id}`,
		);
		expect(response.status).toBe(200);
		expect(response.body.message).toBe((await service.get(tweet.id)).message);
	});

	it('DELETE /', async () => {
		const payload: DeleteTweetDto = {
			id: tweet.id,
		};
		return request(app.getHttpServer())
			.delete(`/tweet/`)
			.send(payload)
			.expect(200);
	});

	it('POST /', async () => {
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

	it('GET /feed', async () => {
		const FEED_COUNT = 10;
		for (let i = 0; i < FEED_COUNT; i++) {
			await service.create({ message: faker.random.word() }, user.id);
		}
		const response = await request(app.getHttpServer()).get(`/tweet/feed`);
		expect(response.status).toBe(HttpStatus.OK);
		expect(response.body.length).toBe(FEED_COUNT + 1);
	});

	it('GET /replies - tweet', async () => {
		let response: request.Response;
		const REPLIES_COUNT = 10;
		response = await request(app.getHttpServer())
			.get(`/tweet/replies`)
			.query({ tweetId: tweet.id });
		expect(response.status).toBe(HttpStatus.OK);
		expect(response.body.length).toBe(0);

		for (let i = 0; i < REPLIES_COUNT; i++) {
			await service.reply(
				{ message: faker.random.word(), replyId: tweet.id },
				user.id,
			);
		}
		response = await request(app.getHttpServer())
			.get(`/tweet/replies`)
			.query({ tweetId: tweet.id });
		expect(response.status).toBe(HttpStatus.OK);
		expect(response.body.length).toBe(REPLIES_COUNT);
	});

	it('GET /replies - user', async () => {
		let response: request.Response;
		const REPLIES_COUNT = 10;
		response = await request(app.getHttpServer())
			.get(`/tweet/replies`)
			.query({ username: user.username });
		expect(response.status).toBe(HttpStatus.OK);
		expect(response.body.length).toBe(0);

		for (let i = 0; i < REPLIES_COUNT; i++) {
			await service.reply(
				{ message: faker.random.word(), replyId: tweet.id },
				user.id,
			);
		}
		response = await request(app.getHttpServer())
			.get(`/tweet/replies`)
			.query({ username: user.username });
		expect(response.status).toBe(HttpStatus.OK);
		expect(response.body.length).toBe(REPLIES_COUNT);
	});

	it('GET /tweeets - user', async () => {
		let response: request.Response;
		const TWEET_COUNT = 10;

		response = await request(app.getHttpServer())
			.get(`/tweet/tweets`)
			.query({ username: user.username });
		expect(response.status).toBe(HttpStatus.OK);
		expect(response.body.length).toBe(1);

		for (let i = 0; i < TWEET_COUNT; i++) {
			await service.create({ message: faker.random.word() }, user.id);
		}

		response = await request(app.getHttpServer())
			.get(`/tweet/tweets`)
			.query({ username: user.username });
		expect(response.status).toBe(HttpStatus.OK);
		expect(response.body.length).toBe(TWEET_COUNT + 1);
	});

	it('GET /likes - user', async () => {
		let response: request.Response;
		const LIKES_COUNT = 10;

		response = await request(app.getHttpServer())
			.get(`/tweet/likes`)
			.query({ username: user.username });
		expect(response.status).toBe(HttpStatus.OK);
		expect(response.body.length).toBe(0);

		for (let i = 0; i < LIKES_COUNT; i++) {
			const tweet = await service.create(
				{ message: faker.random.word() },
				user.id,
			);
			await service.like(user.id, tweet.id);
		}

		response = await request(app.getHttpServer())
			.get(`/tweet/likes`)
			.query({ username: user.username });
		expect(response.status).toBe(HttpStatus.OK);
		expect(response.body.length).toBe(LIKES_COUNT);
	});

	it('POST /reply', async () => {
		const payload: ReplyDto = {
			message: faker.random.word(),
			replyId: tweet.id,
		};
		const response = await request(app.getHttpServer())
			.post('/tweet/reply')
			.send(payload);
		expect(response.status).toBe(HttpStatus.CREATED);
		expect(response.body.message).toBe(payload.message);
		expect((await service.get(tweet.id))._count.replies).toBe(1);
	});

	it('POST /like', async () => {
		const payload: LikeTweetDto = { id: tweet.id };
		let response = await request(app.getHttpServer())
			.post('/tweet/like')
			.send(payload);
		expect(response.status).toBe(HttpStatus.CREATED);
		expect(response.body.tweetId).toBe(tweet.id);
		expect((await service.get(tweet.id))._count.likes).toBe(1);
		response = await request(app.getHttpServer())
			.post('/tweet/like')
			.send(payload);
		expect(response.status).toBe(HttpStatus.NO_CONTENT);
		expect((await service.get(tweet.id))._count.likes).toBe(0);
	});

	it('POST /retweet', async () => {
		const payload: RetweetDto = { id: tweet.id };
		let response = await request(app.getHttpServer())
			.post('/tweet/retweet')
			.send(payload);
		expect(response.status).toBe(HttpStatus.CREATED);
		expect(response.body.tweetId).toBe(tweet.id);
		expect((await service.get(tweet.id))._count.retweets).toBe(1);
		response = await request(app.getHttpServer())
			.post('/tweet/retweet')
			.send(payload);
		expect(response.status).toBe(HttpStatus.NO_CONTENT);
		expect((await service.get(tweet.id))._count.retweets).toBe(0);
	});

	it('GET /:tweetId/relations', async () => {
		let response: request.Response;

		response = await request(app.getHttpServer()).get(
			`/tweet/${tweet.id}/relations`,
		);
		expect(response.body).toMatchObject({
			like: false,
			retweet: false,
			reply: false,
		});

		await service.like(user.id, tweet.id);
		await service.retweet(user.id, tweet.id);
		await service.reply(
			{ message: faker.random.word(), replyId: tweet.id },
			user.id,
		);
		response = await request(app.getHttpServer()).get(
			`/tweet/${tweet.id}/relations`,
		);
		expect(response.body).toMatchObject({
			like: true,
			retweet: true,
			reply: true,
		});
	});
});
