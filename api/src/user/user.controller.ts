import {
	Body,
	Controller,
	Get,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { hashPassword } from 'src/utils/bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
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

	@Get('')
	@UseGuards(AuthGuard('jwt'))
	async getUsers(): Promise<User[]> {
		return await this.userService.findAll();
	}
}
