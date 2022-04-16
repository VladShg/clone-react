import {
	Body,
	Controller,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginByEmailDto } from './dto/login-email.dto';
import { LoginByUsernameDto } from './dto/login-username.dto';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('/login/username')
	@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
	async loginByUsername(@Body() data: LoginByUsernameDto): Promise<object> {
		const { password, ...where } = data;
		const user = await this.authService.validateUser(where, password);
		const access_token = this.authService.login(user);
		return { access_token };
	}

	@Post('/login/email')
	@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
	async loginByEmail(@Body() data: LoginByEmailDto): Promise<object> {
		const { password, ...where } = data;
		const user = await this.authService.validateUser(where, password);
		const access_token = this.authService.login(user);
		return { access_token };
	}
}
