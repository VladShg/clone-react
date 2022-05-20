import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.straregy';
import { GoogleController } from './controller/google.controller';
import { GitHubController } from './controller/github.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Module({
	controllers: [AuthController, GoogleController, GitHubController],
	providers: [AuthService, JwtStrategy],
	imports: [
		PrismaModule,
		JwtModule.register({
			secret: process.env.SECRET_KEY,
			signOptions: { expiresIn: '24h' },
		}),
		MulterModule.register({
			storage: diskStorage({
				destination: './upload',
				filename: (req, file, cb) => {
					cb(null, `${uuidv4()}${extname(file.originalname)}`);
				},
			}),
		}),
	],
	exports: [AuthService],
})
export class AuthModule {}
