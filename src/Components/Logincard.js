import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from 'react-hot-toast';
import { FaEnvelope, FaLock } from "react-icons/fa";

export default function LoginCard() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const navigate = useNavigate();

    const login = async (event) => {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('id', identifier);
        formData.append('pass', password);
        console.log(formData)

        try {
            const response = await fetch('http://127.0.0.1:8000/login', {
                method: 'POST',
                body: formData,
            });
            console.log(formData);
            const result = await response.text(); // Assuming the response is text

            if (result === "success") {
                toast.success("Login successful!");
                setTimeout(() => {
                    navigate("/");
                }, 2000);
            } else {
                toast.error("Login failed!");
            }
        } catch (error) {
            toast.error("An error occurred!");
            console.error("Login error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center relative p-6">
            <div className="text-sm">
                <Toaster position="top-right" reverseOrder={false} />
            </div>

            <div className="relative z-10 w-[460px] glass border border-white/10 rounded-[2.5rem] px-12 py-16 shadow-4xl animate-fadeInUp relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                {/* Logo/Brand */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 mb-6 relative z-10">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white transform hover:rotate-12 transition-transform duration-300 shadow-lg glow">
                            C
                        </div>
                        <span className="text-3xl font-black text-white tracking-tight">Career GAIde</span>
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-4xl font-black text-white mb-3">Welcome Back.</h2>
                        <p className="text-white/40 font-medium">Continue your professional evolution.</p>
                    </div>
                </div>

                <form className="flex flex-col gap-6 w-full relative z-10" onSubmit={login}>
                    <div className="relative group/input">
                        <div className="absolute top-1/2 -translate-y-1/2 left-5 text-white/30 text-xl group-focus-within/input:text-purple-400 transition-colors">
                            <FaEnvelope />
                        </div>
                        <input
                            type="text"
                            placeholder="Neural Identifier (Email)"
                            onChange={(e) => setIdentifier(e.target.value)}
                            className="bg-white/5 border border-white/10 focus:border-purple-500/50 rounded-2xl px-14 py-4.5 w-full transition-all duration-300 outline-none text-white font-medium placeholder:text-white/20 hover:bg-white/10"
                            required
                        />
                    </div>

                    <div className="relative group/input">
                        <div className="absolute top-1/2 -translate-y-1/2 left-5 text-white/30 text-xl group-focus-within/input:text-purple-400 transition-colors">
                            <FaLock />
                        </div>
                        <input
                            type={show ? "text" : "password"}
                            placeholder="Access Key"
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-white/5 border border-white/10 focus:border-purple-500/50 rounded-2xl px-14 py-4.5 w-full transition-all duration-300 outline-none text-white font-medium placeholder:text-white/20 hover:bg-white/10"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShow(!show)}
                            className="absolute top-1/2 -translate-y-1/2 right-5 text-sm text-white/30 hover:text-white transition-colors font-bold uppercase tracking-widest"
                        >
                            {show ? 'Hide' : 'Show'}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-5 rounded-2xl font-black text-lg mt-4 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transform hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-3">
                                <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                                Authenticating...
                            </span>
                        ) : "Initiate Protocol"}
                    </button>
                </form>

                <div className="text-center mt-10 relative z-10">
                    <p className="text-white/40 font-medium">
                        New to the interface? <Link to="/auth/signup" className="font-black text-purple-400 hover:text-pink-400 transition-colors ml-1">Establish Link</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
