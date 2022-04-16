import { IsNotEmpty } from 'class-validator';

export class LoginByUsernameDto {
	@IsNotEmpty()
	email: string;

	@IsNotEmpty()
	password: string;
}
