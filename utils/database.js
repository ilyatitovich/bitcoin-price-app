import mysql from "mysql2/promise";
import dotenv from 'dotenv';

dotenv.config();

// connect to db
export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

async function initDb() {
    try {
        const connection = await pool.getConnection();
        
        console.log("Connected");

        connection.execute(`
        CREATE TABLE IF NOT EXISTS vs_currency (
            currency_code CHAR(3) PRIMARY KEY 
        )
    `);

        connection.execute(`
        CREATE TABLE IF NOT EXISTS daily_prices (
            id INT AUTO_INCREMENT PRIMARY KEY,
            day DATE,
            time TIME,   
            price FLOAT,
            vs_currency_code CHAR(3),
            FOREIGN KEY (vs_currency_code) REFERENCES vs_currency(currency_code)
        )
    `);

        connection.execute(`
        CREATE TABLE IF NOT EXISTS hourly_prices (
            id INT AUTO_INCREMENT PRIMARY KEY,
            day DATE,
            time TIME,   
            price FLOAT,
            vs_currency_code CHAR(3),
            FOREIGN KEY (vs_currency_code) REFERENCES vs_currency(currency_code)
        )
    `);

        connection.release();

        console.log("Database initialized");
    } catch (error) {
        throw new Error(
            `Error while initializing the database:, ${
                error.message
            }`
        );
    }
}

// create tables
initDb();


