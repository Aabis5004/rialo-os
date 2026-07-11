"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useMemo } from "react";
import type { GraphNode, GraphLink } from "@/lib/graph";
import { planetStyle } from "@/lib/planet-style";

const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), { ssr: false });

type Spin = { mesh: any; speed: number };

export function Graph({ nodes, links }: { nodes: GraphNode[]; links: GraphLink[] }) {
  const fgRef = useRef<any>(null);
  const spinsRef = useRef<Spin[]>([]);
  const [selected, setSelected] = useState<GraphNode | null>(null);
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

    fg.d3Force("charge")?.strength(-320);
    fg.d3Force("link")?.distance((l: any) => (l.kind === "BACKS" ? 150 : 60));

    const scene = fg.scene();

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.PointLight(0xfff0d8, 2.2, 0, 0);
    key.position.set(300, 400, 300);
    scene.add(key);
    const rim = new THREE.PointLight(0x6a7cff, 1.1, 0, 0);
    rim.position.set(-400, -200, -300);
    scene.add(rim);

    const sg = new THREE.BufferGeometry();
    const SN = 3500;
    const sp = new Float32Array(SN * 3);
    for (let i = 0; i < SN; i++) {
      const r = 700 + Math.random() * 2200;
      const t = Math.acos(2 * Math.random() - 1);
      const p = Math.random() * Math.PI * 2;
      sp[i * 3] = r * Math.sin(t) * Math.cos(p);
      sp[i * 3 + 1] = r * Math.sin(t) * Math.sin(p);
      sp[i * 3 + 2] = r * Math.cos(t);
    }
    sg.setAttribute("position", new THREE.BufferAttribute(sp, 3));
    const stars = new THREE.Points(
      sg,
      new THREE.PointsMaterial({ color: 0xd8cfbc, size: 1.8, transparent: true, opacity: 0.5 })
    );
    scene.add(stars);

    const controls = fg.controls();
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.25;
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
    }

    let raf = 0;
    const t0 = performance.now();
    const tick = () => {
      const t = (performance.now() - t0) / 1000;
      for (const s of spinsRef.current) s.mesh.rotation.y = t * s.speed;
      stars.rotation.y = t * 0.004;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const fit = setTimeout(() => fg.zoomToFit(1000, 90), 1600);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fit);
      scene.remove(stars);
      spinsRef.current = [];
    };
  }, [lib]);

  const focus = (n: any) => {
    const fg = fgRef.current;
    if (!fg) return;
    const dist = 90;
    const r = 1 + dist / Math.hypot(n.x || 1, n.y || 1, n.z || 1);
    fg.cameraPosition(
      { x: (n.x || 0) * r, y: (n.y || 0) * r, z: (n.z || 0) * r },
      n,
      1500
    );
    setSelected(n);
  };

  if (!lib) {
    return (
      <div className="flex h-full w-full items-center justify-center text-sm text-white/40">
        Entering the galaxy…
      </div>
    );
  }

  const { THREE, SpriteText } = lib;
  const style = selected ? planetStyle(selected) : null;

  return (
    <div className="h-full w-full">
      <ForceGraph3D
        ref={fgRef}
        graphData={data}
        backgroundColor="#050507"
        showNavInfo={false}
        enableNodeDrag={false}
        controlType="orbit"
        nodeThreeObject={(n: any) => {
          const s = planetStyle(n);
          const group = new THREE.Group();

          const mat = new THREE.MeshStandardMaterial({
            color: s.color,
            roughness: 0.62,
            metalness: 0.15,
            emissive: new THREE.Color(s.color),
            emissiveIntensity: n.type === "PRIMITIVE" ? 0.35 : 0.12,
          });
          const body = new THREE.Mesh(new THREE.SphereGeometry(s.radius, 40, 40), mat);
          group.add(body);
          if (n.type !== "BACKER") spinsRef.current.push({ mesh: body, speed: 0.15 });

          if (n.type !== "BACKER") {
            const atmo = new THREE.Mesh(
              new THREE.SphereGeometry(s.radius * 1.35, 32, 32),
              new THREE.MeshBasicMaterial({
                color: s.accent,
                transparent: true,
                opacity: 0.14,
                side: THREE.BackSide,
              })
            );
            group.add(atmo);
          }

          if (s.ring) {
            const ring = new THREE.Mesh(
              new THREE.RingGeometry(s.radius * 1.6, s.radius * 2.3, 64),
              new THREE.MeshBasicMaterial({
                color: s.accent,
                transparent: true,
                opacity: 0.4,
                side: THREE.DoubleSide,
              })
            );
            ring.rotation.x = Math.PI / 2.4;
            group.add(ring);
            spinsRef.current.push({ mesh: ring, speed: 0.3 });
          }

          if (s.labelSize > 0) {
            const text = new SpriteText(n.label);
            text.color = s.labelColor;
            text.textHeight = s.labelSize;
            text.position.y = s.radius * 2 + 6;
            group.add(text);
          }

          return group;
        }}
        linkColor={(l: any) => (l.kind === "USES" ? "#e8a33d" : "#1c1a17")}
        linkOpacity={0.4}
        linkWidth={(l: any) => (l.kind === "USES" ? 0.6 : 0.2)}
        linkDirectionalParticles={(l: any) => (l.kind === "USES" ? 3 : 0)}
        linkDirectionalParticleWidth={1.8}
        linkDirectionalParticleSpeed={0.005}
        linkDirectionalParticleColor={() => "#ffd89b"}
        onNodeClick={focus}
        onBackgroundClick={() => setSelected(null)}
      />

      {selected && style && (
        <aside className="pointer-events-none absolute right-8 top-20 z-[110] w-80 rounded-2xl border border-white/10 bg-black/70 p-7 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full" style={{ background: style.color }} />
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/40">
              {selected.category ?? selected.type.toLowerCase()}
            </p>
          </div>
          <h3 className="mt-3 text-2xl font-medium tracking-tight text-white">
            {selected.label}
          </h3>
          {selected.tagline && (
            <p className="mt-4 text-sm leading-relaxed text-white/60">{selected.tagline}</p>
          )}
          {selected.replaces && (
            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/40">Replaces</p>
              <p className="mt-2 text-sm" style={{ color: style.accent }}>{selected.replaces}</p>
            </div>
          )}
        </aside>
      )}
    </div>
  );
}
