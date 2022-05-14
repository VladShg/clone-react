import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from '../entity/user.entity';
import { UserService } from './user.service';
import { hashPassword } from '../utils/bcrypt';

@Controller('user')
export class UserController {
	constructor(private userService: UserService) {}

	@Post('/register')
	async register(@Body() data: CreateUserDto): Promise<User> {
		data.password = await hashPassword(data.password);
		const user = await this.userService.createUser(data);
		return user;
	}

	@Get('/:username')
	@UseGuards(AuthGuard('jwt'))
	async getUser(@Param('username') username: string): Promise<UserEntity> {
		const user = await this.userService.findOne({ username: username });
		return new UserEntity(user);
	}

	@Get()
	@UseGuards(AuthGuard('jwt'))
	async getUsers(): Promise<UserEntity[]> {
		const users = await this.userService.findAll();
		return users.map((user) => new UserEntity(user));
	}
}
