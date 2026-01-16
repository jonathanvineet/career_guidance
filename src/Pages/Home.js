import Card from "../Components/Card";
import { cardOptions } from "../Constants";

function Home(){
    return (
        <div className="pt-10  " >
            <div className="text-center flex items-center flex-col gap-7 ">
                <p className="text-6xl font-bold w-[10em]">
                    Kickstart and advance your career
                </p>
                <p className="text-xl tracking-wide">
                    Expert tools and advance to achieve your career goals
                </p>
            </div>
            <div className="flex justify-center pt-10 gap-5">
                {cardOptions.map((opt)=>(
                    <Card opt={opt}/>
                ))}
            </div>
        </div>
    )
}

 

export default Home;