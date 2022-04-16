import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginByEmailDto {
	@IsEmail()
	email: string;

	@IsNotEmpty()
	password: string;
}
