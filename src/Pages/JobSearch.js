import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function JobSearch() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [selectedJobDescription, setSelectedJobDescription] = useState('');
  const [skills,setSkills]=useState('');
  const [missingSkills,setMissingSkills]=useState('');

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

      // Send formData to server or perform any other action
      console.log('File selected:', selectedFile.name);
      console.log('Uploading file...');
      setIsLoading(true); // Set loading to true when form submitted
      // Example of sending formData to server using fetch
      fetch('http://127.0.0.1:8000/jobs', {
        method: 'POST',
        body: formData
      })
        .then(async (response) => {
          if (response.ok) {
            const recommendations = await response.json();
            console.log(recommendations);
            setRecommendations(recommendations);
          } else {
            toast.error('Failed to upload file.');
          }
        })
        .catch((error) => {
          console.error('Error uploading file:', error);
        })
        .finally(() => {
          setIsLoading(false); // Set loading to false when request completed
        });
    } else {
      console.warn('No file selected.');
    }
  };

  // Function to show job details
  const showDetails = (description,skills,missingSkills) => {
    setSelectedJobDescription(description);
    setSkills(skills);
    setMissingSkills(missingSkills);
    console.log(skills);
  };

  // Function to close modal
  const closeModal = () => {
    setSelectedJobDescription('');
  };

  // Function to handle view similar jobs
  const handleViewSimilarJobs = () => {
    if (skills) {
      const formData = new FormData();
      formData.append('skills', skills)
      // Send the selected job description to the backend for further processing
      fetch('http://127.0.0.1:8000/similar-jobs', {
        mode: 'no-cors',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: formData
      })
        .then(async (response) => {
          console.log(response)
          if (response.ok) {
            const similarJobs = await response.json();
            console.log(similarJobs);
            navigate.push({
              pathname: '/similar-jobs',
              state: { similarJobs }
            });
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
    <div className="pt-10 bg-gray-100 min-h-screen">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Get jobs that suit your profile!</h1>
        <p className="text-xl font-semibold text-center mb-8">Upload your resume here ...</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center">
          <div className="flex items-center justify-center w-full">
            <label htmlFor="fileInput" className="flex flex-col items-center justify-center w-64 h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">PDF, DOC, DOCX, JPG, or PNG </p>
              </div>
              <input id="fileInput" type="file" accept=".pdf,.doc,.docx,.jpg,.png" onChange={handleFileChange} className="hidden" />
            </label>
          </div>
          <label htmlFor="fileInput" className="bg-white border border-gray-300 rounded-md px-4 py-2 cursor-pointer hover:bg-gray-200 transition duration-300 ease-in-out">
            {fileName ?'Uploaded resume : ' +fileName : 'No resume uploaded'}
          </label>
          <button
            className={`bg-blue-500 text-white px-6 py-2 rounded-md mt-4 focus:outline-none focus:ring focus:ring-blue-400 transition duration-300 ease-in-out ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
            type="submit"
            disabled={!selectedFile}
          >
            {isLoading ? 'Uploading...' : (selectedFile ? 'Submit' : 'Upload')}
          </button>
        </form>
        {isLoading ? ( // Display loading message while waiting for recommendations
          <div className="text-center mt-4">
            <p className="text-lg font-semibold">Please wait...Your job recommendations are being fetched </p>
          </div>
        ) : (
          recommendations.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Job Recommendations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((recommendation, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-2">{recommendation.job_title}</h3>
                    <p className="text-gray-700 mb-4">{recommendation.company_name}</p>
                    <button onClick={() => showDetails(recommendation.Processed_JD,recommendation.skills_in_jd,recommendation.missing_skills)} className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600">Explore More</button>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
        {selectedJobDescription && (
  <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-md shadow-md max-w-md">
        <div className="px-6 py-4">
          <h2 className="text-2xl font-semibold mb-4">Job Description</h2>
          <p className="text-gray-700">{selectedJobDescription}</p>
          <p>Missing skills:
            {missingSkills.map((skill, index) => (
              <span key={index} className="text-blue-500 font-semibold ml-2">
                {skill}
                {index !== missingSkills.length - 1 && ', '}
              </span>
            ))}
          </p>
        </div>
        <div className="bg-gray-100 px-6 py-4 flex justify-end">
          <button onClick={closeModal} className="bg-blue-500 text-white font-semibold py-2 px-4 rounded mr-4 hover:bg-blue-600">Close</button>
          <button onClick={handleViewSimilarJobs} className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600">View Similar Jobs</button>
        </div>
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
