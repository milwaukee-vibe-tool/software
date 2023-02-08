<template>
    <Line :options="options" :data="data" />
</template>

<script lang="ts">
import {
    CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title,
    Tooltip
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

export default {
    name: 'LineGraph',
    components: { Line },
    data() {
        return {
            data: {
                labels: ['1', '1', '1', '1', '1', '1', '1'],
                datasets: [{
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                }]
            },
            options: {
                responsive: true,
            }
        }
    }
}
</script>
