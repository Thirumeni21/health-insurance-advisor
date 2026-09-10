"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { AppStage, FamilyMember } from "@/types/questionnaire";

interface ProtectionSpace3DProps {
  stage: AppStage;
  familyMembers: FamilyMember[];
  userAge: number;
  selectedConcernTrigger?: string | null;
  reducedMotion?: boolean;
}

export const ProtectionSpace3D: React.FC<ProtectionSpace3DProps> = ({
  stage,
  familyMembers,
  userAge,
  selectedConcernTrigger,
  reducedMotion = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const frameIdRef = useRef<number | null>(null);

  // Group references
  const mainGroupRef = useRef<THREE.Group | null>(null);
  const centralSculptureRef = useRef<THREE.Group | null>(null);
  const constellationRingRef = useRef<THREE.Mesh | null>(null);
  const architecturalArcsRef = useRef<THREE.Group | null>(null);
  const familyNodesGroupRef = useRef<THREE.Group | null>(null);
  const dustParticlesRef = useRef<THREE.Points | null>(null);

  const [webGLError, setWebGLError] = useState(false);
  const pulseIntensityRef = useRef<number>(0);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
      setWebGLError(true);
      return;
    }

    // --- 1. Scene Setup ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x100c12, 0.032);
    sceneRef.current = scene;

    // --- 2. Camera Setup ---
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const isMobile = width < 768;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 2, isMobile ? 19 : 17);
    cameraRef.current = camera;

    // --- 3. Renderer Setup ---
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isMobile,
        powerPreference: "high-performance",
      });
    } catch (e) {
      setWebGLError(true);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    rendererRef.current = renderer;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // --- 4. Master Space Group ---
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);
    mainGroupRef.current = mainGroup;

    // --- 5. Matte Obsidian Architectural Platform (Floor) ---
    const floorGeo = new THREE.CylinderGeometry(8.5, 9.0, 0.4, isMobile ? 32 : 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x140f17,
      roughness: 0.85,
      metalness: 0.15,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.y = -2.2;
    mainGroup.add(floorMesh);

    // Embedded Circular Orbit Groove
    const grooveGeo = new THREE.RingGeometry(4.8, 4.88, isMobile ? 48 : 80);
    const grooveMat = new THREE.MeshBasicMaterial({
      color: 0xc47b5a,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    });
    const grooveMesh = new THREE.Mesh(grooveGeo, grooveMat);
    grooveMesh.rotation.x = -Math.PI / 2;
    grooveMesh.position.y = -1.98;
    mainGroup.add(grooveMesh);

    // --- 6. Central Human Sculpture (YOU) ---
    const centralSculpture = new THREE.Group();
    centralSculpture.position.set(0, -1.9, 0);

    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0xf1e9dc,
      roughness: 0.4,
      metalness: 0.1,
    });

    const torsoGeo = new THREE.CapsuleGeometry(0.35, 1.1, 12, isMobile ? 16 : 32);
    const torsoMesh = new THREE.Mesh(torsoGeo, stoneMat);
    torsoMesh.position.y = 1.0;
    centralSculpture.add(torsoMesh);

    const headGeo = new THREE.SphereGeometry(0.26, 24, 24);
    const headMesh = new THREE.Mesh(headGeo, stoneMat);
    headMesh.position.y = 1.95;
    centralSculpture.add(headMesh);

    const coreHaloGeo = new THREE.TorusGeometry(0.55, 0.02, 8, 36);
    const copperMat = new THREE.MeshBasicMaterial({
      color: 0xc47b5a,
      transparent: true,
      opacity: 0.7,
    });
    const coreHalo = new THREE.Mesh(coreHaloGeo, copperMat);
    coreHalo.rotation.x = Math.PI / 2;
    coreHalo.position.y = 0.15;
    centralSculpture.add(coreHalo);

    mainGroup.add(centralSculpture);
    centralSculptureRef.current = centralSculpture;

    // --- 7. Architectural Protective Arcs ---
    const arcsGroup = new THREE.Group();
    
    const arcGeo1 = new THREE.TorusGeometry(7.2, 0.04, 12, isMobile ? 48 : 80);
    const arcMat1 = new THREE.MeshStandardMaterial({
      color: 0x351d27,
      roughness: 0.3,
      metalness: 0.8,
    });
    const arcMesh1 = new THREE.Mesh(arcGeo1, arcMat1);
    arcMesh1.rotation.x = Math.PI / 3.2;
    arcMesh1.position.y = 0.5;
    arcsGroup.add(arcMesh1);

    const constellationRingGeo = new THREE.TorusGeometry(5.2, 0.025, 12, isMobile ? 64 : 100);
    const constellationRingMat = new THREE.MeshBasicMaterial({
      color: 0xc47b5a,
      transparent: true,
      opacity: 0.5,
    });
    const constellationRing = new THREE.Mesh(constellationRingGeo, constellationRingMat);
    constellationRing.rotation.x = Math.PI / 2.1;
    arcsGroup.add(constellationRing);
    constellationRingRef.current = constellationRing;

    mainGroup.add(arcsGroup);
    architecturalArcsRef.current = arcsGroup;

    // --- 8. Atmospheric Fine Dust Particles ---
    const dustCount = reducedMotion ? 150 : isMobile ? 300 : 700;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);

    const cCopper = new THREE.Color(0xc47b5a);
    const cIvory = new THREE.Color(0xf1e9dc);
    const cChampagne = new THREE.Color(0xd8b98a);

    for (let i = 0; i < dustCount; i++) {
      const idx = i * 3;
      dustPos[idx] = (Math.random() - 0.5) * 26;
      dustPos[idx + 1] = (Math.random() - 0.5) * 20;
      dustPos[idx + 2] = (Math.random() - 0.5) * 22;

      const col = i % 4 === 0 ? cCopper : i % 3 === 0 ? cChampagne : cIvory;
      dustColors[idx] = col.r;
      dustColors[idx + 1] = col.g;
      dustColors[idx + 2] = col.b;
    }

    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    dustGeo.setAttribute("color", new THREE.BufferAttribute(dustColors, 3));

    const dustMat = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.4,
      blending: THREE. AdditiveBlending,
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    scene.add(dustPoints);
    dustParticlesRef.current = dustPoints;

    // --- 9. Dynamic Family Nodes Group ---
    const familyGroup = new THREE.Group();
    mainGroup.add(familyGroup);
    familyNodesGroupRef.current = familyGroup;

    // --- 10. Lighting ---
    const ambientLight = new THREE.AmbientLight(0x1d1420, 1.2);
    scene.add(ambientLight);

    const champagneKey = new THREE.PointLight(0xd8b98a, 2.5, 45);
    champagneKey.position.set(6, 8, 12);
    scene.add(champagneKey);

    const copperRim = new THREE.PointLight(0xc47b5a, 2.0, 35);
    copperRim.position.set(-8, 5, 8);
    scene.add(copperRim);

    // --- 11. Interaction (Mouse & Gyro Touch) ---
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.35;
      targetY = y * 0.25;
    };
    window.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // --- 12. Animation Loop ---
    const clock = new THREE.Clock();

    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      mouseX += (targetX - mouseX) * 0.04;
      mouseY += (targetY - mouseY) * 0.04;

      if (!reducedMotion) {
        mainGroup.rotation.y = Math.sin(elapsedTime * 0.1) * 0.06 + mouseX * 0.25;
        mainGroup.rotation.x = mouseY * 0.15;

        centralSculpture.rotation.y = elapsedTime * 0.08;
        arcsGroup.rotation.z = elapsedTime * 0.03;
        constellationRing.rotation.z = -elapsedTime * 0.05;

        dustPoints.rotation.y = elapsedTime * 0.015;
      }

      if (pulseIntensityRef.current > 0) {
        pulseIntensityRef.current *= 0.95;
        if (pulseIntensityRef.current < 0.005) pulseIntensityRef.current = 0;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (container) container.innerHTML = "";
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (selectedConcernTrigger && constellationRingRef.current) {
      pulseIntensityRef.current = 0.4;
      const mat = constellationRingRef.current.material as THREE.MeshBasicMaterial;
      mat.color.setHex(0xd8b98a);
      setTimeout(() => {
        mat.color.setHex(0xc47b5a);
      }, 600);
    }
  }, [selectedConcernTrigger]);

  useEffect(() => {
    const camera = cameraRef.current;
    const mainGroup = mainGroupRef.current;
    if (!camera || !mainGroup) return;

    const isMobile = window.innerWidth < 768;

    switch (stage) {
      case "hero":
        mainGroup.position.set(0, isMobile ? -0.4 : -0.2, 0);
        camera.position.set(0, 1.2, isMobile ? 18.5 : 16.5);
        break;
      case "step1":
      case "step2":
        mainGroup.position.set(0, -0.6, -1.0);
        camera.position.set(0, 1.0, isMobile ? 19.0 : 17.0);
        break;
      case "step3":
        mainGroup.position.set(0, -0.4, 0.5);
        camera.position.set(0, 1.8, isMobile ? 16.5 : 14.5);
        break;
      case "step4":
      case "step5":
        mainGroup.position.set(0, -0.8, -1.2);
        camera.position.set(0, 1.2, isMobile ? 19.5 : 17.2);
        break;
      case "summary":
        mainGroup.position.set(0, -0.3, 0);
        camera.position.set(0, 2.2, isMobile ? 21.0 : 19.0);
        break;
    }
  }, [stage]);

  useEffect(() => {
    const familyGroup = familyNodesGroupRef.current;
    const ring = constellationRingRef.current;
    if (!familyGroup) return;

    while (familyGroup.children.length > 0) {
      const child = familyGroup.children[0];
      familyGroup.remove(child);
    }

    const count = familyMembers.length;
    const orbitRadius = 4.6 + Math.min(count, 5) * 0.45;

    if (ring) {
      ring.scale.set(orbitRadius / 5.2, orbitRadius / 5.2, orbitRadius / 5.2);
    }

    const satinIvory = new THREE.MeshStandardMaterial({
      color: 0xf1e9dc,
      roughness: 0.45,
      metalness: 0.1,
    });

    const warmChampagneMat = new THREE.MeshStandardMaterial({
      color: 0xd8b98a,
      roughness: 0.4,
      metalness: 0.15,
    });

    const copperWireMat = new THREE.MeshBasicMaterial({
      color: 0xc47b5a,
      transparent: true,
      opacity: 0.65,
    });

    familyMembers.forEach((member, index) => {
      const angle = (index / Math.max(count, 1)) * Math.PI * 2;
      const x = Math.cos(angle) * orbitRadius;
      const z = Math.sin(angle) * orbitRadius * 0.75;
      const y = -1.9;

      const personGroup = new THREE.Group();
      personGroup.position.set(x, y, z);

      const isSenior = member.age >= 60;
      const isChild = member.age < 18;
      const scaleFactor = isChild ? 0.65 : isSenior ? 1.05 : 0.95;

      const chosenMat = isSenior ? warmChampagneMat : satinIvory;

      const torsoGeo = new THREE.CapsuleGeometry(0.3 * scaleFactor, 0.9 * scaleFactor, 12, 16);
      const torso = new THREE.Mesh(torsoGeo, chosenMat);
      torso.position.y = 0.85 * scaleFactor;
      personGroup.add(torso);

      const headGeo = new THREE.SphereGeometry(0.22 * scaleFactor, 16, 16);
      const head = new THREE.Mesh(headGeo, chosenMat);
      head.position.y = 1.65 * scaleFactor;
      personGroup.add(head);

      const haloGeo = new THREE.TorusGeometry(0.35 * scaleFactor, 0.015, 8, 24);
      const halo = new THREE.Mesh(haloGeo, copperWireMat);
      halo.rotation.x = Math.PI / 2;
      halo.position.y = 2.0 * scaleFactor;
      personGroup.add(halo);

      familyGroup.add(personGroup);

      const points = [
        new THREE.Vector3(0, -1.7, 0),
        new THREE.Vector3(x * 0.45, -1.8 + Math.sin(angle) * 0.2, z * 0.45),
        new THREE.Vector3(x, -1.7, z),
      ];
      const curve = new THREE.CatmullRomCurve3(points);
      const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.02, 6, false);
      const connectionLine = new THREE.Mesh(tubeGeo, copperWireMat);
      familyGroup.add(connectionLine);
    });
  }, [familyMembers]);

  if (webGLError) {
    // Graceful WebGL Fallback Illustration
    return (
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 flex items-center justify-center opacity-30">
        <div className="w-[340px] sm:w-[480px] h-[340px] sm:h-[480px] rounded-full border border-burnished-copper/40 animate-spin-slow" />
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
    />
  );
};