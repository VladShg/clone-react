import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from '../entity/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private userService: UserService) {}

	@Get('/:username')
	@UseGuards(AuthGuard('jwt'))
	async getUser(@Param('username') username: string): Promise<UserEntity> {
		const user = await this.userService.findOne({ username: username });
		return new UserEntity(user);
	}
}
