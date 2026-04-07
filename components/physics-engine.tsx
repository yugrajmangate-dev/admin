"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface PhysicsEngineProps {
  gravity: { x: number; y: number };
  isZeroG: boolean;
  onEngineReady?: (engine: any) => void;
}

export function PhysicsEngine({ gravity, isZeroG, onEngineReady }: PhysicsEngineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<any>(null);
  const renderRef = useRef<any>(null);
  const runnerRef = useRef<any>(null);
  const bodiesRef = useRef<any[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    let Matter: any;
    
    async function init() {
      Matter = await import("matter-js");
      const { Engine, Render, Runner, Bodies, Composite, Events } = Matter;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = width;
      canvas.height = height;

      // Create engine
      const engine = Engine.create({ gravity: { x: 0, y: 1 } });
      engineRef.current = engine;
      if (onEngineReady) onEngineReady(engine);

      // Create renderer
      const render = Render.create({
        canvas,
        engine,
        options: {
          width,
          height,
          wireframes: false,
          background: "#0B0F19",
        },
      });
      renderRef.current = render;

      // Walls
      const wallOpts = { isStatic: true, render: { fillStyle: "#1a2040" } };
      const walls = [
        Bodies.rectangle(width / 2, height + 25, width, 50, wallOpts),   // floor
        Bodies.rectangle(width / 2, -25, width, 50, wallOpts),            // ceiling
        Bodies.rectangle(-25, height / 2, 50, height, wallOpts),          // left
        Bodies.rectangle(width + 25, height / 2, 50, height, wallOpts),   // right
      ];

      // Create 70 vibrant bodies
      const neonColors = [
        "#00f5ff", "#ff6b35", "#ff4f5a", "#a78bfa", "#34d399", "#fbbf24",
        "#60a5fa", "#f472b6", "#4ade80", "#fb923c",
      ];

      const shapes: any[] = [];
      for (let i = 0; i < 70; i++) {
        const x = Math.random() * (width - 100) + 50;
        const y = Math.random() * (height / 2);
        const color = neonColors[i % neonColors.length];
        const size = Math.random() * 22 + 10;
        const type = i % 3;

        let body;
        if (type === 0) {
          body = Bodies.circle(x, y, size, {
            restitution: 0.6,
            friction: 0.01,
            render: { fillStyle: color, strokeStyle: color, lineWidth: 1 },
          });
        } else if (type === 1) {
          body = Bodies.rectangle(x, y, size * 2, size * 2, {
            restitution: 0.5,
            friction: 0.02,
            chamfer: { radius: 4 },
            render: { fillStyle: color, strokeStyle: color, lineWidth: 1 },
          });
        } else {
          body = Bodies.polygon(x, y, Math.floor(Math.random() * 3) + 5, size, {
            restitution: 0.55,
            friction: 0.01,
            render: { fillStyle: color, strokeStyle: color, lineWidth: 1 },
          });
        }
        shapes.push(body);
      }

      bodiesRef.current = shapes;
      Composite.add(engine.world, [...walls, ...shapes]);

      // Runner
      const runner = Runner.create();
      runnerRef.current = runner;
      Runner.run(runner, engine);
      Render.run(render);

      // Resize handler
      const handleResize = () => {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        canvas.width = w;
        canvas.height = h;
        render.options.width = w;
        render.options.height = h;
        render.canvas.width = w;
        render.canvas.height = h;
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        Render.stop(render);
        Runner.stop(runner);
        Engine.clear(engine);
      };
    }

    const cleanup = init();
    return () => { cleanup.then(fn => fn && fn()); };
  }, []);

  // Update gravity in real time
  useEffect(() => {
    if (!engineRef.current) return;
    engineRef.current.gravity.x = gravity.x;
    engineRef.current.gravity.y = gravity.y;
  }, [gravity]);

  // Zero-G: apply random drift forces
  useEffect(() => {
    if (!isZeroG || bodiesRef.current.length === 0) return;
    let interval: NodeJS.Timeout;

    async function applyDrift() {
      const Matter = await import("matter-js");
      interval = setInterval(() => {
        for (const body of bodiesRef.current) {
          Matter.Body.applyForce(body, body.position, {
            x: (Math.random() - 0.5) * 0.002,
            y: (Math.random() - 0.5) * 0.002,
          });
        }
      }, 200);
    }
    applyDrift();
    return () => clearInterval(interval);
  }, [isZeroG]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
}
