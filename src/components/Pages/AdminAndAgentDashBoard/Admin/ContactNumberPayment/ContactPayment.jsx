import { Trash2 } from "lucide-react";
import SearchInput from "../../../utilies/SearchInput";
import config from "../../../utilies/envCongig";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthProvider } from "../../../../AuthProvider/CreateContext";

const ContactPayment = () => {
    const {token} = useContext(AuthProvider);
    const [transactions, setTransactions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [meta, setMeta] = useState({ totalPage: 1 });
    const [loading, setLoading] = useState(false);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${config.backendUrl}/phoneunlock/get-all-transactions?page=${page}&limit=${limit}&searchTerm=${searchTerm}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (response.data.success) {
                setTransactions(response.data.data);
                setMeta(response.data.meta);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [page, searchTerm]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this transaction?")) return;
        try {
            const response = await axios.delete(
                `${config.backendUrl}/phoneunlock/delete-transaction/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                fetchTransactions();
            }
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div className="p-6  rounded-2xl border border-gray-100 shadow-sm">
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <SearchInput
                    onSearch={(value) => {
                        setSearchTerm(value);
                        setPage(1);
                    }}
                    placeholder="Search by Transaction ID or Phone..."
                />
            </div>

            <div className="relative overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buyer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone Number</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 text-sm">
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="text-center py-4">Loading...</td>
                            </tr>
                        ) : transactions.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-4">No Transactions Found</td>
                            </tr>
                        ) : (
                            transactions.map((tx) => (
                                <tr key={tx._id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{tx.transactionId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{tx.buyerUserObjectId?.fullName || "N/A"}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{tx.targetUserObjectId?.fullName || "N/A"}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{tx.phoneNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{tx.amount} TK</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${tx.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : tx.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <button
                                            onClick={() => handleDelete(tx._id)}
                                            className="text-red-600 hover:text-red-900 transition"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                <button
                    disabled={page === 1}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-sm text-gray-700">
                    Page {page} of {meta.totalPage}
                </span>
                <button
                    disabled={page === meta.totalPage}
                    onClick={() => setPage((prev) => Math.min(prev + 1, meta.totalPage))}
                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ContactPayment;