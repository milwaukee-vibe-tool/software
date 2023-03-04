<template>
  <Line :options="options" :data="data()" />
</template>

<script setup lang="ts">
import {
  CategoryScale,
  Chart as ChartJS,
  ChartData,
  ChartOptions,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Filler,
} from "chart.js";
import { Point } from "chart.js/dist/helpers/helpers.canvas";
import { getCssVar } from "quasar";
import { Line } from "vue-chartjs";
import { LogContent } from "../../drivers/log/log";
import Color from "color";
import { useSettingsStore } from "../../stores/settings";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const settingsStore = useSettingsStore();

const props = defineProps<{
  content: LogContent;
}>();

function data(): ChartData<"line", Point[]> {
  return {
    datasets: [
      {
        data: props.content.points.map((value) => ({
          x: value[0] / props.content.sampleRate,
          y: value[1],
        })),
        fill: {
          value: settingsStore.threshold,
          above: Color(getCssVar("negative")!).alpha(0.25).string(),
          below: Color().alpha(0).string(),
        },
      },
    ],
  };
}

const options: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    xAxis: {
      type: "linear",
    },
  },
};
</script>
