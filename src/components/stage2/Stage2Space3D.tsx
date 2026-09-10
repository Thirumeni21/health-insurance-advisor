"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { FamilyMember } from "@/types/questionnaire";
import { Stage2Step, PersonalizedScenario, InsuranceConceptId } from "@/types/stage2";

interface Stage2Space3DProps {
  currentStep: Stage2Step;
  currentActIndex: number;
  scenario: PersonalizedScenario;
  familyMembers: FamilyMember[];
  userAge: number;
  activeConceptId: InsuranceConceptId | null;
  reducedMotion: boolean;
}

export const Stage2Space3D: React.FC<Stage2Space3DProps> = ({
  currentStep,
  currentActIndex,
  scenario,
  familyMembers,
  userAge,
  activeConceptId,
  reducedMotion,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const constellationGroupRef = useRef<THREE.Group | null>(null);
  const architecturalGroupRef = useRef<THREE.Group | null>(null);
  const conceptGroupRef = useRef<THREE.Group | null>(null);
  const anchorMeshRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || window.innerWidth;
    const height = mountRef.current.clientHeight || window.innerHeight;
    const isMobile = width < 768;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x100c12, 0.04);
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
    renderer.toneMappingExposure = 1.1;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xd8b98a, 0.85);
    scene.add(ambientLight);

    const mainLight = new THREE.PointLight(0xc47b5a, 2.8, 45);
    mainLight.position.set(5, 8, 8);
    scene.add(mainLight);

    const fillLight = new THREE.PointLight(0x733d47, 1.9, 35);
    fillLight.position.set(-6, -4, 4);
    scene.add(fillLight);

    // 5. Constellation Group
    const constGroup = new THREE.Group();
    constellationGroupRef.current = constGroup;
    scene.add(constGroup);

    // Center Anchor Node (Primary User)
    const isTargetSelf = scenario.targetPerson.characterType === "self";
    const anchorGeo = new THREE.OctahedronGeometry(isTargetSelf ? 1.05 : 0.85, 2);
    const anchorMat = new THREE.MeshStandardMaterial({
      color: 0xc47b5a,
      metalness: 0.85,
      roughness: 0.18,
      wireframe: false,
    });
    const anchorMesh = new THREE.Mesh(anchorGeo, anchorMat);
    anchorMeshRef.current = anchorMesh;
    constGroup.add(anchorMesh);

    // Halo ring for anchor
    const haloGeo = new THREE.RingGeometry(1.3, 1.36, 48);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xc47b5a,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: isTargetSelf ? 0.45 : 0.2,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.rotation.x = Math.PI / 2;
    constGroup.add(haloMesh);

    // Family Member Orbit Nodes (ONLY if members actually exist in profile)
    const totalMembers = familyMembers.length;
    familyMembers.forEach((member, i) => {
      const angle = (i / Math.max(totalMembers, 1)) * Math.PI * 2;
      const radius = 3.3;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * (radius * 0.52);
      const z = Math.sin(angle * 2) * 0.5;

      const isParent =
        member.relationship === "Mother" ||
        member.relationship === "Father" ||
        member.relationship === "Grandparent";
      const isChild = member.relationship === "Child";
      const isSpouse = member.relationship === "Spouse";
      const isThisMemberTarget = member.id === scenario.targetPerson.familyMemberId;

      const nodeGeo = isParent
        ? new THREE.CylinderGeometry(0.38, 0.38, 0.85, 8)
        : isChild
        ? new THREE.SphereGeometry(0.42, 16, 16)
        : isSpouse
        ? new THREE.IcosahedronGeometry(0.5, 1)
        : new THREE.DodecahedronGeometry(0.4, 0);

      const nodeMat = new THREE.MeshStandardMaterial({
        color: isThisMemberTarget
          ? 0xd8b98a // Highlighted golden champagne
          : isParent
          ? 0xd8b98a
          : isChild
          ? 0xf1e9dc
          : 0xb98a91,
        metalness: isThisMemberTarget ? 0.9 : 0.6,
        roughness: isThisMemberTarget ? 0.15 : 0.35,
      });

      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.set(x, y, z);
      if (isThisMemberTarget) {
        nodeMesh.scale.set(1.25, 1.25, 1.25);
      }
      constGroup.add(nodeMesh);

      // Connecting Beam to Anchor
      const beamPoints = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, y, z)];
      const beamGeo = new THREE.BufferGeometry().setFromPoints(beamPoints);
      const beamMat = new THREE.LineBasicMaterial({
        color: isThisMemberTarget ? 0xd8b98a : 0xc47b5a,
        transparent: true,
        opacity: isThisMemberTarget ? 0.75 : 0.3,
      });
      const beamLine = new THREE.Line(beamGeo, beamMat);
      constGroup.add(beamLine);
    });

    // 6. Architectural Hospital Group (for Acts 3 & 4)
    const archGroup = new THREE.Group();
    archGroup.visible = false;
    architecturalGroupRef.current = archGroup;
    scene.add(archGroup);

    for (let i = 0; i < 7; i++) {
      const colGeo = new THREE.BoxGeometry(0.42, 2.6 + (i % 3) * 0.8, 0.42);
      const colMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0xc47b5a : 0x733d47,
        metalness: 0.7,
        roughness: 0.25,
        transparent: true,
        opacity: 0.65,
      });
      const colMesh = new THREE.Mesh(colGeo, colMat);
      colMesh.position.set((i - 3) * 1.35, -1 + (i % 2) * 0.4, -1 - (i % 2) * 1.5);
      archGroup.add(colMesh);
    }

    // 7. Interactive Concept Sculpture Group
    const conceptGroup = new THREE.Group();
    conceptGroup.visible = false;
    conceptGroupRef.current = conceptGroup;
    scene.add(conceptGroup);

    const torusGeo = new THREE.TorusGeometry(1.65, 0.26, 16, 64);
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0xd8b98a,
      metalness: 0.88,
      roughness: 0.15,
    });
    const conceptTorus = new THREE.Mesh(torusGeo, torusMat);
    conceptGroup.add(conceptTorus);

    // 8. Animation Loop
    let time = 0;
    const animate = () => {
      time += 0.015;

      if (constGroup && !reducedMotion) {
        constGroup.rotation.y = time * 0.22;
        constGroup.rotation.x = Math.sin(time * 0.14) * 0.08;
      }

      if (archGroup && !reducedMotion) {
        archGroup.rotation.y = Math.sin(time * 0.2) * 0.15;
      }

      if (conceptGroup && !reducedMotion) {
        conceptGroup.rotation.x = time * 0.35;
        conceptGroup.rotation.y = time * 0.45;
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

  // Step / Act Transitions
  useEffect(() => {
    if (!constellationGroupRef.current || !architecturalGroupRef.current || !conceptGroupRef.current) return;

    if (currentStep === "scenario") {
      if (currentActIndex <= 1 || currentActIndex >= 5) {
        // Acts 1, 2, 6, 7: Focus on Family Constellation / Target Person
        constellationGroupRef.current.visible = true;
        architecturalGroupRef.current.visible = false;
        conceptGroupRef.current.visible = false;
      } else {
        // Acts 3 & 4: Hospital / Bill Architectural Form
        constellationGroupRef.current.visible = false;
        architecturalGroupRef.current.visible = true;
        conceptGroupRef.current.visible = false;
      }
    } else if (currentStep === "insurance_concepts") {
      constellationGroupRef.current.visible = false;
      architecturalGroupRef.current.visible = false;
      conceptGroupRef.current.visible = true;
    } else {
      // Current Cover Question & Final Reflection: Return to Constellation
      constellationGroupRef.current.visible = true;
      architecturalGroupRef.current.visible = false;
      conceptGroupRef.current.visible = false;
    }
  }, [currentStep, currentActIndex]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
};
