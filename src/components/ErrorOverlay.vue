<template>
  <q-inner-loading :showing="props.show">
    <q-icon name="error"></q-icon>
    A connection error occurred.
    <q-btn @click="props.refresh">Refresh</q-btn>
  </q-inner-loading>
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean;
  refresh: () => void;
}>();
</script>
