import Emittery from "emittery";
import { defineStore } from "pinia";
import { ref } from "vue";
import {
  convertBytesToResponses,
  convertRequestToBytes,
} from "../drivers/protocol/protocol";
import { SerialMock } from "../drivers/serial/mock";
import SerialDriver, {
  SerialEvent,
  SerialDisconnected,
  SerialReceived,
  SerialEventTopic,
} from "../drivers/serial/serial";
import {
  Request,
  RequestPayload,
} from "../protobuf/build/typescript/protos/request";
import {
  Response,
  ResponsePayload,
} from "../protobuf/build/typescript/protos/response";
import { concatBytes } from "../utils/bytes";

const RESPONSE_TIMEOUT = 5000;

export enum ConnectionStatus {
  Connected,
  Disconnected,
  Connecting,
  Disconnecting,
}

export const useConnectionStore = defineStore("connection", () => {
  const receiver = new Emittery();

  const serialDriver: SerialDriver = new SerialMock();

  serialDriver.subscribe(SerialEventTopic.Disconnected, eventDisconnected);
  serialDriver.subscribe(SerialEventTopic.Received, eventReceived);

  const status = ref(ConnectionStatus.Disconnected);

  async function connect() {
    if (status.value !== ConnectionStatus.Disconnected) return;

    status.value = ConnectionStatus.Connecting;

    try {
      await serialDriver.connect();
      status.value = ConnectionStatus.Connected;
    } catch (error) {
      status.value = ConnectionStatus.Disconnected;
      throw error;
    }
  }

  async function disconnect() {
    if (status.value !== ConnectionStatus.Connected) return;

    status.value = ConnectionStatus.Disconnecting;

    try {
      await serialDriver.disconnect();
      status.value = ConnectionStatus.Disconnected;
    } catch (error) {
      status.value = ConnectionStatus.Connected;
      throw error;
    }
  }

  async function send(payload: RequestPayload): Promise<ResponsePayload> {
    // Generate request id
    const requestId = generateRequestId();

    // Subscribe to receive events
    const receiverIterator = receiver.events(requestId);

    // Transmit request
    await serialDriver.transmit(convertRequestToBytes({ requestId, payload }));

    // Wait for response
    let timeout: NodeJS.Timeout;
    const result = await Promise.race<IteratorResult<Response> | undefined>([
      receiverIterator.next(),
      new Promise(
        (_, reject) => (timeout = setTimeout(() => reject(), RESPONSE_TIMEOUT))
      ),
    ]).finally(() => clearTimeout(timeout));

    // Return
    receiverIterator.return?.();
    return result?.value.payload;
  }

  const requestId = new Uint32Array(1);
  function generateRequestId(): number {
    return requestId[0]++;
  }

  let byteQueue = new Uint8Array();
  function processBytes(bytes: Uint8Array) {
    byteQueue = concatBytes([byteQueue, bytes], Uint8Array);
    let [responses, remainder] = convertBytesToResponses(byteQueue);
    byteQueue = remainder;
    for (let response of responses) receiver.emit(response.requestId, response);
  }

  function eventDisconnected(event: SerialEvent) {
    if (event.topic !== SerialEventTopic.Disconnected)
      throw new Error("Incorrect event received");

    status.value = ConnectionStatus.Disconnected;
  }

  function eventReceived(event: SerialEvent) {
    if (event.topic !== SerialEventTopic.Received)
      throw new Error("Incorrect event received");

    processBytes(event.data.bytes);
  }

  return {
    status,
    connect,
    disconnect,
    send,
  };
});
