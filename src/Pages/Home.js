import Card from "../Components/Card";
import { cardOptions } from "../Constants";

function Home() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="relative pt-24 pb-20 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                    {/* Text Content */}
                    <div className="flex-1 text-left flex flex-col gap-8 animate-fadeInUp">
                        <div className="inline-block">
                            <span className="bg-white/5 border border-white/10 text-purple-300 px-4 py-2 rounded-full text-sm font-semibold mb-4 inline-block backdrop-blur-md">
                                ✨ AI-Powered Career Intelligence
                            </span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black max-w-4xl leading-[1.1] tracking-tight">
                            Elevate Your<br />
                            <span className="gradient-text">Journey.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-white/60 max-w-xl leading-relaxed font-light">
                            Unlock your potential with cutting-edge AI insights. Navigate your career path with precision and confidence.
                        </p>
                        <div className="flex flex-wrap gap-6 mt-4">
                            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-10 py-5 rounded-2xl font-bold hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transform hover:scale-105 transition-all duration-300 flex items-center gap-2">
                                Launch Your Future
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </button>
                            <button className="bg-white/5 text-white px-10 py-5 rounded-2xl font-bold border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-md shadow-xl">
                                Explore Tools
                            </button>
                        </div>
                    </div>

                    {/* Hero Illustration */}
                    <div className="flex-1 relative animate-float">
                        <div className="absolute inset-0 bg-purple-500/20 blur-[100px] rounded-full"></div>
                        <img
                            src="/career_hero.png"
                            alt="AI Career Illustration"
                            className="relative z-10 w-full max-w-2xl mx-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-3xl"
                        />
                    </div>
                </div>
            </div>

            {/* Cards Section */}
            <div className="max-w-7xl mx-auto px-6 pb-32">
                <div className="flex flex-col items-center mb-16 text-center">
                    <h2 className="text-4xl font-bold mb-4 tracking-tight">Powerful Ecosystem</h2>
                    <div className="h-1.5 w-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {cardOptions.map((opt, index) => (
                        <div
                            key={opt.name}
                            className="animate-fadeInUp"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <Card opt={opt} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}



export default Home;