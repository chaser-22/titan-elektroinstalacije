"use client";

import { useLayoutEffect, useRef } from "react";

export default function SiteMotion() {
  const loaderRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const loader = loaderRef.current;
    if (!loader) return;

    let active = true;
    let cleanupMotion = () => {};
    let sceneFallback = 0;
    let minimumTimer = 0;

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
      const root = document.documentElement;
      const body = document.body;
      const previousBodyOverflow = body.style.overflow;
      const previousHtmlOverflow = root.style.overflow;

      const scene = document.querySelector<HTMLElement>(".three-scene--plc");
      const announcement = document.querySelector<HTMLElement>(".announcement");
      const header = document.querySelector<HTMLElement>(".site-header");
      const headerBrand = header?.querySelector<HTMLElement>(".brand");
      const headerLinks = header
        ? Array.from(header.querySelectorAll<HTMLElement>("nav a"))
        : [];
      const headerButton = header?.querySelector<HTMLElement>(".button");

      const heroEyebrow = document.querySelector<HTMLElement>('[data-hero="eyebrow"]');
      const heroHeading = document.querySelector<HTMLElement>('[data-hero="heading"]');
      const heroText = document.querySelector<HTMLElement>('[data-hero="text"]');
      const heroActions = document.querySelector<HTMLElement>('[data-hero="actions"]');
      const heroDisciplines = document.querySelector<HTMLElement>('[data-hero="disciplines"]');
      const heroCue = document.querySelector<HTMLElement>('[data-hero="cue"]');

      const progressValue = loader.querySelector<HTMLElement>("[data-loader-progress]");
      const progressFill = loader.querySelector<HTMLElement>("[data-loader-fill]");
      const loaderBrand = loader.querySelector<HTMLElement>(".site-loader__brand");
      const loaderMeta = loader.querySelector<HTMLElement>(".site-loader__meta");
      const loaderCircuit = loader.querySelector<HTMLElement>(".site-loader__circuit");
      const topPanel = loader.querySelector<HTMLElement>(".site-loader__panel--top");
      const bottomPanel = loader.querySelector<HTMLElement>(".site-loader__panel--bottom");

      const unlockScroll = () => {
        body.style.overflow = previousBodyOverflow;
        root.style.overflow = previousHtmlOverflow;
      };

      body.classList.add("motion-enabled");
      body.style.overflow = "hidden";
      root.style.overflow = "hidden";

      const progress = { value: 0 };
      const renderProgress = () => {
        const value = Math.round(progress.value);
        if (progressValue) progressValue.textContent = String(value).padStart(2, "0");
        if (progressFill) progressFill.style.transform = `scaleX(${value / 100})`;
      };

      let entranceTimeline: ReturnType<typeof gsap.timeline> | null = null;

      const context = gsap.context(() => {
        if (reducedMotion) {
          gsap.set(
            [
              scene,
              announcement,
              header,
              headerBrand,
              ...headerLinks,
              headerButton,
              heroEyebrow,
              heroHeading,
              heroText,
              heroActions,
              heroDisciplines,
              heroCue,
            ].filter(Boolean),
            { clearProps: "all" },
          );
          return;
        }

        gsap.set(scene, { opacity: 0 });
        gsap.set(announcement, { opacity: 0, y: -10 });
        gsap.set(header, {
          opacity: 0,
          y: -20,
          filter: "blur(8px)",
          "--header-line-progress": 0,
        });
        gsap.set([headerBrand, ...headerLinks, headerButton].filter(Boolean), {
          opacity: 0,
          y: -8,
        });

        gsap.set(heroEyebrow, { opacity: 0, y: mobile ? 12 : 18, filter: "blur(5px)" });
        gsap.set(heroHeading, {
          opacity: 0,
          y: mobile ? 24 : 44,
          clipPath: "inset(0 0 100% 0)",
          filter: "blur(8px)",
        });
        gsap.set(heroText, { opacity: 0, y: mobile ? 14 : 24, filter: "blur(5px)" });
        gsap.set(heroActions, { opacity: 0, y: mobile ? 12 : 20 });
        gsap.set(heroDisciplines, { opacity: 0, y: mobile ? 10 : 16 });
        gsap.set(heroCue, { opacity: 0, y: 10 });

        gsap.set([loaderBrand, loaderMeta, loaderCircuit].filter(Boolean), { opacity: 0, y: 12 });

        gsap
          .timeline()
          .to(loaderBrand, { opacity: 1, y: 0, duration: 0.42, ease: "power3.out" })
          .to(loaderCircuit, { opacity: 1, y: 0, duration: 0.28, ease: "power2.out" }, 0.12)
          .to(loaderMeta, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }, 0.18);

        gsap.to(progress, {
          value: 88,
          duration: 0.72,
          ease: "power2.out",
          onUpdate: renderProgress,
        });

        const revealElements = Array.from(
          document.querySelectorAll<HTMLElement>("[data-reveal]"),
        );

        revealElements.forEach((element) => {
          const type = element.dataset.reveal;
          const start = mobile ? "top 90%" : "top 86%";

          if (type === "stagger") {
            const children = Array.from(element.children).filter(
              (child): child is HTMLElement => child instanceof HTMLElement,
            );

            gsap.fromTo(
              children,
              {
                opacity: 0,
                y: mobile ? 14 : 26,
                filter: mobile ? "blur(2px)" : "blur(4px)",
              },
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: mobile ? 0.58 : 0.72,
                stagger: mobile ? 0.06 : 0.09,
                ease: "power3.out",
                clearProps: "transform,filter,opacity",
                scrollTrigger: {
                  trigger: element,
                  start,
                  once: true,
                },
              },
            );
            return;
          }

          if (type === "heading") {
            gsap.fromTo(
              element,
              {
                opacity: 0,
                y: mobile ? 22 : 38,
                clipPath: "inset(0 0 100% 0)",
                filter: mobile ? "blur(3px)" : "blur(6px)",
              },
              {
                opacity: 1,
                y: 0,
                clipPath: "inset(0 0 0% 0)",
                filter: "blur(0px)",
                duration: mobile ? 0.7 : 0.9,
                ease: "power4.out",
                clearProps: "transform,filter,opacity,clipPath",
                scrollTrigger: {
                  trigger: element,
                  start,
                  once: true,
                },
              },
            );
            return;
          }

          if (type === "kicker") {
            gsap.fromTo(
              element,
              { opacity: 0, x: mobile ? -10 : -18 },
              {
                opacity: 1,
                x: 0,
                duration: 0.55,
                ease: "power3.out",
                clearProps: "transform,opacity",
                scrollTrigger: {
                  trigger: element,
                  start: mobile ? "top 92%" : "top 88%",
                  once: true,
                },
              },
            );
            return;
          }

          gsap.fromTo(
            element,
            {
              opacity: 0,
              y: mobile ? 12 : 22,
              filter: mobile ? "blur(2px)" : "blur(4px)",
            },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: mobile ? 0.58 : 0.72,
              ease: "power3.out",
              clearProps: "transform,filter,opacity",
              scrollTrigger: {
                trigger: element,
                start,
                once: true,
              },
            },
          );
        });

        entranceTimeline = gsap
          .timeline({
            paused: true,
            defaults: { ease: "power3.out" },
            onComplete: () => {
              loader.style.display = "none";
              loader.setAttribute("aria-hidden", "true");
              body.classList.add("site-entered");
              requestAnimationFrame(() => ScrollTrigger.refresh());
            },
          })
          .to(scene, { opacity: 1, duration: 0.65, ease: "power2.out" }, 0.05)
          .to(loaderBrand, { opacity: 0, y: -12, duration: 0.24 }, 0.04)
          .to(loaderMeta, { opacity: 0, y: -8, duration: 0.2 }, 0.08)
          .to(loaderCircuit, { opacity: 0, duration: 0.18 }, 0.1)
          .to(topPanel, { yPercent: -102, duration: 0.92, ease: "expo.inOut" }, 0.16)
          .to(bottomPanel, { yPercent: 102, duration: 0.92, ease: "expo.inOut" }, 0.16)
          .to(
            heroEyebrow,
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.52,
              clearProps: "transform,filter,opacity",
            },
            0.42,
          )
          .to(
            heroHeading,
            {
              opacity: 1,
              y: 0,
              clipPath: "inset(0 0 0% 0)",
              filter: "blur(0px)",
              duration: 0.82,
              ease: "power4.out",
              clearProps: "transform,filter,opacity,clipPath",
            },
            0.5,
          )
          .to(
            heroText,
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.6,
              clearProps: "transform,filter,opacity",
            },
            0.68,
          )
          .to(
            heroActions,
            {
              opacity: 1,
              y: 0,
              duration: 0.52,
              clearProps: "transform,opacity",
            },
            0.8,
          )
          .to(
            heroDisciplines,
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              clearProps: "transform,opacity",
            },
            0.9,
          )
          .to(
            heroCue,
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              clearProps: "transform,opacity",
            },
            0.98,
          )
          .to(
            announcement,
            {
              opacity: 1,
              y: 0,
              duration: 0.45,
              clearProps: "transform,opacity",
            },
            1.02,
          )
          .to(
            header,
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.55,
              clearProps: "transform,filter,opacity",
            },
            1.08,
          )
          .to(
            headerBrand,
            {
              opacity: 1,
              y: 0,
              duration: 0.42,
              clearProps: "transform,opacity",
            },
            1.16,
          )
          .to(
            headerLinks,
            {
              opacity: 1,
              y: 0,
              duration: 0.38,
              stagger: 0.055,
              clearProps: "transform,opacity",
            },
            1.2,
          )
          .to(
            headerButton,
            {
              opacity: 1,
              y: 0,
              duration: 0.42,
              clearProps: "transform,opacity",
            },
            1.28,
          )
          .to(header, { "--header-line-progress": 1, duration: 0.58, ease: "power2.out" }, 1.16)
          .call(unlockScroll, undefined, 1.2);
      }, body);

      const waitForWindow = document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            window.addEventListener("load", () => resolve(), { once: true });
          });

      const waitForScene = root.dataset.titanSceneReady === "true"
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            const done = () => {
              if (sceneFallback) window.clearTimeout(sceneFallback);
              window.removeEventListener("titan:scene-ready", done);
              resolve();
            };

            window.addEventListener("titan:scene-ready", done, { once: true });
            sceneFallback = window.setTimeout(done, 1800);
          });

      const waitMinimum = new Promise<void>((resolve) => {
        minimumTimer = window.setTimeout(resolve, reducedMotion ? 80 : 420);
      });

      try {
        await Promise.all([waitForWindow, waitForScene, waitMinimum]);
        if (!active) return;

        if (reducedMotion) {
          progress.value = 100;
          renderProgress();
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
          await new Promise<void>((resolve) => {
            gsap.to(progress, {
              value: 100,
              duration: 0.24,
              ease: "power2.out",
              onUpdate: renderProgress,
              onComplete: resolve,
            });
          });

          if (!active) return;
          entranceTimeline?.play(0);
        }
      } catch {
        unlockScroll();
        loader.style.display = "none";
        body.classList.add("site-entered");
        ScrollTrigger.refresh();
      }

      cleanupMotion = () => {
        if (sceneFallback) window.clearTimeout(sceneFallback);
        if (minimumTimer) window.clearTimeout(minimumTimer);
        entranceTimeline?.kill();
        context.revert();
        unlockScroll();
        body.classList.remove("motion-enabled");
      };
    };

    void setup();

    return () => {
      active = false;
      cleanupMotion();
    };
  }, []);

  return (
    <div className="site-loader" ref={loaderRef} role="status" aria-live="polite" aria-label="Učitavanje Titan Elektroinstalacije">
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

        <div className="site-loader__circuit" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>

        <div className="site-loader__meta">
          <span>SISTEM / INICIJALIZACIJA</span>
          <strong><b data-loader-progress>00</b><small>%</small></strong>
        </div>

        <div className="site-loader__progress" aria-hidden="true">
          <i data-loader-fill />
        </div>
      </div>
    </div>
  );
}
