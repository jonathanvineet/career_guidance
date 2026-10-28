import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function JobSearch() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [selectedJobDescription, setSelectedJobDescription] = useState('');
  const [selectedJobTitle, setSelectedJobTitle] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [skills, setSkills] = useState('');
  const [missingSkills, setMissingSkills] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFileName(file ? file.name : '');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (selectedFile) {
      const formData = new FormData();
      formData.append('resume', selectedFile);

      console.log('File selected:', selectedFile.name);
      console.log('Uploading file...');
      setIsLoading(true);
      fetch('http://127.0.0.1:8000/jobs', {
        method: 'POST',
        body: formData
      })
        .then(async (response) => {
          if (response.ok) {
            const data = await response.json();
            setRecommendations(data);
          } else {
            toast.error('Failed to upload file.');
          }
        })
        .catch((error) => {
          console.error('Error uploading file:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      console.warn('No file selected.');
    }
  };

  const fetchAiJobFit = (jobTitle, company, desc, skillsInJd, missing) => {
    setAiLoading(true);
    setAiAnalysis(null);
    fetch('http://127.0.0.1:8000/ai-job-fit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        job_title: jobTitle,
        company_name: company,
        job_description: desc,
        skills: skillsInJd,
        missing_skills: missing
      })
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setAiAnalysis(data);
        }
      })
      .catch((err) => {
        console.error('Error fetching AI job fit:', err);
      })
      .finally(() => {
        setAiLoading(false);
      });
  };

  // Function to show job details
  const showDetails = (jobTitle, company, description, skillsInJd, missing) => {
    setSelectedJobTitle(jobTitle);
    setSelectedCompany(company);
    setSelectedJobDescription(description);
    setSkills(skillsInJd);
    setMissingSkills(missing);
    fetchAiJobFit(jobTitle, company, description, skillsInJd, missing);
  };

  // Function to close modal
  const closeModal = () => {
    setSelectedJobDescription('');
    setAiAnalysis(null);
  };

  // Function to handle view similar jobs
  const handleViewSimilarJobs = () => {
    if (skills) {
      const formData = new FormData();
      formData.append('skills', skills);
      fetch('http://127.0.0.1:8000/similar-jobs', {
        method: 'POST',
        body: formData
      })
        .then(async (response) => {
          if (response.ok) {
            const similarJobs = await response.json();
            navigate('/similar-jobs', { state: { similarJobs } });
          } else {
            toast.error('Failed to fetch similar jobs.');
          }
        })
        .catch((error) => {
          console.error('Error fetching similar jobs:', error);
        });
    } else {
      console.warn('No job description selected.');
    }
  };
  return (
    <div className="min-h-screen pt-20 pb-32 selection:bg-purple-500/30">
      <div className="container mx-auto max-w-5xl px-6 py-8 relative">
        <div className="text-center mb-16 animate-fadeInUp">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            Find Your <span className="gradient-text">Perfect Match.</span>
          </h1>
          <p className="text-xl text-white/50 max-w-2xl mx-auto font-medium leading-relaxed">
            Upload your resume and let our advanced AI reveal the opportunities that align with your unique expertise.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-10 items-center glass border border-white/10 rounded-[2.5rem] p-12 shadow-2xl animate-fadeInUp relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

          <div className="flex items-center justify-center w-full relative z-10">
            <label htmlFor="fileInput" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-white/10 hover:border-purple-500/50 rounded-3xl cursor-pointer bg-white/5 hover:bg-white/10 transition-all duration-500 group/label">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <div className="w-24 h-24 mb-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 rounded-2xl flex items-center justify-center text-white transform group-hover/label:scale-110 group-hover/label:rotate-3 transition-all duration-500 shadow-xl glow">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="mb-3 text-lg font-bold text-white tracking-wide">Drop your resume here</p>
                <p className="text-white/40 font-medium">PDF, DOCX, or Image (Max 10MB)</p>
              </div>
              <input id="fileInput" type="file" accept=".pdf,.doc,.docx,.jpg,.png" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          {fileName && (
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl px-8 py-4 w-full flex items-center justify-center gap-3 animate-fadeIn backdrop-blur-md relative z-10">
              <span className="text-2xl">📄</span>
              <p className="text-purple-300 font-bold tracking-tight">{fileName}</p>
            </div>
          )}

          <button
            className={`bg-gradient-to-r from-purple-500 to-pink-500 text-white px-12 py-5 rounded-2xl font-black text-xl shadow-[0_10px_30px_rgba(168,85,247,0.3)] hover:shadow-[0_15px_40px_rgba(168,85,247,0.5)] transform hover:scale-[1.02] active:scale-95 transition-all duration-300 w-full md:w-auto relative z-10 ${isLoading || !selectedFile ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
            type="submit"
            disabled={!selectedFile || isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                Analyzing Profile...
              </span>
            ) : (selectedFile ? 'Reveal Matching Careers 🚀' : 'Select Resume')}
          </button>
        </form>
        {isLoading ? (
          <div className="text-center mt-20 glass border border-white/10 rounded-[2.5rem] p-16 shadow-2xl animate-fadeIn relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent"></div>
            <div className="flex flex-col items-center gap-8 relative z-10">
              <div className="w-20 h-20 border-6 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
              <div>
                <p className="text-2xl font-black text-white mb-3 tracking-tight">Deciphering Your Potential...</p>
                <p className="text-white/40 font-medium">Our AI is scanning thousands of careers to find your perfect fit.</p>
              </div>
            </div>
          </div>
        ) : (
          recommendations.length > 0 && (
            <div className="mt-24 animate-fadeInUp">
              <div className="flex flex-col items-center mb-16 text-center">
                <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Curated Matches</h2>
                <div className="h-1.5 w-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recommendations.map((recommendation, index) => (
                  <div
                    key={index}
                    className="group glass-card p-1 shadow-2xl hover:shadow-[0_20px_50px_rgba(139,92,246,0.3)] transition-all duration-500 transform hover:-translate-y-3 overflow-hidden"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="h-full glass rounded-[22px] p-8 border border-white/5 group-hover:border-white/20 transition-all duration-500">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center text-3xl mb-6 shadow-inner border border-white/10 group-hover:scale-110 transition-transform">
                        💼
                      </div>
                      <h3 className="text-2xl font-black text-white mb-2 leading-tight group-hover:text-purple-300 transition-colors">{recommendation.job_title}</h3>
                      <p className="text-white/40 mb-8 font-bold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
                        {recommendation.company_name}
                      </p>
                      <button
                        onClick={() => showDetails(recommendation.job_title, recommendation.company_name, recommendation.Processed_JD, recommendation.skills_in_jd, recommendation.missing_skills)}
                        className="bg-white/5 hover:bg-white/10 text-white font-black py-4 px-6 rounded-xl border border-white/10 hover:border-purple-500/40 transition-all duration-300 w-full flex items-center justify-center gap-2 group/btn"
                      >
                        Explore Journey
                        <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
        {selectedJobDescription && (
          <div className="fixed inset-0 flex justify-center items-center z-[100] animate-fadeIn p-4">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-xl" onClick={closeModal}></div>
            <div className="relative glass border border-white/10 rounded-[2.5rem] shadow-4xl max-w-3xl w-full mx-auto max-h-[85vh] overflow-hidden animate-fadeInUp flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-b border-white/10 px-10 py-8 relative">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                    AI Career Architecture
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                  {selectedJobTitle || 'Career Journey'}
                </h2>
                {selectedCompany && (
                  <p className="text-white/50 font-bold mt-1 text-sm">{selectedCompany}</p>
                )}
                <div className="absolute top-8 right-8 cursor-pointer text-white/40 hover:text-white transition-colors" onClick={closeModal}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </div>
              </div>

              {/* Content */}
              <div className="px-10 py-8 overflow-y-auto custom-scrollbar flex-grow bg-[#0f172a]/50 flex flex-col gap-8">
                {/* Groq AI Career Coach Section */}
                <div className="rounded-3xl p-6 bg-gradient-to-br from-purple-900/30 via-slate-900/60 to-pink-900/20 border border-purple-500/30 shadow-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">⚡</span>
                      <h3 className="text-lg font-black text-white tracking-tight">AI Coach Fit Assessment</h3>
                    </div>
                    {aiAnalysis?.match_score && (
                      <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/40 px-4 py-1.5 rounded-full">
                        <span className="text-xl font-black text-purple-300">{aiAnalysis.match_score}%</span>
                        <span className="text-xs uppercase font-extrabold text-white/70 tracking-wider">Match</span>
                      </div>
                    )}
                  </div>

                  {aiLoading ? (
                    <div className="py-8 flex flex-col items-center justify-center gap-3">
                      <div className="w-10 h-10 border-3 border-purple-500/20 border-t-purple-400 rounded-full animate-spin"></div>
                      <p className="text-sm font-bold text-purple-300/80 animate-pulse">Computing Groq AI career intelligence & gap analysis...</p>
                    </div>
                  ) : aiAnalysis ? (
                    <div className="space-y-4 text-sm">
                      {aiAnalysis.summary && (
                        <p className="text-white/80 leading-relaxed font-medium bg-black/20 p-4 rounded-2xl border border-white/5">
                          {aiAnalysis.summary}
                        </p>
                      )}

                      {aiAnalysis.strengths && aiAnalysis.strengths.length > 0 && (
                        <div>
                          <h4 className="text-xs font-black text-green-400 uppercase tracking-wider mb-2">⭐ Your Key Strengths</h4>
                          <ul className="space-y-1.5 pl-2 text-white/70">
                            {aiAnalysis.strengths.map((str, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-green-400">✓</span>
                                <span>{str}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {aiAnalysis.action_plan && aiAnalysis.action_plan.length > 0 && (
                        <div>
                          <h4 className="text-xs font-black text-pink-400 uppercase tracking-wider mb-2">🎯 Recommended Upskilling Roadmap</h4>
                          <ul className="space-y-1.5 pl-2 text-white/70">
                            {aiAnalysis.action_plan.map((step, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-pink-400 font-bold">→</span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {aiAnalysis.interview_tip && (
                        <div className="bg-purple-500/10 border border-purple-500/20 p-3.5 rounded-2xl">
                          <h4 className="text-xs font-black text-purple-300 uppercase tracking-wider mb-1">💡 Pro Interview Tip</h4>
                          <p className="text-white/75 text-xs leading-relaxed">{aiAnalysis.interview_tip}</p>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>

                {/* Job Scope & Missing Skills */}
                <div>
                  <h3 className="text-sm font-black text-purple-400 uppercase tracking-[0.2em] mb-4">Core Competencies & Scope</h3>
                  <p className="text-white/70 leading-relaxed text-base font-medium">{selectedJobDescription}</p>
                </div>

                {missingSkills && missingSkills.length > 0 && (
                  <div>
                    <h3 className="text-sm font-black text-pink-400 uppercase tracking-[0.2em] mb-4">Identified Growth Areas</h3>
                    <div className="flex flex-wrap gap-2.5">
                      {missingSkills.map((skill, index) => (
                        <span key={index} className="bg-white/5 border border-white/10 text-white font-bold px-4 py-2 rounded-xl text-xs backdrop-blur-md shadow-lg group hover:border-pink-500/50 transition-all duration-300">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-white/5 backdrop-blur-3xl px-10 py-6 flex flex-col md:flex-row gap-4 justify-end border-t border-white/10">
                <button
                  onClick={closeModal}
                  className="bg-white/5 text-white font-black py-3.5 px-8 rounded-2xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  Close
                </button>
                <button
                  onClick={handleViewSimilarJobs}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black py-3.5 px-8 rounded-2xl hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transform hover:scale-[1.03] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Discover Parallel Paths
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
      <Toaster />
    </div>
  );
}

export default JobSearch;
