import { Body, Controller, Get, HttpCode, NotFoundException, Param, Patch, Post, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
const crypto = import('crypto');

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    register(@Body() registerUserDto: RegisterUserDto) {
        return this.authService.register(registerUserDto);
    }

    @Post('login')
    @HttpCode(200)
    async login(@Body() loginUserDto: LoginUserDto, @Res({ passthrough: true }) response: Response) {
        const { access_token, refresh_token } = await this.authService.login(loginUserDto);
        response.cookie("access_token", access_token, { httpOnly: true });
        response.cookie("refresh_token", refresh_token, { httpOnly: true });
    }

    @Post('refresh')
    @HttpCode(200)
    async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
        const access_token = await this.authService.refresh(request.cookies['refresh_token']);
        response.cookie("access_token", access_token, { httpOnly: true });
    }

    @Post('logout')
    @HttpCode(200)
    async logout(@Res({ passthrough: true }) response: Response) {
        response.cookie("access_token", '', { maxAge: 0 });
        response.cookie("refresh_token", '', { maxAge: 0 });
    }

    @Post('forgot')
    @HttpCode(302)
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto, @Res({ passthrough: true }) response: Response) {
        const { email } = forgotPasswordDto;
        const token = (await crypto).randomUUID();
        await this.authService.storeTokenForgotPassword(token, email);
        // Here you need to send a email with a link to use the token generated, 
        // here is a local option for a email server --> https://github.com/mailhog/MailHog
        
        // The link in the email will looks like: 
        // `http://your-domain/auth/reset/${token}`
        // This here is for testing!
        response.redirect(`http://localhost:3000/auth/reset/${token}`);
    }

    @Patch('reset')
    @HttpCode(200)
    resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto);
    }
}
