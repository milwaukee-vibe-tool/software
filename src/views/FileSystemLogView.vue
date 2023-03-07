<template>
  <log-display :log="log()" />
  <q-inner-loading :showing="loading" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useFileSystemStore } from "../stores/filesystem";
import LogDisplay from "../components/log/LogDisplay.vue";
import { Log } from "../drivers/log/log";

const fileSystemStore = useFileSystemStore();
const router = useRouter();
const route = useRoute();

const loading = ref(false);

function log(): Log {
  const name = [route.params.logId].flat()[0];

  // Get file from store
  const index = fileSystemStore.files.findIndex(
    (file) => file.name.split(".")[0] === name
  );
  // todo: avoid this, add index to query?
  if (index === -1) {
    router.push({ name: "error404" });
    return { name: "", content: { points: [], sampleRate: 0 } };
  }

  fileSystemStore.loadLog(index);

  const log = fileSystemStore.logs.get(index);
  if (log == undefined) {
    loading.value = true;
    return {
      name: fileSystemStore.files[index].name,
      content: { points: [], sampleRate: 0 },
    };
  }
  loading.value = false;
  return log;
}
</script>
