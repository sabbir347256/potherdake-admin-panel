import { useContext } from "react";
import { AuthProvider } from "../../../../AuthProvider/CreateContext";
// import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import config from "../../../utilies/envCongig";
import toast, { Toaster } from "react-hot-toast";
import DynamicHeader from "../../../DynamicComponent/DynamicHeader";
import { Trash2 } from "lucide-react";

const FieldVerificationList = () => {
    const { token } = useContext(AuthProvider);
    // const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const apiConfig = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
    };

    const { data: records = [], isLoading, refetch } = useQuery({
        queryKey: ["fieldVerifyList"],
        queryFn: async () => {
            const response = await axios.get(`${config.backendUrl}/fieldverify/get-fieldVerify-specifiqList`, apiConfig);
            return response.data;
        },
    });

    console.log(records)

    // const onSubmit = async (data) => {
    //     try {
    //         await axios.post(`${config.backendUrl}/fieldverify/create-field-verify`, data, apiConfig);
    //         toast.success('Record submitted successfully!');
    //         refetch();
    //         reset();
    //     } catch (error) {
    //         toast.error('Failed to submit record');
    //         console.error(error);
    //     }
    // };


    const handleDelete = async (id) => {
        try {
            await axios.delete(`${config.backendUrl}/fieldverify/field-verify/${id}`, apiConfig);
            toast.success('Record deleted successfully!');
            refetch();
        } catch (error) {
            toast.error('Failed to delete record');
            console.error(error);
        }
    };

    return (
        <div>
            <div className="flex justify-between md:items-center flex-col md:flex-row">
                <Toaster position="top-right" reverseOrder={false} />

                <DynamicHeader
                    mainHeader={"Field Verification List"}
                // subHeaderName={`${tableData.length} total users`}
                />
            </div>
            <div className="space-y-8 p-4">
                {/* <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-4xl">
                    <h2 className="text-xl font-bold mb-4 text-gray-700">Field Verify Form</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">User ID</label>
                            <input
                                type="text"
                                {...register('userId', { required: 'User ID is required' })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                            />
                            {errors.userId && <p className="text-red-500 text-xs mt-1">{errors.userId.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Agent ID</label>
                            <input
                                type="text"
                                {...register('agentId', { required: 'Agent ID is required' })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                            />
                            {errors.agentId && <p className="text-red-500 text-xs mt-1">{errors.agentId.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Amount</label>
                            <input
                                type="number"
                                {...register('amount', { required: 'Amount is required', valueAsNumber: true })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                            />
                            {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                        >
                            Submit
                        </button>
                    </form>
                </div> */}

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                     {isLoading ? (
                        <p className="text-gray-500">Loading records...</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SL</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th> */}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {records?.data?.map((record, index) => (
                                        <tr key={record._id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.userId}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.agentId}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${record.amount}</td>
                                            {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <button
                                                    onClick={() => handleDelete(record._id)}
                                                    className="text-red-600 hover:text-red-900 p-1 transition-colors inline-flex items-center"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </td> */}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FieldVerificationList;