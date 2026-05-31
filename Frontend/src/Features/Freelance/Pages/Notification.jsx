import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Bell, Bot, BriefcaseBusiness, Trash2, Users } from 'lucide-react';
import Navbar from '../Components/Navbar'
import Dock from '../Components/Dock'
import Footer from '../Components/Footer';
import { AuthContext } from '../../Auth/AuthContext';
import {
    clearNotifications,
    deleteNotification,
    fetchNotifications
} from '../Apis/NotificationApi';

const typeIcon = {
    client: <Users size={20} />,
    project: <BriefcaseBusiness size={20} />,
    ai: <Bot size={20} />,
    info: <Bell size={20} />
};

const typeClass = {
    client: "border-emerald-400/20 bg-emerald-500/15 text-emerald-100",
    project: "border-blue-400/20 bg-blue-500/15 text-blue-100",
    ai: "border-violet-400/20 bg-violet-500/15 text-violet-100",
    info: "border-white/10 bg-white/10 text-white"
};

const formatTime = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
    });
};

export default function Notification() {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const loadNotifications = useCallback(async () => {
        if (!user?._id) return;

        setIsLoading(true);
        setError("");

        try {
            const res = await fetchNotifications(user._id);

            if (!Array.isArray(res?.data)) {
                setError(res?.message || "Could not fetch notifications.");
                setNotifications([]);
                return;
            }

            setNotifications(res.data);
        } finally {
            setIsLoading(false);
        }
    }, [user?._id]);

    useEffect(() => {
        loadNotifications();
    }, [loadNotifications]);

    const counts = useMemo(() => ({
        all: notifications.length,
        client: notifications.filter((item) => item.type === "client").length,
        project: notifications.filter((item) => item.type === "project").length,
        ai: notifications.filter((item) => item.type === "ai").length
    }), [notifications]);

    const removeNotification = async (notificationId) => {
        const res = await deleteNotification(notificationId);
        if (!res?.data) {
            setError(res?.message || "Notification could not be deleted.");
            return;
        }

        setNotifications((current) => current.filter((item) => item._id !== notificationId));
    };

    const removeAll = async () => {
        if (!user?._id || !notifications.length) return;

        const confirmed = window.confirm("Clear all notifications?");
        if (!confirmed) return;

        const res = await clearNotifications(user._id);
        if (!res?.data) {
            setError(res?.message || "Notifications could not be cleared.");
            return;
        }

        setNotifications([]);
    };

  return (
    <div className='relative min-h-screen w-full overflow-hidden bg-[#101722]'>
        <div className="pointer-events-none absolute bottom-0 right-0 h-[500px] w-[500px] bg-blue-500 opacity-20 blur-[200px]"/>
        <div className="pointer-events-none absolute left-0 top-[100px] h-[400px] w-[400px] bg-blue-500 opacity-20 blur-[200px]"/>

        <div className='relative z-20 w-full'>
            <div className='sticky top-0 z-30 h-18 w-full'>
                <Navbar/>
            </div>

            <main className='w-full px-6 pb-28 pt-8 md:px-12 xl:px-20'>
                <div className='flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between'>
                    <div>
                        <p className='mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-200'>
                            <Bell size={16} />
                            Activity center
                        </p>
                        <h1 className='text-3xl font-semibold'>Notifications</h1>
                        <p className='mt-2 text-xl text-white/50'>
                            Client, project, and AI activity from your workspace.
                        </p>
                    </div>

                    <button
                        onClick={removeAll}
                        disabled={!notifications.length}
                        className='h-11 rounded-full border border-white/10 bg-white/10 px-5 text-sm text-white/70 transition hover:bg-white/15 hover:text-white disabled:cursor-not-allowed disabled:opacity-40'
                    >
                        Clear All
                    </button>
                </div>

                <div className='mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4'>
                    {[
                        ["All", counts.all],
                        ["Clients", counts.client],
                        ["Projects", counts.project],
                        ["AI", counts.ai]
                    ].map(([label, value]) => (
                        <div key={label} className='rounded-3xl border border-white/10 bg-white/5 p-4'>
                            <p className='text-sm text-white/45'>{label}</p>
                            <p className='mt-2 text-2xl font-semibold'>{value}</p>
                        </div>
                    ))}
                </div>

                {error ? (
                    <p className='mt-6 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100'>
                        {error}
                    </p>
                ) : null}

                <section className='mt-8 rounded-4xl border border-white/10 bg-[#16263e]/85 p-5'>
                    {isLoading ? (
                        <div className='flex flex-col gap-4'>
                            {[1, 2, 3].map((item) => (
                                <div key={item} className='h-24 animate-pulse rounded-3xl bg-white/5' />
                            ))}
                        </div>
                    ) : notifications.length ? (
                        <div className='flex flex-col gap-4'>
                            {notifications.map((notification) => (
                                <article key={notification._id} className='flex items-start justify-between gap-4 rounded-3xl border border-white/8 bg-white/[0.03] p-5'>
                                    <div className='flex min-w-0 gap-4'>
                                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${typeClass[notification.type] || typeClass.info}`}>
                                            {typeIcon[notification.type] || typeIcon.info}
                                        </div>
                                        <div className='min-w-0'>
                                            <div className='flex flex-wrap items-center gap-3'>
                                                <h2 className='text-base font-medium'>{notification.title}</h2>
                                                <span className='rounded-full bg-white/10 px-3 py-1 text-xs capitalize text-white/50'>
                                                    {notification.action}
                                                </span>
                                            </div>
                                            <p className='mt-2 text-sm text-white/55'>{notification.message}</p>
                                            <p className='mt-3 text-xs text-white/35'>{formatTime(notification.createdAt)}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => removeNotification(notification._id)}
                                        className='rounded-full p-2 text-white/40 transition hover:bg-red-500/10 hover:text-red-200'
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className='rounded-3xl border border-dashed border-white/10 p-25 text-center text-white/45'>
                            No notifications yet. Create a client, update a project, or generate AI content to see activity here.
                        </div>
                    )}
                </section>
            </main>
        </div>

        <div className='relative z-10 h-15 w-full'>
            <Footer/>
        </div>

        <div className='fixed bottom-1 z-40 flex h-18 w-full items-end justify-center px-4'>
            <div className='h-16 w-full max-w-[560px] rounded-4xl border-1 border-white/10 bg-[#16263e]/95 backdrop-blur-md md:w-1/2 xl:w-1/3'>
                <Dock/>
            </div>
        </div>
    </div>
  )
}
