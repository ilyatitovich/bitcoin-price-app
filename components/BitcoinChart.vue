<template>
    <div class="bitcoin-chart-container">
        <div class="chart-settings">
            <h1>Let's build a chart!</h1>
            <div class="settings">
                <label for="periodSelect">Select Period:</label>
                <select
                    id="periodSelect"
                    v-model="selectedPeriod"
                >
                    <option value="1">1 Day</option>
                    <option value="7">1 Week</option>
                    <option value="30">1 Month</option>
                    <option value="365">1 Year</option>
                    <option value="custom">Custom</option>
                </select>
                <button v-if="selectedPeriod !== 'custom'" @click="fetchData(selectedPeriod)">Build Chart</button>

                <div v-if="selectedPeriod === 'custom'" class="custom-period">
                    <label for="customInput">Custom Period (days):</label>
                    <input
                        type="number"
                        id="customInput"
                        v-model="customPeriod"
                    />
                    <button @click="fetchData(customPeriod)">Build Chart</button>
                </div>
            </div>
        </div>
        <div class="chart">
            <div v-show="isFetching">
                <Spinner/>
            </div>
            <div v-show="!chartCreated && !isFetching" class="chart-img">
                <img src="../assets/6267362.jpg" />
            </div>
            <div v-show="chartCreated && !isFetching" class="chart-container">
                <div class="period-btns">
                    <button
                        :class="selectedPeriod === '1' && 'selected'"
                        :disabled="isFetching"
                        @click="fetchData('1')"
                    >
                        1 D
                    </button>
                    <button
                        :class="selectedPeriod === '7' && 'selected'"
                        :disabled="isFetching"
                        @click="fetchData('7')"
                    >
                        1 W
                    </button>
                    <button
                        :class="selectedPeriod === '30' && 'selected'"
                        :disabled="isFetching"
                        @click="fetchData('30')"
                    >
                        1 M
                    </button>
                    <button
                        :class="selectedPeriod === '365' && 'selected'"
                        :disabled="isFetching"
                        @click="fetchData('365')"
                    >
                        1 Y
                    </button>
                </div>
                <canvas ref="chart"></canvas>
            </div>
        </div>
    </div>
</template>

<script>
import Chart from "chart.js/auto";
import Spinner from "@/components/Spinner.vue";

export default {
    data() {
        return {
            isFetching: false,
            chartData: [],
            selectedPeriod: "30",
            customPeriod: "5",
            chartInstance: null, // Reference to the Chart.js instance,
            chartCreated: false,
        };
    },
    methods: {
        async fetchData(selectedPeriod) {
            this.isFetching = true;
            this.selectedPeriod = selectedPeriod;
            let period;

            if (selectedPeriod === "custom") {
                period = customPeriod;
            } else {
                period = selectedPeriod;
            }

            try {
                const { data } = await useFetch(
                    "http://localhost:3000/get_data_from_db",
                    {
                        query: { period },
                    }
                );

                this.chartData = data._rawValue.res;

                if (this.chartInstance) {
                    this.chartInstance.destroy();
                }

                this.renderChart();

                setTimeout(() => {
                    this.isFetching = false;
                }, 1000);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        },

        renderChart() {
            const ctx = this.$refs.chart.getContext("2d");

            this.chartInstance = new Chart(ctx, {
                type: "line",
                data: {
                    labels: this.chartData.map((entry, index) => {
                        return index % 3 === 0
                            ? new Date(entry.day).toLocaleDateString()
                            : "";
                    }),
                    datasets: [
                        {
                            label: `Bitcoin Price (${this.chartData[0].vs_currency_code.toUpperCase()})`,
                            backgroundColor: "rgba(75, 192, 192, 0.2)",
                            borderColor: "rgba(75, 192, 192, 1)",
                            data: this.chartData.map((entry) => entry.price),
                        },
                    ],
                },
            });

            this.chartCreated = true;
        },
    },
    components: {
        Spinner,
    },
};
</script>
