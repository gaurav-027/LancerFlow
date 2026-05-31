import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    AlertCircle,
    ArrowUpRight,
    BadgeDollarSign,
    Bot,
    BriefcaseBusiness,
    CalendarDays,
    CheckCircle2,
    CircleDashed,
    Clock3,
    FileText,
    Plus,
    Sparkles,
    TrendingUp,
    Users
} from "lucide-react";
import { AuthContext } from "../../Auth/AuthContext.jsx";
import { fetchClient } from "../Apis/ClientApi.jsx";
import { fetchProjects } from "../Apis/ProjectApi.jsx";

const sampleProjects = [
    {
        _id: "sample-1",
        projectName: "SaaS Landing Refresh",
        clientName: "Devhub Agency",
        budget: 4200,
        status: "in-progress",
        deadline: "2026-05-18"
    },
    {
        _id: "sample-2",
        projectName: "Mobile App Proposal",
        clientName: "Nexus Studio",
        budget: 1800,
        status: "pending",
        deadline: "2026-05-10"
    },
    {
        _id: "sample-3",
        projectName: "Automation Dashboard",
        clientName: "BrightOps",
        budget: 6400,
        status: "completed",
        deadline: "2026-04-29"
    }
];

const sampleClients = [
    {
        _id: "client-1",
        clientName: "John Doe",
        clientCompany: "Devhub Agency",
        clientStatus: "active"
    },
    {
        _id: "client-2",
        clientName: "Priya Shah",
        clientCompany: "Nexus Studio",
        clientStatus: "onboarding"
    },
    {
        _id: "client-3",
        clientName: "Alex Carter",
        clientCompany: "BrightOps",
        clientStatus: "pending"
    }
];

const statusStyles = {
    pending: "bg-amber-500/15 text-amber-200 border-amber-400/20",
    "in-progress": "bg-blue-500/15 text-blue-200 border-blue-400/20",
    completed: "bg-emerald-500/15 text-emerald-200 border-emerald-400/20",
    active: "bg-blue-500/15 text-blue-200 border-blue-400/20",
    onboarding: "bg-violet-500/15 text-violet-200 border-violet-400/20"
};

const normalizeStatus = (status) => {
    const cleaned = String(status || "pending").toLowerCase().trim();

    if (["done", "complete", "completed"].includes(cleaned)) return "completed";
    if (["active", "in progress", "in-progress", "working"].includes(cleaned)) return "in-progress";
    if (["todo", "to do", "pending"].includes(cleaned)) return "pending";

    return cleaned;
};

const getStatusLabel = (status) => {
    const normalized = normalizeStatus(status);

    if (normalized === "in-progress") return "In Progress";
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

const getStatusIcon = (status) => {
    const normalized = normalizeStatus(status);

    if (normalized === "completed") return <CheckCircle2 size={15} />;
    if (normalized === "in-progress") return <CircleDashed size={15} />;
    return <Clock3 size={15} />;
};

const getDeadlineLabel = (deadline) => {
    const date = deadline ? new Date(deadline) : null;

    if (!date || Number.isNaN(date.getTime())) return "No deadline";

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short"
    });
};

const getDeadlineState = (deadline, status) => {
    if (normalizeStatus(status) === "completed") return "Done";

    const date = deadline ? new Date(deadline) : null;
    if (!date || Number.isNaN(date.getTime())) return "Unscheduled";

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    const days = Math.ceil((date - today) / 86400000);

    if (days < 0) return "Overdue";
    if (days === 0) return "Today";
    if (days <= 7) return `${days}d left`;
    return `${days}d left`;
};

const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
    }).format(Number(value) || 0);

const getBudget = (project) => Number(project?.budget) || 0;

const getInitials = (name = "") =>
    name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "LF";

