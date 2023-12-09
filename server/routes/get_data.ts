import { pool } from "@/utils/database";

async function doesTableExist() {
    try {
        const connection = await pool.getConnection();

        const [rows] =
            await connection.execute(`SELECT * FROM vs_currency 
        LIMIT 1`);

        connection.release();

        return (rows as []).length > 0;
    } catch (error) {
        throw new Error(
            `Error checking table existence: ${(error as Error).message}`
        );
    }
}

export default defineEventHandler(async (event) => {

    const isExist = await doesTableExist();

    return {
        isExist,
    };
});
