import { IsBoolean, IsNotEmpty } from 'class-validator';

export class TokenIsValidDto {
	@IsNotEmpty()
	@IsBoolean()
	isValid: boolean;
}
