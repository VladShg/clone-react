import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TweetController } from './tweet.controller';
import { TweetService } from './tweet.service';

@Module({
	imports: [PrismaModule],
	controllers: [TweetController],
	providers: [TweetService],
})

export class TweetModule {}