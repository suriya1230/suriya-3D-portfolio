// components/agentic/AgenticScene.js
// ════════════════════════════════════════════════════════════
// NEON ODYSSEY — Exact Sketch Implementation
//
// SKETCH READING:
//   Road      → Z axis, car travels +Z direction
//   Car start → Z = -100
//   Buildings → RIGHT side of road (X = +18)
//   Stops     → About:0, Edu:30, Proj:50, Certs:70, Skills:90, Ach:110, Contact:130
//
//   TRAVELING camera → LEFT SIDE of car (X = -16), looks RIGHT at car
//   STOPPED camera   → RIGHT/SIDE CLOSE (X = +16, tight), sees car + building together
// ════════════════════════════════════════════════════════════
'use client';

'use client';

import {
  useRef,
  useState,
  useEffect,
  Suspense,
  useMemo,
  useCallback,
  forwardRef,
  memo,
} from 'react';

import { Canvas, useFrame, useThree } from '@react-three/fiber';

import {
  Stars,
  Text,
  Box,
  Cylinder,
  Sphere,
  Torus,
  Sparkles,
  Environment,
  useGLTF,
  Instances,
  Instance,
} from '@react-three/drei';

import { EffectComposer, Bloom } from '@react-three/postprocessing';

import * as THREE from 'three';

import { fetchRTDB } from '@/lib/rtdb';
import AgentHUD from './AgentHUD';
import { useVoice } from '@/hooks/useVoice';
const PURPLE = '#7B2FFF';
const BLUE   = '#00D4FF';
const YELLOW = '#E8FF00';
const DARK   = '#02010a';

// ─────────────────────────────────────────────────────────
// SECTION STOPS — exact positions from sketch
// carZ: where car stops on road (Z axis)
// buildingX: building is 18 units to RIGHT (+X) of road
// ─────────────────────────────────────────────────────────
export const ROOMS = [
  {
    id: 'about',
    label: 'About',
    carZ: 0,
    color: YELLOW,
    cityZone: 'SECTOR ZERO — IDENTITY TOWER',
    dialogue: "Initializing identity sequence. I am Jarvis — Suriya's personal AI intelligence. I am an AI Engineer and Researcher with over one year of experience as a Data Analyst, specializing in extracting insights from complex data and building intelligent systems. I design and develop AI-driven solutions that solve real-world problems using machine learning, deep learning, and modern full-stack technologies. My work focuses on creating scalable, efficient, and impactful systems that bridge the gap between data, intelligence, and innovation. I am passionate about advancing AI technologies and contributing to the future of intelligent automation like Creating AGI.",
    atmosphere: 'Cyber-Yellow pulse. Identity data streams cascade.'
  },

  {
    id: 'education',
    label: 'Education',
    carZ: 80,
    color: BLUE,
    cityZone: 'SECTOR ONE — KNOWLEDGE SPIRE',
    dialogue: "Knowledge Spire ahead. Suriya completed his Master of Computer Applications at Hindusthan College of Arts and Science, Coimbatore, graduating in 2024 with a CGPA of 7.6. Prior to that, he earned a Bachelor of Computer Applications from Government Arts and Science College, Dharmapuri. His foundation spans programming, data structures, and artificial intelligence.",
    atmosphere: 'Electric Blue neon grid. Degree scrolls float like constellations.'
  },

  {
    id: 'projects',
    label: 'Projects',
    carZ: 160,
    color: PURPLE,
    cityZone: 'SECTOR TWO — CREATION NEXUS',
    dialogue: "Entering the Creation Nexus. Suriya has engineered multiple advanced AI systems. VideoMind AI — an intelligent video processing and summarization platform. Loan AI — a machine learning system with explainable predictions. Autonomous AI Cyber Defense System — designed to detect and neutralize threats in real time. Alongside these, he developed tools like resume analyzers and sentiment analysis systems.",
    atmosphere: 'Deep Purple volumetric. Live project previews shimmer.'
  },

  {
    id: 'certificates',
    label: 'Certificates',
    carZ: 240,
    color: YELLOW,
    cityZone: 'SECTOR THREE — VALIDATION CITADEL',
    dialogue: "Validation Citadel activated. Suriya has earned certifications in Data Analytics from Izon Innovative Private Limited, Ethical Hacking Essentials from EC-Council, Python from Great Learning, and Machine Learning from Pantech Solutions. These credentials reflect his continuous pursuit of technical excellence.",
    atmosphere: 'Cyber-Yellow seals rotate in mid-air.'
  },

  {
    id: 'skills',
    label: 'Skills',
    carZ: 320,
    color: BLUE,
    cityZone: 'SECTOR FOUR — TECH CORE MATRIX',
    dialogue: "Initiating deep system scan. Suriya specializes in Python, Machine Learning, Deep Learning, Transformers, and Generative AI. He builds AI agents using LangChain and LangGraph. Skilled in React, Flask, and Streamlit for full-stack AI applications. Proficient in SQL, Power BI, Tableau, and advanced data analytics workflows.",
    atmosphere: 'Electric Blue scan lines pulse. Skill matrix materializes.'
  },

  {
    id: 'achievements',
    label: 'Achievements',
    carZ: 400,
    color: PURPLE,
    cityZone: 'SECTOR FIVE — TROPHY NEXUS',
    dialogue: "Accessing Trophy Nexus. Suriya has published a research paper on Machine Learning Techniques for 5G and beyond using Particle Swarm Optimization. His work focuses on improving network performance using intelligent algorithms, demonstrating strong research and innovation capabilities.",
    atmosphere: 'Purple-gold light refracts through crystal spires.'
  },

  {
    id: 'contact',
    label: 'Contact',
    carZ: 480,
    color: YELLOW,
    cityZone: 'SECTOR SIX — COMMAND NEXUS',
    dialogue: "Command Nexus reached. Suriya is open to AI engineering roles, research collaborations, and innovative projects. You can connect via email or explore his work on GitHub and LinkedIn. The future is built by those who take action.",
    atmosphere: 'All three neon colors converge. The city pulses in unison.'
  }
];

