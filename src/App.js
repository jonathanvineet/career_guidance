import { Route, Router, Routes } from "react-router-dom";
import Header from "./Layout/Header";
import Home from "./Pages/Home";
import LoginCard from "./Components/Logincard";
import RegisterCard from "./Components/RegisterCard";
import ResumeParse from "./Pages/ResumeParse";
import JobSearch from "./Pages/JobSearch";
import Appoinments from "./Pages/Appoinments";
import SimilarJobs from "./Pages/SimilarJobs";
import Quiz from "./Pages/Quiz.js";

function App() {
  return (
    <div className="App">
      {window.location.pathname!="/auth/signin"  &&
        <Header/>
      }
      <div className="">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth">
            <Route path="signup" element={<RegisterCard/>}/>
            <Route path="signin" element={<LoginCard/>} />
          </Route>
          <Route path="parse" element={<ResumeParse/>} />
          <Route path="jobs" element={<JobSearch/>} />
          <Route path="appoinments" element={<Appoinments/>} />
          <Route path="similar-jobs" element={<SimilarJobs/>} />
          <Route path="quiz" element={<Quiz/>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

