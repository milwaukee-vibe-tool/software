import { defineStore } from "pinia";
import { ref } from "vue";
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
}

export const useConnectionStore = defineStore("connection", () => {
  const status = ref(ConnectionStatus.Disconnected);
  function connect() {
    // temp
    status.value = ConnectionStatus.Connecting;
    setTimeout(() => {
      status.value = ConnectionStatus.Disconnected;
    }, 3000);
  }

  async function send(payload: RequestPayload): Promise<ResponsePayload> {
    const requestId = generateRequestId();
    await write({ requestId, payload });
    const response = await receive(requestId);
    return response.payload!;
  }

  async function write(request: Request) {
    const requestBytes = Request.encode(request).finish();
    // todo: send to tx
  }

  async function receive(requestId: number): Promise<Response> {
    // todo: wait for rx response queue to have message matching id
    return { requestId: 0, payload: undefined };
  }

  const requestId = new Uint32Array(1);
  function generateRequestId(): number {
    return requestId[0]++;
  }

  return { status, connect, send };
});
