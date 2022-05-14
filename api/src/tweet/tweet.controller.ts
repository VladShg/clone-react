import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Post,
	Query,
	Req,
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Tweet } from '@prisma/client';
import { LikeEntity } from '../entity/like.entity';
import { TweetEntity } from '../entity/tweet.entity';
import { RequestWithUser } from '../types/RequestWithUser';
import { CreateTweetDto } from './dto/create.dto';
import { DeleteTweetDto } from './dto/delete.dto';
import { LikeTweetDto } from './dto/like.dto';
import { TweetRelationDto } from './dto/relation.dto';
import { RetweetDto } from './dto/retweet.dto';
import { TweetService } from './tweet.service';

@Controller('tweet')
export class TweetController {
	constructor(private tweetService: TweetService) {}

	@Get('/feed')
	@UseGuards(AuthGuard('jwt'))
	async getFeed(): Promise<TweetEntity[]> {
		const tweets = await this.tweetService.feed();
		return tweets.map((tweet) => new TweetEntity(tweet));
	}

	@Get('/tweets')
	@UseGuards(AuthGuard('jwt'))
	async getTweets(
		@Query('username') username: string | null,
	): Promise<TweetEntity[]> {
		let tweets: Tweet[];
		if (username) {
			tweets = await this.tweetService.listTweets(username);
		}
		return tweets.map((tweet) => new TweetEntity(tweet));
	}

	@Get('/likes')
	@UseGuards(AuthGuard('jwt'))
	async getLikes(
		@Query('username') username: string | null,
	): Promise<TweetEntity[]> {
		const tweets = await this.tweetService.listLikes(username);
		return tweets.map((tweet) => new TweetEntity(tweet));
	}

	@Get('/replies')
	@UseGuards(AuthGuard('jwt'))
	async getReplies(
		@Query('username') username: string | null,
		@Query('tweetId') tweetId: string | null,
	): Promise<TweetEntity[]> {
		let tweets: Tweet[];
		if (username) {
			tweets = await this.tweetService.getReplies({ author: { username } });
		} else {
			tweets = await this.tweetService.getReplies({ replyId: tweetId });
		}
		return tweets.map((tweet) => new TweetEntity(tweet));
	}

	@Get('/:tweetId/relations')
	@UseGuards(AuthGuard('jwt'))
	async getRelations(
		@Param('tweetId') tweetId: string,
		@Req() request: RequestWithUser,
	): Promise<TweetRelationDto> {
		return await this.tweetService.getRelations(tweetId, request.user.id);
	}

	@Get('/:id')
	@UseGuards(AuthGuard('jwt'))
	async getTweet(@Param('id') id: string): Promise<TweetEntity> {
		const tweet = await this.tweetService.get({ id: id });
		return new TweetEntity(tweet);
	}

	@Delete('/')
	@UseGuards(AuthGuard('jwt'))
	async deleteTweet(@Body() body: DeleteTweetDto): Promise<TweetEntity> {
		const tweet = await this.tweetService.delete(body);
		return new TweetEntity(tweet);
	}

	@Post('/')
	@UseGuards(AuthGuard('jwt'))
	async createTweet(
		@Body() body: CreateTweetDto,
		@Req() req: RequestWithUser,
	): Promise<TweetEntity> {
		const userId: string = req.user.id;
		let tweet: Tweet;
		if (body.replyId) {
			tweet = await this.tweetService.createReply(body, userId);
		} else {
			tweet = await this.tweetService.create(body, userId);
		}
		return new TweetEntity(tweet);
	}

	@Post('/like')
	@UseGuards(AuthGuard('jwt'))
	async likeTweet(
		@Body() body: LikeTweetDto,
		@Req() request: RequestWithUser,
	): Promise<LikeEntity> {
		const like = await this.tweetService.like(request.user.username, body.id);
		if (!like) {
			throw new HttpException({}, HttpStatus.NO_CONTENT);
		} else {
			return new LikeEntity(like);
		}
	}

	@Post('/retweet')
	@UseGuards(AuthGuard('jwt'))
	async retweet(
		@Body() body: RetweetDto,
		@Req() request: RequestWithUser,
	): Promise<TweetEntity> {
		const retweet = await this.tweetService.retweet(request.user.id, body.id);
		if (!retweet) {
			throw new HttpException({}, HttpStatus.NO_CONTENT);
		} else {
			return new TweetEntity(retweet);
		}
	}
}
