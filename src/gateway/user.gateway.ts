import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

@WebSocketGateway({ namespace: '/user', path: '/user' })
export class UserGateway implements OnGatewayConnection, OnGatewayInit {
  logger: Logger;
  constructor() {
    this.logger = new Logger();
  }
  afterInit() {
    this.logger.log('Init UserGateway');
  }
  handleConnection(client: any, ...args: any[]) {
    this.logger.log(`Player Connected: ${client.id} , ${args}`);
  }
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any) {
    console.log(client.id, 'send', payload);
  }
}
