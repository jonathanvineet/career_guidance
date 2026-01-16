import { FaJs, FaArrowRight } from "react-icons/fa6";

function Card(opt) {

    console.log(opt.opt.name);

    return (

        <div className="w-72 border flex flex-col items-center p-4 gap-4">

            <div className="text-5xl">

                {opt.opt.icon}

            </div>

            <div className="flex flex-col gap-1">

                <div >

                    <p className=" text-xl text-center">{opt.opt.name}</p>

                </div>

                <div className="text-center text-md">

                    <p>{opt.opt.description}</p>

                </div>

            </div>

            <div className="border py-2 px-12 rounded-full cursor-pointer border-orange-300 text-orange-300 hover:text-white hover:bg-orange-400">

                <p className="flex items-center gap-3">{opt.opt.buttontext} <FaArrowRight /></p>

            </div>

        </div>

    )

}
export default Card;