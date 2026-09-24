"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const YELLOW = 0xf4b700;
const YELLOW_SOFT = 0xffd54d;
const BLUE = 0x2b67ff;
const RED = 0xd64135;
const STEEL = 0x6f7d95;
const DARK = 0x080d1a;
const DARK_STEEL = 0x141b29;

const CABLE_COLORS = [0x171d28, YELLOW, BLUE, RED, 0x7b8799, 0x252d3d];

export default function ElectricalScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    const mobileProfile =
      Math.min(window.innerWidth, mount.clientWidth || window.innerWidth) < 820 ||
      coarsePointer.matches;

    const detail = mobileProfile
      ? {
          mainSegments: 176,
          radialSegments: 7,
          sampleCount: 96,
          sheathSegments: 132,
          sheathRadial: 9,
          branchSegments: 72,
          branchRadial: 6,
          clampSegments: 18,
          torusSegments: 30,
          particleCount: 150,
          arcCount: 2,
          arcPoints: 14,
          maxPixelRatio: 1.15,
          targetFrameMs: 1000 / 40,
        }
      : {
          mainSegments: 360,
          radialSegments: 10,
          sampleCount: 180,
          sheathSegments: 300,
          sheathRadial: 16,
          branchSegments: 150,
          branchRadial: 9,
          clampSegments: 28,
          torusSegments: 38,
          particleCount: 420,
          arcCount: 4,
          arcPoints: 24,
          maxPixelRatio: 1.65,
          targetFrameMs: 0,
        };

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(DARK, 0.072);

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
    camera.position.set(0, 0, 8.4);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !mobileProfile && window.devicePixelRatio < 2,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, detail.maxPixelRatio));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.16;
    mount.appendChild(renderer.domElement);

    const root = new THREE.Group();
    const network = new THREE.Group();
    root.add(network);
    scene.add(root);

    scene.add(new THREE.HemisphereLight(0xaebdd8, 0x050811, 1.15));

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.1);
    keyLight.position.set(4.5, 5.5, 7);
    scene.add(keyLight);

    const warmLight = new THREE.PointLight(YELLOW, 18, 10, 2);
    warmLight.position.set(2.8, 2.7, 2.8);
    scene.add(warmLight);

    if (!mobileProfile) {
      const blueLight = new THREE.PointLight(BLUE, 7, 8, 2);
      blueLight.position.set(-2.8, -1.8, 1.3);
      scene.add(blueLight);
    }

    const backbone = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.65, 5.0, -0.55),
      new THREE.Vector3(1.05, 4.1, 0.08),
      new THREE.Vector3(1.8, 3.0, 0.35),
      new THREE.Vector3(0.75, 2.0, -0.25),
      new THREE.Vector3(1.45, 0.95, -0.52),
      new THREE.Vector3(0.45, -0.15, 0.18),
      new THREE.Vector3(1.18, -1.25, 0.42),
      new THREE.Vector3(0.2, -2.35, -0.15),
      new THREE.Vector3(0.9, -3.45, -0.48),
      new THREE.Vector3(0.35, -5.0, 0.08),
    ]);
    backbone.curveType = "catmullrom";
    backbone.tension = 0.42;

    const sampleCount = detail.sampleCount;
    const frames = backbone.computeFrenetFrames(sampleCount, false);
    const cableCurves: any[] = [];
    const cableMeshes: any[] = [];

    const cableMaterial = (color: number, index: number) =>
      new THREE.MeshStandardMaterial({
        color,
        metalness: index === 0 ? 0.5 : 0.16,
        roughness: index === 0 ? 0.48 : 0.36,
        emissive: color === YELLOW ? 0x332500 : 0x000000,
        emissiveIntensity: color === YELLOW ? 0.42 : 0,
      });

    CABLE_COLORS.forEach((color, cableIndex) => {
      const points = [];
      const phase = (cableIndex / CABLE_COLORS.length) * Math.PI * 2;

      for (let index = 0; index <= sampleCount; index += 1) {
        const t = index / sampleCount;
        const point = backbone.getPointAt(t);
        const frameIndex = Math.min(index, sampleCount - 1);
        const normal = frames.normals[frameIndex];
        const binormal = frames.binormals[frameIndex];
        const twist = phase + t * Math.PI * 12;
        const bundleRadius = cableIndex === 0 ? 0.12 : 0.205;

        const offset = normal
          .clone()
          .multiplyScalar(Math.cos(twist) * bundleRadius)
          .add(binormal.clone().multiplyScalar(Math.sin(twist) * bundleRadius));

        points.push(point.clone().add(offset));
      }

      const curve = new THREE.CatmullRomCurve3(points);
      curve.curveType = "catmullrom";
      curve.tension = 0.44;
      cableCurves.push(curve);

      const mesh = new THREE.Mesh(
        new THREE.TubeGeometry(
          curve,
          detail.mainSegments,
          cableIndex === 0 ? 0.07 : 0.065,
          detail.radialSegments,
          false,
        ),
        cableMaterial(color, cableIndex),
      );
      network.add(mesh);
      cableMeshes.push(mesh);
    });

    const sheathMaterial = mobileProfile
      ? new THREE.MeshStandardMaterial({
          color: 0x8793a8,
          metalness: 0.08,
          roughness: 0.3,
          transparent: true,
          opacity: 0.065,
          depthWrite: false,
          side: THREE.DoubleSide,
        })
      : new THREE.MeshPhysicalMaterial({
          color: 0x8793a8,
          metalness: 0.04,
          roughness: 0.18,
          transmission: 0.15,
          transparent: true,
          opacity: 0.085,
          depthWrite: false,
          side: THREE.DoubleSide,
        });

    const sheath = new THREE.Mesh(
      new THREE.TubeGeometry(
        backbone,
        detail.sheathSegments,
        0.34,
        detail.sheathRadial,
        false,
      ),
      sheathMaterial,
    );
    network.add(sheath);

    if (!mobileProfile) {
      const sheathWire = new THREE.Mesh(
        new THREE.TubeGeometry(backbone, 260, 0.355, 8, false),
        new THREE.MeshBasicMaterial({
          color: 0x5f6a7e,
          transparent: true,
          opacity: 0.09,
          wireframe: true,
          depthWrite: false,
        }),
      );
      network.add(sheathWire);
    }

    const clampMaterial = new THREE.MeshStandardMaterial({
      color: 0x323c50,
      metalness: 0.95,
      roughness: 0.2,
    });
    const clampEdgeMaterial = new THREE.MeshStandardMaterial({
      color: STEEL,
      metalness: 1,
      roughness: 0.16,
      emissive: 0x111522,
      emissiveIntensity: 0.5,
    });

    const clamps: any[] = [];
    const junctionTs = [0.14, 0.33, 0.54, 0.75, 0.91];

    junctionTs.forEach((t, index) => {
      const point = backbone.getPointAt(t);
      const tangent = backbone.getTangentAt(t).normalize();
      const group = new THREE.Group();
      group.position.copy(point);
      group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);

      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.43, 0.43, 0.16, detail.clampSegments, 1, false),
        clampMaterial,
      );
      group.add(body);

      const edgeA = new THREE.Mesh(
        new THREE.TorusGeometry(0.43, 0.025, 7, detail.torusSegments),
        clampEdgeMaterial,
      );
      edgeA.rotation.x = Math.PI / 2;
      edgeA.position.y = 0.081;
      group.add(edgeA);

      const edgeB = edgeA.clone();
      edgeB.position.y = -0.081;
      group.add(edgeB);

      const indicator = new THREE.Mesh(
        new THREE.BoxGeometry(0.09, 0.19, 0.035),
        new THREE.MeshBasicMaterial({ color: index % 2 ? YELLOW_SOFT : YELLOW }),
      );
      indicator.position.set(0.43, 0, 0);
      group.add(indicator);

      network.add(group);
      clamps.push(group);
    });

    const terminalGroup = new THREE.Group();
    terminalGroup.position.copy(backbone.getPointAt(0.055));

    const terminalCore = new THREE.Mesh(
      new THREE.CylinderGeometry(0.6, 0.6, 0.46, 30),
      new THREE.MeshStandardMaterial({
        color: DARK_STEEL,
        metalness: 0.95,
        roughness: 0.2,
      }),
    );
    terminalCore.rotation.z = Math.PI / 2;
    terminalGroup.add(terminalCore);

    [0.72, 0.9, 1.1].forEach((radius, index) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(
          radius,
          index === 1 ? 0.03 : 0.018,
          mobileProfile ? 6 : 8,
          mobileProfile ? 42 : 72,
        ),
        new THREE.MeshBasicMaterial({
          color: index === 1 ? YELLOW : STEEL,
          transparent: true,
          opacity: index === 1 ? 0.85 : 0.35,
        }),
      );
      ring.rotation.set(index * 0.45, Math.PI / 2 + index * 0.2, index * 0.7);
      terminalGroup.add(ring);
    });
    network.add(terminalGroup);

    const createGlowTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 128;
      const context = canvas.getContext("2d");
      if (!context) return null;

      const gradient = context.createRadialGradient(64, 64, 2, 64, 64, 62);
      gradient.addColorStop(0, "rgba(255,225,95,1)");
      gradient.addColorStop(0.2, "rgba(244,183,0,.85)");
      gradient.addColorStop(0.55, "rgba(244,183,0,.22)");
      gradient.addColorStop(1, "rgba(244,183,0,0)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, 128, 128);

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };

    const glowTexture = createGlowTexture();

    const pulseObjects: Array<{
      group: any;
      curve: any;
      offset: number;
      speed: number;
    }> = [];

    const makePulse = (curve: any, offset: number, speed: number, scale = 1) => {
      const pulse = new THREE.Group();

      const core = new THREE.Mesh(
        new THREE.SphereGeometry(0.065 * scale, 14, 14),
        new THREE.MeshBasicMaterial({ color: YELLOW_SOFT }),
      );
      pulse.add(core);

      if (glowTexture) {
        const sprite = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: glowTexture,
            color: YELLOW,
            transparent: true,
            opacity: 0.78,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          }),
        );
        sprite.scale.setScalar(0.72 * scale);
        pulse.add(sprite);
      }

      network.add(pulse);
      pulseObjects.push({ group: pulse, curve, offset, speed });
      return pulse;
    };

    cableCurves.forEach((curve, cableIndex) => {
      makePulse(
        curve,
        cableIndex * 0.13,
        0.025 + cableIndex * 0.002,
        cableIndex === 1 ? 1.15 : 0.72,
      );
      if (!mobileProfile) {
        makePulse(curve, 0.45 + cableIndex * 0.09, 0.021 + cableIndex * 0.0014, 0.62);
      }
    });

    const branchGroups: Array<{
      group: any;
      start: number;
      curves: any[];
      endpoint: any;
      connectorMaterial: any;
    }> = [];

    const branchDefinitions = [
      { t: 0.31, end: new THREE.Vector3(-2.45, 0.9, 0.65), start: 0.14 },
      { t: 0.52, end: new THREE.Vector3(2.65, -0.45, -0.15), start: 0.36 },
      { t: 0.72, end: new THREE.Vector3(-2.25, -1.1, 0.55), start: 0.58 },
    ];

    branchDefinitions.forEach((definition, branchIndex) => {
      const anchor = backbone.getPointAt(definition.t);
      const tangent = backbone.getTangentAt(definition.t).normalize();
      const group = new THREE.Group();
      group.position.copy(anchor);

      const localEnd = definition.end.clone();
      const branchCurves: any[] = [];

      [0, 1, 2].forEach((strandIndex) => {
        const lateral = (strandIndex - 1) * 0.12;
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, lateral, 0),
          tangent.clone().multiplyScalar(0.55).add(new THREE.Vector3(0, lateral * 2, 0.22)),
          localEnd.clone().multiplyScalar(0.52).add(new THREE.Vector3(0, lateral, 0.3)),
          localEnd.clone().add(new THREE.Vector3(0, lateral, 0)),
        ]);
        curve.curveType = "catmullrom";
        curve.tension = 0.38;
        branchCurves.push(curve);

        const color = strandIndex === 1 ? YELLOW : strandIndex === 0 ? 0x202a3a : BLUE;
        const mesh = new THREE.Mesh(
          new THREE.TubeGeometry(
            curve,
            detail.branchSegments,
            0.05,
            detail.branchRadial,
            false,
          ),
          cableMaterial(color, strandIndex === 1 ? 1 : 4),
        );
        group.add(mesh);
      });

      const connectorMaterial = new THREE.MeshStandardMaterial({
        color: 0x222b3c,
        metalness: 0.94,
        roughness: 0.22,
        emissive: YELLOW,
        emissiveIntensity: 0.04,
      });

      const connector = new THREE.Mesh(
        new THREE.BoxGeometry(0.48, 0.48, 0.48),
        connectorMaterial,
      );
      connector.rotation.set(0.25, branchIndex * 0.55, 0.3);
      group.add(connector);

      const connectorRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.39, 0.025, 8, 36),
        new THREE.MeshBasicMaterial({ color: YELLOW, transparent: true, opacity: 0.55 }),
      );
      connectorRing.rotation.set(Math.PI / 2, branchIndex * 0.4, 0);
      group.add(connectorRing);

      const endpoint = new THREE.Group();
      endpoint.position.copy(localEnd);

      const socket = new THREE.Mesh(
        new THREE.CylinderGeometry(0.28, 0.34, 0.55, 20),
        clampMaterial,
      );
      socket.rotation.z = Math.PI / 2;
      endpoint.add(socket);

      const socketGlow = new THREE.Mesh(
        new THREE.TorusGeometry(0.31, 0.025, 7, 30),
        new THREE.MeshBasicMaterial({ color: branchIndex === 1 ? YELLOW_SOFT : YELLOW }),
      );
      socketGlow.rotation.y = Math.PI / 2;
      endpoint.add(socketGlow);

      group.add(endpoint);
      network.add(group);

      branchCurves.forEach((curve, curveIndex) => {
        if (mobileProfile && curveIndex !== 1) return;
        const pulse = makePulse(
          curve,
          branchIndex * 0.17 + curveIndex * 0.21,
          0.035 + curveIndex * 0.003,
          0.55,
        );
        group.add(pulse);
        network.remove(pulse);
      });

      branchGroups.push({
        group,
        start: definition.start,
        curves: branchCurves,
        endpoint,
        connectorMaterial,
      });
    });

    const arcGroup = new THREE.Group();
    network.add(arcGroup);
    const arcLines: any[] = [];

    for (let arcIndex = 0; arcIndex < detail.arcCount; arcIndex += 1) {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(detail.arcPoints * 3), 3),
      );
      const material = new THREE.LineBasicMaterial({
        color: arcIndex % 2 ? YELLOW_SOFT : YELLOW,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Line(geometry, material);
      arcGroup.add(line);
      arcLines.push(line);
    }

    const regenerateArcs = (time: number, activeIndex: number) => {
      const seedBase = Math.floor(time / 110) + activeIndex * 47;
      arcLines.forEach((line, lineIndex) => {
        const positions = line.geometry.attributes.position.array as Float32Array;
        const angle = lineIndex * 1.55 + activeIndex * 0.6;
        const end = new THREE.Vector3(
          Math.cos(angle) * (0.6 + lineIndex * 0.08),
          (lineIndex - 1.5) * 0.22,
          Math.sin(angle) * (0.6 + lineIndex * 0.08),
        );

        for (let pointIndex = 0; pointIndex < detail.arcPoints; pointIndex += 1) {
          const t = pointIndex / (detail.arcPoints - 1);
          const pseudo = Math.sin((seedBase + pointIndex * 13 + lineIndex * 31) * 12.9898) * 43758.5453;
          const noise = (pseudo - Math.floor(pseudo) - 0.5) * 0.16 * Math.sin(Math.PI * t);

          positions[pointIndex * 3] = end.x * t + noise;
          positions[pointIndex * 3 + 1] = end.y * t + noise * 0.65;
          positions[pointIndex * 3 + 2] = end.z * t - noise * 0.8;
        }

        line.geometry.attributes.position.needsUpdate = true;
      });
    };

    const particleCount = detail.particleCount;
    const particlePositions = new Float32Array(particleCount * 3);
    let seed = 29;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    for (let index = 0; index < particleCount; index += 1) {
      particlePositions[index * 3] = (random() - 0.38) * 12;
      particlePositions[index * 3 + 1] = (random() - 0.5) * 12;
      particlePositions[index * 3 + 2] = (random() - 0.5) * 7 - 1.6;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        color: 0x66728a,
        size: 0.022,
        transparent: true,
        opacity: 0.42,
        sizeAttenuation: true,
      }),
    );
    root.add(particles);

    const depthRings = new THREE.Group();
    const depthRingPositions = mobileProfile ? [-1.4, 1.0] : [-3.4, -1.6, 0.4, 2.4];
    depthRingPositions.forEach((z, index) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(
          2.6 + index * 0.45,
          0.012,
          mobileProfile ? 5 : 6,
          mobileProfile ? 48 : 96,
        ),
        new THREE.MeshBasicMaterial({
          color: index === 2 ? YELLOW : 0x536078,
          transparent: true,
          opacity: index === 2 ? 0.16 : 0.08,
        }),
      );
      ring.position.set(1, (index - 1.5) * 1.6, z);
      ring.rotation.set(0.7 + index * 0.15, 0.45, index * 0.42);
      depthRings.add(ring);
    });
    root.add(depthRings);

    let progress = 0;
    let targetProgress = 0;
    let pointerX = 0;
    let pointerY = 0;
    let frame = 0;
    let lastArcTick = -1;
    let lastRenderTime = 0;

    const smoothStep = (edge0: number, edge1: number, value: number) => {
      const x = THREE.MathUtils.clamp((value - edge0) / Math.max(edge1 - edge0, 0.0001), 0, 1);
      return x * x * (3 - 2 * x);
    };

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

      const mobile = width < 820 || coarsePointer.matches;
      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, mobile ? 1.15 : detail.maxPixelRatio),
      );
      root.position.x = mobile ? 0.08 : 0;
      root.position.y = mobile ? -0.32 : 0;
      root.scale.setScalar(mobile ? 0.68 : width < 1180 ? 0.92 : 1);
      camera.position.z = mobile ? 11.6 : 8.4;
    };

    const renderScene = (time = 0) => {
      const still = reducedMotion.matches;

      if (
        !still &&
        mobileProfile &&
        detail.targetFrameMs > 0 &&
        time - lastRenderTime < detail.targetFrameMs
      ) {
        frame = window.requestAnimationFrame(renderScene);
        return;
      }
      lastRenderTime = time;
      progress = still ? targetProgress : THREE.MathUtils.lerp(progress, targetProgress, 0.065);

      const activeBranch = Math.min(2, Math.max(0, Math.floor(progress * 3.2)));
      const activeT = branchDefinitions[activeBranch].t;
      const activePoint = backbone.getPointAt(activeT);

      branchGroups.forEach((branch, index) => {
        const reveal = smoothStep(branch.start, branch.start + 0.13, progress);
        const scale = Math.max(0.015, reveal);
        branch.group.scale.setScalar(scale);
        branch.group.visible = reveal > 0.01;
        branch.endpoint.rotation.x = still ? 0.2 : Math.sin(time * 0.0012 + index) * 0.18;
        branch.endpoint.rotation.y = still ? 0.25 : time * 0.00035 * (index % 2 ? -1 : 1);
        branch.connectorMaterial.emissiveIntensity =
          0.05 + (index === activeBranch ? 0.78 * (0.6 + 0.4 * Math.sin(time * 0.006)) : 0.04);
      });

      pulseObjects.forEach((pulse, index) => {
        const t = (pulse.offset + time * 0.001 * pulse.speed + progress * 0.32) % 1;
        pulse.group.position.copy(pulse.curve.getPointAt(t));
        const tangent = pulse.curve.getTangentAt(t).normalize();
        pulse.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
        const pulseScale = 0.86 + Math.sin(time * 0.009 + index) * 0.14;
        pulse.group.scale.setScalar(pulseScale);
      });

      clamps.forEach((clamp, index) => {
        clamp.rotation.y = still ? 0 : Math.sin(time * 0.0007 + index * 1.4) * 0.08;
      });

      cableMeshes.forEach((mesh, index) => {
        const separation = smoothStep(0.22, 0.56, progress) * (1 - smoothStep(0.78, 0.98, progress));
        const angle = (index / cableMeshes.length) * Math.PI * 2;
        mesh.position.x = Math.cos(angle) * separation * 0.12;
        mesh.position.z = Math.sin(angle) * separation * 0.12;
      });

      terminalGroup.rotation.y = still ? 0.3 : time * 0.00025;
      terminalGroup.rotation.x = still ? 0.1 : Math.sin(time * 0.00045) * 0.12;

      arcGroup.position.copy(activePoint);
      const arcTick = Math.floor(time / 110);
      if (arcTick !== lastArcTick) {
        regenerateArcs(time, activeBranch);
        lastArcTick = arcTick;
      }

      arcLines.forEach((line, index) => {
        const material = line.material;
        const mobileArcStrength = mobileProfile ? 0.46 : 0.72;
        material.opacity = still
          ? 0.12
          : Math.max(0, Math.sin(time * 0.012 + index * 1.8)) * mobileArcStrength;
      });

      if (!still) {
        particles.rotation.y = time * 0.000018;
        depthRings.rotation.z = time * 0.000025;
      }

      const mobileFrame = window.innerWidth < 820 || coarsePointer.matches;
      const sceneTurn = progress * (mobileFrame ? 0.38 : 0.72);
      network.rotation.y = sceneTurn + (mobileFrame ? 0 : pointerX * 0.08);
      network.rotation.z = -0.05 + Math.sin(progress * Math.PI * 2) * 0.055;
      network.position.y = Math.sin(progress * Math.PI) * 0.16;

      const xDrift = mobileFrame ? 0 : pointerX * 0.2;
      const yDrift = mobileFrame ? 0 : -pointerY * 0.11;
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, xDrift, 0.04);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, yDrift, 0.04);
      camera.position.z = THREE.MathUtils.lerp(
        camera.position.z,
        (mobileFrame ? 11.6 : 8.4) -
          Math.sin(progress * Math.PI) * (mobileFrame ? 0.45 : 0.72),
        0.035,
      );
      camera.lookAt(0.75, -0.15, -0.2);

      warmLight.position.copy(activePoint).add(new THREE.Vector3(0.3, 0.2, 1.7));
      warmLight.intensity = 15 + Math.sin(time * 0.007) * 2.5;
      renderer.render(scene, camera);

      if (!still) frame = window.requestAnimationFrame(renderScene);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        if (frame) window.cancelAnimationFrame(frame);
        frame = 0;
        return;
      }

      if (!reducedMotion.matches && !frame) {
        lastRenderTime = 0;
        frame = window.requestAnimationFrame(renderScene);
      }
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
    if (!mobileProfile) {
      window.addEventListener("pointermove", updatePointer, { passive: true });
    }
    document.addEventListener("visibilitychange", handleVisibility);
    reducedMotion.addEventListener("change", handleMotionPreference);

    if (reducedMotion.matches) renderScene();
    else frame = window.requestAnimationFrame(renderScene);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", resize);
      if (!mobileProfile) {
        window.removeEventListener("pointermove", updatePointer);
      }
      document.removeEventListener("visibilitychange", handleVisibility);
      reducedMotion.removeEventListener("change", handleMotionPreference);
      document.documentElement.style.removeProperty("--scroll-progress");

      scene.traverse((object: unknown) => {
        if (!object || typeof object !== "object") return;
        const candidate = object as {
          geometry?: { dispose: () => void };
          material?: { dispose: () => void } | Array<{ dispose: () => void }>;
        };
        candidate.geometry?.dispose();
        const material = candidate.material;
        if (Array.isArray(material)) material.forEach((item) => item.dispose());
        else material?.dispose();
      });

      glowTexture?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div className="three-scene" ref={mountRef} aria-hidden="true" />;
}
