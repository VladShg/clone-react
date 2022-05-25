import { DynamicModule } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

export function multerModuleFactory(destination = './upload'): DynamicModule {
	return MulterModule.register({
		storage: diskStorage({
			destination,
			filename: (req, file, cb) => {
				cb(null, `${uuidv4()}${extname(file.originalname)}`);
			},
		}),
	});
}
