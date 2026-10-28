import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import JobField from "../Components/JobField";
import { jobs, SAMPLE_PROFILE, SKILL_CHOICES, scoreAll, topTen, missingFor } from "../lib/match";
import { gsap, reducedMotion, useReveal } from "../lib/motion";

const fmt = (s) => s.toFixed(2);

function RankedList({ top, scores, compact }) {
    return (
        <ol className={compact ? "space-y-3" : "space-y-[clamp(6px,1.1vh,14px)]"}>
            <AnimatePresence initial={false}>
                {top.map((i, r) => (
                    <motion.li
                        key={jobs[i].t}
                        layout
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16, transition: { duration: 0.2 } }}
                        transition={{ type: "spring", stiffness: 380, damping: 36 }}
                        className="grid grid-cols-[28px_1fr] items-baseline"
                    >
                        <span className="data tnum !text-[var(--ink)]">{r + 1}</span>
                        <span>
                            <span className="block text-[clamp(18px,1.45vw,22px)] leading-[1.15]">{jobs[i].t}</span>
                            <span className="data block">
                                {jobs[i].c} · {fmt(scores[i])}
                            </span>
                        </span>
                    </motion.li>
                ))}
            </AnimatePresence>
        </ol>
    );
}

function SkillToggles({ skills, setSkills }) {
    const toggle = (s) =>
        setSkills((cur) => (cur.includes(s) ? (cur.length > 1 ? cur.filter((x) => x !== s) : cur) : [...cur, s]));
    return (
        <div>
            <p className="mb-3 text-[17px]">Change the profile and watch the jobs move</p>
            <div className="flex flex-wrap gap-[6px]">
                {SKILL_CHOICES.map((s) => (
                    <button
                        key={s}
                        type="button"
                        className={`chip ${skills.includes(s) ? "" : "chip--off"}`}
                        aria-pressed={skills.includes(s)}
                        onClick={() => toggle(s)}
                    >
                        {s}
                    </button>
                ))}
            </div>
        </div>
    );
}

