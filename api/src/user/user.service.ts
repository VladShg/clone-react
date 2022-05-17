import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async findOne(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
		return this.prisma.user.findUnique({ where });
	}
}
