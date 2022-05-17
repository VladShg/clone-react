import faker from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from './prisma.module';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
	let service: PrismaService;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [PrismaModule],
		}).compile();

		service = module.get<PrismaService>(PrismaService);
	});

	afterEach(async () => {
		await service.user.deleteMany();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should create user', async () => {
		const COUNT = 100;
		const users = [];
		for (let i = 0; i < COUNT; i++) {
			users.push(
				service.user.create({
					data: {
						email: i + faker.internet.email(),
						name: faker.name.firstName(),
						username: i + faker.name.lastName(),
					},
				}),
			);
		}
		await service.$transaction(users);
		const count = await service.user.aggregate({ _count: { _all: true } });
		expect(count._count._all).toBe(COUNT);
	});
});
