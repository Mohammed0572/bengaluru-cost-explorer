import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

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

type SelectedInfo = {
  name: string;
  avg: number;
  share: number;
};

const COLORS = [0xf59e0b, 0x10b981, 0x3b82f6, 0x8b5cf6, 0xec4899, 0x14b8a6];

const formatCurrency = (value: number) => `₹${value.toLocaleString("en-IN")}`;

export const ThreeVisualizer = ({ data, onCategorySelect }: ThreeVisualizerProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedInfo, setSelectedInfo] = useState<SelectedInfo | null>(null);
  const [tooltip, setTooltip] = useState<{ visible: boolean; x: number; y: number; text: string }>({
    visible: false,
    x: 0,
    y: 0,
    text: "",
  });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || data.length === 0) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x020617, 28, 58);

    const camera = new THREE.PerspectiveCamera(
      45,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    const cameraTarget = new THREE.Vector3(8, 3, 0);
    camera.position.set(8, 13, 24);
    camera.lookAt(cameraTarget);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controls.maxPolarAngle = Math.PI / 2.1;
    controls.minDistance = 14;
    controls.maxDistance = 38;
    controls.target.copy(cameraTarget);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
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

    const rimLight = new THREE.PointLight(0x38bdf8, 1.6, 40);
    rimLight.position.set(-10, 8, -10);
    scene.add(rimLight);

    const floorGeometry = new THREE.PlaneGeometry(50, 50);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.9,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const grid = new THREE.GridHelper(44, 22, 0x334155, 0x1e293b);
    grid.position.y = 0.015;
    scene.add(grid);

    const barsGroup = new THREE.Group();
    scene.add(barsGroup);

    const maxAvg = Math.max(...data.map((item) => item.avg), 1);
    const totalAvg = data.reduce((sum, item) => sum + item.avg, 0);
    const maxHeight = 10;
    const barWidth = 1.5;
    const gap = 0.5;
    const totalWidth = data.length * barWidth + (data.length - 1) * gap;
    const startX = -totalWidth / 2 + barWidth / 2;
    const meshes: THREE.Mesh[] = [];
    const labelSprites: THREE.Sprite[] = [];

    const createTextSprite = (
      text: string,
      options: { color?: string; fontSize?: number; width?: number } = {}
    ) => {
      const canvas = document.createElement("canvas");
      const width = options.width ?? 420;
      const height = 120;
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");
      if (!context) return null;

      context.clearRect(0, 0, width, height);
      context.font = `600 ${options.fontSize ?? 34}px Inter, ui-sans-serif, system-ui`;
      context.fillStyle = options.color ?? "#e2e8f0";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(text, width / 2, height / 2, width - 24);

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(width / 115, height / 115, 1);
      labelSprites.push(sprite);
      return sprite;
    };

    data.forEach((item, index) => {
      const height = Math.max((item.avg / maxAvg) * maxHeight, 0.1);
      const color = COLORS[index % COLORS.length];
      const geometry = new RoundedBoxGeometry(barWidth, 1, barWidth, 4, 0.12);
      const material = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.3,
        metalness: 0.55,
        emissive: color,
        emissiveIntensity: 0.08,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(startX + index * (barWidth + gap), 0.5, 0);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = {
        name: item.name,
        avg: item.avg,
        share: totalAvg > 0 ? Math.round((item.avg / totalAvg) * 100) : 0,
        targetScaleY: height,
        baseTargetScaleY: height,
        originalColor: new THREE.Color(color),
      };

      barsGroup.add(mesh);
      meshes.push(mesh);

      const categoryLabel = createTextSprite(item.name, { fontSize: 30, color: "#cbd5e1", width: 360 });
      if (categoryLabel) {
        categoryLabel.position.set(mesh.position.x, 0.08, 2.2);
        barsGroup.add(categoryLabel);
      }

      const valueLabel = createTextSprite(formatCurrency(item.avg), { fontSize: 34, color: "#f8fafc", width: 360 });
      if (valueLabel) {
        valueLabel.position.set(mesh.position.x, height + 0.8, 0);
        valueLabel.userData = { bar: mesh, offset: 0.8 };
        barsGroup.add(valueLabel);
      }
    });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredMesh: THREE.Mesh | null = null;
    let selectedMesh: THREE.Mesh | null = null;

    const particles: Particle[] = [];
    const particleGeometry = new THREE.IcosahedronGeometry(0.12, 0);

    const spawnParticles = (bar: THREE.Mesh) => {
      const barColor = bar.userData.originalColor as THREE.Color;
      const barTop = bar.position.y + bar.scale.y / 2;
      const count = 8;

      for (let i = 0; i < count; i++) {
        const particleColor = barColor.clone().lerp(new THREE.Color(0xffffff), 0.35);
        const material = new THREE.MeshStandardMaterial({
          color: particleColor,
          transparent: true,
          opacity: 0.9,
        });
        const particleMesh = new THREE.Mesh(particleGeometry, material);
        particleMesh.position.set(
          bar.position.x + (Math.random() - 0.5) * 0.45,
          barTop,
          bar.position.z + (Math.random() - 0.5) * 0.45
        );

        scene.add(particleMesh);
        particles.push({
          mesh: particleMesh,
          velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 2.2,
            Math.random() * 3 + 2,
            (Math.random() - 0.5) * 2.2
          ),
          lifetime: 1.1,
          age: 0,
        });
      }
    };

    const updateParticles = (delta: number) => {
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.age += delta;

        if (particle.age >= particle.lifetime) {
          scene.remove(particle.mesh);
          (particle.mesh.material as THREE.Material).dispose();
          particles.splice(i, 1);
          continue;
        }

        particle.mesh.position.addScaledVector(particle.velocity, delta);
        particle.velocity.y -= 6.5 * delta;
        const material = particle.mesh.material as THREE.MeshStandardMaterial;
        material.opacity = 1 - particle.age / particle.lifetime;
      }
    };

    const restoreMeshColor = (mesh: THREE.Mesh) => {
      const material = mesh.material as THREE.MeshStandardMaterial;
      material.color.copy(mesh.userData.originalColor);
      material.emissiveIntensity = 0.08;
      if (selectedMesh && mesh !== selectedMesh) {
        material.color.multiplyScalar(0.5);
        material.emissiveIntensity = 0.02;
      }
    };

    const applySelection = (mesh: THREE.Mesh) => {
      selectedMesh = mesh;
      mesh.userData.targetScaleY = mesh.userData.baseTargetScaleY * 1.1;
      setSelectedInfo({
        name: mesh.userData.name,
        avg: mesh.userData.avg,
        share: mesh.userData.share,
      });

      meshes.forEach((candidate) => {
        const material = candidate.material as THREE.MeshStandardMaterial;
        material.color.copy(candidate.userData.originalColor);
        material.emissiveIntensity = candidate === mesh ? 0.18 : 0.02;
        if (candidate !== mesh) {
          material.color.multiplyScalar(0.5);
        }
      });
    };

    const clearSelection = () => {
      if (selectedMesh) {
        selectedMesh.userData.targetScaleY = selectedMesh.userData.baseTargetScaleY;
      }
      selectedMesh = null;
      setSelectedInfo(null);
      meshes.forEach((mesh) => restoreMeshColor(mesh));
    };

    const pickMesh = (event: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      return raycaster.intersectObjects(meshes)[0]?.object as THREE.Mesh | undefined;
    };

    const onClick = (event: MouseEvent) => {
      const clickedBar = pickMesh(event);
      if (!clickedBar) return;

      if (selectedMesh === clickedBar) {
        clearSelection();
        onCategorySelect?.(null);
      } else {
        clearSelection();
        applySelection(clickedBar);
        onCategorySelect?.(clickedBar.userData.name);
      }

      spawnParticles(clickedBar);
    };

    const onMouseMove = (event: MouseEvent) => {
      const object = pickMesh(event);

      if (object) {
        if (hoveredMesh !== object) {
          if (hoveredMesh) restoreMeshColor(hoveredMesh);
          hoveredMesh = object;
          const material = hoveredMesh.material as THREE.MeshStandardMaterial;
          material.color.setHex(0xffffff).lerp(hoveredMesh.userData.originalColor, 0.45);
          material.emissiveIntensity = 0.2;
          document.body.style.cursor = "pointer";
        }

        setTooltip({
          visible: true,
          x: event.clientX,
          y: event.clientY,
          text: `${object.userData.name}: ${formatCurrency(object.userData.avg)}`,
        });
      } else {
        if (hoveredMesh) {
          restoreMeshColor(hoveredMesh);
          hoveredMesh = null;
          document.body.style.cursor = "default";
        }
        setTooltip((prev) => ({ ...prev, visible: false }));
      }
    };

    const onMouseLeave = () => {
      if (hoveredMesh) {
        restoreMeshColor(hoveredMesh);
        hoveredMesh = null;
      }
      document.body.style.cursor = "default";
      setTooltip((prev) => ({ ...prev, visible: false }));
    };

    mount.addEventListener("click", onClick);
    mount.addEventListener("mousemove", onMouseMove);
    mount.addEventListener("mouseleave", onMouseLeave);

    const onWindowResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener("resize", onWindowResize);

    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      meshes.forEach((mesh) => {
        const target = mesh.userData.targetScaleY;
        if (Math.abs(mesh.scale.y - target) > 0.001) {
          mesh.scale.y += (target - mesh.scale.y) * 5 * delta;
          mesh.position.y = mesh.scale.y / 2;
        }
      });

      labelSprites.forEach((sprite) => {
        const linkedBar = sprite.userData.bar as THREE.Mesh | undefined;
        if (linkedBar) {
          sprite.position.y = linkedBar.scale.y + (sprite.userData.offset ?? 0.8);
        }
      });

      updateParticles(delta);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.body.style.cursor = "default";
      window.removeEventListener("resize", onWindowResize);
      mount.removeEventListener("click", onClick);
      mount.removeEventListener("mousemove", onMouseMove);
      mount.removeEventListener("mouseleave", onMouseLeave);
      mount.removeChild(renderer.domElement);

      particles.forEach((particle) => {
        scene.remove(particle.mesh);
        (particle.mesh.material as THREE.Material).dispose();
      });
      particleGeometry.dispose();
      floorGeometry.dispose();
      floorMaterial.dispose();
      meshes.forEach((mesh) => {
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      });
      labelSprites.forEach((sprite) => {
        const material = sprite.material as THREE.SpriteMaterial;
        material.map?.dispose();
        material.dispose();
      });
      controls.dispose();
      renderer.dispose();
    };
  }, [data, onCategorySelect]);

  return (
    <div className="relative w-full h-full min-h-[400px] overflow-hidden rounded-lg bg-background/30">
      <div ref={mountRef} className="h-full w-full" />

      <div className="absolute left-4 top-4 rounded-md border border-border/60 bg-background/85 px-3 py-2 text-xs text-muted-foreground backdrop-blur">
        Drag to rotate · Click a bar to filter
      </div>

      {selectedInfo && (
        <div className="absolute right-4 top-4 min-w-40 rounded-md border border-border/60 bg-background/90 p-3 shadow-lg backdrop-blur">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Selected</p>
          <p className="mt-1 font-semibold text-foreground">{selectedInfo.name}</p>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Average</p>
              <p className="font-semibold">{formatCurrency(selectedInfo.avg)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Share</p>
              <p className="font-semibold">{selectedInfo.share}%</p>
            </div>
          </div>
        </div>
      )}

      {tooltip.visible && (
        <div
          className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full rounded-md border border-border bg-popover px-3 py-2 text-sm font-semibold text-popover-foreground shadow-md"
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