const BUILDING_X = 18;  // Buildings 18 units to the RIGHT of road

// ─────────────────────────────────────────────────────────
// FERRARI GLB
// ─────────────────────────────────────────────────────────
function FerrariGLB() {
  const { scene } = useGLTF('/models/ferrari.glb');

  useEffect(() => {
    scene.traverse((child) => {
      if (!child.isMesh) return;
      if (child.material) {
        if (child.material.envMapIntensity !== undefined) child.material.envMapIntensity = 5;
        if (child.material.metalness !== undefined) child.material.metalness = Math.max(child.material.metalness, 0.65);
        if (child.material.roughness !== undefined) child.material.roughness = Math.min(child.material.roughness, 0.12);
        child.material.needsUpdate = true;
      }
    });

    // Scale so car is ~5 units long (good size for chase cam)
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const longest = Math.max(size.x, size.y, size.z);
    const s = 5.0 / longest;
    scene.scale.setScalar(s);

    // Re-compute after scale and ground the model exactly at Y=0
    scene.updateMatrixWorld(true);
    const box2 = new THREE.Box3().setFromObject(scene);
    scene.position.y = -box2.min.y;   // ground exactly at 0
    scene.position.x = 0;
    scene.position.z = 0;
  }, [scene]);

  return <primitive object={scene} rotation={[0, Math.PI, 0]} />;
}

function GeometryFerrari() {
  return (
    <group>
      <Box args={[2.1, 0.62, 4.8]} position={[0, 0.42, 0]}>
        <meshStandardMaterial color="#8B0000" metalness={0.97} roughness={0.05} />
      </Box>
      <Box args={[2.0, 0.5, 1.5]} position={[0, 0.55, 1.9]}>
        <meshStandardMaterial color="#700000" metalness={0.97} roughness={0.06} />
      </Box>
      <Box args={[1.82, 0.52, 2.1]} position={[0, 0.95, -0.3]}>
        <meshStandardMaterial color="#0a0a14" transparent opacity={0.88} />
      </Box>
      <Box args={[1.76, 0.46, 0.07]} position={[0, 1.1, -1.05]} rotation={[-0.28, 0, 0]}>
        <meshStandardMaterial color={BLUE} transparent opacity={0.2} metalness={0.95} emissive={BLUE} emissiveIntensity={0.12} />
      </Box>
      <Box args={[2.18, 0.07, 0.9]} position={[0, 0.13, -2.55]}>
        <meshStandardMaterial color={YELLOW} emissive={YELLOW} emissiveIntensity={0.8} />
      </Box>
      <Box args={[2.1, 0.07, 1.1]} position={[0, 1.05, 2.25]}>
        <meshStandardMaterial color="#8B0000" metalness={0.95} />
      </Box>
      <Box args={[0.07, 0.1, 4.1]} position={[1.1, 0.16, 0]}>
        <meshStandardMaterial color={PURPLE} emissive={PURPLE} emissiveIntensity={1.5} />
      </Box>
      <Box args={[0.07, 0.1, 4.1]} position={[-1.1, 0.16, 0]}>
        <meshStandardMaterial color={PURPLE} emissive={PURPLE} emissiveIntensity={1.5} />
      </Box>
      {[[1.1, 0, -1.55], [-1.1, 0, -1.55], [1.1, 0, 1.55], [-1.1, 0, 1.55]].map((pos, i) => (
        <group key={i} position={pos} rotation={[0, 0, Math.PI / 2]}>
          <Cylinder args={[0.46, 0.46, 0.28, 18]}><meshStandardMaterial color="#060606" roughness={0.9} /></Cylinder>
          <Torus args={[0.46, 0.09, 8, 18]}><meshStandardMaterial color="#1a1a1a" metalness={0.7} /></Torus>
        </group>
      ))}
      <Box args={[0.55, 0.14, 0.07]} position={[0.72, 0.52, -2.47]}>
        <meshStandardMaterial color={BLUE} emissive={BLUE} emissiveIntensity={6} />
      </Box>
      <Box args={[0.55, 0.14, 0.07]} position={[-0.72, 0.52, -2.47]}>
        <meshStandardMaterial color={BLUE} emissive={BLUE} emissiveIntensity={6} />
      </Box>
      <pointLight position={[0.7, 0.6, -3.8]} intensity={6} color={BLUE} distance={28} />
      <pointLight position={[-0.7, 0.6, -3.8]} intensity={6} color={BLUE} distance={28} />
      <Box args={[0.48, 0.1, 0.07]} position={[0.72, 0.5, 2.47]}>
        <meshStandardMaterial color="#ff1818" emissive="#ff1818" emissiveIntensity={2.5} />
      </Box>
      <Box args={[0.48, 0.1, 0.07]} position={[-0.72, 0.5, 2.47]}>
        <meshStandardMaterial color="#ff1818" emissive="#ff1818" emissiveIntensity={2.5} />
      </Box>
      <pointLight position={[0, 0.5, 2.8]} color={PURPLE} intensity={1.5} distance={6} />
    </group>
  );
}

