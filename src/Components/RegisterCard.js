import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from 'react-hot-toast';
import { FaEye, FaEyeSlash, FaEnvelope, FaUserGear, FaLock } from "react-icons/fa6";
import { supabase } from "../supabaseClient";

export default function RegisterCard() {
    const [show, setShow] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        username: username,
                    }
                }
            });

            if (error) {
                toast.error(error.message);
                console.error("Registration error:", error);
            } else {
                toast.success("Registration successful! Please check your email to verify your account.");
                setTimeout(() => {
                    navigate("/auth/signin");
                }, 2000);
            }
        } catch (error) {
            toast.error("An error occurred!");
            console.error("Registration error:", error);
        } finally {
            setLoading(false);
        }
    };

    function handleIcons() {
        setShow(!show);
    }
    return (
        <div className="w-full min-h-screen flex items-center justify-center relative p-4 sm:p-6">
            <div className="text-sm">
                <Toaster position="top-right" reverseOrder={false} />
            </div>

            <div className="relative z-10 w-full max-w-[460px] glass border border-white/10 rounded-3xl sm:rounded-[2.5rem] px-6 sm:px-12 py-10 sm:py-16 shadow-4xl animate-fadeInUp overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                {/* Logo/Brand */}
                <div className="text-center mb-8 sm:mb-12 relative z-10">
                    <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center text-white transform hover:rotate-12 transition-transform duration-300 shadow-lg glow text-lg sm:text-xl">
                            C
                        </div>
                        <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">Career GAIde</span>
                    </div>
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-black text-white mb-2 sm:mb-3">Join the Future.</h2>
                        <p className="text-white/40 font-medium text-sm sm:text-base">Initialize your professional trajectory.</p>
                    </div>
                </div>

                <form className="flex flex-col gap-4 sm:gap-6 w-full relative z-10" onSubmit={handleRegister}>
                    <div className="relative group/input">
                        <div className="absolute top-1/2 -translate-y-1/2 left-4 sm:left-5 text-white/30 text-lg sm:text-xl group-focus-within/input:text-purple-400 transition-colors">
                            <FaUserGear />
                        </div>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="bg-white/5 border border-white/10 focus:border-purple-500/50 rounded-xl sm:rounded-2xl px-12 sm:px-14 py-3.5 sm:py-4.5 w-full transition-all duration-300 outline-none text-white font-medium placeholder:text-white/20 hover:bg-white/10 text-sm sm:text-base"
                            required
                        />
                    </div>

                    <div className="relative group/input">
                        <div className="absolute top-1/2 -translate-y-1/2 left-4 sm:left-5 text-white/30 text-lg sm:text-xl group-focus-within/input:text-purple-400 transition-colors">
                            <FaEnvelope />
                        </div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-white/5 border border-white/10 focus:border-purple-500/50 rounded-xl sm:rounded-2xl px-12 sm:px-14 py-3.5 sm:py-4.5 w-full transition-all duration-300 outline-none text-white font-medium placeholder:text-white/20 hover:bg-white/10 text-sm sm:text-base"
                            required
                        />
                    </div>

                    <div className="relative group/input">
                        <div className="absolute top-1/2 -translate-y-1/2 left-4 sm:left-5 text-white/30 text-lg sm:text-xl group-focus-within/input:text-purple-400 transition-colors">
                            <FaLock />
                        </div>
                        <input
                            type={show ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-white/5 border border-white/10 focus:border-purple-500/50 rounded-xl sm:rounded-2xl px-12 sm:px-14 py-3.5 sm:py-4.5 w-full transition-all duration-300 outline-none text-white font-medium placeholder:text-white/20 hover:bg-white/10 text-sm sm:text-base"
                            required
                            minLength={6}
                        />
                        <div className="absolute top-1/2 -translate-y-1/2 right-4 sm:right-5 text-purple-400/50 text-lg sm:text-xl cursor-pointer hover:text-white transition-all" onClick={handleIcons}>
                            {show ? (<FaEye />) : (<FaEyeSlash />)}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 sm:px-8 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg mt-2 sm:mt-4 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transform hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-3">
                                <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 sm:border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                                Creating Account...
                            </span>
                        ) : "Create Account"}
                    </button>
                </form>

                <div className="text-center mt-8 sm:mt-10 relative z-10">
                    <p className="text-white/40 font-medium text-sm sm:text-base">
                        Already have an account? <Link to="/auth/signin" className="font-black text-purple-400 hover:text-pink-400 transition-colors ml-1">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

