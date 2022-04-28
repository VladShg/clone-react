import { IsBoolean, IsNotEmpty } from 'class-validator';

export class IsAvailableDto {
	@IsBoolean()
	@IsNotEmpty()
	isAvailable: boolean;
}
