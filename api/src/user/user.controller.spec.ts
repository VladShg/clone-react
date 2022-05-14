import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../prisma/prisma.module';
import { UserController } from './user.controller';
import { UserModule } from './user.module';
import { UserService } from './user.service';

describe('UserController', () => {
	let controller: UserController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [UserModule, PrismaModule],
			providers: [UserService],
			controllers: [UserController],
		}).compile();

		controller = module.get<UserController>(UserController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
