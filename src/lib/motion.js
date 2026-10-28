import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let lenis = null;

// One Lenis instance for the whole app, driven by GSAP's ticker so that
// ScrollTrigger scrubs and the smooth scroll share a single frame.
export function useSmoothScroll() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (reducedMotion()) return;
    lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1 });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenis = null;
    };
  }, []);

  useEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);
}

export function scrollToEl(el) {
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -24 });
  else el.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth" });
}

// Staggered entrance for every [data-reveal] child of the returned ref:
// heading, then text, then picture, rising 24px, once, as the block enters.
export function useReveal(deps = []) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || reducedMotion()) return;
    const ctx = gsap.context(() => {
      // Each [data-reveal-group] staggers its own items; the rest belong to root.
      const owner = (el) => root.contains(el.closest("[data-reveal-group]")) ? el.closest("[data-reveal-group]") : root;
      const groups = [root, ...root.querySelectorAll("[data-reveal-group]")];
      groups.forEach((group) => {
        const items = [...group.querySelectorAll("[data-reveal]")].filter((el) => owner(el) === group);
        if (!items.length) return;
        gsap.from(items, {
          y: 24,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.075,
          scrollTrigger: { trigger: group, start: "top 82%", once: true },
        });
      });
      root.querySelectorAll("[data-mark]").forEach((el) => {
        gsap.fromTo(
          el,
          { "--mark": 0 },
          {
            "--mark": 1,
            duration: 0.9,
            ease: "power2.inOut",
            delay: parseFloat(el.dataset.mark) || 0,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }
        );
      });
    }, root);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

export { gsap, ScrollTrigger };
