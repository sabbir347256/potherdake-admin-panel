import { Trash2 } from "lucide-react";
import DynamicHeader from "../../../DynamicComponent/DynamicHeader";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import config from "../../../utilies/envCongig";

const AllTransaction = () => {
    const token = localStorage.getItem("accessToken");

    const { data: transactionResponse, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["transactions"],
        queryFn: async () => {
            const response = await axios.get(`${config.backendUrl}/tripBookedRoute/commissions`, {
                headers: { 
                    Authorization: token ? `Bearer ${token}` : "" 
                },
            });
            return response.data;
        },
    });

    console.log(transactionResponse)

    const handleDelete = async (transactionId) => {
        if (window.confirm("Are you sure you want to delete this transaction?")) {
            try {
                await axios.delete(`${config.backendUrl}/tripBookedRoute/commissions/${transactionId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                refetch();
                toast.success("Transaction deleted successfully!");
            } catch (err) {
                console.error(err);
                toast.error("Failed to delete transaction");
            }
        }
    };

    const tableData = transactionResponse?.data || [];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6 text-center text-red-600">
                Failed to load transactions: {error?.response?.data?.message || error.message}
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tableData?.map((transaction, index) => (
                            <tr key={transaction._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {index + 1}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {transaction.driverId?.fullName || "N/A"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {transaction.driverId?.role || "DRIVER"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {transaction.driverId?.contactNo || "N/A"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                                    {transaction.bookingId?._id || transaction.bookingId || "N/A"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                                    ৳{transaction.amount}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide text-purple-800 border border-purple-300 bg-purple-50">
                                        Commission
                                    </span>
                                </td>
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