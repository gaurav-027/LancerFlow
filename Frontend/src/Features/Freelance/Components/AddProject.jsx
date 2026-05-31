import React, { useContext, useState } from 'react'
import { AuthContext } from '../../Auth/AuthContext';
import { addProject, updateProject } from '../Apis/ProjectApi';

const statusOptions = [
    { label: "To Do", value: "pending" },
    { label: "Active", value: "in-progress" },
    { label: "Done", value: "completed" }
];

const formatDateInput = (value) => {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return date.toISOString().slice(0, 10);
};

export default function AddProject({ project, onSaved, onCancel }) {
    const { user } = useContext(AuthContext);
    const isEditing = Boolean(project?._id);

    const [projectName, setProjectName] = useState(project?.projectName || "");
    const [clientName, setClientName] = useState(project?.clientName || "");
    const [description, setDescription] = useState(project?.description || '');
    const [budget, setBudget] = useState(project?.budget || "");
    const [status, setStatus] = useState(project?.status || "pending");
    const [deadline , setDeadline] = useState(formatDateInput(project?.deadline));
    const [error, setError] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const resetForm = () => {
        setProjectName("");
        setClientName("");
        setDescription("");
        setBudget("");
        setStatus("pending");
        setDeadline("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!projectName.trim()) {
            setError("Project name is required.");
            return;
        }

        setError("");
        setIsSaving(true);

        try {
            const payload = {
                projectName: projectName.trim(),
                clientName: clientName.trim(),
                description: description.trim(),
                budget: Number(budget) || 0,
                status,
                deadline,
                projectOwner: user?._id
            };

            const res = isEditing
                ? await updateProject(project._id, payload)
                : await addProject(payload);

            if (!res?.data) {
                setError(res?.message || "Project could not be saved.");
                return;
            }

            onSaved?.(res.data);
            if (!isEditing) resetForm();
        } finally {
            setIsSaving(false);
        }
    }

  return (
    <form onSubmit={handleSubmit} className='bg-[#16263e] py-6 px-10 rounded-4xl flex flex-col gap-5 transition-all'>
        <div className='flex justify-between items-center'> 
            <p className='text-2xl'>{isEditing ? "Edit Project" : "New Project"}</p>
            {onCancel ? (
                <button type="button" onClick={onCancel} className='text-sm text-white/50 hover:text-white'>
                    Cancel
                </button>
            ) : null}
        </div>

        {error ? <p className='rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100'>{error}</p> : null}

        <div className='flex flex-col gap-5 md:flex-row'> 
            <input type="text" className='w-full rounded-3xl border-2 border-white/10 bg-white/5 p-3 outline-none focus:border-blue-400/40 md:w-1/2'
            placeholder='Project Name' value={projectName} onChange={(e)=>setProjectName(e.target.value)}/>
            <input type="text" className='w-full rounded-3xl border-2 border-white/10 bg-white/5 p-3 outline-none focus:border-blue-400/40 md:w-1/2'
            placeholder='Client Name' value={clientName} onChange={(e)=>setClientName(e.target.value)}/>
        </div>
        <div>
            <input type="text" className='w-full rounded-3xl border-2 border-white/10 bg-white/5 p-3 outline-none focus:border-blue-400/40'
            placeholder='Description' value={description} onChange={(e)=>setDescription(e.target.value)}/>
        </div>
        <div className='flex flex-col gap-5 md:flex-row'> 
            <input type="number" className='w-full rounded-3xl border-2 border-white/10 bg-white/5 p-3 outline-none focus:border-blue-400/40 md:w-1/2'
            placeholder='Budget' value={budget} onChange={(e)=>setBudget(e.target.value)}/>
            <input type="date" className='w-full rounded-3xl border-2 border-white/10 bg-white/5 p-3 outline-none focus:border-blue-400/40 md:w-1/2'
            placeholder='Deadline' value={deadline} onChange={(e)=>setDeadline(e.target.value)}/>
        </div>
        <div className='flex flex-col gap-3 text-lg md:flex-row md:items-center md:justify-center'> 
            <p className='text-white/50'>Status:</p>
            <div className='flex flex-wrap gap-5'>
                {statusOptions.map((item) => (
                    <label key={item.value} className='flex cursor-pointer items-center gap-2'>
                        <input
                            type="radio"
                            name={`project-status-${project?._id || "new"}`}
                            value={item.value}
                            checked={status === item.value}
                            onChange={(e)=>setStatus(e.target.value)}
                        />
                        <span className={status === item.value ? "text-white" : "text-white/50"}>{item.label}</span>
                    </label>
                ))}
            </div>
        </div>
        <div className='text-center'>
            <button disabled={isSaving} className='bg-blue-900 py-3 px-6 rounded-2xl disabled:cursor-not-allowed disabled:opacity-60'>
                {isSaving ? "Saving..." : isEditing ? "Save Project" : "Add Project"}
            </button>
        </div>
    </form>
  )
}
