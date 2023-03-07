<template>
  <div class="column" style="min-height: inherit">
    <div class="col-auto column">
      <div>
        <q-chip color="primary" text-color="white" icon="description">
          File: {{ log.name }}
        </q-chip>
        <q-chip color="primary" text-color="white" icon="bar_chart">
          Sample Rate: {{ log.content.sampleRate }} Hz
        </q-chip>
        <q-chip color="primary" text-color="white" icon="schedule">
          Total Time: {{ totalTime() }}
        </q-chip>
        <q-chip color="primary" text-color="white" icon="alarm">
          Time Exceeding: {{ timeExceeding() }}
        </q-chip>
        <q-chip color="primary" text-color="white" icon="percent">
          Percent Exceeding: {{ percentExceeding() }}
        </q-chip>
      </div>

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
    </div>

    <div class="col-grow row">
      <q-tab-panels v-model="$route.params.view" animated class="full-width">
        <q-tab-panel name="line-graph">
          <line-graph :content="props.log.content" />
        </q-tab-panel>

        <q-tab-panel name="histogram">
          <histogram :content="props.log.content" />
        </q-tab-panel>

        <q-tab-panel name="data-table">
          <data-table :content="props.log.content" />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Log } from "../../drivers/log/log";
import LineGraph from "./LineGraph.vue";
import Histogram from "./Histogram.vue";
import DataTable from "./DataTable.vue";
import { useSettingsStore } from "../../stores/settings";
import { printTime } from "../../drivers/time/time";

const settingsStore = useSettingsStore();

const props = defineProps<{
  log: Log;
}>();

function secondsTotal(): number {
  const seconds = props.log.content.points.map(
    (point) => point[0] / props.log.content.sampleRate
  );
  return Math.max(...seconds);
}

function secondsExceeding(): number {
  return (
    props.log.content.points.filter(
      (point) => point[1] >= settingsStore.threshold
    ).length / props.log.content.sampleRate
  );
}

function totalTime(): string {
  return printTime(secondsTotal());
}

function timeExceeding(): string {
  return printTime(secondsExceeding());
}

function percentExceeding(): string {
  const percent = (secondsExceeding() / secondsTotal()) * 100;
  return `${Math.round(percent * 100) / 100}%`;
}
</script>
