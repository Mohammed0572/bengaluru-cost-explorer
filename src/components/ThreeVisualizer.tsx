import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

interface CategoryData {
  name: string;
  avg: number;
}

interface ThreeVisualizerProps {
  data: CategoryData[];
  onCategorySelect?: (category: string | null) => void;
}

interface Particle {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  lifetime: number;
  age: number;
}

export const ThreeVisualizer = ({ data, onCategorySelect }: ThreeVisualizerProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ visible: boolean; x: number; y: number; text: string }>({
    visible: false,
    x: 0,
    y: 0,
    text: "",
  });

  useEffect(() => {
    if (!mountRef.current || data.length === 0) return;

    // SCENE SETUP
    const scene = new THREE.Scene();
    
    // CAMERA SETUP
    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    // Position camera dynamically based on number of items
    camera.position.set(0, 15, 25);
    camera.lookAt(0, 0, 0);

    // RENDERER SETUP
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // ORBIT CONTROLS
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = true;
    controls.maxPolarAngle = Math.PI / 2.1;

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 50;
    dirLight.shadow.camera.left = -15;
    dirLight.shadow.camera.right = 15;
    dirLight.shadow.camera.top = 15;
    dirLight.shadow.camera.bottom = -15;
    scene.add(dirLight);

    // FLOOR
    const floorGeometry = new THREE.PlaneGeometry(50, 50);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1e293b, 
      roughness: 0.8, 
      metalness: 0.2 
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    floor.position.y = 0;
    scene.add(floor);

    // DATA BARS
    const barsGroup = new THREE.Group();
    scene.add(barsGroup);

    const maxAvg = Math.max(...data.map(d => d.avg));
    const maxHeight = 10;
    const barWidth = 1.5;
    const gap = 0.5;
    const totalWidth = data.length * barWidth + (data.length - 1) * gap;
    const startX = -totalWidth / 2 + barWidth / 2;

    const colors = [
      0xf59e0b, // Amber
      0x10b981, // Emerald
      0x3b82f6, // Blue
      0x8b5cf6, // Violet
      0xec4899, // Pink
      0x14b8a6, // Teal
    ];

    const meshes: THREE.Mesh[] = [];

    data.forEach((item, index) => {
      const height = (item.avg / maxAvg) * maxHeight;
      
      const geometry = new THREE.BoxGeometry(barWidth, 1, barWidth); // Initial height 1 for scaling animation
      const material = new THREE.MeshStandardMaterial({ 
        color: colors[index % colors.length],
        roughness: 0.3,
        metalness: 0.7
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(startX + index * (barWidth + gap), 0.5, 0); // Y position 0.5 for scaling from bottom
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      
      // Store custom data for raycasting and animation
      mesh.userData = { 
        name: item.name, 
        avg: item.avg, 
        targetScaleY: Math.max(height, 0.1), // Avoid 0 scale
        originalColor: new THREE.Color(colors[index % colors.length]),
        baseTargetScaleY: Math.max(height, 0.1), // Store base scale for selection toggle
      };
      
      barsGroup.add(mesh);
      meshes.push(mesh);
    });

    // INTERACTION (Raycasting)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredMesh: THREE.Mesh | null = null;

    // SELECTION STATE
    let selectedMesh: THREE.Mesh | null = null;

    // PARTICLE SYSTEM
    const particles: Particle[] = [];
    const particleGeometry = new THREE.IcosahedronGeometry(0.15, 0);

    const spawnParticles = (bar: THREE.Mesh) => {
      const barColor = bar.userData.originalColor as THREE.Color;
      const barTop = bar.position.y + bar.scale.y / 2;
      const count = 15 + Math.floor(Math.random() * 6); // 15-20 particles

      for (let i = 0; i < count; i++) {
        // Slightly lighter color
        const particleColor = barColor.clone().lerp(new THREE.Color(0xffffff), 0.3);
        const material = new THREE.MeshStandardMaterial({
          transparent: true,
          color: particleColor,
        });

        const particleMesh = new THREE.Mesh(particleGeometry, material);
        particleMesh.position.set(
          bar.position.x + (Math.random() - 0.5) * 0.5,
          barTop,
          bar.position.z + (Math.random() - 0.5) * 0.5
        );

        const velocity = new THREE.Vector3(
          (Math.random() - 0.5) * 4, // outward spread X
          Math.random() * 5 + 3,      // upward
          (Math.random() - 0.5) * 4   // outward spread Z
        );

        scene.add(particleMesh);
        particles.push({
          mesh: particleMesh,
          velocity,
          lifetime: 1.5,
          age: 0,
        });
      }
    };

    const updateParticles = (delta: number) => {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.age += delta;

        if (p.age >= p.lifetime) {
          // Remove expired particle
          scene.remove(p.mesh);
          p.mesh.geometry.dispose();
          (p.mesh.material as THREE.Material).dispose();
          particles.splice(i, 1);
          continue;
        }

        // Apply velocity
        p.mesh.position.addScaledVector(p.velocity, delta);

        // Gravity: reduce y velocity
        p.velocity.y -= 9.8 * delta;

        // Fade opacity based on age
        const mat = p.mesh.material as THREE.MeshStandardMaterial;
        mat.opacity = 1 - p.age / p.lifetime;
      }
    };

    // SELECTION HELPERS
    const applySelection = (mesh: THREE.Mesh) => {
      selectedMesh = mesh;
      // Scale selected bar up by 10%
      mesh.userData.targetScaleY = mesh.userData.baseTargetScaleY * 1.1;
      // Dim all other bars
      meshes.forEach(m => {
        if (m !== mesh) {
          const mat = m.material as THREE.MeshStandardMaterial;
          mat.color.copy(m.userData.originalColor).multiplyScalar(0.5);
        }
      });
    };

    const clearSelection = () => {
      if (selectedMesh) {
        selectedMesh.userData.targetScaleY = selectedMesh.userData.baseTargetScaleY;
      }
      selectedMesh = null;
      // Restore all bar colors
      meshes.forEach(m => {
        const mat = m.material as THREE.MeshStandardMaterial;
        mat.color.copy(m.userData.originalColor);
      });
    };

    // CLICK HANDLER
    const onClick = (event: MouseEvent) => {
      if (!mountRef.current) return;
      const rect = mountRef.current.getBoundingClientRect();

      const clickMouse = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );

      raycaster.setFromCamera(clickMouse, camera);
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const clickedBar = intersects[0].object as THREE.Mesh;

        if (selectedMesh === clickedBar) {
          // Deselect
          clearSelection();
          onCategorySelect?.(null);
        } else {
          clearSelection();
          applySelection(clickedBar);
          onCategorySelect?.(clickedBar.userData.name);
        }

        // Spawn burst particles
        spawnParticles(clickedBar);
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!mountRef.current) return;
      const rect = mountRef.current.getBoundingClientRect();
      
      // Convert to Normalized Device Coordinates (-1 to +1)
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const object = intersects[0].object as THREE.Mesh;
        
        if (hoveredMesh !== object) {
          // Reset previous hover (only if it's not the selected bar with dimming)
          if (hoveredMesh && hoveredMesh !== selectedMesh) {
            (hoveredMesh.material as THREE.MeshStandardMaterial).color.copy(hoveredMesh.userData.originalColor);
            // Re-dim if there's a selection and this isn't the selected bar
            if (selectedMesh) {
              (hoveredMesh.material as THREE.MeshStandardMaterial).color.multiplyScalar(0.5);
            }
          }
          // Highlight new
          hoveredMesh = object;
          const material = hoveredMesh.material as THREE.MeshStandardMaterial;
          material.color.setHex(0xffffff).lerp(hoveredMesh.userData.originalColor, 0.5); // Lighten color
          
          document.body.style.cursor = 'pointer';
        }

        // Show tooltip
        setTooltip({
          visible: true,
          x: event.clientX,
          y: event.clientY,
          text: `${object.userData.name}: ₹${object.userData.avg.toLocaleString()}`
        });

      } else {
        if (hoveredMesh) {
          if (selectedMesh && hoveredMesh !== selectedMesh) {
            // Restore to dimmed state
            (hoveredMesh.material as THREE.MeshStandardMaterial).color.copy(hoveredMesh.userData.originalColor).multiplyScalar(0.5);
          } else if (!selectedMesh) {
            (hoveredMesh.material as THREE.MeshStandardMaterial).color.copy(hoveredMesh.userData.originalColor);
          } else {
            // It was the selected bar, restore original
            (hoveredMesh.material as THREE.MeshStandardMaterial).color.copy(hoveredMesh.userData.originalColor);
          }
          hoveredMesh = null;
          document.body.style.cursor = 'default';
        }
        setTooltip(prev => ({ ...prev, visible: false }));
      }
    };

    const onMouseLeave = () => {
      if (hoveredMesh) {
        if (selectedMesh && hoveredMesh !== selectedMesh) {
          (hoveredMesh.material as THREE.MeshStandardMaterial).color.copy(hoveredMesh.userData.originalColor).multiplyScalar(0.5);
        } else {
          (hoveredMesh.material as THREE.MeshStandardMaterial).color.copy(hoveredMesh.userData.originalColor);
        }
        hoveredMesh = null;
        document.body.style.cursor = 'default';
      }
      setTooltip(prev => ({ ...prev, visible: false }));
    };

    mountRef.current.addEventListener('click', onClick);
    mountRef.current.addEventListener('mousemove', onMouseMove);
    mountRef.current.addEventListener('mouseleave', onMouseLeave);

    // RESIZE
    const onWindowResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener("resize", onWindowResize);

    // ANIMATION LOOP
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      
      // Animate bars growing
      meshes.forEach(mesh => {
        const target = mesh.userData.targetScaleY;
        if (Math.abs(mesh.scale.y - target) > 0.001) {
          mesh.scale.y += (target - mesh.scale.y) * 5 * delta;
          mesh.position.y = mesh.scale.y / 2; // Keep base anchored to floor
        }
      });

      // Update particles
      updateParticles(delta);

      // Update OrbitControls
      controls.update();

      renderer.render(scene, camera);
    };
    animate();

    // CLEANUP
    const currentMount = mountRef.current;
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", onWindowResize);
      if (currentMount) {
        currentMount.removeEventListener('click', onClick);
        currentMount.removeEventListener('mousemove', onMouseMove);
        currentMount.removeEventListener('mouseleave', onMouseLeave);
        currentMount.removeChild(renderer.domElement);
      }
      
      // Dispose particles
      particles.forEach(p => {
        scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        (p.mesh.material as THREE.Material).dispose();
      });
      particles.length = 0;
      particleGeometry.dispose();

      // Dispose Geometries and Materials
      floorGeometry.dispose();
      floorMaterial.dispose();
      meshes.forEach(mesh => {
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      });
      
      controls.dispose();
      renderer.dispose();
    };
  }, [data, onCategorySelect]);

  return (
    <div className="relative w-full h-[400px] rounded-xl overflow-hidden bg-card border shadow-sm">
      <div ref={mountRef} className="w-full h-full" />
      
      {/* HTML Tooltip overlay */}
      {tooltip.visible && (
        <div 
          className="fixed z-50 pointer-events-none bg-popover text-popover-foreground px-3 py-2 rounded-md shadow-md border border-border text-sm font-semibold transform -translate-x-1/2 -translate-y-full"
          style={{ 
            left: tooltip.x, 
            top: tooltip.y - 15,
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
};
