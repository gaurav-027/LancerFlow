import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["client", "project", "ai", "info"],
      default: "info",
    },
    action: {
      type: String,
      enum: ["created", "updated", "deleted", "generated", "info"],
      default: "info",
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const notification = mongoose.model("Notification", notificationSchema);

export default notification;
