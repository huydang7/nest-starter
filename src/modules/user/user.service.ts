import { Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { UserDocument, User } from '../@schema/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async getById(id: string) {
    return this.userModel.findById(id);
  }

  async create(payload: CreateUserDto) {
    return this.userModel.create(payload);
  }

  async getByEmailAndPass(email: string, password: string) {
    return await this.userModel.findOne({
      email,
      password,
    });
  }
  async update(payload: Partial<CreateUserDto>) {
    const res = await this.userModel.findOneAndUpdate(
      { _id: payload._id },
      payload,
      {
        new: true,
      },
    );

    return {
      // expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
      accessToken: this.jwtService.sign({ user: res }),
      user: res,
    };
  }
}
