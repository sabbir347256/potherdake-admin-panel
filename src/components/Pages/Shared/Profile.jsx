import { Briefcase, Camera, CheckCircle2, Edit2, Globe, GraduationCap, Mail, MapPin, Phone, ShieldCheck, User, X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import config from "../utilies/envCongig";
import axios from "axios";
import { AuthProvider } from "../../AuthProvider/CreateContext";
import { useForm } from "react-hook-form";
import { useApiHeader } from "../utilies/token";
import divisionsData from "../../../data/bd-divisions.json";
import districtsData from "../../../data/bd-districts.json";
import upazilasData from "../../../data/bd-upazilas.json";

const Profile = () => {

    const { data: authContextData, token, refetch } = useContext(AuthProvider);
    const profileUser = authContextData?.data;

    console.log(profileUser)

    const [loading, setLoading] = useState(true);
    // const [isProfileLocked, setIsProfileLocked] = useState(true);
    const [editSections, setEditSections] = useState({
        header: false,
        personal: false,
        professional: false,
        contact: false,
        family: false,
        expectations: false
    });

    const [images, setImages] = useState({
        cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400"
    });

    // const [nidUploaded, setNidUploaded] = useState(false);

    const { register, handleSubmit, watch, reset, setValue } = useForm();




    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                if (profileUser) {
                    if (profileUser.coverImage) setImages(prev => ({ ...prev, cover: profileUser.coverImage }));
                    if (profileUser.profileImage) setImages(prev => ({ ...prev, avatar: profileUser.profileImage }));
                    // if (profileUser.nidStatus) setNidUploaded(profileUser.nidStatus === 'verified' || profileUser.nidStatus === 'pending');
                    // setIsProfileLocked(profileUser.isLocked !== undefined ? profileUser.isLocked : true);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching profile data:", error);

            }
        };

        fetchProfileData();
    }, [reset, profileUser]);

    // const [images, setImages] = useState({
    //     avatar: profileUser?.avatarPhoto || '',
    //     cover: profileUser?.coverPhoto || ''
    // });

    // useEffect(() => {
    //     if (profileUser) {
    //         setImages({
    //             avatar: profileUser.avatarPhoto || '',
    //             cover: profileUser.coverPhoto || ''
    //         });
    //     }
    // }, [profileUser]);

    const handleImageChange = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        const localUrl = URL.createObjectURL(file);
        setImages(prev => ({ ...prev, [type]: localUrl }));

        const toastId = toast.loading(`Uploading ${type === 'cover' ? 'cover' : 'avatar'} photo...`);

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.put(
                `${config?.backendUrl}/user/update-image/${type}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data?.success && response.data?.data) {
                const updatedUser = response.data.data;
                setImages({
                    avatar: updatedUser.avatarPhoto || '',
                    cover: updatedUser.coverPhoto || ''
                });
                toast.success(response.data.message || `${type === 'cover' ? 'Cover' : 'Avatar'} photo updated successfully!`, { id: toastId });
                refetch();
            }
        } catch (error) {
            console.error(`Error uploading ${type} image:`, error);
            const errorMessage = error.response?.data?.message || `Failed to upload ${type} image.`;
            toast.error(errorMessage, { id: toastId });
            setImages(prev => ({
                ...prev,
                [type]: type === 'cover' ? profileUser?.coverPhoto : profileUser?.avatarPhoto
            }));
        }
    };

    // const handleNidUpload = async (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         setNidUploaded(true);
    //         const formData = new FormData();
    //         formData.append('nidDocument', file);

    //         try {
    //             await axios.post(`${config?.backendUrl}/user/upload-nid`, formData, {
    //                 headers: { 'Content-Type': 'multipart/form-data' }
    //             });
    //         } catch (error) {
    //             console.error("Error uploading NID:", error);
    //             setNidUploaded(false);
    //         }
    //     }
    // };



    const [divisions, setDivisions] = useState([]);
    const [currentDistricts, setCurrentDistricts] = useState([]);
    const [currentUpazilas, setCurrentUpazilas] = useState([]);
    const [permanentDistricts, setPermanentDistricts] = useState([]);
    const [permanentUpazilas, setPermanentUpazilas] = useState([]);

    const watchedCurrentDivision = watch("currentDivision");
    const watchedCurrentDistrict = watch("currentDistrict");
    const watchedPermanentDivision = watch("permanentDivision");
    const watchedPermanentDistrict = watch("permanentDistrict");


    useEffect(() => {
        setDivisions(divisionsData);
    }, []);

    useEffect(() => {
        if (!watchedCurrentDivision) {
            setCurrentDistricts([]);
            return;
        }

        const filteredDistricts = districtsData.filter(
            district =>
                String(district.division_id) ===
                String(watchedCurrentDivision)
        );

        setCurrentDistricts(filteredDistricts);
    }, [watchedCurrentDivision]);

    useEffect(() => {
        if (!watchedCurrentDistrict) {
            setCurrentUpazilas([]);
            return;
        }

        const filteredUpazilas = upazilasData.filter(
            upazila =>
                String(upazila.district_id) ===
                String(watchedCurrentDistrict)
        );

        setCurrentUpazilas(filteredUpazilas);
    }, [watchedCurrentDistrict]);

    useEffect(() => {
        if (!watchedPermanentDivision) {
            setPermanentDistricts([]);
            return;
        }

        const filteredDistricts = districtsData.filter(
            district =>
                String(district.division_id) ===
                String(watchedPermanentDivision)
        );

        setPermanentDistricts(filteredDistricts);
    }, [watchedPermanentDivision]);

    useEffect(() => {
        if (!watchedPermanentDistrict) {
            setPermanentUpazilas([]);
            return;
        }

        const filteredUpazilas = upazilasData.filter(
            upazila =>
                String(upazila.district_id) ===
                String(watchedPermanentDistrict)
        );

        setPermanentUpazilas(filteredUpazilas);
    }, [watchedPermanentDistrict]);

    const apiHeader = useApiHeader();


    const onFormSubmit = async (formData, sectionName) => {
        const toastId = toast.loading(`Updating ${sectionName}...`);

        let updatedFormData = { ...formData };

        if (updatedFormData?.currentCountry === "Bangladesh") {
            const currentDivObj = divisions.find(d => String(d.id) === String(updatedFormData?.currentDivision) || String(d._id) === String(updatedFormData?.currentDivision));
            const currentDistObj = currentDistricts.find(d => String(d.id) === String(updatedFormData?.currentDistrict) || String(d._id) === String(updatedFormData?.currentDistrict));
            if (currentDivObj) updatedFormData.currentDivision = currentDivObj.name;
            if (currentDistObj) updatedFormData.currentDistrict = currentDistObj.name;
        }

        if (updatedFormData?.permanentCountry === "Bangladesh") {
            const permDivObj = divisions.find(d => String(d.id) === String(updatedFormData?.permanentDivision) || String(d._id) === String(updatedFormData?.permanentDivision));
            const permDistObj = permanentDistricts.find(d => String(d.id) === String(updatedFormData?.permanentDistrict) || String(d._id) === String(updatedFormData?.permanentDistrict));
            if (permDivObj) updatedFormData.permanentDivision = permDivObj.name;
            if (permDistObj) updatedFormData.permanentDistrict = permDistObj.name;
        }

        try {
            const response = await axios.put(`${config?.backendUrl}/user/update`, updatedFormData, apiHeader);

            if (response.data?.success) {
                toast.success(response.data?.message || `${sectionName} updated successfully!`, {
                    id: toastId,
                });
                refetch();
                setEditSections(prev => ({ ...prev, [sectionName]: false }));
            }
        } catch (error) {
            console.error(`Error updating data for section ${sectionName}:`, error);
            const errorMessage = error.response?.data?.message || `Failed to update ${sectionName}.`;
            toast.error(errorMessage, {
                id: toastId,
            });
        }
    };



    useEffect(() => {
        if (profileUser) {

            const currentDivisionObj = divisionsData.find(
                div => div.name === profileUser.currentDivision
            );

            const currentDistrictObj = districtsData.find(
                dist => dist.name === profileUser.currentDistrict
            );

            const permanentDivisionObj = divisionsData.find(
                div => div.name === profileUser.permanentDivision
            );

            const permanentDistrictObj = districtsData.find(
                dist => dist.name === profileUser.permanentDistrict
            );

            reset({
                ...profileUser,

                currentDivision: currentDivisionObj?.id || "",
                currentDistrict: currentDistrictObj?.id || "",

                permanentDivision: permanentDivisionObj?.id || "",
                permanentDistrict: permanentDistrictObj?.id || "",
            });
        }
    }, [profileUser, reset]);

    useEffect(() => {
        if (profileUser?.currentThana) {
            setValue("currentThana", profileUser.currentThana);
        }

        if (profileUser?.permanentThana) {
            setValue("permanentThana", profileUser.permanentThana);
        }
    }, [currentUpazilas, permanentUpazilas, profileUser, setValue]);


    const formatProfileForForm = (userData) => {
        const currentDivisionObj = divisionsData.find(
            div => div.name === userData.currentDivision
        );

        const currentDistrictObj = districtsData.find(
            dist => dist.name === userData.currentDistrict
        );

        const permanentDivisionObj = divisionsData.find(
            div => div.name === userData.permanentDivision
        );

        const permanentDistrictObj = districtsData.find(
            dist => dist.name === userData.permanentDistrict
        );

        return {
            ...userData,

            currentDivision: currentDivisionObj?.id || "",
            currentDistrict: currentDistrictObj?.id || "",

            permanentDivision: permanentDivisionObj?.id || "",
            permanentDistrict: permanentDistrictObj?.id || "",
        };
    };

    const toggleSection = async (section, state) => {
        if (section === 'contact') {
            window.location.reload();
        }
        console.log(section)
        if (!state) {
            try {
                const response = await axios.get(`${config?.backendUrl}/user/profile`);
                reset(formatProfileForForm(response.data));
            } catch (error) {
                if (profileUser) reset(profileUser);
                console.error("Error reverting changes:", error);
            }
        }
        setEditSections(prev => ({ ...prev, [section]: state }));
    };

    const handleContactEdit = () => {
        reset(formatProfileForForm(profileUser));

        setEditSections(prev => ({
            ...prev,
            contact: true
        }));
    };



    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <span className="loading loading-spinner loading-lg text-emerald-600"></span>
            </div>
        );
    }



    return (
        <div className="app-container pb-8 min-h-screen px-4">
            <Toaster position="top-right" reverseOrder={false} />

            <div className="flex items-end space-x-4 bg-slate-500 w-full rounded-xl p-2  md:p-6 mt-4" >
                <div className="relative group">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white overflow-hidden bg-gray-200 relative shadow-md">
                        {images.avatar && <img src={images.avatar} className="w-full h-full object-cover" alt="Avatar" />}
                        <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition cursor-pointer">
                            <Camera className="w-5 h-5 mb-1" />
                            <span className="text-[10px] font-medium">Change Photo</span>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, 'avatar')} />
                        </label>
                    </div>
                    {profileUser?.nidStatus === 'verified' && (
                        <div className="absolute bottom-2 right-2 bg-emerald-600 border-2 border-white text-white p-1.5 rounded-full">
                            <ShieldCheck className="w-4 h-4" />
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    {editSections.header ? (
                        <form onSubmit={handleSubmit((data) => onFormSubmit(data, 'header'))} className="bg-black/70 p-3 rounded-xl space-y-2 backdrop-blur-sm min-w-[250px]">
                            <input {...register('fullName')} className="w-full p-1.5 text-sm bg-white text-gray-800 rounded border" placeholder="Name" />
                            {/* <input {...register('homeDistrict')} className="w-full p-1.5 text-sm bg-white text-gray-800 rounded border" placeholder="District" /> */}
                            <div className="flex gap-2">
                                <button type="submit" className="bg-emerald-600 text-white px-2 py-1 text-xs rounded font-medium flex-1">Save</button>
                                <button type="button" onClick={() => toggleSection('header', false)} className="bg-gray-500 text-white px-2 py-1 text-xs rounded font-medium flex-1">Cancel</button>
                            </div>
                        </form>
                    ) : (
                        <div className="flex items-start gap-2 group">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-md">{profileUser?.fullName || 'No Name Set'}</h1>
                                <div className="flex flex-wrap gap-3 mt-1 text-black text-sm drop-shadow-sm">
                                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {profileUser?.currentThana || 'Not Set'}, Bangladesh</span>
                                    <span className="flex items-center gap-1"><User className="w-4 h-4" /> ID: {profileUser?.profileId || profileUser?.userID || 'N/A'}</span>
                                    <span className="flex items-center gap-1"><User className="w-4 h-4" />Referral ID: {profileUser?.ownRefarelID || 'N/A'}</span>
                                </div>
                            </div>
                            <button type="button" onClick={() => toggleSection('header', true)} className="mt-1 p-1.5 bg-white/80 hover:bg-white text-gray-700 rounded-full shadow opacity-0 group-hover:opacity-100 transition">
                                <Edit2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 pt-6 bg-slate-50/50 rounded-3xl">
                <div className="xl:col-span-3 space-y-8">

                    <div className="bg-white p-7 rounded-2xl border border-gray-200/80 shadow-sm relative group transition-all duration-300 hover:border-gray-300">
                        <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                                    <User className="w-5 h-5" />
                                </div>
                                <h2 className="text-lg font-bold text-gray-800 tracking-tight">Personal Details</h2>
                            </div>
                            {!editSections.personal && (
                                <button
                                    type="button"
                                    onClick={() => toggleSection('personal', true)}
                                    className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg transition-all duration-200 flex items-center gap-1 border border-gray-200"
                                >
                                    <Edit2 className="w-3.5 h-3.5" /> Edit
                                </button>
                            )}
                        </div>

                        {editSections.personal ? (
                            <form onSubmit={handleSubmit((data) => onFormSubmit(data, 'personal'))} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Date of Birth</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="YYYY-MM-DD"
                                            maxLength={10}
                                            {...register("birth", {
                                                required: "Date of birth is required",
                                                validate: value => /^\d{4}-\d{2}-\d{2}$/.test(value) || "Please enter a valid date (YYYY-MM-DD)"
                                            })}
                                            onChange={(e) => {
                                                let val = e.target.value.replace(/\D/g, "");
                                                let formatted = "";
                                                if (val.length > 0) {
                                                    formatted = val.substring(0, 4);
                                                    if (val.length > 4) formatted += "-" + val.substring(4, 6);
                                                    if (val.length > 6) formatted += "-" + val.substring(6, 8);
                                                }
                                                e.target.value = formatted;
                                                const { onChange } = register("birth");
                                                onChange(e);
                                            }}
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all text-sm font-medium text-gray-700 bg-gray-50/30"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Height</label>
                                        <input {...register('Height')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none text-sm bg-gray-50/30 text-gray-700" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Home District</label>
                                        <input {...register('currentDistrict')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none text-sm bg-gray-50/30 text-gray-700" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Marital Status</label>
                                        <select
                                            {...register('maritalStatus')}
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none text-sm bg-gray-50/30 text-gray-700 cursor-pointer"
                                        >
                                            <option value="">Select Status</option>
                                            <option value="Unmarried">Unmarried</option>
                                            <option value="Married">Married</option>
                                            <option value="Divorced">Divorced</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Religion</label>
                                        <input {...register('religion')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none text-sm bg-gray-50/30 text-gray-700" />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                                    <button type="button" onClick={() => toggleSection('personal', false)} className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition">Cancel</button>
                                    <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition shadow-sm shadow-indigo-100">Save Changes</button>
                                </div>
                            </form>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                                <div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Age</span>
                                    <p className="text-gray-800 font-semibold text-sm mt-1">{profileUser?.age || '—'}</p>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Height</span>
                                    <p className="text-gray-800 font-semibold text-sm mt-1">{profileUser?.Height || '—'}</p>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Home District</span>
                                    <p className="text-gray-800 font-semibold text-sm mt-1">{profileUser?.currentDistrict || '—'}</p>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Marital Status</span>
                                    <p className="text-gray-800 font-semibold text-sm mt-1">{profileUser?.maritalStatus || '—'}</p>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Religion</span>
                                    <p className="text-gray-800 font-semibold text-sm mt-1">{profileUser?.religion || '—'}</p>
                                </div>
                            </div>
                        )}
                    </div>


                    <div className="bg-white p-7 rounded-2xl border border-gray-200/80 shadow-sm relative group transition-all duration-300 hover:border-gray-300">
                        <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                                    <Briefcase className="w-5 h-5" />
                                </div>
                                <h2 className="text-lg font-bold text-gray-800 tracking-tight">Career & Education</h2>
                            </div>
                            {!editSections.professional && (
                                <button
                                    type="button"
                                    onClick={() => toggleSection('professional', true)}
                                    className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg transition-all duration-200 flex items-center gap-1 border border-gray-200"
                                >
                                    <Edit2 className="w-3.5 h-3.5" /> Edit
                                </button>
                            )}
                        </div>

                        {editSections.professional ? (
                            <form onSubmit={handleSubmit((data) => onFormSubmit(data, 'professional'))} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gray-50/40 p-4 rounded-xl border border-gray-100 space-y-3">
                                        <label className="block text-xs font-bold text-blue-600 uppercase tracking-wide">Work Status</label>
                                        <input {...register('profession')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white" placeholder="Profession Title" />
                                        <input {...register('professionOrganization')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white" placeholder="Company / Organization Name" />
                                    </div>
                                    <div className="bg-gray-50/40 p-4 rounded-xl border border-gray-100 space-y-3">
                                        <label className="block text-xs font-bold text-blue-600 uppercase tracking-wide">Academic Qualification</label>
                                        <input {...register('education')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white" placeholder="Degree / Course" />
                                        <input {...register('institute')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white" placeholder="University / Institute" />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                                    <button type="button" onClick={() => toggleSection('professional', false)} className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition">Cancel</button>
                                    <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition shadow-sm shadow-blue-100">Save Changes</button>
                                </div>
                            </form>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="p-3 bg-white text-gray-700 rounded-xl shadow-sm border border-gray-100"><Briefcase className="w-5 h-5 text-gray-500" /></div>
                                    <div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase block mb-0.5">Current Profession</span>
                                        <p className="text-gray-800 font-bold text-sm">{profileUser?.profession || 'Not Set'}</p>
                                        <p className="text-gray-500 text-xs mt-0.5">{profileUser?.professionOrganization || 'No Organization Info'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="p-3 bg-white text-gray-700 rounded-xl shadow-sm border border-gray-100"><GraduationCap className="w-5 h-5 text-gray-500" /></div>
                                    <div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase block mb-0.5">Education</span>
                                        <p className="text-gray-800 font-bold text-sm">{profileUser?.education || 'Not Set'}</p>
                                        <p className="text-gray-500 text-xs mt-0.5">{profileUser?.institute || 'No Institution Info'}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>


                    <div className="bg-white p-7 rounded-2xl border border-gray-200/80 shadow-sm relative group transition-all duration-300 hover:border-gray-300">
                        <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <h2 className="text-lg font-bold text-gray-800 tracking-tight">Contact & Location</h2>
                            </div>
                            {!editSections.contact && (
                                <button
                                    type="button"
                                    onClick={handleContactEdit}
                                    className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg transition-all duration-200 flex items-center gap-1 border border-gray-200"
                                >
                                    <Edit2 className="w-3.5 h-3.5" /> Edit
                                </button>
                            )}
                        </div>

                        {!editSections.contact && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 bg-emerald-50/30 rounded-xl border border-emerald-100/50 flex items-center gap-3.5">
                                        <div className="p-2 bg-white rounded-lg text-emerald-600 shadow-sm"><Phone className="w-4 h-4" /></div>
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Phone Number</span>
                                            <p className="text-gray-700 text-sm font-semibold mt-0.5">{profileUser?.contactNo || '—'}</p>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-emerald-50/30 rounded-xl border border-emerald-100/50 flex items-center gap-3.5">
                                        <div className="p-2 bg-white rounded-lg text-emerald-600 shadow-sm"><Mail className="w-4 h-4" /></div>
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Email Address</span>
                                            <p className="text-gray-700 text-sm font-semibold mt-0.5 break-all">{profileUser?.email || '—'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                                    <div className="space-y-1.5">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gray-400" /> Current Address</span>
                                        <p className="text-gray-700 text-sm font-medium pl-5 bg-gray-50 py-2.5 px-3 rounded-xl border border-gray-100">
                                            {
                                                (() => {
                                                    const addressParts = [profileUser?.currentThana, profileUser?.currentDistrict, profileUser?.currentDivision, profileUser?.currentCountry].filter(Boolean);
                                                    return addressParts.length > 0 ? addressParts.join(", ") : "No current address listed.";
                                                })()
                                            }
                                        </p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-gray-400" /> Permanent Address</span>
                                        <p className="text-gray-700 text-sm font-medium pl-5 bg-gray-50 py-2.5 px-3 rounded-xl border border-gray-100">
                                            {
                                                (() => {
                                                    const addressParts = [profileUser?.permanentThana, profileUser?.permanentDistrict, profileUser?.permanentDivision, profileUser?.permanentCountry].filter(Boolean);
                                                    return addressParts.length > 0 ? addressParts.join(", ") : "No permanent address listed.";
                                                })()
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {editSections.contact && (
                            <form onSubmit={handleSubmit((data) => onFormSubmit(data, 'contact'))} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Contact No</label>
                                        <input {...register('contactNo')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/30" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email</label>
                                        <input {...register('email')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/30" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 pt-5">
                                    <div className="space-y-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                                        <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">Current Address Info</h3>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1">Division</label>
                                            <select {...register('currentDivision')} className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white">
                                                <option value="">Select Division</option>
                                                {divisions.map((div) => <option key={div._id || div.id} value={div.id || div._id}>{div.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1">District</label>
                                            <select disabled={!watchedCurrentDivision} {...register('currentDistrict')} className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white disabled:opacity-50">
                                                <option value="">Select District</option>
                                                {currentDistricts.map((dist) => <option key={dist._id || dist.id} value={dist.id || dist._id}>{dist.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1">Thana / Upazila</label>
                                            <select disabled={!watchedCurrentDistrict} {...register('currentThana')} className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white disabled:opacity-50">
                                                <option value="">Select Thana</option>
                                                {currentUpazilas.map((upz) => <option key={upz._id || upz.id} value={upz.name}>{upz.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1">Country</label>
                                            <select {...register('currentCountry')} className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white">
                                                <option value="Bangladesh">Bangladesh</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                                        <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">Permanent Address Info</h3>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1">Division</label>
                                            <select {...register('permanentDivision')} className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white">
                                                <option value="">Select Division</option>
                                                {divisions.map((div) => <option key={div._id || div.id} value={div.id || div._id}>{div.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1">District</label>
                                            <select disabled={!watchedPermanentDivision} {...register('permanentDistrict')} className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white disabled:opacity-50">
                                                <option value="">Select District</option>
                                                {permanentDistricts.map((dist) => <option key={dist._id || dist.id} value={dist.id || dist._id}>{dist.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1">Thana / Upazila</label>
                                            <select disabled={!watchedPermanentDistrict} {...register('permanentThana')} className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white disabled:opacity-50">
                                                <option value="">Select Thana</option>
                                                {permanentUpazilas.map((upz) => <option key={upz._id || upz.id} value={upz.name}>{upz.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1">Country</label>
                                            <select {...register('permanentCountry')} className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white">
                                                <option value="Bangladesh">Bangladesh</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                                    <button type="button" onClick={() => toggleSection('contact', false)} className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition">Cancel</button>
                                    <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition shadow-sm shadow-emerald-100">Save Changes</button>
                                </div>
                            </form>
                        )}
                    </div>


                    {/* <div className="bg-white p-7 rounded-2xl border border-gray-200/80 shadow-sm relative group transition-all duration-300 hover:border-gray-300">
                        <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                                    <Home className="w-5 h-5" />
                                </div>
                                <h2 className="text-lg font-bold text-gray-800 tracking-tight">Family Details</h2>
                            </div>
                            {!editSections.family && (
                                <button
                                    type="button"
                                    onClick={() => toggleSection('family', true)}
                                    className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg transition-all duration-200 flex items-center gap-1 border border-gray-200"
                                >
                                    <Edit2 className="w-3.5 h-3.5" /> Edit
                                </button>
                            )}
                        </div>

                        {editSections.family ? (
                            <form onSubmit={handleSubmit((data) => onFormSubmit(data, 'family'))} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Father's Occupation</label>
                                        <input {...register('fatherOccupation')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/30 text-gray-700" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Mother's Occupation</label>
                                        <input {...register('motherOccupation')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/30 text-gray-700" />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                                    <button type="button" onClick={() => toggleSection('family', false)} className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition">Cancel</button>
                                    <button type="submit" className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold transition shadow-sm shadow-amber-100">Save Changes</button>
                                </div>
                            </form>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 bg-amber-50/20 border border-amber-100/70 rounded-xl">
                                    <span className="text-[10px] font-bold text-amber-700/70 uppercase tracking-wider block">Father's Profession</span>
                                    <p className="text-gray-800 font-bold text-sm mt-1">{profileUser?.fatherOccupation || '—'}</p>
                                </div>
                                <div className="p-4 bg-amber-50/20 border border-amber-100/70 rounded-xl">
                                    <span className="text-[10px] font-bold text-amber-700/70 uppercase tracking-wider block">Mother's Profession</span>
                                    <p className="text-gray-800 font-bold text-sm mt-1">{profileUser?.motherOccupation || '—'}</p>
                                </div>
                            </div>
                        )}
                    </div> */}
                </div>

                <div className="xl:col-span-1 space-y-6">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl text-white">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-700 pb-2">Verification Desk</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                                <span className="text-xs font-medium text-slate-300">Profile Activation</span>
                                {profileUser?.isActive === 'ACTIVE' ? (
                                    <div className="flex items-center gap-1.5 text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20 font-bold">
                                        <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-500/10" /> ACTIVE
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5 text-xs bg-rose-500/10 text-rose-400 px-2.5 py-1 rounded-full border border-rose-500/20 font-bold">
                                        <X className="w-3.5 h-3.5" /> INACTIVE
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;