// The first screen and the field it opens into: one sticky stage, scrubbed by scroll.
function FieldStage() {
    const wrap = useRef(null);
    const heroRef = useRef(null);
    const panelRef = useRef(null);
    const captionRef = useRef(null);
    const progress = useRef({ p: 0 });
    const [skills, setSkills] = useState(SAMPLE_PROFILE);
    const [hover, setHover] = useState(null);
    const scores = useMemo(() => scoreAll(skills), [skills]);
    const top = useMemo(() => topTen(scores), [scores]);
    const onHover = useCallback((h) => setHover(h), []);
    const [reduce] = useState(reducedMotion);
    const flatProgress = useRef({ p: 1 });

    useLayoutEffect(() => {
        if (reduce) return;
        const ctx = gsap.context(() => {
            gsap.timeline({ defaults: { ease: "power3.out" } })
                .from("[data-hero-line]", { yPercent: 105, duration: 0.85, stagger: 0.1 }, 0)
                .fromTo("[data-hero-mark]", { "--mark": 0 }, { "--mark": 1, duration: 0.6, ease: "power2.inOut" }, 0.5)
                .from("[data-hero-in]", { y: 20, opacity: 0, duration: 0.7, stagger: 0.07 }, 0.3)
                .from(".job-field canvas", { opacity: 0, scale: 0.96, duration: 1.4, ease: "power2.out" }, 0);

            gsap.timeline({
                defaults: { ease: "none" },
                scrollTrigger: {
                    trigger: wrap.current,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: true,
                    onUpdate: (self) => (progress.current.p = self.progress),
                },
            })
                .to(heroRef.current, { autoAlpha: 0, y: -90, duration: 0.16 }, 0.1)
                .fromTo(captionRef.current, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.12 }, 0.52)
                .fromTo(panelRef.current, { autoAlpha: 0, x: 48 }, { autoAlpha: 1, x: 0, duration: 0.16 }, 0.56)
                .set({}, {}, 1);
        });
        return () => ctx.revert();
    }, [reduce]);

    const caption = (ref, hidden) => (
        <p
            ref={ref}
            className={`data pointer-events-none absolute left-[var(--gutter)] top-[88px] max-w-[46ch] max-md:right-[var(--gutter)] ${hidden ? "invisible opacity-0" : ""}`}
        >
            Each dot is one job. Nearer the centre, higher cosine similarity of TF-IDF vectors.
        </p>
    );
    const panel = (ref, hidden) => (
        <div
            ref={ref}
            className={`absolute bottom-6 right-[var(--gutter)] max-md:left-[var(--gutter)] md:bottom-auto md:top-1/2 md:w-[min(430px,34vw)] md:-translate-y-1/2 ${hidden ? "invisible opacity-0" : ""}`}
        >
            <h2 className="h-sm mb-5 hidden md:block">Top ten distinct titles</h2>
            <div className="hidden md:block">
                <RankedList top={top} scores={scores} />
            </div>
            <div className="mt-8 max-md:mt-0">
                <SkillToggles skills={skills} setSkills={setSkills} />
            </div>
        </div>
    );
    const tooltip = hover && (
        <div
            className="pointer-events-none absolute z-10 max-w-[280px] rounded-[var(--r-sm)] bg-[var(--ink)] px-4 py-3 text-[var(--paper)]"
            style={{ left: hover.x + 14, top: hover.y + 14 }}
            role="status"
        >
            <span className="block text-[17px] leading-tight">{jobs[hover.index].t}</span>
            <span className="data block !text-[var(--paper-3)]">
                {jobs[hover.index].c} · {fmt(hover.score)}
            </span>
        </div>
    );

    return (
        <>
            <section ref={wrap} className={`relative ${reduce ? "h-[100svh]" : "h-[400svh]"}`} aria-labelledby="hero-title">
                <div className="sticky top-0 h-[100svh] overflow-hidden">
                    <div className="absolute inset-0">
                        <JobField scores={scores} top={top} progress={progress} onHover={reduce ? undefined : onHover} labels={!reduce} />
                    </div>

                    {/* First screen */}
                    <div ref={heroRef} className="pointer-events-none absolute inset-0">
                        <div className="frame flex h-full flex-col pt-[clamp(96px,16vh,170px)] md:justify-center md:pt-0">
                            <h1 id="hero-title" className="display pointer-events-auto w-fit text-[clamp(60px,8.6vw,140px)]">
                                <span className="block overflow-hidden pb-[0.06em]">
                                    <span data-hero-line className="block">Your skills,</span>
                                </span>
                                <span className="block overflow-hidden pb-[0.1em]">
                                    <span data-hero-line className="block italic">
                                        <span data-hero-mark className="mark">matched.</span>
                                    </span>
                                </span>
                            </h1>
                            <p data-hero-in className="lede pointer-events-auto mt-8 max-w-[36ch] !text-[var(--ink)] md:max-w-[40ch]">
                                CareerGAIde reads your resume, ranks 604 real jobs by how well you fit, and turns the gap into a list of skills to learn.
                            </p>
                            <div data-hero-in className="pointer-events-auto mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                                <Link to="/jobs" className="btn">
                                    Match my resume <span className="arrow" aria-hidden="true">→</span>
                                </Link>
                                <Link to="/quiz" className="link text-[19px]">
                                    Take the personality test
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* The field, lying flat */}
                    {!reduce && caption(captionRef, true)}
                    {!reduce && panel(panelRef, true)}
                    {!reduce && tooltip}
                </div>
            </section>

            {/* Reduced motion: the flat chart is its own still section */}
            {reduce && (
                <section className="relative h-[100svh] overflow-hidden" aria-label="Top ten distinct titles">
                    <div className="absolute inset-0">
                        <JobField scores={scores} top={top} progress={flatProgress} onHover={onHover} />
                    </div>
                    {caption(null, false)}
                    {panel(null, false)}
                    {tooltip}
                </section>
            )}

            {/* The phone shows the list below the stage */}
            <section className="frame pb-8 pt-16 md:hidden" aria-labelledby="top-ten-m">
                <h2 id="top-ten-m" className="h-md mb-8">
                    Top ten distinct titles
                </h2>
                <RankedList top={top} scores={scores} compact />
            </section>
        </>
    );
}

const RESUME_SKILLS = ["python", "sql", "statistics", "tableau", "pandas", "machine learning", "data visualization"];

