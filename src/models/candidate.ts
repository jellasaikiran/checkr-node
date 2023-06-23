import { model, Schema } from "mongoose";

export const CandidateSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  dob: { type: String, required: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  zipcode: { type: String, required: true },
  socialSecurity: { type: String, required: true },
  driverLicence: { type: String, required: true },
  createdAt: { type: Date, required: true },
  recruiterId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Recruiter",
  },
});

export default model("Candidate", CandidateSchema);