// ─────────────────────────────────────────────────────────
// FERRARI ENTITY — moves along +Z axis
// ─────────────────────────────────────────────────────────
const Ferrari = memo(forwardRef(({ targetZ }, forwardedRef) => {
  const localRef = useRef();
  const initDone = useRef(false);

  useEffect(() => {
    if (localRef.current && !initDone.current) {
      localRef.current.position.set(0, 0, -100);
      localRef.current.rotation.y = Math.PI;
      initDone.current = true;
    }
  }, []);

  useFrame(({ clock }) => {
    if (!localRef.current) return;

    const prevZ = localRef.current.position.z;

    localRef.current.position.z = THREE.MathUtils.lerp(
      localRef.current.position.z,
      targetZ,
      0.026
    );

    localRef.current.position.x = 0;
    localRef.current.position.y = Math.sin(clock.elapsedTime * 12) * 0.005;

    const direction = targetZ - prevZ;

    let targetRotationY = localRef.current.rotation.y;

    if (direction > 0.01) targetRotationY = Math.PI;
    else if (direction < -0.01) targetRotationY = 0;

    localRef.current.rotation.y = THREE.MathUtils.lerp(
      localRef.current.rotation.y,
      targetRotationY,
      0.08
    );
  });

  return (
    <group
      ref={(node) => {
        localRef.current = node;
        if (forwardedRef) forwardedRef.current = node;
      }}
    >
      <Suspense fallback={<GeometryFerrari />}>
        <FerrariGLB />
      </Suspense>
    </group>
  );
}));
// ─────────────────────────────────────────────────────────
// CINEMATIC CAMERA — Low bumper-level chase cam
// Car travels +Z. Camera behind car at low Y = sees rear of car.
// ─────────────────────────────────────────────────────────
const CinematicCamera = memo(function CinematicCamera({ targetZ, isTransitioning, carRef }) {
  const { camera } = useThree();
  // Reused every frame instead of allocating a new Vector3 60x/sec — the camera
  // moves almost constantly, so this was the single largest GC-pressure source
  // in the scene and the likely cause of the periodic micro-stutter during pans.
  const camTarget = useRef(new THREE.Vector3());
  // Single continuous orbit around the car instead of two disconnected formulas
  // (a "back view" drive-start pose and a "front view" stop pose on opposite
  // sides of the car). That old version required the camera to swing all the
  // way around the car between every stop and every new drive, and it never
  // reliably completed that swing after the first section — hence the
  // back -> side -> back instead of back -> side -> front. Now angle=PI is
  // back, PI/2 is side, 0 is front, and it only ever moves one direction
  // (PI -> 0), resetting to PI at the start of each new drive, so every
  // section goes through the same sequence.
  const ORBIT_SWEEP_SECONDS = 4.5;
  const ORBIT_RADIUS = 11;
  const angle = useRef(Math.PI);
  const wasTransitioning = useRef(false);

  useFrame((_, delta) => {
  if (!carRef?.current) return;

  const car = carRef.current.position;

  if (isTransitioning && !wasTransitioning.current) {
    angle.current = Math.PI; // fresh drive: start from back view again
  }
  wasTransitioning.current = isTransitioning;

  angle.current = Math.max(0, angle.current - (Math.PI / ORBIT_SWEEP_SECONDS) * delta);
  const p = 1 - angle.current / Math.PI; // 0 at back view, 1 at front view

  const camX = car.x - ORBIT_RADIUS * Math.sin(angle.current);
  const camY = car.y + THREE.MathUtils.lerp(3, 1.6, p);
  // + here, not - : the car's front faces the opposite Z side from what this
  // was originally set to, confirmed from a live screenshot showing the stop
  // pose (angle=0) landing on the back of the car instead of the front.
  const camZ = car.z + ORBIT_RADIUS * Math.cos(angle.current);

  camTarget.current.set(camX, camY, camZ);
  camera.position.lerp(camTarget.current, 0.08);
  camera.lookAt(car.x, car.y + THREE.MathUtils.lerp(1.8, 1, p), car.z);
});

  return null;
});

