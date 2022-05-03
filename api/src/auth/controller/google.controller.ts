import {
	Body,
	Controller,
	Post,
	Res,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
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
		return { accessToken: token };
	}

	@Post('/connect')
	@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
	async connectWithGoogle(
		@Body() data: GoogleTokenDto,
		@Res() response: Response,
	): Promise<void> {
		await this.authService.connectWithGoogle(data.token);
		response.send({});
	}
}
