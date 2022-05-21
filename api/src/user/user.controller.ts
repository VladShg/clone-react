import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { readFileSync } from 'fs';
import { join } from 'path';
import { UserEntity } from '../entity/user.entity';
import { AvatarDto } from './dto/avatar.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private userService: UserService) {}

	@Get('/:username')
	@UseGuards(AuthGuard('jwt'))
	async getUser(@Param('username') username: string): Promise<UserEntity> {
		const user = await this.userService.get(username);
		return new UserEntity(user);
	}

	@Get('/:username/avatar')
	@UseGuards(AuthGuard('jwt'))
	async getProfilePicture(
		@Param('username') username: string,
	): Promise<AvatarDto> {
		const user = await this.userService.get(username);
		if (user.avatar) {
			const filePath = join(process.cwd(), 'upload', user.avatar);
			const image = readFileSync(filePath, 'base64');
			return { image };
		} else {
			return { image: '' };
		}
	}
}
