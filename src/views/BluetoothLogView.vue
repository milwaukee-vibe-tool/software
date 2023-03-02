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
  Hello world, and welcome to the log view. whoo. Log: {{ logId }}
  <LineGraph :points="points" />

  <status-overlay
    :loading="state === State.LOADING"
    :error="state === State.ERROR"
    @refresh="refresh"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useConnectionStore } from "../stores/connection";
import { useRoute } from "vue-router";
import StatusOverlay from "../components/StatusOverlay.vue";
import LineGraph from "../components/log/LineGraph.vue";

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

  try {
    let chunkLength = 0;
    do {
      let payload = await connectionStore.send({
        getLog: { logId: logId, offset: points.value.length, count: THROTTLE },
      });
      console.log(payload);

      let response = payload.logInfo;
      if (response == undefined) throw new Error("Bad response");

      sampleRate.value = response.sampleRate;
      points.value = points.value.concat(
        response.points.map((point, index) => [
          response!.offset + index,
          point.value,
        ])
      );
      points.value.sort((a, b) => a[0] - b[0]);
    } while (chunkLength >= THROTTLE);
  } catch (e) {
    state.value = State.ERROR;
    throw e;
  }

  state.value = State.LOADED;
}

refresh();
</script>