function ResumeFragment() {
    const ref = useRef(null);
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const marks = gsap.utils.toArray(".hl", ref.current);
            if (reducedMotion()) return;
            gsap.fromTo(
                marks,
                { "--mark": 0 },
                {
                    "--mark": 1,
                    ease: "none",
                    stagger: 0.25,
                    scrollTrigger: { trigger: ref.current, start: "top 75%", end: "bottom 55%", scrub: 0.5 },
                }
            );
            gsap.from(".found .chip", {
                opacity: 0,
                y: 12,
                stagger: 0.05,
                duration: 0.5,
                ease: "back.out(2)",
                scrollTrigger: { trigger: ".found", start: "top 85%", once: true },
            });
        }, ref);
        return () => ctx.revert();
    }, []);
    const hl = (t) => <span className="hl mark">{t}</span>;
    return (
        <div ref={ref} data-ui className="grid gap-4 sm:grid-cols-[1.35fr_1fr]">
            <div className="rounded-[var(--r-lg)] bg-[#faf8f3] p-[clamp(20px,3vw,40px)] text-[16px] leading-[1.6]">
                <p className="text-[26px] leading-tight tracking-[-0.01em]">Asha Menon</p>
                <p className="text-[var(--ink-2)]">Junior data analyst · Kochi</p>
                <p className="mt-6 font-medium">Experience</p>
                <p className="mt-1">
                    Built weekly sales dashboards in {hl("tableau")} from a {hl("sql")} warehouse, and cleaned survey exports with {hl("python")} and {hl("pandas")}.
                </p>
                <p className="mt-3">
                    Used {hl("statistics")} to test campaign uplift; trained a first {hl("machine learning")} model to flag churn.
                </p>
                <p className="mt-6 font-medium">Projects</p>
                <p className="mt-1">Rainfall and crop yields, a {hl("data visualization")} for a district office.</p>
            </div>
            <div className="found flex flex-col justify-end rounded-[var(--r-lg)] bg-[var(--paper-2)] p-[clamp(20px,3vw,32px)]">
                <p className="text-[17px]">Skills found</p>
                <div className="mt-3 flex flex-wrap gap-[6px]">
                    {RESUME_SKILLS.map((s) => (
                        <span key={s} className="chip">
                            {s}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

function GapFragment() {
    const scores = useMemo(() => scoreAll(SAMPLE_PROFILE), []);
    const best = topTen(scores)[0];
    const job = jobs[best];
    const missing = missingFor(job, SAMPLE_PROFILE).filter((k) => k.length > 2);
    const have = job.k.filter((k) => SAMPLE_PROFILE.includes(k));
    return (
        <div data-ui className="rounded-[var(--r-lg)] bg-[var(--ink)] p-[clamp(20px,3vw,40px)] text-[var(--paper)]">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <p className="text-[clamp(26px,2.4vw,34px)] leading-tight tracking-[-0.015em]">{job.t}</p>
                <p className="data tnum !text-[var(--sun)]">match {fmt(scores[best])}</p>
            </div>
            <p className="data !text-[var(--paper-3)]">
                {job.c} · {job.l}
                {job.s ? ` · $${job.s.toLocaleString("en-US")}` : ""}
            </p>
            <p className="mt-8 text-[17px]">You have</p>
            <div className="mt-2 flex flex-wrap gap-[6px]" data-reveal-group>
                {have.map((s) => (
                    <span data-reveal key={s} className="chip">
                        {s}
                    </span>
                ))}
            </div>
            <p className="mt-6 text-[17px]">To learn</p>
            <div className="mt-2 flex flex-wrap gap-[6px]" data-reveal-group>
                {missing.slice(0, 22).map((s) => (
                    <span data-reveal key={s} className="chip chip--dark">
                        {s}
                    </span>
                ))}
            </div>
        </div>
    );
}

function PersonalityFragment() {
    const [pick, setPick] = useState(null);
    const answers = ["Yep, that is me", "I have no idea", "Nah, that can't be me"];
    return (
        <div data-ui className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[var(--r-lg)] bg-[var(--paper-2)] p-[clamp(20px,3vw,36px)]">
                <p className="data">Question 3 of 40</p>
                <p className="mt-3 text-[clamp(24px,2.2vw,32px)] leading-[1.15] tracking-[-0.015em]">I like to try things out myself.</p>
                <div className="mt-6 flex flex-col gap-2" role="group" aria-label="Sample answers">
                    {answers.map((a, i) => (
                        <button
                            key={a}
                            type="button"
                            onClick={() => setPick(i)}
                            aria-pressed={pick === i}
                            className="min-h-[48px] rounded-[var(--r-pill)] px-5 text-left text-[18px] transition-[background-color,transform] duration-200 hover:-translate-y-[1px] active:scale-[0.99]"
                            style={{ background: pick === i ? "var(--sun)" : "var(--paper)" }}
                        >
                            {a}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex flex-col justify-between rounded-[var(--r-lg)] bg-[var(--sun)] p-[clamp(20px,3vw,36px)]">
                <p className="data !text-[var(--ink)]">A result</p>
                <div>
                    <p className="display text-[clamp(64px,7vw,112px)]">INTJ</p>
                    <p className="mt-2 text-[20px] leading-snug">The Mastermind. Decisive and insightful; consider architecture or engineering.</p>
                </div>
            </div>
        </div>
    );
}

function Reasons() {
    const ref = useReveal();
    const rows = [
        {
            id: "resume",
            title: "Starts from your resume",
            body: "Even a scanned one: OCR reads the page and pulls out your skills, so you never fill in a form about yourself.",
            link: ["/parse", "Read my resume"],
            frag: <ResumeFragment />,
        },
        {
            id: "gap",
            title: "Shows what you are missing",
            body: "Each matched job lists the skills it asks for that you do not have yet. This is the real top match for the sample profile.",
            link: ["/jobs", "See my matches"],
            frag: <GapFragment />,
        },
        {
            id: "personality",
            title: "Skills and personality together",
            body: "Job matches, a 40-question profile and a counsellor booking in one place, so the list of jobs comes with a sense of which ones suit you.",
            link: ["/quiz", "Start the test"],
            frag: <PersonalityFragment />,
        },
    ];
    return (
        <div ref={ref} className="frame space-y-[clamp(120px,14vw,200px)] py-[clamp(120px,14vw,200px)]">
            {rows.map((r, i) => (
                <section
                    key={r.id}
                    data-reveal-group
                    aria-labelledby={`why-${r.id}`}
                    className={`grid items-center gap-10 lg:gap-16 ${i % 2 ? "lg:grid-cols-[1.3fr_1fr]" : "lg:grid-cols-[1fr_1.3fr]"}`}
                >
                    <div className={i % 2 ? "lg:order-2" : ""}>
                        <h2 id={`why-${r.id}`} data-reveal className="display h-md !text-[clamp(38px,4.4vw,72px)] !leading-[0.98]">
                            {r.title}
                        </h2>
                        <p data-reveal className="mt-6 max-w-[42ch] text-[clamp(18px,1.4vw,21px)]">
                            {r.body}
                        </p>
                        <Link data-reveal to={r.link[0]} className="btn btn--ghost mt-8">
                            {r.link[1]} <span className="arrow" aria-hidden="true">→</span>
                        </Link>
                    </div>
                    <div data-reveal>{r.frag}</div>
                </section>
            ))}
        </div>
    );
}

const STEPS = [
    {
        word: "Read",
        body: "Your resume is read as text with PyMuPDF. Scanned pages go through Tesseract OCR first, so a photo of a printed CV works too.",
        fact: "PDF, DOCX, JPG or PNG",
        img: "/assets/read-desk.jpg",
        alt: "A man at a typewriter on a cluttered desk, 1950",
        caption: "Douglas Lockwood at his desk, 1950",
    },
    {
        word: "Extract",
        body: "Every phrase is checked against a list of skills, from python and sql to communication and research.",
        fact: SAMPLE_PROFILE.join(" · "),
        img: "/assets/extract-card.jpg",
        alt: "A Hollerith punched card with holes punched in its columns",
        caption: "Hollerith punched card, 1895",
    },
    {
        word: "Weigh",
        body: "Each of 604 job listings becomes a TF-IDF vector. Skills every job asks for count for little; rare ones count for more.",
        fact: "604 listings · 5 fields",
        img: "/assets/weigh-hollerith.jpg",
        alt: "A woman feeding cards into a Hollerith tabulating machine",
        caption: "Miss Cowell with a Hollerith machine, 1964",
    },
    {
        word: "Rank",
        body: "Cosine similarity puts the jobs in order. You see the ten best distinct titles, and what each asks for that you don't have yet.",
        fact: "Top score for the sample profile: 0.27",
        img: "/assets/rank-sorter.jpg",
        alt: "An IBM Type 80 card sorter with its row of sorting pockets",
        caption: "IBM Type 80 card sorter, 1925",
    },
];

function Method() {
    const wrap = useRef(null);
    const track = useRef(null);
    useLayoutEffect(() => {
        const mm = gsap.matchMedia();
        mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
            const dist = () => track.current.scrollWidth - track.current.parentElement.clientWidth;
            const slide = gsap.to(track.current, {
                x: () => -dist(),
                ease: "none",
                scrollTrigger: { trigger: wrap.current, start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true },
            });
            gsap.utils.toArray("[data-step-img]", track.current).forEach((el) => {
                gsap.fromTo(
                    el,
                    { scale: 1.18, xPercent: -6 },
                    {
                        scale: 1.02,
                        xPercent: 0,
                        ease: "none",
                        scrollTrigger: { trigger: el, containerAnimation: slide, start: "left right", end: "right left", scrub: true },
                    }
                );
            });
            gsap.utils.toArray("[data-step-word]", track.current).forEach((el) => {
                gsap.from(el, {
                    yPercent: 30,
                    opacity: 0.15,
                    ease: "none",
                    scrollTrigger: {
                        trigger: el,
                        containerAnimation: slide,
                        start: "left 95%",
                        end: "left 55%",
                        scrub: true,
                    },
                });
            });
        });
        return () => mm.revert();
    }, []);

    return (
        <section ref={wrap} aria-labelledby="method-title" className="relative mx-[clamp(8px,1vw,16px)] rounded-[var(--r-xl)] bg-[var(--paper-2)] lg:h-[280vh]">
            <div className="lg:sticky lg:top-0 lg:flex lg:h-[100svh] lg:flex-col lg:overflow-hidden">
                <div className="frame pb-10 pt-[clamp(96px,12vh,140px)] lg:pb-0">
                    <h2 id="method-title" className="display h-lg">
                        How a match is made
                    </h2>
                </div>
                <div className="lg:mx-[var(--gutter)] lg:flex lg:flex-1 lg:overflow-hidden">
                    <div ref={track} className="flex flex-col lg:flex-row lg:items-center lg:will-change-transform">
                        {STEPS.map((s, i) => (
                            <article
                                key={s.word}
                                className={`grid shrink-0 items-center gap-8 px-[var(--gutter)] py-14 lg:h-full lg:w-[78vw] lg:grid-cols-[1fr_1.05fr] lg:gap-[4vw] lg:px-[3vw] lg:py-0 ${
                                    i === STEPS.length - 1 ? "rounded-[var(--r-xl)] bg-[var(--sun)]" : ""
                                }`}
                            >
                                <div>
                                    <h3 data-step-word className="display text-[clamp(64px,9vw,156px)]">
                                        {s.word}.
                                    </h3>
                                    <p className="mt-6 max-w-[38ch] text-[clamp(19px,1.5vw,23px)] leading-[1.4]">{s.body}</p>
                                    <p className="data mt-6 !text-[var(--ink)]">{s.fact}</p>
                                </div>
                                <figure>
                                    <div className="overflow-hidden rounded-[var(--r-md)]">
                                        <img
                                            data-step-img
                                            src={s.img}
                                            alt={s.alt}
                                            className="aspect-[4/3] w-full object-cover grayscale mix-blend-multiply lg:max-h-[56svh]"
                                        />
                                    </div>
                                    <figcaption className="mt-3 text-[15px] text-[var(--ink-2)]">{s.caption}</figcaption>
                                </figure>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function Counsellor() {
    const ref = useReveal();
    return (
        <section ref={ref} aria-labelledby="counsel-title" className="frame grid gap-14 py-[clamp(120px,14vw,200px)] lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <div>
                <h2 id="counsel-title" data-reveal className="display h-lg max-w-[14ch]">
                    Talk it through with a counsellor
                </h2>
                <p data-reveal className="mt-6 max-w-[44ch] text-[clamp(18px,1.4vw,21px)]">
                    Bring your matches and your profile to a session. Pick a counsellor, a date and a time, and attach your resume so they have read it first.
                </p>
                <Link data-reveal to="/appoinments" className="btn mt-8">
                    Book a session <span className="arrow" aria-hidden="true">→</span>
                </Link>
            </div>
            <div data-reveal-group className="space-y-3">
                <p data-reveal className="text-[17px]">Built towards two UN Sustainable Development Goals</p>
                {[
                    ["4", "var(--sdg4)", "Quality Education", "Target 4.4, skills for decent jobs"],
                    ["8", "var(--sdg8)", "Decent Work and Economic Growth", "Target 8.6, youth in work and training"],
                ].map(([n, c, t, d]) => (
                    <div data-reveal key={n} className="grid grid-cols-[88px_1fr] items-stretch overflow-hidden rounded-[var(--r-md)] bg-[var(--paper-2)]">
                        <div className="grid place-items-center text-[var(--paper)]" style={{ background: c }}>
                            <span className="text-center leading-none">
                                <span className="block text-[44px] font-semibold">{n}</span>
                                <span className="data !text-[11px] !text-[var(--paper)]">SDG</span>
                            </span>
                        </div>
                        <div className="p-5">
                            <p className="text-[21px] leading-tight">{t}</p>
                            <p className="mt-1 text-[16px] text-[var(--ink-2)]">{d}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

function Home() {
    return (
        <>
            <FieldStage />
            <Reasons />
            <Method />
            <Counsellor />
        </>
    );
}

export default Home;
