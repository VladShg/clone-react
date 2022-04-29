import {
	BadRequestException,
	Body,
	Controller,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { GoogleSignupDto } from '../dto/google-signup.dto';
import { GoogleTokenDto } from '../dto/google-token.dto';
import { TokenDto } from '../dto/token.dto';
import { TokenIsValidDto } from '../dto/tokenIsValid.dto';

@Controller('auth/google')
export class GoogleController {
	constructor(private authService: AuthService) {}

	@Post('/login')
	@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
	async signUpWithGoogle(@Body() data: GoogleTokenDto): Promise<TokenDto> {
		const user = await this.authService.loginGoogleUser(data.token);
		const token = await this.authService.generateToken(user);
		return { access_token: token };
	}

	@Post('/signup')
	@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
	async loginWithGoogle(@Body() data: GoogleSignupDto): Promise<TokenDto> {
		const { token, ...profile } = data;
		const user = await this.authService.signUpWithGoogle(token, profile);
		const jwtToken = await this.authService.generateToken(user);
		return { access_token: jwtToken };
	}

	@Post('/connect')
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
}
