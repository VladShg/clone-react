import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Post,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from '../auth.service';
import { IsAvailableDto } from '../dto/is-available.dto';
import { LoginByEmailDto } from '../dto/login-email.dto';
import { LoginByUsernameDto } from '../dto/login-username.dto';
import { TokenDto } from '../dto/token.dto';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('/login/username')
	@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
	async loginByUsername(@Body() data: LoginByUsernameDto): Promise<TokenDto> {
		const { password, ...where } = data;
		const user = await this.authService.validateUser(where, password);
		const access_token = this.authService.generateToken(user);
		return { access_token };
	}

	@Post('/login/email')
	@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
	async loginByEmail(@Body() data: LoginByEmailDto): Promise<TokenDto> {
		const { password, ...where } = data;
		const user = await this.authService.validateUser(where, password);
		const token = this.authService.generateToken(user);
		return { access_token: token };
	}

	@Get('/lookup')
	async lookupUser(
		@Query('email') email?: string,
		@Query('username') username?: string,
	): Promise<IsAvailableDto> {
		let user: User;
		try {
			if (email) {
				user = await this.authService.getUser({ email: email });
			} else if (username) {
				user = await this.authService.getUser({ username: username });
			} else {
				throw new BadRequestException('Params not provided');
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
