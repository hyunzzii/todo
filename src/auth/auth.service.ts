import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CustomException } from '../common/error/custom-exception';
import * as bcrypt from 'bcrypt';
import { LoginUserRequest } from './dto/login-user.request';
import { JwtResponse } from './dto/jwt.response';
import { ErrorCode } from '../common/error/error-codes.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(request: LoginUserRequest) {
    const user = await this.usersService.getByLoginId(request.loginId);
    if (!user || !(await bcrypt.compare(request.loginPw, user.loginPw))) {
      throw new CustomException(ErrorCode.INVALID_LOGIN);
    }

    const payload = { sub: user.id, loginId: user.loginId };
    return new JwtResponse(this.jwtService.sign(payload));
  }
}
