import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
    Users,
    Car,
    CheckCircle2,
    MapPin,
    Wallet,
    RefreshCw,
    TrendingUp,
    ShieldCheck
} from 'lucide-react';
import { AuthProvider } from '../../../../AuthProvider/CreateContext';
import config from '../../../utilies/envCongig';

const backendUrl = 'http://localhost:5000/api/v1';

const Dashboard = () => {
    const { token } = useContext(AuthProvider);

    const fetchDashboardStats = async () => {
        const response = await axios.get(`${config.backendUrl}/tripBookedRoute/dashboard/stats`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data;
    };

    const { data: stats, isLoading, isError, refetch, isRefetching } = useQuery({
        queryKey: ['adminDashboardStats', token],
        queryFn: fetchDashboardStats,
        enabled: !!token,
        refetchInterval: 30000
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center text-zinc-100">
                <RefreshCw className="w-10 h-10 text-indigo-500 animate-spin mb-3" />
                <p className="text-zinc-400 font-medium">Loading Overview Stats...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center px-4">
                <div className="bg-rose-950/40 border border-rose-800/60 p-6 rounded-2xl max-w-md text-center">
                    <p className="text-rose-400 font-semibold text-lg mb-4">
                        Failed to load dashboard data
                    </p>
                    <button
                        onClick={() => refetch()}
                        className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition shadow-lg shadow-rose-950/50"
                    >
                        Retry Loading
                    </button>
                </div>
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Drivers',
            value: stats?.totalDrivers || 0,
            icon: Car,
            color: 'text-emerald-400',
            bgColor: 'bg-emerald-950/40',
            borderColor: 'border-emerald-800/40'
        },
        {
            title: 'Total Passengers',
            value: stats?.totalPassengers || 0,
            icon: Users,
            color: 'text-indigo-400',
            bgColor: 'bg-indigo-950/40',
            borderColor: 'border-indigo-800/40'
        },
        {
            title: 'Confirmed Bookings',
            value: stats?.confirmedBookings || 0,
            icon: CheckCircle2,
            color: 'text-teal-400',
            bgColor: 'bg-teal-950/40',
            borderColor: 'border-teal-800/40'
        },
        {
            title: 'Total Trips Posted',
            value: stats?.totalTrips || 0,
            icon: MapPin,
            color: 'text-amber-400',
            bgColor: 'bg-amber-950/40',
            borderColor: 'border-amber-800/40'
        }
    ];
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-10">
            <div className="space-y-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <ShieldCheck className="w-6 h-6 text-indigo-600" />
                            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                                Admin Dashboard
                            </h1>
                        </div>
                        <p className="text-sm text-slate-500">
                            Real-time platform statistics & commission earnings
                        </p>
                    </div>

                    <button
                        onClick={() => refetch()}
                        disabled={isRefetching}
                        className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-4 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm self-start md:self-auto disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 text-indigo-600 ${isRefetching ? 'animate-spin' : ''}`} />
                        <span>Refresh</span>
                    </button>
                </header>

                <section className="bg-gradient-to-r from-indigo-50 via-white to-slate-50 border border-indigo-100 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden">
                    <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-indigo-500/5 blur-3xl pointer-events-none" />
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-indigo-100/80 border border-indigo-200 rounded-2xl">
                                <Wallet className="w-8 h-8 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-widest text-indigo-600 font-bold mb-1">
                                    System Commission Balance
                                </p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                                        ${stats?.adminWalletBalance?.toLocaleString() || '0'}
                                    </span>
                                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                                        <TrendingUp className="w-3.5 h-3.5" /> 5% Commission Fee
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/80 border border-slate-200 px-4 py-3 rounded-2xl shadow-sm">
                            <p className="text-xs text-slate-500 font-medium">
                                Collected automatically from confirmed ride bookings
                            </p>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {statCards.map((card, idx) => {
                        const Icon = card.icon;
                        return (
                            <div
                                key={idx}
                                className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm transition hover:shadow-md hover:border-slate-300 flex flex-col justify-between"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                        {card.title}
                                    </span>
                                    <div className="p-2.5 bg-slate-100 rounded-xl">
                                        <Icon className="w-5 h-5 text-indigo-600" />
                                    </div>
                                </div>
                                <div>
                                    <span className="text-3xl font-black text-slate-900 tracking-tight">
                                        {card.value.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </section>
            </div>
        </div>
    );
};

export default Dashboard;