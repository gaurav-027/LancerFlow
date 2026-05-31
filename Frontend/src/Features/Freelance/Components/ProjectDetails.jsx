import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {Trash2Icon} from '../../../components/ui/trash-2-icon.jsx'
import AddProject from './AddProject.jsx';
import { XIcon } from '../../../components/ui/x' ;
import { PlusIcon } from "../../../components/ui/plus.jsx" ;
import { deleteProject, fetchProjects } from '../Apis/ProjectApi.jsx';
import { AuthContext } from '../../Auth/AuthContext.jsx';
import { notify } from '../utils/notify.js';

const statusClass = {
    pending: "bg-amber-500/15 text-amber-100 border-amber-400/20",
    "in-progress": "bg-blue-500/15 text-blue-100 border-blue-400/20",
    completed: "bg-emerald-500/15 text-emerald-100 border-emerald-400/20"
};

const statusLabel = {
    pending: "To Do",
    "in-progress": "Active",
    completed: "Done"
};

const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
    }).format(Number(value) || 0);

const formatDeadline = (deadline) => {
    if (!deadline) return "No date";

    const date = new Date(deadline);
    if (Number.isNaN(date.getTime())) return "No date";

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};

export default function ProjectDetails() {
    const { user } = useContext(AuthContext);
    const ownerId = user?._id;

    const [showForm , setShowForm] = useState(false);
    const [projects, setProjects] = useState([]);
    const [editingProject, setEditingProject] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const getProjects = useCallback(async () => {
        if (!ownerId) return;

        setIsLoading(true);
        setError("");

        try {
            const res = await fetchProjects(ownerId);

            if (!Array.isArray(res?.data)) {
                setError(res?.message || "Could not fetch projects.");
                setProjects([]);
                return;
            }

            setProjects(res.data);
        } finally {
            setIsLoading(false);
        }
    }, [ownerId]);

    useEffect(() => {
        getProjects();
    }, [getProjects]);

    const counts = useMemo(() => ({
        total: projects.length,
        pending: projects.filter((project) => project.status === "pending").length,
        active: projects.filter((project) => project.status === "in-progress").length,
        done: projects.filter((project) => project.status === "completed").length
    }), [projects]);

    const handleSaved = (savedProject) => {
        const wasEditing = projects.some((project) => project._id === savedProject._id);
        setProjects((current) => {
            const exists = current.some((project) => project._id === savedProject._id);
            if (exists) {
                return current.map((project) => project._id === savedProject._id ? savedProject : project);
            }
            return [savedProject, ...current];
        });
        setShowForm(false);
        setEditingProject(null);
        notify({
            ownerId,
            type: "project",
            action: wasEditing ? "updated" : "created",
            title: wasEditing ? "Project updated" : "Project created",
            message: `${savedProject.projectName} was ${wasEditing ? "updated" : "added"} in your project board.`
        });
    };

    const handleDelete = async (projectId) => {
        const confirmed = window.confirm("Delete this project?");
        if (!confirmed) return;

        const res = await deleteProject(projectId);
        if (!res?.data) {
            setError(res?.message || "Project could not be deleted.");
            return;
        }

        setProjects((current) => current.filter((project) => project._id !== projectId));
        notify({
            ownerId,
            type: "project",
            action: "deleted",
            title: "Project deleted",
            message: `${res.data.projectName} was removed from your project board.`
        });
    };

  return (
    <div className='w-full h-full py-8 px-6 md:px-12 xl:px-20 flex flex-col gap-8'>
        <div className='flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between'>
            <div>
                <h1 className='text-3xl'>Project Board</h1>
                <p className='text-white/50 text-xl'>Manage your enterprise workflows with AI-driven insights.</p>
            </div>
            <button
                onClick={()=>{setShowForm((value) => !value); setEditingProject(null);}}
                className='bg-blue-800 h-12 w-45 flex justify-center items-center text-[18px] rounded-4xl'
            >
                {showForm ? <XIcon/> : <PlusIcon/>}
                <p>{showForm ? "Close Form" : "Add New Project"}</p>
            </button>
        </div>

        <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
            {[
                ["Total", counts.total],
                ["To Do", counts.pending],
                ["Active", counts.active],
                ["Done", counts.done]
            ].map(([label, value]) => (
                <div key={label} className='rounded-3xl border border-white/10 bg-white/5 p-4'>
                    <p className='text-sm text-white/45'>{label}</p>
                    <p className='mt-2 text-2xl font-semibold'>{value}</p>
                </div>
            ))}
        </div>

        {error ? <p className='rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100'>{error}</p> : null}

        {showForm ? (
            <AddProject onSaved={handleSaved} onCancel={() => setShowForm(false)} />
        ) : null}

        {editingProject ? (
            <AddProject project={editingProject} onSaved={handleSaved} onCancel={() => setEditingProject(null)} />
        ) : null}

        <hr className='border-white/10'/>

        {isLoading ? (
            <div className='grid gap-6 lg:grid-cols-2 xl:grid-cols-3'>
                {[1, 2, 3].map((item) => (
                    <div key={item} className='h-[280px] animate-pulse rounded-4xl bg-white/5' />
                ))}
            </div>
        ) : projects.length ? (
            <div className='grid gap-6 lg:grid-cols-2 xl:grid-cols-3'>
                {projects.map((project) => (
                    <div key={project._id} className='min-h-[280px] bg-[#16263e] rounded-4xl p-6 flex flex-col justify-between gap-5'>
                        <div className='flex justify-between gap-4'>
                            <div className='min-w-0'>
                                <h2 className='truncate text-xl'>{project.projectName}</h2>
                                <p className='truncate text-sm text-white/50'>{project.clientName || "No client assigned"}</p>
                            </div>
                            <p className={`shrink-0 rounded-lg border px-3 py-2 text-sm ${statusClass[project.status] || statusClass.pending}`}>
                                {statusLabel[project.status] || "To Do"}
                            </p>
                        </div>

                        {project.description ? (
                            <p className='line-clamp-2 text-sm text-white/45'>{project.description}</p>
                        ) : (
                            <p className='text-sm text-white/25'>No description added.</p>
                        )}

                        <hr className='border-white/30'/>
                        <div className='grid grid-cols-2 gap-4 px-2'>
                            <div>
                                <p className='text-white/50 text-sm'>Budget</p>
                                <p>{formatCurrency(project.budget)}</p>
                            </div>
                            <div>
                                <p className='text-white/50 text-sm'>Deadline</p>
                                <p>{formatDeadline(project.deadline)}</p>
                            </div>
                        </div>
                        <hr className='border-white/30' />
                        <div className='flex justify-between items-center px-2'>
                            <button onClick={() => handleDelete(project._id)} className='text-white/60 transition hover:text-red-200'>
                                <Trash2Icon size={25}/>
                            </button>
                            <button onClick={() => { setEditingProject(project); setShowForm(false); }} className='bg-blue-900 py-2 px-4 rounded-lg'>
                                Edit
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className='rounded-4xl border border-dashed border-white/10 bg-white/5 p-28 text-center text-white/45'>
                No projects yet. Add your first project to see it here.
            </div>
        )}
    </div>
  )
}