// ─────────────────────────────────────────────────────────
// ROAD — Along Z axis, centered on X=0
// Buildings are to the RIGHT (+X = +18)
// Static geometry takes no props, so it's memoized and the repeated dashes/lamps
// are instanced — same visuals, far fewer draw calls than one mesh per dash/lamp.
// ─────────────────────────────────────────────────────────
const Road = memo(function Road() {
  const roadLength = 700;   // from -100 to +180 = 280 units
  const roadCenterZ = 200;   // center of travel range
  const dashCount = 140;
  const lampCount = 24;

  const lampPositions = useMemo(
    () => Array.from({ length: lampCount }, (_, i) => [-7.5, -100 + i * 10]),
    []
  );

  return (
    <group>
      {/* Main road surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, roadCenterZ]}>
        <planeGeometry args={[12, roadLength]} />
        <meshStandardMaterial color="#06060f" roughness={0.93} metalness={0.15} />
      </mesh>

      {/* Centre dashes — PURPLE, along Z — instanced: 140 dashes in a single draw call */}
      <Instances limit={dashCount}>
        <boxGeometry args={[0.12, 0.025, 4]} />
        <meshStandardMaterial color={PURPLE} emissive={PURPLE} emissiveIntensity={2.0} />
        {Array.from({ length: dashCount }).map((_, i) => (
          <Instance key={i} position={[0, 0.01, -100 + i * 5]} />
        ))}
      </Instances>

      {/* LEFT edge — BLUE (far from buildings) */}
      <Box args={[0.08, 0.025, roadLength]} position={[-5.5, 0.01, roadCenterZ]}>
        <meshStandardMaterial color={BLUE} emissive={BLUE} emissiveIntensity={2.2} />
      </Box>
      {/* RIGHT edge — YELLOW (toward buildings) */}
      <Box args={[0.08, 0.025, roadLength]} position={[5.5, 0.01, roadCenterZ]}>
        <meshStandardMaterial color={YELLOW} emissive={YELLOW} emissiveIntensity={2.2} />
      </Box>

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, roadCenterZ]}>
        <planeGeometry args={[120, roadLength + 60]} />
        <meshStandardMaterial color="#010108" roughness={1} />
      </mesh>

      {/* Street lamps — LEFT side (camera side) — posts + bulbs instanced, lights stay individual */}
      <Instances limit={lampCount}>
        <cylinderGeometry args={[0.06, 0.09, 4.2, 5]} />
        <meshStandardMaterial color="#090918" metalness={0.88} roughness={0.15} />
        {lampPositions.map(([x, z], i) => (
          <Instance key={i} position={[x, 2.1, z]} />
        ))}
      </Instances>
      <Instances limit={Math.ceil(lampCount / 2)}>
        <sphereGeometry args={[0.14, 7, 7]} />
        <meshStandardMaterial color={PURPLE} emissive={PURPLE} emissiveIntensity={6} />
        {lampPositions.filter((_, i) => i % 2 === 0).map(([x, z], i) => (
          <Instance key={i} position={[x, 4.5, z]} />
        ))}
      </Instances>
      <Instances limit={Math.floor(lampCount / 2)}>
        <sphereGeometry args={[0.14, 7, 7]} />
        <meshStandardMaterial color={BLUE} emissive={BLUE} emissiveIntensity={6} />
        {lampPositions.filter((_, i) => i % 2 === 1).map(([x, z], i) => (
          <Instance key={i} position={[x, 4.5, z]} />
        ))}
      </Instances>
      {/* Lamp bulbs no longer cast real dynamic lights — 24 always-on point lights
          were the single biggest lighting cost in this scene. Their emissive
          material is already bright enough that <Bloom/> reproduces the same
          glow purely as a post-process, at a fraction of the GPU cost. */}
    </group>
  );
});

