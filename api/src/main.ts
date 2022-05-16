import {
	ClassSerializerInterceptor,
	INestApplication,
	ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';

export function applyMiddleware(app: INestApplication) {
	app.enableCors();
	app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
	app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
}

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	applyMiddleware(app);
	await app.listen(5000);
}
bootstrap();
