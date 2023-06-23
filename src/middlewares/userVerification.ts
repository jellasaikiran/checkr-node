import { Response, NextFunction } from "express";
import { USER_NOT_FOUND } from "../utils/constants";
import { CustomRequest } from "../utils/types";
import Recruiter from "../models/recruiter";
import logger from "../config/winston";

const userVerification = async (
  req: CustomRequest,
  _res: Response,
  next: NextFunction
) => {
  logger.info("Verifying user by recruiterId");
  const { recruiterId } = req.body;
  try {
    const user = await Recruiter.findById(recruiterId);
    if (user === undefined || user === null) throw new Error(USER_NOT_FOUND);
  } catch (error) {
    return next(error);
  }
  return next();
};

export default userVerification;
