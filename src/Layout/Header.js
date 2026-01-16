import { FaMagnifyingGlass } from "react-icons/fa6";
import {navOptions} from "../Constants";

function Header() {
    return (
        <div className="flex justify-between px-10 h-16 items-center border-b bg-black">
            <div className="font-bold text-white text-xl cursor-pointer">
                <span onClick={() => { window.location.pathname ="/"}}>Career<span className="text-orange-400" >GAIde</span></span>
            </div>
            <div className="flex items-center gap-5 text-white">
                <div className="flex gap-5">
                {navOptions.map((opt) => (
                <button key={opt.name} onClick={() => { window.location.pathname = opt.routePath }}>
                    <p className="cursor-pointer hover:text-orange-400">{opt.name}</p>
                </button>))}

                </div>
                <div className="cursor-pointer">
                    <FaMagnifyingGlass />
                </div>
                <div className="border px-4 py-1 text-white bg-orange-400 rounded-lg">
                    <button onClick={()=>{window.location.pathname="/auth/signin"}}>Login</button>
                </div>
            </div>
        </div>
    )
}

 

export default Header;