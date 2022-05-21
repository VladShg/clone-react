import { Prisma } from '@prisma/client';
import { Exclude, Transform } from 'class-transformer';
import {
	IsDateString,
	IsEmail,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator';

export class SignUpDto implements Prisma.UserCreateInput {
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

	@IsString()
	@IsOptional()
	googleId?: string;

	@Transform(({ value }) => (value ? Number.parseInt(value) : null))
	@IsNumber()
	@IsOptional()
	gitHubId: number;

	@Exclude()
	avatar?: string;
}
