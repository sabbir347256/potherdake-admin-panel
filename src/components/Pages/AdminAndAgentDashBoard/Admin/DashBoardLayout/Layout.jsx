import SidebarItem from "../../../Shared/SidebarItem";
import logo from '../../../../../assets/images/mainLogo.jpg';
import {
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Users2,
  User,
  ChevronDown,
  DollarSign,
  VerifiedIcon,
  DockIcon,
  User2Icon,
  Gem,
  LucideRefrigerator,
} from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import { AuthProvider } from "../../../../AuthProvider/CreateContext";
import config from "../../../utilies/envCongig";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useApiHeader } from "../../../utilies/token";
const Layout = () => {
  const { user, data } = useContext(AuthProvider);
  const [isOpen, setIsOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  // const [isRechargeOpen, setIsRechargeOpen] = useState(false);

  const walletRef = useRef(null);
  const mobileWalletRef = useRef(null);
  const menuButtonRef = useRef(null);
  const mobileMenuRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedInsideButton = menuButtonRef.current && menuButtonRef.current.contains(event.target);
      const clickedInsideMenu = mobileMenuRef.current && mobileMenuRef.current.contains(event.target);
      if (!clickedInsideButton && !clickedInsideMenu) {
        setIsOpen(false);
      }

      const clickedInsideDesktopWallet = walletRef.current && walletRef.current.contains(event.target);
      const clickedInsideMobileWallet = mobileWalletRef.current && mobileWalletRef.current.contains(event.target);
      if (!clickedInsideDesktopWallet && !clickedInsideMobileWallet) {
        setIsWalletOpen(false);
      }

    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    ...(user?.role === "ADMIN" ? [
      {
        section: "OVERVIEW",
        items: [
          { path: "/", label: "Dashboard", icon: LayoutDashboard },
        ],
      }
    ] : []),
    {
      section: (user?.role === "ADMIN" ? "USER MANAGE" : "AGENT PANEL"),
      items: [
        ...(user?.role === "AGENT" ? [
          {
            path: "/all-withdraw",
            label: "Withdraw List",
            icon: DollarSign,
          }
        ] : []),
        ...(user?.role === "AGENT" ? [
          {
            path: "/all-field-verification",
            label: "Field Verification List",
            icon: User2Icon,
          }
        ] : []),
        ...(user?.role === "ADMIN" ? [
          {
            path: "/all-passenger",
            label: "All Passenger",
            icon: Users2,
          }
        ] : []),
        ...(user?.role === "ADMIN" ? [
          {
            path: "/all-drivers",
            label: "All Drivers",
            icon: Users2,
          }
        ] : []),
        ...(user?.role === "ADMIN" ? [
          { path: "/all-transaction", label: "All Comission", icon: DollarSign }
        ] : []),
        // ...(user?.role === "ADMIN" ? [
        //   { path: "/contact-payment", label: "Contact Transaction", icon: DollarSign }
        // ] : []),
        ...(user?.role === "ADMIN" ? [
          { path: "/all-document", label: "All Nid Documents", icon: DockIcon }
        ] : []),
        // ...(user?.role === "ADMIN" ? [
        //   { path: "/all-refer", label: "User Refer", icon: LucideRefrigerator }
        // ] : []),
      ],
    },
    // ...(user?.role === "ADMIN" ? [
    //   {
    //     section: "Transaction Section",
    //     items: [
    //       {
    //         path: "/all-document-transaction",
    //         label: "Document Verification",
    //         icon: DollarSign,
    //       },
    //       {
    //         path: "/field-transaction",
    //         label: "Field Verification",
    //         icon: DollarSign,
    //       },
    //       {
    //         path: "/agent-withdraw-transaction",
    //         label: "Agent Withdraw Transaction",
    //         icon: DollarSign,
    //       },
    //       {
    //         path: "/premium-transaction",
    //         label: "Premium Member",
    //         icon: Gem,
    //       },
    //     ],
    //   }
    // ] : []),
    // ...(user?.role === "ADMIN" ? [
    //   {
    //     section: "Agent Function",
    //     items: [
    //       {
    //         path: "/agent-registration",
    //         label: "Agent Registration",
    //         icon: LayoutDashboard,
    //       },
    //       {
    //         path: "/field-verification",
    //         label: "Add Field Verification",
    //         icon: VerifiedIcon,
    //       },
    //     ],
    //   }
    // ] : []),
    // {
    //   section: "AI PART",
    //   items: [
    //     {
    //       path: "/manual-AI-Package",
    //       label: "Add AI Package",
    //       icon: Package,
    //     },
    //     { path: "/manual-ai-model", label: "Add AI Agent", icon: LucideMoveDiagonal2 },
    //   ],
    // },
    // {
    //   section: "CATALOG",
    //   items: [
    //     {
    //       path: "/experiences",
    //       label: "Experiences",
    //       icon: TestTubeDiagonal,
    //       badge: "12",
    //     },
    //     { path: "/reviews", label: "Reviews", icon: Stars },
    //   ],
    // },
    // {
    //   section: "USERS",
    //   items: [
    //     {
    //       path: "/all-users",
    //       label: "All-Users",
    //       icon: Users2,
    //       badge: "12",
    //     },
    //     { path: "/admin-team", label: "Admin-Team", icon: UserLock },
    //   ],
    // },
    // {
    //   section: "SYSTEM",
    //   items: [
    //     {
    //       path: "/promo-codes",
    //       label: "Promo Codes",
    //       icon: Tags,
    //     },
    //     { path: "/settings", label: "Settings", icon: Settings2 },
    //   ],
    // },
  ];

  const [porfileopen, setporfileopen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setporfileopen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);


  // const onSubmit = async (data) => {
  //   const token = localStorage.getItem("accessToken");
  //   try {
  //     await axios.post(
  //       `${config?.backendUrl}/transaction`,
  //       {
  //         userObjectId: user?.userId,
  //         userId: user?.userProfileId,
  //         transactionId: data.transactionId,
  //         phoneNumber: data.phoneNumber,
  //         amount: data.amount,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     toast.success("Recharge request submitted successfully!");
  //     reset();
  //     setIsRechargeOpen(false);
  //   } catch (error) {
  //     toast.error(error?.response?.data?.message || "Failed to submit request");
  //   }
  // };


  // const [loadingPayment, setLoadingPayment] = useState(false);

  // const onRechargeSubmit = async (formData) => {
  //   setLoadingPayment(true);
  //   const token = localStorage.getItem("accessToken");

  //   try {
  //     const paymentPayload = {
  //       userObjectId: user?.userId,
  //       userId: user?.userProfileId,
  //       amount: formData.amount,
  //       name: user?.name,
  //       email: user?.email,
  //       phone: user?.phone,
  //       originUrl: window.location.origin
  //     };

  //     const response = await axios.post(
  //       `${config?.backendUrl}/transaction/initiate-paystation`,
  //       paymentPayload,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (response.data.success && response.data.payment_url) {
  //       toast.success("Redirecting to PayStation...");
  //       window.location.assign(response.data.payment_url);
  //     } else {
  //       toast.error("Could not initiate payment");
  //     }
  //   } catch (error) {
  //     toast.error(error?.response?.data?.message || "Payment initialization failed");
  //   } finally {
  //     setLoadingPayment(false);
  //     setIsRechargeOpen(false);
  //     reset();
  //   }
  // };



  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem("accessToken");

    toast.success("Logged out successfully!");

    setTimeout(() => {
      navigate('/admin-login');
    }, 1500);
  };

  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);


  const totalamount = data?.data?.totalAmount || 0;


  const { register, handleSubmit, reset, formState: { errors } } = useForm();



  const apiHeader = useApiHeader();

  const onSubmit = async (formData) => {
    try {
      const response = await axios.post(`${config.backendUrl}/withdraw/amountWithdraw`, formData, apiHeader);
      const result = response.data;

      if (result.success) {
        setIsWithdrawOpen(false);
        reset();
      } else {
        alert(result.message);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data.message || 'Something went wrong');
      } else {
        console.error(error);
      }
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-[#fdfafb]">
      <Toaster position="top-right" reverseOrder={false} />
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="py-2 px-3 flex items-center justify-between flex-shrink-0">
          <h1 className="text-xl font-bold text-red-600 tracking-tight">
            <img src={logo} className="size-12 rounded-lg" alt="" />
            {/* Pura <span className="text-rose-500">VidaX</span> */}
          </h1>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-gray-500 hover:text-red-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto space-y-6">
          {menuItems.map((group, idx) => (
            <div key={idx}>
              <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-2 px-4">
                {group.section}
              </p>
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                  >
                    {({ isActive }) => (
                      <SidebarItem
                        icon={item.icon}
                        label={item.label}
                        badge={item.badge}
                        active={isActive}
                      />
                    )}
                  </NavLink>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 flex-shrink-0">
          <button onClick={handleLogOut} className="flex items-center gap-3 text-red-600 hover:bg-red-50 w-full px-4 py-2.5 rounded-lg transition-colors text-sm font-medium">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 shrink-0 relative">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 text-gray-600 lg:hidden hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"
          >
            <Menu size={24} />
          </button>

          <div
            className="flex items-center gap-4 md:justify-end w-full"
            ref={dropdownRef}
          >
            {/* <div className="flex items-center gap-3 pr-4 border-r border-red-100">
              <button className="relative p-1 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
                <Bell size={20} fill="currentColor" className="text-gray-700 hover:text-red-600" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 border-2 border-white rounded-full"></span>
              </button>

              <button className="p-1 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
                <Settings
                  size={20}
                  fill="currentColor"
                  className="text-gray-700 hover:text-red-600"
                />
              </button>
            </div> */}

            <div className="relative" ref={walletRef}>
              {
                user?.role !== 'ADMIN' && <button
                  onClick={() => setIsWalletOpen(!isWalletOpen)}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-xl transition-all duration-200 active:scale-95 shadow-md shadow-amber-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <div className="text-left leading-tight">
                    <span className="block text-[9px] uppercase tracking-wider opacity-90">Wallet</span>
                    <span className="text-xs font-bold">৳ {totalamount}</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 transition-transform duration-200 ${isWalletOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              }

              {user && isWalletOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-4 px-4 z-50">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Balance Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
                      <span className="text-sm text-gray-600">Total Balance</span>
                      <span className="font-semibold text-gray-900">৳ {totalamount}</span>
                    </div>
                    {/* <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
                      <span className="text-sm text-gray-600">Bonus Balance</span>
                      <span className="font-semibold text-emerald-600">৳ {bonusAmount}</span>
                    </div> */}
                    {/* <div className="flex justify-between items-center py-1.5">
                      <span className="text-sm text-gray-600">Referral Earn</span>
                      <span className="font-semibold text-indigo-600">৳ {referralAmount}</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-sm text-gray-600">Total Amount</span>
                      <span className="font-semibold text-indigo-600">৳ {totalamount}</span>
                    </div> */}
                  </div>
                  {/* <button
                    onClick={() => setIsRechargeOpen(true)}
                    className="bg-red-600 text-white hover:bg-red-800 duration-100 p-2 rounded-xl w-full mt-2"
                  >
                    Recharge
                  </button> */}
                  <button
                    onClick={() => setIsWithdrawOpen(true)}
                    className="bg-red-600 text-white hover:bg-red-800 duration-100 p-2 rounded-xl w-full mt-2 text-sm font-medium"
                  >
                    Withdraw
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setporfileopen(!porfileopen);
                }}
                className="flex items-center gap-3 cursor-pointer group select-none"
              >
                <div className="relative w-10 h-10">
                  <img
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100&auto=format&fit=crop"
                    alt="Admin User"
                    className="w-full h-full rounded-full object-cover border-2 border-red-100 group-hover:border-red-400 transition-colors"
                  />
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900 leading-tight group-hover:text-red-600 transition-colors">
                    {user?.role === 'ADMIN' ? 'Admin User' : 'AGENT'}
                  </span>
                  <span className="text-xs text-gray-400">{user?.role === 'ADMIN' ? 'Super Admin' : 'Agent Panel'}</span>
                </div>

                <ChevronDown
                  size={16}
                  className={`text-gray-400 group-hover:text-red-600 transition-transform duration-200 ${porfileopen ? "rotate-180" : ""}`}
                />
              </div>

              {porfileopen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-red-100 rounded-xl shadow-lg py-2 z-50">
                  <NavLink to='/profile' className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors">
                    <User size={16} className="text-gray-500" />
                    My Profile
                  </NavLink>
                  {/* <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors">
                    <Settings size={16} className="text-gray-500" />
                    Account Settings
                  </button> */}
                  <div className="h-px bg-gray-100 my-1 mx-2"></div>
                  <button onClick={handleLogOut} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>


        {/* {isRechargeOpen && (
          <div className="modal modal-open fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300">
            <div className="modal-box bg-white max-w-sm w-full rounded-2xl p-6 relative border border-gray-100 shadow-2xl transform transition-all scale-100 animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => setIsRechargeOpen(false)}
                className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                ✕
              </button>

              <div className="flex flex-col items-center mb-6">
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600 mb-3 border border-red-100/50">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6A2.25 2.25 0 0 1 18.75 20H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
                  </svg>
                </div>
                <h3 className="font-extrabold text-xl text-gray-800 text-center">Recharge Wallet</h3>
                <p className="text-xs text-gray-400 text-center mt-1">Add funds securely to your account</p>
              </div>

              <form onSubmit={handleSubmit(onRechargeSubmit)} className="space-y-5">
                <div className="form-control w-full">
                  <label className="label py-1">
                    <span className="label-text font-semibold text-gray-600 text-xs uppercase tracking-wider">Enter Amount (BDT)</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-gray-400 font-bold text-lg select-none">৳</span>
                    <input
                      type="number"
                      placeholder="e.g. 500"
                      className={`input w-full pl-9 pr-4 py-6 bg-gray-50/80 text-gray-900 font-bold text-lg rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:bg-white transition-all duration-200 ${errors.amount ? 'border-red-500 bg-red-50/10 focus:border-red-500' : ''}`}
                      {...register("amount", {
                        required: "Amount is required",
                        // min: { value: 10, message: "Minimum recharge amount is ৳10" }
                      })}
                    />
                  </div>
                  {errors.amount && (
                    <div className="flex items-center gap-1 mt-1.5 text-red-500">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                        <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs font-medium">{errors.amount.message}</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loadingPayment}
                  className={`group flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-500 text-white hover:from-red-700 hover:to-rose-600 active:scale-[0.98] transition-all duration-200 py-3.5 px-4 rounded-xl w-full font-bold text-sm shadow-md shadow-red-100 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none`}
                >
                  {loadingPayment ? (
                    <div className="flex items-center gap-2">
                      <span className="loading loading-spinner loading-sm"></span>
                      <span>Processing Payment...</span>
                    </div>
                  ) : (
                    <>
                      <span>Proceed to Payment</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 transition-transform group-hover:translate-x-0.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )} */}

        {isWithdrawOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Withdraw Request</h3>
                <button onClick={() => { setIsWithdrawOpen(false); reset(); }} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Wallet Balance</label>
                  <div className="w-full border border-gray-300 rounded-xl p-2.5 bg-gray-50 font-medium text-gray-900">
                    Total Balance (৳{totalamount})
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <select
                    {...register('method')}
                    className="w-full border border-gray-300 rounded-xl p-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Bkash">Bkash</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Rocket">Rocket</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                  <input
                    type="text"
                    placeholder="01XXXXXXXXX"
                    {...register('number', {
                      required: 'Number is required',
                      pattern: { value: /^(?:\+88|88)?(01[3-9]\d{8})$/, message: 'Invalid Bangladeshi number' }
                    })}
                    className="w-full border border-gray-300 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    {...register('amount', {
                      required: 'Amount is required',
                      min: { value: 500, message: 'Minimum withdraw amount is 500' },
                      validate: {
                        multipleOf500: value => parseFloat(value) % 500 === 0 || 'Amount must be a multiple of 500',
                        insufficient: value => {
                          const entered = parseFloat(value);
                          const charge = entered * 0.03;
                          return (totalamount - (entered + charge)) >= 500 || 'Must keep 500 Tk maintained balance';
                        }
                      }
                    })}
                    className="w-full border border-gray-300 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-xl transition duration-150"
                >
                  Submit Withdrawal
                </button>
              </form>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto bg-[#fffbfb]">
          <div>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
