import express, { type Express } from "express";
import cors from "cors";
import rootRouter from "./index.js";

const app: Express = express();

// Basic Middlewares
app.use(cors());
app.use(express.json());
app.use("/api/v1", rootRouter);

export default app;
