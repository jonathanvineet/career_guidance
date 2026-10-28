import { Link } from "react-router-dom";
import { navOptions } from "../Constants";
import { useReveal } from "../lib/motion";

const facts = [
    ["Project", "career_guidance"],
    ["Built with", "React 18, Flask 3, Tailwind"],
    ["Matching", "scikit-learn TF-IDF, cosine"],
    ["Parsing", "PyMuPDF, Tesseract OCR"],
];

const credits = [
    ["Douglas Lockwood at his desk", "https://commons.wikimedia.org/wiki/File:Douglas_Lockwood_at_his_desk.tif", "Douglas Lockwood", "public domain"],
    ["Hollerith Punched Card", "https://commons.wikimedia.org/wiki/File:Hollerith_Punched_Card.jpg", null, "public domain"],
    ["Miss Cowell with Hollerith Machine, 1964", "https://commons.wikimedia.org/wiki/File:Miss_Cowell_with_Hollerith_Machine,_1964.jpg", null, "no known copyright restrictions"],
    ["IBM Type 80 Card Sorter at CHM", "https://commons.wikimedia.org/wiki/File:IBM_Type_80_Card_Sorter_at_CHM.jpg", "Tomwsulcer", "CC0"],
];

function Footer() {
    const ref = useReveal();
    return (
        <footer ref={ref} className="overflow-hidden bg-[var(--ink)] pt-24 text-[var(--paper)] sm:pt-32">
            <div className="frame">
                <div className="grid gap-12 md:grid-cols-[1.2fr_1fr]">
                    <p data-reveal className="max-w-[22ch] text-[clamp(24px,2.4vw,34px)] leading-[1.1] tracking-[-0.02em]">
                        Read your resume, rank real jobs, and learn the skills between them.
                    </p>
                    <nav data-reveal aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-3 self-end text-[19px]">
                        {navOptions.map((o) => (
                            <Link key={o.routePath} to={o.routePath} className="link link--light w-fit">
                                {o.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                <dl data-reveal className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-4">
                    {facts.map(([k, v]) => (
                        <div key={k}>
                            <dt className="text-[15px] text-[var(--ink-3)]">{k}</dt>
                            <dd className="data mt-1 !text-[var(--paper)]">{v}</dd>
                        </div>
                    ))}
                </dl>
                <p data-reveal className="mt-14 max-w-[110ch] text-[15px] leading-relaxed text-[var(--paper-3)]">
                    Pictures, via Wikimedia Commons:{" "}
                    {credits.map(([title, href, by, lic], i) => (
                        <span key={href}>
                            <a href={href} className="underline underline-offset-2 hover:text-[var(--sun)]">{title}</a>
                            {by && ` by ${by}`}, {lic}
                            {i < credits.length - 1 ? "; " : "."}
                        </span>
                    ))}
                </p>
            </div>

            <p
                data-reveal
                aria-hidden="true"
                className="display mt-16 select-none whitespace-nowrap text-center text-[19.5vw] leading-[0.78] tracking-[-0.055em] text-[var(--sun)]"
                style={{ marginBottom: "-0.12em" }}
            >
                CareerGAIde
            </p>
        </footer>
    );
}

export default Footer;
