import {
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Req,
	UnauthorizedException,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { readFileSync } from 'fs';
import { join } from 'path';
import { UserEntity } from '../entity/user.entity';
import { RequestWithUser } from '../types/RequestWithUser';
import { ImageDto } from './dto/avatar.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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

	@Patch('/:username')
	@UseGuards(AuthGuard('jwt'))
	@UseInterceptors(
		FileFieldsInterceptor([
			{ name: 'avatar', maxCount: 1 },
			{ name: 'background', maxCount: 1 },
		]),
	)
	async updateProfile(
		@Param('username') username: string,
		@Body() body: UpdateUserDto,
		@Req() req: RequestWithUser,
		@UploadedFile() avatar?: Express.Multer.File,
		@UploadedFile() background?: Express.Multer.File,
	): Promise<UserEntity> {
		if (req.user.username !== username) {
			throw new UnauthorizedException('Insufficient rights');
		}
		const user = await this.userService.update(username, {
			...body,
			avatar: avatar ? avatar.filename : '',
			background: background ? background.filename : '',
		});
		return new UserEntity(user);
	}

	@Get('/:username/avatar')
	@UseGuards(AuthGuard('jwt'))
	async getProfilePicture(
		@Param('username') username: string,
	): Promise<ImageDto> {
		const user = await this.userService.get(username);
		if (user.avatar) {
			const filePath = join(process.cwd(), 'upload', user.avatar);
			const image = readFileSync(filePath, 'base64');
			return { image };
		} else {
			return { image: '' };
		}
	}

	@Get('/:username/background')
	@UseGuards(AuthGuard('jwt'))
	async getProfileBackground(
		@Param('username') username: string,
	): Promise<ImageDto> {
		const user = await this.userService.get(username);
		if (user.background) {
			const filePath = join(process.cwd(), 'upload', user.background);
			const image = readFileSync(filePath, 'base64');
			return { image };
		} else {
			return { image: '' };
		}
	}
}
