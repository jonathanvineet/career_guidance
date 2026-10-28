import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { API, PageHead, ResumeDrop, Working } from '../Components/ui';
import { gsap, reducedMotion, scrollToEl, useReveal } from '../lib/motion';

// skills_in_jd arrives as a Python set literal: "{'python', 'sql'}"
const skillList = (value) => {
  if (Array.isArray(value)) return value;
  return [...String(value || '').matchAll(/'([^']+)'/g)].map((m) => m[1].toLowerCase());
};

function JobSearch() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [active, setActive] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const navigate = useNavigate();
  const ref = useReveal();
  const results = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('resume', selectedFile);
    setIsLoading(true);

    fetch(`${API}/jobs`, { method: 'POST', body: formData })
      .then(async (response) => {
        if (!response.ok) throw new Error('Failed to upload file.');
        const data = await response.json();
        setRecommendations(Array.isArray(data) ? data : []);
        setActive(0);
        requestAnimationFrame(() => scrollToEl(results.current));
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
        toast.error('Could not match that resume. Is the backend running on port 8000?');
      })
      .finally(() => setIsLoading(false));
  };

  useLayoutEffect(() => {
    if (!recommendations.length || reducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from('[data-result]', { opacity: 0, y: 24, stagger: 0.06, duration: 0.7, ease: 'power3.out' });
      gsap.from('[data-bar]', { scaleX: 0, transformOrigin: 'left', stagger: 0.06, duration: 1, ease: 'power3.inOut', delay: 0.2 });
    }, results);
    return () => ctx.revert();
  }, [recommendations]);

  const job = recommendations[active];
  const jobSkills = job ? skillList(job.skills_in_jd) : [];
  const missing = job ? (job.missing_skills || []).filter((s) => s.length > 2) : [];
  const have = jobSkills.filter((s) => !missing.includes(s) && s.length > 1);
  // Ask the Groq career coach about the open job; drop answers for jobs no longer open
  useEffect(() => {
    if (!job) return;
    let current = true;
    setAiAnalysis(null);
    setAiLoading(true);
    fetch(`${API}/ai-job-fit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        job_title: job.job_title,
        company_name: job.company_name,
        job_description: job.Processed_JD,
        skills: have,
        missing_skills: missing,
      }),
    })
      .then(async (res) => {
        if (res.ok && current) setAiAnalysis(await res.json());
      })
      .catch((err) => console.error('Error fetching AI job fit:', err))
      .finally(() => current && setAiLoading(false));
    return () => {
      current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job]);

  const maxSim = Math.max(...recommendations.map((r) => r.similarity || 0), 0.0001);

  const handleViewSimilarJobs = () => {
    if (!jobSkills.length) return;
    const formData = new FormData();
    formData.append('skills', jobSkills.join(','));
    setSimilarLoading(true);
    fetch(`${API}/similar-jobs`, { method: 'POST', body: formData })
      .then(async (response) => {
        if (!response.ok) throw new Error('Failed to fetch similar jobs.');
        const similarJobs = await response.json();
        navigate('/similar-jobs', { state: { similarJobs, from: job.job_title } });
      })
      .catch((error) => {
        console.error('Error fetching similar jobs:', error);
        toast.error('Could not fetch similar jobs.');
      })
      .finally(() => setSimilarLoading(false));
  };

  return (
    <div ref={ref} className="frame min-h-screen pb-[clamp(96px,12vw,180px)]">
      <PageHead title="Your jobs," mark="ranked.">
        Upload your resume and we rank 604 real listings by how closely their skills match yours, then show what each one asks for that you don't have.
      </PageHead>

      <form data-reveal onSubmit={handleSubmit} className="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
        <ResumeDrop id="fileInput" file={selectedFile} onFile={setSelectedFile} />
        <button className="btn" type="submit" disabled={!selectedFile || isLoading}>
          {isLoading ? 'Matching…' : 'Rank my jobs'} <span className="arrow" aria-hidden="true">→</span>
        </button>
      </form>
      {isLoading && <Working label="Reading your resume and scoring every listing" />}

      {recommendations.length > 0 && (
        <section ref={results} aria-labelledby="matches-title" className="mt-[clamp(96px,10vw,160px)] grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <h2 id="matches-title" className="display h-md">
              Top ten distinct titles
            </h2>
            <ol className="mt-8 space-y-1">
              {recommendations.map((r, i) => (
                <li key={`${r.job_title}-${i}`} data-result>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-pressed={active === i}
                    className="grid w-full grid-cols-[32px_1fr] items-baseline rounded-[var(--r-md)] px-4 py-3 text-left transition-colors duration-200 hover:bg-[var(--paper-2)]"
                    style={{ background: active === i ? 'var(--sun)' : undefined }}
                  >
                    <span className="data tnum !text-[var(--ink)]">{i + 1}</span>
                    <span>
                      <span className="block text-[clamp(19px,1.5vw,23px)] leading-tight">{r.job_title}</span>
                      <span className="data block">
                        {r.company_name}
                        {r.similarity !== undefined && ` · ${Number(r.similarity).toFixed(2)}`}
                      </span>
                      {r.similarity !== undefined && (
                        <span className="mt-2 block h-[6px] overflow-hidden rounded-[var(--r-pill)] bg-[var(--paper-3)]">
                          <span data-bar className="block h-full bg-[var(--ink)]" style={{ width: `${(r.similarity / maxSim) * 100}%` }} />
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <AnimatePresence mode="wait">
              {job && (
                <motion.article
                  key={active}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-[var(--r-xl)] bg-[var(--ink)] p-[clamp(24px,3vw,44px)] text-[var(--paper)]"
                  aria-live="polite"
                >
                  <h3 className="text-[clamp(28px,2.6vw,40px)] leading-[1.05] tracking-[-0.02em]">{job.job_title}</h3>
                  <p className="data mt-2 !text-[var(--paper-3)]">
                    {job.company_name} · {job.job_location}
                    {job.Average_Salary > 0 ? ` · $${Math.round(job.Average_Salary).toLocaleString('en-US')}` : ''}
                  </p>

                  {have.length > 0 && (
                    <>
                      <p className="mt-8 text-[17px]">You have</p>
                      <div className="mt-2 flex flex-wrap gap-[6px]">
                        {have.map((s) => (
                          <span key={s} className="chip">{s}</span>
                        ))}
                      </div>
                    </>
                  )}
                  {missing.length > 0 && (
                    <>
                      <p className="mt-6 text-[17px]">To learn</p>
                      <div className="mt-2 flex flex-wrap gap-[6px]">
                        {missing.map((s) => (
                          <span key={s} className="chip chip--dark">{s}</span>
                        ))}
                      </div>
                    </>
                  )}

                  <section className="mt-8 rounded-[var(--r-lg)] bg-[var(--paper)] p-6 text-[var(--ink)]" aria-live="polite" aria-busy={aiLoading}>
                    <div className="flex items-baseline justify-between gap-4">
                      <h4 className="text-[21px] leading-tight">AI coach</h4>
                      {aiAnalysis?.match_score !== undefined && (
                        <p className="data tnum !text-[var(--ink)]">fit {aiAnalysis.match_score}%</p>
                      )}
                    </div>
                    {aiLoading && (
                      <div className="mt-3">
                        <p className="mb-2 text-[16px] text-[var(--ink-2)]">Reading the listing against your skills</p>
                        <div className="scan" />
                      </div>
                    )}
                    {aiAnalysis && !aiLoading && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                        {aiAnalysis.summary && <p className="mt-3 text-[17px]">{aiAnalysis.summary}</p>}
                        {aiAnalysis.strengths?.length > 0 && (
                          <>
                            <p className="mt-4 text-[16px] font-medium">What you bring</p>
                            <ul className="mt-1 list-disc space-y-1 pl-5 text-[16px]">
                              {aiAnalysis.strengths.map((t, i) => <li key={i}>{t}</li>)}
                            </ul>
                          </>
                        )}
                        {aiAnalysis.action_plan?.length > 0 && (
                          <>
                            <p className="mt-4 text-[16px] font-medium">How to close the gap</p>
                            <ol className="mt-1 list-decimal space-y-1 pl-5 text-[16px]">
                              {aiAnalysis.action_plan.map((t, i) => <li key={i}>{t}</li>)}
                            </ol>
                          </>
                        )}
                        {aiAnalysis.interview_tip && (
                          <p className="mt-4 rounded-[var(--r-sm)] bg-[var(--sun)] px-4 py-3 text-[16px]">
                            <span className="font-medium">Interview tip:</span> {aiAnalysis.interview_tip}
                          </p>
                        )}
                      </motion.div>
                    )}
                  </section>

                  {job.Processed_JD && (
                    <details className="mt-8">
                      <summary className="cursor-pointer text-[17px]">Read the listing</summary>
                      <p className="mt-3 max-h-[260px] overflow-auto pr-2 text-[16px] leading-relaxed text-[var(--paper-3)]" data-lenis-prevent>
                        {job.Processed_JD}
                      </p>
                    </details>
                  )}

                  <button onClick={handleViewSimilarJobs} disabled={similarLoading} className="btn btn--sun mt-8">
                    {similarLoading ? 'Finding…' : 'Find similar jobs'} <span className="arrow" aria-hidden="true">→</span>
                  </button>
                </motion.article>
              )}
            </AnimatePresence>
          </div>
        </section>
      )}
      <Toaster toastOptions={{ style: { borderRadius: 20, background: 'var(--ink)', color: 'var(--paper)', fontFamily: 'var(--serif)' } }} />
    </div>
  );
}

export default JobSearch;
