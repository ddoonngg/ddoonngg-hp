import { useRef, useEffect } from "react";
import { Particle } from "./models/particle";

export default function ParticleEffect({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ww = window.innerWidth;
  const wh = window.innerHeight;
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = "bold " + ww / 20 + "px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("AI ", ww / 2, wh / 2);

    const data = ctx.getImageData(0, 0, ww, wh).data;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "screen";
    const particles: Particle[] = [];
    for (let i = 0; i < ww; i += Math.round(ww / 300)) {
      for (let j = 0; j < wh; j += Math.round(ww / 300)) {
        if (data[(i + j * ww) * 4 + 3] > 150) {
          particles.push(new Particle(i, j, ww, wh, ["#2a9d8f"]));
        }
      }
    }

    function render() {
      requestAnimationFrame(render);
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
          particles[i].render(ctx);
        }
      }
    }
    requestAnimationFrame(render);
    return () => {};
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={width * 2}
      height={height * 2}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    />
  );
}
