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

  <div>
    <q-btn color="primary" class="q-ma-md" @click="toggleLed">Toggle LED</q-btn>
    <q-toggle v-model="stream" label="Stream data"></q-toggle>
    <q-btn color="primary" class="q-ma-md">Download</q-btn>
    <q-btn color="primary" class="q-ma-md" @click="bluetoothStore.clear()">
      Clear
    </q-btn>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { ConnectionStatus, useConnectionStore } from "../../stores/connection";
import { useBluetoothStore } from "../../stores/bluetooth";

const connectionStore = useConnectionStore();
const bluetoothStore = useBluetoothStore();

const stream = ref(false);
let streamInterval: ReturnType<typeof setInterval> | null = null;

watch([connectionStore, stream], (_) => {
  if (connectionStore.status == ConnectionStatus.Connected && stream.value) {
    streamInterval = setInterval(async () => {
      let values = await connectionStore.sendBytes(new Uint8Array([0]));
      let floats = [];
      for (let i = 0; i < values.length; i++)
        floats.push((values[i] / 200) * 7);
      bluetoothStore.append(floats);
    }, 1000);
  } else if (streamInterval) {
    clearInterval(streamInterval);
    streamInterval = null;
  }
});

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
