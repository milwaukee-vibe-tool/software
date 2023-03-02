import { defineStore } from "pinia";
import { ref } from "vue";

export const useFileSystemStore = defineStore("filesystem", () => {
  const files = ref<File[]>([]);
  return { files };
});
