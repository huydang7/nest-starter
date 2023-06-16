import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { isNil } from 'lodash';
import { UserEntitySubscriber } from 'src/modules/user/entities/user.subscriber';
import { SnakeNamingStrategy } from 'src/shared/utils/snake-naming.strategy';

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService) {}

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(key + ' environment variable is not a number');
    }
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + ' env var is not a boolean');
    }
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value.replace(/\\n/g, '\n');
  }

  get nodeEnv(): string {
    return this.getString('NODE_ENV');
  }

  get postgresConfig(): TypeOrmModuleOptions {
    const entities = [
      __dirname + '/../modules/**/*.entity{.ts,.js}',
      __dirname + '/../modules/**/*.view-entity{.ts,.js}',
    ];
    const migrations = [__dirname + '/../../database/migrations/*{.ts,.js}'];

    return {
      entities,
      migrations,
      keepConnectionAlive: !this.isTest,
      dropSchema: this.isTest,
      type: 'postgres',
      name: 'default',
      host: this.getString('DB_HOST'),
      port: this.getNumber('DB_PORT'),
      username: this.getString('DB_USERNAME'),
      password: this.getString('DB_PASSWORD'),
      database: this.getString('DB_DATABASE'),
      subscribers: [UserEntitySubscriber],
      migrationsRun: true,
      logging: this.getBoolean('ENABLE_ORM_LOGS'),
      namingStrategy: new SnakeNamingStrategy(),
      synchronize: true,
    };
  }

  get authConfig() {
    return {
      privateKey: this.getString('JWT_PRIVATE_KEY'),
      jwtExpirationTime: this.getNumber('JWT_EXPIRATION_TIME'),
    };
  }

  get appConfig() {
    return {
      port: this.getString('PORT'),
      uploadPath: this.getString('UPLOAD_PATH'),
      hostUrl: this.getString('HOST_URL'),
    };
  }

  get googleMailConfig() {
    return {
      clientId: this.getString('GOOGLE_CLIENT_ID'),
      clientSecret: this.getString('GOOGLE_CLIENT_SECRET'),
      refreshToken: this.getString('GOOGLE_REFRESH_TOKEN'),
      sendFrom: this.getString('GOOGLE_SEND_FROM'),
    };
  }

  private get(key: string): string {
    const value = this.configService.get<string>(key);

    if (isNil(value)) {
      throw new Error(key + ' environment variable does not set');
    }

    return value;
  }
}

export const configService = new ConfigService(new NestConfigService());
