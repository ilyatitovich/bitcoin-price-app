<template>
    <div>
        <div v-if="data.isExist">
            <BitcoinChart />
        </div>
        <div v-else>
            <InitDatabase />
        </div>
    </div>
</template>

<script setup>
// check data in db
const { data } = await useFetch("http://localhost:3000/get_data");
</script>

<script>
import BitcoinChart from "@/components/BitcoinChart.vue";
import InitDatabase from "~/components/InitDatabase.vue";

export default {
    data() {
        return {
            isExist: false,
        };
    },
    components: {
        BitcoinChart,
        InitDatabase,
    },
};
</script>
