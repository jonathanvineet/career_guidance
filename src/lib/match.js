import jobs from "../data/jobs.json";

// A browser copy of backend/job_recommender.py: TF-IDF over each job's skill
// words, cosine similarity against the visitor's skills, one row per title.

const STOP = new Set(
  "a an and are as at be by for from has in is it of on or that the to was were will with".split(" ")
);

const words = (phrases) =>
  phrases
    .join(" ")
    .toLowerCase()
    .split(/[^a-z0-9+#.]+/)
    .filter((w) => w.length > 1 && !STOP.has(w));

const docs = jobs.map((j) => words(j.k));
const df = new Map();
docs.forEach((d) => new Set(d).forEach((w) => df.set(w, (df.get(w) || 0) + 1)));
const N = docs.length;
const idf = (w) => Math.log((1 + N) / (1 + (df.get(w) || 0))) + 1;

function vector(ws) {
  const v = new Map();
  ws.forEach((w) => v.set(w, (v.get(w) || 0) + 1));
  let norm = 0;
  v.forEach((tf, w) => {
    const x = tf * idf(w);
    v.set(w, x);
    norm += x * x;
  });
  norm = Math.sqrt(norm) || 1;
  v.forEach((x, w) => v.set(w, x / norm));
  return v;
}

const jobVectors = docs.map(vector);

export const CATEGORIES = ["Data science", "Engineering", "Analysis", "Machine learning and AI", "Other roles"];

export const SAMPLE_PROFILE = [
  "python",
  "sql",
  "machine learning",
  "statistics",
  "data visualization",
  "pandas",
  "tableau",
];

export const SKILL_CHOICES = [
  ...SAMPLE_PROFILE,
  "spark",
  "aws",
  "java",
  "excel",
  "deep learning",
  "communication",
  "etl",
  "research",
];

export function scoreAll(skills) {
  const u = vector(words(skills));
  return jobVectors.map((jv) => {
    let s = 0;
    u.forEach((x, w) => {
      const y = jv.get(w);
      if (y) s += x * y;
    });
    return s;
  });
}

export function topTen(scores) {
  const order = scores.map((s, i) => i).sort((a, b) => scores[b] - scores[a]);
  const seen = new Set();
  const out = [];
  for (const i of order) {
    if (seen.has(jobs[i].t)) continue;
    seen.add(jobs[i].t);
    out.push(i);
    if (out.length === 10) break;
  }
  return out;
}

export function missingFor(job, skills) {
  const have = new Set(skills.map((s) => s.toLowerCase()));
  return job.k.filter((k) => !have.has(k));
}

export const categoryCounts = CATEGORIES.map((c) => jobs.filter((j) => j.g === c).length);

export { jobs };
