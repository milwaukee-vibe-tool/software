<template>
  <div class="column">
    <q-file
      ref="picker"
      v-model="filesystemStore.files"
      multiple
      append
      v-show="false"
    />
    <q-btn color="primary" @click="picker!.pickFiles()" class="q-ma-md">
      Open Log Files
    </q-btn>
  </div>

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
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

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
    params: {
      logId: getLogs()[index],
      view: route.params.view || "line-graph",
    },
  });
}
</script>
