import {
	Body,
	Controller,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { GitHubCodeDto } from '../dto/github-code.dto';
import { GitHubProfileDto } from '../dto/github-profile.dto';
import { TokenDto } from '../dto/token.dto';

@Controller('auth/github')
export class GitHubController {
	constructor(private authService: AuthService) {}

	@Post('/login')
	@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
	async login(@Body() data: GitHubCodeDto): Promise<TokenDto> {
		const user = await this.authService.loginWithGitHub(data.code);
		const token = this.authService.generateToken(user);
		return { access_token: token };
	}

	@Post('/connect')
	@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
	async connectToken(@Body() data: GitHubCodeDto): Promise<GitHubProfileDto> {
		return await this.authService.connectWithGitHub(data.code);
	}
}
