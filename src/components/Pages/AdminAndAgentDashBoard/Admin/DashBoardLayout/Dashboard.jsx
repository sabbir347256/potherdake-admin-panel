import axios from 'axios';
import { ArrowUpRight, Crown, TrendingUp, UserCheck, Users } from 'lucide-react';
import config from '../../../utilies/envCongig';
import { useQuery } from '@tanstack/react-query';
import { AuthProvider } from '../../../../AuthProvider/CreateContext';
import { useContext } from 'react';

const Dashboard = () => {
    const { token } = useContext(AuthProvider);

    const fetchDashboardStats = async () => {
        const { data } = await axios.get(`${config?.backendUrl}/user/dashboard-stats`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return data.data;
    };

    const { data: statsData, isLoading, isError } = useQuery({
        queryKey: ['dashboardStats'],
        queryFn: fetchDashboardStats
    });

    console.log(statsData)

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <p className="text-red-600 font-semibold">Failed to load dashboard statistics.</p>
            </div>
        );
    }

    const maxCount = Math.max(...(statsData?.graphData?.map(d => d.count) || [1]), 1);

    const stats = [
        {
            title: "Total Members",
            value: statsData?.totalUsers?.toLocaleString() || "0",
            icon: Users,
        },
        {
            title: "Total Agents",
            value: statsData?.totalAgents?.toLocaleString() || "0",
            icon: Users,
        },
        {
            title: "Premium Members",
            value: statsData?.premiumUsers?.toLocaleString() || "0",
            icon: Crown,
        },
        {
            title: "Verified Profiles",
            value: statsData?.verifiedUsers?.toLocaleString() || "0",
            icon: UserCheck,
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 p-4">
            <div className="mb-8">
                <p className="text-gray-500 mt-2">
                    Welcome back to Bibah.app management panel
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {stats.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white rounded-3xl p-6 border border-red-100 shadow-sm hover:shadow-xl transition-all duration-300"
                        >
                            <div className="flex justify-between items-center">
                                <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
                                    <Icon className="text-red-600" size={28} />
                                </div>
                                <div className="flex items-center gap-1 text-green-600 font-semibold">
                                    <ArrowUpRight size={16} />
                                    +5.4%
                                </div>
                            </div>
                            <h3 className="text-gray-500 text-sm mt-6">
                                {item.title}
                            </h3>
                            <h2 className="text-4xl font-bold text-gray-990 mt-2">
                                {item.value}
                            </h2>
                        </div>
                    );
                })}
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mt-8">
                <div className="bg-white rounded-3xl border border-red-100 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <TrendingUp className="text-red-600" />
                        <h2 className="text-xl font-bold text-gray-900">
                            Platform Overview
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-red-50 rounded-2xl p-5">
                            <h3 className="text-gray-500 text-sm">
                                Male Profiles
                            </h3>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {statsData?.maleUsers >= 1000 ? `${(statsData.maleUsers / 1000).toFixed(1)}K` : statsData?.maleUsers || 0}
                            </p>
                        </div>

                        <div className="bg-red-50 rounded-2xl p-5">
                            <h3 className="text-gray-500 text-sm">
                                Female Profiles
                            </h3>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {statsData?.femaleUsers >= 1000 ? `${(statsData.femaleUsers / 1000).toFixed(1)}K` : statsData?.femaleUsers || 0}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-3xl p-8 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                    <h2 className="text-3xl font-bold mb-2">
                        Bibah.app
                    </h2>
                    <p className="text-red-100 mb-8">
                        Connecting hearts, building families.
                    </p>
                    <div className="flex gap-8">
                        <div>
                            <h3 className="text-4xl font-bold">
                                {((statsData?.totalUsers || 0)) >= 1000 ? `${(((statsData?.totalUsers || 0) ) / 1000).toFixed(0)}K+` : ((statsData?.totalUsers || 0))}
                            </h3>
                            <p className="text-red-100">
                                Active Members
                            </p>
                        </div>
                        {/* <div>
                            <h3 className="text-4xl font-bold">1.4K+</h3>
                            <p className="text-red-100">
                                Successful Matches
                            </p>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;