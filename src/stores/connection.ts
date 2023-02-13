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

  return {
    status,
    connect,
    disconnect,
    send,
  };
});
