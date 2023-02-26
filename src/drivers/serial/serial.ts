export default interface SerialDriver {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  subscribe(topic: SerialEventTopic, handler: SerialEventHandler): void;
  unsubscribe(topic: SerialEventTopic, callback: SerialEventHandler): void;
  transmit(bytes: Uint8Array): Promise<void>;
}

export class SerialError extends Error {
  constructor(m: string) {
    super(m);
  }
}

export enum SerialEventTopic {
  Disconnected = "disconnected",
  Received = "received",
}

export type SerialDisconnected = {
  topic: SerialEventTopic.Disconnected;
  data: {};
};

export type SerialReceived = {
  topic: SerialEventTopic.Received;
  data: {
    bytes: Uint8Array;
  };
};

export type SerialEvent = SerialDisconnected | SerialReceived;

export type SerialEventHandler = (event: SerialEvent) => void;
