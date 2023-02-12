import { defineStore } from "pinia";
import { ref } from "vue";
import { RequestPayload } from "../protobuf/build/typescript/protos/request";
import { ResponsePayload } from "../protobuf/build/typescript/protos/response";

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
    // todo
    return {};
  }

  return { status, connect, send };
});
