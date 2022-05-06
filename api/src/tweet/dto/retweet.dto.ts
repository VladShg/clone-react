import { IsNotEmpty, IsString } from 'class-validator';

export class RetweetDto {
	@IsString()
	@IsNotEmpty()
	id: string;
}
