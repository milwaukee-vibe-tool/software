<!-- <template>
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
</script> -->

<template>
  Hello world, and welcome to the log view. whoo.

  <loading-overlay :show="state === State.LOADING" />
  <error-overlay :show="state === State.ERROR" :refresh="refresh" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useConnectionStore } from "../stores/connection";
import { useRoute } from "vue-router";

const connectionStore = useConnectionStore();
const route = useRoute();

const THROTTLE = 500;

enum State {
  LOADED,
  LOADING,
  LOADING_CHUNK,
  ERROR,
}

const state = ref(State.LOADING);
const logId = [route.params.logId].flat()[0];
const sampleRate = ref(100);
const points = ref<[number, number][]>([]);

async function refresh() {
  state.value = State.LOADING;
  points.value = [];
  loadChunks();
}

async function loadChunks() {
  state.value = State.LOADING_CHUNK;

  console.log("loading chunks");

  try {
    let chunkLength = 0;
    do {
      let payload = await connectionStore.send({
        getLog: { logId: logId, offset: points.value.length, count: THROTTLE },
      });

      let response = payload.logInfo;
      if (response == undefined) throw new Error("Bad response");

      sampleRate.value = response.sampleRate;
      points.value.concat(
        response.points.map((point) => [point.stamp, point.value])
      );
    } while (chunkLength >= THROTTLE);
  } catch (e) {
    state.value = State.ERROR;
    throw e;
  }

  state.value = State.LOADED;
}
</script>
