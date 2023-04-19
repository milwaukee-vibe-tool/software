import Emittery from "emittery";
import { defineStore } from "pinia";
import { ref } from "vue";
import {
  convertBytesToResponses,
  convertRequestToBytes,
  convertPayloadToBytes,
  convertBytesToPayloads,
} from "../drivers/protocol/protocol";
import SerialDriver, {
  SerialEvent,
  SerialDisconnected,
  SerialReceived,
  SerialEventTopic,
  ErrorNotConnected,
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
import { SerialNordicUartWebBluetooth } from "../drivers/serial/nordicUartWebBluetooth";

const RESPONSE_TIMEOUT = 5000;

export enum ConnectionStatus {
  Connected,
  Disconnected,
  Connecting,
  Disconnecting,
}

export const useConnectionStore = defineStore("connection", () => {
  const receiver = new Emittery();
  const receiverBytes = new Emittery();

  const serialDriver: SerialDriver = new SerialNordicUartWebBluetooth();

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
    // Ensure connected
    if (status.value !== ConnectionStatus.Connected) {
      throw ErrorNotConnected;
    }

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

  async function sendBytes(bytes: Uint8Array): Promise<Uint8Array> {
    // Ensure connected
    if (status.value !== ConnectionStatus.Connected) {
      throw ErrorNotConnected;
    }

    // Subscribe to receive byte events
    const receiverIterator = receiverBytes.events("bytes");

    // Transmit request
    await serialDriver.transmit(convertPayloadToBytes(bytes));

    // Wait for response
    let timeout: NodeJS.Timeout;
    const result = await Promise.race<IteratorResult<Uint8Array> | undefined>([
      receiverIterator.next(),
      new Promise(
        (_, reject) => (timeout = setTimeout(() => reject(), RESPONSE_TIMEOUT))
      ),
    ]).finally(() => clearTimeout(timeout));

    // Return
    receiverIterator.return?.();
    return result?.value;
  }

  const requestId = new Uint32Array(1);
  function generateRequestId(): number {
    return requestId[0]++;
  }

  let byteQueue = new Uint8Array();
  function processBytes(bytes: Uint8Array) {
    byteQueue = concatBytes([byteQueue, bytes], Uint8Array);
    // let [responses, remainder] = convertBytesToResponses(byteQueue);
    // byteQueue = remainder;
    // for (let response of responses) receiver.emit(response.requestId, response);
    let [responses, remainder] = convertBytesToPayloads(byteQueue);
    byteQueue = remainder;
    for (let response of responses) receiverBytes.emit("bytes", response);
  }

  function eventDisconnected(event: SerialEvent) {
    if (event.topic !== SerialEventTopic.Disconnected)
      throw new Error(`Incorrect event received: ${event.topic}`);

    status.value = ConnectionStatus.Disconnected;
  }

  function eventReceived(event: SerialEvent) {
    if (event.topic !== SerialEventTopic.Received)
      throw new Error(`Incorrect event received: ${event}`);

    processBytes(event.data.bytes);
  }

  return {
    status,
    connect,
    disconnect,
    send,
    sendBytes,
  };
});
