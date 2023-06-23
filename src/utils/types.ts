import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

export class CustomError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
  }
}

export interface CustomRequest extends Request {
  recruiterId?: string;
}

export interface CustomJwtPayload extends JwtPayload {
  recruiterId?: string;
  email?: string;
}
