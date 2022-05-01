import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginByCredentialsDto {
	@IsEmail()
	@IsOptional()
	email: string;

	@IsString()
	@IsOptional()
	username: string;

	@IsNotEmpty()
	password: string;
}
