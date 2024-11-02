import { IsString, IsNotEmpty } from 'class-validator';

export class LoginUserRequest {
  @IsString()
  @IsNotEmpty()
  loginId: string;

  @IsString()
  @IsNotEmpty()
  loginPw: string;
}
