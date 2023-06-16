import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/shared/common/dto/page.dto';
import { Repository } from 'typeorm';

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

  async findAll(pageOption: PageOptionsDto) {
    const result = await this.userRepository.findAndCount({
      ...pageOption.query,
    });
    const pageMeta = new PageMetaDto({
      pageOptionsDto: pageOption,
      itemCount: result[1],
    });
    return new PageDto(result[0].toDtos(), pageMeta);
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
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: string) {
    const { affected } = await this.userRepository.softDelete({
      id,
    });

    return affected > 0;
  }
}
