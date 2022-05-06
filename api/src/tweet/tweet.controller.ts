import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Post,
	Req,
	UseGuards,
	UseInterceptors,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LikeEntity } from 'src/entity/like.entity';
import { TweetEntity } from 'src/entity/tweet.entity';
import { RequestWithUser } from 'src/types/RequestWithUser';
import { CreateTweetDto } from './dto/create.dto';
import { DeleteTweetDto } from './dto/delete.dto';
import { LikeTweetDto } from './dto/like.dto';
import { RetweetDto } from './dto/retweet.dto';
import { TweetService } from './tweet.service';

@Controller('tweet')
export class TweetController {
	constructor(private tweetService: TweetService) {}

	@Get('/feed')
	@UseGuards(AuthGuard('jwt'))
	@UseInterceptors(ClassSerializerInterceptor)
	@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
	async getFeed(): Promise<TweetEntity[]> {
		const tweets = await this.tweetService.feed();
		return tweets.map((tweet) => new TweetEntity(tweet));
	}

	@Get('/:id')
	@UseGuards(AuthGuard('jwt'))
	@UseInterceptors(ClassSerializerInterceptor)
	@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
	async getTweet(@Param('id') id: string): Promise<TweetEntity> {
		const tweet = await this.tweetService.get({ id: id });
		return new TweetEntity(tweet);
	}

	@Delete('/')
	@UseGuards(AuthGuard('jwt'))
	@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
	async deleteTweet(@Body() body: DeleteTweetDto): Promise<TweetEntity> {
		const tweet = await this.tweetService.delete(body);
		return new TweetEntity(tweet);
	}

	@Post('/')
	@UseGuards(AuthGuard('jwt'))
	@UseInterceptors(ClassSerializerInterceptor)
	@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
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
	@UseInterceptors(ClassSerializerInterceptor)
	@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
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
	@UseInterceptors(ClassSerializerInterceptor)
	@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
	async retweet(
		@Body() body: RetweetDto,
		@Req() request: RequestWithUser,
	): Promise<TweetEntity> {
		const retweet = await this.tweetService.retweet(
			request.user.id,
			body.tweetId,
		);
		if (!retweet) {
			throw new HttpException({}, HttpStatus.NO_CONTENT);
		} else {
			return new TweetEntity(retweet);
		}
	}
}
