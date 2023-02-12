import SerialDriver, { SerialEventTopic, SerialEventHandler } from "./serial";
import Emittery from "emittery";

export class SerialMock implements SerialDriver {
  emitter: Emittery;

  constructor() {
    this.emitter = new Emittery();
  }
  async connect() {
    return new Promise((resolve) => setTimeout(resolve, 3000));
  }
  async disconnect() {
    return new Promise((resolve) => setTimeout(resolve, 500));
  }
  subscribe(topic: SerialEventTopic, handler: SerialEventHandler) {
    this.emitter.on(topic, handler);
  }
  unsubscribe(topic: SerialEventTopic, handler: SerialEventHandler) {
    this.emitter.off(topic, handler);
  }
  async transmit(bytes: Uint8Array) {}
}
