<template>
    <div class="container">
        <h1>Hey, it looks like there's no data to visualize yet</h1>
        <div v-if="isFetching"><Spinner /></div>
        <button v-else @click="collectDataFromAPI">Collect Data</button>
    </div>
</template>

<script>
import Spinner from "@/components/Spinner.vue";

export default {
    data() {
        return {
            isFetching: false,
        };
    },

    methods: {
        async collectDataFromAPI() {
            this.isFetching = true;

            await useFetch("http://localhost:3000/collect_data", {
                query: {
                    currency: "usd",
                },
            });

            this.isFetching = false;
            location.reload();
        },
    },
};
</script>
