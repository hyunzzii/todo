import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { CustomException } from '../common/error/custom-exception';
import { CreateUserRequest } from './dto/create-user.request';
import { ErrorCode } from '../common/error/error-codes.enum';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async isDuplicateLoginId(loginId: string): Promise<void> {
    if (await this.userModel.findOne({ loginId })) {
      throw new CustomException(ErrorCode.DUPLICATED_LOGIN_ID);
    }
  }

  async isDuplicateUserName(username: string): Promise<void> {
    if (await this.userModel.findOne({ username })) {
      throw new CustomException(ErrorCode.DUPLICATED_USERNAME);
    }
  }

  async create(request: CreateUserRequest): Promise<User> {
    const hashedPassword = await bcrypt.hash(request.loginPw, 10);
    const newUser = new this.userModel({
      username: request.username,
      loginId: request.loginId,
      loginPw: hashedPassword,
    });
    return newUser.save();
  }

  async getById(id: number): Promise<User | undefined> {
    const user = await this.userModel.findById({ _id: id }).exec();
    if (!user) {
      throw new CustomException(ErrorCode.NOT_FOUND_USER);
    }
    return user;
  }

  async getByUserName(username: string): Promise<User | undefined> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new CustomException(ErrorCode.NOT_FOUND_USER);
    }
    return user;
  }

  async getByLoginId(loginId: string): Promise<User | undefined> {
    const user = await this.userModel.findOne({ loginId }).exec();
    if (!user) {
      throw new CustomException(ErrorCode.NOT_FOUND_USER);
    }
    return user;
  }
}