// 🔥 FIRE TEXT COMPONENT
const FireText = memo(function FireText({ text }) {
  const ref = useRef();
  const colorRef = useRef();
  if (!colorRef.current) colorRef.current = new THREE.Color();
  const frameCount = useRef(0);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    // 7 banners each recomputing HSL + touching material every frame adds up;
    // the hue cycle is slow enough that every 3rd frame (~20fps) looks identical.
    frameCount.current++;
    if (frameCount.current % 3 !== 0) return;

    const t = clock.elapsedTime;

    // 🔥 animated emissive glow
    ref.current.material.emissiveIntensity =
      2 + Math.sin(t * 4) * 1.5;

    // 🔥 flowing color shift — reuse one Color instance instead of allocating a
    // new THREE.Color 60x/sec per banner (7 banners × 60fps = 420 allocs/sec saved)
    const hue = (t * 0.1) % 1;
    colorRef.current.setHSL(hue, 1, 0.5);
    ref.current.material.color.copy(colorRef.current);
    ref.current.material.emissive.copy(colorRef.current);

    // 🔥 slight breathing scale
    const scale = 1 + Math.sin(t * 3) * 0.05;
    ref.current.scale.set(scale, scale, scale);
  });

  return (
    <Text
      ref={ref}
      position={[0, 1, 0]}
      fontSize={2}
      anchorX="center"
      anchorY="middle"
      rotation={[0, Math.PI, 0]}
    >
      {text}

      <meshStandardMaterial
        color="#ff2200"
        emissive="#ff5500"
        emissiveIntensity={2}
        roughness={0.2}
        metalness={0.8}
        toneMapped={false}
      />
    </Text>
  );
});


