import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.straregy';

@Module({
	controllers: [AuthController],
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
