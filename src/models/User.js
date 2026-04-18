import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { BCRYPT_SALT_ROUNDS, VALIDATION_RULES } from "../config.js";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.\-]?\w+)*@\w+([\.\-]?\w+)*(\.\w{2,3})+$/,
        VALIDATION_RULES.user.email.message,
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [
        VALIDATION_RULES.user.password.minlength,
        VALIDATION_RULES.user.password.message,
      ],
      select: false, // Don't include password by default in queries
    },
  },
  { timestamps: true },
);

userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.getPublicProfile = function () {
  return {
    id: this._id,
    email: this.email,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  this.password = await bcrypt.hash(this.password, BCRYPT_SALT_ROUNDS);
});

const User = mongoose.model("User", userSchema);

export default User;
