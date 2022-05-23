import { IsBase64, IsString } from 'class-validator';

export class ImageDto {
	@IsBase64()
	@IsString()
	image: string;
}
