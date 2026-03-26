import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rootRouter from "./index.js";

const app: Express = express();

// Basic Middlewares
app.use(cors({ origin: true, credentials: true })); // Allow credentials for cookies
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1", rootRouter);

export default app;
