import React, { useState, useEffect } from 'react';

function SimilarJobs({ similarJobs }) {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Similar Jobs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {similarJobs.map((job, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">{job.job_title}</h3>
            <p className="text-gray-700 mb-4">{job.company_name}</p>
            <p className="text-gray-700">{job.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SimilarJobs;
