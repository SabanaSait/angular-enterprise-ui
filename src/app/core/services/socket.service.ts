import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket!: Socket;

  public connect(namespace: string) {
    if (this.socket?.connected) return;

    this.socket = io(`http://localhost:3000/${namespace}`, {
      transports: ['websocket'],
    });
  }

  public listen<T>(event: string): Observable<T> {
    return new Observable((observer) => {
      this.socket.on(event, (data: T) => {
        observer.next(data);
      });

      return () => this.socket.off(event);
    });
  }

  public disconnect() {
    this.socket?.disconnect();
  }
}
