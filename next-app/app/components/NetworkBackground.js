"use client";

import { useEffect, useRef } from "react";

// A subtle, continuously moving network shared by the provincial and city homes.
export default function NetworkBackground({ className = "", paused = false, lineIntensity = 1 }) {
  const canvasRef = useRef(null);
  const pausedRef = useRef(paused);
  const restartRef = useRef(null);
  useEffect(() => { pausedRef.current = paused; restartRef.current?.(); }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!context) return undefined;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { x: -1000, y: -1000 };
    let width = 0;
    let height = 0;
    let points = [];
    let frame = 0;
    let previous = 0;
    let scroll = window.scrollY;

    function resize() {
      window.cancelAnimationFrame(frame);
      width = window.innerWidth;
      height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      points = Array.from({ length: width < 700 ? 22 : 44 }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 28,
        vy: (Math.random() - 0.5) * 23,
        depth: 0.3 + Math.random() * 0.7,
        gold: index % 6 === 0,
      }));
      previous = 0;
      render(0);
    }

    function render(time) {
      frame = 0;
      const moving = !pausedRef.current && !motion.matches && !document.hidden;
      const elapsed = previous ? Math.min((time - previous) / 1000, 0.04) : 0;
      previous = time;
      context.clearRect(0, 0, width, height);
      const positions = points.map((point) => {
        if (moving) {
          point.x = (point.x + point.vx * elapsed + width) % width;
          point.y = (point.y + point.vy * elapsed + height) % height;
        }
        return {
          ...point,
          py: ((point.y - scroll * point.depth * 0.1) % height + height) % height,
        };
      });
      positions.forEach((point, index) => {
        for (let next = index + 1; next < positions.length; next += 1) {
          const neighbor = positions[next];
          const distance = Math.hypot(point.x - neighbor.x, point.py - neighbor.py);
          if (distance >= 230) continue;
          context.strokeStyle = `rgba(110,128,155,${0.27 * lineIntensity * (1 - distance / 230)})`;
          context.lineWidth = 0.7;
          context.beginPath();
          context.moveTo(point.x, point.py);
          context.lineTo(neighbor.x, neighbor.py);
          context.stroke();
        }
        if (moving && Math.hypot(point.x - pointer.x, point.py - pointer.y) < 160) {
          context.strokeStyle = "rgba(18,35,63,0.12)";
          context.beginPath();
          context.moveTo(point.x, point.py);
          context.lineTo(pointer.x, pointer.y);
          context.stroke();
        }
        context.fillStyle = point.gold ? "rgba(184,150,70,0.5)" : "rgba(110,128,155,0.32)";
        context.beginPath();
        context.arc(point.x, point.py, point.gold ? 2 : 1.5, 0, Math.PI * 2);
        context.fill();
      });
      if (moving) frame = window.requestAnimationFrame(render);
    }

    function updateScroll() {
      if (pausedRef.current || motion.matches) return;
      scroll = window.scrollY;
      if (!frame && !document.hidden) render(performance.now());
    }
    function updatePointer(event) { pointer.x = event.clientX; pointer.y = event.clientY; }
    function clearPointer() { pointer.x = -1000; pointer.y = -1000; }
    function restart() { window.cancelAnimationFrame(frame); previous = 0; frame = window.requestAnimationFrame(render); }
    restartRef.current = restart;

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("pointermove", updatePointer, { passive: true });
    document.addEventListener("pointerleave", clearPointer);
    document.addEventListener("visibilitychange", restart);
    motion.addEventListener("change", restart);
    return () => {
      restartRef.current = null;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("pointermove", updatePointer);
      document.removeEventListener("pointerleave", clearPointer);
      document.removeEventListener("visibilitychange", restart);
      motion.removeEventListener("change", restart);
    };
  }, [lineIntensity]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
