import {HiBeaker } from "react-icons/hi";
import { AiOutlineFileText ,AiOutlineMonitor,AiTwotoneMessage} from "react-icons/ai";
export const navOptions = [
    {
        "name":"CV / Resume Help",
        "routePath":"/parse"
    },
    {
        "name":"Personality Assessment",
        "routePath":"/quiz"
    },
    {
        "name":"Job Search",
        "routePath":"/jobs"
    },
    
    {
        "name":"Appoinments",
        "routePath":"/appoinments"
    },
   
]
 
export const cardOptions = [
    {

        "name":"CV / Resume Help",
        "icon":<AiOutlineFileText />,
        "description":"Professional review, writing, plus unique templates to ensure you land the job",
        "buttontext":"See options",
    },
    {
        "name":"Career Test",
        "icon":<HiBeaker/>,
        "description":"Smart and accurate career matching so you can plan your next move",
        "buttontext":"Start the test"
    },
    {
        "name":"Job Search",
        "icon":<AiOutlineMonitor />,
        "description":"Thousands of exciting job oppurtunities with companies around the world",
        "buttontext":"Browse jobs"
    },
    {
        "name":"Career Advice",
        "icon":<AiTwotoneMessage />,
        "description":"Career-boosting tips, industry insights and expert opinion from the pros",
        "buttontext":"Read advice"
    }
]