import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async findOne(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
		return this.prisma.user.findUnique({ where });
	}

	async findAll(where?: Prisma.UserWhereInput): Promise<User[]> {
		return this.prisma.user.findMany({ where });
	}

	async createUser(data: Prisma.UserCreateInput): Promise<User> {
		let user = await this.prisma.user.findFirst({
			where: { username: data.username },
		});

		if (user) throw new BadRequestException('username is not available');

		user = await this.prisma.user.findFirst({
			where: { email: data.email },
		});

		if (user) throw new BadRequestException('email is not available');

		return this.prisma.user.create({ data });
	}
}