// 🔥 ROAD BANNER (FINAL)
const RoadBanner = memo(function RoadBanner({ text, z, color }) {
  return (
    <group position={[0, 10, z]}>
      
      {/* 🔥 CURVED ARCH */}
      <mesh>
        <torusGeometry args={[8, 0.5, 16, 100, Math.PI]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={4}
        />
      </mesh>

      {/* LEFT POLE */}
      <mesh position={[-8, -5, 0]}>
        <boxGeometry args={[0.3, 10, 0.3]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5}/>
      </mesh>

      {/* RIGHT POLE */}
      <mesh position={[8, -5, 0]}>
        <boxGeometry args={[0.3, 10, 0.3]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5}/>
      </mesh>

      {/* 🔥 FIRE TEXT */}
      <FireText text={text} />
      {/* Glow plane is emissive-lit by <Bloom/> now — the two pointLights that used
          to sit here (×7 banners = 14 always-on lights) are gone; same glow, no
          per-fragment lighting cost. */}
      <mesh position={[0, 1, -0.3]}>
  <planeGeometry args={[8, 3]} />
  <meshBasicMaterial
    color="#ff5500"
    transparent
    opacity={0.25}
  />
</mesh>
    </group>
  );
});


// ─────────────────────────────────────────────────────────
// SECTION BUILDING — placed on RIGHT side (X=+18 from road)
// Faces LEFT toward road (toward camera when stopped)
// ─────────────────────────────────────────────────────────
const SectionBuilding = memo(function SectionBuilding({ room, isActive, isNear }) {
  const glowRef = useRef();
  const c = room.color;
  const H = 32;

  useFrame(({ clock }) => {
    if (glowRef.current) {
      glowRef.current.intensity = isActive
        ? 10 + Math.sin(clock.elapsedTime * 2.1) * 4
        : 0.5;
    }
  });

  return (
    // Building at RIGHT side: X=+18, Z=carZ (same Z as car stop)
    <group position={[BUILDING_X, 0, room.carZ]}>
      {/* Main dark body */}
      <Box args={[12, H, 10]} position={[0, H/2, 0]}>
        <meshStandardMaterial color="#03030e" metalness={0.98} roughness={0.02} />
      </Box>

      {/* LEFT glass face — faces -X (toward road and camera) */}
      <Box args={[0.12, H, 10]} position={[-6.1, H/2, 0]}>
        <meshStandardMaterial
          color={c}
          transparent opacity={isActive ? 0.25 : 0.06}
          metalness={0.9} roughness={0}
          emissive={c} emissiveIntensity={isActive ? 0.3 : 0.04}
        />
      </Box>

      {/* Frame edges */}
      <Box args={[12.6, 0.22, 10.6]} position={[0, H+0.11, 0]}>
        <meshStandardMaterial color={c} emissive={c} emissiveIntensity={isActive ? 4 : 0.4} />
      </Box>
      <Box args={[12.6, 0.22, 10.6]} position={[0, 0.11, 0]}>
        <meshStandardMaterial color={c} emissive={c} emissiveIntensity={isActive ? 4 : 0.4} />
      </Box>
      <Box args={[0.22, H, 10.6]} position={[-6.4, H/2, 0]}>
        <meshStandardMaterial color={c} emissive={c} emissiveIntensity={isActive ? 4 : 0.4} />
      </Box>
      <Box args={[0.22, H, 10.6]} position={[6.4, H/2, 0]}>
        <meshStandardMaterial color={c} emissive={c} emissiveIntensity={isActive ? 4 : 0.4} />
      </Box>

      {/* Section label — on left face, visible from road */}
      <Text
        position={[-6.2, H+4.5, 0]}
        fontSize={2.2}
        color={c}
        anchorX="center"
        anchorY="middle"
        outlineColor="#000"
        outlineWidth={0.08}
        rotation={[0, -Math.PI/2, 0]}
      >
        {room.label.toUpperCase()}
      </Text>
      <Text
        position={[-6.2, H+2.2, 0]}
        fontSize={0.75}
        color="rgba(255,255,255,0.25)"
        anchorX="center"
        rotation={[0, -Math.PI/2, 0]}
      >
        {room.cityZone}
      </Text>

      {/* Active glow — shines LEFT toward road. Only the current room and its
          immediate neighbors keep a real light; the other 4-5 buildings rely on
          <Bloom/> for their idle glow (see frame color/edge emissive above) —
          cuts this from 7 always-on lights down to at most 3. */}
      {isNear && <pointLight ref={glowRef} position={[-7, 8, 0]} color={c} distance={40} intensity={0.5} />}

      {isActive && (
        <>
          <Sparkles count={10} scale={[12, H, 8]} position={[0, H/2, 0]} size={1.2} speed={0.28} color={c} />
          {/* Ground projection from building toward road */}
          <mesh rotation={[-Math.PI/2, 0, 0]} position={[-8, 0.02, 0]}>
            <planeGeometry args={[6, 10]} />
            <meshStandardMaterial color={c} transparent opacity={0.14} emissive={c} emissiveIntensity={0.55} />
          </mesh>
        </>
      )}
    </group>
  );
});

// ─────────────────────────────────────────────────────────
// CITY SKYLINE — far RIGHT (+X) of buildings
// ─────────────────────────────────────────────────────────
// Bodies/edge-strips/caps are each same-sized-enough to instance per color group —
// same 16-building skyline, 3 draw calls instead of 16 groups of 4 meshes + 16 lights.
// (Box/Cylinder geometry differs slightly per building, so bodies use a unit box/cylinder
// scaled per-instance rather than sharing one literal geometry.)
const CityBackground = memo(function CityBackground() {
  const bldgs = useMemo(() => {
    const cols = [PURPLE, BLUE, YELLOW];
    return Array.from({ length: 16 }).map((_, i) => ({
      x: BUILDING_X + 18 + (i % 4) * 12,
      z: -80 + Math.floor(i / 4) * 58,
      h: 28 + (i % 5) * 14,
      w: 6 + (i % 3) * 3,
      color: cols[i % 3],
    }));
  }, []);

  const byColor = useMemo(() => {
    const groups = { [PURPLE]: [], [BLUE]: [], [YELLOW]: [] };
    bldgs.forEach(b => groups[b.color].push(b));
    return groups;
  }, [bldgs]);

  return (
    <group>
      {/* Dark bodies — one instanced draw call for all 16, unlit color so no light needed */}
      <Instances limit={16}>
        <boxGeometry args={[1, 1, 5]} />
        <meshStandardMaterial color="#02020b" metalness={0.97} roughness={0.03} />
        {bldgs.map((b, i) => (
          <Instance key={i} position={[b.x, b.h / 2, b.z]} scale={[b.w, b.h, 1]} />
        ))}
      </Instances>

      {/* Neon edge strips + roof caps — instanced per color, glow comes from <Bloom/> */}
      {Object.entries(byColor).map(([color, group]) => (
        <group key={color}>
          <Instances limit={group.length * 2}>
            <boxGeometry args={[0.1, 1, 0.1]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.5} />
            {group.map((b, i) => (
              <Instance key={`l${i}`} position={[b.x - b.w / 2, b.h / 2, b.z + 2.6]} scale={[1, b.h, 1]} />
            ))}
            {group.map((b, i) => (
              <Instance key={`r${i}`} position={[b.x + b.w / 2, b.h / 2, b.z + 2.6]} scale={[1, b.h, 1]} />
            ))}
          </Instances>
          <Instances limit={group.length}>
            <cylinderGeometry args={[0.05, 0.1, 1, 4]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={5} />
            {group.map((b, i) => (
              <Instance key={`c${i}`} position={[b.x, b.h + b.h * 0.07, b.z]} scale={[1, b.h * 0.14, 1]} />
            ))}
          </Instances>
        </group>
      ))}
    </group>
  );
});

// ─────────────────────────────────────────────────────────
// NEON RAIN
// ─────────────────────────────────────────────────────────
const NeonRain = memo(function NeonRain({ targetZ }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const a = new Float32Array(180);
    for (let i = 0; i < 60; i++) {
      a[i*3]   = (Math.random() - 0.5) * 30;
      a[i*3+1] = Math.random() * 22;
      a[i*3+2] = (Math.random() - 0.5) * 22;
    }
    return a;
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, BUILDING_X * 0.5, 0.04);
    ref.current.position.z = THREE.MathUtils.lerp(ref.current.position.z, targetZ, 0.04);
    const p = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < 60; i++) {
      p[i*3+1] -= 0.12;
      if (p[i*3+1] < 0) {
        p[i*3]   = (Math.random() - 0.5) * 30;
        p[i*3+1] = 22;
        p[i*3+2] = (Math.random() - 0.5) * 22;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} position={[BUILDING_X * 0.5, 0, targetZ]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={BLUE} size={0.05} transparent opacity={0.36} sizeAttenuation />
    </points>
  );
});

// ─────────────────────────────────────────────────────────
// SCENE LIGHTING
// ─────────────────────────────────────────────────────────
const SceneLighting = memo(function SceneLighting({ activeRoom }) {
  const room = ROOMS[activeRoom];
  const color = room?.color || YELLOW;

  return (
    <>
      <Stars radius={320} depth={55} count={2800} factor={4} saturation={0.5} fade speed={0.18} />
      <ambientLight intensity={0.1} color="#07051c" />
      <directionalLight position={[20, 50, 30]} intensity={0.3} color="#b0b8ff" />
      {/* Key light from building side — shines LEFT toward road */}
      <pointLight position={[BUILDING_X + 8, 28, room?.carZ || 0]} intensity={16} color={color} distance={200} />
      {/* Road under-glow */}
      <pointLight position={[0, -1, 40]} intensity={3.5} color={PURPLE} distance={300} />
      <fog attach="fog" args={[DARK, 200, 800]} />
    </>
  );
});

// ─────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────
export default function AgenticScene() {
  const [currentRoom, setCurrentRoom]     = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showBigCard, setShowBigCard]     = useState(false);
  const [data, setData]                   = useState({});
  const { speak, stop, speaking, persona, switchPersona } = useVoice();
  const carRef = useRef();
  const [canAutoMove, setCanAutoMove] = useState(false);

  useEffect(() => {
  const load = async () => {
    try {
      const [about, education, projects, certificates, skills, achievements] = await Promise.all([
        fetchRTDB('about'),
        fetchRTDB('education'),
        fetchRTDB('projects'),
        fetchRTDB('certificates'),
        fetchRTDB('skills'),
        fetchRTDB('achievements'),
      ]);

      const loadedData = { about, education, projects, certificates, skills, achievements };
      setData(loadedData);

      // 🔥 START ONLY AFTER DATA LOAD
      speak("Neon Odyssey initialized. Starting journey.");

      setTimeout(() => {
        goToRoom(0);
      }, 2000);

    } catch (e) {
      console.error(e);
    }
  };

  load();
}, []);

  useEffect(() => {
  if (!canAutoMove) return;

  if (!isTransitioning && !speaking) {
    const timer = setTimeout(() => {
      goToRoom(currentRoom + 1);
    }, 2500);

    return () => clearTimeout(timer);
  }
}, [speaking, currentRoom, canAutoMove]);

function buildSpeechFromData(roomId, data) {
  const section = data[roomId];
  if (!section) return "";

  const items = Array.isArray(section) ? section : [section];

  let speech = "";

  // 🔥 ADD SECTION NAME INTRO (MAIN FIX)
  if (roomId === "about") {
    speech += "Initializing profile. ";
  } 
  else if (roomId === "education") {
    speech += "Education records loaded. ";
  } 
  else if (roomId === "projects") {
    speech += "Entering Projects section. ";
  } 
  else if (roomId === "skills") {
    speech += "Accessing Skills module. ";
  } 
  else if (roomId === "certificates") {
    speech += "Opening Certifications archive. ";
  } 
  else if (roomId === "achievements") {
    speech += "Displaying Achievements. ";
  }

  // 🔥 LOOP DATA
  items.forEach((item, i) => {

    if (roomId === "education") {
      speech += `Education ${i + 1}. ${item.title || ""}. `;
      speech += `${item.institution || ""}. `;
      speech += `GPA ${item.gpa || ""}. `;
      speech += `${item.description || ""}. `;
    }

    else if (roomId === "about") {
      speech += `${item.title || ""}. `;
      speech += `${item.tagline || ""}. `;
      speech += `${item.bio || ""}. `;
      speech += `${item.location || ""}. `;
    }

    else if (roomId === "projects") {
      speech += `${item.title || ""}. ${item.description || item.bio || ""}. `;
    }

    else if (roomId === "skills") {
      speech += `${item.title || ""}. `;
    }

    else if (roomId === "certificates") {
      speech += `${item.title || ""}. ${item.issuer || ""}. `;
    }

    else {
      speech += `${item.title || ""}. ${item.description || ""}. `;
    }
  });

  return speech;
}

  const goToRoom = useCallback((i) => {
    if (i < 0 || i >= ROOMS.length) return;
    setShowBigCard(false);
    setIsTransitioning(true);
    setCurrentRoom(i);
    setTimeout(() => {
  setIsTransitioning(false);
  setCanAutoMove(false);

  // 🔥 DYNAMIC SPEECH
  const dynamicSpeech = buildSpeechFromData(ROOMS[i].id, data);
  if (dynamicSpeech && dynamicSpeech.length > 10) {
  speak(dynamicSpeech);
} else {
  speak(ROOMS[i].dialogue);
}



  setTimeout(() => setShowBigCard(true), 1200);

  const speechDuration = (dynamicSpeech?.length || 50) * 50;

  setTimeout(() => {
    setCanAutoMove(true);
  }, speechDuration + 2000);

}, 2600);
  }, [speak, data]);

  const rawData = data[ROOMS[currentRoom]?.id];

const sectionData = useMemo(() => {
  if (!rawData) return [];
  return Array.isArray(rawData) ? rawData : [rawData];
}, [rawData]);

  // Pull resume URL from about data (supports resumeUrl, resume, cvUrl, cv fields)
  const resumeUrl = useMemo(() => {
    const about = data.about;
    if (!about) return '';
    const item = Array.isArray(about) ? about[0] : about;
    return item?.resumeUrl || item?.resume || item?.cvUrl || item?.cv || '';
  }, [data.about]);

  const targetZ = ROOMS[currentRoom]?.carZ ?? 0;

  // Stable handler identities so <AgentHUD> (memoized) can actually skip re-renders
  // when unrelated state (e.g. canAutoMove) changes elsewhere in this component.
  const handleNext = useCallback(() => goToRoom(currentRoom + 1), [goToRoom, currentRoom]);
  const handlePrev = useCallback(() => goToRoom(currentRoom - 1), [goToRoom, currentRoom]);
  const handleCloseBigCard = useCallback(() => setShowBigCard(false), []);

  return (
    <div style={{ width:'100%', height:'100vh', position:'relative', overflow:'hidden', background:DARK }}>
      <Canvas
        shadows={false}
        dpr={[1, 1.2]}
        // Initial camera: LEFT side of road, will GSAP to correct position
        camera={{ position: [0, 1.8, -86], fov: 72, near: 0.1, far: 700 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          outputColorSpace: THREE.SRGBColorSpace,
          powerPreference: 'high-performance',
        }}
      >
        <Suspense fallback={null}>
          <SceneLighting activeRoom={currentRoom} />
          <Environment preset="night" />
          <Road />

{/* 🔥 ROAD BANNERS (ALL SECTIONS) */}
{ROOMS.map((room) => (
  <RoadBanner
    key={room.id}
    text={room.label}
    z={room.carZ}
    color={room.color}
  />
))}

<CityBackground />

{ROOMS.map((room, i) => (
  <SectionBuilding key={room.id} room={room} isActive={i === currentRoom} isNear={Math.abs(i - currentRoom) <= 1} />
))}
          <Ferrari ref={carRef} targetZ={targetZ} />
          <NeonRain targetZ={targetZ} />
          <CinematicCamera
  targetZ={targetZ}
  isTransitioning={isTransitioning}
  carRef={carRef}
/>
          {/* Bloom replaces the ~54 always-on decorative point lights removed above —
              same neon glow on every emissive surface, as one full-screen pass instead
              of dozens of per-fragment light calculations. */}
          <EffectComposer multisampling={0}>
            <Bloom
              luminanceThreshold={0.75}
              luminanceSmoothing={0.25}
              intensity={0.35}
              mipmapBlur
            />
          </EffectComposer>
        </Suspense>
      </Canvas>

      <AgentHUD
        rooms={ROOMS}
        currentRoom={currentRoom}
        onNext={handleNext}
        onPrev={handlePrev}
        onGoTo={goToRoom}
        speaking={speaking}
        roomInfo={ROOMS[currentRoom]}
        sectionData={sectionData}
        isTransitioning={isTransitioning}
        atmosphere={ROOMS[currentRoom]?.atmosphere}
        showBigCard={showBigCard}
        onCloseBigCard={handleCloseBigCard}
        resumeUrl={resumeUrl}
        persona={persona}
        switchPersona={switchPersona}
        stopVoice={stop}
      />

      {/* Letterbox */}
      <div style={{ position:'fixed', top:0, left:0, right:0, height:'5vh', background:'#000', zIndex:50, pointerEvents:'none' }} />
      <div style={{ position:'fixed', bottom:0, left:0, right:0, height:'5vh', background:'#000', zIndex:50, pointerEvents:'none' }} />

      {/* Vignette */}
      <div style={{ position:'fixed', inset:0, zIndex:10, pointerEvents:'none',
        background:'radial-gradient(ellipse 165% 50% at 50% 56%, transparent 46%, rgba(0,0,0,0.6) 100%)' }} />

      {/* Suit accent lines */}
      <div style={{ position:'fixed', top:'5vh', left:0, right:0, height:'2px', zIndex:45, pointerEvents:'none',
        background:`linear-gradient(to right, ${PURPLE}, ${BLUE}, ${YELLOW}, ${BLUE}, ${PURPLE})`, opacity:0.85 }} />
      <div style={{ position:'fixed', bottom:'5vh', left:0, right:0, height:'2px', zIndex:45, pointerEvents:'none',
        background:`linear-gradient(to right, ${YELLOW}, ${BLUE}, ${PURPLE}, ${BLUE}, ${YELLOW})`, opacity:0.85 }} />
    </div>
  );
}

useGLTF.preload('/models/ferrari.glb');