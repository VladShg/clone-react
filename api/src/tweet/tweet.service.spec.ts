import { Test, TestingModule } from '@nestjs/testing';
import { Tweet, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { TweetService } from './tweet.service';
import { faker } from '@faker-js/faker';
import { TweetModule } from './tweet.module';

describe('TweetService', () => {
	let service: TweetService;
	let prisma: PrismaService;
	let tweet: Tweet;
	let users: User[] = [];

	async function resetDatabase() {
		const user = prisma.user.deleteMany();
		const tweet = prisma.tweet.deleteMany();
		const like = prisma.like.deleteMany();

		await prisma.$transaction([user, tweet, like]);
	}

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [TweetModule],
		}).compile();

		service = module.get<TweetService>(TweetService);
		prisma = module.get<PrismaService>(PrismaService);

		await resetDatabase();
	});

	beforeEach(async () => {
		users = [];
		tweet = null;
		for (let i = 0; i < 10; i++) {
			users.push(
				await prisma.user.create({
					data: {
						name: faker.name.firstName() + ' ' + faker.name.lastName(),
						username: faker.random.alpha(10),
						email: faker.internet.email(),
						birth: new Date(),
					},
				}),
			);
		}
		tweet = await prisma.tweet.create({
			data: {
				authorId: users[users.length - 1].id,
				message: faker.random.words(5),
			},
		});
	});

	afterEach(async () => {
		return resetDatabase();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
		expect(prisma).toBeDefined();
	});

	it('should return feed', async () => {
		expect(async () => await service.feed()).not.toThrowError();
		expect((await service.feed()).length).toBe(1);
	});

	it('should return replies', async () => {
		const replies: Tweet[] = [];
		for (let i = 0; i < 5; i++) {
			replies.push(
				await service.reply(
					{ message: faker.random.words(5), replyId: tweet.id },
					users[i].id,
				),
			);
		}
		expect((await service.getReplies({ replyId: tweet.id })).length).toBe(5);
		for (const reply of replies) {
			expect((await service.getReplies({ replyId: reply.id })).length).toBe(0);
		}
	});

	it('should add and remove likes', async () => {
		const user = users[0];
		await service.like(user.id, tweet.id);
		expect((await service.get(tweet.id))._count.likes).toBe(1);
		await service.like(user.id, tweet.id);
		expect((await service.get(tweet.id))._count.likes).toBe(0);
	});

	it('should make and cancel retweets', async () => {
		const user = users[0];
		await service.retweet(user.id, tweet.id);
		expect((await service.get(tweet.id))._count.retweets).toBe(1);
		await service.retweet(user.id, tweet.id);
		expect((await service.get(tweet.id))._count.retweets).toBe(0);
	});

	it('should count tweet relations', async () => {
		for (let i = 0; i < 5; i++) {
			const user = users[i];
			await service.like(user.id, tweet.id);
			await service.retweet(user.id, tweet.id);
			await service.reply(
				{ message: `reply ${i}`, replyId: tweet.id },
				user.id,
			);
		}

		const count = (await service.get(tweet.id))._count;
		expect(count.likes).toBe(5);
		expect(count.replies).toBe(5);
		expect(count.retweets).toBe(5);
	});

	it('should count user and tweet relations', async () => {
		for (let i = 0; i < 5; i++) {
			const user = users[i];
			await service.like(user.id, tweet.id);
			await service.retweet(user.id, tweet.id);
			await service.reply(
				{ message: `reply ${i}`, replyId: tweet.id },
				user.id,
			);
		}

		for (let i = 0; i < 5; i++) {
			const relations = await service.getRelations(tweet.id, users[i].id);
			expect(relations.like).toBe(true);
			expect(relations.reply).toBe(true);
			expect(relations.retweet).toBe(true);
		}
		for (let i = 5; i < 10; i++) {
			const relations = await service.getRelations(tweet.id, users[i].id);
			expect(relations.like).toBe(false);
			expect(relations.reply).toBe(false);
			expect(relations.retweet).toBe(false);
		}
	});
});
