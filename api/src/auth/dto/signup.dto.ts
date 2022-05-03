import { Prisma } from '@prisma/client';
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

	@IsNumber()
	@IsOptional()
	gitHubId: number;
}