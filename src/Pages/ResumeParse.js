import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';

function ResumeParse() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (selectedFile) {
      const formData = new FormData();
      formData.append('resume', selectedFile);

      // Set loading to true when form submitted
      setIsLoading(true);

      // Example of sending formData to server using fetch
      fetch('http://127.0.0.1:8000/parse', {
        method: 'POST',
        body: formData
      })
        .then(async response => {
          if (response.ok) {
            const data = await response.json();
            console.log(data);
            setSkills(data);
          } else {
            toast.error('Failed to upload file.');
          }
        })
        .catch(error => {
          console.error('Error uploading file:', error);
        })
        .finally(() => {
          // Set loading to false when request completed
          setIsLoading(false);
        });
    } else {
      console.warn('No file selected.');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="max-w-4xl mx-auto px-6 relative">
        <div className="text-center mb-20 animate-fadeInUp">
          <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">Extract <span className="gradient-text">Genius.</span></h2>
          <p className="text-xl text-white/50 max-w-2xl mx-auto font-medium">Instantly decode your technical profile and transform your resume into actionable intelligence.</p>
        </div>

        <div className="glass border border-white/10 rounded-[2.5rem] p-12 shadow-3xl animate-fadeInUp text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-transparent"></div>

          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-10 relative z-10">
            <div className="w-full relative group/upload">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.png"
                onChange={handleFileChange}
                className="hidden"
                id="resume-upload"
              />
              <label
                htmlFor="resume-upload"
                className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-3xl p-10 cursor-pointer bg-white/5 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-500 group-hover/upload:shadow-[0_0_30px_rgba(168,85,247,0.1)]"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center text-white text-3xl mb-6 shadow-xl border border-white/5">
                  📑
                </div>
                <span className="text-lg font-bold text-white mb-2 leading-tight">
                  {selectedFile ? selectedFile.name : 'Select Resume Portfolio'}
                </span>
                <span className="text-white/40 font-medium text-sm">PDF, DOCX, or Images up to 10MB</span>
              </label>
            </div>

            <button
              className={`bg-gradient-to-r from-purple-500 to-pink-500 text-white px-14 py-5 rounded-2xl font-black text-xl shadow-2xl hover:shadow-[0_15px_40px_rgba(168,85,247,0.4)] transform hover:scale-[1.03] active:scale-95 transition-all duration-500 w-full md:w-auto ${isLoading ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
              type="submit"
              disabled={isLoading || !selectedFile}
            >
              {isLoading ? (
                <span className="flex items-center gap-3">
                  <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Deconstructing...
                </span>
              ) : 'Commence Analysis'}
            </button>
          </form>

          {isLoading && (
            <div className="mt-12 flex flex-col items-center gap-4 animate-pulse relative z-10">
              <p className="text-purple-400 font-black tracking-widest uppercase text-xs">Processing Neural Data</p>
              <div className="h-1.5 w-48 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 animate-shimmer" style={{ width: '100%', backgroundSize: '1000px 100%' }}></div>
              </div>
            </div>
          )}

          {skills.length > 0 && !isLoading && (
            <div className="mt-16 animate-fadeIn relative z-10 text-left">
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-2xl font-black text-white tracking-tight">Decoded Capabilities</h2>
                <div className="h-px flex-grow bg-white/10"></div>
              </div>
              <div className="flex flex-wrap gap-3">
                {Array.isArray(skills) && skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold hover:border-purple-500/50 hover:bg-white/10 transition-all duration-300 backdrop-blur-md shadow-lg"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default ResumeParse;
