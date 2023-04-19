<template>
  <q-tabs
    v-model="tab"
    class="text-grey"
    active-color="primary"
    indicator-color="primary"
    align="justify"
    narrow-indicator
  >
    <q-tab name="filesystem" label="File System" />
    <q-tab name="bluetooth" label="Bluetooth" />
  </q-tabs>

  <q-separator />

  <q-tab-panels v-model="tab" animated keep-alive>
    <q-tab-panel name="filesystem" class="q-pa-none">
      <log-list-file-system />
    </q-tab-panel>

    <q-tab-panel name="bluetooth" class="q-pa-none">
      <log-list-bluetooth />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup lang="ts">
import { ref } from "vue";
import LogListFileSystem from "./LogListFileSystem.vue";
import LogListBluetooth from "./LogListBluetooth.vue";

const tab = ref("filesystem");
</script>
