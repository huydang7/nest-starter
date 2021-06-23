import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

@WebSocketGateway({ namespace: '/player', path: '/player' })
export class PlayerGateway implements OnGatewayConnection, OnGatewayInit {
  logger: Logger;
  constructor() {
    this.logger = new Logger();
  }
  afterInit() {
    this.logger.log('Init PlayerGateway');
  }
  handleConnection(client: any, ...args: any[]) {
    console.log('Player Connected', client.id, args);
  }
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any) {
    console.log(client.id, 'send', payload);
  }
}
