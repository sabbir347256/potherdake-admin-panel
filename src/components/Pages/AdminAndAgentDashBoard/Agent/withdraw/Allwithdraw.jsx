import { useContext, useState } from "react";
import config from "../../../utilies/envCongig";
import { useCustomQuery } from "../../../utilies/useCustomQuery";
import { AuthProvider } from "../../../../AuthProvider/CreateContext";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import SearchInput from "../../../utilies/SearchInput";
import DynamicHeader from "../../../DynamicComponent/DynamicHeader";

const Allwithdraw = () => {
    const { token } = useContext(AuthProvider);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const limit = 8;

    const { data: withdrawList, isLoading, refetch } = useCustomQuery({
        queryKey: ["withdrawlist", page, searchTerm],
        url: `${config.backendUrl}/withdraw/get-withdrawals?page=${page}&limit=${limit}&searchTerm=${searchTerm}`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });


    const tableData = withdrawList?.data || [];
    const meta = withdrawList?.meta || { page: 1, limit: 8, total: 0, totalPage: 1 };
    console.log(tableData)

    // const handleStatusChange = async (id, newStatus) => {
    //     console.log(`Update status for ${id} to ${newStatus}`);
    // };

    // const handleDelete = async (id) => {
    //     console.log(`Delete item ${id}`);
    // };

    refetch();

    return (
        <div>
            <DynamicHeader
                mainHeader={"Withdrawal Management"}
            // subHeaderName={`${tableData.length} total users`}
            />
            <div className="p-6 ">
                <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <SearchInput
                        onSearch={(value) => {
                            setSearchTerm(value);
                            setPage(1);
                        }}
                        placeholder="Search by User ID, Email or Name..."
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Withdraw</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    {/* <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> */}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {tableData.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-500">
                                            No entries matching current parameters.
                                        </td>
                                    </tr>
                                ) : (
                                    tableData.map((user, index) => (
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
                                                {user?.userId?.contactNo || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                ৳ {user?.amount || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide text-emerald-800 border border-emerald-300 bg-emerald-50">
                                                    {user?.status || "APPROVED"}
                                                </span>
                                            </td>
                                            {/* <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <select
                                                    value={user?.userId?.isActive || "ACTIVE"}
                                                    onChange={(e) => handleStatusChange(user._id, e.target.value)}
                                                    className={`px-2 py-1 rounded border text-xs font-semibold uppercase outline-none bg-white cursor-pointer ${user?.userId?.isActive === "ACTIVE"
                                                            ? "text-emerald-800 border-emerald-300 bg-emerald-50"
                                                            : user?.userId?.isActive === "INACTIVE"
                                                                ? "text-gray-800 border-gray-300 bg-gray-50"
                                                                : "text-amber-800 border-amber-300 bg-amber-50"
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
                                            </td> */}
                                        </tr>
                                    ))
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

export default Allwithdraw;