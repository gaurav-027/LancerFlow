import httpStatus from "http-status";
import notification from "../models/notificationModel.js";

export async function createNotification(req, res) {
  try {
    const { owner, type, action, title, message } = req.body;

    if (!owner || !title || !message) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Owner, title, and message are required",
      });
    }

    const newNotification = await notification.create({
      owner,
      type,
      action,
      title,
      message,
    });

    return res.status(httpStatus.CREATED).json({
      message: "Notification created successfully",
      data: newNotification,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error creating notification: ${error.message}`,
    });
  }
}

export async function getNotifications(req, res) {
  try {
    const { ownerId } = req.params;

    if (!ownerId) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Owner ID is required",
      });
    }

    const notifications = await notification
      .find({ owner: ownerId })
      .sort({ createdAt: -1 });

    return res.status(httpStatus.OK).json({
      message: "Notifications fetched successfully",
      data: notifications,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error fetching notifications: ${error.message}`,
    });
  }
}

export async function deleteNotification(req, res) {
  try {
    const { notificationId } = req.params;

    const deletedNotification = await notification.findByIdAndDelete(notificationId);

    if (!deletedNotification) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: "Notification not found",
      });
    }

    return res.status(httpStatus.OK).json({
      message: "Notification deleted successfully",
      data: deletedNotification,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error deleting notification: ${error.message}`,
    });
  }
}

export async function clearNotifications(req, res) {
  try {
    const { ownerId } = req.params;

    const result = await notification.deleteMany({ owner: ownerId });

    return res.status(httpStatus.OK).json({
      message: "Notifications cleared successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error clearing notifications: ${error.message}`,
    });
  }
}
