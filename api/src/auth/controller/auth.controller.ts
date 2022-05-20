import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Post,
	Query,
	Request,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@prisma/client';
import { UserEntity } from '../../entity/user.entity';
import { RequestWithUser } from '../../types/RequestWithUser';
import { AuthService } from '../auth.service';
import { IsAvailableDto } from '../dto/is-available.dto';
import { LoginByCredentialsDto } from '../dto/login-credentials.dto';
import { SignUpDto } from '../dto/signup.dto';
import { TokenDto } from '../dto/token.dto';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('/login')
	async loginByUsername(
		@Body() data: LoginByCredentialsDto,
	): Promise<TokenDto> {
		const user = await this.authService.validateUser(
			{ OR: [{ email: data.login }, { username: data.login }] },
			data.password,
		);
		const accessToken = this.authService.generateToken(user);
		return { accessToken };
	}

	@Get('/account')
	@UseGuards(AuthGuard('jwt'))
	async account(@Request() req: RequestWithUser): Promise<UserEntity> {
		const user = await this.authService.getUser({ id: req.user.id });
		const entity = new UserEntity(user);
		return entity;
	}

	@Post('/signup')
	@UseInterceptors(FileInterceptor('avatar'))
	async signUp(
		@Body() data: SignUpDto,
		@UploadedFile() avatar?: Express.Multer.File,
	): Promise<TokenDto> {
		avatar.filename;
		const user = await this.authService.signUp(data);
		const token = this.authService.generateToken(user);
		return { accessToken: token };
	}

	@Get('/lookup')
	async lookupUser(
		@Query('email') email?: string,
		@Query('username') username?: string,
	): Promise<IsAvailableDto> {
		let user: User;
		if (!email && !username) {
			throw new BadRequestException('Params not provided');
		}
		try {
			if (email) {
				user = await this.authService.getUser({ email: email });
			} else if (username) {
				user = await this.authService.getUser({ username: username });
			}
		} catch {
			return { isAvailable: true };
		}

		if (user) {
			return { isAvailable: false };
		}
		return { isAvailable: true };
	}
}
