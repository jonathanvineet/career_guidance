import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import quizQuestions from '../Components/quizQuestions'
import { AXES, BRIGGS, COLORS, LETTERS } from '../Components/quizResults'
import { PageHead } from '../Components/ui'
import { useReveal } from '../lib/motion'

const startCounts = () => ({
  Colors: { Green: 10, Brown: 10, Blue: 10, Red: 10 },
  Letters: { A: 10, B: 10, C: 10, D: 10 },
  Briggs: { E: 5, I: 5, S: 5, N: 5, T: 5, F: 5, J: 5, P: 5 },
})

// Same scoring as quiz_components/Question.js: an answer type "J,Brown,D" adds
// one to each; a trailing ",No" takes one away; a blank answer changes nothing.
function apply(counts, type) {
  const parts = type.split(',')
  const step = parts.length === 4 ? -1 : parts.length === 3 ? 1 : 0
  if (!step) return counts
  const next = JSON.parse(JSON.stringify(counts))
  next.Briggs[parts[0]] += step
  next.Colors[parts[1]] += step
  next.Letters[parts[2]] += step
  return next
}

const top = (group) => Object.keys(group).reduce((a, b) => (group[b] > group[a] ? b : a))

function results(c) {
  const b = c.Briggs
  const briggs = (b.E >= b.I ? 'E' : 'I') + (b.S >= b.N ? 'S' : 'N') + (b.T >= b.F ? 'T' : 'F') + (b.J >= b.P ? 'J' : 'P')
  return { briggs, color: top(c.Colors), letter: top(c.Letters) }
}

const tidy = (s) => s.charAt(0) + s.slice(1).toLowerCase().replace(/!/g, '')

function Quiz() {
  const [step, setStep] = useState(-1)
  const [counts, setCounts] = useState(startCounts)
  const [picked, setPicked] = useState(null)
  const ref = useReveal([step === -1])
  const total = quizQuestions.length
  const done = step >= total

  const answer = (a, i) => {
    if (picked !== null) return
    setPicked(i)
    setCounts((c) => apply(c, a.type))
    setTimeout(() => {
      setPicked(null)
      setStep((s) => s + 1)
    }, 420)
  }

  const restart = () => {
    setCounts(startCounts())
    setStep(0)
  }

  if (step === -1) {
    return (
      <div ref={ref} className="frame min-h-screen pb-[clamp(96px,12vw,180px)]">
        <PageHead title="Your personality," mark="profiled.">
          Forty short statements. Answer with your first instinct; there are no right answers, and it takes about five minutes.
        </PageHead>
        <div data-reveal className="grid gap-4 sm:grid-cols-3">
          {[
            ['Four letters', 'Where you draw energy, how you take in the world, how you decide and how you plan.'],
            ['A colour', 'Builder, Planner, Relater or Adventurer: what you enjoy doing most.'],
            ['A type', 'A, B, C or D: what you need around you to do your best work.'],
          ].map(([t, d], i) => (
            <div key={t} className={`rounded-[var(--r-lg)] p-7 ${i === 0 ? 'bg-[var(--sun)]' : 'bg-[var(--paper-2)]'}`}>
              <h2 className="h-sm">{t}</h2>
              <p className="mt-2 text-[17px]">{d}</p>
            </div>
          ))}
        </div>
        <button data-reveal className="btn mt-10" onClick={() => setStep(0)}>
          Start the test <span className="arrow" aria-hidden="true">→</span>
        </button>
      </div>
    )
  }

  if (done) {
    const r = results(counts)
    const [nick, traits, jobsFor] = BRIGGS[r.briggs]
    return (
      <div className="frame min-h-screen pb-[clamp(96px,12vw,180px)] pt-[clamp(128px,18vh,200px)]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
          <h1 className="display text-[clamp(96px,20vw,320px)] leading-[0.8]">
            <span className="mark">{r.briggs}</span>
          </h1>
          <p className="mt-6 text-[clamp(28px,3vw,44px)] leading-tight tracking-[-0.02em]">
            {nick}. You tend to be {traits}; consider work in {jobsFor}.
          </p>
          <p className="data mt-3 !text-[var(--ink)]">{r.briggs.split('').map((l) => AXES[l]).join(' · ')}</p>
        </motion.div>

        <div className="mt-16 grid gap-4 md:grid-cols-2">
          <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} className="rounded-[var(--r-lg)] bg-[var(--paper-2)] p-8">
            <h2 className="h-md">{r.color}: the {COLORS[r.color].name}</h2>
            <p className="mt-4 text-[18px]">{COLORS[r.color].text}</p>
          </motion.section>
          <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }} className="rounded-[var(--r-lg)] bg-[var(--ink)] p-8 text-[var(--paper)]">
            <h2 className="h-md">Type {r.letter}</h2>
            <p className="mt-4 text-[18px]">{LETTERS[r.letter]}</p>
          </motion.section>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link to="/jobs" className="btn">
            Now match my resume <span className="arrow" aria-hidden="true">→</span>
          </Link>
          <Link to="/appoinments" className="btn btn--ghost">Talk to a counsellor</Link>
          <button className="link text-[19px]" onClick={restart}>Take it again</button>
        </div>
      </div>
    )
  }

  const q = quizQuestions[step]
  return (
    <div className="frame flex min-h-[100svh] flex-col pb-16 pt-[clamp(110px,16vh,180px)]">
      <div className="flex items-baseline justify-between gap-4">
        <p className="data tnum !text-[var(--ink)]" aria-live="polite">
          Question {step + 1} of {total}
        </p>
        {step > 0 && (
          <button className="link text-[17px]" onClick={() => setStep(-1)}>Start over</button>
        )}
      </div>
      <div className="mt-3 h-[6px] overflow-hidden rounded-[var(--r-pill)] bg-[var(--paper-2)]" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={step}>
        <motion.div className="h-full rounded-[var(--r-pill)] bg-[var(--ink)]" animate={{ width: `${(step / total) * 100}%` }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-1 flex-col justify-center py-12"
        >
          <h1 className="display h-lg max-w-[18ch] !leading-[1]">{q.question}</h1>
          <div className="mt-12 grid gap-3 md:grid-cols-3" role="group" aria-label="Answers">
            {q.answers.map((a, i) => (
              <button
                key={i}
                onClick={() => answer(a, i)}
                className="min-h-[72px] rounded-[var(--r-md)] px-6 py-5 text-left text-[clamp(19px,1.6vw,23px)] transition-[background-color,transform] duration-200 hover:-translate-y-[2px] active:scale-[0.99]"
                style={{ background: picked === i ? 'var(--sun)' : i === 1 ? 'var(--paper-2)' : 'var(--paper-3)' }}
              >
                {tidy(a.content)}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default Quiz
