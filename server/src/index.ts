import path from "path";
import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import router from "./routes";
import cors from "cors";

import { errorHandler } from "./middleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3001", // or '*' for any origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // if you need cookies/auth
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api", router);

// Serve React static files
const buildPath = path.join(__dirname, "../../build");
app.use(express.static(buildPath));

// Catch-all to serve index.html for client-side routing
app.get("*", (_req: Request, res: Response) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
