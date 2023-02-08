<template>
  <main>
    <Welcome />
  </main>
  <router-link to="/log/testing/line-graph">Sample graph</router-link>
</template>

<script lang="ts">
import Welcome from "../components/Welcome.vue";

export default {
  components: {
    Welcome,
  },
};
</script>
