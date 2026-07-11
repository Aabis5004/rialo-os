"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useMemo } from "react";
import type { GraphNode, GraphLink } from "@/lib/graph";
import { planetStyle } from "@/lib/planet-style";

const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), { ssr: false });

type Anim = { mesh: any; speed: number; kind: string; phase: number };

export function Graph({ nodes, links }: { nodes: GraphNode[]; links: GraphLink[] }) {
  const fgRef = useRef<any>(null);
  const animsRef = useRef<Anim[]>([]);
  const [selected, setSelected] = useState<GraphNode | null>(null);
  const [hovered, setHovered] = useState<GraphNode | null>(null);
  const [lib, setLib] = useState<any>(null);

  const data = useMemo(
    () => ({ nodes: structuredClone(nodes), links: structuredClone(links) }),
    [nodes, links]
  );

  useEffect(() => {
    Promise.all([import("three"), import("three-spritetext")]).then(
      ([three, sprite]) => setLib({ THREE: three, SpriteText: sprite.default })
    );
  }, []);

  useEffect(() => {
    if (!lib || !fgRef.current) return;
    const { THREE } = lib;
    const fg = fgRef.current;

    fg.d3Force("charge")?.strength(-300);
    fg.d3Force("link")?.distance((l: any) => (l.kind === "BACKS" ? 150 : 58));

    const scene = fg.scene();

    const geo = new THREE.BufferGeometry();
    const N = 3000;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const r = 800 + Math.random() * 1800;
      const t = Math.acos(2 * Math.random() - 1);
      const p = Math.random() * Math.PI * 2;
      pos[i * 3] = r * Math.sin(t) * Math.cos(p);
      pos[i * 3 + 1] = r * Math.sin(t) * Math.sin(p);
      pos[i * 3 + 2] = r * Math.cos(t);
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const stars = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        color: "#ddd4c0",
        size: 2,
        transparent: true,
        opacity: 0.45,
        sizeAttenuation: true,
      })
    );
    scene.add(stars);

    const controls = fg.controls();
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.3;
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
    }

    let raf = 0;
    const t0 = performance.now();
    const tick = () => {
      const t = (performance.now() - t0) / 1000;
      for (const a of animsRef.current) {
        if (a.kind === "glow") {
          const s = 1 + Math.sin(t * 0.8 + a.phase) * 0.1;
          a.mesh.scale.setScalar(s);
        } else if (a.kind === "spin") {
          a.mesh.rotation.y = t * a.speed;
        } else if (a.kind === "ring") {
          a.mesh.rotation.z = t * a.speed;
        } else if (a.kind === "orbit") {
          const r = a.mesh.userData.r;
          a.mesh.position.set(
            Math.cos(t * a.speed + a.phase) * r,
            Math.sin(t * a.speed * 0.6 + a.phase) * r * 0.3,
            Math.sin(t * a.speed + a.phase) * r
          );
        }
      }
      stars.rotation.y = t * 0.005;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const fit = setTimeout(() => fg.zoomToFit(1000, 60), 2200);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fit);
      scene.remove(stars);
      animsRef.current = [];
    };
  }, [lib]);

  const focus = (n: any) => {
    const fg = fgRef.current;
    if (!fg) return;
    const d = 130;
    const r = 1 + d / Math.hypot(n.x || 1, n.y || 1, n.z || 1);
    fg.cameraPosition(
      { x: (n.x || 0) * r, y: (n.y || 0) * r, z: (n.z || 0) * r },
      n,
      1400
    );
    setSelected(n);
  };

  if (!lib) {
    return (
      <div className="flex h-[720px] items-center justify-center rounded-2xl border border-neutral-900 bg-[#07070a] text-sm text-neutral-700">
        Charting the galaxy…
      </div>
    );
  }

  const { THREE, SpriteText } = lib;
  const panel = selected ?? hovered;
  const style = panel ? planetStyle(panel) : null;

  return (
    <div className="relative h-[720px] overflow-hidden rounded-2xl border border-neutral-900 bg-[#07070a]">
      <ForceGraph3D
        ref={fgRef}
        graphData={data}
        backgroundColor="#07070a"
        showNavInfo={false}
        enableNodeDrag={false}
        controlType="orbit"
        nodeThreeObject={(n: any) => {
          const s = planetStyle(n);
          const group = new THREE.Group();

          const mat = new THREE.MeshBasicMaterial({
            color: s.color,
            transparent: true,
            opacity: n.type === "BACKER" ? 0.55 : 1,
          });
          if (s.texture) {
            mat.map = new THREE.TextureLoader().load(s.texture);
            mat.color.set("#ffffff");
          }
          const body = new THREE.Mesh(
            new THREE.SphereGeometry(s.radius, 28, 28),
            mat
          );
          group.add(body);
          if (n.type !== "BACKER") {
            animsRef.current.push({
              mesh: body,
              speed: 0.12,
              kind: "spin",
              phase: 0,
            });
          }

          if (s.glow > 0) {
            const glow = new THREE.Mesh(
              new THREE.SphereGeometry(s.radius * 2, 20, 20),
              new THREE.MeshBasicMaterial({
                color: s.accent,
                transparent: true,
                opacity: s.glow,
                side: THREE.BackSide,
              })
            );
            group.add(glow);
            animsRef.current.push({
              mesh: glow,
              speed: 1,
              kind: "glow",
              phase: Math.random() * 6,
            });
          }

          if (s.ring) {
            const ring = new THREE.Mesh(
              new THREE.RingGeometry(s.radius * 1.5, s.radius * 2.1, 48),
              new THREE.MeshBasicMaterial({
                color: s.accent,
                transparent: true,
                opacity: 0.35,
                side: THREE.DoubleSide,
              })
            );
            ring.rotation.x = Math.PI / 2.6;
            group.add(ring);
            animsRef.current.push({
              mesh: ring,
              speed: 0.25,
              kind: "ring",
              phase: 0,
            });
          }

          for (let i = 0; i < s.satellites; i++) {
            const sat = new THREE.Mesh(
              new THREE.SphereGeometry(s.radius * 0.16, 10, 10),
              new THREE.MeshBasicMaterial({ color: s.accent })
            );
            sat.userData.r = s.radius * (2.2 + i * 0.7);
            group.add(sat);
            animsRef.current.push({
              mesh: sat,
              speed: 0.7 + i * 0.3,
              kind: "orbit",
              phase: (i * Math.PI * 2) / Math.max(s.satellites, 1),
            });
          }

          if (s.particles > 0) {
            const pg = new THREE.BufferGeometry();
            const pp = new Float32Array(s.particles * 3);
            for (let i = 0; i < s.particles; i++) {
              const a = Math.random() * Math.PI * 2;
              const rr = s.radius * (1.6 + Math.random() * 0.9);
              pp[i * 3] = Math.cos(a) * rr;
              pp[i * 3 + 1] = (Math.random() - 0.5) * s.radius;
              pp[i * 3 + 2] = Math.sin(a) * rr;
            }
            pg.setAttribute("position", new THREE.BufferAttribute(pp, 3));
            const cloud = new THREE.Points(
              pg,
              new THREE.PointsMaterial({
                color: s.accent,
                size: 1.4,
                transparent: true,
                opacity: 0.7,
              })
            );
            group.add(cloud);
            animsRef.current.push({
              mesh: cloud,
              speed: 0.4,
              kind: "spin",
              phase: 0,
            });
          }

          if (s.labelSize > 0) {
            const text = new SpriteText(n.label);
            text.color = s.labelColor;
            text.textHeight = s.labelSize;
            text.position.y = s.radius * 2.4 + 6;
            group.add(text);
          }

          return group;
        }}
        linkColor={(l: any) => (l.kind === "USES" ? "#e8a33d" : "#1e1b18")}
        linkOpacity={0.4}
        linkWidth={(l: any) => (l.kind === "USES" ? 0.7 : 0.2)}
        linkDirectionalParticles={(l: any) => (l.kind === "USES" ? 3 : 0)}
        linkDirectionalParticleWidth={1.6}
        linkDirectionalParticleSpeed={0.005}
        linkDirectionalParticleColor={() => "#ffd89b"}
        onNodeHover={(n: any) => setHovered(n ?? null)}
        onNodeClick={focus}
        onBackgroundClick={() => setSelected(null)}
      />

      {panel && style && (
        <aside className="pointer-events-none absolute right-8 top-8 w-80 rounded-2xl border border-neutral-800 bg-black/80 p-7 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: style.color }}
            />
            <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-600">
              {panel.category ?? panel.type.toLowerCase()}
            </p>
          </div>

          <h3 className="mt-3 text-2xl font-medium tracking-tight text-[#f2ede1]">
            {panel.label}
          </h3>

          {panel.tagline && (
            <p className="mt-4 text-sm leading-relaxed text-neutral-400">
              {panel.tagline}
            </p>
          )}

          {panel.replaces && (
            <div className="mt-6 border-t border-neutral-800 pt-5">
              <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-600">
                Replaces
              </p>
              <p className="mt-2 text-sm" style={{ color: style.accent }}>
                {panel.replaces}
              </p>
            </div>
          )}
        </aside>
      )}

      <p className="pointer-events-none absolute bottom-6 left-8 text-[11px] tracking-wide text-neutral-700">
        Drag to rotate · scroll to zoom · click a planet to fly there
      </p>
    </div>
  );
}
