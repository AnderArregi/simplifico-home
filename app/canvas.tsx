"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { Text } from "troika-three-text";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export default function ThreeScene() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  

 

  useEffect(() => {
    const loader = new GLTFLoader();
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    let loadedModel: THREE.Group | null = null;
    const modelMaterials: THREE.Material[] = [];

    const textureCanvas = document.createElement("canvas");
    textureCanvas.width = 256;
    textureCanvas.height = 256;

    const textureContext = textureCanvas.getContext("2d");
    if (textureContext) {
      textureContext.fillStyle = "#3fbbff";
      textureContext.fillRect(0, 0, 256, 256);
    }

    const modelTexture = new THREE.CanvasTexture(textureCanvas);
    modelTexture.colorSpace = THREE.SRGBColorSpace;
    modelTexture.wrapS = THREE.RepeatWrapping;
    modelTexture.wrapT = THREE.RepeatWrapping;
    modelTexture.repeat.set(1, 1);

    loader.load(
      "/simplifico-icon.glb",
      (gltf) => {
        const model = gltf.scene;

        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const previousMaterial = child.material;

            child.material = new THREE.MeshStandardMaterial({
              color: "#ffffff",
              map: modelTexture,
              roughness: 0.22,
              metalness: 0.5,
            });

            modelMaterials.push(child.material);

            if (Array.isArray(previousMaterial)) {
              previousMaterial.forEach((material) => material.dispose());
            } else {
              previousMaterial.dispose();
            }
          }
        });

        model.rotation.x = Math.PI / 2;
        model.updateMatrixWorld(true);

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const manualScale = 2;

        model.scale.setScalar(manualScale);
        model.position.set(
          -center.x * manualScale,
          -center.y * manualScale ,
          -center.z * manualScale
        );

        const pivot = new THREE.Group();
        pivot.add(model);
        scene.add(pivot);
        loadedModel = pivot;
      },
      undefined,
      (error) => {
        console.error("Error loading GLB model:", error);
      }
    );

    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);


    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(2, 2, 5);
    scene.add(light);

    const title = new Text();

    title.text = "Tu negocio de autónomo";
    title.fontSize = 0.35;
    title.color = 0xffffff;
    title.anchorX = "center";
    title.anchorY = "middle";
    title.position.set(0, 1.8, 0);

    scene.add(title);
    title.sync();

    gsap.from(title.position, {
      y: 3,
      duration: 1.2,
      ease: "power3.out",
    });

    let animationFrameId = 0;

    const animate = () => {
      if (loadedModel) {
        loadedModel.rotation.y += 0.005;
      }
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);

      title.dispose();
      modelTexture.dispose();
      modelMaterials.forEach((material) => material.dispose());
      renderer.dispose();

      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="three-container" />;
}
