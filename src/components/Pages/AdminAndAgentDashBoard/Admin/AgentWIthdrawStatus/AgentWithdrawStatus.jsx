import {  ChevronLeft, ChevronRight, Loader2, Trash2 } from "lucide-react";
import { useContext, useState } from "react";
import { AuthProvider } from "../../../../AuthProvider/CreateContext";
import { useCustomQuery } from "../../../utilies/useCustomQuery";
import config from "../../../utilies/envCongig";
import DynamicHeader from "../../../DynamicComponent/DynamicHeader";
import SearchInput from "../../../utilies/SearchInput";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const AgentWithdrawStatus = () => {
    const { token } = useContext(AuthProvider);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const limit = 20;

    const { data: withdrawList, isLoading, refetch } = useCustomQuery({
        queryKey: ["withdrawlist", page, searchTerm, fromDate, toDate],
        url: `${config.backendUrl}/withdraw/get-withdrawals?page=${page}&limit=${limit}&searchTerm=${searchTerm}&fromDate=${fromDate}&toDate=${toDate}`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const tableData = withdrawList?.data || [];
    const meta = withdrawList?.meta || { page: 1, limit: 20, total: 0, totalPage: 1 };

    const pageTotalAmount = tableData.reduce((acc, curr) => acc + (Number(curr?.amount) || 0), 0);

    const handleStatusChange = async (transactionId, newStatus) => {
        try {
            await axios.patch(
                `${config.backendUrl}/withdraw/status/${transactionId}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            refetch();
            toast.success(`Transaction marked as ${newStatus}`);
        } catch (error) {
            console.error(error);
            toast.error("You have already Approved this transaction");
        }
    };

    const handleDelete = async (id) => {
        console.log(`Delete item ${id}`);
    };

    return (
        <div>
            <Toaster position="top-right" reverseOrder={false} />

            <DynamicHeader mainHeader={"Withdrawal Management"} />

            <div className="p-6">
                <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                        <SearchInput
                            onSearch={(value) => {
                                setSearchTerm(value);
                                setPage(1);
                            }}
                            placeholder="Search by User ID, Email or Name..."
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-lg border border-gray-300 shadow-sm">
                        <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-md bg-gray-50">
                            <span className="text-xs font-medium text-gray-500">From:</span>
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => {
                                    setFromDate(e.target.value);
                                    setPage(1);
                                }}
                                className="text-sm outline-none bg-transparent cursor-pointer text-gray-700"
                            />
                        </div>

                        <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-md bg-gray-50">
                            <span className="text-xs font-medium text-gray-500">To:</span>
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => {
                                    setToDate(e.target.value);
                                    setPage(1);
                                }}
                                className="text-sm outline-none bg-transparent cursor-pointer text-gray-700"
                            />
                        </div>

                        {(fromDate || toDate) && (
                            <button
                                onClick={() => {
                                    setFromDate("");
                                    setToDate("");
                                    setPage(1);
                                }}
                                className="text-xs font-semibold text-rose-600 hover:text-rose-800 px-2.5 py-1.5 border border-rose-200 rounded-md bg-rose-50 hover:bg-rose-100 transition"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {isLoading ? (
                    <div className="h-64 w-full flex items-center justify-center">
                        <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SL</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Withdraw</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {tableData.map((user, index) => (
                                        <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {(page - 1) * limit + index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {user?.userId?.userID || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {user?.userId?.fullName || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {user?.userId?.email || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {user?.number || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                ৳ {user?.amount || 0}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {user?.method || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <select
                                                    value={user?.status || "PENDING"}
                                                    onChange={(e) => handleStatusChange(user._id, e.target.value)}
                                                    className={`px-2 py-1 rounded border text-xs font-semibold uppercase outline-none bg-white cursor-pointer ${user?.status === "APPROVED"
                                                        ? "text-emerald-800 border-emerald-300 bg-emerald-50"
                                                        : "text-rose-800 border-rose-300 bg-rose-50"
                                                        }`}
                                                >
                                                    <option value="PENDING">PENDING</option>
                                                    <option value="APPROVED">APPROVED</option>
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
                                    {tableData.length === 0 && (
                                        <tr>
                                            <td colSpan={9} className="text-center py-8 text-gray-500 text-sm">
                                                No withdrawal records found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-end">
                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 w-full sm:w-72 text-right">
                                <span className="text-xs uppercase tracking-wider text-emerald-700 block font-semibold mb-1">
                                    Page Total Amount
                                </span>
                                <span className="text-2xl font-bold text-emerald-900">
                                    ৳ {pageTotalAmount.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {meta.totalPage > 1 && (
                            <div className="bg-white px-4 py-3 flex items-center justify-between border border-gray-200 rounded-lg sm:px-6">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    <button
                                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={page === 1}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setPage((prev) => Math.min(prev + 1, meta.totalPage))}
                                        disabled={page === meta.totalPage}
                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{" "}
                                            <span className="font-medium">
                                                {Math.min(page * limit, meta.total)}
                                            </span>{" "}
                                            of <span className="font-medium">{meta.total}</span> results
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-1" aria-label="Pagination">
                                            <button
                                                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                                disabled={page === 1}
                                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                            >
                                                <ChevronLeft className="h-5 w-5" />
                                            </button>

                                            {[...Array(meta.totalPage)].map((_, i) => (
                                                <button
                                                    key={i + 1}
                                                    onClick={() => setPage(i + 1)}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === i + 1
                                                        ? "z-10 bg-emerald-50 border-emerald-500 text-emerald-600"
                                                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    {i + 1}
                                                </button>
                                            ))}

                                            <button
                                                onClick={() => setPage((prev) => Math.min(prev + 1, meta.totalPage))}
                                                disabled={page === meta.totalPage}
                                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                            >
                                                <ChevronRight className="h-5 w-5" />
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgentWithdrawStatus;