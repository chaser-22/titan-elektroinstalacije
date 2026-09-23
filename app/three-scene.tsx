"use client";

import { useEffect, useRef } from "react";

type ThreeModule = typeof import("three");

export default function ThreeScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposed = false;
    let frame = 0;
    let cleanup = () => {};

    async function boot() {
      const THREE: ThreeModule = await import("three");
      if (disposed || !mountRef.current) return;

      const mount = mountRef.current;
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x05070b, 0.055);

      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
      camera.position.set(0, 0.2, 9);

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setClearColor(0x05070b, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      mount.appendChild(renderer.domElement);

      const root = new THREE.Group();
      scene.add(root);

      const metal = new THREE.MeshStandardMaterial({
        color: 0x161b24,
        metalness: 0.88,
        roughness: 0.28,
      });
      const darkMetal = new THREE.MeshStandardMaterial({
        color: 0x080b10,
        metalness: 0.9,
        roughness: 0.38,
      });
      const yellow = new THREE.MeshStandardMaterial({
        color: 0xffc400,
        emissive: 0xffa200,
        emissiveIntensity: 1.8,
        metalness: 0.35,
        roughness: 0.24,
      });
      const warm = new THREE.MeshStandardMaterial({
        color: 0xff7a00,
        emissive: 0xff4d00,
        emissiveIntensity: 1.1,
        metalness: 0.2,
        roughness: 0.3,
      });

      const core = new THREE.Group();
      root.add(core);

      const box = new THREE.Mesh(new THREE.BoxGeometry(2.5, 3.3, 1.45), metal);
      box.rotation.y = -0.28;
      core.add(box);

      const inner = new THREE.Mesh(new THREE.BoxGeometry(1.95, 2.72, 1.52), darkMetal);
      inner.position.z = 0.04;
      inner.rotation.y = -0.28;
      core.add(inner);

      for (let i = 0; i < 5; i += 1) {
        const breaker = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.72, 0.22), i === 2 ? yellow : metal);
        breaker.position.set(-0.58 + i * 0.29, 0.12, 0.89);
        breaker.rotation.y = -0.28;
        core.add(breaker);
      }

      const ringGroup = new THREE.Group();
      root.add(ringGroup);
      for (let i = 0; i < 4; i += 1) {
        const torus = new THREE.Mesh(
          new THREE.TorusGeometry(1.15 + i * 0.34, 0.055, 12, 96),
          i === 1 ? yellow : metal,
        );
        torus.rotation.x = Math.PI / 2;
        torus.rotation.z = i * 0.26;
        torus.position.z = -0.45 + i * 0.12;
        ringGroup.add(torus);
      }

      const nodeGroup = new THREE.Group();
      root.add(nodeGroup);
      const nodeGeometry = new THREE.IcosahedronGeometry(0.12, 1);
      const nodes: THREE.Mesh[] = [];
      const lines: THREE.Line[] = [];

      const nodePositions = [
        [-2.2, 1.25, -0.2],
        [-1.45, -1.8, 0.2],
        [1.8, 1.55, 0.25],
        [2.35, -0.85, -0.1],
        [0.1, 2.35, -0.5],
        [0.55, -2.35, -0.2],
      ];

      nodePositions.forEach((position, index) => {
        const node = new THREE.Mesh(nodeGeometry, index % 3 === 0 ? yellow : warm);
        node.position.set(position[0], position[1], position[2]);
        nodeGroup.add(node);
        nodes.push(node);

        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(position[0] * 0.46, position[1] * 0.48, 0.55),
          new THREE.Vector3(position[0], position[1], position[2]),
        ]);
        const points = curve.getPoints(40);
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(
          lineGeometry,
          new THREE.LineBasicMaterial({
            color: index % 2 ? 0xff8a00 : 0xffc400,
            transparent: true,
            opacity: 0.52,
          }),
        );
        nodeGroup.add(line);
        lines.push(line);
      });

      const particlesCount = 280;
      const positions = new Float32Array(particlesCount * 3);
      for (let i = 0; i < particlesCount; i += 1) {
        positions[i * 3] = (Math.random() - 0.5) * 13;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1.5;
      }
      const particlesGeometry = new THREE.BufferGeometry();
      particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const particles = new THREE.Points(
        particlesGeometry,
        new THREE.PointsMaterial({
          color: 0xffc400,
          size: 0.025,
          transparent: true,
          opacity: 0.52,
          sizeAttenuation: true,
        }),
      );
      root.add(particles);

      const grid = new THREE.GridHelper(18, 24, 0x493d10, 0x17191e);
      grid.rotation.x = Math.PI / 2;
      grid.position.z = -3;
      root.add(grid);

      scene.add(new THREE.AmbientLight(0xffffff, 0.42));
      const key = new THREE.PointLight(0xffc400, 34, 18, 2);
      key.position.set(4, 4, 5);
      scene.add(key);
      const rim = new THREE.PointLight(0x4577ff, 18, 16, 2);
      rim.position.set(-4, -1, 2);
      scene.add(rim);

      let scrollProgress = 0;
      let targetMouseX = 0;
      let targetMouseY = 0;
      let mouseX = 0;
      let mouseY = 0;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const onScroll = () => {
        const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        scrollProgress = window.scrollY / max;
      };

      const onPointer = (event: PointerEvent) => {
        targetMouseX = (event.clientX / window.innerWidth - 0.5) * 0.65;
        targetMouseY = (event.clientY / window.innerHeight - 0.5) * 0.45;
      };

      const resize = () => {
        const width = mount.clientWidth;
        const height = mount.clientHeight;
        renderer.setSize(width, height, false);
        camera.aspect = width / Math.max(1, height);
        camera.updateProjectionMatrix();
      };

      const animate = (time: number) => {
        if (disposed) return;
        const t = time * 0.001;
        mouseX += (targetMouseX - mouseX) * 0.045;
        mouseY += (targetMouseY - mouseY) * 0.045;

        const p = reducedMotion ? 0.22 : scrollProgress;
        const phase = p * Math.PI * 2.25;

        root.rotation.y = -0.32 + Math.sin(phase) * 0.42 + mouseX * 0.18;
        root.rotation.x = 0.08 + Math.cos(phase * 0.72) * 0.16 + mouseY * 0.13;
        root.position.y = 0.15 + Math.sin(phase * 0.82) * 0.34;
        root.position.x = p < 0.2 ? 1.8 : p < 0.62 ? -1.25 : 1.1;

        core.rotation.z = Math.sin(t * 0.35) * 0.035;
        core.position.z = Math.sin(p * Math.PI) * 0.55;

        ringGroup.rotation.z = t * 0.13 + p * 3.1;
        ringGroup.rotation.x = p * 1.2;
        ringGroup.scale.setScalar(0.92 + Math.sin(phase) * 0.16);

        nodeGroup.rotation.z = -t * 0.035 - p * 0.9;
        nodeGroup.scale.setScalar(0.72 + p * 0.58);
        nodes.forEach((node, index) => {
          const pulse = 1 + Math.sin(t * 2.6 + index) * 0.24;
          node.scale.setScalar(pulse);
        });

        lines.forEach((line, index) => {
          const material = line.material as THREE.LineBasicMaterial;
          material.opacity = 0.24 + 0.34 * (0.5 + 0.5 * Math.sin(t * 2 + index));
        });

        particles.rotation.y = t * 0.018;
        particles.rotation.z = p * 0.35;

        key.intensity = 24 + p * 28 + Math.sin(t * 2.1) * 3;
        camera.position.z = 9 - p * 1.4;
        camera.position.x = mouseX * 0.18;
        camera.position.y = -mouseY * 0.12;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
        frame = requestAnimationFrame(animate);
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("pointermove", onPointer, { passive: true });
      window.addEventListener("resize", resize);
      onScroll();
      resize();
      frame = requestAnimationFrame(animate);

      cleanup = () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("pointermove", onPointer);
        window.removeEventListener("resize", resize);
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.Line) {
            object.geometry?.dispose();
            const material = object.material;
            if (Array.isArray(material)) material.forEach((entry) => entry.dispose());
            else material?.dispose();
          }
        });
        renderer.dispose();
        renderer.domElement.remove();
      };
    }

    boot();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return <div ref={mountRef} className="three-stage" aria-hidden="true" />;
}
