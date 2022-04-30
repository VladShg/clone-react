import {
	IsDateString,
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
} from 'class-validator';

export class SignUpProfileDto {
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
	@IsOptional()
	password: string;
}
