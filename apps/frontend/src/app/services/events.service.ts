/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { EventType } from '@golf-planning/api-interfaces';
import {
  BehaviorSubject,
  delayWhen,
  filter,
  retryWhen,
  tap,
  timer,
} from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private socket$: WebSocketSubject<any> | undefined;
  private event$: BehaviorSubject<any> = new BehaviorSubject(EventType);
  socket: any;

  constructor() {
    // this.sendEvent("testtest1");

  }

  private connect(): WebSocketSubject<any> {

    const protocol = window.location.protocol.replace('http', 'ws');
    const host = window.location.host;
    
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket({
        //url: `ws://localhost:3333/stream`,
        url: `${protocol}//${host}/stream`,
      });

      this.socket$
        .pipe(
          tap((data) => {
            // console.log(data);
            this.event$.next(data);
          }),
          retryWhen((errors) =>
            errors.pipe(
              delayWhen(() => {
                //console.log(val);
                return timer(1000);
              })
            )
          )
        )
        .subscribe();

    }
    return this.socket$;
  }

  // private dataUpdates$() {
  //   return this.connect().asObservable();
  // }

  private closeConnection() {
    this.connect().complete();
  }

  public sendEvent(msg: any) {
    this.connect().next({
      event: 'events',
      data: msg,
    });
  }


  public getEventNewPlanning() {
    this.connect();
    return this.event$
      .asObservable()
      //.pipe(tap((e) => console.log(`${e} (${e === EventType.NEW_COURSE})`)))
      .pipe(filter((e: EventType) => e === EventType.NEW_PLANNING));
  }
}
