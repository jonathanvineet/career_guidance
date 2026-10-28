import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';
import { supabase } from "../supabaseClient";
import AuthShell from "./AuthShell";

export default function LoginCard() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const navigate = useNavigate();

    const login = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                toast.error(error.message);
                console.error("Login error:", error);
            } else {
                toast.success("Signed in");
                setTimeout(() => {
                    navigate("/");
                }, 900);
            }
        } catch (error) {
            toast.error("An error occurred!");
            console.error("Login error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthShell
            title="Welcome"
            mark="back."
            line="Sign in to see your matches and bookings."
            footer={<>New here? <Link to="/auth/signup" className="link font-medium">Create an account</Link></>}
        >
            <form className="space-y-6" onSubmit={login}>
                <div className="field">
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="field">
                    <label htmlFor="password">Password</label>
                    <div className="relative">
                        <input
                            id="password"
                            type={show ? "text" : "password"}
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="!pr-20"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShow(!show)}
                            className="absolute right-2 top-1/2 h-10 -translate-y-1/2 px-3 text-[16px]"
                            aria-label={show ? "Hide password" : "Show password"}
                        >
                            {show ? "Hide" : "Show"}
                        </button>
                    </div>
                </div>
                <button type="submit" disabled={loading} className="btn w-full">
                    {loading ? "Signing in…" : "Sign in"} <span className="arrow" aria-hidden="true">→</span>
                </button>
            </form>
        </AuthShell>
    );
}
