import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { multerModuleFactory } from '../utils/modules';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
	imports: [PrismaModule, multerModuleFactory()],
	controllers: [UserController],
	providers: [UserService],
})
export class UserModule {}
