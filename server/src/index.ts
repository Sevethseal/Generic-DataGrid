import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import router from "./routes";
import { errorHandler } from "./middleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found" });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
