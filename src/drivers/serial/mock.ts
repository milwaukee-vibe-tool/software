import SerialDriver, { SerialEventTopic, SerialEventHandler } from "./serial";
import Emittery from "emittery";
import { Response } from "../../protobuf/build/typescript/protos/response";
import { LogListLogInfo } from "../../protobuf/build/typescript/protos/responses/logList";
import {
  convertBytesToRequests,
  convertResponseToBytes,
} from "../protocol/protocol";

export class SerialMock implements SerialDriver {
  emitter: Emittery;

  constructor() {
    this.emitter = new Emittery();
  }
  async connect() {
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
  async disconnect() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    this.emitter.emit(SerialEventTopic.Disconnected, {});
  }
  subscribe(topic: SerialEventTopic, handler: SerialEventHandler) {
    this.emitter.on(topic, handler);
  }
  unsubscribe(topic: SerialEventTopic, handler: SerialEventHandler) {
    this.emitter.off(topic, handler);
  }
  async transmit(bytes: Uint8Array) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const request = convertBytesToRequests(bytes)[0][0];
    const response: Response = { requestId: request.requestId, payload: {} };
    if (request.payload?.listLogs !== undefined) {
      let mockLogs: LogListLogInfo[] = [
        {
          logId: "1",
        },
        {
          logId: "2-testing_this",
        },
        {
          logId: "4",
        },
        {
          logId: "5",
        },
        {
          logId: "6-my_test_log",
        },
        {
          logId: "19-allrightlyTHisLog",
        },
        {
          logId: "20",
        },
        {
          logId: "21",
        },
      ];
      if (request.payload.listLogs.count < mockLogs.length) {
        mockLogs = mockLogs.splice(0, request.payload.listLogs.count);
      }
      response.payload = {
        logList: {
          prefix: 6,
          offset: request.payload.listLogs.offset,
          count: mockLogs.length,
          logs: mockLogs,
        },
      };
    } else {
      throw new Error("Mock: unsupported request");
    }
    const responseBytes = convertResponseToBytes(response);
    this.emitter.emit(SerialEventTopic.Received, {
      topic: SerialEventTopic.Received,
      data: {
        bytes: responseBytes,
      },
    });
  }
}
