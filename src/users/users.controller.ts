import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserRequest } from './dto/create-user.request';
import { JwtAuthGuard } from '../auth/jwt/jwt.auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async signUp(@Body() request: CreateUserRequest) {
    await this.usersService.create(request);
  }

  @Get('validation-name')
  async validateUserName(@Query('name') name: string) {
    await this.usersService.isDuplicateUserName(name);
  }

  @Get('validation-loginid')
  async validateLoginId(@Query('loginId') loginId: string) {
    await this.usersService.isDuplicateLoginId(loginId);
  }
}
