import {
	ClassSerializerInterceptor,
	INestApplication,
	ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export function applyMiddleware(app: INestApplication) {
	app.enableCors();
	app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
	app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
}
