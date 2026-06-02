"use client";

import React, { useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial } from "@react-three/drei";
import { motion } from "framer-motion";
import gsap from "gsap";
import Lenis from "@studio-freight/lenis";
import ThreeScene from "./canvas";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const chaosItems = [
    "Facturas",
    "Impuestos",
    "Nóminas",
    "Bancos",
    "Emails",
    "Contratos",
    "Gastos",
    "Tareas",
];

const services = ["Fiscalidad", "Laboral", "Finanzas", "Tecnología"];

function seededRandom(index, salt) {
    const x = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
    return x - Math.floor(x);
}

function Particle({ radius, angle, y, speed, scale }) {
    const ref = useRef(null);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime() * speed + angle;
        if (!ref.current) return;

        ref.current.position.x = Math.cos(t) * radius;
        ref.current.position.z = Math.sin(t) * radius;
        ref.current.position.y = y + Math.sin(t * 1.8) * 0.25;
    });

    return (
        <mesh ref={ref} scale={scale}>
            <sphereGeometry args={[1, 18, 18]} />
            <meshBasicMaterial color="#59b7ff" transparent opacity={0.75} />
        </mesh>
    );
}

function OrbitalCore() {
    const group = useRef(null);

    const particles = useMemo(() => {
        return Array.from({ length: 44 }, (_, i) => ({
            id: i,
            radius: 1.5 + seededRandom(i, 1) * 2.4,
            angle: seededRandom(i, 2) * Math.PI * 2,
            y: (seededRandom(i, 3) - 0.5) * 2.2,
            speed: 0.15 + seededRandom(i, 4) * 0.28,
            scale: 0.035 + seededRandom(i, 5) * 0.08,
        }));
    }, []);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();

        if (group.current) {
            group.current.rotation.y = t * 0.09;
            group.current.rotation.x = Math.sin(t * 0.22) * 0.12;
        }
    });

    return (
        <group ref={group}>
            <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.6}>
                <mesh>
                    <icosahedronGeometry args={[0.92, 5]} />
                    <MeshTransmissionMaterial
                        thickness={0.5}
                        roughness={0.16}
                        transmission={0.92}
                        chromaticAberration={0.08}
                        distortion={0.16}
                        distortionScale={0.12}
                        temporalDistortion={0.08}
                        color="#d7ffe5"
                    />
                </mesh>
            </Float>

            {particles.map((p) => (
                <Particle key={p.id} {...p} />
            ))}
        </group>
    );
}

function HeroScene() {
    return (
        <Canvas camera={{ position: [0, 0, 6], fov: 42 }} dpr={[1, 1.5]}>
            <color attach="background" args={["#050706"]} />
            <ambientLight intensity={0.9} />
            <pointLight position={[3, 4, 4]} intensity={18} color="#7dc7ff" />
            <pointLight position={[-4, -3, 2]} intensity={8} color="#ffffff" />
            <OrbitalCore />
        </Canvas>
    );
}

