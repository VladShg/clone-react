import {
	BadRequestException,
	HttpCode,
	HttpException,
	HttpStatus,
	Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashPassword, validatePassword } from 'src/utils/bcrypt';
import { Auth, google } from 'googleapis';
import { GoogleProfile } from './interface/google-profile.interface';
import { Octokit } from '@octokit/core';
import { createOAuthUserAuth } from '@octokit/auth-oauth-user';
import { GitHubProfileDto } from './dto/github-profile.dto';
import { TokenInfo } from 'google-auth-library';
import { SignUpProfileDto } from './dto/signup-profile.dto';

@Injectable()
export class AuthService {
	private oauthClient: Auth.OAuth2Client;

	constructor(private prisma: PrismaService, private jwtService: JwtService) {
		const clientSecret = process.env.GOOGLE_SECRET_KEY;
		const clientId = process.env.GOOGLE_CLIENT_ID;
		this.oauthClient = new google.auth.OAuth2(clientId, clientSecret);
	}

	async signUpWithGitHub(code: string): Promise<GitHubProfileDto> {
		try {
			const octokit = new Octokit({
				authStrategy: createOAuthUserAuth,
				auth: {
					clientId: process.env.GITHUB_CLIENT_ID,
					clientSecret: process.env.GITHUB_SECRET_KEY,
					code: code,
				},
			});
			const { data } = await octokit.request('GET /user', {});

			return {
				githubId: data.id,
				email: data.email || '',
				name: data.name || '',
				username: data.login || '',
			};
		} catch (e) {
			throw new BadRequestException(`Failed to authorize: ${e}`);
		}
	}

	async checkWithGoogle(token: string) {
		let tokenInfo: TokenInfo;
		try {
			tokenInfo = await this.oauthClient.getTokenInfo(token);
		} catch {
			throw new BadRequestException('token is not valid');
		}
		const user = this.prisma.user.findFirst({
			where: { googleId: tokenInfo.user_id },
		});
		if (user) {
			throw new HttpException('user is already present', HttpStatus.CONFLICT);
		}
	}

	async signUpWithGoogle(
		token: string,
		profile: SignUpProfileDto,
	): Promise<User> {
		let tokenInfo: TokenInfo;
		try {
			tokenInfo = await this.oauthClient.getTokenInfo(token);
		} catch {
			throw new BadRequestException('token is not valid');
		}

		const user = await this.prisma.user.create({
			data: {
				googleId: tokenInfo.user_id,
				email: profile.email,
				name: profile.username,
				username: profile.username,
				birth: new Date(profile.birth),
				password: profile.password || (await hashPassword(token)),
			},
		});
		return user;
	}

	async loginGoogleUser(token: string): Promise<User> {
		let tokenInfo: TokenInfo;
		try {
			tokenInfo = await this.oauthClient.getTokenInfo(token);
		} catch {
			throw new BadRequestException('token is not valid');
		}
		const user = this.prisma.user.findFirst({
			where: { googleId: tokenInfo.user_id },
		});
		if (!user) throw new BadRequestException('user not found');
		return user;
	}

	async findUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
		return this.prisma.user.findUnique({ where });
	}

	async getUser(where: Prisma.UserWhereUniqueInput) {
		const user = await this.prisma.user.findFirst({ where });
		if (!user) throw new BadRequestException('user not found');
		return user;
	}

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

	generateToken(user: User): string {
		const payload = { username: user.username, sub: user.id };
		return this.jwtService.sign(payload);
	}
}
