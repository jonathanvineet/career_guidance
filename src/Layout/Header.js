import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { navOptions } from "../Constants";
import { useAuth } from "../contexts/AuthContext";

function Header() {
    const [open, setOpen] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [solid, setSolid] = useState(false);
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    useEffect(() => setOpen(false), [pathname]);

    // Tuck the bar away while reading down, bring it back on the way up
    useEffect(() => {
        let last = window.scrollY;
        const onScroll = () => {
            const y = window.scrollY;
            setSolid(y > 8);
            setHidden(y > 160 && y > last && !open);
            last = y;
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [open]);

    const handleSignOut = async () => {
        await signOut();
        navigate("/");
    };

    return (
        <header
            className="fixed inset-x-0 top-0 z-50 transition-transform duration-500"
            style={{
                transform: hidden ? "translateY(-100%)" : "none",
                transitionTimingFunction: "var(--ease-out)",
                background: solid || open ? "var(--paper)" : "transparent",
            }}
        >
            <div className="frame flex h-[72px] items-center justify-between gap-6">
                <Link to="/" className="text-[26px] font-semibold tracking-[-0.02em]" aria-label="CareerGAIde home">
                    CareerGAIde
                </Link>

                <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
                    {navOptions.map((opt) => (
                        <NavLink key={opt.routePath} to={opt.routePath} className="link text-[17px]">
                            {opt.name}
                        </NavLink>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    {user ? (
                        <button onClick={handleSignOut} className="btn btn--ghost hidden !min-h-[44px] !px-5 !text-[17px] sm:inline-flex">
                            Sign out
                        </button>
                    ) : (
                        <Link to="/auth/signin" className="btn hidden !min-h-[44px] !px-5 !text-[17px] sm:inline-flex">
                            Sign in
                        </Link>
                    )}
                    <button
                        className="grid h-11 w-11 place-items-center lg:hidden"
                        onClick={() => setOpen(!open)}
                        aria-expanded={open}
                        aria-controls="mobile-nav"
                        aria-label={open ? "Close menu" : "Open menu"}
                    >
                        <span className="relative block h-3 w-6">
                            <span className="absolute left-0 top-0 h-[2px] w-6 bg-[var(--ink)] transition-transform duration-300" style={{ transform: open ? "translateY(5px) rotate(45deg)" : "none" }} />
                            <span className="absolute bottom-0 left-0 h-[2px] w-6 bg-[var(--ink)] transition-transform duration-300" style={{ transform: open ? "translateY(-5px) rotate(-45deg)" : "none" }} />
                        </span>
                    </button>
                </div>
            </div>

            <div
                id="mobile-nav"
                className="overflow-hidden transition-[max-height,visibility] duration-500 lg:hidden"
                style={{ maxHeight: open ? 520 : 0, visibility: open ? "visible" : "hidden", transitionTimingFunction: "var(--ease-out)" }}
            >
                <nav className="frame flex flex-col pb-8 pt-2" aria-label="Mobile">
                    {navOptions.map((opt) => (
                        <NavLink key={opt.routePath} to={opt.routePath} className="py-3 text-[32px] leading-tight tracking-[-0.02em]">
                            {opt.name}
                        </NavLink>
                    ))}
                    {user ? (
                        <button onClick={handleSignOut} className="btn mt-4 w-full">
                            Sign out
                        </button>
                    ) : (
                        <Link to="/auth/signin" className="btn mt-4 w-full">
                            Sign in
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Header;
