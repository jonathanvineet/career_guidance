import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { API, PageHead, ResumeDrop, Working } from '../Components/ui';
import { gsap, reducedMotion, useReveal } from '../lib/motion';

function ResumeParse() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const ref = useReveal();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('resume', selectedFile);
    setIsLoading(true);
    setSkills([]);

    fetch(`${API}/parse`, { method: 'POST', body: formData })
      .then(async (response) => {
        if (!response.ok) throw new Error('Failed to read the file.');
        const data = await response.json();
        setSkills(Array.isArray(data) ? data : []);
        if (!reducedMotion()) {
          requestAnimationFrame(() =>
            gsap.from('.found-skill', { opacity: 0, y: 14, scale: 0.9, stagger: 0.035, duration: 0.5, ease: 'back.out(2)' })
          );
        }
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
        toast.error('Could not read that resume. Is the backend running on port 8000?');
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div ref={ref} className="frame min-h-screen pb-[clamp(96px,12vw,180px)]">
      <PageHead title="Your resume," mark="read.">
        Upload it and CareerGAIde lists every skill it finds, even on a scanned page.
      </PageHead>

      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
        <form data-reveal onSubmit={handleSubmit}>
          <ResumeDrop id="resume-upload" file={selectedFile} onFile={setSelectedFile} />
          <button className="btn mt-6" type="submit" disabled={isLoading || !selectedFile}>
            {isLoading ? 'Reading…' : 'Find my skills'} <span className="arrow" aria-hidden="true">→</span>
          </button>
          {isLoading && <Working label="Reading the page and checking every phrase against the skills list" />}
        </form>

        <section data-reveal aria-labelledby="skills-title" className="bg-[var(--paper-2)] p-[clamp(24px,3vw,40px)]">
          <h2 id="skills-title" className="h-md">
            {skills.length ? `${skills.length} skills found` : 'Skills found'}
          </h2>
          {skills.length > 0 ? (
            <>
              <div className="mt-6 flex flex-wrap gap-[6px]">
                {skills.map((skill, index) => (
                  <span key={index} className="chip found-skill">
                    {skill}
                  </span>
                ))}
              </div>
              <Link to="/jobs" className="btn mt-10">
                Match these to jobs <span className="arrow" aria-hidden="true">→</span>
              </Link>
            </>
          ) : (
            <p className="mt-4 max-w-[36ch] text-[var(--ink-2)]">
              Your skills appear here, highlighted the way you would mark them on paper.
            </p>
          )}
        </section>
      </div>
      <Toaster toastOptions={{ style: { borderRadius: 0, background: 'var(--ink)', color: 'var(--paper)', fontFamily: 'var(--serif)' } }} />
    </div>
  );
}

export default ResumeParse;
