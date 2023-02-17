<template>
  <q-inner-loading :showing="props.show"> </q-inner-loading>
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean;
}>();
</script>
