import { Prisma } from '@prisma/client';

const tweetWithRelation = Prisma.validator<Prisma.TweetArgs>()({
	include: {
		_count: { select: { likes: true, replies: true, retweets: true } },
	},
});

export type TweetWithRelation = Prisma.TweetGetPayload<
	typeof tweetWithRelation
>;
