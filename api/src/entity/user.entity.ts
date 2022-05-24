import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
	id: string;
	name: string;
	username: string;
	location: string | null;
	bio: string | null;

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

	@Exclude()
	avatar: string | null;

	@Exclude()
	background: string | null;

	createdAt: Date;
	updatedAt: Date;

	constructor(user: Partial<User>) {
		Object.assign(this, user);
	}
}
