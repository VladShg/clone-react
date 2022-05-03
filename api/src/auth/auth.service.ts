import {
	BadRequestException,
	HttpException,
	HttpStatus,
	Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashPassword, validatePassword } from 'src/utils/bcrypt';
import { google } from 'googleapis';
import { Octokit } from '@octokit/core';
import { createOAuthUserAuth } from '@octokit/auth-oauth-user';
import { GitHubProfileDto } from './dto/github-profile.dto';
import { GitHubUser } from './interfaces/github-user.interface';

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService, private jwtService: JwtService) {}

	async getGoogleUser(token: string) {
		const clientSecret = process.env.GOOGLE_SECRET_KEY;
		const clientId = process.env.GOOGLE_CLIENT_ID;
		const oauthClient = new google.auth.OAuth2(clientId, clientSecret);

		oauthClient.setCredentials({ access_token: token });
		try {
			const oauth2 = google.oauth2({ version: 'v2', auth: oauthClient });
			const response = await oauth2.userinfo.get();
			return response.data;
		} catch (e) {
			throw new BadRequestException('token is not valid');
		}
	}

	async getGitHubUser(code: string): Promise<GitHubUser> {
		try {
			const octokit = new Octokit({
				authStrategy: createOAuthUserAuth,
				auth: {
					clientId: process.env.GITHUB_CLIENT_ID,
					clientSecret: process.env.GITHUB_SECRET_KEY,
					code: code,
				},
			});
			return (await octokit.request('GET /user', {})).data;
		} catch {
			throw new BadRequestException('token is not valid');
		}
	}

	async loginWithGitHub(code: string): Promise<User> {
		const gitHubUser = await this.getGitHubUser(code);
		const user = await this.prisma.user.findUnique({
			where: { gitHubId: gitHubUser.id },
		});
		if (!user) {
			throw new BadRequestException('user not found');
		}
		return user
	}

	async connectWithGitHub(code: string): Promise<GitHubProfileDto> {
		const profile = await this.getGitHubUser(code);
		const user = await this.prisma.user.findFirst({
			where: { gitHubId: profile.id },
		});
		if (user) {
			throw new HttpException('user is already present', HttpStatus.CONFLICT);
		}
		try {
			return {
				githubId: profile.id,
				email: profile.email || '',
				name: profile.name || '',
				username: profile.login || '',
			};
		} catch (e) {
			throw new BadRequestException(`Failed to authorize: ${e}`);
		}
	}

	async connectWithGoogle(token: string) {
		const googleId = (await this.getGoogleUser(token)).id;
		const user = await this.prisma.user.findFirst({
			where: { googleId },
		});
		if (user) {
			throw new HttpException('user is already present', HttpStatus.CONFLICT);
		}
	}

	async loginGoogleUser(token: string): Promise<User> {
		const googleId = (await this.getGoogleUser(token)).id;
		const user = await this.prisma.user.findFirst({
			where: { googleId },
		});
		if (!user) throw new BadRequestException('user not found');
		return user;
	}

	async findUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
		return this.prisma.user.findUnique({ where });
	}

	async getUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
		const user = await this.prisma.user.findFirst({ where });
		if (!user) throw new BadRequestException('user not found');
		return user;
	}

	async signUp(data: Prisma.UserCreateInput): Promise<User> {
		let password = '';
		if (data.password) {
			password = await hashPassword(data.password);
		}
		return this.prisma.user.create({
			data: { ...data, password: password, birth: new Date(data.birth) },
		});
	}

	async validateUser(
		where: Prisma.UserWhereInput,
		password: string,
	): Promise<User | null> {
		const user = await this.prisma.user.findFirst({ where });
		if (!user)
			throw new HttpException(
				'user not found',
				HttpStatus.UNPROCESSABLE_ENTITY,
			);
		const isValid = await validatePassword(user.password, password);
		if (!isValid) {
			throw new HttpException(
				"password don't match",
				HttpStatus.UNPROCESSABLE_ENTITY,
			);
		}
		return user;
	}

	generateToken(user: User): string {
		const payload = { username: user.username, sub: user.id };
		return this.jwtService.sign(payload);
	}
}
