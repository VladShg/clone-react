import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private authService: AuthService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.SECRET_KEY,
		});
	}

	async validate(payload: any) {
		const userId: string = payload.sub;
		const user = await this.authService.getUser({ id: userId });
		return user;
	}
}
