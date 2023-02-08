<template>
  <p>This is the log view for log "{{ $route.params.id }}"</p>
  <q-btn>Anything?</q-btn>
  <LineGraph />
</template>

<script lang="ts">
import LineGraph from "../components/LineGraph.vue";

export default {
  components: {
    LineGraph,
  },
};
</script>
