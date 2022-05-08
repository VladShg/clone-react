import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { GitHubCodeDto } from '../dto/github-code.dto';
import { GitHubProfileDto } from '../dto/github-profile.dto';
import { TokenDto } from '../dto/token.dto';

@Controller('auth/github')
export class GitHubController {
	constructor(private authService: AuthService) {}

	@Post('/login')
	async login(@Body() data: GitHubCodeDto): Promise<TokenDto> {
		const user = await this.authService.loginWithGitHub(data.code);
		const token = this.authService.generateToken(user);
		return { accessToken: token };
	}

	@Post('/connect')
	async connectToken(@Body() data: GitHubCodeDto): Promise<GitHubProfileDto> {
		return await this.authService.connectWithGitHub(data.code);
	}
}
