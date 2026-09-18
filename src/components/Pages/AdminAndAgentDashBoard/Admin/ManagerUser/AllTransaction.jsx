import { Trash2 } from "lucide-react";
import DynamicHeader from "../../../DynamicComponent/DynamicHeader";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import config from "../../../utilies/envCongig";

const AllTransaction = () => {
    const token = localStorage.getItem("accessToken");

    const { data: transactionResponse, isLoading, refetch } = useQuery({
        queryKey: ["transactions"],
        queryFn: async () => {
            const response = await axios.get(`${config.backendUrl}/transaction`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        },
    });
    console.log(transactionResponse);

    // const handleStatusChange = async (transactionId, newStatus) => {
    //     try {
    //         await axios.patch(
    //             `${config.backendUrl}/transaction/status/${transactionId}`,
    //             { status: newStatus },
    //             { headers: { Authorization: `Bearer ${token}` } }
    //         );
    //         refetch();
    //         toast.success(`Transaction marked as ${newStatus}`);
    //     } catch (error) {
    //         console.error(error);
    //         toast.error("Failed to update transaction status");
    //     }
    // };

    const handleDelete = async (transactionId) => {
        if (window.confirm("Are you sure you want to delete this transaction?")) {
            try {
                await axios.delete(`${config.backendUrl}/transaction/${transactionId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                refetch();
                toast.success("Transaction deleted successfully!");
            } catch (error) {
                console.error(error);
                toast.error("Failed to delete transaction");
            }
        }
    };

    const tableData = transactionResponse?.data || [];
    const filterTableData = tableData?.filter(data => data?.isDeleted === false);


    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
        );
    }
    return (
        <div>
            <Toaster position="top-right" reverseOrder={false} />

            <div className="flex justify-between md:items-center flex-col md:flex-row">
                <DynamicHeader
                    mainHeader={"All Transactions"}
                    subHeaderName={`${tableData.length} total transactions`}
                />
            </div>
            <div className="bg-[#fffbfb] min-h-screen mt-4 overflow-x-auto w-full px-6">
                <table className="min-w-full divide-y divide-gray-200 border">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SL</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filterTableData?.map((transaction, index) => (
                            <tr key={transaction._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {index + 1}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {transaction.userId}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {transaction?.userObjectId?.role}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {transaction.phoneNumber}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                                    {transaction.gatewayTransactionId}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                                    {transaction.amount}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide text-emerald-800 border border-emerald-300 bg-emerald-50">
                                        {transaction?.status || "APPROVED"}
                                    </span>
                                </td>
                                {/* <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <select
                                        value={transaction.status || "PENDING"}
                                        onChange={(e) => handleStatusChange(transaction._id, e.target.value)}
                                        className={`px-2 py-1 rounded border text-xs font-semibold uppercase outline-none bg-white ${transaction.status === "APPROVED"
                                            ? "text-emerald-800 border-emerald-300"
                                            : transaction.status === "REJECTED"
                                                ? "text-rose-800 border-rose-300"
                                                : "text-amber-800 border-amber-300"
                                            }`}
                                    >
                                        <option value="PENDING">Pending</option>
                                        <option value="APPROVED">Approved</option>
                                        <option value="REJECTED">Rejected</option>
                                    </select>
                                </td> */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <button
                                        onClick={() => handleDelete(transaction._id)}
                                        className="text-red-600 hover:text-red-900 p-1 transition-colors inline-flex items-center"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllTransaction;