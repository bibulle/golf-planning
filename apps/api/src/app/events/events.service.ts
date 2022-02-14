import { EventType } from '@golf-planning/api-interfaces';
import { Injectable } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

@Injectable()
export class EventsService {

    constructor(private eventsGateway: EventsGateway) {}

    courseUpdated() {
        this.eventsGateway.emiteEvent(EventType.NEW_COURSE);
    }
    planningUpdated() {
        this.eventsGateway.emiteEvent(EventType.NEW_PLANNING);
    }
    userUpdated() {
        this.eventsGateway.emiteEvent(EventType.NEW_USER);
    }
    sendMessage(msg: string) {
        this.eventsGateway.emiteEvent(EventType.MESSAGE, msg);
    }


    geConnectedClientCount(): number {
        return this.eventsGateway.wsClients.length;
    }
}
