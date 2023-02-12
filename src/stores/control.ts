import { defineStore } from "pinia";
import { useConnectionStore } from "./connection";
import { DeleteLog } from "../protobuf/build/typescript/protos/requests/deleteLog";
import { FormatSd } from "../protobuf/build/typescript/protos/requests/formatSd";
import { GetLog } from "../protobuf/build/typescript/protos/requests/getLog";
import { ListLogs } from "../protobuf/build/typescript/protos/requests/listLogs";
import { NewLog } from "../protobuf/build/typescript/protos/requests/newLog";
import { LogList } from "../protobuf/build/typescript/protos/responses/logList";
import { LogInfo } from "../protobuf/build/typescript/protos/responses/logInfo";
import { ref } from "vue";

export interface LogListEntry {
  name: string;
}

export interface LogInfoEntry {
  logId: string;
  sampleRate: number;
  points: [number, number][];
}

export const useControlStore = defineStore("control", () => {
  const connectionStore = useConnectionStore();

  const logList = ref<LogListEntry[]>([]);
  const logInfo = ref(new Map<string, LogInfoEntry>());

  async function deleteLog(deleteLog: DeleteLog) {
    return connectionStore.send({ deleteLog });
    // todo: remove log
  }
  async function formatSd(formatSd: FormatSd) {
    return connectionStore.send({ formatSd });
    // todo: remove all files
  }
  async function getLog(getLog: GetLog) {
    return (await connectionStore.send({ getLog })).logInfo;
    // todo: add to logInfo
  }
  async function listLogs(listLogs: ListLogs) {
    return (await connectionStore.send({ listLogs })).logList;
    // todo: add to log list
  }
  async function newLog(newLog: NewLog) {
    return connectionStore.send({ newLog });
    // todo: add to log list
  }

  return { logList, logInfo, deleteLog, formatSd, getLog, listLogs, newLog };
});
