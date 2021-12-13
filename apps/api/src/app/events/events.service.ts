import { EventType } from '@golf-planning/api-interfaces';
import { Injectable } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

@Injectable()
export class EventsService {

    constructor(private eventsGateway: EventsGateway) {}

    courseUpdated() {
        this.eventsGateway.emiteEvent(EventType.NEW_COURSE);
    }
}
