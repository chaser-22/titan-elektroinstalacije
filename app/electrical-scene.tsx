"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const YELLOW = 0xf4b700;
const YELLOW_SOFT = 0xffdf68;
const BLUE = 0x3c79ff;
const CYAN = 0x50d8ff;
const RED = 0xe24343;
const GREEN = 0x66e08a;
const STEEL = 0x65728a;
const DARK = 0x070b14;
const PANEL = 0x151d2b;
const MODULE = 0x242d3d;

type CableRoute = {
  curve: any;
  line: any;
  material: any;
  start: number;
  end: number;
  pulse: any;
  pulseOffset: number;
  color: number;
  pulsePoint: any;
  tangent: any;
};

type StatusModule = {
  group: any;
  leds: any[];
  start: number;
  basePosition: any;
  phase: number;
};

export default function ElectricalScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let cleanup = () => {};

    const start = async () => {
      const [{ gsap }, scrollModule] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);

      if (disposed) return;

      const ScrollTrigger = scrollModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
      const coarsePointer = window.matchMedia("(pointer: coarse)");
      const viewportWidth = Math.min(
        window.innerWidth,
        mount.clientWidth || window.innerWidth,
      );
      const mobile = viewportWidth < 820 || coarsePointer.matches;
      const phone = viewportWidth < 520;

      const detail = mobile
        ? {
            cableSegments: phone ? 34 : 42,
            cableRadial: phone ? 5 : 6,
            particles: phone ? 44 : 70,
            maxPixelRatio: phone ? 1.0 : 1.15,
            targetFrameMs: 1000 / 40,
            terminalCount: phone ? 7 : 8,
          }
        : {
            cableSegments: 82,
            cableRadial: 8,
            particles: 150,
            maxPixelRatio: 1.7,
            targetFrameMs: 0,
            terminalCount: 12,
          };

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(DARK, mobile ? 0.055 : 0.047);

      const camera = new THREE.PerspectiveCamera(
        phone ? 45 : mobile ? 43 : 38,
        1,
        0.1,
        60,
      );
      camera.position.set(0, 0.1, phone ? 12.15 : mobile ? 11.7 : 9.2);

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !mobile,
        powerPreference: "high-performance",
      });
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, detail.maxPixelRatio));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = mobile ? 1.18 : 1.28;

      if (!mobile) {
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      }

      mount.appendChild(renderer.domElement);

      const sceneRoot = new THREE.Group();
      const scrollRig = new THREE.Group();
      const panelRig = new THREE.Group();
      const ambientRig = new THREE.Group();
      sceneRoot.add(scrollRig, ambientRig);
      scrollRig.add(panelRig);
      scene.add(sceneRoot);

      scene.add(new THREE.HemisphereLight(0xaab8d2, 0x050811, mobile ? 1.3 : 1.55));

      const key = new THREE.DirectionalLight(0xffffff, mobile ? 2.6 : 3.6);
      key.position.set(4, 5.5, 7);
      if (!mobile) {
        key.castShadow = true;
        key.shadow.mapSize.set(1024, 1024);
        key.shadow.camera.left = -6;
        key.shadow.camera.right = 6;
        key.shadow.camera.top = 7;
        key.shadow.camera.bottom = -7;
      }
      scene.add(key);

      const warm = new THREE.PointLight(YELLOW, mobile ? 16 : 21, 10, 2);
      warm.position.set(2.8, 2.7, 3.2);
      scene.add(warm);

      const cool = new THREE.PointLight(BLUE, mobile ? 6 : 9, 9, 2);
      cool.position.set(-3.2, -1.4, 2.2);
      scene.add(cool);

      const metal = new THREE.MeshStandardMaterial({
        color: 0x5e697d,
        metalness: 0.94,
        roughness: 0.25,
      });
      const darkMetal = new THREE.MeshStandardMaterial({
        color: PANEL,
        metalness: 0.74,
        roughness: 0.32,
      });
      const moduleMaterial = new THREE.MeshStandardMaterial({
        color: 0x202938,
        metalness: 0.42,
        roughness: 0.4,
      });
      const blackPlastic = new THREE.MeshStandardMaterial({
        color: 0x0d121d,
        metalness: 0.08,
        roughness: 0.5,
      });
      const whitePlastic = new THREE.MeshStandardMaterial({
        color: 0xd9dde4,
        metalness: 0.06,
        roughness: 0.36,
      });
      const copper = new THREE.MeshStandardMaterial({
        color: 0xc98336,
        metalness: 0.84,
        roughness: 0.26,
        emissive: 0x2a1000,
        emissiveIntensity: 0.12,
      });

      const setShadow = (object: any) => {
        if (!mobile && object instanceof THREE.Mesh) {
          object.castShadow = true;
          object.receiveShadow = true;
        }
      };

      const box = (
        width: number,
        height: number,
        depth: number,
        material: any,
        position: [number, number, number],
      ) => {
        const mesh = new THREE.Mesh(
          new THREE.BoxGeometry(width, height, depth),
          material,
        );
        mesh.position.set(...position);
        setShadow(mesh);
        return mesh;
      };

      const createTextTexture = (
        text: string,
        fg = "#f7f8fb",
        bg = "rgba(0,0,0,0)",
      ) => {
        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 128;
        const context = canvas.getContext("2d");
        if (!context) return null;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = bg;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = fg;
        context.font = "800 58px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(text, canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        return texture;
      };

      const addLabel = (
        parent: any,
        text: string,
        width: number,
        position: [number, number, number],
        fg = "#f7f8fb",
      ) => {
        const texture = createTextTexture(text, fg);
        if (!texture) return null;

        const sprite = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthWrite: false,
          }),
        );
        sprite.scale.set(width, width * 0.25, 1);
        sprite.position.set(...position);
        parent.add(sprite);
        return { sprite, texture };
      };

      const labelTextures: any[] = [];

      // Cabinet plate + structural frame.
      const backplate = box(5.8, 8.1, 0.18, darkMetal, [0.7, -0.1, -0.48]);
      backplate.receiveShadow = !mobile;
      panelRig.add(backplate);

      const panelGlow = box(
        5.45,
        7.72,
        0.025,
        new THREE.MeshBasicMaterial({
          color: 0x31415a,
          transparent: true,
          opacity: 0.05,
          blending: THREE.AdditiveBlending,
        }),
        [0.7, -0.1, -0.36],
      );
      panelRig.add(panelGlow);

      [
        [0.7, 4.05, 0.05, 5.95, 0.13],
        [0.7, -4.25, 0.05, 5.95, 0.13],
        [-2.25, -0.1, 0.05, 0.13, 8.2],
        [3.65, -0.1, 0.05, 0.13, 8.2],
      ].forEach(([x, y, z, width, height]) => {
        panelRig.add(box(width, height, 0.24, metal, [x, y, z]));
      });

      // Cabinet screws.
      const screwMaterial = new THREE.MeshStandardMaterial({
        color: 0x8994a7,
        metalness: 1,
        roughness: 0.18,
      });
      [
        [-2.05, 3.83],
        [3.45, 3.83],
        [-2.05, -4.03],
        [3.45, -4.03],
      ].forEach(([x, y]) => {
        const screw = new THREE.Mesh(
          new THREE.CylinderGeometry(0.07, 0.07, 0.08, 14),
          screwMaterial,
        );
        screw.rotation.x = Math.PI / 2;
        screw.position.set(x, y, 0.15);
        panelRig.add(screw);
      });

      // DIN rails.
      const railYs = [2.35, 0.55, -1.32, -3.08];
      railYs.forEach((y) => {
        const rail = box(5.1, 0.12, 0.25, metal, [0.7, y, 0.15]);
        panelRig.add(rail);

        const railLine = box(
          5.0,
          0.026,
          0.03,
          new THREE.MeshBasicMaterial({
            color: 0xaab5c7,
            transparent: true,
            opacity: 0.22,
          }),
          [0.7, y, 0.295],
        );
        panelRig.add(railLine);
      });

      // Wire ducts keep control wiring visually organized between DIN rails.
      const wireDuctMaterial = new THREE.MeshStandardMaterial({
        color: 0x111925,
        metalness: 0.12,
        roughness: 0.62,
      });
      const ductEdgeMaterial = new THREE.MeshBasicMaterial({
        color: 0x69758a,
        transparent: true,
        opacity: 0.16,
      });
      const ductYs = [1.48, -0.38, -2.2];

      ductYs.forEach((y) => {
        const duct = box(5.0, 0.24, 0.28, wireDuctMaterial, [0.7, y, 0.34]);
        panelRig.add(duct);

        panelRig.add(
          box(5.0, 0.018, 0.035, ductEdgeMaterial, [0.7, y + 0.12, 0.49]),
        );
        panelRig.add(
          box(5.0, 0.018, 0.035, ductEdgeMaterial, [0.7, y - 0.12, 0.49]),
        );

        const slotCount = mobile ? 12 : 18;
        for (let index = 0; index < slotCount; index += 1) {
          const slotX = -1.58 + index * (4.56 / Math.max(1, slotCount - 1));
          panelRig.add(
            box(
              0.055,
              0.12,
              0.025,
              new THREE.MeshBasicMaterial({
                color: 0x050912,
                transparent: true,
                opacity: 0.72,
              }),
              [slotX, y, 0.495],
            ),
          );
        }
      });

      // Copper busbars.
      const busBars: any[] = [];
      [-1.87, -1.66, -1.45].forEach((x, index) => {
        const bar = box(
          0.11,
          2.72,
          0.12,
          copper,
          [x, 0.12, 0.34 + index * 0.015],
        );
        panelRig.add(bar);
        busBars.push(bar);
      });

      const busCover = box(
        0.72,
        3.0,
        0.14,
        new THREE.MeshPhysicalMaterial({
          color: 0x8fa0b8,
          roughness: 0.16,
          metalness: 0.02,
          transparent: true,
          opacity: 0.1,
          transmission: mobile ? 0 : 0.25,
          depthWrite: false,
        }),
        [-1.66, 0.12, 0.51],
      );
      panelRig.add(busCover);

      const busLight = new THREE.PointLight(YELLOW, 0, 4.5, 2);
      busLight.position.set(-1.66, 0.15, 1.0);
      panelRig.add(busLight);

      const scanMaterial = new THREE.MeshBasicMaterial({
        color: CYAN,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const scanBeam = box(4.95, 0.026, 0.025, scanMaterial, [0.76, -3.55, 0.5]);
      panelRig.add(scanBeam);

      const glowTexture = (() => {
        const canvas = document.createElement("canvas");
        canvas.width = 128;
        canvas.height = 128;
        const context = canvas.getContext("2d");
        if (!context) return null;
        const gradient = context.createRadialGradient(64, 64, 2, 64, 64, 62);
        gradient.addColorStop(0, "rgba(255,236,150,1)");
        gradient.addColorStop(0.18, "rgba(244,183,0,.9)");
        gradient.addColorStop(0.55, "rgba(244,183,0,.22)");
        gradient.addColorStop(1, "rgba(244,183,0,0)");
        context.fillStyle = gradient;
        context.fillRect(0, 0, 128, 128);
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        return texture;
      })();

      const createLed = (
        parent: any,
        color: number,
        position: [number, number, number],
        radius = 0.045,
      ) => {
        const material = new THREE.MeshStandardMaterial({
          color: 0x1b2230,
          emissive: color,
          emissiveIntensity: 0.02,
          roughness: 0.25,
        });
        const led = new THREE.Mesh(
          new THREE.SphereGeometry(radius, mobile ? 8 : 12, mobile ? 8 : 12),
          material,
        );
        led.position.set(...position);
        parent.add(led);
        return led;
      };

      const statusModules: StatusModule[] = [];

      const createModule = ({
        name,
        position,
        size,
        accent = YELLOW,
        start,
        ledCount = 3,
        lightFace = false,
      }: {
        name: string;
        position: [number, number, number];
        size: [number, number, number];
        accent?: number;
        start: number;
        ledCount?: number;
        lightFace?: boolean;
      }) => {
        const group = new THREE.Group();
        group.position.set(...position);

        const body = box(size[0], size[1], size[2], lightFace ? whitePlastic : moduleMaterial, [0, 0, 0]);
        group.add(body);

        const face = box(
          size[0] * 0.82,
          size[1] * 0.76,
          0.035,
          blackPlastic,
          [0, 0, size[2] / 2 + 0.021],
        );
        group.add(face);

        const stripeMaterial = new THREE.MeshStandardMaterial({
          color: accent,
          emissive: accent,
          emissiveIntensity: 0.08,
          roughness: 0.32,
        });
        const stripe = box(
          size[0] * 0.1,
          size[1] * 0.76,
          0.045,
          stripeMaterial,
          [-size[0] * 0.36, 0, size[2] / 2 + 0.05],
        );
        group.add(stripe);

        const leds: any[] = [];
        for (let index = 0; index < ledCount; index += 1) {
          const y = size[1] * 0.24 - index * Math.min(0.18, size[1] * 0.17);
          const led = createLed(
            group,
            index === 0 ? GREEN : index === 1 ? YELLOW : BLUE,
            [size[0] * 0.22, y, size[2] / 2 + 0.07],
            size[0] < 0.5 ? 0.025 : 0.035,
          );
          leds.push(led);
        }

        const label = addLabel(
          group,
          name,
          Math.max(0.48, size[0] * 0.72),
          [0, -size[1] * 0.24, size[2] / 2 + 0.073],
          lightFace ? "#10151e" : "#f5f7fb",
        );
        if (label) labelTextures.push(label.texture);

        panelRig.add(group);
        group.userData.basePosition = group.position.clone();
        group.userData.phase = statusModules.length * 0.83;
        statusModules.push({
          group,
          leds,
          start,
          basePosition: group.position.clone(),
          phase: statusModules.length * 0.83,
        });
        return group;
      };

      const breaker = createModule({
        name: "GLAVNI",
        position: [-1.35, 2.42, 0.55],
        size: [0.84, 1.24, 0.7],
        accent: YELLOW,
        start: 0.13,
        ledCount: 2,
        lightFace: true,
      });

      const breakerToggle = box(0.28, 0.5, 0.13, blackPlastic, [0, 0.08, 0.45]);
      breaker.add(breakerToggle);

      const psu = createModule({
        name: "24V",
        position: [-0.34, 2.42, 0.55],
        size: [0.78, 1.24, 0.7],
        accent: YELLOW,
        start: 0.22,
        ledCount: 2,
      });

      const plc = createModule({
        name: "PLC CPU",
        position: [0.7, 2.42, 0.58],
        size: [1.08, 1.36, 0.76],
        accent: YELLOW,
        start: 0.31,
        ledCount: 4,
      });

      const screenMaterial = new THREE.MeshStandardMaterial({
        color: 0x0e2432,
        emissive: CYAN,
        emissiveIntensity: 0.12,
        roughness: 0.2,
      });
      const plcScreen = box(0.52, 0.28, 0.035, screenMaterial, [0.09, 0.18, 0.4]);
      plc.add(plcScreen);

      const ioModules: any[] = [];
      const ioCount = mobile ? 3 : 4;
      for (let index = 0; index < ioCount; index += 1) {
        ioModules.push(
          createModule({
            name: index % 2 === 0 ? "I/O" : "DI/DO",
            position: [1.55 + index * 0.48, 2.42, 0.55],
            size: [0.4, 1.22, 0.68],
            accent: index % 2 === 0 ? BLUE : CYAN,
            start: 0.39 + index * 0.045,
            ledCount: mobile ? 3 : 5,
          }),
        );
      }

      // Contactors / relays.
      const relayGroups: any[] = [];
      const relayCount = mobile ? 3 : 4;
      for (let index = 0; index < relayCount; index += 1) {
        const relay = createModule({
          name: index === 0 ? "K1" : index === 1 ? "K2" : "REL",
          position: [-0.62 + index * 0.92, 0.55, 0.54],
          size: [0.72, 1.0, 0.64],
          accent: index % 2 ? BLUE : YELLOW,
          start: 0.49 + index * 0.045,
          ledCount: 2,
          lightFace: true,
        });
        relayGroups.push(relay);
      }

      // Terminal blocks.
      const terminalGroup = new THREE.Group();
      terminalGroup.position.set(0.72, -1.31, 0.48);
      panelRig.add(terminalGroup);

      const terminalMeshes: any[] = [];
      const terminalSpacing = mobile ? 0.53 : 0.38;
      for (let index = 0; index < detail.terminalCount; index += 1) {
        const x =
          (index - (detail.terminalCount - 1) / 2) * terminalSpacing;

        const material = new THREE.MeshStandardMaterial({
          color: index % 4 === 0 ? 0xd0d4da : index % 4 === 1 ? 0x304f9d : 0x343d4c,
          metalness: 0.08,
          roughness: 0.42,
          emissive: index % 4 === 1 ? BLUE : YELLOW,
          emissiveIntensity: 0.01,
        });

        const terminal = box(
          mobile ? 0.42 : 0.31,
          0.58,
          0.52,
          material,
          [x, 0, 0],
        );
        terminalGroup.add(terminal);
        terminalMeshes.push(terminal);

        const screw = new THREE.Mesh(
          new THREE.CylinderGeometry(0.055, 0.055, 0.035, 10),
          screwMaterial,
        );
        screw.rotation.x = Math.PI / 2;
        screw.position.set(x, 0.08, 0.285);
        terminalGroup.add(screw);
      }

      const terminalLabel = addLabel(
        terminalGroup,
        "KLEME / IZLAZI",
        mobile ? 1.6 : 1.9,
        [0, -0.53, 0.34],
        "#f4b700",
      );
      if (terminalLabel) labelTextures.push(terminalLabel.texture);

      // Lower cable gland row.
      const glandGroup = new THREE.Group();
      glandGroup.position.set(0.72, -3.1, 0.44);
      panelRig.add(glandGroup);

      const glandXs = mobile
        ? [-1.7, -0.85, 0, 0.85, 1.7]
        : [-2.05, -1.36, -0.68, 0, 0.68, 1.36, 2.05];

      glandXs.forEach((x, index) => {
        const outer = new THREE.Mesh(
          new THREE.CylinderGeometry(0.22, 0.22, 0.24, 16),
          metal,
        );
        outer.rotation.x = Math.PI / 2;
        outer.position.set(x, 0, 0);
        glandGroup.add(outer);

        const inner = new THREE.Mesh(
          new THREE.CylinderGeometry(0.12, 0.12, 0.26, 14),
          blackPlastic,
        );
        inner.rotation.x = Math.PI / 2;
        inner.position.set(x, 0, 0.04);
        glandGroup.add(inner);

        if (index < 3) {
          const marker = createLed(
            glandGroup,
            index === 0 ? YELLOW : index === 1 ? BLUE : RED,
            [x, 0.28, 0.08],
            0.028,
          );
          marker.material.emissiveIntensity = 0.4;
        }
      });

      // Network port block.
      const networkPort = createModule({
        name: "MREŽA",
        position: [2.52, 0.55, 0.52],
        size: [0.78, 0.78, 0.6],
        accent: CYAN,
        start: 0.6,
        ledCount: 2,
      });

      // Restrained zone labels: enough orientation without visual clutter.
      [
        ["NAPAJANJE", -0.72, 3.18, "#f4b700"],
        ["UPRAVLJANJE", 1.62, 3.18, "#dce5f4"],
      ].forEach(([text, x, y, color]) => {
        const label = addLabel(
          panelRig,
          String(text),
          mobile ? 0.86 : 1.0,
          [Number(x), Number(y), 0.28],
          String(color),
        );
        if (label) {
          label.sprite.material.opacity = 0.72;
          labelTextures.push(label.texture);
        }
      });

      // Cable construction.
      const cableRoutes: CableRoute[] = [];
      const unitY = new THREE.Vector3(0, 1, 0);

      const createCable = ({
        points,
        color,
        start,
        end,
        radius = mobile ? 0.06 : 0.055,
        pulseOffset = 0,
      }: {
        points: Array<[number, number, number]>;
        color: number;
        start: number;
        end: number;
        radius?: number;
        pulseOffset?: number;
      }) => {
        const curve = new THREE.CatmullRomCurve3(
          points.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
        );
        curve.curveType = "catmullrom";
        curve.tension = 0.36;

        const baseMaterial = new THREE.MeshStandardMaterial({
          color:
            color === YELLOW
              ? 0x514719
              : color === BLUE || color === CYAN
                ? 0x17243f
                : 0x242a35,
          roughness: 0.52,
          metalness: 0.1,
        });

        const tube = new THREE.Mesh(
          new THREE.TubeGeometry(
            curve,
            detail.cableSegments,
            radius,
            detail.cableRadial,
            false,
          ),
          baseMaterial,
        );
        panelRig.add(tube);

        const sampled = curve.getPoints(detail.cableSegments * 2);
        const geometry = new THREE.BufferGeometry().setFromPoints(sampled);
        geometry.setDrawRange(0, 0);

        const material = new THREE.LineBasicMaterial({
          color,
          transparent: true,
          opacity: 0.0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const line = new THREE.Line(geometry, material);
        panelRig.add(line);

        const pulse = new THREE.Group();
        const pulseCore = new THREE.Mesh(
          new THREE.SphereGeometry(
            mobile ? 0.075 : 0.062,
            mobile ? 8 : 12,
            mobile ? 8 : 12,
          ),
          new THREE.MeshBasicMaterial({ color: color === BLUE ? CYAN : YELLOW_SOFT }),
        );
        pulse.add(pulseCore);

        if (glowTexture) {
          const sprite = new THREE.Sprite(
            new THREE.SpriteMaterial({
              map: glowTexture,
              color: color === BLUE ? BLUE : YELLOW,
              transparent: true,
              opacity: 0.5,
              blending: THREE.AdditiveBlending,
              depthWrite: false,
            }),
          );
          sprite.scale.setScalar(mobile ? 0.62 : 0.5);
          pulse.add(sprite);
        }
        pulse.visible = false;
        panelRig.add(pulse);

        cableRoutes.push({
          curve,
          line,
          material,
          start,
          end,
          pulse,
          pulseOffset,
          color,
          pulsePoint: new THREE.Vector3(),
          tangent: new THREE.Vector3(),
        });

        return cableRoutes[cableRoutes.length - 1];
      };

      // Mains cables entering from the bottom and feeding the breaker / bus.
      createCable({
        points: [
          [-1.38, -5.2, 0.92],
          [-1.38, -3.18, 0.8],
          [-1.38, -2.2, 0.72],
          [-1.38, 1.48, 0.72],
          [-1.35, 2.0, 0.8],
        ],
        color: YELLOW,
        start: 0.0,
        end: 0.17,
        radius: mobile ? 0.085 : 0.072,
      });

      createCable({
        points: [
          [-1.16, -5.2, 0.9],
          [-1.16, -3.18, 0.78],
          [-1.16, -2.2, 0.7],
          [-1.16, 1.48, 0.7],
          [-0.72, 2.15, 0.8],
        ],
        color: BLUE,
        start: 0.03,
        end: 0.22,
        pulseOffset: 0.22,
      });

      // Breaker -> PSU -> PLC power.
      createCable({
        points: [
          [-0.95, 2.68, 0.86],
          [-0.95, 1.66, 0.75],
          [-0.05, 1.48, 0.72],
          [-0.05, 2.72, 0.86],
        ],
        color: YELLOW,
        start: 0.14,
        end: 0.29,
        pulseOffset: 0.35,
      });

      createCable({
        points: [
          [0.05, 2.64, 0.86],
          [0.05, 1.62, 0.74],
          [0.7, 1.48, 0.72],
          [0.7, 2.78, 0.88],
        ],
        color: YELLOW,
        start: 0.23,
        end: 0.36,
        pulseOffset: 0.1,
      });

      // PLC -> I/O data bus.
      for (let index = 0; index < ioCount; index += 1) {
        createCable({
          points: [
            [1.18, 2.47, 0.9],
            [1.18, 1.58, 0.74],
            [1.55 + index * 0.48, 1.48, 0.72],
            [1.55 + index * 0.48, 2.62, 0.88],
          ],
          color: index % 2 === 0 ? BLUE : CYAN,
          start: 0.34 + index * 0.035,
          end: 0.52 + index * 0.035,
          radius: mobile ? 0.045 : 0.038,
          pulseOffset: index * 0.18,
        });
      }

      // PLC / I/O down to contactors.
      for (let index = 0; index < relayCount; index += 1) {
        const sourceX = Math.min(2.8, 1.42 + index * 0.44);
        const targetX = -0.62 + index * 0.92;
        createCable({
          points: [
            [sourceX, 1.88, 0.86],
            [sourceX, 1.48, 0.74],
            [targetX, -0.38, 0.72],
            [targetX, 1.02, 0.86],
          ],
          color: index % 2 ? BLUE : YELLOW,
          start: 0.46 + index * 0.035,
          end: 0.66 + index * 0.035,
          radius: mobile ? 0.05 : 0.042,
          pulseOffset: 0.14 * index,
        });
      }

      // Contactors and network fan down to terminal row.
      const outputCableCount = phone ? 4 : mobile ? 5 : 6;
      for (let index = 0; index < outputCableCount; index += 1) {
        const sourceX =
          index === outputCableCount - 1
            ? 2.52
            : -0.7 + (index % relayCount) * 0.92;
        const terminalIndex = Math.round(
          (index / Math.max(1, outputCableCount - 1)) * (detail.terminalCount - 1),
        );
        const targetX =
          (terminalIndex - (detail.terminalCount - 1) / 2) * terminalSpacing + 0.72;

        createCable({
          points: [
            [sourceX, 0.08, 0.84],
            [sourceX, -0.38, 0.72],
            [targetX, -0.38, 0.72],
            [targetX, -1.0, 0.8],
          ],
          color:
            index === outputCableCount - 1
              ? CYAN
              : index % 2 === 0
                ? YELLOW
                : BLUE,
          start: 0.58 + index * 0.018,
          end: 0.79 + index * 0.018,
          radius: mobile ? 0.044 : 0.035,
          pulseOffset: index * 0.11,
        });
      }

      // Terminal row out through cable glands.
      const outgoingCount = phone ? 4 : mobile ? 5 : 6;
      for (let index = 0; index < outgoingCount; index += 1) {
        const terminalIndex = Math.round(
          (index / Math.max(1, outgoingCount - 1)) * (detail.terminalCount - 1),
        );
        const sourceX =
          (terminalIndex - (detail.terminalCount - 1) / 2) * terminalSpacing + 0.72;
        const targetX = glandXs[index];

        createCable({
          points: [
            [sourceX, -1.64, 0.8],
            [sourceX, -2.2, 0.72],
            [targetX + 0.72, -2.2, 0.72],
            [targetX + 0.72, -3.0, 0.78],
            [targetX + 0.72, -4.85, 0.9],
          ],
          color: index % 2 === 0 ? YELLOW : BLUE,
          start: 0.72 + index * 0.018,
          end: 0.92 + index * 0.012,
          radius: mobile ? 0.052 : 0.042,
          pulseOffset: index * 0.16,
        });
      }

      // Ambient wireframe field for depth / Spline-like product presentation.
      const orbitGroup = new THREE.Group();
      ambientRig.add(orbitGroup);
      const orbitCount = mobile ? 2 : 3;

      for (let index = 0; index < orbitCount; index += 1) {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(
            2.5 + index * 0.6,
            index === 0 ? 0.018 : 0.011,
            6,
            mobile ? 52 : 90,
          ),
          new THREE.MeshBasicMaterial({
            color: index % 2 === 0 ? YELLOW : STEEL,
            transparent: true,
            opacity: index === 0 ? 0.12 : 0.045,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          }),
        );
        ring.position.set(
          mobile ? 0.8 : 1.25,
          (index - (orbitCount - 1) / 2) * 1.15,
          -2.2 - index * 0.35,
        );
        ring.rotation.set(0.5 + index * 0.24, 0.42, index * 0.48);
        orbitGroup.add(ring);
      }

      const particlePositions = new Float32Array(detail.particles * 3);
      let seed = 37;
      const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
      };

      for (let index = 0; index < detail.particles; index += 1) {
        particlePositions[index * 3] = (random() - 0.48) * 11;
        particlePositions[index * 3 + 1] = (random() - 0.5) * 11;
        particlePositions[index * 3 + 2] = (random() - 0.5) * 5 - 1.5;
      }

      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(particlePositions, 3),
      );
      const particles = new THREE.Points(
        particleGeometry,
        new THREE.PointsMaterial({
          color: 0x7b879d,
          size: mobile ? 0.025 : 0.022,
          transparent: true,
          opacity: 0.24,
          sizeAttenuation: true,
        }),
      );
      ambientRig.add(particles);

      // State used by GSAP ScrollTrigger and render loop.
      // ScrollTrigger provides the target; the render loop performs the final interpolation.
      const scrollState = { progress: 0, target: 0 };
      let pointerX = 0;
      let pointerY = 0;
      let frame = 0;
      let lastRenderTime = 0;

      const easeProgress = (start: number, end: number, value: number) => {
        const x = THREE.MathUtils.clamp(
          (value - start) / Math.max(0.0001, end - start),
          0,
          1,
        );
        return x * x * (3 - 2 * x);
      };

      // Intro and scroll state are separated from Three.js transforms.
      // GSAP only updates simple scalar state; the render loop owns the 3D objects.
      const introState = { value: reducedMotion.matches ? 1 : 0 };
      const introTween = gsap.to(introState, {
        value: 1,
        duration: reducedMotion.matches ? 0 : 1.45,
        ease: "power3.out",
      });

      statusModules.forEach((module, index) => {
        gsap.fromTo(
          module.group.scale,
          { x: 0.9, y: 0.9, z: 0.9 },
          {
            x: 1,
            y: 1,
            z: 1,
            delay: reducedMotion.matches ? 0 : 0.12 + index * 0.025,
            duration: reducedMotion.matches ? 0 : 0.62,
            ease: "back.out(1.25)",
          },
        );
      });

      const scrollTrigger = ScrollTrigger.create({
        trigger: "#glavni-sadrzaj",
        start: "top top",
        end: "bottom bottom",
        invalidateOnRefresh: true,
        onUpdate: (self: any) => {
          scrollState.target = self.progress;
          if (reducedMotion.matches) {
            scrollState.progress = self.progress;
          }
        },
      });

      const idleTweens = [
        gsap.to(orbitGroup.rotation, {
          y: Math.PI * 2,
          duration: mobile ? 32 : 38,
          repeat: -1,
          ease: "none",
        }),
        gsap.to(ambientRig.rotation, {
          z: 0.045,
          duration: 5.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        }),
      ];

      const pointerMove = (event: PointerEvent) => {
        pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
        pointerY = (event.clientY / window.innerHeight - 0.5) * 2;
      };

      const resize = () => {
        const width = mount.clientWidth;
        const height = mount.clientHeight;
        camera.aspect = width / Math.max(height, 1);
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
        renderer.setPixelRatio(
          Math.min(
            window.devicePixelRatio,
            width < 520
              ? 1.0
              : width < 820 || coarsePointer.matches
                ? 1.15
                : detail.maxPixelRatio,
          ),
        );
      };

      const render = (time = 0) => {
        if (
          mobile &&
          detail.targetFrameMs > 0 &&
          time - lastRenderTime < detail.targetFrameMs &&
          !reducedMotion.matches
        ) {
          frame = window.requestAnimationFrame(render);
          return;
        }

        const delta = lastRenderTime
          ? Math.min(64, Math.max(1, time - lastRenderTime))
          : 16.7;
        lastRenderTime = time;

        if (!reducedMotion.matches) {
          const smoothing = 1 - Math.exp(-delta / (phone ? 82 : mobile ? 105 : 125));
          scrollState.progress = THREE.MathUtils.lerp(
            scrollState.progress,
            scrollState.target,
            smoothing,
          );
        }

        const progress = scrollState.progress;
        const intro = introState.value;

        // One deterministic cabinet transform for the whole scroll range.
        const firstHalf = easeProgress(0, 0.52, progress);
        const secondHalf = easeProgress(0.52, 1, progress);
        const startX = phone ? 1.52 : mobile ? 1.18 : 2.08;
        const middleX = phone ? 1.3 : mobile ? 0.94 : 1.84;
        const endX = phone ? 1.46 : mobile ? 1.08 : 2.14;
        const baseX = THREE.MathUtils.lerp(
          THREE.MathUtils.lerp(startX, middleX, firstHalf),
          endX,
          secondHalf,
        );
        const baseY =
          (mobile ? -0.28 : -0.08) +
          Math.sin(progress * Math.PI) * (mobile ? 0.24 : 0.16) -
          secondHalf * (mobile ? 0.09 : 0.05);
        const baseRotY = THREE.MathUtils.lerp(
          THREE.MathUtils.lerp(
            mobile ? -0.16 : -0.28,
            mobile ? 0.035 : 0.09,
            firstHalf,
          ),
          mobile ? -0.1 : -0.16,
          secondHalf,
        );
        const baseRotX = THREE.MathUtils.lerp(
          mobile ? -0.08 : -0.08,
          mobile ? -0.025 : -0.02,
          firstHalf,
        );
        const idleCabinet =
          reducedMotion.matches ? 0 : Math.sin(time * 0.00032) * (mobile ? 0.012 : 0.018);
        const zoomIn = easeProgress(0.01, 0.32, progress);
        const zoomOut = easeProgress(0.36, 0.72, progress);
        const finalPush = easeProgress(0.78, 0.97, progress);

        const startScale = phone ? 0.56 : mobile ? 0.64 : 0.78;
        const peakScale = phone ? 0.78 : mobile ? 0.9 : 1.08;
        const pulledBackScale = phone ? 0.63 : mobile ? 0.72 : 0.86;
        const finalScale = phone ? 0.7 : mobile ? 0.8 : 0.95;

        const baseScale = THREE.MathUtils.lerp(
          THREE.MathUtils.lerp(startScale, peakScale, zoomIn),
          THREE.MathUtils.lerp(pulledBackScale, finalScale, finalPush),
          zoomOut,
        );

        panelRig.position.set(
          baseX,
          baseY - (1 - intro) * (mobile ? 0.42 : 0.5),
          -(1 - intro) * 0.82,
        );
        panelRig.rotation.set(
          baseRotX + idleCabinet,
          baseRotY +
            (reducedMotion.matches ? 0 : Math.sin(time * 0.00021) * (mobile ? 0.018 : 0.028)),
          Math.sin(progress * Math.PI * 2) * (mobile ? 0.026 : 0.04),
        );
        panelRig.scale.setScalar(baseScale * (0.92 + intro * 0.08));

        // Draw and energize each cable according to its own scroll interval.
        cableRoutes.forEach((route, index) => {
          const local = easeProgress(route.start, route.end, progress);
          const count = route.line.geometry.attributes.position.count;
          route.line.geometry.setDrawRange(0, Math.max(0, Math.floor(count * local)));
          route.material.opacity = 0.08 + local * (mobile ? 0.74 : 0.88);

          route.pulse.visible = local > 0.1;
          if (route.pulse.visible) {
            const pulseT =
              (route.pulseOffset +
                time * 0.00006 * (mobile ? 0.75 : 1) +
                progress * 0.38 +
                index * 0.031) %
              Math.max(0.08, local);
            const t = THREE.MathUtils.clamp(pulseT, 0.02, Math.max(0.02, local));
            route.curve.getPointAt(t, route.pulsePoint);
            route.curve.getTangentAt(t, route.tangent).normalize();
            route.pulse.position.copy(route.pulsePoint);
            route.pulse.quaternion.setFromUnitVectors(unitY, route.tangent);
            route.pulse.scale.setScalar(
              0.86 + Math.sin(time * 0.007 + index) * 0.16,
            );
          }
        });

        const systemLive = easeProgress(0.86, 0.98, progress);

        // Module boot state / LEDs + subtle energized mechanical motion.
        statusModules.forEach((module, moduleIndex) => {
          const live = easeProgress(module.start, module.start + 0.1, progress);
          const breathe = reducedMotion.matches
            ? 0
            : Math.sin(time * 0.0014 + module.phase) * live;

          module.group.position.x =
            module.basePosition.x + breathe * (mobile ? 0.004 : 0.007);
          module.group.position.y =
            module.basePosition.y + breathe * (mobile ? 0.005 : 0.009);
          module.group.position.z =
            module.basePosition.z +
            live * (mobile ? 0.025 : 0.04) +
            breathe * (mobile ? 0.012 : 0.018);
          module.group.rotation.y =
            breathe * (mobile ? 0.006 : 0.012);

          module.leds.forEach((led: any, ledIndex: number) => {
            const material = led.material;
            const pulse =
              0.65 + Math.sin(time * 0.006 + moduleIndex * 0.9 + ledIndex) * 0.35;
            material.emissiveIntensity =
              0.02 +
              live *
                (ledIndex === 0 ? 1.8 : 1.1) *
                pulse *
                (1 + systemLive * 0.22);
          });
        });

        const terminalLive = easeProgress(0.64, 0.84, progress);
        terminalMeshes.forEach((terminal: any, index: number) => {
          const wave = Math.max(
            0,
            Math.sin(time * 0.0055 - index * 0.72),
          );
          terminal.material.emissiveIntensity =
            0.01 + terminalLive * (0.1 + wave * 0.38);
          terminal.position.z =
            terminalLive * wave * (mobile ? 0.014 : 0.022);
        });

        // PLC screen comes fully alive later than the housing.
        const plcLive = easeProgress(0.28, 0.44, progress);
        const screenFlicker = reducedMotion.matches
          ? 0
          : Math.sin(time * 0.013) * 0.07 + Math.sin(time * 0.0031) * 0.08;
        screenMaterial.emissiveIntensity =
          0.08 + plcLive * (0.82 + screenFlicker);
        plcScreen.position.z =
          0.4 + plcLive * (reducedMotion.matches ? 0 : Math.sin(time * 0.0018) * 0.008);

        // The main breaker physically switches on, then holds a tiny energized vibration.
        const breakerLive = easeProgress(0.08, 0.2, progress);
        const breakerHum =
          !reducedMotion.matches && breakerLive > 0.98
            ? Math.sin(time * 0.011) * (mobile ? 0.004 : 0.006)
            : 0;
        breakerToggle.rotation.x = -0.28 * breakerLive + breakerHum;
        breakerToggle.position.y = 0.08 + breakerLive * 0.08 + breakerHum * 0.35;

        // Energized busbar, moving scan and local power glow.
        const busLive = easeProgress(0.12, 0.36, progress);
        copper.emissiveIntensity =
          0.12 +
          busLive *
            (0.52 +
              (reducedMotion.matches ? 0 : Math.sin(time * 0.0042) * 0.12));
        busLight.intensity =
          busLive *
          ((mobile ? 4.5 : 7) +
            (reducedMotion.matches ? 0 : Math.max(0, Math.sin(time * 0.0048)) * 2));
        busCover.material.opacity = 0.14 + busLive * 0.07;
        panelGlow.material.opacity =
          0.08 +
          busLive * 0.035 +
          systemLive * 0.07 +
          (reducedMotion.matches ? 0 : Math.sin(time * 0.0024) * 0.018);

        const scanLive = easeProgress(0.28, 0.9, progress);
        if (!reducedMotion.matches && scanLive > 0.01) {
          const scanPhase = (time * 0.00016 + progress * 0.32) % 1;
          scanBeam.position.y = -3.48 + scanPhase * 6.95;
          scanMaterial.opacity =
            scanLive *
            (0.05 + Math.sin(scanPhase * Math.PI) * (mobile ? 0.1 : 0.16));
        } else {
          scanMaterial.opacity = reducedMotion.matches ? scanLive * 0.08 : 0;
        }

        // Relay / contactor mechanics: a small periodic click after each circuit is live.
        relayGroups.forEach((relay: any, index: number) => {
          const base = relay.userData.basePosition;
          const live = easeProgress(
            0.48 + index * 0.045,
            0.58 + index * 0.045,
            progress,
          );
          const phase = (time * 0.00042 + index * 0.19) % 1;
          const click =
            !reducedMotion.matches && phase < 0.08
              ? Math.sin((phase / 0.08) * Math.PI) * live
              : 0;
          relay.position.z =
            base.z + live * (mobile ? 0.02 : 0.035) + click * (mobile ? 0.028 : 0.05);
          relay.rotation.x = click * 0.045;
        });

        // I/O modules ripple as signals fan out.
        ioModules.forEach((module: any, index: number) => {
          const base = module.userData.basePosition;
          const live = easeProgress(
            0.38 + index * 0.045,
            0.5 + index * 0.045,
            progress,
          );
          const ripple = reducedMotion.matches
            ? 0
            : Math.sin(time * 0.0022 - index * 0.72) * live;
          module.position.z =
            base.z + live * (mobile ? 0.025 : 0.045) + ripple * (mobile ? 0.012 : 0.02);
          module.rotation.z = ripple * 0.008;
        });

        // PSU and network module stay subtly active once powered.
        const psuLive = easeProgress(0.2, 0.34, progress);
        psu.rotation.z =
          reducedMotion.matches ? 0 : Math.sin(time * 0.0017) * psuLive * 0.006;
        const networkLive = easeProgress(0.58, 0.72, progress);
        networkPort.rotation.y =
          reducedMotion.matches ? 0 : Math.sin(time * 0.0015) * networkLive * 0.012;

        // Ambient field keeps moving without modifying the cabinet's scroll transform.
        if (!reducedMotion.matches) {
          particles.rotation.y = -time * 0.000035;
          particles.position.y = Math.sin(time * 0.00045) * 0.18;
          orbitGroup.rotation.z =
            Math.sin(time * 0.00028) * 0.12 + progress * 0.18;
          ambientRig.position.x =
            (phone ? 0.84 : mobile ? 0.58 : 1.08) +
            Math.sin(time * 0.00019) * 0.08;
          ambientRig.position.y =
            Math.cos(time * 0.00017) * 0.06 + Math.sin(progress * Math.PI) * 0.08;
        }

        const pointerFactor = mobile ? 0 : 1;
        const idleX = reducedMotion.matches ? 0 : Math.sin(time * 0.00018) * 0.08;
        const idleY = reducedMotion.matches ? 0 : Math.cos(time * 0.00016) * 0.045;

        const cameraEase = 1 - Math.exp(-delta / (phone ? 92 : mobile ? 120 : 100));
        camera.position.x = THREE.MathUtils.lerp(
          camera.position.x,
          pointerX * 0.18 * pointerFactor + idleX,
          cameraEase,
        );
        camera.position.y = THREE.MathUtils.lerp(
          camera.position.y,
          -pointerY * 0.09 * pointerFactor + idleY,
          cameraEase,
        );
        const cameraFarStart = phone ? 12.9 : mobile ? 12.35 : 10.05;
        const cameraNear = phone ? 11.3 : mobile ? 10.85 : 8.15;
        const cameraFarMid = phone ? 12.45 : mobile ? 11.95 : 9.65;
        const cameraFinal = phone ? 11.85 : mobile ? 11.35 : 8.95;

        const cameraZoomTarget = THREE.MathUtils.lerp(
          THREE.MathUtils.lerp(cameraFarStart, cameraNear, zoomIn),
          THREE.MathUtils.lerp(cameraFarMid, cameraFinal, finalPush),
          zoomOut,
        );

        camera.position.z = THREE.MathUtils.lerp(
          camera.position.z,
          cameraZoomTarget -
            systemLive * (phone ? 0.06 : mobile ? 0.1 : 0.16),
          cameraEase,
        );

        camera.lookAt(
          phone ? 0.18 : mobile ? 0.24 : 0.6,
          -0.12 + Math.sin(progress * Math.PI) * 0.12,
          -0.12,
        );

        warm.position.x = 2.2 + Math.sin(time * 0.0007) * 0.7;
        warm.intensity =
          (mobile ? 15 : 20) +
          easeProgress(0.1, 0.4, progress) * 4 +
          Math.sin(time * 0.005) * 1.6;

        cool.intensity =
          (mobile ? 4 : 7) +
          easeProgress(0.32, 0.7, progress) * (mobile ? 4 : 6) +
          systemLive * (mobile ? 1.2 : 2.2);

        key.intensity =
          (mobile ? 2.6 : 3.6) +
          systemLive *
            (reducedMotion.matches ? 0.3 : 0.45 + Math.sin(time * 0.0019) * 0.12);

        renderer.render(scene, camera);

        if (!reducedMotion.matches) {
          frame = window.requestAnimationFrame(render);
        }
      };

      const handleVisibility = () => {
        if (document.hidden) {
          if (frame) window.cancelAnimationFrame(frame);
          frame = 0;
          return;
        }

        if (!reducedMotion.matches && !frame) {
          lastRenderTime = 0;
          frame = window.requestAnimationFrame(render);
        }
      };

      const handleReducedMotion = () => {
        ScrollTrigger.refresh();
        if (reducedMotion.matches) {
          if (frame) window.cancelAnimationFrame(frame);
          frame = 0;
          render();
        } else if (!frame) {
          frame = window.requestAnimationFrame(render);
        }
      };

      resize();
      window.addEventListener("resize", resize);
      if (!mobile) {
        window.addEventListener("pointermove", pointerMove, { passive: true });
      }
      document.addEventListener("visibilitychange", handleVisibility);
      reducedMotion.addEventListener("change", handleReducedMotion);

      ScrollTrigger.refresh();

      if (reducedMotion.matches) {
        render();
      } else {
        frame = window.requestAnimationFrame(render);
      }

      cleanup = () => {
        if (frame) window.cancelAnimationFrame(frame);
        window.removeEventListener("resize", resize);
        if (!mobile) {
          window.removeEventListener("pointermove", pointerMove);
        }
        document.removeEventListener("visibilitychange", handleVisibility);
        reducedMotion.removeEventListener("change", handleReducedMotion);

        scrollTrigger.kill();
        introTween.kill();
        idleTweens.forEach((tween) => tween.kill());
        gsap.killTweensOf(introState);
        gsap.killTweensOf(panelRig.position);
        gsap.killTweensOf(panelRig.rotation);
        gsap.killTweensOf(panelRig.scale);

        scene.traverse((object: unknown) => {
          if (!object || typeof object !== "object") return;
          const candidate = object as {
            geometry?: { dispose: () => void };
            material?:
              | { dispose?: () => void; map?: { dispose?: () => void } }
              | Array<{ dispose?: () => void; map?: { dispose?: () => void } }>;
          };
          candidate.geometry?.dispose();
          const materials = Array.isArray(candidate.material)
            ? candidate.material
            : candidate.material
              ? [candidate.material]
              : [];
          materials.forEach((material) => {
            material.map?.dispose?.();
            material.dispose?.();
          });
        });

        labelTextures.forEach((texture) => texture.dispose?.());
        glowTexture?.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    };

    void start();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return <div className="three-scene three-scene--plc" ref={mountRef} aria-hidden="true" />;
}
