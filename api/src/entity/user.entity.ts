import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
	id: string;
	name: string;
	username: string;

	@Exclude()
	birth: Date | null;

	@Exclude()
	email: string;

	@Exclude()
	password: string;

	@Exclude()
	googleId: string | null;

	@Exclude()
	gitHubId: number | null;

	createdAt: Date;
	updatedAt: Date;

	constructor(user: Partial<User>) {
		Object.assign(this, user);
	}
}
