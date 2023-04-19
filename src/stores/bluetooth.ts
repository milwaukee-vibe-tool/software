import { defineStore } from "pinia";
import { ref } from "vue";
import { ParseCSV } from "../drivers/log/csv";
import { Log, LogContent } from "../drivers/log/log";

export const useBluetoothStore = defineStore("bluetooth", () => {
  const log = ref<Log>({
    name: "bluetooth-livestream",
    content: {
      sampleRate: 100,
      points: [],
    },
  });

  function append(values: number[]) {
    log.value.content.points = log.value.content.points.concat(
      values.map((value, index) => [
        log.value.content.points.length + index,
        value,
      ])
    );
  }

  function clear() {
    log.value.content.points = [];
  }

  return { log, append, clear };
});
