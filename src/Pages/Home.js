import Card from "../Components/Card";
import { cardOptions } from "../Constants";

function Home() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="relative pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-16">
                    {/* Text Content */}
                    <div className="flex-1 text-center lg:text-left flex flex-col gap-4 sm:gap-6 md:gap-8 animate-fadeInUp">
                        <div className="inline-block">
                            <span className="bg-white/5 border border-white/10 text-purple-300 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 inline-block backdrop-blur-md">
                                ✨ AI-Powered Career Intelligence
                            </span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black max-w-4xl leading-[1.1] tracking-tight">
                            Elevate Your<br />
                            <span className="gradient-text">Journey.</span>
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/60 max-w-xl leading-relaxed font-light mx-auto lg:mx-0">
                            Unlock your potential with cutting-edge AI insights. Navigate your career path with precision and confidence.
                        </p>
                        <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 mt-2 sm:mt-4 justify-center lg:justify-start">
                            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto">
                                Launch Your Future
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </button>
                            <button className="bg-white/5 text-white px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-md shadow-xl w-full sm:w-auto">
                                Explore Tools
                            </button>
                        </div>
                    </div>

                    {/* Hero Illustration */}
                    <div className="flex-1 relative animate-float w-full max-w-md lg:max-w-none mt-8 lg:mt-0">
                        <div className="absolute inset-0 bg-purple-500/20 blur-[100px] rounded-full"></div>
                        <img
                            src="/career_hero.png"
                            alt="AI Career Illustration"
                            className="relative z-10 w-full max-w-2xl mx-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl sm:rounded-3xl"
                        />
                    </div>
                </div>
            </div>

            {/* Cards Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24 md:pb-32">
                <div className="flex flex-col items-center mb-10 sm:mb-12 md:mb-16 text-center">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 tracking-tight">Powerful Ecosystem</h2>
                    <div className="h-1 sm:h-1.5 w-16 sm:w-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
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