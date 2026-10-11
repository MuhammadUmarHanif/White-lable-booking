import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const ThreeHeroVisual: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setWebGLSupported(false);
      return;
    }

    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Test WebGL context availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLSupported(false);
        return;
      }
    } catch {
      setWebGLSupported(false);
      return;
    }

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = currentMount.clientWidth || 400;
    const height = currentMount.clientHeight || 400;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      currentMount.appendChild(renderer.domElement);
    } catch (e) {
      setWebGLSupported(false);
      return;
    }

    // 2. Lighting - Warm champagne studio illumination
    const ambientLight = new THREE.AmbientLight(0xfff5e6, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffdf88, 2.5);
    dirLight1.position.set(5, 6, 4);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight2.position.set(-5, -4, 3);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xffebaa, 3, 10);
    pointLight.position.set(0, 0, 3);
    scene.add(pointLight);

    // 3. 3D Interlocking Wedding Rings & Diamond Solitaire
    const ringGroup = new THREE.Group();

    // Metallic Gold Material
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.92,
      roughness: 0.18,
    });

    // Platinum / White Gold Accent Material
    const platinumMaterial = new THREE.MeshStandardMaterial({
      color: 0xf3e5ab,
      metalness: 0.95,
      roughness: 0.15,
    });

    // Ring 1 (Groom's Classic Band)
    const ringGeo1 = new THREE.TorusGeometry(1.5, 0.18, 32, 100);
    const ring1 = new THREE.Mesh(ringGeo1, goldMaterial);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    ringGroup.add(ring1);

    // Ring 2 (Bride's Interlocking Diamond Ring)
    const ringGeo2 = new THREE.TorusGeometry(1.4, 0.14, 32, 100);
    const ring2 = new THREE.Mesh(ringGeo2, platinumMaterial);
    ring2.position.set(0.7, 0.4, 0.2);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = Math.PI / 3.5;
    ringGroup.add(ring2);

    // Brilliant Diamond Crown
    const diamondGeo = new THREE.OctahedronGeometry(0.32, 2);
    const diamondMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.9,
      opacity: 1,
      transparent: true,
      roughness: 0.05,
      ior: 2.4, // Real diamond refractive index
      metalness: 0.1,
    });
    const diamond = new THREE.Mesh(diamondGeo, diamondMat);
    diamond.position.set(0.7, 1.85, 0.2);
    ringGroup.add(diamond);

    scene.add(ringGroup);

    // 4. Subtle ambient champagne stardust particles
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 8;
      positions[i + 1] = (Math.random() - 0.5) * 8;
      positions[i + 2] = (Math.random() - 0.5) * 4;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xf3e5ab,
      size: 0.06,
      transparent: true,
      opacity: 0.7,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 5. Interactive Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = currentMount.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 0.8;
      targetY = y * 0.8;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 6. Responsive Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0 || !renderer) return;
      const { width: newWidth, height: newHeight } = entries[0].contentRect;
      if (newWidth > 0 && newHeight > 0) {
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      }
    });
    resizeObserver.observe(currentMount);

    // 7. Animation Loop with resource cleanup
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle floating rotation
      ringGroup.rotation.y = elapsedTime * 0.35 + mouseX;
      ringGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.15 + mouseY;
      ringGroup.position.y = Math.sin(elapsedTime * 0.8) * 0.12;

      // Subtle particle float
      particles.rotation.y = -elapsedTime * 0.08;

      // Smooth camera / mouse interpolation
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      renderer?.render(scene, camera);
    };

    animate();

    // Cleanup resources on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();

      ringGeo1.dispose();
      ringGeo2.dispose();
      diamondGeo.dispose();
      goldMaterial.dispose();
      platinumMaterial.dispose();
      diamondMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  if (!webGLSupported) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8">
        <div className="relative w-64 h-64 rounded-full border border-[#D4AF37]/30 flex items-center justify-center bg-gradient-to-b from-[#F5EFEB] to-[#FAF8F5] shadow-2xl">
          <div className="w-48 h-48 rounded-full border-2 border-dashed border-[#D4AF37]/60 flex items-center justify-center">
            <span className="text-4xl text-[#D4AF37]">✦</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mountRef} 
      className="w-full h-full min-h-[380px] lg:min-h-[460px] flex items-center justify-center cursor-grab active:cursor-grabbing"
      aria-label="Interactive 3D Rings Visual"
    />
  );
};
