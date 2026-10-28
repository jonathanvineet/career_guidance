import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "../lib/motion";
import { jobs, CATEGORIES, categoryCounts } from "../lib/match";

// The poster's radial chart, built as a 3D field. Each dot is one job; the
// nearer the centre, the higher its cosine similarity to the visitor's skills.
// Seen from the side, good matches rise into a spire; as `progress.p` goes to 1
// the camera swings overhead and the field flattens into the printed chart.

const R = 3; // disk radius in world units
const REF = 0.3; // similarity drawn at the centre
const RINGS = [0, 0.05, 0.1, 0.15, 0.2, 0.25];
const PAPER_INK = new THREE.Color("#1b1e2b");
const SUN = new THREE.Color("#f3d23c");

const radiusFor = (s) => R * (1 - Math.sqrt(Math.min(Math.max(s, 0), REF) / REF));
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const phase = (p, a, b) => clamp01((p - a) / (b - a));
const smooth = (t) => t * t * (3 - 2 * t);

// Deterministic per-job jitter so the field is the same on every visit.
function rand(i, salt) {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// Sectors clockwise from twelve o'clock, sized by count with a floor so the
// small categories stay visible: Other, ML and AI, Data science, Engineering, Analysis.
const SECTOR_ORDER = ["Other roles", "Machine learning and AI", "Data science", "Engineering", "Analysis"];
const sectors = (() => {
  const counts = SECTOR_ORDER.map((c) => Math.max(categoryCounts[CATEGORIES.indexOf(c)], 30));
  const total = counts.reduce((a, b) => a + b, 0);
  let a = -Math.PI * 0.12;
  const out = {};
  SECTOR_ORDER.forEach((c, i) => {
    const w = (counts[i] / total) * Math.PI * 2;
    out[c] = { start: a, width: w, count: categoryCounts[CATEGORIES.indexOf(c)] };
    a += w;
  });
  return out;
})();

const angleFor = (i) => {
  const s = sectors[jobs[i].g];
  return s.start + s.width * (0.06 + 0.88 * rand(i, 1));
};

export default function JobField({ scores, top, progress, compact = false, onHover, labels = true }) {
  const mount = useRef(null);
  const api = useRef(null);
  const latest = useRef({ scores, top });
  latest.current = { scores, top };

  useEffect(() => {
    const el = mount.current;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);
    renderer.domElement.setAttribute("aria-hidden", "true");

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.up.set(0, 0, -1);
    const field = new THREE.Group();
    scene.add(field);

    // Dots
    const n = jobs.length;
    const dotGeo = new THREE.SphereGeometry(0.028, 12, 8);
    const dotMat = new THREE.MeshBasicMaterial({ color: PAPER_INK });
    const dots = new THREE.InstancedMesh(dotGeo, dotMat, n);
    dots.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    dots.renderOrder = 2;
    field.add(dots);

    // Highlighter halos behind the ten best matches
    const haloGeo = new THREE.SphereGeometry(0.16, 24, 16);
    const haloMat = new THREE.MeshBasicMaterial({ color: SUN, depthWrite: false });
    const halos = new THREE.InstancedMesh(haloGeo, haloMat, 10);
    halos.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    halos.renderOrder = 1;
    field.add(halos);

    // Similarity rings
    const ringMat = new THREE.LineBasicMaterial({ color: PAPER_INK, transparent: true, opacity: 0.16 });
    RINGS.forEach((s) => {
      const r = radiusFor(s);
      const pts = [];
      for (let k = 0; k <= 160; k++) {
        const a = (k / 160) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.sin(a) * r, 0, -Math.cos(a) * r));
      }
      field.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), ringMat));
    });

    // State: current and target positions per job
    const cur = new Float32Array(n * 3);
    const tgt = new Float32Array(n * 3);
    const sim = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const a = angleFor(i);
      cur[i * 3] = Math.sin(a) * R * 1.4;
      cur[i * 3 + 2] = -Math.cos(a) * R * 1.4;
      cur[i * 3 + 1] = (rand(i, 3) - 0.5) * 2;
    }
    let topIdx = [];

    // HTML labels laid over the canvas
    const layer = document.createElement("div");
    layer.className = "field-labels";
    el.appendChild(layer);
    const mk = (cls, text) => {
      const d = document.createElement("div");
      d.className = cls;
      d.textContent = text;
      layer.appendChild(d);
      return d;
    };
    const ringLabels = RINGS.slice(1).map((s) => mk("field-label field-label--ring", s.toFixed(2)));
    const catLabels = SECTOR_ORDER.map((c) => mk("field-label field-label--cat", `${c} · ${sectors[c].count}`));
    const numLabels = Array.from({ length: 10 }, (_, i) => mk("field-label field-label--num", String(i + 1)));

    // Sizing
    let w = 1, h = 1, distFlat = 10, distSide = 10, fovT = Math.tan(THREE.MathUtils.degToRad(16));
    const resize = () => {
      w = el.clientWidth;
      h = el.clientHeight;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = w + "px";
      renderer.domElement.style.height = h + "px";
      camera.aspect = w / h;
      const aspect = w / h;
      const half = R * (compact || aspect < 0.9 ? 1.1 : 1.16);
      distFlat = Math.max(half / fovT, half / (fovT * aspect));
      distSide = distFlat * (aspect < 0.9 ? 1.05 : 0.92);
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    // Pointer for hover and a little parallax
    const pointer = new THREE.Vector2(9, 9);
    const ndc = new THREE.Vector2();
    let pointerActive = false;
    const onMove = (e) => {
      const r = renderer.domElement.getBoundingClientRect();
      pointer.set(e.clientX - r.left, e.clientY - r.top);
      ndc.set((pointer.x / r.width) * 2 - 1, -(pointer.y / r.height) * 2 + 1);
      pointerActive = true;
    };
    const onLeave = () => {
      pointerActive = false;
      if (onHover) onHover(null);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    const raycaster = new THREE.Raycaster();
    let lastHover = -1;

    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const v = new THREE.Vector3();
    const sc = new THREE.Vector3();
    const proj = new THREE.Vector3();
    let spin = -0.5;
    let par = 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const place = (label, x, y, z, opacity, side) => {
      proj.set(x, y, z).applyMatrix4(field.matrixWorld).project(camera);
      let sx = (proj.x * 0.5 + 0.5) * w;
      // Keep category names inside the page margin
      if (side === "left") sx = Math.max(sx, label.offsetWidth + 16);
      if (side === "right") sx = Math.min(sx, w - label.offsetWidth - 16);
      const sy = (-proj.y * 0.5 + 0.5) * h;
      label.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0)`;
      label.style.opacity = opacity.toFixed(3);
      label.style.visibility = opacity < 0.01 ? "hidden" : "visible";
    };

    const tick = (time, deltaMs) => {
      const dt = Math.min(deltaMs / 1000, 0.05);
      const p = progress.current.p;
      const aspect = w / h;
      const mobile = aspect < 0.9;

      const settle = smooth(phase(p, 0.18, 0.62));
      const flat = smooth(phase(p, 0.22, 0.6));
      const reveal = smooth(phase(p, 0.55, 0.75));

      // Camera: from a low three-quarter view to straight overhead
      const theta = THREE.MathUtils.lerp(THREE.MathUtils.degToRad(64), THREE.MathUtils.degToRad(0.01), settle);
      const dist = THREE.MathUtils.lerp(distSide, distFlat, settle);
      par += ((pointerActive && !reduce ? ndc.x : 0) - par) * Math.min(1, dt * 3);
      const az = par * 0.22 * (1 - settle);
      camera.position.set(Math.sin(az) * Math.sin(theta) * dist, Math.cos(theta) * dist, Math.cos(az) * Math.sin(theta) * dist);
      const lookY = THREE.MathUtils.lerp(0.55, 0, settle);
      camera.lookAt(0, lookY, 0);

      // Frame the field: right of the hero text, then left of the ranked list
      if (compact) {
        camera.clearViewOffset();
      } else {
        const diskPx = (R / (Math.tan(THREE.MathUtils.degToRad(16)) * distFlat)) * (h / 2);
        const gutter = Math.min(Math.max(16, w * 0.04), 64);
        const flatShiftX = mobile ? 0 : gutter + diskPx - w / 2;
        const heroShiftX = mobile ? 0 : w * 0.2;
        const heroShiftY = mobile ? h * 0.24 : h * 0.04;
        const flatShiftY = mobile ? -h * 0.12 : 0;
        const sx = THREE.MathUtils.lerp(heroShiftX, flatShiftX, settle);
        const sy = THREE.MathUtils.lerp(heroShiftY, flatShiftY, settle);
        camera.setViewOffset(w, h, -sx, -sy, w, h);
      }

      // Slow turn while seen from the side, coming to rest when overhead
      if (!reduce) spin += dt * 0.09 * (1 - settle);
      field.rotation.y = spin * (1 - settle);
      field.updateMatrixWorld();

      // Ease dots toward their targets
      const k = 1 - Math.exp(-dt * 5);
      const lift = 1 - flat;
      for (let i = 0; i < n; i++) {
        const o = i * 3;
        cur[o] += (tgt[o] - cur[o]) * k;
        cur[o + 2] += (tgt[o + 2] - cur[o + 2]) * k;
        const y = tgt[o + 1] * lift;
        cur[o + 1] += (y - cur[o + 1]) * k;
        v.set(cur[o], cur[o + 1], cur[o + 2]);
        const s = topIdx.includes(i) ? 1.5 : 1;
        sc.set(s, s, s);
        m.compose(v, q, sc);
        dots.setMatrixAt(i, m);
      }
      dots.instanceMatrix.needsUpdate = true;

      topIdx.forEach((i, r) => {
        v.set(cur[i * 3], cur[i * 3 + 1], cur[i * 3 + 2]);
        const s = r === 0 ? 1.15 : 1;
        sc.set(s, s, s);
        m.compose(v, q, sc);
        halos.setMatrixAt(r, m);
      });
      halos.count = topIdx.length;
      halos.instanceMatrix.needsUpdate = true;

      // Labels
      const ringOpacity = 0.25 + 0.75 * flat;
      ringMat.opacity = 0.1 + 0.08 * flat;
      layer.style.display = labels && reveal > 0.01 ? "" : "none";
      RINGS.slice(1).forEach((s, i) => place(ringLabels[i], 0, 0, -radiusFor(s) - 0.02, reveal * ringOpacity));
      SECTOR_ORDER.forEach((c, i) => {
        const sct = sectors[c];
        const a = sct.start + sct.width / 2;
        const side = Math.sin(a) >= 0 ? "right" : "left";
        catLabels[i].dataset.side = side;
        place(catLabels[i], Math.sin(a) * (R + 0.3), 0, -Math.cos(a) * (R + 0.3), reveal, side);
      });
      numLabels.forEach((lab, r) => {
        const i = topIdx[r];
        if (i === undefined) {
          lab.style.visibility = "hidden";
          return;
        }
        place(lab, cur[i * 3], cur[i * 3 + 1], cur[i * 3 + 2], reveal);
      });

      // Hover a dot once the field lies flat
      if (onHover && pointerActive && flat > 0.9) {
        raycaster.setFromCamera(ndc, camera);
        raycaster.params.Mesh = {};
        const hit = raycaster.intersectObject(dots, false)[0] || raycaster.intersectObject(halos, false)[0];
        const idx = hit ? (hit.object === halos ? topIdx[hit.instanceId] : hit.instanceId) : -1;
        if (idx !== lastHover) {
          lastHover = idx;
          onHover(idx >= 0 ? { index: idx, x: pointer.x, y: pointer.y, score: sim[idx] } : null);
        }
      }

      renderer.render(scene, camera);
    };

    // Render only while on screen
    let running = false;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        gsap.ticker.add(tick);
        running = true;
      } else if (!entry.isIntersecting && running) {
        gsap.ticker.remove(tick);
        running = false;
      }
    });
    io.observe(el);

    api.current = {
      setScores(scores, top) {
        topIdx = top;
        for (let i = 0; i < n; i++) {
          const a = angleFor(i);
          const r = Math.max(0.12, radiusFor(scores[i]) + (rand(i, 2) - 0.5) * 0.16);
          sim[i] = scores[i];
          tgt[i * 3] = Math.sin(a) * r;
          tgt[i * 3 + 2] = -Math.cos(a) * r;
          tgt[i * 3 + 1] = Math.pow(Math.min(scores[i] / REF, 1), 1.4) * 2.6 + rand(i, 4) * 0.12;
        }
      },
    };
    api.current.setScores(latest.current.scores, latest.current.top);

    return () => {
      io.disconnect();
      ro.disconnect();
      gsap.ticker.remove(tick);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
      });
      [dotMat, haloMat, ringMat].forEach((mat) => mat.dispose());
      renderer.dispose();
      el.removeChild(renderer.domElement);
      el.removeChild(layer);
    };
  }, [progress, compact, onHover, labels]);

  useEffect(() => {
    if (api.current) api.current.setScores(scores, top);
  }, [scores, top]);

  return <div ref={mount} className="job-field" />;
}
