import { IsEmail, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class GoogleSignupDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	googleId: string;

	@IsString()
	@IsNotEmpty()
	name: string;

	@IsUrl()
	@IsNotEmpty()
	imageUrl: string;

	@IsString()
	@IsNotEmpty()
	token: string;
}
