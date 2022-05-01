import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Post,
	Query,
	Request,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { UserEntity } from 'src/entity/user.entity';
import { AuthService } from '../auth.service';
import { IsAvailableDto } from '../dto/is-available.dto';
import { LoginByCredentialsDto } from '../dto/login-credentials.dto';
import { SignUpDto } from '../dto/signup.dto';
import { TokenDto } from '../dto/token.dto';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('/login')
	@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
	async loginByUsername(
		@Body() data: LoginByCredentialsDto,
	): Promise<TokenDto> {
		if (!data.email && !data.username) {
			throw new BadRequestException('neither email or username provided');
		}

		const { password, ...where } = data;
		const user = await this.authService.validateUser(where, password);
		const access_token = this.authService.generateToken(user);
		return { access_token };
	}

	@Get('/account')
	@UseGuards(AuthGuard('jwt'))
	@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
	async account(@Request() req): Promise<UserEntity> {
		const user = await this.authService.getUser({ id: req.user });
		const entity = new UserEntity(user);
		return entity;
	}

	@Post('/signup')
	@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
	async signUp(@Body() data: SignUpDto): Promise<TokenDto> {
		const user = await this.authService.signUp(data);
		const token = this.authService.generateToken(user);
		return { access_token: token };
	}

	@Get('/lookup')
	async lookupUser(
		@Query('email') email?: string,
		@Query('username') username?: string,
	): Promise<IsAvailableDto> {
		let user: User;
		try {
			if (email) {
				user = await this.authService.getUser({ email: email });
			} else if (username) {
				user = await this.authService.getUser({ username: username });
			} else {
				throw new BadRequestException('Params not provided');
			}
		} catch {
			return { isAvailable: true };
		}

		if (user) {
			return { isAvailable: false };
		}
		return { isAvailable: true };
	}
}
