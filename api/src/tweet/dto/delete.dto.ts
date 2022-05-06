import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteTweetDto {
	@IsNotEmpty()
	@IsString()
	id: string;
}
