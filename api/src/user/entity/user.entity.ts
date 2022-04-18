import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
	id: string;
	name: string;
	username: string;

	@Exclude()
	email: string;

	@Exclude()
	password: string;

	@Exclude()
	googleId: string | null;

	created_at: Date;
	updated_at: Date;

	constructor(user: Partial<User>) {
		Object.assign(this, user);
	}
}
