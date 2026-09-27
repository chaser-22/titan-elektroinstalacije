"use client";

import { useLayoutEffect, useRef } from "react";

type GsapTimeline = {
  play: (from?: number) => void;
  kill: () => void;
};

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

      const heroEyebrow = document.querySelector<HTMLElement>('[data-hero="eyebrow"]');
      const heroHeading = document.querySelector<HTMLElement>('[data-hero="heading"]');
      const heroText = document.querySelector<HTMLElement>('[data-hero="text"]');
      const heroActions = document.querySelector<HTMLElement>('[data-hero="actions"]');
      const heroDisciplines = document.querySelector<HTMLElement>('[data-hero="disciplines"]');
      const heroCue = document.querySelector<HTMLElement>('[data-hero="cue"]');

      const progressValue = loader.querySelector<HTMLElement>("[data-loader-progress]");
      const loaderStatus = loader.querySelector<HTMLElement>("[data-loader-status]");
      const loaderBrand = loader.querySelector<HTMLElement>(".site-loader__brand");
      const loaderMeta = loader.querySelector<HTMLElement>(".site-loader__meta");
      const loaderContent = loader.querySelector<HTMLElement>(".site-loader__content");
      const loaderPower = loader.querySelector<HTMLElement>(".site-loader__power");
      const coreRing = loader.querySelector<HTMLElement>(".site-loader__core-ring");
      const coreBolt = loader.querySelector<HTMLElement>(".site-loader__core-bolt");
      const topPanel = loader.querySelector<HTMLElement>(".site-loader__panel--top");
      const bottomPanel = loader.querySelector<HTMLElement>(".site-loader__panel--bottom");

      const liveWires = Array.from(
        loader.querySelectorAll<SVGPathElement>("[data-power-wire]"),
      );
      const liveBranches = Array.from(
        loader.querySelectorAll<SVGPathElement>("[data-power-branch]"),
      );
      const powerNodes = Array.from(
        loader.querySelectorAll<SVGCircleElement>("[data-power-node]"),
      );
      const stageCards = Array.from(
        loader.querySelectorAll<HTMLElement>("[data-power-stage-card]"),
      );

      if (
        !scene ||
        !announcement ||
        !header ||
        !heroEyebrow ||
        !heroHeading ||
        !heroText ||
        !heroActions ||
        !heroDisciplines ||
        !heroCue ||
        !progressValue ||
        !loaderStatus ||
        !loaderBrand ||
        !loaderMeta ||
        !loaderContent ||
        !loaderPower ||
        !coreRing ||
        !coreBolt ||
        !topPanel ||
        !bottomPanel ||
        liveWires.length !== 5 ||
        liveBranches.length !== 3 ||
        powerNodes.length !== 6 ||
        stageCards.length !== 3
      ) {
        unlockScroll();
        loader.style.display = "none";
        return;
      }

      const headerBrand = header.querySelector<HTMLElement>(".brand");
      const headerButton = header.querySelector<HTMLElement>(".button");
      const headerLinks = Array.from(header.querySelectorAll<HTMLElement>("nav a"));

      if (!headerBrand || !headerButton) {
        unlockScroll();
        loader.style.display = "none";
        return;
      }

      const stageLeds = stageCards.map((card) =>
        card.querySelector<HTMLElement>(".site-loader__stage-led"),
      );

      if (stageLeds.some((led) => !led)) {
        unlockScroll();
        loader.style.display = "none";
        return;
      }

      const progress = { value: 0 };
      const renderProgress = () => {
        const value = Math.min(100, Math.max(0, progress.value));
        const displayValue = value >= 99.95 ? 100 : Math.floor(value);
        progressValue.textContent = String(displayValue).padStart(2, "0");
      };

      const setStatus = (text: string) => {
        loaderStatus.textContent = text;
      };

      const wireLengths = [...liveWires, ...liveBranches].map((path) => path.getTotalLength());

      const setWireOff = (path: SVGPathElement, length: number) => {
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
          opacity: 0,
        });
      };

      const setNodeOn = (node: SVGCircleElement) => {
        gsap.set(node, {
          attr: { r: 5.8 },
          fill: "#f4b700",
          stroke: "#ffe48a",
          filter: "drop-shadow(0 0 8px rgba(244,183,0,.82))",
        });
      };

      const setCompleteLoaderState = () => {
        liveWires.forEach((path, index) => {
          gsap.set(path, {
            strokeDasharray: wireLengths[index],
            strokeDashoffset: 0,
            opacity: 1,
          });
        });

        liveBranches.forEach((path, index) => {
          const lengthIndex = liveWires.length + index;
          gsap.set(path, {
            strokeDasharray: wireLengths[lengthIndex],
            strokeDashoffset: 0,
            opacity: 1,
          });
        });

        powerNodes.forEach(setNodeOn);

        stageCards.forEach((card, index) => {
          gsap.set(card, {
            color: "#dfe5ee",
            borderColor: "rgba(244,183,0,.28)",
            backgroundColor: "rgba(244,183,0,.05)",
          });
          gsap.set(stageLeds[index], {
            backgroundColor: "#f4b700",
            boxShadow: "0 0 11px rgba(244,183,0,.78)",
          });
        });

        gsap.set(coreRing, {
          borderColor: "rgba(255,235,166,.92)",
          boxShadow:
            "inset 0 0 52px rgba(244,183,0,.14), 0 0 62px rgba(244,183,0,.24)",
          scale: 1.08,
        });
        gsap.set(coreBolt, {
          color: "#080b12",
          backgroundColor: "#f4b700",
          boxShadow:
            "0 0 20px rgba(244,183,0,.7), 0 0 52px rgba(244,183,0,.32)",
          scale: 1.08,
        });
        gsap.set(loaderPower, {
          "--loader-core-glow": 1,
        });

        progress.value = 100;
        renderProgress();
        setStatus("SISTEM POD NAPONOM");
        loader.classList.add("is-complete");
      };

      let loaderTimeline: GsapTimeline | null = null;
      let entranceTimeline: GsapTimeline | null = null;
      let resolveLoaderTimeline = () => {};
      const loaderTimelineFinished = new Promise<void>((resolve) => {
        resolveLoaderTimeline = resolve;
      });

      const context = gsap.context(() => {
        gsap.set(scene, { opacity: reducedMotion ? 1 : 0 });
        gsap.set(announcement, reducedMotion ? { clearProps: "all" } : { opacity: 0, y: -10 });
        gsap.set(
          header,
          reducedMotion
            ? { clearProps: "all" }
            : {
                opacity: 0,
                y: -20,
                filter: "blur(8px)",
                "--header-line-progress": 0,
              },
        );

        if (!reducedMotion) {
          gsap.set([headerBrand, ...headerLinks, headerButton], {
            opacity: 0,
            y: -8,
          });
          gsap.set(heroEyebrow, {
            opacity: 0,
            y: mobile ? 12 : 18,
            filter: "blur(5px)",
          });
          gsap.set(heroHeading, {
            opacity: 0,
            y: mobile ? 24 : 44,
            clipPath: "inset(0 0 100% 0)",
            filter: "blur(8px)",
          });
          gsap.set(heroText, {
            opacity: 0,
            y: mobile ? 14 : 24,
            filter: "blur(5px)",
          });
          gsap.set(heroActions, { opacity: 0, y: mobile ? 12 : 20 });
          gsap.set(heroDisciplines, { opacity: 0, y: mobile ? 10 : 16 });
          gsap.set(heroCue, { opacity: 0, y: 10 });
        }

        // Absolute loader first-frame state.
        loader.classList.remove("is-complete");
        progress.value = 0;
        renderProgress();
        setStatus("PROVJERA INSTALACIJE");

        gsap.set(loaderBrand, {
          opacity: reducedMotion ? 1 : 0,
          y: reducedMotion ? 0 : 12,
        });
        gsap.set(loaderMeta, {
          opacity: reducedMotion ? 1 : 0,
          y: reducedMotion ? 0 : 10,
        });

        liveWires.forEach((path, index) => setWireOff(path, wireLengths[index]));
        liveBranches.forEach((path, index) =>
          setWireOff(path, wireLengths[liveWires.length + index]),
        );

        gsap.set(powerNodes, {
          attr: { r: 5.8 },
          fill: "#070b14",
          stroke: "rgba(255,255,255,.28)",
          filter: "none",
        });

        gsap.set(stageCards, {
          color: "rgba(207,215,226,.42)",
          borderColor: "rgba(255,255,255,.07)",
          backgroundColor: "rgba(4,8,15,.28)",
        });
        gsap.set(stageLeds, {
          backgroundColor: "rgba(255,255,255,.15)",
          boxShadow: "none",
        });

        gsap.set(coreRing, {
          borderColor: "rgba(244,183,0,.24)",
          boxShadow:
            "inset 0 0 24px rgba(244,183,0,.025), 0 0 20px rgba(244,183,0,.025)",
          scale: 0.98,
        });
        gsap.set(coreBolt, {
          color: "#3a310e",
          backgroundColor: "rgba(244,183,0,.06)",
          boxShadow: "0 0 0 rgba(244,183,0,0)",
          scale: 0.96,
        });
        gsap.set(loaderPower, {
          "--loader-core-glow": 0,
        });

        if (reducedMotion) {
          setCompleteLoaderState();
          resolveLoaderTimeline();
        } else {
          const master = gsap.timeline({
            paused: true,
            defaults: { ease: "sine.inOut" },
            onComplete: resolveLoaderTimeline,
          });

          // Percentage is part of this same master timeline. It deliberately
          // stops at 99 until the final output node is fully energized.
          master.to(
            progress,
            {
              value: 99,
              duration: 2.95,
              ease: "none",
              onUpdate: renderProgress,
            },
            0.4,
          );

          master.to(loaderBrand, { opacity: 1, y: 0, duration: 0.34, ease: "power2.out" }, 0.2);
          master.to(loaderMeta, { opacity: 1, y: 0, duration: 0.28, ease: "power2.out" }, 0.28);

          master.call(() => setStatus("MREŽA 230V PRISUTNA"), [], 0.4);
          master.to(coreRing, { borderColor: "rgba(244,183,0,.42)", scale: 1, duration: 0.35 }, 0.4);
          master.to(coreBolt, { color: "#b58b08", backgroundColor: "rgba(244,183,0,.1)", scale: 1, duration: 0.35 }, 0.4);
          master.to(loaderPower, { "--loader-core-glow": 0.18, duration: 0.45 }, 0.4);

          // Source node.
          master.to(powerNodes[0], {
            fill: "#f4b700",
            stroke: "#ffe48a",
            filter: "drop-shadow(0 0 7px rgba(244,183,0,.72))",
            duration: 0.14,
          }, 0.42);
          master.to(powerNodes[0], { attr: { r: 7 }, duration: 0.08, ease: "power2.out" }, 0.48);
          master.to(powerNodes[0], { attr: { r: 5.8 }, duration: 0.12, ease: "power2.inOut" }, 0.56);

          // MAIN INPUT.
          master.set(liveWires[0], { opacity: 1 }, 0.5);
          master.to(liveWires[0], {
            strokeDashoffset: 0,
            duration: 0.42,
            ease: "power1.inOut",
          }, 0.5);
          master.to(powerNodes[1], {
            fill: "#f4b700",
            stroke: "#ffe48a",
            filter: "drop-shadow(0 0 7px rgba(244,183,0,.72))",
            duration: 0.12,
          }, 0.88);
          master.to(powerNodes[1], { attr: { r: 7 }, duration: 0.07 }, 0.9);
          master.to(powerNodes[1], { attr: { r: 5.8 }, duration: 0.1 }, 0.97);

          // BREAKER / SUPPLY.
          master.set(liveWires[1], { opacity: 1 }, 0.94);
          master.to(liveWires[1], {
            strokeDashoffset: 0,
            duration: 0.46,
            ease: "power1.inOut",
          }, 0.94);
          master.set(liveBranches[0], { opacity: 1 }, 1.15);
          master.to(liveBranches[0], {
            strokeDashoffset: 0,
            duration: 0.22,
            ease: "power1.inOut",
          }, 1.15);
          master.to(powerNodes[2], {
            fill: "#f4b700",
            stroke: "#ffe48a",
            filter: "drop-shadow(0 0 7px rgba(244,183,0,.72))",
            duration: 0.12,
          }, 1.34);
          master.to(powerNodes[2], { attr: { r: 7 }, duration: 0.07 }, 1.36);
          master.to(powerNodes[2], { attr: { r: 5.8 }, duration: 0.1 }, 1.43);
          master.to(stageCards[0], {
            color: "#dfe5ee",
            borderColor: "rgba(244,183,0,.26)",
            backgroundColor: "rgba(244,183,0,.045)",
            duration: 0.28,
          }, 1.25);
          master.to(stageLeds[0], {
            backgroundColor: "#f4b700",
            boxShadow: "0 0 10px rgba(244,183,0,.74)",
            duration: 0.2,
          }, 1.25);

          // 24V CONTROL BUS.
          master.call(() => setStatus("KONTROLNI BUS 24V"), [], 1.42);
          master.set(liveWires[2], { opacity: 1 }, 1.44);
          master.to(liveWires[2], {
            strokeDashoffset: 0,
            duration: 0.68,
            ease: "power1.inOut",
          }, 1.44);
          master.set(liveBranches[1], { opacity: 1 }, 1.86);
          master.to(liveBranches[1], {
            strokeDashoffset: 0,
            duration: 0.24,
            ease: "power1.inOut",
          }, 1.86);
          master.to(powerNodes[3], {
            fill: "#f4b700",
            stroke: "#ffe48a",
            filter: "drop-shadow(0 0 8px rgba(244,183,0,.76))",
            duration: 0.13,
          }, 2.04);
          master.to(powerNodes[3], { attr: { r: 7.1 }, duration: 0.07 }, 2.06);
          master.to(powerNodes[3], { attr: { r: 5.8 }, duration: 0.11 }, 2.13);
          master.to(stageCards[1], {
            color: "#dfe5ee",
            borderColor: "rgba(244,183,0,.26)",
            backgroundColor: "rgba(244,183,0,.045)",
            duration: 0.28,
          }, 1.9);
          master.to(stageLeds[1], {
            backgroundColor: "#f4b700",
            boxShadow: "0 0 10px rgba(244,183,0,.74)",
            duration: 0.2,
          }, 1.9);
          master.to(loaderPower, { "--loader-core-glow": 0.46, duration: 0.42 }, 1.82);

          // PLC.
          master.call(() => setStatus("PLC / I-O ONLINE"), [], 2.12);
          master.set(liveWires[3], { opacity: 1 }, 2.14);
          master.to(liveWires[3], {
            strokeDashoffset: 0,
            duration: 0.58,
            ease: "power1.inOut",
          }, 2.14);
          master.set(liveBranches[2], { opacity: 1 }, 2.46);
          master.to(liveBranches[2], {
            strokeDashoffset: 0,
            duration: 0.24,
            ease: "power1.inOut",
          }, 2.46);
          master.to(powerNodes[4], {
            fill: "#f4b700",
            stroke: "#ffe48a",
            filter: "drop-shadow(0 0 8px rgba(244,183,0,.8))",
            duration: 0.13,
          }, 2.64);
          master.to(powerNodes[4], { attr: { r: 7.2 }, duration: 0.07 }, 2.66);
          master.to(powerNodes[4], { attr: { r: 5.8 }, duration: 0.11 }, 2.73);
          master.to(stageCards[2], {
            color: "#dfe5ee",
            borderColor: "rgba(244,183,0,.26)",
            backgroundColor: "rgba(244,183,0,.045)",
            duration: 0.28,
          }, 2.45);
          master.to(stageLeds[2], {
            backgroundColor: "#f4b700",
            boxShadow: "0 0 10px rgba(244,183,0,.74)",
            duration: 0.2,
          }, 2.45);

          // OUTPUT — the very last primary circuit segment.
          master.set(liveWires[4], { opacity: 1 }, 2.74);
          master.to(liveWires[4], {
            strokeDashoffset: 0,
            duration: 0.44,
            ease: "power1.inOut",
          }, 2.74);
          master.to(powerNodes[5], {
            fill: "#f4b700",
            stroke: "#ffe48a",
            filter: "drop-shadow(0 0 9px rgba(244,183,0,.86))",
            duration: 0.12,
          }, 3.14);
          master.to(powerNodes[5], { attr: { r: 7.4 }, duration: 0.07 }, 3.16);
          master.to(powerNodes[5], { attr: { r: 5.8 }, duration: 0.11 }, 3.23);

          // Core reaches stable live state only after every wire/node is done.
          master.to(coreRing, {
            borderColor: "rgba(255,235,166,.92)",
            boxShadow:
              "inset 0 0 52px rgba(244,183,0,.14), 0 0 62px rgba(244,183,0,.24)",
            scale: 1.08,
            duration: 0.26,
            ease: "power2.out",
          }, 3.12);
          master.to(coreBolt, {
            color: "#080b12",
            backgroundColor: "#f4b700",
            boxShadow:
              "0 0 20px rgba(244,183,0,.7), 0 0 52px rgba(244,183,0,.32)",
            scale: 1.08,
            duration: 0.26,
            ease: "power2.out",
          }, 3.12);
          master.to(loaderPower, { "--loader-core-glow": 1, duration: 0.28 }, 3.12);

          master.call(() => {
            progress.value = 100;
            renderProgress();
            setStatus("SISTEM POD NAPONOM");
            loader.classList.add("is-complete");
          }, [], 3.35);

          // Explicit completed-state hold. Nothing electrical is still animating here.
          master.call(() => {}, [], 4.0);

          loaderTimeline = master as unknown as GsapTimeline;
          loaderTimeline.play(0);
        }

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
          .to(scene, { opacity: 1, duration: 0.82, ease: "power2.out" }, 0.08)
          .to(
            loaderContent,
            {
              opacity: 0,
              y: -8,
              duration: 0.42,
              ease: "power3.inOut",
            },
            0.02,
          )
          .to(topPanel, { yPercent: -102, duration: 1.08, ease: "expo.inOut" }, 0.22)
          .to(bottomPanel, { yPercent: 102, duration: 1.08, ease: "expo.inOut" }, 0.22)
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
          .to(
            header,
            {
              "--header-line-progress": 1,
              duration: 0.58,
              ease: "power2.out",
            },
            1.16,
          )
          .call(unlockScroll, undefined, 1.2);

        entranceTimeline = entranceTimeline as unknown as GsapTimeline;
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
        await Promise.all([
          loaderTimelineFinished,
          pageReady,
          firstThreeJsFrameReady,
        ]);

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
        body.classList.remove("motion-enabled");
      };
    };

    void setup();

    return () => {
      active = false;
      cleanupMotion();
      unlockScroll();
      body.classList.remove("motion-enabled");
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

        <div className="site-loader__power" aria-hidden="true">
          <svg
            className="site-loader__schematic"
            viewBox="0 0 560 186"
            preserveAspectRatio="none"
          >
            <g className="site-loader__base-wires">
              <path d="M8 92H92" />
              <path d="M92 92V42H196" />
              <path d="M196 42V92H280V144" />
              <path d="M280 144H386V92" />
              <path d="M386 92H552" />
              <path d="M196 42V14" />
              <path d="M280 144V174" />
              <path d="M386 92V38" />
            </g>

            <g className="site-loader__live-wires">
              <path data-power-wire="input" d="M8 92H92" />
              <path data-power-wire="mains" d="M92 92V42H196" />
              <path data-power-wire="bus" d="M196 42V92H280V144" />
              <path data-power-wire="plc" d="M280 144H386V92" />
              <path data-power-wire="output" d="M386 92H552" />
              <path data-power-branch="supply" d="M196 42V14" />
              <path data-power-branch="bus" d="M280 144V174" />
              <path data-power-branch="plc" d="M386 92V38" />
            </g>

            <g className="site-loader__nodes">
              <circle data-power-node="source" cx="8" cy="92" r="5.8" />
              <circle data-power-node="breaker" cx="92" cy="92" r="5.8" />
              <circle data-power-node="supply" cx="196" cy="42" r="5.8" />
              <circle data-power-node="bus" cx="280" cy="144" r="5.8" />
              <circle data-power-node="plc" cx="386" cy="92" r="5.8" />
              <circle data-power-node="output" cx="552" cy="92" r="5.8" />
            </g>
          </svg>

          <div className="site-loader__power-core">
            <i className="site-loader__arc site-loader__arc--one" />
            <i className="site-loader__arc site-loader__arc--two" />
            <span className="site-loader__core-ring" />
            <span className="site-loader__core-bolt">
              <svg viewBox="0 0 48 48">
                <path d="M28.5 2 10 28h12l-2.5 18L38 19H26l2.5-17Z" />
              </svg>
            </span>
          </div>
        </div>

        <div className="site-loader__stages" aria-hidden="true">
          <span data-power-stage-card="mains">
            <i className="site-loader__stage-led" />
            MREŽA
            <b>230V</b>
          </span>
          <span data-power-stage-card="bus">
            <i className="site-loader__stage-led" />
            BUS
            <b>24V</b>
          </span>
          <span data-power-stage-card="plc">
            <i className="site-loader__stage-led" />
            PLC
            <b>I/O</b>
          </span>
        </div>

        <div className="site-loader__meta">
          <span data-loader-status>PROVJERA INSTALACIJE</span>
          <strong>
            <b data-loader-progress>00</b>
            <small>%</small>
          </strong>
        </div>
      </div>
    </div>
  );
}
