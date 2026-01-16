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
        <div className="w-full h-screen flex items-center justify-center">
            <div className="text-sm">
                <Toaster position="top-right" reverseOrder={false} />
            </div>
            <div className="w-[320px] bg-white border border-slate-200 rounded-lg px-8 py-10">
                <div className="mb-8 leading-tight">
                    <p className="text-xl font-semibold">Welcome back</p>
                    <p className="text-sm text-slate-400">Login to continue</p>
                </div>
                <form className="flex flex-col items-center justify-center gap-4 text-sm w-full" onSubmit={login}>
                    <div className="relative w-full">
                        <input type="text" placeholder="Enter the Email Id" onChange={(e) => setIdentifier(e.target.value)} className="border border-slate-400 rounded-lg px-8 py-2 w-full" required />
                        <div className="absolute top-2 left-2 w-5 text-lg">
                            <FaEnvelope />
                        </div>
                    </div>
                    <div className="relative w-full">
                        <input type={show ? "text" : "password"} placeholder="Enter the Password" onChange={(e) => setPassword(e.target.value)} className="border border-slate-400 rounded-lg px-8 py-2 w-full" required />
                        <div className="absolute top-2 left-2 w-5 text-lg">
                            <FaLock />
                        </div>
                        <button type="button" onClick={() => setShow(!show)} className="absolute top-2 right-2">Show</button>
                    </div>
                    <button type="submit" disabled={loading} className="bg-black text-white px-4 py-2 rounded-lg w-full">
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                <div className="text-sm mt-8"><p>Don't have an account? <Link to="/auth/signup" className="font-semibold underline">Register</Link></p></div>
            </div>
        </div>
    );
}
