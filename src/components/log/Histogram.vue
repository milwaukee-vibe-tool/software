<template>
  <Bar :options="options" :data="data()" />
</template>

<script setup lang="ts">
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartData,
  ChartOptions,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Point } from "chart.js/dist/helpers/helpers.canvas";
import Color from "color";
import { getCssVar } from "quasar";
import { ref } from "vue";
import { Bar, Chart } from "vue-chartjs";
import { LogContent } from "../../drivers/log/log";
import { useSettingsStore } from "../../stores/settings";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const settingsStore = useSettingsStore();

const props = defineProps<{
  content: LogContent;
}>();

const binWidth = ref(1);

function data(): ChartData<"bar", number[]> {
  const getBin = (val: number) => Math.floor(val / binWidth.value);
  const pointBins = props.content.points.map((point) => getBin(point[1]));
  const maxBin = Math.max(...pointBins);
  const bins = new Array(maxBin + 1).fill(0);
  pointBins.forEach((bin) => bins[bin]++);
  const binUnits = bins.map((_, index) => index * binWidth.value);
  return {
    labels: binUnits,
    datasets: [
      {
        data: bins,
        backgroundColor: binUnits.map((unit) =>
          unit < settingsStore.threshold
            ? ChartJS.defaults.backgroundColor.toString()
            : Color(getCssVar("negative")!).alpha(0.25).string()
        ),
      },
    ],
  };
}

const options: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
};
</script>
