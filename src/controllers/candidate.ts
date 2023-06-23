import { Request, Response, NextFunction, RequestHandler } from "express";
import { validationResult } from "express-validator";
import logger from "../config/winston";
import { getCustomErrorMessage } from "../errors/error.handler";
import Candidate from "../models/candidate";
import { CANDIDATE_CREATED, VALIDATION_FAILED } from "../utils/constants";
import { CustomError, CustomRequest } from "../utils/types";

export const getCandidates = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  logger.info("Getting all the candidates of the recruiter");
  const recruiterId = req.recruiterId;
  try {
    const candidates = await Candidate.find({ recruiterId: recruiterId });
    return res.status(200).send(candidates);
  } catch (error) {
    next(error);
  }
};

export const getCandidateById = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  logger.info("Getting candidate information of the recruiter ");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new CustomError(getCustomErrorMessage(VALIDATION_FAILED, errors), 422)
    );
  }
  const { recruiterId } = req.body;
  const id = req.params.id;
  try {
    const candidate = await Candidate.find({
      recruiterId: recruiterId,
      _id: id,
    });
    return res.status(200).send(candidate);
  } catch (error) {
    next(error);
  }
};

export const addCandidate = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  logger.info("Adding candidate for the user");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new CustomError(getCustomErrorMessage(VALIDATION_FAILED, errors), 422)
    );
  }
  const {
    name,
    email,
    dob,
    phone,
    location,
    zipcode,
    socialSecurity,
    driverLicence,
    recruiterId,
  } = req.body;
  try {
    const candidate = new Candidate({
      name: name,
      email: email,
      dob: dob,
      phone: phone,
      location: location,
      zipcode: zipcode,
      socialSecurity: socialSecurity,
      driverLicence: driverLicence,
      createdAt: new Date(),
      recruiterId: recruiterId,
    });
    const result = await candidate.save();
    res
      .status(201)
      .json({ message: CANDIDATE_CREATED, candidateId: result._id });
  } catch (error) {
    next(error);
  }
};

export const updateCandidate = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  logger.info("Adding candidate for the user");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new CustomError(getCustomErrorMessage(VALIDATION_FAILED, errors), 422)
    );
  }
  const {
    name,
    email,
    dob,
    phone,
    location,
    zipcode,
    socialSecurity,
    driverLicence,
    recruiterId,
  } = req.body;
  try {
    const candidate = new Candidate({
      name: name,
      email: email,
      dob: dob,
      phone: phone,
      location: location,
      zipcode: zipcode,
      socialSecurity: socialSecurity,
      driverLicence: driverLicence,
      createdAt: new Date(),
      recruiterId: recruiterId,
    });
    const result = await candidate.save();
    res
      .status(201)
      .json({ message: CANDIDATE_CREATED, candidateId: result._id });
  } catch (error) {
    next(error);
  }
};
