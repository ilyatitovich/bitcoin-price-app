import axios from "axios";
import { pool } from "@/utils/database";
import mysql from "mysql2/promise";

interface ChartData {
    prices: number[][];
}

async function fetchData(currency: string, period: string): Promise<ChartData> {
    const url = `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=${currency}&days=${period}`;

    try {
        const response = await axios.get(url);

        if (response.status !== 200) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: ChartData = response.data;
        return data;
    } catch (error) {
        throw new Error(
            `Error fetching data from CoinGecko API: ${
                (error as Error).message
            }`
        );
    }
}

async function insertData(
    pool: mysql.Pool,
    currency: string,
    table: string,
    data: number[][]
): Promise<void> {

    const promises = data.map(([timestamp, price]) => {
        const date = new Date(timestamp).toISOString();

        const day = date.substring(0, 10);  // YYYY-MM-DD 
        const time = date.substring(11, 19);    // HH:mm:ss

        return pool.execute(
            `INSERT INTO ${table} (day, time, price, vs_currency_code) VALUES (?, ?, ?, ?)`,
            [day, time, price, currency]
        );
    });

    await Promise.all(promises);
}

async function saveToDatabase(
    chartData: ChartData,
    currency: string,
    table: string
): Promise<void> {
    const { prices } = chartData;
    const len = prices.length;

    try {

        console.log("Start saving data to MySQL");

        await insertData(pool, currency, table, prices as []);

        console.log("Data saved to MySQL");
    } catch (error) {
        throw new Error(
            `Error saving data to MySQL:: ${(error as Error).message}`
        );
    }
}


export default defineEventHandler(async (event) => {
    const { currency } = getQuery(event);

    try {
        await pool.execute(`
            INSERT IGNORE INTO vs_currency (currency_code) VALUES (?)`,
            [currency]
        );

        // collect data for last 3 years - daily price data
        const chartDataDaily: ChartData = await fetchData(
            currency as string,
            "1095"
        );
        await saveToDatabase(chartDataDaily, currency as string, "daily_prices");

        // collect data for last 3 days - hourly price data
        const chartDataHourly: ChartData = await fetchData(
            currency as string,
            "3"
        );
        await saveToDatabase(chartDataHourly, currency as string, "hourly_prices");

    } catch (error) {
        throw new Error(`An error occurred: ${(error as Error).message}`);
    }
    return {};
});
