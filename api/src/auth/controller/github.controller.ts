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

@Controller('auth/github')
export class GitHubController {
	constructor(private authService: AuthService) {}

	@Post('/connect')
	@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
	async connectToken(@Body() data: GitHubCodeDto): Promise<GitHubProfileDto> {
		return await this.authService.signUpWithGitHub(data.code);
	}
}
