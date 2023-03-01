<template>
  <Line :options="options" :data="data()" />
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
import { Line } from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const props = defineProps<{
  points: [number, number][];
}>();

function data(): ChartData<"line", Point[]> {
  return {
    // props.data.map((value) => (value[0]))
    datasets: [
      {
        data: props.points.map((value) => ({ x: value[0], y: value[0] })),
      },
    ],
  };
}

const options = {
  responsive: true,
};

// export default {
//   name: "LineGraph",
//   components: { Line },
//   data() {
//     return {
//       data: {
//         labels: ["1", "1", "1", "1", "1", "1", "1"],
//         datasets: [
//           {
//             data: [65, 59, 80, 81, 56, 55, 40],
//             fill: false,
//           },
//         ],
//       },
//       options: {
//         responsive: true,
//       },
//     };
//   },
// };
</script>
