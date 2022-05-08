import { Like } from '@prisma/client';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { TweetEntity } from './tweet.entity';

export class LikeEntity implements Like {
	id: string;
	authorId: string;
	tweetId: string;
	createdAt: Date;

	@ValidateNested()
	@Type(() => TweetEntity)
	tweet: TweetEntity;

	constructor(like: Partial<Like>) {
		Object.assign(this, like);
	}
}
