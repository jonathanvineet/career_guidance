import { Route, Routes, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "./Layout/Header";
import Footer from "./Layout/Footer";
import Home from "./Pages/Home";
import LoginCard from "./Components/Logincard";
import RegisterCard from "./Components/RegisterCard";
import ResumeParse from "./Pages/ResumeParse";
import JobSearch from "./Pages/JobSearch";
import Appoinments from "./Pages/Appoinments";
import SimilarJobs from "./Pages/SimilarJobs";
import Quiz from "./Pages/Quiz.js";
import { AuthProvider } from "./contexts/AuthContext";
import { useSmoothScroll } from "./lib/motion";

function App() {
  const location = useLocation();
  const isAuth = location.pathname.startsWith("/auth");
  useSmoothScroll();

  return (
    <AuthProvider>
      <div className="App">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-[var(--sun)] focus:px-4 focus:py-2">
          Skip to content
        </a>
        {!isAuth && <Header />}
        <motion.main
          id="main"
          key={location.pathname}
          initial={{ y: 14 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/auth">
              <Route path="signup" element={<RegisterCard />} />
              <Route path="signin" element={<LoginCard />} />
            </Route>
            <Route path="parse" element={<ResumeParse />} />
            <Route path="jobs" element={<JobSearch />} />
            <Route path="appoinments" element={<Appoinments />} />
            <Route path="similar-jobs" element={<SimilarJobs />} />
            <Route path="quiz" element={<Quiz />} />
          </Routes>
        </motion.main>
        {!isAuth && <Footer />}
      </div>
    </AuthProvider>
  );
}

export default App;
