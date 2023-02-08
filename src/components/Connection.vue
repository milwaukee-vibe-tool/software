<template>
  <q-btn
    outline
    :loading="connection.status == ConnectionStatus.Connecting"
    @click="connection.connect"
  >
    Connect
  </q-btn>
</template>

<script setup lang="ts">
import { ConnectionStatus, useConnectionStore } from "../stores/connection";
const connection = useConnectionStore();
</script>
