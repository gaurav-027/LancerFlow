import project from "../models/projectModel.js";
import httpStatus from "http-status";

const normalizeStatus = (status) => {
    const cleaned = String(status || "pending").toLowerCase().trim();

    if (["done", "complete", "completed"].includes(cleaned)) return "completed";
    if (["active", "in progress", "in-progress", "working"].includes(cleaned)) return "in-progress";
    if (["todo", "to do", "pending"].includes(cleaned)) return "pending";

    return cleaned;
}

export async function createProject(req,res) {
    let {
        projectName,
        description,
        clientName,
        budget,
        status,
        deadline,
        projectOwner
    } = req.body

    try {
        if(!projectName){
            return res.status(httpStatus.BAD_REQUEST).json({message:"Please Enter Project Name"})
        }
        const newProject = new project({
            projectName,
            description,
            clientName,
            budget,
            status: normalizeStatus(status),
            deadline,
            projectOwner
        })
        await newProject.save();
        return res.status(httpStatus.CREATED).json({message:"New Project Created", data: newProject})
    } catch (error) {
        return res.status(500).json({message:`Something Went Wrong ${error}`})
    }
}

export async function getProjects(req, res) {
    try {
        const { ownerId } = req.params;

        const projects = await project.find({ projectOwner: ownerId }).sort({ deadline: 1 });

        return res.status(httpStatus.OK).json({
            message: "Projects fetched successfully",
            data: projects
        });
    } catch (error) {
        return res.status(500).json({
            message: `Error fetching projects: ${error.message}`
        });
    }
}

export async function updateProject(req, res) {
    try {
        const { projectId } = req.params;

        const payload = { ...req.body };
        if (payload.status) {
            payload.status = normalizeStatus(payload.status);
        }

        const updatedProject = await project.findByIdAndUpdate(
            projectId,
            payload,
            { new: true, runValidators: true }
        );

        if (!updatedProject) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: "Project not found"
            });
        }

        return res.status(httpStatus.OK).json({
            message: "Project updated successfully",
            data: updatedProject
        });
    } catch (error) {
        return res.status(500).json({
            message: `Error updating project: ${error.message}`
        });
    }
}

export async function deleteProject(req, res) {
    try {
        const { projectId } = req.params;

        const deletedProject = await project.findByIdAndDelete(projectId);

        if (!deletedProject) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: "Project not found"
            });
        }

        return res.status(httpStatus.OK).json({
            message: "Project deleted successfully",
            data: deletedProject
        });
    } catch (error) {
        return res.status(500).json({
            message: `Error deleting project: ${error.message}`
        });
    }
}
