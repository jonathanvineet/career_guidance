import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';
import { supabase } from "../supabaseClient";
import AuthShell from "./AuthShell";

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
            const { error } = await supabase.auth.signUp({
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
                toast.success("Account created. Check your email to verify it.");
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

    return (
        <AuthShell
            title="Make an"
            mark="account."
            line="Keep your matches, your profile and your bookings in one place."
            footer={<>Already have one? <Link to="/auth/signin" className="link font-medium">Sign in</Link></>}
        >
            <form className="space-y-6" onSubmit={handleRegister}>
                <div className="field">
                    <label htmlFor="username">Name</label>
                    <input id="username" type="text" autoComplete="nickname" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
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
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            aria-describedby="password-hint"
                            className="!pr-20"
                            required
                            minLength={6}
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
                    <p id="password-hint" className="hint">At least 6 characters.</p>
                </div>
                <button type="submit" disabled={loading} className="btn w-full">
                    {loading ? "Creating…" : "Create account"} <span className="arrow" aria-hidden="true">→</span>
                </button>
            </form>
        </AuthShell>
    );
}
