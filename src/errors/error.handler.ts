import { Result, ValidationError } from "express-validator";

export const getCustomErrorMessage = (
  message: string,
  errors: Result<ValidationError>
) => {
  const [error] = errors.array();
  return message + ", " + error.msg;
};
