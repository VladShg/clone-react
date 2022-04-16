import * as bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
	const salt = await bcrypt.genSalt(10);
	return bcrypt.hash(password, salt);
}

export async function validatePassword(
	hash: string,
	input: string,
): Promise<boolean> {
	return bcrypt.compare(input, hash);
}
