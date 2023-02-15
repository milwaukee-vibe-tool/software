import { defineStore } from "pinia";
import { useConnectionStore } from "./connection";
import { reactive } from "vue";
import { ErrorCode } from "../protobuf/build/typescript/protos/responses/error";

export interface LogListStore {
  loading: boolean;
  list: string[] | undefined;
}

export interface LogInfoStore {
  loading: boolean;
  sampleRate: number;
  points: [number, number][];
}

const ErrorResponseType = new Error("Bad response type received");

export const useControlStore = defineStore("control", () => {
  const connectionStore = useConnectionStore();

  const THROTTLE_LOGS = 20;
  const THROTTLE_POINTS = 500;

  // States:
  // Unloaded: loading=false, list=undefined
  // Loading: loading=true
  // Loaded: loading=false, list=string[]
  const logList = reactive<LogListStore>({ loading: false, list: undefined });

  // States:
  // Unloaded: map.has(id)=false
  // Loading: map.has(id)=true, map.get(id)=undefined
  // Loaded: map.has(id)=true, map.get(id)=LogInfo
  // Loading points: map.get(id).loading=true
  const logInfo = reactive<Map<string, LogInfoStore | undefined>>(new Map());

  async function listLogs() {
    logList.loading = true;
    let list: string[] = [];
    let chunkLength = 0;
    do {
      let payload = await connectionStore.send({
        listLogs: { offset: list.length, count: THROTTLE_LOGS },
      });
      let chunk = payload.logList;
      if (chunk == undefined) throw ErrorResponseType;
      list.concat(chunk.logs.map((entry) => entry.logId));
      chunkLength = chunk.count;
    } while (chunkLength < THROTTLE_LOGS);
    logList.list = list;
    logList.loading = false;
  }
  async function newLog(logId: string) {
    logList.loading = true;
    await connectionStore.send({ newLog: { logId: logId, sampleRate: 0 } });
    await listLogs();
  }
  async function deleteLog(logId: string) {
    logList.loading = true;
    await connectionStore.send({ deleteLog: { logId: logId } });
    await listLogs();
  }
  async function formatSd() {
    logList.loading = true;
    await connectionStore.send({ formatSd: {} });
    await listLogs();
  }

  async function getLog(logId: string) {
    let info = logInfo.get(logId);

    // check if log has ever been retrieved
    if (info == undefined) {
      logInfo.set(logId, undefined);
      let payload = await connectionStore.send({
        getLog: { logId: logId, offset: 0, count: THROTTLE_POINTS },
      });
      let chunk = payload.logInfo;
      if (chunk == undefined) {
        logInfo.delete(logId);
        if (
          payload.error != undefined &&
          payload.error.code == ErrorCode.NOT_FOUND
        ) {
          return;
        } else {
          throw ErrorResponseType;
        }
      }
      info = {
        loading: true,
        sampleRate: chunk.sampleRate,
        points: chunk.points.map((point) => [point.stamp, point.value]),
      };
    }

    // check for more points
    info.loading = true;
    let chunkLength = 0;
    do {
      let payload = await connectionStore.send({
        getLog: { logId: logId, offset: 0, count: THROTTLE_POINTS },
      });
      let chunk = payload.logList;
      if (chunk == undefined) throw ErrorResponseType;
      list.concat(chunk.logs.map((entry) => entry.logId));
      chunkLength = chunk.count;
    } while (chunkLength < THROTTLE_LOGS);
    logList.list = list;
    info.loading = false;
  }

  return { logList, logInfo, deleteLog, formatSd, getLog, listLogs, newLog };
});
