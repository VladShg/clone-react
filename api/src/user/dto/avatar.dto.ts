import { IsBase64, IsString } from 'class-validator';

export class AvatarDto {
	@IsBase64()
	@IsString()
	image: string;
}
