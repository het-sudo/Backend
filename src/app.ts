import express, { type Express } from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rootRouter from "./index.js";
import errorHandler from "./common/middlewares/errorMiddleware.js";

const app: Express = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true })); // Allow credentials for cookies
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1", rootRouter);
app.use(errorHandler);

export default app;
