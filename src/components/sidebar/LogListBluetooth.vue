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
    <q-toggle v-model="stream" label="Stream"></q-toggle>
    <q-btn color="primary" class="q-ma-md" @click="navigate"> View Data </q-btn>
    <q-btn color="primary" class="q-ma-md" @click="bluetoothStore.clear()">
      Clear
    </q-btn>
    <q-btn color="primary" class="q-ma-md">Download</q-btn>
    <q-btn color="primary" class="q-ma-md" @click="toggleLed">Toggle LED</q-btn>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { ConnectionStatus, useConnectionStore } from "../../stores/connection";
import { useBluetoothStore } from "../../stores/bluetooth";
import { useRoute, useRouter } from "vue-router";

const connectionStore = useConnectionStore();
const bluetoothStore = useBluetoothStore();

const router = useRouter();
const route = useRoute();

const stream = ref(false);
let streamInterval: ReturnType<typeof setInterval> | null = null;

watch([connectionStore, stream], (_) => {
  if (connectionStore.status == ConnectionStatus.Connected && stream.value) {
    streamInterval = setInterval(async () => {
      let bytes = await connectionStore.sendBytes(new Uint8Array([0]));
      let values = Array.from(new Float32Array(bytes.buffer));
      bluetoothStore.append(values);
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

function navigate() {
  router.push({
    name: "bluetooth",
    params: {
      view: route.params.view || "line-graph",
    },
  });
}
</script>
