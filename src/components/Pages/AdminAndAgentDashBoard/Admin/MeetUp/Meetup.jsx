import { useState } from "react";
import { useCustomQuery } from "../../../utilies/useCustomQuery";
import axios from "axios";
import { Trash2 } from "lucide-react";
import SearchInput from "../../../utilies/SearchInput";
import DynamicHeader from "../../../DynamicComponent/DynamicHeader";
import config from "../../../utilies/envCongig";
import toast, { Toaster } from "react-hot-toast";

const Meetup = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data: meetupResponse, refetch } = useCustomQuery({
        url: `${config?.backendUrl}/meetup?searchTerm=${searchTerm}&page=${page}&limit=${limit}`,
        queryKey: ["meetups", searchTerm, page],
    });

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${config?.backendUrl}/meetup/${id}`);
            toast.success("Deleted successfully!");
            refetch();
        } catch (error) {
            console.error(error);
        }
    };

    const meetups = meetupResponse?.data || [];
    const meta = meetupResponse?.meta || { totalPage: 1 };

    console.log(meetups)


    return (
        <div>
            <Toaster position="top-right" reverseOrder={false} />

            <div className="flex justify-between md:items-center flex-col md:flex-row">
                <DynamicHeader
                    mainHeader={"Meetup Request Management"}
                    subHeaderName={`${meetupResponse?.length} total users`}
                />
            </div>
            <div className="bg-[#fffbfb] min-h-screen mt-4 overflow-x-auto w-full px-6">
                {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Meetup Request Management</h1>
                        <p className="text-xs text-slate-400">Review, search and process member physical meetup connection forms.</p>
                    </div>
                    <SearchInput onSearch={(value) => { setSearchTerm(value); setPage(1); }} placeholder="Search user ID or phone..." />
                </div> */}

                <table className="min-w-full divide-y divide-gray-200 border">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant User ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target User ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Number</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submission Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {meetups.length > 0 ? (
                            meetups.map((meetup) => (
                                <tr key={meetup._id} className="hover:bg-slate-850 transition">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {meetup.applicantUser?.fullName || "Unknown User"}
                                        <span className="block text-[10px] text-slate-500 font-mono mt-0.5">{meetup.user?.email || ""}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{meetup.userId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{meetup.targetUserId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{meetup.mobileNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {meetup.createdAt ? new Date(meetup.createdAt).toLocaleDateString() : "N/A"}
                                    </td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => handleDelete(meetup._id)}
                                            className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60 hover:text-red-300 border border-red-900/30 transition"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-slate-500 font-medium">
                                    No meetup records found matching the system search criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {meta.totalPage > 1 && (
                    <div className="flex justify-end gap-2 mt-4 text-xs">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage((prev) => prev - 1)}
                            className="px-3 py-1.5 rounded-md border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 transition disabled:opacity-40"
                        >
                            Previous
                        </button>
                        <span className="flex items-center px-3 text-slate-400">
                            Page {page} of {meta.totalPage}
                        </span>
                        <button
                            disabled={page === meta.totalPage}
                            onClick={() => setPage((prev) => prev + 1)}
                            className="px-3 py-1.5 rounded-md border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 transition disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Meetup;