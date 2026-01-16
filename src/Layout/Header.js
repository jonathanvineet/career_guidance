import { FaMagnifyingGlass } from "react-icons/fa6";
import { navOptions } from "../Constants";

function Header() {
    return (
        <div className="sticky top-0 z-50 glass border-b border-white/5 shadow-2xl">
            <div className="flex justify-between px-8 h-20 items-center max-w-7xl mx-auto">
                <div className="font-bold text-2xl cursor-pointer">
                    <span onClick={() => { window.location.pathname = "/" }} className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white transform group-hover:rotate-12 transition-transform duration-300 shadow-lg glow">
                            C
                        </div>
                        <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent font-extrabold tracking-tight">Career GAIde</span>
                    </span>
                </div>
                <div className="flex items-center gap-10">
                    <div className="hidden lg:flex gap-8">
                        {navOptions.map((opt, index) => (
                            <button
                                key={opt.name}
                                onClick={() => { window.location.pathname = opt.routePath }}
                                className="relative group py-2"
                            >
                                <p className="cursor-pointer font-medium text-white/70 group-hover:text-white transition-colors duration-300 text-sm tracking-wide">
                                    {opt.name}
                                </p>
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-500 rounded-full"></span>
                            </button>))}
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="cursor-pointer text-xl text-white/50 hover:text-white transition-colors duration-300 p-2 hover:bg-white/5 rounded-full">
                            <FaMagnifyingGlass />
                        </div>
                        <button
                            onClick={() => { window.location.pathname = "/auth/signin" }}
                            className="bg-white/10 hover:bg-white/20 text-white px-8 py-2.5 rounded-full border border-white/10 hover:border-white/20 transition-all duration-300 font-semibold backdrop-blur-md shadow-xl"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}



export default Header;