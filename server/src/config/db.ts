// src/db.ts
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

// The DATABASE_URL (or DB_URL) env-var should look like:
//   postgres://username:password@host:port/database
const db = new Sequelize(process.env.DB_URL as string, {
  dialect: "postgres",
  logging: false, // set to `true` if you want to see every SQL query logged
});

export default db;
