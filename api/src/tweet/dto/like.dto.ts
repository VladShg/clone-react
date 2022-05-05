import { IsNotEmpty, IsString } from 'class-validator';

export class LikeTweetDto {
	@IsString()
	@IsNotEmpty()
	id: string;
}
