import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUserRequest {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  loginId: string;

  @IsString()
  @IsNotEmpty()
  loginPw: string;
}
