"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const YELLOW = 0xf4b700;
const WARM_YELLOW = 0xffd54d;
const STEEL = 0x263044;
const DARK_STEEL = 0x111827;

export default function ElectricalScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080d1a, 0.085);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 60);
    camera.position.set(0, 0, 7.6);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: window.devicePixelRatio < 2,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    mount.appendChild(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);

    scene.add(new THREE.HemisphereLight(0xaab7d3, 0x080d1a, 1.2));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(4, 5, 7);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(YELLOW, 14, 11, 2);
    rimLight.position.set(2.5, 2.4, 2.2);
    scene.add(rimLight);

    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.8, 4.4, -0.4),
      new THREE.Vector3(1.25, 3.2, 0.2),
      new THREE.Vector3(2.05, 2.25, -0.35),
      new THREE.Vector3(1.15, 1.3, 0.25),
      new THREE.Vector3(1.7, 0.2, -0.3),
      new THREE.Vector3(0.85, -0.9, 0.3),
      new THREE.Vector3(1.55, -2.0, -0.2),
      new THREE.Vector3(0.8, -3.2, 0.25),
      new THREE.Vector3(1.3, -4.4, -0.35),
    ]);
    curve.curveType = "catmullrom";
    curve.tension = 0.38;

    const outerCable = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 220, 0.11, 12, false),
      new THREE.MeshStandardMaterial({
        color: DARK_STEEL,
        metalness: 0.92,
        roughness: 0.24,
      }),
    );
    root.add(outerCable);

    const conductor = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 220, 0.032, 8, false),
      new THREE.MeshBasicMaterial({ color: YELLOW }),
    );
    root.add(conductor);

    const junctionMaterial = new THREE.MeshStandardMaterial({
      color: STEEL,
      metalness: 0.9,
      roughness: 0.28,
    });
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0x65708a,
      metalness: 1,
      roughness: 0.2,
      emissive: 0x141923,
      emissiveIntensity: 0.6,
    });

    const junctions: Array<{ rotation: { x: number } }> = [];
    [0.13, 0.34, 0.57, 0.79].forEach((t, index) => {
      const point = curve.getPointAt(t);
      const group = new THREE.Group();
      group.position.copy(point);

      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.22, 0.34, 18),
        junctionMaterial,
      );
      body.rotation.z = Math.PI / 2;
      group.add(body);

      const collar = new THREE.Mesh(
        new THREE.TorusGeometry(0.27, 0.035, 8, 32),
        ringMaterial,
      );
      collar.rotation.y = Math.PI / 2;
      group.add(collar);

      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 14, 14),
        new THREE.MeshBasicMaterial({ color: index % 2 ? WARM_YELLOW : YELLOW }),
      );
      dot.position.set(0, 0, 0.2);
      group.add(dot);

      root.add(group);
      junctions.push(group);
    });

    const pulse = new THREE.Group();
    const pulseCore = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.18, 2),
      new THREE.MeshBasicMaterial({ color: WARM_YELLOW }),
    );
    pulse.add(pulseCore);

    const pulseShell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.31, 1),
      new THREE.MeshBasicMaterial({
        color: YELLOW,
        transparent: true,
        opacity: 0.18,
        wireframe: true,
      }),
    );
    pulse.add(pulseShell);

    const pulseRingA = new THREE.Mesh(
      new THREE.TorusGeometry(0.42, 0.018, 8, 48),
      new THREE.MeshBasicMaterial({ color: YELLOW, transparent: true, opacity: 0.78 }),
    );
    pulseRingA.rotation.x = Math.PI / 2;
    pulse.add(pulseRingA);

    const pulseRingB = pulseRingA.clone();
    pulseRingB.scale.setScalar(1.28);
    pulseRingB.rotation.y = Math.PI / 2;
    pulse.add(pulseRingB);

    const pulseLight = new THREE.PointLight(YELLOW, 18, 5.8, 1.8);
    pulse.add(pulseLight);
    root.add(pulse);

    const heroCore = new THREE.Group();
    heroCore.position.set(1.55, 1.05, -0.55);

    const coreBody = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.72, 1),
      new THREE.MeshStandardMaterial({
        color: 0x1c2537,
        metalness: 0.98,
        roughness: 0.2,
        emissive: 0x221b00,
        emissiveIntensity: 0.75,
      }),
    );
    heroCore.add(coreBody);

    const coreWire = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.92, 1),
      new THREE.MeshBasicMaterial({
        color: YELLOW,
        wireframe: true,
        transparent: true,
        opacity: 0.36,
      }),
    );
    heroCore.add(coreWire);

    [1.15, 1.48, 1.82].forEach((radius, index) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius, index === 1 ? 0.028 : 0.018, 8, 80),
        new THREE.MeshBasicMaterial({
          color: index === 1 ? WARM_YELLOW : 0x7b8498,
          transparent: true,
          opacity: index === 1 ? 0.78 : 0.42,
        }),
      );
      ring.rotation.set(index * 0.7, index * 0.45, index * 0.85);
      heroCore.add(ring);
    });
    root.add(heroCore);

    const particleCount = 240;
    const positions = new Float32Array(particleCount * 3);
    let seed = 17;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let i = 0; i < particleCount; i += 1) {
      positions[i * 3] = (random() - 0.35) * 10;
      positions[i * 3 + 1] = (random() - 0.5) * 11;
      positions[i * 3 + 2] = (random() - 0.5) * 7 - 1.3;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        color: 0x66728a,
        size: 0.025,
        transparent: true,
        opacity: 0.5,
        sizeAttenuation: true,
      }),
    );
    root.add(particles);

    let progress = 0;
    let targetProgress = 0;
    let pointerX = 0;
    let pointerY = 0;
    let frame = 0;

    const updateScroll = () => {
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      targetProgress = THREE.MathUtils.clamp(window.scrollY / maxScroll, 0, 1);
      document.documentElement.style.setProperty("--scroll-progress", targetProgress.toString());
    };

    const updatePointer = (event: PointerEvent) => {
      pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
      pointerY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      root.position.x = width < 760 ? -0.55 : 0;
      root.scale.setScalar(width < 760 ? 0.84 : width < 1180 ? 0.92 : 1);
    };

    const renderScene = (time = 0) => {
      const still = reducedMotion.matches;
      progress = still ? targetProgress : THREE.MathUtils.lerp(progress, targetProgress, 0.065);

      const pulseT = THREE.MathUtils.clamp(progress, 0.015, 0.985);
      pulse.position.copy(curve.getPointAt(pulseT));
      const tangent = curve.getTangentAt(pulseT).normalize();
      pulse.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);

      const heroFade = 1 - THREE.MathUtils.smoothstep(progress, 0.12, 0.38);
      heroCore.visible = heroFade > 0.01;
      heroCore.scale.setScalar(0.8 + heroFade * 0.2);
      heroCore.rotation.y = still ? 0.4 : time * 0.00018;
      heroCore.rotation.x = still ? -0.2 : Math.sin(time * 0.00022) * 0.16;

      if (!still) {
        pulseCore.rotation.x = time * 0.0011;
        pulseCore.rotation.y = time * 0.0014;
        pulseShell.rotation.y = -time * 0.0008;
        pulseRingA.rotation.z = time * 0.0009;
        pulseRingB.rotation.x = Math.PI / 2 + time * 0.00065;
        particles.rotation.y = time * 0.000025;
        junctions.forEach((junction, index) => {
          junction.rotation.x = Math.sin(time * 0.00045 + index) * 0.08;
        });
      }

      const xDrift = window.innerWidth < 760 ? 0 : pointerX * 0.18;
      const yDrift = window.innerWidth < 760 ? 0 : -pointerY * 0.08;
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, xDrift, 0.04);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, yDrift, 0.04);
      camera.lookAt(0.85, 0, -0.2);

      rimLight.position.copy(pulse.position).add(new THREE.Vector3(0.2, 0.1, 1.25));
      renderer.render(scene, camera);

      if (!still) frame = window.requestAnimationFrame(renderScene);
    };

    const handleMotionPreference = () => {
      if (reducedMotion.matches) {
        if (frame) window.cancelAnimationFrame(frame);
        frame = 0;
        renderScene();
      } else if (!frame) {
        frame = window.requestAnimationFrame(renderScene);
      }
    };

    updateScroll();
    resize();
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", updatePointer, { passive: true });
    reducedMotion.addEventListener("change", handleMotionPreference);

    if (reducedMotion.matches) renderScene();
    else frame = window.requestAnimationFrame(renderScene);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", updatePointer);
      reducedMotion.removeEventListener("change", handleMotionPreference);
      document.documentElement.style.removeProperty("--scroll-progress");

      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          object.geometry.dispose();
          const material = object.material;
          if (Array.isArray(material)) material.forEach((item) => item.dispose());
          else material.dispose();
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div className="three-scene" ref={mountRef} aria-hidden="true" />;
}
