import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyMiddleware } from './utils/middleware';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	applyMiddleware(app);
	await app.listen(5000);
}
bootstrap();
