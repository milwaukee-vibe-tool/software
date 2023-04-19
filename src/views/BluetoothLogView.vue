<template>
  <log-display :log="bluetoothStore.log" />
</template>

<script setup lang="ts">
import { useBluetoothStore } from "../stores/bluetooth";
import LogDisplay from "../components/log/LogDisplay.vue";

const bluetoothStore = useBluetoothStore();
</script>
