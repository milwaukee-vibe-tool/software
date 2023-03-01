import SerialDriver, { SerialEventTopic, SerialEventHandler } from "./serial";
import Emittery from "emittery";
import { Response } from "../../protobuf/build/typescript/protos/response";
import { LogListLogInfo } from "../../protobuf/build/typescript/protos/responses/logList";
import {
  convertBytesToRequests,
  convertResponseToBytes,
} from "../protocol/protocol";
import {
  LogInfo,
  DataPoint,
} from "../../protobuf/build/typescript/protos/responses/logInfo";

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
      let requestPayload = request.payload.listLogs;
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
      const total = mockLogs.length;
      if (requestPayload.count < mockLogs.length) {
        mockLogs = mockLogs.slice(
          requestPayload.offset,
          requestPayload.offset + requestPayload.count
        );
      }
      response.payload = {
        logList: {
          prefix: 6,
          offset: requestPayload.offset,
          count: mockLogs.length,
          total: total,
          logs: mockLogs,
        },
      };
    } else if (request.payload?.getLog !== undefined) {
      let requestPayload = request.payload.getLog;
      let mockPoints: DataPoint[] = [
        { value: 2 },
        { value: 2 },
        { value: 2 },
        { value: 2 },
        { value: 2 },
        { value: 2 },
        { value: 2 },
        { value: 2 },
        { value: 2 },
        { value: 2 },
        { value: 2 },
        { value: 2 },
        { value: 2 },
        { value: 2 },
        { value: 2 },
        { value: 2 },
        { value: 2 },
        { value: 2 },
      ];
      const total = mockPoints.length;
      if (requestPayload.count < mockPoints.length) {
        mockPoints = mockPoints.slice(
          requestPayload.offset,
          requestPayload.offset + requestPayload.count
        );
      }
      response.payload = {
        logInfo: {
          logId: requestPayload.logId,
          sampleRate: 20,
          offset: requestPayload.offset,
          count: requestPayload.count,
          total: total,
          points: [{ value: 2 }],
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
