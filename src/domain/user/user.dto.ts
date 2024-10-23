import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
    email: string;
    password: string;
    'remember-check'?: boolean;  // 선택사항
}

export class AccountDto {
    @IsEmail()
    email: string;
  
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsString()
    @IsNotEmpty()
    @Length(8, 16) // 비밀번호 길이 제한
    password: string;
  }
