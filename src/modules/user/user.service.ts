import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from './dto/user-dto';
import {
  PageDto,
  PageMetaDto,
  PageOptionsDto,
} from 'src/shared/common/dto/page.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
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
    return new UserDto(user);
  }

  async findAll(pageOption: PageOptionsDto) {
    const result = await this.userRepository.findAndCount({
      ...pageOption.query,
    });
    const pageMeta = new PageMetaDto({
      pageOptionsDto: pageOption,
      itemCount: result[1],
    });
    return new PageDto(
      result[0].map((user) => new UserDto(user)),
      pageMeta,
    );
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({
      id,
    });

    return new UserDto(user);
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOneBy({
      email,
    });

    return new UserDto(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({
      id,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, updateUserDto);
    return new UserDto(await this.userRepository.save(user));
  }

  async remove(id: string) {
    const { affected } = await this.userRepository.softDelete({
      id,
    });

    return affected > 0;
  }
}
