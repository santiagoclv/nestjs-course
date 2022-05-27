export interface ResetPasswordQuery {
    email: string;
    token: string;
    password: string;
    confirm_password: string;
}