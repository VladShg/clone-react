import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async get(username: string): Promise<User | null> {
		return this.prisma.user.findUnique({ where: { username } });
	}

	async update(username: string, data: Prisma.UserUpdateInput): Promise<User> {
		return await this.prisma.user.update({ data: data, where: { username } });
	}

	async findOne(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
		return this.prisma.user.findUnique({ where });
	}
}
