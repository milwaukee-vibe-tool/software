<template>
  <div class="column">
    <q-btn
      color="primary"
      class="q-ma-md"
      @click="connectionAction"
      :loading="loadingStatus()"
    >
      {{ connectionString() }}
    </q-btn>
  </div>

  <q-separator spaced />

  <div class="column">
    <q-btn color="primary" class="q-ma-md" @click="toggleLed">Toggle LED</q-btn>
  </div>
</template>

<script setup lang="ts">
import { ConnectionStatus, useConnectionStore } from "../../stores/connection";

const connectionStore = useConnectionStore();

function loadingStatus() {
  switch (connectionStore.status) {
    case ConnectionStatus.Connecting:
    case ConnectionStatus.Disconnecting:
      return true;
    default:
      return false;
  }
}

function connectionString() {
  switch (connectionStore.status) {
    case ConnectionStatus.Connected:
      return "Disconnect";
    case ConnectionStatus.Disconnected:
      return "Connect";
    default:
      return "Loading";
  }
}

function connectionAction() {
  switch (connectionStore.status) {
    case ConnectionStatus.Connected:
      return connectionStore.disconnect();
    case ConnectionStatus.Disconnected:
      return connectionStore.connect();
  }
}

async function toggleLed() {
  connectionStore.sendBytes(new Uint8Array([3]));
}
</script>
