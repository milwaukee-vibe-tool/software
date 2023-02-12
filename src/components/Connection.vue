<template>
  <q-btn outline :loading="loading" @click="connectionAction">
    {{ connectionString }}
  </q-btn>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ConnectionStatus, useConnectionStore } from "../stores/connection";
const connection = useConnectionStore();
const loading = computed(() => {
  switch (connection.status) {
    case ConnectionStatus.Connecting:
    case ConnectionStatus.Disconnecting:
      return true;
    default:
      return false;
  }
});
const connectionString = computed(() => {
  switch (connection.status) {
    case ConnectionStatus.Connected:
      return "Disconnect";
    case ConnectionStatus.Disconnected:
      return "Connect";
    default:
      return "Loading";
  }
});
const connectionAction = () => {
  switch (connection.status) {
    case ConnectionStatus.Connected:
      return connection.disconnect();
    case ConnectionStatus.Disconnected:
      return connection.connect();
  }
};
</script>
