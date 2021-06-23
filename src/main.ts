import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
// import { Socket, Server } from 'socket.io';
// import * as CustomSocket from './gateway/custom.socket';
import { SocketIoAdapter } from './gateway/adapters/socket-io.adapter';

import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  // const server = new Server(app.getHttpServer(), {
  //   cors: {
  //     origin: true,
  //   },
  // });
  // CustomSocket.init(server);
  app.useWebSocketAdapter(new SocketIoAdapter(app, true));
  await app.listen(3000);
}
bootstrap();
