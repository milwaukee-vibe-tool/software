import { defineStore } from "pinia";
import { ref } from "vue";
import { ParseCSV } from "../drivers/log/csv";
import { Log, LogContent } from "../drivers/log/log";

export const useFileSystemStore = defineStore("filesystem", () => {
  const files = ref<File[]>([]);
  const logs = ref(new Map<number, Log>());

  function loadLog(index: number) {
    if (index >= files.value.length) throw new Error("File not found");
    if (logs.value.has(index)) return;

    const fileReader = new FileReader();
    fileReader.addEventListener("load", () => {
      logs.value.set(index, {
        name: files.value[index].name.split(".")[0],
        content: ParseCSV(fileReader.result as string),
      });
    });
    fileReader.readAsText(files.value[index]);
  }

  return { files, logs, loadLog };
});
