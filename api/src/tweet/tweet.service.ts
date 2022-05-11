import { Injectable } from '@nestjs/common';
import { Like, Prisma, Tweet } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTweetDto } from './dto/create.dto';
import { TweetRelationDto } from './dto/relation.dto';

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

	async getReplies(tweetId: string): Promise<Tweet[]> {
		const tweets = await this.prisma.tweet.findMany({
			orderBy: { createdAt: 'desc' },
			where: { isReply: true, replyId: tweetId },
			include: {
				author: true,
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

	async getRelations(
		tweetId: string,
		userId: string,
	): Promise<TweetRelationDto> {
		const like = await this.prisma.like.findFirst({
			where: { authorId: userId, tweetId: tweetId },
		});
		const reply = await this.prisma.tweet.findFirst({
			where: { authorId: userId, replyId: tweetId, isReply: true },
		});
		const retweet = await this.prisma.tweet.findFirst({
			where: { authorId: userId, tweetId: tweetId, isRetweet: true },
		});
		return { like: !!like, reply: !!reply, retweet: !!retweet };
	}

	async listTweets(username: string): Promise<Tweet[]> {
		const tweets = await this.prisma.tweet.findMany({
			where: { author: { username }, isReply: false },
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

	async listLikes(username: string): Promise<Like[]> {
		return await this.prisma.like.findMany({
			where: { author: { username } },
			include: {
				tweet: {
					include: {
						author: true,
						_count: { select: { likes: true, replies: true, retweets: true } },
					},
				},
			},
		});
	}

	async createReply(data: CreateTweetDto, authorId: string): Promise<Tweet> {
		return await this.prisma.tweet.create({
			data: {
				message: data.message,
				isReply: true,
				author: { connect: { id: authorId } },
				replyTo: { connect: { id: data.replyId } },
			},
			include: {
				author: true,
				tweet: true,
				_count: { select: { likes: true, replies: true, retweets: true } },
			},
		});
	}

	async create(data: CreateTweetDto, authorId: string): Promise<Tweet> {
		return await this.prisma.tweet.create({
			data: {
				message: data.message,
				author: { connect: { id: authorId } },
			},
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