export default function Home() {
    useEffect(() => {
        const lenis = new Lenis({
            smoothWheel: true,
            wheelMultiplier: 0.9,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        gsap.from(".hero-title", {
            opacity: 0,
            y: 90,
            duration: 1.3,
            ease: "power4.out",
        });

        gsap.from(".hero-sub", {
            opacity: 0,
            y: 40,
            delay: 0.25,
            duration: 1,
            ease: "power4.out",
        });

        gsap.from(".hero-button", {
            opacity: 0,
            y: 30,
            delay: 0.45,
            duration: 0.9,
            ease: "power4.out",
        });

        return () => {
            lenis.destroy();
        };
    }, []);

    return (
        <main className="bg-black text-white overflow-hidden">
            <header className="fixed left-0 top-0 z-50 w-full px-5 py-4">
                <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-black/30 px-5 py-3 backdrop-blur-xl">
                    <img
                        src="/logo.jpeg"
                        alt="Simplifico"
                        className="h-10 w-auto object-contain"
                    />

                    <div className="hidden gap-7 text-sm text-white/70 md:flex">
                        <a href="#servicios" className="hover:text-white">
                            Servicios
                        </a>
                        <a href="#control" className="hover:text-white">
                            Control
                        </a>
                        <a href="#contacto" className="hover:text-white">
                            Contacto
                        </a>
                    </div>

                    <a
                        href="#contacto"
                        className="rounded-full bg-sky-400 px-4 py-2 text-sm font-medium text-black"
                    >
                        Empezar
                    </a>
                </nav>
            </header>

            <section className="relative min-h-screen overflow-hidden bg-black">
                <ThreeScene />
            </section>

            <section className="relative min-h-screen overflow-hidden">
                <div className="absolute inset-0 opacity-70">
                    <HeroScene />
                </div>

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_35%,rgba(132,255,176,0.20),transparent_35%),linear-gradient(to_bottom,transparent,rgba(0,0,0,0.92))]" />

                <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pt-28">
                    <p className="mb-5 inline-flex w-fit rounded-full border border-sky-400/25 bg-sky-400/10 px-4 py-2 text-sm text-lime-100 backdrop-blur-xl">
                        El sistema operativo para negocios modernos
                    </p>

                    <h1 className="hero-title max-w-5xl text-6xl font-semibold leading-none tracking-[-0.07em] md:text-8xl lg:text-9xl">
                        La forma inteligente de gestionar un negocio.
                    </h1>

                    <p className="hero-sub mt-8 max-w-2xl text-xl leading-8 text-white/65 md:text-2xl">
                        Menos tareas. Menos ruido. Más control. Simplifico convierte
                        procesos complejos en flujos claros, conectados y automatizados.
                    </p>

                    <div className="hero-button mt-10 flex flex-col gap-4 sm:flex-row">
                        <a
                            href="#contacto"
                            className="rounded-full bg-white px-7 py-4 text-center font-medium text-black transition hover:scale-105"
                        >
                            Hablar con Simplifico
                        </a>

                        <a
                            href="#servicios"
                            className="rounded-full border border-white/15 bg-white/5 px-7 py-4 text-center font-medium text-white backdrop-blur-xl transition hover:bg-white/10"
                        >
                            Ver cómo funciona
                        </a>
                    </div>
                </div>
            </section>

            

            <section className="relative bg-[#050706] px-6 py-28 overflow-hidden">
                <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
                    <div>
                        <p className="mb-5 text-sm uppercase tracking-[0.35em] text-sky-300">
                            El problema
                        </p>

                        <h2 className="text-5xl font-semibold leading-[0.95] tracking-[-0.065em] md:text-7xl lg:text-8xl">
                            Gestionar un negocio no debería sentirse así.
                        </h2>

                        <p className="mt-8 max-w-xl text-lg leading-8 text-white/60">
                            Facturas, impuestos, nóminas, bancos, herramientas separadas y tareas
                            manuales consumiendo tiempo constantemente.
                        </p>

                        <a
                            href="#servicios"
                            className="mt-12 inline-flex items-center gap-4 border-b border-sky-400 pb-3 text-lg text-white transition hover:gap-7"
                        >
                            Conoce la solución
                            <span className="text-3xl text-sky-400">→</span>
                        </a>
                    </div>

                    <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-black/40 p-5 shadow-2xl shadow-sky-400/5 backdrop-blur-xl lg:h-[720px] lg:p-0">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(132,255,176,0.10),transparent_35%)]" />

                        {/* Desktop orbital */}
                        <div className="relative hidden h-full lg:block">
                            <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/20" />
                            <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/15" />
                            <div className="absolute left-1/2 top-1/2 h-[210px] w-[210px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/15" />

                            {[
                                { name: "Facturas", icon: "▤", top: "7%", left: "43%" },
                                { name: "Contratos", icon: "▤", top: "22%", left: "76%" },
                                { name: "Nóminas", icon: "♙", top: "49%", left: "80%" },
                                { name: "Emails", icon: "✉", top: "76%", left: "72%" },
                                { name: "Tareas", icon: "✓", top: "82%", left: "44%" },
                                { name: "Gastos", icon: "$", top: "63%", left: "10%" },
                                { name: "Bancos", icon: "▥", top: "26%", left: "14%" },
                            ].map((item, index) => (
                                <motion.div
                                    key={item.name}
                                    initial={{ opacity: 0, y: 25, scale: 0.9 }}
                                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.08, duration: 0.6 }}
                                    whileHover={{ y: -8, scale: 1.04 }}
                                    className="absolute z-10 flex h-[150px] w-[145px] flex-col items-center justify-center rounded-[1.7rem] border border-white/15 bg-black/55 text-center shadow-2xl shadow-black/40 backdrop-blur-xl"
                                    style={{
                                        top: item.top,
                                        left: item.left,
                                    }}
                                >
                                    <span className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-400">
                                        Pendiente
                                    </span>

                                    <div className="mt-5 flex h-12 w-12 items-center justify-center rounded-full border border-sky-400/25 bg-sky-400/10 text-2xl text-sky-400 shadow-lg shadow-sky-400/10">
                                        {item.icon}
                                    </div>

                                    <strong className="mt-4 text-xl text-white">{item.name}</strong>
                                </motion.div>
                            ))}

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                                className="absolute left-1/2 top-1/2 z-20 flex h-[165px] w-[165px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-[1.7rem] border border-sky-400/20 bg-black/70 text-center shadow-2xl shadow-sky-400/10 backdrop-blur-xl"
                            >
                                <span className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-400">
                                    Pendiente
                                </span>

                                <div className="mt-5 flex h-14 w-14 items-center justify-center rounded-full border border-sky-400/30 bg-sky-400/10 text-4xl text-sky-400">
                                    %
                                </div>

                                <strong className="mt-4 text-xl text-white">Impuestos</strong>
                            </motion.div>
                        </div>

                        {/* Tablet / mobile grid */}
                        <div className="relative z-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:hidden">
                            {[
                                { name: "Facturas", icon: "▤" },
                                { name: "Impuestos", icon: "%" },
                                { name: "Contratos", icon: "▤" },
                                { name: "Nóminas", icon: "♙" },
                                { name: "Emails", icon: "✉" },
                                { name: "Tareas", icon: "✓" },
                                { name: "Gastos", icon: "$" },
                                { name: "Bancos", icon: "▥" },
                            ].map((item, index) => (
                                <motion.div
                                    key={item.name}
                                    initial={{ opacity: 0, y: 18 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05, duration: 0.45 }}
                                    className="flex min-h-[145px] flex-col items-center justify-center rounded-[1.5rem] border border-white/15 bg-black/55 p-4 text-center shadow-xl shadow-black/30 backdrop-blur-xl"
                                >
                                    <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-sky-400">
                                        Pendiente
                                    </span>

                                    <div className="mt-4 flex h-11 w-11 items-center justify-center rounded-full border border-sky-400/25 bg-sky-400/10 text-xl text-sky-400">
                                        {item.icon}
                                    </div>

                                    <strong className="mt-3 text-base text-white">{item.name}</strong>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            <section
                id="servicios"
                className="bg-[#eef3eb] px-6 py-32 text-black"
            >
                <div className="mx-auto max-w-7xl">
                    <p className="mb-5 text-sm uppercase tracking-[0.35em] text-black/45">
                        Ecosistema
                    </p>

                    <h2 className="max-w-4xl text-5xl font-semibold tracking-[-0.055em] md:text-7xl">
                        Todo conectado. Todo claro.
                    </h2>

                    <div className="mt-16 grid gap-5 md:grid-cols-4">
                        {services.map((service, index) => (
                            <motion.article
                                key={service}
                                whileHover={{ y: -12, scale: 1.02 }}
                                className="min-h-[360px] rounded-[2rem] border border-black/10 bg-white p-7 shadow-xl shadow-black/5"
                            >
                                <div className="mb-14 flex h-16 w-16 items-center justify-center rounded-3xl bg-black text-sky-300">
                                    0{index + 1}
                                </div>

                                <h3 className="text-3xl font-semibold tracking-[-0.04em]">
                                    {service}
                                </h3>

                                <p className="mt-5 leading-7 text-black/55">
                                    Automatización y control inteligente para operaciones
                                    modernas.
                                </p>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </section>

            <section
                id="control"
                className="bg-[#eef3eb] px-6 pb-32 text-black"
            >
                <div className="mx-auto grid max-w-7xl gap-12 rounded-[3rem] bg-black p-8 text-white md:grid-cols-2 md:p-12">
                    <div>
                        <p className="mb-5 text-sm uppercase tracking-[0.35em] text-sky-300/70">
                            Control
                        </p>

                        <h2 className="text-5xl font-semibold tracking-[-0.055em] md:text-7xl">
                            Una operación que se entiende de un vistazo.
                        </h2>

                        <p className="mt-8 max-w-xl text-lg leading-8 text-white/60">
                            Finanzas, fiscalidad, equipo y automatizaciones funcionando como
                            un solo sistema.
                        </p>
                    </div>

                    <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl">
                        {[
                            "Fiscalidad automatizada",
                            "Cashflow limpio",
                            "Nóminas bajo control",
                            "Procesos con IA",
                        ].map((row, i) => (
                            <div
                                key={row}
                                className="mb-4 rounded-3xl border border-white/10 bg-white/[0.06] p-5"
                            >
                                <div className="flex justify-between">
                                    <span>{row}</span>
                                    <span className="text-sky-300">{92 + i}%</span>
                                </div>

                                <div className="mt-4 h-2 rounded-full bg-white/10">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${78 + i * 5}%` }}
                                        transition={{ duration: 1 }}
                                        className="h-full rounded-full bg-sky-400"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="flex min-h-screen items-center bg-black px-6">
                <div className="mx-auto max-w-7xl">
                    <h2 className="text-6xl font-semibold leading-none tracking-[-0.07em] md:text-8xl lg:text-9xl">
                        No montaste un negocio para hacer papeleo.
                    </h2>
                </div>
            </section>

            <section
                id="contacto"
                className="relative overflow-hidden bg-black px-6 py-36 text-center"
            >
                <div className="absolute inset-0 bg-sky-400/10 blur-[160px]" />

                <div className="relative z-10 mx-auto max-w-5xl">
                    <h2 className="text-6xl font-semibold tracking-[-0.07em] md:text-8xl">
                        Simplifica lo complejo.
                    </h2>

                    <p className="mt-8 text-xl text-white/60">
                        Convierte operaciones complejas en una experiencia clara y moderna.
                    </p>

                    <a
                        href="mailto:hola@simplifico.es"
                        className="mt-10 inline-flex rounded-full bg-sky-400 px-8 py-4 font-medium text-black transition hover:scale-105"
                    >
                        Hablar con Simplifico
                    </a>
                </div>
            </section>
        </main>
    );
}
