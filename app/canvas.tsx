"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { Text } from "troika-three-text";

export default function ThreeScene() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );

    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.35, 32, 100),
      new THREE.MeshStandardMaterial({ color: 0xffaa00 })
    );

    scene.add(torus);

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
      torus.rotation.y += 0.01;
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
      torus.geometry.dispose();
      torus.material.dispose();
      renderer.dispose();

      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="three-container" />;
}
