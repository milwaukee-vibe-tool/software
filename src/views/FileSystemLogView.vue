<template>
  <log-display :log="log" />
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useRoute } from "vue-router";
import { useFileSystemStore } from "../stores/filesystem";
import LogDisplay from "../components/log/LogDisplay.vue";
import { Log } from "../drivers/log/log";
import { ParseCSV } from "../drivers/log/csv";

const filesystemStore = useFileSystemStore();
const route = useRoute();

const log = reactive<Log>({
  name: [route.params.logId].flat()[0],
  content: {
    points: [],
    sampleRate: 0,
  },
});

// Get file from store
const files = filesystemStore.files.filter(
  (file) => file.name.split(".")[0] === log.name
);
let file: File;
if (files.length === 0) {
  // todo: not found
  throw new Error("Log not found");
} else if (files.length === 1) {
  file = files[0];
} else {
  // add index query parameter?
  throw new Error("Multiple files match log");
}

// Read the file
const fileReader = new FileReader();
fileReader.addEventListener("load", () => {
  log.content = ParseCSV(fileReader.result as string);
});
fileReader.readAsText(file);
</script>
