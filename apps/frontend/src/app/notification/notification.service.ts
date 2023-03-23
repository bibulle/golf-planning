import { Injectable } from '@angular/core';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { Event } from '@golf-planning/api-interfaces';
import { EventsService } from '../services/events.service';

interface SnackMessage {
  message: string;
  action: string;
  className: string;
  duration: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  messages: SnackMessage[] = [];
  timeout: NodeJS.Timeout | undefined;

  constructor(private readonly snackBar: MatSnackBar, private _eventService: EventsService) {
    this._eventService.getEventMessage().subscribe((e: Event) => {
      if (e.message) {
        this.showMessage(e.message, '', 'blue-snackbar');
      }
    });
  }

  /**
   * Presents a toast displaying the message with a green background
   * @param message Message to display
   * @example
   * this.notificationService.success("confirm oked");
   */
  success(message: string) {
    this.showMessage(message, '', 'success-snackbar');
  }

  /**
   * Presents a toast displaying the message with a red background
   * @param message Message to display
   * @example
   * this.notificationService.error("confirm canceled");
   */
  error(message: string) {
    this.showMessage(message, '', 'error-snackbar');
  }

  private showMessage(message: string, action: string, className = '', duration = 1000) {
    this.messages.push({ message: message, action: action, className: className, duration: duration });
    this.showMessages();
  }

  private showMessages() {
    if (this.messages.length === 0 || this.timeout) {
      return;
    }

    const snack = this.messages.shift();
    if (snack) {
      this.openSnackBar(snack.message, snack.action, snack.className, snack.duration);

      this.timeout = setTimeout(() => {
        this.timeout = undefined;
        this.showMessages();
      }, snack.duration + 500);
    }
  }

  /**
   * Displays a toast with provided message
   * @param message Message to display
   * @param action Action text, e.g. Close, Done, etc
   * @param className Optional extra css class to apply
   * @param duration Optional number of SECONDS to display the notification for
   */
  private openSnackBar(message: string, action: string, className = '', duration = 1000) {
    console.log(message);

    this.snackBar.open(message, action, {
      duration: duration,
      panelClass: [className],
    });
  }
}
