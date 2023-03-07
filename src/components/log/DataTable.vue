<template>
  <div>
    <q-table :rows="rows()" :columns="columns" row-key="tick">
      <template v-slot:body-cell="props">
        <q-td
          :props="props"
          :style="
            props.row.value >= settingsStore.threshold
              ? `background-color: ${Color(getCssVar('negative')!).alpha(0.25).string()}`
              : ''
          "
        >
          {{ props.value }}
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import Color from "color";
import { getCssVar } from "quasar";
import { LogContent } from "../../drivers/log/log";
import { printTime } from "../../drivers/time/time";
import { useSettingsStore } from "../../stores/settings";

const settingsStore = useSettingsStore();

const props = defineProps<{
  content: LogContent;
}>();

const columns = [
  {
    name: "tick",
    required: true,
    label: "Tick",
    field: (row: Row) => row.tick,
  },
  {
    name: "time",
    required: true,
    label: "Time",
    field: (row: Row) => row.time,
  },
  {
    name: "vibrations",
    required: true,
    label: "Vibrations (m/s)",
    field: (row: Row) => row.value,
  },
];

type Row = {
  tick: number;
  time: string;
  value: number;
};

function rows(): Row[] {
  return props.content.points.map(([tick, value]) => ({
    tick: tick,
    time: printTime(tick / props.content.sampleRate),
    value: Math.round(value * 1000) / 1000,
  }));
}
</script>
