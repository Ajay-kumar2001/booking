import mongoose, { Model } from "mongoose";
import validator from "validator";
import { User } from "../utils/user-interface";
const UserSchema = new mongoose.Schema<User>({
  name: {
    type: String,
    required: [true, "Please enter your name"]
  },
  email: {
    type: String,
    required: [true, "Please enter your name"],
    unique: true,
    validate: validator.isEmail
  },
  role: {
    type: String,
    enum: ["user", "hotelier", "admin"],
    required: [true, "Please enter a role"]
  },
  password: {
    type: String,
    required: [true, "Please enter password"],
    minlength: 8,
    select: false
  },
  confirmpassword: {
    type: String,
    validate: {
      validator: function (val: String) {
        return val === (this as any).password;
      },
      message: "Passwords are not the same!"
    }
  }
});

const userModel:Model<User> = mongoose.model("users", UserSchema);

export default userModel;
