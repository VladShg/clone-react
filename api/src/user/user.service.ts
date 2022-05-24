import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UserFilesDto } from './dto/user-files.dto';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async get(username: string): Promise<User | null> {
		return this.prisma.user.findUnique({ where: { username } });
	}

	async update(
		username: string,
		data: Prisma.UserUpdateInput,
		files: UserFilesDto,
	): Promise<User> {
		const where: Prisma.UserWhereUniqueInput = { username };
		await this.prisma.user.update({ data: data, where });
		if (files.avatar) {
			await this.prisma.user.update({ data: { avatar: files.avatar }, where });
		}
		if (files.background) {
			await this.prisma.user.update({
				data: { background: files.background },
				where,
			});
		}
		return await this.prisma.user.findUnique({ where });
	}

	async findOne(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
		return this.prisma.user.findUnique({ where });
	}
}
