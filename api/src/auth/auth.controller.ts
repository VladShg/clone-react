import {
	BadRequestException,
	Body,
	Controller,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginByEmailDto } from './dto/login-email.dto';
import { GoogleTokenDto } from './dto/google-token.dto';
import { LoginByUsernameDto } from './dto/login-username.dto';
import { TokenDto } from './dto/token.dto';
import { GoogleSignupDto } from './dto/google-signup.dto';
import { TokenIsValidDto } from './dto/tokenIsValid.dto';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('/google/login')
	@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
	async signUpWithGoogle(@Body() data: GoogleTokenDto): Promise<TokenDto> {
		const user = await this.authService.loginGoogleUser(data.token);
		const token = await this.authService.generateToken(user);
		return { access_token: token };
	}

	@Post('/google/signup')
	@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
	async loginWithGoogle(@Body() data: GoogleSignupDto): Promise<TokenDto> {
		const { token, ...profile } = data;
		const user = await this.authService.signUpWithGoogle(token, profile);
		const jwtToken = await this.authService.generateToken(user);
		return { access_token: jwtToken };
	}

	@Post('/google/connect')
	@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
	async connectWithGoogle(
		@Body() data: GoogleTokenDto,
	): Promise<TokenIsValidDto> {
		try {
			await this.authService.loginGoogleUser(data.token);
		} catch (e) {
			throw new BadRequestException('Token is not valid');
		}
		return { isValid: true };
	}

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
}
