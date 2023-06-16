import { UserDto } from 'src/modules/user/dto/user.dto';

interface ITokenPayload {
  [key: string]: {
    value: string;
    expires: string;
  };
}

export class UserLoginPayloadDto {
  user: UserDto;
  tokens: ITokenPayload;

  constructor(user: UserDto, tokens: ITokenPayload) {
    Object.assign(this, {
      user,
      tokens,
    });
  }
}
