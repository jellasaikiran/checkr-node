import { Router } from "express";
import { param } from "express-validator";
import { isValidObjectId } from "mongoose";
import { addCandidate, getCandidateById, getCandidates } from "../controllers/candidate";
import isAuth from "../middlewares/is-auth";
import userVerification from "../middlewares/userVerification";
import { INVALID_CANDIDATE } from "../utils/constants";

const router = Router();

router.get(
  "/:id",
  isAuth,
  param("id", INVALID_CANDIDATE).custom((value) => isValidObjectId(value)),
  userVerification,
  getCandidateById
);

router.get("/", isAuth, userVerification, getCandidates);

router.post("/", isAuth, userVerification, addCandidate);


export default router;
