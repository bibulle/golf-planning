/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { EventType } from '@golf-planning/api-interfaces';

@WebSocketGateway({
  cors: { origin: '*' },
  path: '/stream',
})
export class EventsGateway {
  private Logger = new Logger('EventsGateway'); 

  wsClients: Socket[]=[];

  @WebSocketServer() 
  server: Server;

  afterInit() {
    this.Logger.log('App Gateway Initialized');

    // setInterval(() => {
    //   this.emiteEvent(EventType.NEW_COURSE);
    // }, 2000);
    // setInterval(() => {
    //   this.emiteEvent(EventType.UNKNOWN);
    // }, 3000);
  }

  @SubscribeMessage('events')
  onEvent(client: any, data: any): void {
    console.log(`events ${data}`);
  }
  

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleConnection(client: Socket, ...args: any[]) {
    this.Logger.log(`New client connected...: ${client.id}`);
    
    this.wsClients.push(client);

  }

  handleDisconnect(client: Socket) {
    this.Logger.log(`Client disconnected: ${client.id}`);
    for (let i = 0; i < this.wsClients.length; i++) {
      if (this.wsClients[i] === client) {
        this.wsClients.splice(i, 1);
        break;
      }
    }
  }

  emiteEvent(msg: EventType) {
    for (const c of this.wsClients) {
      c.send(JSON.stringify(msg));
    }
   }
}
