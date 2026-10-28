import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { API, PageHead, ResumeDrop } from '../Components/ui';
import { useReveal } from '../lib/motion';

const COUNSELLORS = [
  { value: 'counselor1', name: 'Counsellor 1', focus: 'Data, analytics and engineering careers' },
  { value: 'counselor2', name: 'Counsellor 2', focus: 'First jobs, switching fields and study plans' },
];

function Appointments() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    counselor: '',
    date: '',
    time: '',
    resume: null
  });
  const [sending, setSending] = useState(false);
  const [booked, setBooked] = useState(false);
  const ref = useReveal();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([k, v]) => v && formDataToSend.append(k, v));
    setSending(true);

    try {
      const response = await fetch(`${API}/book-appointment`, {
        method: 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        toast.success('Session booked. We will email you a confirmation.');
        setBooked(true);
      } else {
        toast.error('Failed to book appointment');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Could not reach the booking service.');
    } finally {
      setSending(false);
    }
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div ref={ref} className="frame min-h-screen pb-[clamp(96px,12vw,180px)]">
      <PageHead title="Book a" mark="counsellor.">
        Bring your matches and your profile. Attach your resume so your counsellor has read it before you sit down.
      </PageHead>

      <form onSubmit={handleSubmit} className="grid gap-x-16 gap-y-12 lg:grid-cols-[1fr_1.1fr]">
        <fieldset data-reveal className="space-y-4">
          <legend className="h-sm mb-5">Choose who you will talk to</legend>
          {COUNSELLORS.map((c) => (
            <label
              key={c.value}
              className="flex min-h-[88px] cursor-pointer items-center gap-5 px-6 py-5 transition-colors duration-200 focus-within:outline focus-within:outline-2"
              style={{ background: formData.counselor === c.value ? 'var(--sun)' : 'var(--paper-2)' }}
            >
              <input
                type="radio"
                name="counselor"
                value={c.value}
                checked={formData.counselor === c.value}
                onChange={handleChange}
                required
                className="h-5 w-5 accent-[var(--ink)]"
              />
              <span>
                <span className="block text-[22px] leading-tight">{c.name}</span>
                <span className="block text-[16px] text-[var(--ink-2)]">{c.focus}</span>
              </span>
            </label>
          ))}

          <div className="pt-6">
            <p className="mb-3 text-[17px]">Your resume (optional)</p>
            <ResumeDrop id="resume" file={formData.resume} onFile={(f) => setFormData((d) => ({ ...d, resume: f }))} />
          </div>
        </fieldset>

        <div data-reveal className="space-y-6">
          <div className="field">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" autoComplete="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" autoComplete="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="field">
              <label htmlFor="phone">Phone</label>
              <input type="tel" id="phone" name="phone" autoComplete="tel" value={formData.phone} onChange={handleChange} required />
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="field">
              <label htmlFor="date">Date</label>
              <input type="date" id="date" name="date" min={today} value={formData.date} onChange={handleChange} required />
            </div>
            <div className="field">
              <label htmlFor="time">Time</label>
              <input type="time" id="time" name="time" value={formData.time} onChange={handleChange} required />
            </div>
          </div>
          <button type="submit" className="btn w-full sm:w-auto" disabled={sending}>
            {booked ? 'Booked. Book another?' : sending ? 'Booking…' : 'Book the session'} <span className="arrow" aria-hidden="true">→</span>
          </button>
        </div>
      </form>
      <Toaster toastOptions={{ style: { borderRadius: 0, background: 'var(--ink)', color: 'var(--paper)', fontFamily: 'var(--serif)' } }} />
    </div>
  );
}

export default Appointments;
