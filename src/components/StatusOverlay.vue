<template>
  <q-inner-loading :showing="show()">
    <div v-if="props.loading">
      <q-spinner color="primary" />
    </div>

    <div v-if="props.error">
      <q-icon name="error"></q-icon>
      <p>An error occurred.</p>
      <q-btn primary @click="$emit('refresh')">Refresh</q-btn>
    </div>
  </q-inner-loading>
</template>

<script setup lang="ts">
const props = defineProps<{
  loading: boolean;
  error: boolean;
}>();

const emits = defineEmits(["refresh"]);

function show(): boolean {
  return props.loading || props.error;
}
</script>
