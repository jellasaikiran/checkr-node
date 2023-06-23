import bodyParser from "body-parser";
import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import logger from "./config/winston";
import recruiterRoutes from "./routes/recruiter";
import candidateRoutes from "./routes/candidate"
import { MONGO_PATH, PAGE_NOT_FOUND } from "./utils/constants";
import { CustomError } from "./utils/types";
import winston, { streamWriter } from "./config/winston";
import morgan from "morgan";


const app = express();

const PORT = 3000;

app.use(bodyParser.json());

// app.use(morgan("combined", { stream: streamWriter }));

app.use((req: Request, _res: Response, next: NextFunction) => {
  req.headers["access-control-allow-credentials"] = "*";
  req.headers["access-control-allow-methods"] = "GET, POST, PUT, PATCH, DELETE";
  req.headers["access-control-allow-headers"] = "Content-Type, Authorization";

  next();
});

mongoose
  .connect(MONGO_PATH)
  .then((_result) => {
    app.listen(PORT, () => logger.info(`app listening on ${PORT}`));
  })
  .catch((err) => logger.error(err));

app.use("/recruiter", recruiterRoutes);
app.use("/candidates", candidateRoutes);

app.use(
  (
    error: CustomError | Error,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    logger.error(error);
    if (error instanceof CustomError) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(400).json({ message: error.message });
  }
);

app.use("/", (_req: Request, res: Response, _next: NextFunction) => {
  logger.error({ message: PAGE_NOT_FOUND });
  return res.status(404).json({ message: PAGE_NOT_FOUND });
});
