"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { FamilyMember } from "@/types/questionnaire";
import { PersonalizedScenario } from "@/types/stage2";

interface Stage3Space3DProps {
  currentChapterIndex: number;
  scenario: PersonalizedScenario;
  familyMembers: FamilyMember[];
  reducedMotion: boolean;
}

export const Stage3Space3D: React.FC<Stage3Space3DProps> = ({
  currentChapterIndex,
  scenario,
  familyMembers,
  reducedMotion,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Groups
  const centralCoreGroupRef = useRef<THREE.Group | null>(null);
  const coverageRingRef = useRef<THREE.Mesh | null>(null);
  const networkGridGroupRef = useRef<THREE.Group | null>(null);
  const familyConstellationRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || window.innerWidth;
    const height = mountRef.current.clientHeight || window.innerHeight;
    const isMobile = width < 768;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x100c12, 0.045);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 10);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xd8b98a, 0.9);
    scene.add(ambientLight);

    const mainLight = new THREE.PointLight(0xc47b5a, 3.0, 50);
    mainLight.position.set(6, 8, 8);
    scene.add(mainLight);

    const fillLight = new THREE.PointLight(0x733d47, 2.0, 40);
    fillLight.position.set(-6, -4, 4);
    scene.add(fillLight);

    // 5. Central Core Group (Medical Expense Core)
    const coreGroup = new THREE.Group();
    centralCoreGroupRef.current = coreGroup;
    scene.add(coreGroup);

    // Core Medical Expense Geometric Structure
    const coreGeo = new THREE.IcosahedronGeometry(0.9, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xc47b5a,
      metalness: 0.85,
      roughness: 0.2,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreGroup.add(coreMesh);

    // Surrounding Coverage Reservoir Ring (Sum Insured Capacity)
    const ringGeo = new THREE.TorusGeometry(2.1, 0.08, 16, 80);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xd8b98a,
      metalness: 0.9,
      roughness: 0.15,
      transparent: true,
      opacity: 0.75,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    coverageRingRef.current = ringMesh;
    coreGroup.add(ringMesh);

    // Secondary concentric boundary ring (Deductible / Co-pay limit)
    const subRingGeo = new THREE.TorusGeometry(1.4, 0.05, 16, 64);
    const subRingMat = new THREE.MeshStandardMaterial({
      color: 0xb98a91,
      metalness: 0.7,
      roughness: 0.3,
      transparent: true,
      opacity: 0.45,
    });
    const subRingMesh = new THREE.Mesh(subRingGeo, subRingMat);
    coreGroup.add(subRingMesh);

    // 6. Network Grid Group (Connected Hospital Grid for Chapter 3)
    const netGroup = new THREE.Group();
    netGroup.visible = false;
    networkGridGroupRef.current = netGroup;
    scene.add(netGroup);

    const hospitalPoints: THREE.Vector3[] = [];
    for (let i = 0; i < 9; i++) {
      const angle = (i / 9) * Math.PI * 2;
      const r = 3.5 + (i % 2) * 0.8;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * (r * 0.55);
      const z = (Math.sin(i * 3) * 0.8) - 1.0;
      const pos = new THREE.Vector3(x, y, z);
      hospitalPoints.push(pos);

      const hGeo = new THREE.BoxGeometry(0.28, 0.28, 0.28);
      const hMat = new THREE.MeshStandardMaterial({
        color: 0xd8b98a,
        metalness: 0.8,
        roughness: 0.2,
      });
      const hMesh = new THREE.Mesh(hGeo, hMat);
      hMesh.position.copy(pos);
      netGroup.add(hMesh);

      // Connected Beam to center
      const lineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), pos]);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0xc47b5a,
        transparent: true,
        opacity: 0.25,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      netGroup.add(line);
    }

    // 7. Family Constellation Group (Chapter 4)
    const famGroup = new THREE.Group();
    famGroup.visible = false;
    familyConstellationRef.current = famGroup;
    scene.add(famGroup);

    const totalMembers = familyMembers.length;
    familyMembers.forEach((member, i) => {
      const angle = (i / Math.max(totalMembers, 1)) * Math.PI * 2;
      const r = 3.2;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * (r * 0.5);
      const z = Math.sin(angle * 2) * 0.5;

      const isParent = member.relationship === "Mother" || member.relationship === "Father" || member.relationship === "Grandparent";
      const isChild = member.relationship === "Child";

      const nodeGeo = isParent
        ? new THREE.CylinderGeometry(0.35, 0.35, 0.75, 8)
        : isChild
        ? new THREE.SphereGeometry(0.38, 16, 16)
        : new THREE.IcosahedronGeometry(0.45, 1);

      const nodeMat = new THREE.MeshStandardMaterial({
        color: isParent ? 0xd8b98a : isChild ? 0xf1e9dc : 0xb98a91,
        metalness: 0.7,
        roughness: 0.3,
      });

      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.set(x, y, z);
      famGroup.add(nodeMesh);
    });

    // 8. Animation Loop
    let time = 0;
    const animate = () => {
      time += 0.012;

      if (coreGroup && !reducedMotion) {
        coreGroup.rotation.y = time * 0.2;
        coreGroup.rotation.x = Math.sin(time * 0.15) * 0.1;
      }

      if (ringMesh && !reducedMotion) {
        ringMesh.rotation.z = time * 0.15;
      }

      if (netGroup && !reducedMotion) {
        netGroup.rotation.z = time * 0.08;
      }

      if (famGroup && !reducedMotion) {
        famGroup.rotation.y = time * 0.18;
      }

      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }

      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    // 9. Resize Listener
    const handleResize = () => {
      if (!mountRef.current || !renderer || !camera) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      if (rendererRef.current && rendererRef.current.domElement && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [familyMembers, scenario, reducedMotion]);

  // Adapt 3D Scene Based on Active Chapter
  useEffect(() => {
    if (!centralCoreGroupRef.current || !networkGridGroupRef.current || !familyConstellationRef.current) return;

    if (currentChapterIndex === 0 || currentChapterIndex === 1) {
      // Chapters 1 & 2: Focus on Central Medical Expense & Coverage Capacity Rings
      centralCoreGroupRef.current.visible = true;
      networkGridGroupRef.current.visible = false;
      familyConstellationRef.current.visible = false;
    } else if (currentChapterIndex === 2) {
      // Chapter 3: Connected Network Hospitals Grid
      centralCoreGroupRef.current.visible = true;
      networkGridGroupRef.current.visible = true;
      familyConstellationRef.current.visible = false;
    } else if (currentChapterIndex === 3) {
      // Chapter 4: Family Household Constellation
      centralCoreGroupRef.current.visible = true;
      networkGridGroupRef.current.visible = false;
      familyConstellationRef.current.visible = true;
    } else {
      // Chapter 5: Complete Unified Protective Shield
      centralCoreGroupRef.current.visible = true;
      networkGridGroupRef.current.visible = false;
      familyConstellationRef.current.visible = true;
    }
  }, [currentChapterIndex]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
};
