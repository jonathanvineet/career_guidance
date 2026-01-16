import { FaArrowRight } from "react-icons/fa6";

function Card(opt) {
    return (
        <div className="group relative glass-card p-10 shadow-2xl hover:shadow-[0_20px_60px_rgba(139,92,246,0.3)] transition-all duration-500 transform hover:-translate-y-3 overflow-hidden h-full flex flex-col border border-white/5 hover:border-white/20">
            {/* Ambient background glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-0 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full">
                {/* Icon with refined styling */}
                <div className="w-20 h-20 mb-10 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center text-white text-4xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner">
                    <div className="drop-shadow-glow">
                        {opt.opt.icon}
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-black text-white mb-4 group-hover:text-purple-300 transition-colors duration-300 tracking-tight">
                    {opt.opt.name}
                </h3>

                {/* Description */}
                <p className="text-white/50 leading-relaxed mb-8 flex-grow font-medium">
                    {opt.opt.description}
                </p>

                {/* Action Link */}
                <div className="mt-auto">
                    <button className="flex items-center gap-3 text-white font-bold group/btn border-b-2 border-purple-500/30 hover:border-purple-500 transition-all duration-300 pb-1">
                        <span className="tracking-wide">{opt.opt.buttontext}</span>
                        <FaArrowRight className="text-sm transform group-hover/btn:translate-x-2 transition-transform duration-300" />
                    </button>
                </div>
            </div>

            {/* Decorative light sweep */}
            <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-25deg] group-hover:left-[100%] transition-all duration-1000 ease-in-out"></div>
        </div>
    )
}

export default Card;
