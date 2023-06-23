import { Request, Response, NextFunction } from "express";
import Recruiter from "../models/recruiter";
import {
  JWT_SECRET,
  SIX_HOURS,
  USER_CREATED,
  USER_WITH_EMAIL_NOT_FOUND,
  VALIDATION_FAILED,
  WRONG_PASSWORD,
} from "../utils/constants";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import logger from "../config/winston";
import { getCustomErrorMessage } from "../errors/error.handler";
import { CustomError } from "../utils/types";
import jwt from "jsonwebtoken";

export const signupRecruiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info("Registering user by email and password");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new CustomError(getCustomErrorMessage(VALIDATION_FAILED, errors), 422)
    );
  }
  const { name, email, password } = req.body;
  try {
    const hashedPw = await bcrypt.hash(password, 12);
    const user = new Recruiter({
      email: email,
      password: hashedPw,
      name: name,
    });
    const result = await user.save();
    res.status(201).json({ message: USER_CREATED, userId: result._id });
  } catch (error) {
    next(error);
  }
};

export const loginRecruiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info("Authenticating user by email and password");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new CustomError(getCustomErrorMessage(VALIDATION_FAILED, errors), 422)
    );
  }
  const { email, password } = req.body;
  let loadedUser;
  try {
    const user = await Recruiter.findOne({ email: email });
    if (!user) {
      throw new CustomError(USER_WITH_EMAIL_NOT_FOUND, 404);
    }
    loadedUser = user;
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new CustomError(WRONG_PASSWORD, 401);
    }
    const token = jwt.sign(
      {
        email: loadedUser.email,
        recruiterId: loadedUser._id.toString(),
      },
      JWT_SECRET,
      {
        expiresIn: SIX_HOURS,
      }
    );
    return res.status(200).json({
      token: token,
      recruiterId: loadedUser._id.toString(),
    });
  } catch (error) {
    next(error);
  }
};
