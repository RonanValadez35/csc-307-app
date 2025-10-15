// user-services.js
import mongoose from "mongoose";
import userModel from "./users.js";

mongoose.set("debug", true);
mongoose
  .connect("mongodb://localhost:27017/users", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log(error));

function getUsers(name, job) {
  if (!name && !job) {
    return userModel.find();                 // all
  } else if (name && job) {
    return userModel.find({ name, job });    // BOTH filters
  } else if (name && !job) {
    return findUserByName(name);             // name only
  } else {
    return findUserByJob(job);               // job only
  }
}

function findUserById(id) {
  return userModel.findById(id);
}

function addUser(user) {
  const userToAdd = new userModel(user);
  return userToAdd.save();
}

function findUserByName(name) {
  return userModel.find({ name });
}

function findUserByJob(job) {
  return userModel.find({ job });
}

function removeUserById(id) {
  // returns the deleted doc or null if not found
  return userModel.findByIdAndDelete(id);
}

export default {
  addUser,
  getUsers,
  findUserById,
  findUserByName,
  findUserByJob,
  removeUserById,
};