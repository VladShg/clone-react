import { readdir, unlinkSync } from 'fs';
import { extname, join } from 'path';
import { faker } from '@faker-js/faker';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

export function getTestDir(): string {
	return join(process.cwd(), 'upload', '__test__');
}

export function cleanTestDir() {
	const testDir = getTestDir();
	readdir(testDir, (err, files) => {
		for (const file of files) {
			if (extname(file)) {
				unlinkSync(join(testDir, file));
			}
		}
	});
}

export async function resetDatabase(prisma: PrismaService): Promise<void> {
	const user = prisma.user.deleteMany();
	const tweet = prisma.tweet.deleteMany();
	const like = prisma.like.deleteMany();
	await prisma.$transaction([user, tweet, like]);
}

export async function generateUsers(
	total: number,
	prisma: PrismaService,
): Promise<User[]> {
	const index = (await prisma.user.count()) + 1;
	const users: User[] = [];

	while (users.length < total) {
		const data = {
			id: faker.datatype.uuid(),
			name: faker.name.firstName(),
			email: index + faker.internet.email(),
			username: index + faker.name.lastName(),
			gitHubId: null,
			googleId: null,
			password: faker.random.alpha(10),
			birth: new Date(),
			createdAt: new Date(),
			updatedAt: new Date(),
			avatar: null,
			background: null,
			location: null,
			bio: null,
		};
		users.push(await prisma.user.create({ data }));
	}
	return users;
}
