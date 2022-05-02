import { IsNotEmpty, IsString } from 'class-validator';

export class LoginByCredentialsDto {
	@IsString()
	@IsNotEmpty()
	login: string;

	@IsString()
	@IsNotEmpty()
	password: string;
}
