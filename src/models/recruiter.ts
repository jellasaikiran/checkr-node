import { model, Schema } from "mongoose";

export const RecruiterSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
});

export default model("Recruiter", RecruiterSchema)
