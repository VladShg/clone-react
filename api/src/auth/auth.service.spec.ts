import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthService } from './auth.service';
import { AuthController } from './controller/auth.controller';
import { GitHubController } from './controller/github.controller';
import { GoogleController } from './controller/google.controller';
import { JwtStrategy } from './jwt.straregy';

describe('AuthService', () => {
	let service: AuthService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController, GoogleController, GitHubController],
			providers: [AuthService, JwtStrategy],
			imports: [
				PrismaModule,
				JwtModule.register({
					secret: process.env.SECRET_KEY,
					signOptions: { expiresIn: '24h' },
				}),
			],
		}).compile();

		service = module.get<AuthService>(AuthService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
