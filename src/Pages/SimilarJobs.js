import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PageHead } from '../Components/ui';
import { useReveal } from '../lib/motion';

function SimilarJobs() {
  const { state } = useLocation();
  const similarJobs = state?.similarJobs || [];
  const ref = useReveal();

  return (
    <div ref={ref} className="frame min-h-screen pb-[clamp(96px,12vw,180px)]">
      <PageHead title="Jobs like" mark={state?.from ? `${state.from}.` : 'this one.'}>
        Listings that ask for the same skills, nearest first.
      </PageHead>

      {similarJobs.length ? (
        <ol data-reveal-group className="grid gap-x-12 md:grid-cols-2">
          {similarJobs.map((job, index) => (
            <li data-reveal key={index} className="grid grid-cols-[36px_1fr] items-baseline py-5">
              <span className="data tnum !text-[var(--ink)]">{index + 1}</span>
              <span>
                <span className="block text-[clamp(21px,1.7vw,26px)] leading-tight">{job.job_title}</span>
                <span className="data block">
                  {job.company_name} · {job.job_location}
                  {job.similarity !== undefined && ` · ${Number(job.similarity).toFixed(2)}`}
                </span>
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <div data-reveal className="bg-[var(--paper-2)] p-10">
          <p className="text-[21px]">Pick a job from your matches first, then ask for similar ones.</p>
          <Link to="/jobs" className="btn mt-6">
            Go to my matches <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </div>
      )}
    </div>
  );
}

export default SimilarJobs;
