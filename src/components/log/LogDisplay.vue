<template>
  <q-tabs
    v-model="tab"
    class="text-grey"
    active-color="primary"
    indicator-color="primary"
    align="justify"
    narrow-indicator
  >
    <q-tab name="lineGraph" label="Line Graph" />
    <q-tab name="histogram" label="Histogram" />
    <q-tab name="dataTable" label="Data Table" />
  </q-tabs>

  <q-separator />

  <q-tab-panels v-model="tab" animated>
    <q-tab-panel name="lineGraph">
      <line-graph :content="props.log.content" />
    </q-tab-panel>

    <q-tab-panel name="histogram"></q-tab-panel>

    <q-tab-panel name="dataTable"></q-tab-panel>
  </q-tab-panels>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Log } from "../../drivers/log/log";
import LineGraph from "./LineGraph.vue";

const props = defineProps<{
  log: Log;
}>();

const tab = ref("lineGraph");
</script>
