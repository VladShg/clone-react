import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LikeEntity } from 'src/entity/like.entity';
import { TweetEntity } from 'src/entity/tweet.entity';
import { RequestWithUser } from 'src/types/RequestWithUser';
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

	@Get('/:username/tweets')
	@UseGuards(AuthGuard('jwt'))
	async getTweets(@Param('username') username: string): Promise<TweetEntity[]> {
		const tweets = await this.tweetService.listTweets(username);
		return tweets.map((tweet) => new TweetEntity(tweet));
	}

	@Get('/:username/likes')
	@UseGuards(AuthGuard('jwt'))
	async getLikes(@Param('username') username: string): Promise<TweetEntity[]> {
		const tweets = await this.tweetService.listLikes(username);
		return tweets.map((tweet) => new TweetEntity(tweet));
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
		const tweet = await this.tweetService.create({
			...body,
			author: { connect: { id: userId } },
		});
		return new TweetEntity(tweet);
	}

	@Post('/like')
	@UseGuards(AuthGuard('jwt'))
	async likeTweet(
		@Body() body: LikeTweetDto,
		@Req() request: RequestWithUser,
	): Promise<LikeEntity> {
		const userId: string = request.user.id;
		const like = await this.tweetService.like({ id: userId }, body);
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
