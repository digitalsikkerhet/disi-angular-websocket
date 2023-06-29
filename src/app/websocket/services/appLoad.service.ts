import { Injectable } from "@angular/core";
import { WebsocketService } from "./websocket.service";

@Injectable()
export class AppLoadService {
  constructor(private websocketService: WebsocketService) {}
  init() {
    this.websocketService.init(); 
  }
}

export function loadApp(appLoadService: AppLoadService) {
  return () => appLoadService.init();
}
