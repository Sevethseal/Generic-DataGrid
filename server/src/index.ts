// server/src/index.ts

import path from "path";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes";
import { errorHandler } from "./middleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for your frontend origin
app.use(
  cors({
    origin: "https://generic-datagrid.onrender.com", // or '*' during development
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount your API routes under /api
app.use("/api", router);

// Serve React static files from client/build
const buildPath = path.join(__dirname, "../../client/build");
app.use(express.static(buildPath));

// Catch-all: for any route not handled by /api, send back index.html
app.get("*", (_req: Request, res: Response) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
