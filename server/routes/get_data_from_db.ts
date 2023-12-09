import { pool } from "@/utils/database";

async function getDataFromDb(period: number = 30) {
    let tableName: "hourly_prices" | "daily_prices";

    if (period <= 3) {
        tableName = "hourly_prices";
        period = period * 24;
    } else {
        tableName = "daily_prices";
    }

    try {
        const connection = await pool.getConnection();

        const [res] = await connection.execute(`SELECT * 
        FROM (
            SELECT * 
            FROM ${tableName} 
            ORDER BY id DESC 
            LIMIT ${period}
        ) AS subquery
        ORDER BY id ASC;`);

        connection.release();

        return res;
    } catch (error) {
        throw new Error(
            `Error checking table existence: ${(error as Error).message}`
        );
    }
}

export default defineEventHandler(async (event) => {
    const { period } = getQuery(event);
    const res = await getDataFromDb(period as number);

    return {
        res,
    };
});
