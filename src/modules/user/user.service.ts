import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Role } from '@/constants';
import { PageMetaDto } from '@/shared/common/dto/page-meta.dto';
import { PageOptionsDto } from '@/shared/common/dto/page-option.dto';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  async create(createUserDto: CreateUserDto) {
    const isEmailTaken = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (isEmailTaken) {
      throw new BadRequestException({
        errorCode: 100,
        message: 'Email already taken',
      });
    }
    const user = this.userRepository.create(createUserDto);
    await this.userRepository.save(user);
    return user;
  }

  async findAll(pageOption: PageOptionsDto, query: { role: Role[] }) {
    let where = {};

    if (query.role) {
      where = {
        role: In(query.role),
      };
    }
    const result = await this.userRepository.findAndCount({
      ...pageOption.query,
      where,
    });
    const pageMeta = new PageMetaDto({
      pageOptionsDto: pageOption,
      itemCount: result[1],
    });
    return result[0].toPageDto(pageMeta);
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({
      id,
    });

    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOneBy({
      email,
    });

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({
      id,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!updateUserDto.password) {
      delete user.password;
      delete updateUserDto.password;
    }
    return await this.userRepository.save(this.userRepository.merge(user, updateUserDto));
  }

  async remove(id: string) {
    const { affected } = await this.userRepository.softDelete({
      id,
    });

    return affected > 0;
  }
}
