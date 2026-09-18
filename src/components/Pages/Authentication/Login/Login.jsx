import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import toast, { Toaster } from 'react-hot-toast';
import Button from '../../utilies/Button';
import config from '../../utilies/envCongig';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [apiError, setApiError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setApiError('');
        setIsLoading(true);
        try {
            const response = await fetch(`${config.backendUrl}/auth/agent&admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                }),
            });

            const result = await response.json();
            console.log(result)

            if (response.ok && result?.data?.accessToken) {
                localStorage.setItem('accessToken', result.data.accessToken);
                toast.success(`${result.message}`);
                setTimeout(() => {
                    navigate('/');
                    window.location.reload();
                }, 1000);
            } else {
                setApiError(result?.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Login API Error:', error);
            setApiError('Something went wrong. Please check your connection.');
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="flex min-h-screen items-center justify-center bg-red-50/40 px-4 py-12 text-gray-800">
            <Toaster position="top-right" reverseOrder={false} />

            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-red-100">
                <div className="mb-6 text-center">
                    <h2 className="text-4xl font-black text-red-600 tracking-tight">Bibah</h2>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">Premium Matchmaking</p>
                </div>

                {apiError && (
                    <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100">
                        {apiError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">Email Address</label>
                        <input
                            type="text"
                            {...register("email", {
                                required: "Email is required"
                            })}
                            placeholder="Enter your email"
                            className={`w-full rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-200'} px-4 py-3 text-sm outline-none transition bg-gray-50/50 focus:border-red-600 focus:bg-white focus:ring-1 focus:ring-red-600`}
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs font-medium text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <div className="flex justify-between mb-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Password</label>
                            {/* <a href="#" className="text-xs font-bold text-red-600 hover:underline">Forgot?</a> */}
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 6, message: "Password must be at least 6 characters" }
                                })}
                                placeholder="Enter your password"
                                className={`w-full rounded-xl border ${errors.password ? 'border-red-500' : 'border-gray-200'} px-4 py-3 text-sm outline-none transition bg-gray-50/50 focus:border-red-600 focus:bg-white focus:ring-1 focus:ring-red-600`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-xs font-medium text-red-500">{errors.password.message}</p>
                        )}
                    </div>

                    <div className="pt-2">
                        <Button text={isLoading ? 'Signing in...' : 'Sign in'} type={'submit'} disabled={isLoading}></Button>
                    </div>
                </form>

                {/* <p className="mt-6 text-center text-sm text-gray-500">
                    Don't have an account? <a href="/create-account" className="font-bold text-red-600 hover:underline">Join Now</a>
                </p> */}
            </div>
        </div>
    );
};

export default Login;