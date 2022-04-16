import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { validatePassword } from 'src/utils/bcrypt';

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService, private jwtService: JwtService) {}

	async validateUser(
		where: Prisma.UserWhereUniqueInput,
		password: string,
	): Promise<User | null> {
		const user = await this.prisma.user.findFirst({ where });
		if (!user) throw new BadRequestException('user not found');
		const isValid = await validatePassword(user.password, password);
		if (!isValid) {
			throw new BadRequestException("password don't match");
		}
		return user;
	}

	login(user: User): string {
		const payload = { username: user.username, sub: user.id };
		return this.jwtService.sign(payload);
	}
}
