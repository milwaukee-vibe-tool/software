import { defineStore } from "pinia";
import { ref } from "vue";
import { SerialMock } from "../drivers/serial/mock";
import SerialDriver from "../drivers/serial/serial";
import {
  Request,
  RequestPayload,
} from "../protobuf/build/typescript/protos/request";
import {
  Response,
  ResponsePayload,
} from "../protobuf/build/typescript/protos/response";

export enum ConnectionStatus {
  Connected,
  Disconnected,
  Connecting,
  Disconnecting,
}

export const useConnectionStore = defineStore("connection", () => {
  const driver: SerialDriver = new SerialMock();

  const status = ref(ConnectionStatus.Disconnected);

  async function connect() {
    if (status.value != ConnectionStatus.Disconnected) return;

    status.value = ConnectionStatus.Connecting;

    try {
      await driver.connect();
      status.value = ConnectionStatus.Connected;
    } catch (error) {
      status.value = ConnectionStatus.Disconnected;
      throw error;
    }
  }

  async function disconnect() {
    if (status.value != ConnectionStatus.Connected) return;

    status.value = ConnectionStatus.Disconnecting;

    try {
      await driver.disconnect();
      status.value = ConnectionStatus.Disconnected;
    } catch (error) {
      status.value = ConnectionStatus.Connected;
      throw error;
    }
  }

  async function send(payload: RequestPayload): Promise<ResponsePayload> {
    const requestId = generateRequestId();
    await write({ requestId, payload });
    const response = await receive(requestId);
    return response.payload!;
  }

  async function write(request: Request) {
    const payloadBytes = Request.encode(request).finish();
    // todo: send to tx using protocol?
  }

  async function receive(requestId: number): Promise<Response> {
    // todo: wait for rx response queue to have message matching id
    return { requestId: 0, payload: undefined };
  }

  const requestId = new Uint32Array(1);
  function generateRequestId(): number {
    return requestId[0]++;
  }

  function calculateChecksum(bytes: Uint8Array): Uint16Array {
    const values = padBytes(bytes);
    // IPv4 checksum
    let sum = values.reduce((a, b) => a + b, 0);
    while (sum >= 0x10000) {
      sum = Math.floor(sum / 0x10000) + (sum % 0x10000);
    }
    const checksum = new Uint16Array([sum]);
    checksum[0] = ~checksum[0];
    return checksum;
  }

  function verifyChecksum(bytes: Uint8Array, checksum: Uint16Array): boolean {
    const withChecksum = new Uint8Array(bytes.length + 2);
    withChecksum.set(new Uint8Array(checksum.buffer, checksum.byteOffset, 2));
    withChecksum.set(bytes, 2);
    return calculateChecksum(withChecksum)[0] == 0;
  }

  function padBytes(raw: Uint8Array): Uint16Array {
    const padded = new Uint8Array(Math.ceil(raw.length / 2) * 2);
    padded.set(raw);
    return new Uint16Array(padded.buffer, padded.byteOffset, padded.length / 2);
  }

  return {
    status,
    connect,
    disconnect,
    send,
  };
});
