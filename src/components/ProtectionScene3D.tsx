"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { FamilyMember } from "@/types/questionnaire";

interface ProtectionScene3DProps {
  familyMembers?: FamilyMember[];
  userAge?: number;
  highlightRing?: boolean;
  compact?: boolean;
}

export const ProtectionScene3D: React.FC<ProtectionScene3DProps> = ({
  familyMembers = [],
  userAge = 35,
  highlightRing = false,
  compact = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const frameIdRef = useRef<number | null>(null);
  const nodesGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, compact ? 14 : 16);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Groups
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Central Core Protection Sphere (Glowing translucent shell + inner wireframe)
    const coreGeo = new THREE.IcosahedronGeometry(compact ? 1.8 : 2.2, 3);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x9b7bff,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    mainGroup.add(coreMesh);

    // Inner glowing solid sphere
    const innerGeo = new THREE.SphereGeometry(compact ? 1.0 : 1.3, 32, 32);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x66e6d8,
      transparent: true,
      opacity: 0.45,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    mainGroup.add(innerMesh);

    // 2. Concentric Orbiting Protection Rings
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x9b7bff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    });
    const ringGeo1 = new THREE.RingGeometry(compact ? 3.8 : 4.6, compact ? 3.9 : 4.7, 64);
    const ringMesh1 = new THREE.Mesh(ringGeo1, ringMat1);
    ringMesh1.rotation.x = Math.PI / 2.3;
    mainGroup.add(ringMesh1);

    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x66e6d8,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
    });
    const ringGeo2 = new THREE.RingGeometry(compact ? 5.2 : 6.4, compact ? 5.3 : 6.5, 64);
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
    ringMesh2.rotation.x = -Math.PI / 2.5;
    ringMesh2.rotation.y = 0.3;
    mainGroup.add(ringMesh2);

    // 3. Ethereal Particle Swarm
    const particleCount = compact ? 120 : 250;
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    const scaleArray = new Float32Array(particleCount);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = THREE.MathUtils.randFloat(3, compact ? 9 : 12);
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = THREE.MathUtils.randFloat(0, Math.PI);

      posArray[i] = radius * Math.sin(phi) * Math.cos(theta);
      posArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      posArray[i + 2] = radius * Math.cos(phi);
      scaleArray[i / 3] = THREE.MathUtils.randFloat(0.5, 1.5);
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x9b7bff,
      size: 0.12,
      transparent: true,
      opacity: 0.65,
      blending: THREE. AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particles);

    // Group for dynamic family nodes
    const dynamicNodesGroup = new THREE.Group();
    mainGroup.add(dynamicNodesGroup);
    nodesGroupRef.current = dynamicNodesGroup;

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 0.8;
      targetY = y * 0.8;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      mainGroup.rotation.y = elapsedTime * 0.12 + mouseX * 0.5;
      mainGroup.rotation.x = mouseY * 0.5;

      coreMesh.rotation.y = -elapsedTime * 0.2;
      coreMesh.rotation.z = elapsedTime * 0.1;
      
      const pulse = Math.sin(elapsedTime * 2) * 0.08 + 1;
      innerMesh.scale.set(pulse, pulse, pulse);

      ringMesh1.rotation.z = elapsedTime * 0.15;
      ringMesh2.rotation.z = -elapsedTime * 0.12;

      particles.rotation.y = elapsedTime * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (container) container.innerHTML = "";
    };
  }, [compact]);

  // Update dynamic family nodes in 3D space
  useEffect(() => {
    const group = nodesGroupRef.current;
    if (!group) return;

    // Clear previous children
    while (group.children.length > 0) {
      const obj = group.children[0];
      group.remove(obj);
    }

    const totalNodes = familyMembers.length;
    if (totalNodes === 0) return;

    const orbitRadius = compact ? 4.2 : 5.2;

    familyMembers.forEach((member, index) => {
      const angle = (index / totalNodes) * Math.PI * 2;
      const x = Math.cos(angle) * orbitRadius;
      const y = Math.sin(angle) * orbitRadius;
      const z = Math.sin(angle * 2) * 0.8;

      // Node Mesh (Glowing Abstract Sphere)
      const nodeGeo = new THREE.SphereGeometry(compact ? 0.45 : 0.6, 24, 24);
      const isSenior = member.age >= 60;
      const isChild = member.age < 18;
      
      const nodeColor = isSenior ? 0xf4d7a1 : isChild ? 0x66e6d8 : 0x9b7bff;

      const nodeMat = new THREE.MeshBasicMaterial({
        color: nodeColor,
        transparent: true,
        opacity: 0.85,
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.set(x, y, z);
      group.add(nodeMesh);

      // Outer delicate halo ring around node
      const haloGeo = new THREE.RingGeometry(compact ? 0.6 : 0.8, compact ? 0.68 : 0.9, 32);
      const haloMat = new THREE.MeshBasicMaterial({
        color: nodeColor,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.position.set(x, y, z);
      haloMesh.lookAt(0, 0, 10);
      group.add(haloMesh);

      // Glowing connection beam from center to node
      const points = [];
      points.push(new THREE.Vector3(0, 0, 0));
      points.push(new THREE.Vector3(x * 0.5, y * 0.5, z * 0.5 + 0.3));
      points.push(new THREE.Vector3(x, y, z));
      const curve = new THREE.CatmullRomCurve3(points);
      const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.04, 8, false);
      const tubeMat = new THREE.MeshBasicMaterial({
        color: nodeColor,
        transparent: true,
        opacity: 0.3,
      });
      const lineMesh = new THREE.Mesh(tubeGeo, tubeMat);
      group.add(lineMesh);
    });
  }, [familyMembers, compact]);

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div ref={containerRef} className="w-full h-full min-h-[360px]" />

      {/* Floating Center Indicator Label for Protection Circle */}
      {familyMembers.length > 0 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none">
          <div className="px-3 py-1 rounded-full bg-midnight/90 border border-aqua-accent/40 shadow-glow-aqua/30 text-[11px] font-mono tracking-widest text-aqua-accent uppercase">
            YOU • ge {userAge}
          </div>
          <span className="text-[10px] text-lavender-muted mt-1">Core Anchor</span>
        </div>
      )}
    </div>
  );
};
