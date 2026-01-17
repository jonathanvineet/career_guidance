import { FaMagnifyingGlass, FaBars, FaXmark } from "react-icons/fa6";
import { navOptions } from "../Constants";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, signOut } = useAuth();

    const handleSignOut = async () => {
        await signOut();
        window.location.pathname = "/";
    };

    return (
        <div className="sticky top-0 z-50 glass border-b border-white/5 shadow-2xl">
            <div className="flex justify-between px-4 sm:px-6 md:px-8 h-16 sm:h-18 md:h-20 items-center max-w-7xl mx-auto">
                <div className="font-bold text-xl sm:text-2xl cursor-pointer">
                    <span onClick={() => { window.location.pathname = "/" }} className="flex items-center gap-2 sm:gap-3 group">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center text-white transform group-hover:rotate-12 transition-transform duration-300 shadow-lg glow text-sm sm:text-base">
                            C
                        </div>
                        <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent font-extrabold tracking-tight hidden sm:inline">Career GAIde</span>
                    </span>
                </div>
                <div className="flex items-center gap-4 sm:gap-6 md:gap-10">
                    {/* Desktop Navigation */}
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

                    <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
                        <div className="cursor-pointer text-lg sm:text-xl text-white/50 hover:text-white transition-colors duration-300 p-2 hover:bg-white/5 rounded-full">
                            <FaMagnifyingGlass />
                        </div>
                        {user ? (
                            <div className="hidden sm:flex items-center gap-3">
                                <span className="text-sm text-white/60">{user.email}</span>
                                <button
                                    onClick={handleSignOut}
                                    className="bg-white/10 hover:bg-white/20 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 rounded-full border border-white/10 hover:border-white/20 transition-all duration-300 font-semibold backdrop-blur-md shadow-xl text-sm sm:text-base"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => { window.location.pathname = "/auth/signin" }}
                                className="hidden sm:block bg-white/10 hover:bg-white/20 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 rounded-full border border-white/10 hover:border-white/20 transition-all duration-300 font-semibold backdrop-blur-md shadow-xl text-sm sm:text-base"
                            >
                                Sign In
                            </button>
                        )}
                        
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden text-white text-xl p-2 hover:bg-white/5 rounded-full transition-colors"
                        >
                            {mobileMenuOpen ? <FaXmark /> : <FaBars />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden glass border-t border-white/5 animate-fadeInUp">
                    <div className="flex flex-col px-4 py-4 gap-2">
                        {navOptions.map((opt) => (
                            <button
                                key={opt.name}
                                onClick={() => {
                                    window.location.pathname = opt.routePath;
                                    setMobileMenuOpen(false);
                                }}
                                className="text-left py-3 px-4 text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300 font-medium"
                            >
                                {opt.name}
                            </button>
                        ))}
                        {user ? (
                            <>
                                <div className="sm:hidden text-center py-2 px-4 text-white/60 text-sm">
                                    {user.email}
                                </div>
                                <button
                                    onClick={handleSignOut}
                                    className="sm:hidden bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-xl font-semibold mt-2 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-300"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => { window.location.pathname = "/auth/signin" }}
                                className="sm:hidden bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-xl font-semibold mt-2 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-300"
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}



export default Header;