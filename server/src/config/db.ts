import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const db = new Sequelize(process.env.DB_URL as string, {
    dialect: 'postgres', // or your preferred database dialect
    logging: false, // set to true to see SQL queries in the console
});

export default db;