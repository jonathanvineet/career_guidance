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
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto px-6 py-12 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-4xl font-bold mb-8">Upload Your Resume</h2>
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
          <input
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.png"
            onChange={handleFileChange}
            className="border border-gray-300 py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="bg-blue-500 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
        {isLoading && (
          <p className="text-gray-500 mt-4">Please wait... Skills are being extracted from your resume</p>
        )}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Skills:</h2>
          <ul className="flex flex-wrap gap-4">
            {Array.isArray(skills) && skills.map((skill, index) => (
              <li key={index} className="bg-gray-200 py-2 px-4 rounded-lg text-lg font-medium">{skill}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResumeParse;
