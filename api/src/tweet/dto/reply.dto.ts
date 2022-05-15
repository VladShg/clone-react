import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ReplyDto {
	@IsString()
	@IsNotEmpty()
	message: string;

	@IsString()
	@IsUUID()
	replyId: string;
}
