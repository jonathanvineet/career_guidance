import { useState } from "react";

export const API = "http://127.0.0.1:8000";

export function PageHead({ title, mark, children }) {
    return (
        <div className="pb-12 pt-[clamp(128px,18vh,200px)]">
            <h1 className="display h-lg max-w-[16ch]">
                <span data-reveal className="block">
                    {title} {mark && <span data-mark="0.4" className="mark italic">{mark}</span>}
                </span>
            </h1>
            {children && (
                <p data-reveal className="lede mt-6 max-w-[48ch]">
                    {children}
                </p>
            )}
        </div>
    );
}

export function ResumeDrop({ id, file, onFile }) {
    const [over, setOver] = useState(false);
    const take = (f) => f && onFile(f);
    return (
        <label
            htmlFor={id}
            className="drop"
            data-over={over}
            onDragOver={(e) => {
                e.preventDefault();
                setOver(true);
            }}
            onDragLeave={() => setOver(false)}
            onDrop={(e) => {
                e.preventDefault();
                setOver(false);
                take(e.dataTransfer.files[0]);
            }}
        >
            <input
                id={id}
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="sr-only"
                aria-describedby={`${id}-hint`}
                onChange={(e) => take(e.target.files[0])}
            />
            <span>
                <span className="block text-[clamp(26px,2.6vw,38px)] leading-tight tracking-[-0.015em]">
                    {file ? file.name : "Drop your resume here, or choose a file"}
                </span>
                <span id={`${id}-hint`} className="mt-3 block text-[16px] text-[var(--ink-2)]">
                    PDF, DOCX, JPG or PNG. Scanned pages are read with OCR.
                </span>
            </span>
        </label>
    );
}

export function Working({ label }) {
    return (
        <div className="mt-10" role="status" aria-live="polite">
            <p className="mb-3 text-[19px]">{label}</p>
            <div className="scan" />
        </div>
    );
}
