import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserFiles } from '../types/UpdateUserFiles';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async get(username: string): Promise<User | null> {
		return this.prisma.user.findUnique({ where: { username } });
	}

	async update(
		username: string,
		data: Prisma.UserUpdateInput,
		files: UpdateUserFiles,
	): Promise<User> {
		const where: Prisma.UserWhereUniqueInput = { username };
		await this.prisma.user.update({ data: data, where });
		const { avatar, background } = files;
		if (avatar) {
			await this.prisma.user.update({ data: { avatar }, where });
		}
		if (background) {
			await this.prisma.user.update({ data: { background }, where });
		}
		return await this.prisma.user.findUnique({ where });
	}

	async findOne(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
		return this.prisma.user.findUnique({ where });
	}
}
