import { IsNotEmpty, IsString } from 'class-validator';

export class GitHubCodeDto {
	@IsString()
	@IsNotEmpty()
	code: string;
}
