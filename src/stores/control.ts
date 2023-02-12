import { defineStore } from "pinia";
import { useConnectionStore } from "./connection";
import { DeleteLog } from "../protobuf/build/typescript/protos/requests/deleteLog";
import { FormatSd } from "../protobuf/build/typescript/protos/requests/formatSd";
import { GetLog } from "../protobuf/build/typescript/protos/requests/getLog";
import { ListLogs } from "../protobuf/build/typescript/protos/requests/listLogs";
import { NewLog } from "../protobuf/build/typescript/protos/requests/newLog";
import { LogList } from "../protobuf/build/typescript/protos/responses/logList";
import { LogInfo } from "../protobuf/build/typescript/protos/responses/logInfo";

export const useControlStore = defineStore("control", () => {
  const connectionStore = useConnectionStore();

  // todo: implement caching if you feel like it

  async function deleteLog(deleteLog: DeleteLog) {
    return connectionStore.send({ deleteLog });
  }
  async function formatSd(formatSd: FormatSd) {
    return connectionStore.send({ formatSd });
  }
  async function getLog(getLog: GetLog): Promise<LogInfo> {
    return checkDefined((await connectionStore.send({ getLog })).logInfo);
  }
  async function listLogs(listLogs: ListLogs): Promise<LogList> {
    return checkDefined((await connectionStore.send({ listLogs })).logList);
  }
  async function newLog(newLog: NewLog) {
    return connectionStore.send({ newLog });
  }

  function checkDefined<Type>(payload?: Type): Type {
    // todo: is this crappy code? it feels like crappy code
    return (
      payload! ??
      (() => {
        throw new Error("Response type is incorrect.");
      })
    );
  }

  return { deleteLog, formatSd, getLog, listLogs, newLog };
});
