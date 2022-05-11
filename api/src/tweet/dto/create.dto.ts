import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTweetDto {
	@IsString()
	@IsNotEmpty()
	message: string;

	@IsOptional()
	@IsString()
	replyId?: string | null;
}
