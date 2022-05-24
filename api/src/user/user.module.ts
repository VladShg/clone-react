import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import { PrismaModule } from '../prisma/prisma.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { v4 as uuidv4 } from 'uuid';
import { diskStorage } from 'multer';

@Module({
	imports: [
		PrismaModule,
		MulterModule.register({
			storage: diskStorage({
				destination: './upload',
				filename: (req, file, cb) => {
					cb(null, `${uuidv4()}${extname(file.originalname)}`);
				},
			}),
		}),
	],
	controllers: [UserController],
	providers: [UserService],
})
export class UserModule {}
