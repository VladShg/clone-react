import { Injectable } from '@nestjs/common';
import { Like, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { TweetWithRelation } from '../types/TweetWithRelation';
import { CreateTweetDto } from './dto/create.dto';
import { TweetRelationDto } from './dto/relation.dto';

@Injectable()
export class TweetService {
	constructor(private prisma: PrismaService) {}

	tweetIncludes = {
		author: true,
		replyTo: {
			include: {
				author: true,
				_count: { select: { likes: true, replies: true, retweets: true } },
			},
		},
		tweet: {
			include: {
				author: true,
				_count: { select: { likes: true, replies: true, retweets: true } },
			},
		},
		_count: { select: { likes: true, replies: true, retweets: true } },
	};

	async feed(): Promise<TweetWithRelation[]> {
		const tweets = await this.prisma.tweet.findMany({
			take: 20,
			where: { isReply: false },
			orderBy: { createdAt: 'desc' },
			include: this.tweetIncludes,
		});
		return tweets;
	}

	async getReplies(
		where: Prisma.TweetWhereInput,
	): Promise<TweetWithRelation[]> {
		const tweets = await this.prisma.tweet.findMany({
			orderBy: { createdAt: 'desc' },
			where: { isReply: true, ...where },
			include: this.tweetIncludes,
		});
		return tweets;
	}

	async get(where: Prisma.TweetWhereUniqueInput): Promise<TweetWithRelation> {
		return await this.prisma.tweet.findUnique({
			where: where,
			include: this.tweetIncludes,
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

	async listTweets(username: string): Promise<TweetWithRelation[]> {
		const tweets = await this.prisma.tweet.findMany({
			where: { author: { username }, isReply: false },
			orderBy: { createdAt: 'desc' },
			include: this.tweetIncludes,
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

	async createReply(
		data: CreateTweetDto,
		authorId: string,
	): Promise<TweetWithRelation> {
		return await this.prisma.tweet.create({
			data: {
				message: data.message,
				isReply: true,
				author: { connect: { id: authorId } },
				replyTo: { connect: { id: data.replyId } },
			},
			include: this.tweetIncludes,
		});
	}

	async create(
		data: CreateTweetDto,
		authorId: string,
	): Promise<TweetWithRelation> {
		return await this.prisma.tweet.create({
			data: {
				message: data.message,
				author: { connect: { id: authorId } },
			},
			include: this.tweetIncludes,
		});
	}

	async delete(
		where: Prisma.TweetWhereUniqueInput,
	): Promise<TweetWithRelation> {
		return await this.prisma.tweet.delete({
			where: where,
			include: this.tweetIncludes,
		});
	}

	async like(username: string, tweetId: string): Promise<Like | null> {
		const author = await this.prisma.user.findUnique({ where: { username } });
		const like = await this.prisma.like.findFirst({
			where: { author: { id: author.id }, tweetId: tweetId },
		});
		if (like) {
			await this.prisma.like.delete({ where: { id: like.id } });
			return null;
		} else {
			return await this.prisma.like.create({
				data: { authorId: author.id, tweetId: tweetId },
			});
		}
	}

	async retweet(authorId: string, tweetId: string): Promise<TweetWithRelation> {
		const retweet = await this.prisma.tweet.findFirst({
			where: { authorId: authorId, isRetweet: true, tweetId: tweetId },
		});
		if (retweet) {
			await this.prisma.tweet.delete({ where: { id: retweet.id } });
			return null;
		} else {
			const retweet = await this.prisma.tweet.create({
				data: { authorId: authorId, tweetId: tweetId, isRetweet: true },
				include: this.tweetIncludes,
			});
			return retweet;
		}
	}
}
