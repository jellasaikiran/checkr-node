import jwt from "jsonwebtoken";
import { Response, NextFunction, RequestHandler } from "express";
import {
  AUTHORIZATION,
  JWT_SECRET,
  NOT_AUTHENTICATED,
} from "../utils/constants";
import { CustomError, CustomRequest, CustomJwtPayload } from "../utils/types";
import logger from "../config/winston";

const isAuth: RequestHandler = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  logger.info("Verifying the jwt token for authorization");
  const authHeader = req.get(AUTHORIZATION);

  if (!authHeader) {
    throw new CustomError(NOT_AUTHENTICATED, 401);
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, JWT_SECRET) as CustomJwtPayload;
  } catch (error) {
    throw error;
  }
  if (!decodedToken) {
    throw new CustomError(NOT_AUTHENTICATED, 401);
  }
  req.recruiterId = decodedToken.recruiterId;
  next();
};

export default isAuth;
