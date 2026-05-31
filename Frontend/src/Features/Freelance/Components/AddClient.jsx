import React, { useContext, useState } from 'react';
import { addClient, updateClient } from '../Apis/ClientApi';
import { AuthContext } from '../../Auth/AuthContext';

export default function AddClient({ client, onSaved, onCancel }) {
    const { user } = useContext(AuthContext);
    const isEditing = Boolean(client?._id);

    const [clientName, setClientName] = useState(client?.clientName || "");
    const [companyName, setCompanyName] = useState(client?.clientCompany || "");
    const [clientPhone, setClientPhone] = useState(client?.clientPhone || "");
    const [clientEmail, setClientEmail] = useState(client?.clientEmail || "");
    const [status, setStatus] = useState(client?.clientStatus || "active");
    const [error, setError] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const resetForm = () => {
        setClientName("");
        setCompanyName("");
        setClientPhone("");
        setClientEmail("");
        setStatus("active");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!clientName.trim() || !clientPhone.trim() || !clientEmail.trim()) {
            setError("Client name, phone, and email are required.");
            return;
        }

        setError("");
        setIsSaving(true);

        try {
            const payload = {
                clientName: clientName.trim(),
                clientCompany: companyName.trim(),
                clientPhone: clientPhone.trim(),
                clientEmail: clientEmail.trim(),
                clientStatus: status,
                clientOwner: user?._id
            };

            const res = isEditing
                ? await updateClient(client._id, payload)
                : await addClient(payload);

            if (!res?.data) {
                setError(res?.message || "Client could not be saved.");
                return;
            }

            onSaved?.(res.data);
            if (!isEditing) resetForm();
        } finally {
            setIsSaving(false);
        }
    };

  return (
    <form onSubmit={handleSubmit} className='bg-[#16263e] py-6 px-10 rounded-4xl flex flex-col gap-5 transition-all'>
        <div className='flex justify-between items-center'> 
            <p className='text-2xl'>{isEditing ? "Edit Client" : "New Client"}</p>
            {onCancel ? (
                <button type="button" onClick={onCancel} className='text-sm text-white/50 hover:text-white'>
                    Cancel
                </button>
            ) : null}
        </div>

        {error ? <p className='rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100'>{error}</p> : null}

        <div className='flex flex-col gap-5 md:flex-row'> 
            <input type="text" className='w-full rounded-3xl border-2 border-white/10 bg-white/5 p-3 outline-none focus:border-blue-400/40 md:w-1/2'
            placeholder='Client Name' value={clientName} onChange={(e)=>setClientName(e.target.value)}/>
            <input type="text" className='w-full rounded-3xl border-2 border-white/10 bg-white/5 p-3 outline-none focus:border-blue-400/40 md:w-1/2'
            placeholder='Client Company' value={companyName} onChange={(e)=>setCompanyName(e.target.value)}/>
        </div>
        <div className='flex flex-col gap-5 md:flex-row'> 
            <input type="tel" className='w-full rounded-3xl border-2 border-white/10 bg-white/5 p-3 outline-none focus:border-blue-400/40 md:w-1/2'
            placeholder='Client Phone' value={clientPhone} onChange={(e)=>setClientPhone(e.target.value)}/>
            <input type="email" className='w-full rounded-3xl border-2 border-white/10 bg-white/5 p-3 outline-none focus:border-blue-400/40 md:w-1/2'
            placeholder='Client Email' value={clientEmail} onChange={(e)=>setClientEmail(e.target.value)}/>
        </div>
        <div className='flex flex-col gap-3 text-lg md:flex-row md:items-center md:justify-center'> 
            <p className='text-white/50'>Status:</p>
            <div className='flex flex-wrap gap-5'>
                {["active", "pending", "onboarding"].map((item) => (
                    <label key={item} className='flex cursor-pointer items-center gap-2 capitalize'>
                        <input
                            type="radio"
                            name={`client-status-${client?._id || "new"}`}
                            value={item}
                            checked={status === item}
                            onChange={(e)=>setStatus(e.target.value)}
                        />
                        <span className={status === item ? "text-white" : "text-white/50"}>{item}</span>
                    </label>
                ))}
            </div>
        </div>
        <div className='text-center'>
            <button disabled={isSaving} className='bg-blue-900 py-3 px-6 rounded-2xl disabled:cursor-not-allowed disabled:opacity-60'>
                {isSaving ? "Saving..." : isEditing ? "Save Client" : "Add Client"}
            </button>
        </div>
    </form>
  )
}
