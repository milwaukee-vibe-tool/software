<template>
  <Scatter :options="options" :data="data()" />
</template>

<script setup lang="ts">
import {
  CategoryScale,
  Chart as ChartJS,
  ChartData,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Point } from "chart.js/dist/helpers/helpers.canvas";
import { Scatter } from "vue-chartjs";
import { LogContent } from "../../drivers/log/log";
import annotationPlugin from "chartjs-plugin-annotation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

const props = defineProps<{
  content: LogContent;
}>();

function data(): ChartData<"scatter", Point[]> {
  return {
    datasets: [
      {
        data: props.content.points.map((value) => ({
          x: value[0] / props.content.sampleRate,
          y: value[1],
        })),
        showLine: true,
      },
    ],
  };
}

const options = {
  responsive: true,
  plugins: {
    annotation: {
      annotations: {
        line1: {
          type: "line",
          yMin: 5,
          yMax: 5,
        },
      },
    },
  },
};
</script>
