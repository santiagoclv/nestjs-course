import { Body, Controller, Get, Headers, HttpCode, Param, Patch, Post, Query, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { TwoFactorAuthDto } from './dto/two-factor-auth.dto';
import { LoginResponseDto } from './dto/login-response.dto';

const crypto = import('crypto');

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('singup')
    @HttpCode(302)
    registerRedirect(
        @Headers('referer') referer: string,
        @Res({ passthrough: true }) response: Response
    ){
        return response.redirect(302, `http://localhost:3001/singup?referer=${referer}`);
    }

    @Get('singin')
    @HttpCode(302)
    loginRedirect(
        @Headers('referer') referer: string,
        @Res({ passthrough: true }) response: Response
    ){
        return response.redirect(302, `http://localhost:3001/singin?referer=${referer}`); 
    }

    @Post('register')
    @HttpCode(302)
    async register(
        @Query('referer') referer: string,
        @Body() registerUserDto: RegisterUserDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        await this.authService.register(registerUserDto);
        response.type('html');
        response.contentType('html');
        return response.redirect(302, referer); 
    }

    @Post('login')
    @HttpCode(200)
    login(@Body() loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
        return this.authService.login(loginUserDto);
    }

    @Post('tfa')
    @HttpCode(200)
    async twoFactoraAuth(
        @Body() twoFactorAuthDto: TwoFactorAuthDto,
        @Res({ passthrough: true }) response: Response
    ) {
        const { access_token, refresh_token } = await this.authService.twoFactorAuth(twoFactorAuthDto);
        response.cookie("access_token", access_token, { httpOnly: true });
        response.cookie("refresh_token", refresh_token, { httpOnly: true });
    }

    @Get('refresh')
    @HttpCode(200)
    async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
        const access_token = await this.authService.refresh(request.cookies['refresh_token']);
        response.cookie("access_token", access_token, { httpOnly: true });
    }

    @Get('logout')
    @HttpCode(200)
    async logout(@Res({ passthrough: true }) response: Response) {
        response.cookie("access_token", '', { maxAge: 0 });
        response.cookie("refresh_token", '', { maxAge: 0 });
    }

    @Post('forgot')
    @HttpCode(200)
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        const { email } = forgotPasswordDto;
        const token = (await crypto).randomUUID();
        await this.authService.storeTokenForgotPassword(token, email);
        // Here you need to send a email with a link to use the token generated, 
        // here is a local option for a email server --> https://github.com/mailhog/MailHog
        
        // The link in the email will looks like: 
        // `http://your-domain/auth/reset/${token}`
        // This here is for testing!
        return token;
    }

    @Patch('reset')
    @HttpCode(200)
    resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto);
    }
}
