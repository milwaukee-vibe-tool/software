<template>
  <q-chip color="primary" text-color="white" icon="description">
    File: {{ log.name }}
  </q-chip>
  <q-chip color="primary" text-color="white" icon="bar_chart">
    Sample Rate: {{ log.content.sampleRate }} Hz
  </q-chip>

  <q-tabs
    class="text-grey"
    active-color="primary"
    indicator-color="primary"
    align="justify"
    narrow-indicator
  >
    <q-route-tab to="line-graph" label="Line Graph" />
    <q-route-tab to="histogram" label="Histogram" />
    <q-route-tab to="data-table" label="Data Table" />
  </q-tabs>

  <q-separator />

  <q-tab-panels v-model="$route.params.view" animated>
    <q-tab-panel name="line-graph">
      <line-graph :content="props.log.content" />
    </q-tab-panel>

    <q-tab-panel name="histogram">
      <histogram :content="props.log.content" />
    </q-tab-panel>

    <q-tab-panel name="data-table"></q-tab-panel>
  </q-tab-panels>
</template>

<script setup lang="ts">
import { Log } from "../../drivers/log/log";
import LineGraph from "./LineGraph.vue";
import Histogram from "./Histogram.vue";

const props = defineProps<{
  log: Log;
}>();
</script>
