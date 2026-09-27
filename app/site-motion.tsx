"use client";

import { useLayoutEffect, useRef } from "react";

export default function SiteMotion() {
  const loaderRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const loader = loaderRef.current;
    if (!loader) return;

    const root = document.documentElement;
    const body = document.body;
    const previousBodyOverflow = body.style.overflow;
    const previousHtmlOverflow = root.style.overflow;

    body.style.overflow = "hidden";
    root.style.overflow = "hidden";
    body.classList.add("motion-enabled");

    let active = true;
    let cleanupMotion = () => {};
    let removeSceneReadyListener = () => {};
    let removeWindowLoadListener = () => {};

    const unlockScroll = () => {
      body.style.overflow = previousBodyOverflow;
      root.style.overflow = previousHtmlOverflow;
    };

    const setup = async () => {
      const [{ gsap }, scrollModule] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);

      if (!active) return;

      const ScrollTrigger = scrollModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const mobile = window.matchMedia("(max-width: 820px)").matches;

      const scene = document.querySelector<HTMLElement>(".three-scene--plc");
      const announcement = document.querySelector<HTMLElement>(".announcement");
      const header = document.querySelector<HTMLElement>(".site-header");
      const headerBrand = header?.querySelector<HTMLElement>(".brand");
      const headerButton = header?.querySelector<HTMLElement>(".button");
      const headerLinks = header
        ? Array.from(header.querySelectorAll<HTMLElement>("nav a"))
        : [];

      const heroEyebrow = document.querySelector<HTMLElement>('[data-hero="eyebrow"]');
      const heroHeading = document.querySelector<HTMLElement>('[data-hero="heading"]');
      const heroText = document.querySelector<HTMLElement>('[data-hero="text"]');
      const heroActions = document.querySelector<HTMLElement>('[data-hero="actions"]');
      const heroDisciplines = document.querySelector<HTMLElement>('[data-hero="disciplines"]');
      const heroCue = document.querySelector<HTMLElement>('[data-hero="cue"]');

      const loaderBrand = loader.querySelector<HTMLElement>(".site-loader__brand");
      const loaderContent = loader.querySelector<HTMLElement>(".site-loader__content");
      const loaderStatus = loader.querySelector<HTMLElement>("[data-loader-status]");
      const progressValue = loader.querySelector<HTMLElement>("[data-loader-progress]");
      const leftCharge = loader.querySelector<HTMLElement>(".site-loader__charge--left");
      const rightCharge = loader.querySelector<HTMLElement>(".site-loader__charge--right");
      const signal = loader.querySelector<HTMLElement>(".site-loader__signal");
      const core = loader.querySelector<HTMLElement>(".site-loader__core");
      const coreBolt = loader.querySelector<HTMLElement>(".site-loader__core-bolt");
      const topPanel = loader.querySelector<HTMLElement>(".site-loader__panel--top");
      const bottomPanel = loader.querySelector<HTMLElement>(".site-loader__panel--bottom");

      if (
        !scene ||
        !announcement ||
        !header ||
        !headerBrand ||
        !headerButton ||
        !heroEyebrow ||
        !heroHeading ||
        !heroText ||
        !heroActions ||
        !heroDisciplines ||
        !heroCue ||
        !loaderBrand ||
        !loaderContent ||
        !loaderStatus ||
        !progressValue ||
        !leftCharge ||
        !rightCharge ||
        !signal ||
        !core ||
        !coreBolt ||
        !topPanel ||
        !bottomPanel
      ) {
        unlockScroll();
        loader.style.display = "none";
        return;
      }

      const progress = { value: 0 };
      const renderProgress = () => {
        const value = Math.min(100, Math.max(0, progress.value));
        progressValue.textContent = String(Math.round(value)).padStart(2, "0");
      };

      let loaderTimeline: any = null;
      let entranceTimeline: any = null;
      let resolveLoader = () => {};
      const loaderFinished = new Promise<void>((resolve) => {
        resolveLoader = resolve;
      });

      const context = gsap.context(() => {
        // Page entrance initial state: transform/opacity only.
        if (!reducedMotion) {
          gsap.set(scene, { opacity: 0 });
          gsap.set(announcement, { opacity: 0, y: -8 });
          gsap.set(header, { opacity: 0, y: -16, "--header-line-progress": 0 });
          gsap.set([headerBrand, ...headerLinks, headerButton], { opacity: 0, y: -8 });

          gsap.set(heroEyebrow, { opacity: 0, y: mobile ? 10 : 14 });
          gsap.set(heroHeading, { opacity: 0, y: mobile ? 20 : 30 });
          gsap.set(heroText, { opacity: 0, y: mobile ? 12 : 18 });
          gsap.set(heroActions, { opacity: 0, y: mobile ? 10 : 16 });
          gsap.set(heroDisciplines, { opacity: 0, y: mobile ? 8 : 12 });
          gsap.set(heroCue, { opacity: 0, y: 8 });
        }

        // Loader true first frame.
        progress.value = 0;
        renderProgress();
        loaderStatus.textContent = "NAPAJANJE SISTEMA";

        gsap.set(loaderBrand, { opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 10 });
        gsap.set(leftCharge, { scaleX: 0, transformOrigin: "left center" });
        gsap.set(rightCharge, { scaleX: 0, transformOrigin: "left center" });
        gsap.set(signal, { opacity: 0, xPercent: 0 });
        gsap.set(core, { scale: 0.96 });
        gsap.set(coreBolt, { opacity: 0.35, scale: 0.92 });

        if (reducedMotion) {
          progress.value = 100;
          renderProgress();
          loaderStatus.textContent = "SISTEM SPREMAN";
          gsap.set(loaderBrand, { opacity: 1, y: 0 });
          gsap.set([leftCharge, rightCharge], { scaleX: 1 });
          gsap.set(signal, { opacity: 0 });
          gsap.set(core, { scale: 1 });
          gsap.set(coreBolt, { opacity: 1, scale: 1 });
          resolveLoader();
        } else {
          const master = gsap.timeline({
            paused: true,
            onComplete: resolveLoader,
          });

          master.to(progress, {
            value: 100,
            duration: 3.25,
            ease: "none",
            onUpdate: renderProgress,
          }, 0.35);

          master.to(loaderBrand, {
            opacity: 1,
            y: 0,
            duration: 0.42,
            ease: "power2.out",
          }, 0.12);

          master.to(signal, {
            opacity: 1,
            duration: 0.18,
            ease: "none",
          }, 0.44);

          master.to(leftCharge, {
            scaleX: 1,
            duration: 1.24,
            ease: "sine.inOut",
          }, 0.46);

          master.to(signal, {
            xPercent: 455,
            duration: 1.24,
            ease: "sine.inOut",
          }, 0.46);

          master.to(core, {
            scale: 1.035,
            duration: 0.28,
            ease: "power2.out",
          }, 1.58);

          master.to(coreBolt, {
            opacity: 1,
            scale: 1.04,
            duration: 0.34,
            ease: "power2.out",
          }, 1.58);

          master.call(() => {
            loaderStatus.textContent = "TOK USPOSTAVLJEN";
          }, [], 1.72);

          master.to(rightCharge, {
            scaleX: 1,
            duration: 1.34,
            ease: "sine.inOut",
          }, 1.86);

          master.to(signal, {
            xPercent: 920,
            duration: 1.34,
            ease: "sine.inOut",
          }, 1.86);

          master.to(core, {
            scale: 1,
            duration: 0.28,
            ease: "sine.inOut",
          }, 2.08);

          master.to(coreBolt, {
            scale: 1,
            duration: 0.28,
            ease: "sine.inOut",
          }, 2.08);

          master.call(() => {
            progress.value = 100;
            renderProgress();
            loaderStatus.textContent = "SISTEM SPREMAN";
          }, [], 3.3);

          master.to(signal, {
            opacity: 0,
            duration: 0.24,
            ease: "sine.out",
          }, 3.34);

          // Clean completed-state hold; total loader is 4 seconds.
          master.call(() => {}, [], 4.0);

          loaderTimeline = master;
          loaderTimeline.play(0);
        }

        const revealElements = Array.from(
          document.querySelectorAll<HTMLElement>("[data-reveal]"),
        );

        revealElements.forEach((element) => {
          const type = element.dataset.reveal;
          const start = mobile ? "top 91%" : "top 87%";

          if (type === "stagger") {
            const children = Array.from(element.children).filter(
              (child): child is HTMLElement => child instanceof HTMLElement,
            );

            gsap.fromTo(
              children,
              { opacity: 0, y: mobile ? 12 : 20 },
              {
                opacity: 1,
                y: 0,
                duration: mobile ? 0.52 : 0.66,
                stagger: mobile ? 0.05 : 0.075,
                ease: "power3.out",
                clearProps: "transform,opacity",
                scrollTrigger: { trigger: element, start, once: true },
              },
            );
            return;
          }

          if (type === "heading") {
            gsap.fromTo(
              element,
              { opacity: 0, y: mobile ? 20 : 30 },
              {
                opacity: 1,
                y: 0,
                duration: mobile ? 0.64 : 0.8,
                ease: "power4.out",
                clearProps: "transform,opacity",
                scrollTrigger: { trigger: element, start, once: true },
              },
            );
            return;
          }

          if (type === "kicker") {
            gsap.fromTo(
              element,
              { opacity: 0, x: mobile ? -8 : -14 },
              {
                opacity: 1,
                x: 0,
                duration: 0.48,
                ease: "power3.out",
                clearProps: "transform,opacity",
                scrollTrigger: {
                  trigger: element,
                  start: mobile ? "top 93%" : "top 89%",
                  once: true,
                },
              },
            );
            return;
          }

          gsap.fromTo(
            element,
            { opacity: 0, y: mobile ? 10 : 16 },
            {
              opacity: 1,
              y: 0,
              duration: mobile ? 0.52 : 0.64,
              ease: "power3.out",
              clearProps: "transform,opacity",
              scrollTrigger: { trigger: element, start, once: true },
            },
          );
        });

        entranceTimeline = gsap.timeline({
          paused: true,
          onStart: () => {
            body.classList.add("site-entering");
            loader.style.pointerEvents = "none";
          },
          onComplete: () => {
            loader.style.display = "none";
            loader.setAttribute("aria-hidden", "true");
            body.classList.remove("site-entering");
            body.classList.add("site-entered");
            requestAnimationFrame(() => ScrollTrigger.refresh());
          },
        });

        entranceTimeline
          .to(scene, {
            opacity: 1,
            duration: 0.9,
            ease: "sine.out",
          }, 0)
          .to(loaderContent, {
            opacity: 0,
            y: -4,
            duration: 0.42,
            ease: "sine.inOut",
            force3D: true,
          }, 0)
          .to(topPanel, {
            yPercent: -102,
            duration: 1.08,
            ease: "power2.inOut",
            force3D: true,
          }, 0.22)
          .to(bottomPanel, {
            yPercent: 102,
            duration: 1.08,
            ease: "power2.inOut",
            force3D: true,
          }, 0.22)
          .to(heroEyebrow, {
            opacity: 1,
            y: 0,
            duration: 0.48,
            ease: "power3.out",
            clearProps: "transform,opacity",
          }, 0.58)
          .to(heroHeading, {
            opacity: 1,
            y: 0,
            duration: 0.72,
            ease: "power4.out",
            clearProps: "transform,opacity",
          }, 0.66)
          .to(heroText, {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power3.out",
            clearProps: "transform,opacity",
          }, 0.82)
          .to(heroActions, {
            opacity: 1,
            y: 0,
            duration: 0.48,
            ease: "power3.out",
            clearProps: "transform,opacity",
          }, 0.94)
          .to(heroDisciplines, {
            opacity: 1,
            y: 0,
            duration: 0.46,
            ease: "power3.out",
            clearProps: "transform,opacity",
          }, 1.04)
          .to(heroCue, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
            clearProps: "transform,opacity",
          }, 1.12)
          .to(announcement, {
            opacity: 1,
            y: 0,
            duration: 0.42,
            ease: "sine.out",
            clearProps: "transform,opacity",
          }, 1.06)
          .to(header, {
            opacity: 1,
            y: 0,
            duration: 0.52,
            ease: "power3.out",
            clearProps: "transform,opacity",
          }, 1.14)
          .to(headerBrand, {
            opacity: 1,
            y: 0,
            duration: 0.42,
            ease: "power3.out",
            clearProps: "transform,opacity",
          }, 1.2)
          .to(headerLinks, {
            opacity: 1,
            y: 0,
            duration: 0.38,
            stagger: 0.05,
            ease: "power3.out",
            clearProps: "transform,opacity",
          }, 1.24)
          .to(headerButton, {
            opacity: 1,
            y: 0,
            duration: 0.42,
            ease: "power3.out",
            clearProps: "transform,opacity",
          }, 1.34)
          .to(header, {
            "--header-line-progress": 1,
            duration: 0.58,
            ease: "sine.out",
          }, 1.22)
          .call(unlockScroll, undefined, 1.34);
      }, body);

      const pageReady =
        document.readyState === "complete"
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              const onLoad = () => {
                removeWindowLoadListener();
                resolve();
              };
              removeWindowLoadListener = () => window.removeEventListener("load", onLoad);
              window.addEventListener("load", onLoad, { once: true });
            });

      const firstThreeJsFrameReady =
        root.dataset.titanSceneReady === "true"
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              const onSceneReady = () => {
                removeSceneReadyListener();
                resolve();
              };
              removeSceneReadyListener = () =>
                window.removeEventListener("titan:scene-ready", onSceneReady);
              window.addEventListener("titan:scene-ready", onSceneReady, { once: true });
            });

      try {
        await Promise.all([loaderFinished, pageReady, firstThreeJsFrameReady]);

        if (!active) return;

        if (reducedMotion) {
          gsap.to(loader, {
            opacity: 0,
            duration: 0.14,
            ease: "none",
            onComplete: () => {
              unlockScroll();
              loader.style.display = "none";
              loader.setAttribute("aria-hidden", "true");
              body.classList.add("site-entered");
              ScrollTrigger.refresh();
            },
          });
        } else {
          entranceTimeline?.play(0);
        }
      } catch {
        unlockScroll();
        loader.style.display = "none";
        body.classList.add("site-entered");
        ScrollTrigger.refresh();
      }

      cleanupMotion = () => {
        removeSceneReadyListener();
        removeWindowLoadListener();
        loaderTimeline?.kill();
        entranceTimeline?.kill();
        context.revert();
        unlockScroll();
        body.classList.remove("motion-enabled", "site-entering");
      };
    };

    void setup();

    return () => {
      active = false;
      cleanupMotion();
      unlockScroll();
      body.classList.remove("motion-enabled", "site-entering");
    };
  }, []);

  return (
    <div
      className="site-loader"
      ref={loaderRef}
      role="status"
      aria-live="polite"
      aria-label="Učitavanje Titan Elektroinstalacije"
    >
      <div className="site-loader__panel site-loader__panel--top" aria-hidden="true" />
      <div className="site-loader__panel site-loader__panel--bottom" aria-hidden="true" />

      <div className="site-loader__content">
        <div className="site-loader__brand">
          <span className="site-loader__mark" aria-hidden="true">
            <svg viewBox="0 0 48 48">
              <path d="M28.5 2 10 28h12l-2.5 18L38 19H26l2.5-17Z" />
            </svg>
          </span>
          <span>
            <strong>TITAN</strong>
            <small>ELEKTROINSTALACIJE</small>
          </span>
        </div>

        <div className="site-loader__conduit" aria-hidden="true">
          <span className="site-loader__rail site-loader__rail--left">
            <i className="site-loader__charge site-loader__charge--left" />
          </span>

          <span className="site-loader__core">
            <span className="site-loader__core-bolt">
              <svg viewBox="0 0 48 48">
                <path d="M28.5 2 10 28h12l-2.5 18L38 19H26l2.5-17Z" />
              </svg>
            </span>
          </span>

          <span className="site-loader__rail site-loader__rail--right">
            <i className="site-loader__charge site-loader__charge--right" />
          </span>

          <i className="site-loader__signal" />
        </div>

        <div className="site-loader__meta">
          <span data-loader-status>NAPAJANJE SISTEMA</span>
          <strong>
            <b data-loader-progress>00</b>
            <small>%</small>
          </strong>
        </div>
      </div>
    </div>
  );
}
