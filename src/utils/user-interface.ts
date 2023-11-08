import { Document } from "mongoose";

export interface User extends Document {
  name: String;
  email: String;
  role: String;
  password: String;
  confirmpassword: String;
}
