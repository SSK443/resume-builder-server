



import mongoose from "mongoose";
import bcrypt from "bcrypt"; // You can also use bcryptjs

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// ✅ ADD THIS PRE-SAVE HOOK
userSchema.pre("save", function (next) {
  // 'this' refers to the document being saved
  const user = this;

  // Only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) {
    return next();
  }

  // Hash the password
  try {
    const salt = bcrypt.genSaltSync(10); // 10 rounds is a good default
    user.password = bcrypt.hashSync(user.password, salt);
    next();
  } catch (error) {
    next(error); // Pass error to the save operation
  }
});

// This method will now work correctly
userSchema.methods.comparePassword = function (password) {
  // 'this.password' is now the hashed password from the database
  return bcrypt.compareSync(password, this.password);
};

 const User = mongoose.model("User", userSchema);
export default User;