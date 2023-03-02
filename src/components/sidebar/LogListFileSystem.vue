<template>
  <q-file
    ref="picker"
    v-model="filesystemStore.files"
    multiple
    append
    v-show="false"
  />
  <q-btn primary @click="picker!.pickFiles()">Open Log Files</q-btn>

  <q-separator spaced />

  <q-item-label header>Log Files</q-item-label>
  <log-list-navigator
    :logs="getLogs()"
    @remove="remove"
    @download="download"
    @navigate="navigate"
  />
</template>

<script setup lang="ts">
import { QFile } from "quasar";
import { ref } from "vue";
import LogListNavigator from "./LogListNavigator.vue";
import { useFileSystemStore } from "../../stores/filesystem";
import { useRouter } from "vue-router";

const router = useRouter();

const filesystemStore = useFileSystemStore();

const picker = ref<QFile>();

function getLogs(): string[] {
  return filesystemStore.files.map((file) => file.name.split(".")[0]);
}

function remove(index: number) {
  picker.value!.removeAtIndex(index);
}

function download(index: number) {}

function navigate(index: number) {
  router.push({
    name: "filesystem/log",
    params: { logId: getLogs()[index] },
    query: { view: router.currentRoute.value.query.view },
  });
}
</script>
