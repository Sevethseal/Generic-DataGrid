import express from "express";
import dotenv from "dotenv";
import { createConnection } from "typeorm"; // or Sequelize, depending on your choice
import routes from "./routes"; // Import your routes
import { errorHandler } from "./middleware"; // Import your error handler middleware

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
// createConnection()
//   .then(() => {
//     console.log("Database connected successfully");
//   })
//   .catch((error) => {
//     console.error("Database connection error:", error);
//   });

// Routes
app.use("/api", routes);

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
