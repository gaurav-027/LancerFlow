import express from "express";
import dotenv from "dotenv/config";
import { connectToDB } from "./config/db.js";
import authRoute from "./routes/authRoutes.js";
import clientRoute from "./routes/clientRoutes.js";
import projectRoute from "./routes/projectRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import apiRoute from "./routes/aiRoutes.js";
import notificationRoute from "./routes/notificationRoutes.js";

connectToDB();

const PORT = process.env.LOCALPORT;

const server=express();

server.use(express.json())
server.use(cors({
    origin:"http://localhost:5173",
    methods:["GET","POST","PUT","DELETE"],
    credentials:true
}));
server.use(cookieParser());

server.use("/api/auth",authRoute);
server.use("/api/client",clientRoute);
server.use("/api/project",projectRoute);
server.use("/api/ai",apiRoute);
server.use("/api/notification",notificationRoute);

server.listen(PORT,()=>{
    console.log("Server Chalu Hai");
    console.log(`http://localhost:${PORT} Par Jao`);
})
