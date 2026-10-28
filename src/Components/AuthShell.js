import { Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

export default function AuthShell({ title, mark, line, children, footer }) {
    return (
        <div className="grid min-h-[100svh] lg:grid-cols-[1.05fr_1fr]">
            <Toaster position="top-right" toastOptions={{ style: { borderRadius: 20, background: "var(--ink)", color: "var(--paper)", fontFamily: "var(--serif)" } }} />

            <div className="relative m-[clamp(8px,1vw,16px)] flex flex-col justify-between overflow-hidden rounded-[var(--r-xl)] bg-[var(--ink)] p-[var(--gutter)] text-[var(--paper)] max-lg:min-h-[36svh]">
                <Link to="/" className="text-[26px] font-semibold tracking-[-0.02em]">
                    CareerGAIde
                </Link>
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease }}
                    className="display mt-12 text-[clamp(52px,7.4vw,124px)]"
                    aria-hidden="true"
                >
                    Your skills,
                    <br />
                    <span className="italic text-[var(--sun)]">matched.</span>
                </motion.p>
            </div>

            <div className="flex items-center p-[var(--gutter)] py-16">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease, delay: 0.15 }}
                    className="w-full max-w-[440px] lg:ml-[6vw]"
                >
                    <h1 className="display h-md">
                        {title} <span className="mark italic">{mark}</span>
                    </h1>
                    <p className="mt-3 text-[18px] text-[var(--ink-2)]">{line}</p>
                    <div className="mt-10">{children}</div>
                    <p className="mt-8 text-[17px]">{footer}</p>
                </motion.div>
            </div>
        </div>
    );
}
