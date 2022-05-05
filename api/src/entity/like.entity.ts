import { Like } from '@prisma/client';

export class LikeEntity implements Like {
	id: string;
	authorId: string;
	tweetId: string;
	createdAt: Date;

	constructor(like: Partial<Like>) {
		Object.assign(this, like);
	}
}
