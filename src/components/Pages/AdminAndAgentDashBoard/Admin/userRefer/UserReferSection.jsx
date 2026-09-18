import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import config from "../../../utilies/envCongig";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


const UserReferSection = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const limit = 100;
    const queryClient = useQueryClient();

    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";

    const fetchReferredUsers = async () => {
        const { data } = await axios.get(
            `${config?.backendUrl}/user/referred-by-agents?page=${page}&limit=${limit}&searchTerm=${searchTerm}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return data;
    };

    const { data: responseData, isLoading, isError, error } = useQuery({
        queryKey: ["referredUsers", page, searchTerm],
        queryFn: fetchReferredUsers
    });

    const tableData = responseData?.data || [];
    const meta = responseData?.meta || { page: 1, limit: 10, total: 0, totalPage: 1 };

    const statusMutation = useMutation({
        mutationFn: async ({ userId, newStatus }) => {
            const { data } = await axios.patch(
                `${config?.backendUrl}/user/${userId}/status`,
                { isActive: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            return data;
        },
        onSuccess: () => {
            toast.success("Status updated successfully");
            queryClient.invalidateQueries(["referredUsers"]);
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Status update failed");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (userId) => {
            const { data } = await axios.delete(
                `${config?.backendUrl}/user/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            return data;
        },
        onSuccess: () => {
            toast.success("User deleted successfully");
            queryClient.invalidateQueries(["referredUsers"]);
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Delete operation failed");
        }
    });

    const handleStatusChange = (userId, newStatus) => {
        statusMutation.mutate({ userId, newStatus });
    };

    const handleDelete = (userId) => {
        if (confirm("Are you sure you want to delete this user?")) {
            deleteMutation.mutate(userId);
        }
    };

    return (
        <div className="bg-[#fffbfb] min-h-screen mt-4 w-full px-6">
            <Toaster position="top-right" reverseOrder={false} />

            <div className="py-4">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setPage(1);
                    }}
                    placeholder="Search by Name, Email, Phone, User ID..."
                    className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                SL
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                User Details
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Referred Agent
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            {/* <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th> */}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                                    Loading data...
                                </td>
                            </tr>
                        ) : isError ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-sm text-red-500">
                                    Error: {error?.response?.data?.message || "Something went wrong"}
                                </td>
                            </tr>
                        ) : tableData.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                                    No referred users found
                                </td>
                            </tr>
                        ) : (
                            tableData.map((user, index) => (
                                <tr key={user._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {(page - 1) * limit + index + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div className="font-semibold">{user.fullName}</div>
                                        <div className="text-xs text-gray-500">ID: {user.userID}</div>
                                        <div className="text-xs text-gray-500">
                                            {user.email} | {user.contactNo}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {user.agentInfo ? (
                                            <div>
                                                <div className="font-semibold text-emerald-700">
                                                    {user.agentInfo.fullName}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Agent ID: {user.agentInfo.userID}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Ref Code: {user.agentInfo.ownRefarelID}
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-amber-600 font-medium">
                                                N/A (Invalid Agent Ref)
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span
                                            className={`px-2 py-1 rounded border text-xs font-semibold uppercase ${user.isActive === "ACTIVE"
                                                    ? "text-emerald-800 bg-emerald-50 border-emerald-300"
                                                    : user.isActive === "INACTIVE"
                                                        ? "text-gray-800 bg-gray-50 border-gray-300"
                                                        : "text-amber-800 bg-amber-50 border-amber-300"
                                                }`}
                                        >
                                            {user.isActive || "ACTIVE"}
                                        </span>
                                    </td>
                                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="text-red-600 hover:text-red-900 p-1 transition-colors inline-flex items-center"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </td> */}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 pb-6">
                <button
                    disabled={page === 1}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-sm text-gray-700">
                    Page {page} of {meta.totalPage || 1}
                </span>
                <button
                    disabled={page >= (meta.totalPage || 1)}
                    onClick={() => setPage((prev) => Math.min(prev + 1, meta.totalPage || 1))}
                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default UserReferSection;