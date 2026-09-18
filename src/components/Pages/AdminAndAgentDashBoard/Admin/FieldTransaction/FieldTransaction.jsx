import { ChevronLeft, ChevronRight, Loader2, Trash2 } from "lucide-react";
import SearchInput from "../../../utilies/SearchInput";
import DynamicHeader from "../../../DynamicComponent/DynamicHeader";
import toast from "react-hot-toast";
import axios from "axios";
import config from "../../../utilies/envCongig";
import { AuthProvider } from "../../../../AuthProvider/CreateContext";
import { useContext, useState } from "react";
import { useApiHeader } from "../../../utilies/token";
import { useCustomQuery } from "../../../utilies/useCustomQuery";

const FieldTransaction = () => {
    const { token } = useContext(AuthProvider);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const limit = 20;
    const apiHeader = useApiHeader();

    const { data: transactionData, isLoading, refetch } = useCustomQuery({
        queryKey: ["nidTransactions", page, searchTerm],
        url: `${config.backendUrl}/fieldTransaction/get-all-field-Transaction?page=${page}&limit=${limit}&searchTerm=${searchTerm}`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const tableData = transactionData?.data || [];
    const meta = transactionData?.meta || { page: 1, limit: 8, total: 0, totalPage: 1 };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(
                `${config.backendUrl}/nidtransaction/delete/${id}`, apiHeader);
            if (response.data?.success) {
                toast.success("Transaction deleted successfully");
                refetch();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete transaction");
        }
    };

    const [updatingUserId, setUpdatingUserId] = useState(null);

    const handleStatusChange = async (userId, newStatus) => {
        if (!userId) {
            toast.error("User ID not found for this transaction");
            return;
        }

        setUpdatingUserId(userId);
        try {
            const response = await axios.patch(
                `${config.backendUrl}/fieldTransaction/update-verification/${userId}`,
                { status: newStatus },
                apiHeader
            );

            if (response.data?.success) {
                toast.success(`User verification updated to ${newStatus}`);
                refetch();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update status");
        } finally {
            setUpdatingUserId(null);
        }
    };


    return (
        <div>
            <DynamicHeader mainHeader={"Approved Field Transactions"} />
            <div className="p-6 bg-white rounded-lg shadow-sm">
                <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <SearchInput
                        onSearch={(value) => {
                            setSearchTerm(value);
                            setPage(1);
                        }}
                        placeholder="Search by User ID, Transaction ID or Phone..."
                    />
                </div>

                {isLoading ? (
                    <div className="h-64 w-full flex items-center justify-center">
                        <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SL</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Status</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {tableData.length === 0 ? (
                                    <tr>
                                        <td colSpan={10} className="px-6 py-10 text-center text-sm text-gray-500">
                                            No approved transactions matching current parameters.
                                        </td>
                                    </tr>
                                ) : (
                                    tableData.map((item, index) => {
                                        const currentUserId = item?.userObjectId?._id;
                                        const userCurrentStatus = item?.userObjectId?.isFieldVerification ? "APPROVE" : "PENDING";

                                        return (
                                            <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {(page - 1) * limit + index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {item?.userObjectId?.userID || "N/A"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {item?.userObjectId?.fullName || "N/A"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {item?.gatewayTransactionId || "N/A"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {item?.userObjectId?.email || "N/A"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {item?.phoneNumber || "N/A"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    ৳ {item?.amount || "N/A"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide text-emerald-800 border border-emerald-300 bg-emerald-50">
                                                        {item?.status || "APPROVED"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <select
                                                            disabled={updatingUserId === currentUserId}
                                                            value={userCurrentStatus}
                                                            onChange={(e) => handleStatusChange(currentUserId, e.target.value)}
                                                            className={`text-xs font-semibold rounded-md border p-1.5 focus:outline-none cursor-pointer transition-colors ${userCurrentStatus === "APPROVE"
                                                                ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                                                                : "bg-amber-50 border-amber-300 text-amber-800"
                                                                }`}
                                                        >
                                                            <option value="PENDING">PENDING</option>
                                                            <option value="APPROVE">APPROVE</option>
                                                        </select>
                                                        {updatingUserId === currentUserId && (
                                                            <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                    <button
                                                        onClick={() => handleDelete(item._id)}
                                                        className="text-red-600 hover:text-red-900 p-1 transition-colors inline-flex items-center"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>

                        {meta.totalPage > 1 && (
                            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
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

export default FieldTransaction;