export default function DashboardItem() {
    const router = useNavigate();
    const { user } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [usesDemoData, setUsesDemoData] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadDashboard = async () => {
            if (!user?._id) {
                setProjects(sampleProjects);
                setClients(sampleClients);
                setUsesDemoData(true);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);

            const [clientResult, projectResult] = await Promise.all([
                fetchClient(user._id),
                fetchProjects(user._id)
            ]);

            if (!isMounted) return;

            const loadedClients = Array.isArray(clientResult?.data) ? clientResult.data : null;
            const loadedProjects = Array.isArray(projectResult?.data) ? projectResult.data : null;
            const shouldUseDemo = !loadedClients || !loadedProjects;

            setClients(shouldUseDemo ? sampleClients : loadedClients);
            setProjects(shouldUseDemo ? sampleProjects : loadedProjects);
            setUsesDemoData(shouldUseDemo);
            setIsLoading(false);
        };

        loadDashboard();

        return () => {
            isMounted = false;
        };
    }, [user?._id]);

    const dashboard = useMemo(() => {
        const totalRevenue = projects
            .filter((project) => normalizeStatus(project.status) === "completed")
            .reduce((sum, project) => sum + getBudget(project), 0);

        const projectedRevenue = projects.reduce((sum, project) => sum + getBudget(project), 0);
        const pendingPayments = projects
            .filter((project) => normalizeStatus(project.status) !== "completed")
            .reduce((sum, project) => sum + getBudget(project), 0);

        const activeProjects = projects.filter((project) =>
            ["pending", "in-progress"].includes(normalizeStatus(project.status))
        ).length;

        const completedProjects = projects.filter(
            (project) => normalizeStatus(project.status) === "completed"
        ).length;

        const nextDeadline = [...projects]
            .filter((project) => normalizeStatus(project.status) !== "completed" && project.deadline)
            .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))[0];

        const statusCounts = projects.reduce(
            (counts, project) => {
                const status = normalizeStatus(project.status);
                counts[status] = (counts[status] || 0) + 1;
                return counts;
            },
            { pending: 0, "in-progress": 0, completed: 0 }
        );

        const maxBudget = Math.max(...projects.map(getBudget), 1);

        return {
            totalRevenue,
            projectedRevenue,
            pendingPayments,
            activeProjects,
            completedProjects,
            nextDeadline,
            statusCounts,
            maxBudget
        };
    }, [projects]);

    const statCards = [
        {
            title: "Earned Revenue",
            value: formatCurrency(dashboard.totalRevenue),
            detail: `${formatCurrency(dashboard.projectedRevenue)} total pipeline`,
            icon: <BadgeDollarSign size={22} />,
            tone: "text-emerald-200 bg-emerald-500/15 border-emerald-400/20"
        },
        {
            title: "Active Projects",
            value: dashboard.activeProjects,
            detail: `${dashboard.completedProjects} completed`,
            icon: <BriefcaseBusiness size={22} />,
            tone: "text-blue-200 bg-blue-500/15 border-blue-400/20"
        },
        {
            title: "Pending Payments",
            value: formatCurrency(dashboard.pendingPayments),
            detail: "Open project value",
            icon: <Clock3 size={22} />,
            tone: "text-amber-200 bg-amber-500/15 border-amber-400/20"
        },
        {
            title: "AI Workspace",
            value: `${projects.length + clients.length}`,
            detail: "Records ready for AI",
            icon: <Sparkles size={22} />,
            tone: "text-violet-200 bg-violet-500/15 border-violet-400/20"
        }
    ];

    const recentProjects = [...projects]
        .sort((a, b) => new Date(a.deadline || 0) - new Date(b.deadline || 0))
        .slice(0, 4);

    const recentClients = clients.slice(0, 4);
    const progressTotal = Math.max(projects.length, 1);

    if (isLoading) {
        return (
            <div className="w-full px-6 py-8 md:px-10 xl:px-20">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="h-36 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <main className="relative z-10 w-full px-6 pb-28 pt-8 md:px-10 xl:px-20">
            <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-200">
                        <TrendingUp size={16} />
                        Freelancer command center
                    </p>
                    <h1 className="text-3xl font-semibold text-white md:text-4xl">
                        Dashboard Overview
                    </h1>
                    <p className="mt-2 max-w-2xl text-base text-white/55">
                        Track revenue, deadlines, clients, and AI-ready work from one place.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => router("/project")}
                        className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/10 px-5 text-sm text-white transition hover:bg-white/15"
                    >
                        <Plus size={17} />
                        Project
                    </button>
                    <button
                        onClick={() => router("/client")}
                        className="inline-flex h-11 items-center gap-2 rounded-full bg-blue-700 px-5 text-sm text-white transition hover:bg-blue-600"
                    >
                        <Users size={17} />
                        Client
                    </button>
                </div>
            </div>

            {usesDemoData ? (
                <div className="mb-6 flex items-center gap-3 rounded-3xl border border-amber-400/20 bg-amber-500/10 px-5 py-4 text-sm text-amber-100">
                    <AlertCircle size={18} className="shrink-0" />
                    <p>Showing demo dashboard data because live records could not be loaded.</p>
                </div>
            ) : null}

            <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                {statCards.map((card) => (
                    <div
                        key={card.title}
                        className="rounded-3xl border border-white/10 bg-[#16263e]/85 p-6 shadow-2xl shadow-black/10"
                    >
                        <div className="flex items-start justify-between">
                            <div className={`rounded-2xl border p-3 ${card.tone}`}>
                                {card.icon}
                            </div>
                            <ArrowUpRight size={18} className="text-white/35" />
                        </div>
                        <p className="mt-7 text-sm text-white/50">{card.title}</p>
                        <p className="mt-2 text-3xl font-semibold text-white">{card.value}</p>
                        <p className="mt-2 text-sm text-white/45">{card.detail}</p>
                    </div>
                ))}
            </section>

            <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_1fr]">
                <div className="rounded-3xl border border-white/10 bg-[#16263e]/85 p-6">
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-semibold">Project Pipeline</h2>
                            <p className="mt-1 text-sm text-white/45">Budget and delivery status by project.</p>
                        </div>
                        <button
                            onClick={() => router("/project")}
                            className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                        >
                            View all
                        </button>
                    </div>

                    {recentProjects.length ? (
                        <div className="flex flex-col gap-4">
                            {recentProjects.map((project) => {
                                const status = normalizeStatus(project.status);
                                const budgetWidth = `${Math.max((getBudget(project) / dashboard.maxBudget) * 100, 8)}%`;

                                return (
                                    <div key={project._id || project.projectName} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                            <div>
                                                <h3 className="text-base font-medium text-white">
                                                    {project.projectName || "Untitled Project"}
                                                </h3>
                                                <p className="mt-1 text-sm text-white/45">
                                                    {project.clientName || "No client assigned"}
                                                </p>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${statusStyles[status] || statusStyles.pending}`}>
                                                    {getStatusIcon(status)}
                                                    {getStatusLabel(status)}
                                                </span>
                                                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/65">
                                                    <CalendarDays size={14} />
                                                    {getDeadlineState(project.deadline, status)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                                            <div className="h-full rounded-full bg-blue-500" style={{ width: budgetWidth }} />
                                        </div>
                                        <div className="mt-3 flex justify-between text-sm">
                                            <span className="text-white/45">Budget</span>
                                            <span className="text-white">{formatCurrency(project.budget)}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-white/50">
                            No projects yet. Add one from the Project board.
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-6">
                    <div className="rounded-3xl border border-white/10 bg-[#16263e]/85 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold">Work Health</h2>
                                <p className="mt-1 text-sm text-white/45">Current project spread.</p>
                            </div>
                            <BriefcaseBusiness size={22} className="text-blue-200" />
                        </div>

                        <div className="mt-6 flex flex-col gap-5">
                            {[
                                { label: "Pending", value: dashboard.statusCounts.pending, color: "bg-amber-400" },
                                { label: "In Progress", value: dashboard.statusCounts["in-progress"], color: "bg-blue-400" },
                                { label: "Completed", value: dashboard.statusCounts.completed, color: "bg-emerald-400" }
                            ].map((item) => (
                                <div key={item.label}>
                                    <div className="mb-2 flex justify-between text-sm">
                                        <span className="text-white/60">{item.label}</span>
                                        <span>{item.value}</span>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                                        <div
                                            className={`h-full rounded-full ${item.color}`}
                                            style={{ width: `${Math.max((item.value / progressTotal) * 100, item.value ? 8 : 0)}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-[#16263e]/85 p-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-2xl border border-blue-400/20 bg-blue-500/15 p-3 text-blue-100">
                                <CalendarDays size={21} />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">Next Deadline</h2>
                                <p className="mt-1 text-sm text-white/45">
                                    {dashboard.nextDeadline?.projectName || "No upcoming deadline"}
                                </p>
                            </div>
                        </div>
                        <div className="mt-5 rounded-2xl bg-white/[0.04] p-4">
                            <p className="text-3xl font-semibold">
                                {dashboard.nextDeadline ? getDeadlineLabel(dashboard.nextDeadline.deadline) : "--"}
                            </p>
                            <p className="mt-2 text-sm text-white/45">
                                {dashboard.nextDeadline
                                    ? `${getDeadlineState(dashboard.nextDeadline.deadline, dashboard.nextDeadline.status)} for ${dashboard.nextDeadline.clientName || "client work"}`
                                    : "Your upcoming work will appear here."}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr]">
                <div className="rounded-3xl border border-white/10 bg-[#16263e]/85 p-6">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold">Client Portfolio</h2>
                            <p className="mt-1 text-sm text-white/45">Recent client relationships.</p>
                        </div>
                        <Users size={22} className="text-blue-200" />
                    </div>

                    <div className="flex flex-col gap-3">
                        {recentClients.length ? recentClients.map((client) => {
                            const status = normalizeStatus(client.clientStatus);

                            return (
                                <div key={client._id || client.clientEmail || client.clientName} className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600/30 text-sm font-semibold text-blue-100">
                                            {getInitials(client.clientName)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate font-medium">{client.clientName || "Unnamed Client"}</p>
                                            <p className="truncate text-sm text-white/45">{client.clientCompany || "Independent"}</p>
                                        </div>
                                    </div>
                                    <span className={`shrink-0 rounded-full border px-3 py-1 text-xs ${statusStyles[status] || statusStyles.pending}`}>
                                        {client.clientStatus || "pending"}
                                    </span>
                                </div>
                            );
                        }) : (
                            <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-white/50">
                                No clients yet. Add one from the Client page.
                            </div>
                        )}
                    </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-[#16263e]/85 p-6">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold">AI Shortcuts</h2>
                            <p className="mt-1 text-sm text-white/45">Generate documents from your workspace.</p>
                        </div>
                        <Bot size={23} className="text-violet-200" />
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {[
                            { label: "Email", path: "/ai/email", icon: <FileText size={18} /> },
                            { label: "Proposal", path: "/ai/proposal", icon: <Sparkles size={18} /> },
                            { label: "Contract", path: "/ai/contract", icon: <BriefcaseBusiness size={18} /> },
                            { label: "Invoice", path: "/ai/invoice", icon: <BadgeDollarSign size={18} /> }
                        ].map((item) => (
                            <button
                                key={item.label}
                                onClick={() => router(item.path)}
                                className="flex h-24 items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left transition hover:border-blue-400/30 hover:bg-blue-500/10"
                            >
                                <span>
                                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white">
                                        {item.icon}
                                    </span>
                                    <span className="mt-3 block text-sm font-medium">{item.label}</span>
                                </span>
                                <ArrowUpRight size={18} className="text-white/35" />
                            </button>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
