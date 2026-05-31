import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react' ;
import { MailIcon } from '../../../components/ui/mail-icon.jsx' ;
import { PhoneIcon } from '../../../components/ui/phone-icon.jsx' ;
import { Trash2Icon } from '../../../components/ui/trash-2-icon.jsx' ;
import AddClient from './AddClient.jsx' ;
import { XIcon } from '../../../components/ui/x' ;
import { PlusIcon } from "../../../components/ui/plus.jsx" ;
import { deleteClient, fetchClient } from '../Apis/ClientApi.jsx' ;
import { AuthContext } from '../../Auth/AuthContext.jsx' ;
import { notify } from '../utils/notify.js';

const statusClass = {
    active: "bg-emerald-500/15 text-emerald-100 border-emerald-400/20",
    pending: "bg-amber-500/15 text-amber-100 border-amber-400/20",
    onboarding: "bg-blue-500/15 text-blue-100 border-blue-400/20"
};

const getInitials = (name = "") =>
    name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "LF";

export default function ClientDetails() {
    const { user } = useContext(AuthContext);
    const ownerid = user?._id;

    const [showForm,setShowForm] = useState(false);
    const [clients, setClients] = useState([]);
    const [editingClient, setEditingClient] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const getClients = useCallback(async () => {
        if (!ownerid) return; 
        
        setIsLoading(true);
        setError("");

        try {
            const res = await fetchClient(ownerid);

            if (!Array.isArray(res?.data)) {
                setError(res?.message || "Could not fetch clients.");
                setClients([]);
                return;
            }

            setClients(res.data);
        } finally {
            setIsLoading(false);
        }
    }, [ownerid]);

    useEffect(() => {
        getClients();
    }, [getClients]);

    const counts = useMemo(() => ({
        total: clients.length,
        active: clients.filter((client) => client.clientStatus === "active").length,
        pending: clients.filter((client) => client.clientStatus === "pending").length,
        onboarding: clients.filter((client) => client.clientStatus === "onboarding").length
    }), [clients]);

    const handleSaved = (savedClient) => {
        const wasEditing = clients.some((client) => client._id === savedClient._id);
        setClients((current) => {
            const exists = current.some((client) => client._id === savedClient._id);
            if (exists) {
                return current.map((client) => client._id === savedClient._id ? savedClient : client);
            }
            return [savedClient, ...current];
        });
        setShowForm(false);
        setEditingClient(null);
        notify({
            ownerId: ownerid,
            type: "client",
            action: wasEditing ? "updated" : "created",
            title: wasEditing ? "Client updated" : "Client created",
            message: `${savedClient.clientName} was ${wasEditing ? "updated" : "added"} in your client portfolio.`
        });
    };

    const handleDelete = async (clientId) => {
        const confirmed = window.confirm("Delete this client?");
        if (!confirmed) return;

        const res = await deleteClient(clientId);
        if (!res?.data) {
            setError(res?.message || "Client could not be deleted.");
            return;
        }

        setClients((current) => current.filter((client) => client._id !== clientId));
        notify({
            ownerId: ownerid,
            type: "client",
            action: "deleted",
            title: "Client deleted",
            message: `${res.data.clientName} was removed from your client portfolio.`
        });
    };

  return (
    <div className='w-full h-full py-8 px-6 md:px-12 xl:px-20 flex flex-col gap-8'>
        <div className='flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between'>
            <div>
                <h1 className='text-3xl'>Client Portfolio</h1>
                <p className='text-white/50 text-xl'>Manage your active partnership & lead pipeline</p>
            </div>
            <button
                onClick={()=>{setShowForm((value) => !value); setEditingClient(null);}}
                className='bg-blue-800 text-[18px] rounded-4xl cursor-pointer h-12 w-45 flex justify-center items-center'
            >
                {showForm ? <XIcon/> : <PlusIcon/>}
                <p>{showForm ? "Close Form" : "Add New Client"}</p>
            </button>
        </div>

        <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
            {[
                ["Total", counts.total],
                ["Active", counts.active],
                ["Pending", counts.pending],
                ["Onboarding", counts.onboarding]
            ].map(([label, value]) => (
                <div key={label} className='rounded-3xl border border-white/10 bg-white/5 p-4'>
                    <p className='text-sm text-white/45'>{label}</p>
                    <p className='mt-2 text-2xl font-semibold'>{value}</p>
                </div>
            ))}
        </div>

        {error ? <p className='rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100'>{error}</p> : null}

        {showForm ? (
            <AddClient onSaved={handleSaved} onCancel={() => setShowForm(false)} />
        ) : null}

        {editingClient ? (
            <AddClient client={editingClient} onSaved={handleSaved} onCancel={() => setEditingClient(null)} />
        ) : null}

        <hr className='border-white/10'/>

        {isLoading ? (
            <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
                {[1, 2, 3].map((item) => (
                    <div key={item} className='h-[300px] animate-pulse rounded-4xl bg-white/5' />
                ))}
            </div>
        ) : clients.length ? (
            <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
                {clients.map((client) => (
                    <div key={client._id} className='min-h-[320px] bg-[#16263e] rounded-4xl p-6 flex flex-col justify-between gap-6'>
                        <div className='flex flex-col gap-5'>
                            <div className='flex justify-between gap-4'>
                                <div className='h-18 w-18 shrink-0 rounded-full border-2 border-white/15 bg-blue-700/25 flex items-center justify-center text-xl font-semibold'>
                                    {getInitials(client.clientName)}
                                </div>
                                <div className={`h-10 flex justify-center items-center px-4 rounded-lg border text-sm capitalize ${statusClass[client.clientStatus] || statusClass.pending}`}>
                                    {client.clientStatus || "pending"}
                                </div>
                            </div>
                            <div>
                                <h2 className='text-xl mt-1'>{client.clientName}</h2>
                                <p className='text-white/50 text-sm'>{client.clientCompany || "Independent Client"}</p>
                            </div>
                            <div className='text-white/80 flex flex-col gap-2 text-sm'>
                                <div className='flex items-center gap-2 min-w-0'>
                                    <MailIcon size={15}/>
                                    <p className='truncate'>{client.clientEmail}</p>
                                </div>
                                <div className='flex items-center gap-2 min-w-0'>
                                    <PhoneIcon size={15}/>
                                    <p className='truncate'>{client.clientPhone}</p>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col gap-5'>
                            <hr className='border-white/30' />
                            <div className='flex justify-between items-center'>
                                <button onClick={() => handleDelete(client._id)} className='text-white/60 transition hover:text-red-200'>
                                    <Trash2Icon size={28}/>
                                </button>
                                <button onClick={() => { setEditingClient(client); setShowForm(false); }} className='bg-blue-900 py-2 px-4 rounded-lg'>
                                    Edit
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className='rounded-4xl border border-dashed border-white/10 bg-white/5 p-28 text-center text-white/45'>
                No clients yet. Add your first client to see it here.
            </div>
        )}
    </div>
  )
}
