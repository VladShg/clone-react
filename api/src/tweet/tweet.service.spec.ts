import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../prisma/prisma.module';
import { TweetController } from './tweet.controller';
import { TweetService } from './tweet.service';

describe('TweetService', () => {
	let service: TweetService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [PrismaModule],
			controllers: [TweetController],
			providers: [TweetService],
		}).compile();

		service = module.get<TweetService>(TweetService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
