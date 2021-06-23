import { Server, Socket, Namespace } from 'socket.io';

export const init = (io: Server) => {
  const dynamicNsp = io.of('/custom-namespace');
  dynamicNsp.on('connection', async (socket: Socket) => {
    const socketClient = new PlayerSocket(io, socket);
    socketClient.start();
  });
};

export class PlayerSocket {
  io: Server;
  socketNsp: Namespace;
  socket: Socket;

  constructor(io: Server, socket: Socket) {
    this.io = io;
    this.socketNsp = socket.nsp;
    this.socket = socket;
  }

  start() {
    this.socket.on('disconnect', this.disconnect);
  }

  disconnect = () => {
    console.log('disconnect');
  };
}
