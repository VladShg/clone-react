import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Get,
	Param,
	Post,
	UseGuards,
	UseInterceptors,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { hashPassword } from 'src/utils/bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from '../entity/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private userService: UserService) {}

	@Post('/register')
	@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
	async register(@Body() data: CreateUserDto): Promise<User> {
		data.password = await hashPassword(data.password);
		const user = await this.userService.createUser(data);
		return user;
	}

	@Get('/:id')
	@UseGuards(AuthGuard('jwt'))
	async getUser(@Param('id') id: string): Promise<UserEntity> {
		return await this.userService.findOne({ id: id });
	}

	@Get()
	@UseInterceptors(ClassSerializerInterceptor)
	@UseGuards(AuthGuard('jwt'))
	async getUsers(): Promise<UserEntity[]> {
		const users = await this.userService.findAll();
		return users.map((user) => new UserEntity(user));
	}
}
