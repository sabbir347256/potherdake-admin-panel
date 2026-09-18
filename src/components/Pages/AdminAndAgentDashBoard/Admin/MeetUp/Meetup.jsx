import { useContext, useState } from "react";
import { useCustomQuery } from "../../../utilies/useCustomQuery";
import axios from "axios";
import { Trash2 } from "lucide-react";
import SearchInput from "../../../utilies/SearchInput";
import DynamicHeader from "../../../DynamicComponent/DynamicHeader";
import config from "../../../utilies/envCongig";
import toast, { Toaster } from "react-hot-toast";
import { AuthProvider } from "../../../../AuthProvider/CreateContext";

const Meetup = () => {
    const { token } = useContext(AuthProvider)
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;

    const authHeader = token ? { Authorization: `Bearer ${token}` } : undefined;

    const { data: meetupResponse, refetch } = useCustomQuery({
        url: `${config?.backendUrl}/user/drivers`,
        queryKey: ["meetups", searchTerm, page],
        headers: authHeader
    });

    console.log(meetupResponse)

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



    return (
        <div>
            <Toaster position="top-right" reverseOrder={false} />

            <div className="flex justify-between md:items-center flex-col md:flex-row">
                <DynamicHeader
                    mainHeader={"All Drivers"}
                    subHeaderName={`${meetups?.length} total users`}
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                SL
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Driver ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Number
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {meetups?.map((user, index) => (
                            <tr key={user._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {(page - 1) * limit + index + 1}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {user?.userID}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {user.fullName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {user.contactNo}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <select
                                        value={user.isActive || "ACTIVE"}
                                        onChange={(e) =>
                                            handleStatusChange(user._id, e.target.value)
                                        }
                                        className={`px-2 py-1 rounded border text-xs font-semibold uppercase outline-none bg-white ${user.isActive === "ACTIVE"
                                                ? "text-emerald-800 border-emerald-300"
                                                : user.isActive === "INACTIVE"
                                                    ? "text-gray-800 border-gray-300"
                                                    : "text-amber-800 border-amber-300"
                                            }`}
                                    >
                                        <option value="ACTIVE">Active</option>
                                        <option value="INACTIVE">Inactive</option>
                                        <option value="BLOCKED">Blocked</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                    <button
                                        onClick={() => handleDelete(user._id)}
                                        className="text-red-600 hover:text-red-900 p-1 transition-colors inline-flex items-center"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
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