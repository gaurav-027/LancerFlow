import { Router } from "express";
import {createProject,getProjects,updateProject,deleteProject} from "../controllers/projectController.js";

const projectRoute = Router();

projectRoute.post("/create", createProject);
projectRoute.get("/show/:ownerId", getProjects);
projectRoute.put("/update/:projectId", updateProject);
projectRoute.delete("/delete/:projectId", deleteProject);

export default projectRoute;