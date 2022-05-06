import { Injectable } from '@nestjs/common';
import { Like, Prisma, Tweet } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TweetService {
	constructor(private prisma: PrismaService) {}

	async feed(): Promise<Tweet[]> {
		const tweets = await this.prisma.tweet.findMany({
			take: 20,
			orderBy: { createdAt: 'desc' },
			include: {
				author: true,
				tweet: {
					include: {
						author: true,
						_count: { select: { likes: true, replies: true, retweets: true } },
					},
				},
				_count: { select: { likes: true, replies: true, retweets: true } },
			},
		});
		return tweets;
	}

	async get(where: Prisma.TweetWhereUniqueInput): Promise<Tweet> {
		return await this.prisma.tweet.findUnique({
			where: where,
			include: {
				author: true,
				tweet: {
					include: {
						author: true,
						_count: { select: { likes: true, replies: true, retweets: true } },
					},
				},
				_count: { select: { likes: true, replies: true, retweets: true } },
			},
		});
	}

	async create(data: Prisma.TweetCreateInput): Promise<Tweet> {
		return await this.prisma.tweet.create({
			data,
			include: {
				author: true,
				tweet: true,
				_count: { select: { likes: true, replies: true, retweets: true } },
			},
		});
	}

	async delete(where: Prisma.TweetWhereUniqueInput): Promise<Tweet> {
		return await this.prisma.tweet.delete({ where: where });
	}

	async like(
		author: Prisma.UserWhereUniqueInput,
		tweet: Prisma.TweetWhereUniqueInput,
	): Promise<Like | null> {
		const like = await this.prisma.like.findFirst({
			where: { author: author, tweet: tweet },
		});
		if (like) {
			await this.prisma.like.delete({ where: { id: like.id } });
			return null;
		} else {
			return await this.prisma.like.create({
				data: { authorId: author.id, tweetId: tweet.id },
			});
		}
	}

	async retweet(
		authorId: string,
		tweetId: string,
	): Promise<Tweet & { tweet: Tweet }> {
		const retweet = await this.prisma.tweet.findFirst({
			where: { authorId: authorId, isRetweet: true, tweetId: tweetId },
		});
		if (retweet) {
			await this.prisma.tweet.delete({ where: { id: retweet.id } });
			return null;
		} else {
			const retweet = await this.prisma.tweet.create({
				data: { authorId: authorId, tweetId: tweetId, isRetweet: true },
				include: {
					author: true,
					tweet: {
						include: {
							author: true,
							_count: {
								select: { likes: true, replies: true, retweets: true },
							},
						},
					},
				},
			});
			return retweet;
		}
	}
}
