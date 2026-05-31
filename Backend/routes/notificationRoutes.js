import { Router } from "express";
import {clearNotifications,createNotification,deleteNotification,getNotifications,} from "../controllers/notificationController.js";

const notificationRoute = Router();

notificationRoute.post("/create", createNotification);
notificationRoute.get("/show/:ownerId", getNotifications);
notificationRoute.delete("/delete/:notificationId", deleteNotification);
notificationRoute.delete("/clear/:ownerId", clearNotifications);

export default notificationRoute;