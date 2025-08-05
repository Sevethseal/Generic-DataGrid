import path from "path";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes";
import { errorHandler } from "./middleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Define the list of allowed origins
const whitelist = [
  "https://generic-datagrid.onrender.com",
  "http://localhost:3001",
];

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (e.g. mobile apps or curl)
      if (!origin) return callback(null, true);
      if (whitelist.includes(origin)) {
        callback(null, true);
      } else {
        callback(
          new Error(`CORS policy violation: Origin ${origin} is not allowed`),
          false
        );
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

const buildPath = path.join(__dirname, "../../client/build");
app.use(express.static(buildPath));

app.get("*", (_req: Request, res: Response) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
