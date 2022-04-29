import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashPassword, validatePassword } from 'src/utils/bcrypt';
import { Auth, google } from 'googleapis';
import { GoogleProfile } from './interface/google-profile.interface';
import { Octokit } from '@octokit/core';
import { createOAuthUserAuth } from '@octokit/auth-oauth-user';
import { GitHubProfileDto } from './dto/github-profile.dto';

@Injectable()
export class AuthService {
	private oauthClient: Auth.OAuth2Client;

	constructor(private prisma: PrismaService, private jwtService: JwtService) {
		const clientSecret = process.env.GOOGLE_SECRET_KEY;
		const clientId = process.env.GOOGLE_CLIENT_ID;
		this.oauthClient = new google.auth.OAuth2(clientId, clientSecret);
	}

	async signUpWithGoogle(token: string, profile: GoogleProfile): Promise<User> {
		const tokenInfo = await this.oauthClient.getTokenInfo(token);
		const user = await this.prisma.user.create({
			data: {
				googleId: profile.googleId,
				email: tokenInfo.email,
				name: profile.name,
				username: profile.googleId,
				password: await hashPassword(token),
			},
		});
		return user;
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

	async loginGoogleUser(token: string): Promise<User> {
		const tokenInfo = await this.oauthClient.getTokenInfo(token);
		const user = this.prisma.user.findUnique({
			where: { email: tokenInfo.email },
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
