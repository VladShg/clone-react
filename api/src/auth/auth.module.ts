import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.straregy';
import { GoogleController } from './controller/google.controller';
import { GitHubController } from './controller/github.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
	controllers: [AuthController, GoogleController, GitHubController],
	providers: [AuthService, JwtStrategy],
	imports: [
		PrismaModule,
		JwtModule.register({
			secret: process.env.SECRET_KEY,
			signOptions: { expiresIn: '24h' },
		}),
	],
	exports: [AuthService],
})
export class AuthModule {}
