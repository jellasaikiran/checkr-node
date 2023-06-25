export const MONGO_PATH =
  "mongodb://localhost:27017/checkr?retryWrites=true&serverSelectionTimeoutMS=5000&connectTimeoutMS=10000";

export const PAGE_NOT_FOUND = "Page not found";
export const USER_CREATED = "User created!";
export const CANDIDATE_CREATED = "Candidate created!";
export const VALIDATION_FAILED = "Validation failed";
export const USER_WITH_EMAIL_NOT_FOUND =
  "A user with provided email is not found.";
export const WRONG_PASSWORD = "Wrong Password.";
export const USER_NOT_FOUND = "User not found";
export const SIX_HOURS = "6h";

export const JWT_SECRET = "nodecheckrjwtsecret";
export const AUTHORIZATION = "Authorization";
export const NOT_AUTHENTICATED = "Not authenticated.";

export const PLEASE_ENTER_VALID_EMAIL = "Please enter a valid email.";
export const PASSWORD_CONDITIONS =
  "Password should be contain atleast one uppercase , one lower case, one special char, one digit and min 8";
export const USERNAME_MUST_BE_STRING =
  "Username must be a string with atleast 3 letters";
export const EMAIL_ADDRESS_ALREADY_EXISTS = "Email address already exists!";
export const EMAIL = "email";
export const PASSWORD = "password";
export const NAME = "name";
export const INVALID_CANDIDATE = "Invalid candidate ID";

export const TEST_USER_ID = "abcd";
export const TEST_USER_EMAIL = "test@example.com";
export const TEST_USER_PASSWORD = "password123";
export const TEST_USER_NAME = "testuser";
export const DATABASE_ERROR = "Database error";
export const TEST_MOCKED_TOKEN = "mockedToken";
export const TEST_CANDIDATE_RESPONSE = [
  {
    name: "John Smith",
    email: "John.smith@checkr.com",
    dob: "1990-09-10 (26)",
    phone: "(555) 555-5555",
    location: "Barrouallie",
    date: "2/22/2022",
    zipcode: "94158",
    socialSecurity: "XXX-XX-6789",
    driverLicence: "FTEST1111 (CA)",
    recruiterId: "{{recruiterId}}",
  },
];
