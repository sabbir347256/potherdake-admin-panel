import { ExternalLink, Eye, Trash2, X } from "lucide-react";
import config from "../../../utilies/envCongig";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useContext, useState } from "react";
import { useCustomQuery } from "../../../utilies/useCustomQuery";
import { AuthProvider } from "../../../../AuthProvider/CreateContext";
import DynamicHeader from "../../../DynamicComponent/DynamicHeader";
import { useApiHeader } from "../../../utilies/token";

const NidDocument = () => {
    const { token } = useContext(AuthProvider);
    // const [submissions, setSubmissions] = useState([]);
    // const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
     const apiHeader = useApiHeader();


    const { data: datasubmissions, isLoading, refetch } = useCustomQuery({
        queryKey: ["users"],
        url: `${config.backendUrl}/verification/nid-submissions`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const submissions = datasubmissions?.data;

    console.log(submissions)

    // const fetchSubmissions = async () => {
    //     try {
    //         const token = localStorage.getItem("token");
    //         const res = await axios.get(`${config?.backendUrl}/user/admin/nid-submissions`, {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });
    //         if (res.data?.success) {
    //             setSubmissions(res.data.data);
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         toast.error("Failed to load submissions");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // useEffect(() => {
    //     fetchSubmissions();
    // }, []);

    const handleUpdateStatus = async (id, status) => {
        const toastId = toast.loading(`Updating status to ${status}...`);
        try {
            const res = await axios.patch(
                `${config?.backendUrl}/verification/nid-status/${id}`,
                { status },
                apiHeader
            );
            if (res.data?.success) {
                toast.success(res.data.message, { id: toastId });
                refetch();
            }
        } catch (error) {
            console.error(error);
            toast.error("Status update failed", { id: toastId });
        }
    };

    const handleDeleteSubmission = async (id) => {
        if (!window.confirm("Are you sure you want to delete this submission?")) return;
        const toastId = toast.loading("Deleting submission...");
        try {
            const res = await axios.delete(`${config?.backendUrl}/verification/nid-delete/${id}`, apiHeader);
            if (res.data?.success) {
                toast.success(res.data.message, { id: toastId });
                refetch();
            }
        } catch (error) {
            console.error(error);
            toast.error("Deletion failed", { id: toastId });
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-slate-500">Loading submissions...</div>;
    }
    return (
        <div>
            <Toaster position="top-right" reverseOrder={false} />

            <div className="flex justify-between md:items-center flex-col md:flex-row">
                <DynamicHeader
                    mainHeader={"NID Identity Verification Panel"}
                    subHeaderName={`Review, manage, approve or reject user NID submissions`}
                />
            </div>
            <div className="bg-[#fffbfb] min-h-screen mt-4 overflow-x-auto w-full px-6">


                <table className="min-w-full divide-y divide-gray-200 border">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SL</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NID Documents</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {submissions.map((user, index) => (
                            <tr key={user._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.userId?.userID || "N/A"}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.userId?.fullName || "N/A"}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.userId?.email || "N/A"}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.userId?.contactNo || "N/A"}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <div className="flex gap-2">
                                        {user.nidImages?.map((img, idx) => (
                                            <div key={idx} className="relative group w-16 h-10 border border-gray-300 rounded overflow-hidden bg-gray-50 aspect-video cursor-pointer" onClick={() => setSelectedImage(img)}>
                                                <img src={img} alt="NID" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                                                    <Eye className="w-3 h-3 text-white" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <select
                                        value={user.status || "pending"}
                                        onChange={(e) => handleUpdateStatus(user._id, e.target.value)}
                                        className={`px-2 py-1 rounded border text-xs font-semibold uppercase outline-none bg-white ${user.status === "verified"
                                            ? "text-emerald-800 border-emerald-300"
                                            : user.status === "rejected"
                                                ? "text-rose-800 border-rose-300"
                                                : "text-amber-800 border-amber-300"
                                            }`}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="verified">Verified</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                    <button
                                        onClick={() => handleDeleteSubmission(user._id)}
                                        className="text-red-600 hover:text-red-900 p-1 transition-colors inline-flex items-center"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {submissions.length === 0 && (
                            <tr>
                                <td colSpan="8" className="px-6 py-8 text-center text-gray-500">No NID records found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {selectedImage && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <div className="relative max-w-4xl w-full bg-white rounded-2xl p-2 border border-gray-200 shadow-2xl overflow-hidden">
                            <div className="flex justify-between items-center p-3 text-sm font-medium border-b border-gray-100">
                                <span className="text-gray-700">NID Document Large View</span>
                                <div className="flex items-center gap-3">
                                    <a href={selectedImage} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-emerald-600 flex items-center gap-1">
                                        <ExternalLink className="w-4 h-4" /> Original URL
                                    </a>
                                    <button onClick={() => setSelectedImage(null)} className="p-1 bg-gray-100 text-gray-500 hover:text-gray-900 rounded-lg transition">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="w-full flex items-center justify-center bg-gray-50 p-2 max-h-[80vh] overflow-y-auto">
                                <img src={selectedImage} alt="NID Large Scale" className="max-w-full h-auto rounded-xl object-contain shadow-md" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NidDocument;