import {
	Body,
	Controller,
	HttpStatus,
	Post,
	Res,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { GoogleSignupDto } from '../dto/google-signup.dto';
import { GoogleTokenDto } from '../dto/google-token.dto';
import { TokenDto } from '../dto/token.dto';
import { Response } from 'express';

@Controller('auth/google')
export class GoogleController {
	constructor(private authService: AuthService) {}

	@Post('/login')
	@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
	async signUpWithGoogle(@Body() data: GoogleTokenDto): Promise<TokenDto> {
		const user = await this.authService.loginGoogleUser(data.token);
		const token = this.authService.generateToken(user);
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
		@Res() response: Response,
	): Promise<void> {
		await this.authService.checkWithGoogle(data.token);
		response.sendStatus(HttpStatus.OK);
	}
}
