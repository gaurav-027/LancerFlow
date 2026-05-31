import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    projectName: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    clientName : {
      type : String,
    },

    budget: {
      type: Number,
    },

    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },

    deadline: {
      type: Date,
      default : Date.now
    },

    projectOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
})

const project = new mongoose.model("Project",projectSchema);

export default project;