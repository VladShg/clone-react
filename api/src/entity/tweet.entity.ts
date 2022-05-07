import { Tweet } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { IsNumber, IsString, ValidateNested } from 'class-validator';
import { UserEntity } from './user.entity';

export class TweetEntity implements Tweet {
	id: string;
	authorId: string;
	message: string | null;
	isRetweet: boolean;
	retweetId: string | null;
	isReply: boolean;
	replyId: string | null;
	createdAt: Date;
	updatedAt: Date;

	@IsNumber()
	likes: number | null;

	@IsNumber()
	replies: number | null;

	@IsNumber()
	retweets: number | null;

	@ValidateNested()
	@Type(() => UserEntity)
	author: UserEntity;

	@ValidateNested()
	@Type(() => TweetEntity)
	tweet: TweetEntity | null;

	@IsString()
	tweetId: string | null;

	@Expose({ name: 'count' })
	_count: object;

	constructor(tweet: Partial<Tweet>) {
		Object.assign(this, tweet);
	}
}
