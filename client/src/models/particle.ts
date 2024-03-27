export class Particle {
  x: number;
  y: number;
  dest: {
    x: number;
    y: number;
  };
  r: number;
  vx: number;
  vy: number;
  accY: number;
  accX: number;
  friction: number;
  color: string;

  constructor(x: number, y: number, ww: number, wh: number, colors: string[]) {
    this.x = Math.random() * ww;
    this.y = Math.random() * wh;
    this.dest = {
      x: x,
      y: y,
    };
    // this.r = Math.random() * 5 + 2;
    this.r = 3;
    this.vx = (Math.random() - 0.1) * 10;
    this.vy = (Math.random() - 0.1) * 10;
    this.accX = 0;
    this.accY = 0;
    this.friction = Math.random() * 0.0002 + 0.8;

    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  render(ctx: CanvasRenderingContext2D) {
    this.accX = (this.dest.x - this.x) / 100;
    this.accY = (this.dest.y - this.y) / 100;
    this.vx += this.accX;
    this.vy += this.accY;
    this.vx *= this.friction;
    this.vy *= this.friction;

    this.x += this.vx;
    this.y += this.vy;

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, Math.PI * 2, 0, false);
    ctx.fill();

    // const a = this.x - mouse.x;
    // const b = this.y - mouse.y;

    // const distance = Math.sqrt(a * a + b * b);
    // if (distance < radius * 70) {
    //   this.accX = (this.x - mouse.x) / 100;
    //   this.accY = (this.y - mouse.y) / 100;
    //   this.vx += this.accX;
    //   this.vy += this.accY;
    // }
  }
}
