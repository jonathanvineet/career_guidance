import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye,FaEyeSlash, FaEnvelope, FaUserGear, FaLock } from "react-icons/fa6";
 
export default function RegisterCard() {
    const [show, setShow] = useState(false);
    const [username, setUsername] = useState("");
    const [emailID, setEmailID] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    function handleIcons() {
        setShow(!show);
    }
    return (
        <div className="w-full h-screen flex items-center justify-center">
            <div className="w-[320px] bg-white border border-slate-200 rounded-lg px-8 py-10">
                <div className="mb-5 leading-tight">
                    <p className="text-xl font-semibold">Create your Account</p>
                    <p className="text-sm text-slate-400">Sign up to continue</p>
                </div>
                <form className=" flex flex-col items-center justify-center gap-4 text-sm w-full">
                    <div className="relative w-full">
                        <input type="text" placeholder="Enter the Username" onChange={(e) => setUsername(e.target.value)} className="border border-slate-400 rounded-lg px-8 py-2 w-full" required/>
                        <div className="absolute top-2 left-2 w-5 text-lg">
                            <FaUserGear/>
                        </div>
                    </div>
                    <div className="relative w-full">
                        <input type="text" placeholder="Enter the Email Id" onChange={(e) => setEmailID(e.target.value)} className="border border-slate-400 rounded-lg px-8 py-2 w-full" required/>
                        <div className="absolute top-2 left-2 w-5 text-lg">
                            <FaEnvelope/>
                        </div>
                    </div>
                    <div className="relative w-full">
                        {show ? (
                            <input type="text" placeholder="Enter the Password" onChange={(e) => setPassword(e.target.value)} className="border border-slate-400 rounded-lg px-8 py-2 w-full" required/>
                        ) : (
                            <input type="password" placeholder="Enter the Password" onChange={(e) => setPassword(e.target.value)} className="border border-slate-400 rounded-lg px-8 py-2 w-full" required/>
                        )}
                        <div className="absolute top-2 left-2 w-5 text-lg">
                            <FaLock />
                        </div>
                        <div className="absolute top-2 right-2 w-5 text-lg" onClick={handleIcons}>
                            {show ? (<FaEye />) : (<FaEyeSlash />)}
                        </div>
                    </div>
                    {!loading ? (
                        <button onClick={()=>{window.location.pathname="/"}} type="submit" className="bg-black text-white px-4 py-2 rounded-lg w-full">Register</button>
                    ) : (
                        <button  type="submit" className="bg-black text-white px-4 py-2 rounded-lg w-full text-center flex items-center justify-center gap-2 opacity-50" disabled >
                            <div><p>Register</p></div>
                        </button>
                    )}
                </form>
                <div className="text-sm mt-5 text-center"><p>Already have an account? <Link to="/auth/signin" className="font-semibold underline">Login</Link></p></div>
            </div>
        </div>
    )
}

 