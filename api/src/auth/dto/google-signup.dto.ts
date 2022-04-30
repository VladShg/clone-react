import {
	IsDateString,
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
} from 'class-validator';

export class GoogleSignupDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsDateString()
	@IsNotEmpty()
	birth: string;

	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	username: string;

	@IsString()
	@IsNotEmpty()
	token: string;

	@IsString()
	@IsOptional()
	password: string;
}
