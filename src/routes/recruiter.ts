import { Router } from "express";
import { body } from "express-validator";
import { loginRecruiter, signupRecruiter } from "../controllers/recruiter";
import Recruiter from "../models/recruiter";
import {
  USERNAME_MUST_BE_STRING,
  EMAIL,
  PLEASE_ENTER_VALID_EMAIL,
  EMAIL_ADDRESS_ALREADY_EXISTS,
  PASSWORD,
  PASSWORD_CONDITIONS,
  NAME,
} from "../utils/constants";

const router = Router();

router.post("/login", loginRecruiter);

router.post(
  "/signup",
  [
    body(NAME, USERNAME_MUST_BE_STRING)
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body(EMAIL)
      .isEmail()
      .withMessage(PLEASE_ENTER_VALID_EMAIL)
      .custom((value, { req }) => {
        return Recruiter.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(EMAIL_ADDRESS_ALREADY_EXISTS);
          }
          return true;
        });
      })
      .normalizeEmail(),
    body(PASSWORD, PASSWORD_CONDITIONS).isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
    }),
  ],
  signupRecruiter
);

export default router;
