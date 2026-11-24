// Flat 2D cartoon cast & 2D effect cards for "Saan Nagsimula Ang Kwentong Biringan City" (Samar, Philippines).
// Follows the exact proven cartoon-3d-short character grammar: superellipse bean heads (h/w 0.94),
// plum ink #241726 variable-width outline, stick limbs with ink-dot hands, deadpan lidded eyes,
// no blush, no eye catchlights, painted radial/linear crescents. Design space 600 x 1000 (soles y = 975).
export const INK = "#241726";
export const SKIN = "#e8b98e";
const WHITE = "#ffffff";
const MOUTH = "#5a1e28";
const TONGUE = "#e86e78";
type C3 = [number, number, number];
const SH_SKIN: C3 = [0.94, 0.84, 0.80];
const SH_CLOTH: C3 = [0.64, 0.66, 0.74];
const SH_FELT: C3 = [0.62, 0.62, 0.70];

export type Build = "adult" | "stout" | "elder" | "kid";
export type HatStyle =
  | "none"
  | "salakot"
  | "bandana"
  | "cap"
  | "hardhat"
  | "sunhat"
  | "bun"
  | "sleek"
  | "bob";

export type Outfit = {
  jacket: string;
  pants: string;
  boots: string;
  skin?: string;
  hair?: string | null;
  hat?: HatStyle;
  hatCol?: string;
  barong?: boolean;     // Traditional Filipino Barong Tagalog golden embroidery panel
  towel?: boolean;      // Iconic Pinoy jeepney driver white shoulder towel
  sash?: string;
  collar?: string;
  tie?: string;
  moustache?: string;
  glasses?: boolean;
  saya?: string;        // Traditional baro't saya skirt/drape
  noPhiltrumCue?: boolean; // Shot 6 close-up gag highlighting smooth philtrum-free upper lip
  build?: Build;
};

type P2 = [number, number];
const rad = (d: number) => (d * Math.PI) / 180;
const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));

export const mul = (c: string, m: C3) => {
  const n = parseInt(c.slice(1), 16);
  const ch = (v: number, k: number) => Math.min(255, Math.round(v * k)).toString(16).padStart(2, "0");
  return `#${ch((n >> 16) & 255, m[0])}${ch((n >> 8) & 255, m[1])}${ch(n & 255, m[2])}`;
};
export const shade = (c: string, k: number) => mul(c, [k, k, k]);
export const mix = (a: string, b: string, t: number) => {
  const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16);
  const ch = (s: number) => Math.round(((A >> s) & 255) * (1 - t) + ((B >> s) & 255) * t).toString(16).padStart(2, "0");
  return `#${ch(16)}${ch(8)}${ch(0)}`;
};
const rnd = (seed: number, k: number) => {
  const x = Math.sin(seed * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const rotPts = (pts: P2[], a: number, cx: number, cy: number): P2[] =>
  pts.map(([x, y]) => [cx + (x - cx) * Math.cos(a) - (y - cy) * Math.sin(a), cy + (x - cx) * Math.sin(a) + (y - cy) * Math.cos(a)]);
const rotAbout = (q: P2, a: number, c: P2): P2 => rotPts([q], a, c[0], c[1])[0];
const lerp2 = (a: P2, b: P2, t: number): P2 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const curve = (a: P2, k: P2, b: P2, n = 10): P2[] => {
  const c: P2 = [2 * k[0] - (a[0] + b[0]) / 2, 2 * k[1] - (a[1] + b[1]) / 2], out: P2[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, s = 1 - t;
    out.push([s * s * a[0] + 2 * s * t * c[0] + t * t * b[0], s * s * a[1] + 2 * s * t * c[1] + t * t * b[1]]);
  }
  return out;
};

// ---------------- Filipino / Samar & Biringan Cast Outfits ----------------
export const FISHERMAN: Outfit = {
  jacket: "#3a6ea5", pants: "#59483a", boots: "#4a3324", skin: "#cf976b",
  hat: "salakot", hatCol: "#d8b26a", collar: "#f0e8d4", build: "adult",
};
export const FISHERMAN_B: Outfit = {
  jacket: "#d49a42", pants: "#3c4a5c", boots: "#423022", skin: "#c78d62",
  hat: "bandana", hatCol: "#c4342d", hair: "#221b1e", build: "adult",
};
export const LOLO: Outfit = {
  jacket: "#efe6d2", pants: "#5e4c3c", boots: "#3d2a1d", skin: "#c99268",
  hair: "#cfd2d8", moustache: "#cfd2d8", collar: "#e4d8be", build: "elder",
};
export const LOLA: Outfit = {
  jacket: "#e6c9a8", saya: "#8e4c52", pants: "#5a3c40", boots: "#3f2a1e", skin: "#cfa078",
  hat: "bun", hair: "#cfd2d8", collar: "#f7efe0", build: "elder",
};
export const HEALER: Outfit = {
  jacket: "#8c6848", pants: "#46392e", boots: "#38261a", skin: "#c58e62",
  hat: "salakot", hatCol: "#c49a52", sash: "#b8322c", build: "elder",
};
export const TRUCK_DRIVER: Outfit = {
  jacket: "#7d8a5e", pants: "#3a4556", boots: "#342720", skin: "#d29c70",
  hat: "cap", hatCol: "#c43b30", collar: "#ede4ce", build: "stout",
};
export const ENGKANTO: Outfit = {
  jacket: "#f7f1de", pants: "#2b2a38", boots: "#231f28", skin: "#fae6cd",
  hat: "sleek", hair: "#1e1b28", barong: true, sash: "#e0b342", build: "adult",
};
export const ENGKANTO_CU: Outfit = {
  ...ENGKANTO, noPhiltrumCue: true,
};
export const ENGKANTO_GUEST: Outfit = {
  jacket: "#dcece8", pants: "#2a3342", boots: "#221e28", skin: "#f7e2ca",
  hat: "bob", hair: "#201c2a", barong: true, sash: "#d8a83e", build: "adult",
};
export const ENGINEER: Outfit = {
  jacket: "#f2f0e8", pants: "#5a5e68", boots: "#2c282a", skin: "#f5d8bc",
  hat: "hardhat", hatCol: "#ebb834", collar: "#ffffff", tie: "#2a4472", glasses: true, build: "adult",
};
export const JEEPNEY_DRIVER: Outfit = {
  jacket: "#2e64a6", pants: "#384252", boots: "#302622", skin: "#cf966a",
  hat: "cap", hatCol: "#2b426c", towel: true, build: "stout",
};
export const TOURIST: Outfit = {
  jacket: "#e06d44", pants: "#426a7c", boots: "#4a3828", skin: "#e0ad82",
  hat: "sunhat", hatCol: "#e6c67c", collar: "#f8f0dc", build: "adult",
};
export const BIKE_KID: Outfit = {
  jacket: "#db5442", pants: "#3a567a", boots: "#f0ece0", skin: "#d6a074",
  hat: "cap", hatCol: "#2d7a64", build: "kid",
};
export const VISITOR: Outfit = {
  jacket: "#487c82", pants: "#364050", boots: "#382a22", skin: "#d8a276",
  hair: "#241d22", collar: "#f2ead8", build: "adult",
};
export const FAMILY_B: Outfit = {
  jacket: "#c96c52", pants: "#3c4658", boots: "#3a2c24", skin: "#d6a076",
  hat: "bob", hair: "#261e24", collar: "#f4ede0", build: "adult",
};

const SKINS = ["#c58e62", "#d6a076", "#b87e54", "#deaa80", "#cc9568"];
export const villager = (v = 0): Outfit => {
  const tops = ["#efe6d2", "#c87a52", "#587e84", "#d6ae5a", "#786c8e", "#8ca46a"];
  return {
    jacket: tops[v % tops.length], pants: "#483e36", boots: "#3b2a1e",
    skin: SKINS[v % SKINS.length],
    hat: v % 3 === 0 ? "salakot" : v % 3 === 1 ? "bun" : "none",
    hatCol: "#d4ae66", hair: "#241e22",
    saya: v % 3 === 1 ? "#6e4c56" : undefined,
    build: "adult",
  };
};

// ---------------- Pen ----------------
export class Pen {
  g: CanvasRenderingContext2D;
  ol = 12;
  rot: number[] | null = null;
  constructor(g: CanvasRenderingContext2D) { this.g = g; }
  P(x: number, y: number): P2 {
    if (!this.rot) return [x, y];
    const r = this.rot, a = r[0], cx = r[1], cy = r[2], dx = r.length > 3 ? r[3] : 0, dy = r.length > 4 ? r[4] : 0;
    const c = Math.cos(a), s = Math.sin(a);
    return [cx + (x - cx) * c - (y - cy) * s + dx, cy + (x - cx) * s + (y - cy) * c + dy];
  }
  path(pts: P2[], close: boolean) {
    const g = this.g;
    g.beginPath();
    pts.forEach((p, i) => { const [x, y] = this.P(p[0], p[1]); if (i) g.lineTo(x, y); else g.moveTo(x, y); });
    if (close) g.closePath();
  }
  poly(pts: P2[], fill: string | null, ol?: number) {
    const g = this.g, w = ol ?? this.ol;
    this.path(pts, true);
    if (fill) { g.fillStyle = fill; g.fill(); }
    if (w) { g.lineWidth = w; g.strokeStyle = INK; g.lineJoin = "round"; g.stroke(); }
  }
  ell(cx: number, cy: number, rx: number, ry: number, fill: string | null, ol?: number, a0 = 0, a1 = 360, rot = 0) {
    this.poly(ellPts(cx, cy, rx, ry, a0, a1, rot), fill, ol);
  }
  stroke(pts: P2[], w: number, fill = INK) {
    const g = this.g;
    g.lineCap = "round"; g.lineJoin = "round";
    this.path(pts, false); g.strokeStyle = fill; g.lineWidth = w; g.stroke();
  }
  arc(cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, w: number, fill = INK) {
    const pts: P2[] = [];
    for (let i = 0; i <= 24; i++) pts.push([cx + rx * Math.cos(rad(a0 + ((a1 - a0) * i) / 24)), cy + ry * Math.sin(rad(a0 + ((a1 - a0) * i) / 24))]);
    this.stroke(pts, w, fill);
  }
  dot(cx: number, cy: number, r: number, fill = INK) {
    const [x, y] = this.P(cx, cy);
    this.g.beginPath(); this.g.arc(x, y, r, 0, Math.PI * 2); this.g.fillStyle = fill; this.g.fill();
  }
  clip(pts: P2[], fn: () => void) { const g = this.g; g.save(); this.path(pts, true); g.clip(); fn(); g.restore(); }
  shadedFill(pts: P2[], base: string, shadow: string, light: number, R: number, shift = 0.45, r0 = 1.05, r1 = 1.25) {
    const g = this.g, n = pts.length;
    let cx = 0, cy = 0;
    for (const [x, y] of pts) { cx += x / n; cy += y / n; }
    const [gx, gy] = this.P(cx + Math.cos(light) * shift * R, cy + Math.sin(light) * shift * R);
    const gr = g.createRadialGradient(gx, gy, 0, gx, gy, r1 * R);
    gr.addColorStop(0, base); gr.addColorStop(r0 / r1, base); gr.addColorStop(1, shadow);
    this.path(pts, true); g.fillStyle = gr; g.fill();
  }
  gradFill(pts: P2[], base: string, shadow: string, light: number, flat = 0.22) {
    const g = this.g, dx = Math.cos(light), dy = Math.sin(light), n = pts.length;
    let cx = 0, cy = 0, lo = Infinity, hi = -Infinity;
    for (const [x, y] of pts) { cx += x / n; cy += y / n; const d = x * dx + y * dy; lo = Math.min(lo, d); hi = Math.max(hi, d); }
    const dc = cx * dx + cy * dy;
    const [ax, ay] = this.P(cx + dx * (hi - dc), cy + dy * (hi - dc)), [bx, by] = this.P(cx + dx * (lo - dc), cy + dy * (lo - dc));
    const gr = g.createLinearGradient(ax, ay, bx, by);
    gr.addColorStop(0, base); gr.addColorStop(flat, base); gr.addColorStop(1, shadow);
    this.path(pts, true); g.fillStyle = gr; g.fill();
  }
  inkRing(pts: P2[], w0: number, thick: number, k = 0.45, col = INK) {
    const n = pts.length;
    let cx = 0, cy = 0;
    for (const [x, y] of pts) { cx += x / n; cy += y / n; }
    const out: P2[] = [], inn: P2[] = [];
    pts.forEach((q, i) => {
      const a = pts[(i + n - 1) % n], b = pts[(i + 1) % n];
      let nx = b[1] - a[1], ny = a[0] - b[0];
      const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l;
      const h = 0.5 * w0 * (1 + k * Math.cos(Math.atan2(q[1] - cy, q[0] - cx) - thick));
      out.push([q[0] + nx * h, q[1] + ny * h]); inn.push([q[0] - nx * h, q[1] - ny * h]);
    });
    const g = this.g;
    const trace = (r: P2[]) => { r.forEach(([x0, y0], i) => { const [x, y] = this.P(x0, y0); if (i) g.lineTo(x, y); else g.moveTo(x, y); }); g.closePath(); };
    g.beginPath(); trace(out); trace(inn.reverse());
    g.fillStyle = col; g.fill("evenodd");
  }
  band(pts: P2[], fill: string, w: number, rim: number, cap: CanvasLineCap = "butt") {
    const g = this.g; g.lineCap = cap; g.lineJoin = "round";
    this.path(pts, false); g.strokeStyle = INK; g.lineWidth = w + 2 * rim; g.stroke();
    this.path(pts, false); g.strokeStyle = fill; g.lineWidth = w; g.stroke();
    g.lineCap = "round";
  }
}

const ellPts = (cx: number, cy: number, rx: number, ry: number, a0 = 0, a1 = 360, rot = 0, n = 48): P2[] => {
  const r = rad(rot), pts: P2[] = [];
  for (let i = 0; i <= n; i++) {
    const a = rad(a0 + ((a1 - a0) * i) / n), x = rx * Math.cos(a), y = ry * Math.sin(a);
    pts.push([cx + x * Math.cos(r) - y * Math.sin(r), cy + x * Math.sin(r) + y * Math.cos(r)]);
  }
  return pts;
};

const rrect = (x0: number, y0: number, x1: number, y1: number, r: number, n = 8): P2[] => {
  const pts: P2[] = [];
  for (const [cx, cy, a] of [[x1 - r, y0 + r, -90], [x1 - r, y1 - r, 0], [x0 + r, y1 - r, 90], [x0 + r, y0 + r, 180]])
    for (let i = 0; i <= n; i++) pts.push([cx + r * Math.cos(rad(a + (90 * i) / n)), cy + r * Math.sin(rad(a + (90 * i) / n))]);
  return pts;
};

const taper = (p: Pen, a: P2, b: P2, wa: number, wb: number, col = INK) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
  p.poly([[a[0] + nx * wa / 2, a[1] + ny * wa / 2], [b[0] + nx * wb / 2, b[1] + ny * wb / 2],
    [b[0] - nx * wb / 2, b[1] - ny * wb / 2], [a[0] - nx * wa / 2, a[1] - ny * wa / 2]], col, 0);
  p.dot(a[0], a[1], wa / 2, col); p.dot(b[0], b[1], wb / 2, col);
};

// ---------------- bean contours ----------------
export type Blob = { a: number; b: number; nTop: number; nBot: number; egg: number; asym: number; rot: number; noise: number; seed: number };
export const blobPts = (cx: number, cy: number, B: Blob, n = 72): P2[] => {
  const ph = [rnd(B.seed, 11), rnd(B.seed, 12), rnd(B.seed, 13)].map((v) => v * Math.PI * 2);
  const pts: P2[] = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2, c = Math.cos(t), s = Math.sin(t), e = 2 / (s < 0 ? B.nTop : B.nBot);
    let X = Math.sign(c) * Math.abs(c) ** e;
    const Y = Math.sign(s) * Math.abs(s) ** e;
    X *= (1 + B.egg * Y) * (1 + B.asym * Math.sign(X));
    const r = 1 + B.noise * (Math.cos(2 * t + ph[0]) + 0.7 * Math.cos(3 * t + ph[1]) + 0.5 * Math.cos(4 * t + ph[2]));
    const x = B.a * X * r, y = B.b * Y * r;
    pts.push([cx + x * Math.cos(B.rot) - y * Math.sin(B.rot), cy + x * Math.sin(B.rot) + y * Math.cos(B.rot)]);
  }
  return pts;
};

export const headBlob = (seed: number, a = 118, facing = 0): Blob => ({
  a, b: a * (0.94 + 0.06 * (rnd(seed, 1) - 0.5)),
  nTop: 1.75 + 0.25 * (rnd(seed, 2) - 0.5), nBot: 2.3 + 0.25 * (rnd(seed, 3) - 0.5),
  egg: -0.12 + 0.05 * (rnd(seed, 4) - 0.5),
  asym: (0.06 + 0.03 * rnd(seed, 5)) * (facing || (rnd(seed, 6) < 0.5 ? -1 : 1)),
  rot: rad(6 * (rnd(seed, 7) - 0.5)), noise: 0.008, seed,
});

export const thickAngle = (light: number) => Math.atan2(-Math.sin(light) + 0.8, -Math.cos(light));
const DEF_LIGHT = rad(-120);

// ---------------- faces ----------------
export type Expr = "neutral" | "stern" | "smug" | "grin" | "laugh" | "nervous" | "shock" | "relief" | "deadpan" | "smile" | "talk" | "awe";
type EyeK = "dot" | "small" | "lid" | "slit" | "happy" | "dash" | "squeeze" | "shock" | "shockHalf";
type MouthK = "dash" | "frown" | "smirk" | "smile" | "smileWide" | "grin" | "laugh" | "o" | "O" | "wave";

const FACE: Record<Expr, { eye: [EyeK, EyeK]; brow: [number, number]; mouth: MouthK }> = {
  neutral: { eye: ["lid", "lid"],         brow: [0, -1],   mouth: "dash" },
  deadpan: { eye: ["slit", "slit"],       brow: [1, 1],    mouth: "dash" },
  stern:   { eye: ["lid", "lid"],         brow: [4, -2],   mouth: "frown" },
  smug:    { eye: ["lid", "slit"],        brow: [-2, 3],   mouth: "smirk" },
  grin:    { eye: ["happy", "happy"],     brow: [-3, -3],  mouth: "grin" },
  laugh:   { eye: ["squeeze", "squeeze"], brow: [-4, -4],  mouth: "laugh" },
  nervous: { eye: ["small", "small"],     brow: [-3, 2],   mouth: "wave" },
  shock:   { eye: ["shock", "shock"],     brow: [-7, -6],  mouth: "O" },
  awe:     { eye: ["shock", "shock"],     brow: [-5, -4],  mouth: "o" },
  relief:  { eye: ["happy", "happy"],     brow: [-2, 1],   mouth: "smileWide" },
  smile:   { eye: ["dot", "dot"],         brow: [0, -1],   mouth: "smile" },
  talk:    { eye: ["dot", "dot"],         brow: [-2, -1],  mouth: "o" },
};
const halfLid = (k: EyeK): EyeK => (k === "dot" || k === "small" ? "lid" : k === "lid" ? "slit" : k === "shock" ? "shockHalf" : k);
const eyeKind = (k: EyeK, lid: number): EyeK => (lid >= 1 && k !== "happy" && k !== "squeeze" ? "dash" : lid > 0 ? halfLid(k) : k);
const lidOf = (b: boolean | number | undefined) => (b === true ? 1 : Number(b) || 0);

const eye = (p: Pen, kind: EyeK, x: number, ey: number, u: number, side: number, look: number, skin: string) => {
  const lx = x + look * 3 * u, lw = 3.8 * u;
  switch (kind) {
    case "dot": p.ell(lx, ey, 3.8 * u, 5.5 * u, INK, 0); break;
    case "small": p.ell(lx, ey, 3 * u, 4.4 * u, INK, 0); break;
    case "lid": p.ell(lx, ey - u, 7 * u, 6 * u, INK, 0, 0, 180); p.stroke([[x - 9 * u, ey - u], [x + 9 * u, ey - u]], lw); break;
    case "slit": p.ell(lx, ey, 7 * u, 2.6 * u, INK, 0, 0, 180); p.stroke([[x - 9 * u, ey], [x + 9 * u, ey]], lw); break;
    case "happy": p.arc(x, ey + 3 * u, 8 * u, 6 * u, 200, 340, lw); break;
    case "dash": p.stroke([[x - 8.5 * u, ey], [x + 8.5 * u, ey]], lw); break;
    case "squeeze": p.stroke([[x + 6 * u * side, ey - 5 * u], [x - 6 * u * side, ey], [x + 6 * u * side, ey + 5 * u]], lw); break;
    case "shock": case "shockHalf":
      p.ell(x, ey, 11 * u, 11 * u, WHITE, 2.6 * u); p.dot(lx - side * 1.5 * u, ey + 1.5 * u, 3 * u);
      if (kind === "shockHalf") { p.ell(x, ey, 11 * u, 11 * u, skin, 0, 180, 360); p.stroke([[x - 11 * u, ey], [x + 11 * u, ey]], 2.6 * u); }
      break;
  }
};

const dmouth = (p: Pen, mx: number, y: number, rx: number, ry: number, u: number, tongue = false) => {
  p.ell(mx, y, rx, ry, MOUTH, 0, 0, 180);
  p.clip([[mx - rx, y], [mx + rx, y], [mx + rx, y + 3 * u], [mx - rx, y + 3 * u]], () => p.ell(mx, y, rx, ry, WHITE, 0, 0, 180));
  if (tongue) p.ell(mx + 2 * u, y + 0.62 * ry, 0.4 * rx, 0.28 * ry, TONGUE, 0);
  p.ell(mx, y, rx, ry, null, 3 * u, 0, 180);
};

const mouth = (p: Pen, kind: MouthK, mx: number, my: number, u: number, k = 1) => {
  const mw = 4 * u;
  switch (kind) {
    case "dash": p.stroke([[mx - 5.5 * u * k, my], [mx + 5.5 * u * k, my - 0.8 * u]], mw); break;
    case "frown": p.arc(mx, my + 3 * u, 6.5 * u * k, 3.5 * u, 200, 340, mw); break;
    case "smirk": p.arc(mx + u, my - 3 * u, 7.5 * u * k, 4.5 * u, 10, 155, mw); break;
    case "smile": p.arc(mx, my - 3 * u, 8 * u * k, 4.5 * u, 20, 160, mw); break;
    case "smileWide": p.arc(mx, my - 4 * u, 11 * u * k, 6 * u, 15, 165, mw); break;
    case "grin": dmouth(p, mx, my - u, 12 * u * k, 8 * u, u); break;
    case "laugh": dmouth(p, mx, my, 16 * u * k, 11 * u, u, true); break;
    case "o": p.ell(mx + 2 * u, my, 4.2 * u, 5 * u, MOUTH, 2.8 * u); break;
    case "O": p.ell(mx, my + 2 * u, 9 * u * k, 11 * u, MOUTH, 3.2 * u); break;
    case "wave": { const s: P2[] = []; for (let i = 0; i <= 12; i++) s.push([mx - 9 * u * k + i * 1.5 * u * k, my + 1.5 * u * Math.sin(i * 1.3)]); p.stroke(s, 3 * u); break; }
  }
};

// ---------------- Filipino Hats & Hairstyles ----------------
const drawHat = (p: Pen, o: Outfit, hp: P2[], H: Blob, cx: number, hc: number, light: number, facing: number, side: boolean) => {
  const W = 2 * H.a, HH = 2 * H.b, u = W / 100, crown = hc - H.b, ow = 4.2 * u;
  const hat = o.hat ?? "none";

  if (hat === "salakot") {
    // Classic Filipino woven conical salakot straw hat with warm brass finial!
    const col = o.hatCol ?? "#d8b26a";
    const brY = crown + 16 * u;
    const cone: P2[] = [[cx - 76 * u, brY + 6 * u], [cx, brY - 38 * u], [cx + 76 * u, brY + 6 * u]];
    p.shadedFill(cone, col, mul(col, SH_FELT), light, 74 * u, 0.3);
    p.poly(cone, null, ow);
    // Subtle woven rattan ribs
    p.stroke([[cx, brY - 36 * u], [cx - 38 * u, brY + 4 * u]], 2.2 * u, "#8a6632");
    p.stroke([[cx, brY - 36 * u], [cx + 38 * u, brY + 4 * u]], 2.2 * u, "#8a6632");
    p.stroke([[cx, brY - 36 * u], [cx, brY + 5 * u]], 2.2 * u, "#8a6632");
    p.ell(cx, brY - 39 * u, 6.5 * u, 5 * u, "#e4bc48", 2.4 * u);
    return;
  }

  if (hat === "hardhat") {
    // 1980s Japanese mining surveyor bright yellow safety helmet
    const col = o.hatCol ?? "#ebb834";
    const brY = crown + 18 * u;
    const dome = ellPts(cx, brY, 48 * u, 36 * u, 180, 360);
    p.shadedFill(dome, col, mul(col, SH_FELT), light, 48 * u, 0.35);
    p.poly(dome, null, ow);
    // Center rib ridge
    p.poly(rrect(cx - 8 * u, brY - 38 * u, cx + 8 * u, brY - 4 * u, 4 * u), shade(col, 1.08), 2.8 * u);
    // Front brim
    p.ell(cx + (side ? 14 * u : 0), brY + 3 * u, 58 * u, 9 * u, shade(col, 0.92), ow * 0.9);
    return;
  }

  if (hat === "sunhat") {
    const col = o.hatCol ?? "#e6c67c";
    const brY = crown + 16 * u;
    p.ell(cx, brY + 4 * u, 70 * u, 12 * u, col, ow);
    const dome = ellPts(cx, brY, 44 * u, 28 * u, 180, 360);
    p.shadedFill(dome, col, mul(col, SH_FELT), light, 44 * u, 0.35);
    p.poly(dome, null, ow);
    p.poly(rrect(cx - 44 * u, brY - 8 * u, cx + 44 * u, brY + 2 * u, 3 * u), "#2e6d8c", 2.5 * u);
    return;
  }

  if (hat === "bandana") {
    if (o.hair) {
      const cut = crown + 0.34 * HH;
      const keep = (_x: number, y: number) => y < cut;
      const n = hp.length, sIdx = Math.max(0, hp.findIndex(([x, y], i) => keep(x, y) && !keep(hp[(i + n - 1) % n][0], hp[(i + n - 1) % n][1])));
      const arc = [...hp.slice(sIdx), ...hp.slice(0, sIdx)].filter(([x, y]) => keep(x, y)).map(([x, y]) => [cx + (x - cx) * 1.03, hc + (y - hc) * 1.03] as P2);
      if (arc.length >= 3) { p.shadedFill(arc, o.hair, mul(o.hair, SH_FELT), light, H.a, 0.35); p.poly(arc, null, ow * 0.85); }
    }
    const brY = crown + 22 * u;
    p.poly(rrect(cx - 48 * u, brY - 12 * u, cx + 48 * u, brY + 4 * u, 4 * u), o.hatCol ?? "#c4342d", 3.2 * u);
    // Knot tails on side
    p.poly([[cx - 48 * u, brY - 4 * u], [cx - 68 * u, brY - 10 * u], [cx - 64 * u, brY + 8 * u]], o.hatCol ?? "#c4342d", 2.8 * u);
    return;
  }

  if (hat === "cap" && o.hatCol) {
    const cut = crown + 0.32 * HH;
    const keep = (_x: number, y: number) => y < cut;
    const n = hp.length, sIdx = Math.max(0, hp.findIndex(([x, y], i) => keep(x, y) && !keep(hp[(i + n - 1) % n][0], hp[(i + n - 1) % n][1])));
    const arc = [...hp.slice(sIdx), ...hp.slice(0, sIdx)].filter(([x, y]) => keep(x, y)).map(([x, y]) => [cx + (x - cx) * 1.04, hc + (y - hc) * 1.04] as P2);
    if (arc.length >= 3) {
      p.shadedFill(arc, o.hatCol, mul(o.hatCol, SH_FELT), light, H.a, 0.35);
      p.poly(arc, null, ow);
      if (side) p.poly([[cx + 38 * u, cut - 2 * u], [cx + 72 * u, cut + 4 * u], [cx + 38 * u, cut + 7 * u]], shade(o.hatCol, 0.78), ow * 0.85);
      else p.ell(cx + (facing || 1) * 4 * u, cut + 1.5 * u, 34 * u, 0.06 * HH, shade(o.hatCol, 0.78), ow * 0.85, 0, 180);
    }
    return;
  }

  if (hat === "bun" && o.hair) {
    // Neat Filipino Lola hair bun at back/crown
    p.ell(cx + (side ? -42 * u : 0), crown + (side ? 16 * u : -6 * u), 22 * u, 20 * u, o.hair, ow * 0.85);
  }

  if (hat === "sleek" && o.hair) {
    // Aristocratic swept hair for Engkanto
    const cut = crown + 0.36 * HH;
    const keep = (x: number, y: number) => y < cut || (side && x < cx - 6 * u && y < hc + 0.25 * H.b);
    const n = hp.length, sIdx = Math.max(0, hp.findIndex(([x, y], i) => keep(x, y) && !keep(hp[(i + n - 1) % n][0], hp[(i + n - 1) % n][1])));
    const arc = [...hp.slice(sIdx), ...hp.slice(0, sIdx)].filter(([x, y]) => keep(x, y)).map(([x, y]) => [cx + (x - cx) * 1.05, hc + (y - hc) * 1.05] as P2);
    if (arc.length >= 3) { p.shadedFill(arc, o.hair, mul(o.hair, SH_FELT), light, H.a, 0.35); p.poly(arc, null, ow * 0.85); }
    // Dramatic forehead swoop crest
    p.poly([[cx - 26 * u, crown + 2 * u], [cx + 12 * u, crown - 14 * u], [cx + 36 * u, crown + 16 * u], [cx - 4 * u, crown + 24 * u]], o.hair, ow * 0.75);
    return;
  }

  if (hat === "bob" && o.hair) {
    // Neat bob hair staying cleanly above the eyebrows so eyes always shine!
    p.ell(cx, crown + 16 * u, 52 * u, 28 * u, o.hair, ow * 0.85, 180, 360);
    p.ell(cx - 46 * u, hc + 8 * u, 11 * u, 24 * u, o.hair, ow * 0.75);
    p.ell(cx + 46 * u, hc + 8 * u, 11 * u, 24 * u, o.hair, ow * 0.75);
    return;
  }

  if (o.hair) {
    const cut = crown + 0.34 * HH;
    const keep = (x: number, y: number) => y < cut || (side && x < cx - 8 * u && y < hc + 0.25 * H.b);
    const n = hp.length, sIdx = Math.max(0, hp.findIndex(([x, y], i) => keep(x, y) && !keep(hp[(i + n - 1) % n][0], hp[(i + n - 1) % n][1])));
    const arc = [...hp.slice(sIdx), ...hp.slice(0, sIdx)].filter(([x, y]) => keep(x, y)).map(([x, y]) => [cx + (x - cx) * 1.03, hc + (y - hc) * 1.03] as P2);
    if (arc.length >= 3) { p.shadedFill(arc, o.hair, mul(o.hair, SH_FELT), light, H.a, 0.35); p.poly(arc, null, ow * 0.85); }
  }
};

const faceFront = (p: Pen, cx: number, cy: number, W: number, expr: Expr, facing: number, look: number, lid: number, o: Outfit) => {
  const u = W / 100, F = FACE[expr], fx = cx + 7 * u * facing, skin = o.skin ?? SKIN;
  const ex = (F.eye[0] === "shock" ? 12 : 13) * u, ey = cy;
  for (const side of [-1, 1]) {
    const x = fx + side * ex;
    const kind = eyeKind(F.eye[(facing ? side === facing : side > 0) ? 1 : 0], lid);
    eye(p, kind, x, ey, u, side, look, skin);
    const [dI, dO] = F.brow, by = ey - 19 * u;
    if (kind === "shock" || kind === "shockHalf") p.arc(x, by - 6 * u, 9 * u, 3 * u, 200, 340, 4 * u);
    else taper(p, [x - side * 8.5 * u, by + dI * u], [x + side * 8.5 * u, by + dO * u], 4.8 * u, 2.4 * u);
  }
  if (o.glasses) {
    for (const side of [-1, 1]) p.ell(fx + side * ex, ey, 14 * u, 12 * u, null, 2.8 * u);
    p.stroke([[fx - 2 * u, ey], [fx + 2 * u, ey]], 2.8 * u, INK);
  }
  const mx = cx + 8 * u * facing, my = cy + 20 * u;
  if (o.noPhiltrumCue) {
    // Draw a subtle clean nose bridge and highlight the completely smooth philtrum-free upper lip!
    p.arc(mx, cy + 7 * u, 5 * u, 3.5 * u, 15, 165, 2.6 * u, INK);
    // Glowing golden dotted ring highlighting the smooth gap between nose & lip (zero text!)
    const g = p.g;
    g.save();
    const [gx, gy] = p.P(mx, cy + 14.5 * u);
    g.strokeStyle = "#f4b936";
    g.lineWidth = 4.2 * u;
    g.setLineDash([7 * u, 5 * u]);
    g.beginPath();
    g.arc(gx, gy, 15 * u, 0, Math.PI * 2);
    g.stroke();
    g.restore();
  }
  mouth(p, F.mouth, mx, my, u);
  if (o.moustache) {
    const big = o.build === "stout";
    for (const s of [-1, 1])
      taper(p, [mx + s * 1.5 * u, cy + 12.5 * u], [mx + s * (big ? 22 : 16) * u, cy + (big ? 10 : 15) * u], big ? 5.8 * u : 4.5 * u, 1.8 * u, o.moustache);
  }
  if (expr === "nervous") p.ell(cx + 38 * u * (facing || 1), cy - 18 * u, 3.4 * u, 5.8 * u, "#9fd4ff", 2 * u);
};

const faceSide = (p: Pen, hx: number, hy: number, W: number, expr: Expr, lid: number, o: Outfit) => {
  const u = W / 100, F = FACE[expr], ex = hx + 27 * u, ey = hy, skin = o.skin ?? SKIN;
  const kind = eyeKind(F.eye[1], lid);
  eye(p, kind, ex, ey, u, 1, 0.6, skin);
  const by = ey - 19 * u, [dI, dO] = F.brow;
  if (kind === "shock" || kind === "shockHalf") p.arc(ex, by - 6 * u, 9 * u, 3 * u, 200, 340, 4 * u);
  else taper(p, [ex + 8 * u, by + dI * u], [ex - 7 * u, by - u + dO * u], 4.8 * u, 2.4 * u);
  p.stroke([[hx + 44 * u, hy + 4 * u], [hx + 47.5 * u, hy + 9 * u], [hx + 43 * u, hy + 10 * u]], 3 * u);
  mouth(p, F.mouth, hx + 33 * u, hy + 21 * u, u, 0.62);
  if (o.moustache) taper(p, [hx + 42 * u, hy + 13.5 * u], [hx + 22 * u, hy + 11.5 * u], 5.6 * u, 1.8 * u, o.moustache);
  if (expr === "nervous") p.ell(hx - 28 * u, hy - 22 * u, 3.4 * u, 5.8 * u, "#9fd4ff", 2 * u);
};

// ---------------- Bodies ----------------
export type Prop = null | "map" | "paddle" | "lantern" | "clipboard" | "phone" | "clapper" | "riceBowl";
export type FrontMode = "walk" | "run" | "stand" | "sit" | "point" | "shrug" | "refuse" | "wave" | "offer";

const BUILD: Record<Build, { a: number; torso: number; legs: number; tw: number }> = {
  adult: { a: 118, torso: 1.10, legs: 1.40, tw: 0.80 },
  stout: { a: 118, torso: 1.15, legs: 1.32, tw: 0.94 },
  elder: { a: 114, torso: 1.06, legs: 1.30, tw: 0.78 },
  kid:   { a: 112, torso: 0.92, legs: 1.18, tw: 0.74 },
};

export type FrontOpts = {
  phase?: number;
  expr?: Expr;
  mode?: FrontMode;
  look?: number;
  blink?: boolean | number;
  prop?: Prop;
  tilt?: number;
  headTilt?: number;
  light?: number;
  facing?: -1 | 0 | 1;
  seed?: number;
};

const footStroke = (p: Pen, a: P2, b: P2, w: number, col: string) => {
  if (col !== INK) p.stroke([a, b], w + 3, INK);
  p.stroke([a, b], w, col);
};

const drawTorsoDetails = (p: Pen, o: Outfit, tcx: number, chin: number, torsoBot: number, HH: number, T: Blob, u: number, facing: number) => {
  if (o.barong) {
    // Iconic Philippine Barong Tagalog vertical embroidered chest panel (pure geometric embroidery!)
    p.poly(rrect(tcx - 20 * u, chin + 2 * u, tcx + 20 * u, torsoBot - 20 * u, 5 * u), "#efe3bd", 2.2 * u);
    p.stroke([[tcx, chin + 4 * u], [tcx, torsoBot - 22 * u]], 2.6 * u, "#c99b38");
    for (let k = 0; k < 4; k++) {
      const y = chin + 16 * u + k * 24 * u;
      p.poly([[tcx - 12 * u, y], [tcx, y - 8 * u], [tcx + 12 * u, y], [tcx, y + 8 * u]], "#e2ba4c", 1.6 * u);
    }
  }
  if (o.collar) {
    p.poly([[tcx - 16 * u, chin - 4 * u], [tcx + 16 * u, chin - 4 * u], [tcx + 2 * u * facing, chin + 24 * u]], o.collar, 2 * u);
  }
  if (o.tie) {
    p.poly([[tcx - 3 * u, chin + 10 * u], [tcx + 3 * u, chin + 10 * u], [tcx + 5.5 * u, torsoBot - 16 * u], [tcx, torsoBot - 6 * u], [tcx - 5.5 * u, torsoBot - 16 * u]], o.tie, 1.8 * u);
  }
  if (o.towel) {
    // Classic Pinoy jeepney driver white face towel draped over right shoulder
    p.poly(rrect(tcx + 12 * u, chin - 2 * u, tcx + 30 * u, torsoBot - 26 * u, 5 * u), "#f6f4ee", 2.5 * u);
    p.stroke([[tcx + 14 * u, torsoBot - 36 * u], [tcx + 28 * u, torsoBot - 36 * u]], 2.5 * u, "#c4342d");
  }
  if (o.sash) {
    p.poly([[tcx - T.a * 1.05, torsoBot - 22 * u], [tcx + T.a * 1.05, torsoBot - 22 * u], [tcx + T.a * 1.05, torsoBot - 4 * u], [tcx - T.a * 1.05, torsoBot - 4 * u]], o.sash, 2.2 * u);
  }
  if (!o.barong) {
    for (let i = 0; i < 3; i++) p.dot(tcx + 8 * u, chin + 0.30 * HH + i * 0.22 * HH, 2.6 * u, INK);
  }
};

export const bodyFront = (p: Pen, o: Outfit, opts: FrontOpts) => {
  const { phase = 0, expr = "neutral", mode = "stand", look = 0, blink = false, prop = null, tilt = 0, headTilt = 0,
    light = DEF_LIGHT, facing = 0, seed = 1 } = opts;
  const Bd = BUILD[o.build ?? "adult"], skin = o.skin ?? SKIN, two = Math.PI * 2, lid = lidOf(blink);
  const H = headBlob(seed, Bd.a, facing), W = 2 * H.a, HH = 2 * H.b, u = W / 100;
  const tall = (1 + Bd.torso + Bd.legs) * HH, sole = 975;
  const bob = mode === "walk" ? 0.022 * tall * Math.cos(2 * two * phase) : mode === "run" ? 0.035 * tall * Math.cos(2 * two * phase) : 0;
  const torsoBot = mode === "sit" ? sole - 0.22 * HH : sole - Bd.legs * HH + bob;
  const chin = torsoBot - Bd.torso * HH, hc = chin - H.b, hipY = torsoBot - 0.12 * HH;
  const thick = thickAngle(light), ow = 5 * u;
  const legCol = mix(o.pants, INK, 0.55), armCol = mix(o.jacket, INK, 0.5), footCol = o.boots;
  const legW = 5.8 * u, footW = 7.5 * u;

  // ---- legs ----
  p.rot = null;
  if (mode === "sit") {
    for (const side of [-1, 1]) {
      const h: P2 = [300 + side * 15 * u, hipY], k: P2 = [300 + side * 34 * u, hipY + 0.18 * HH], f: P2 = [300 + side * 38 * u, sole - 8 * u];
      p.stroke(curve(h, k, f), legW, legCol);
      footStroke(p, [f[0] - side * 2 * u, f[1]], [f[0] + side * 12 * u, f[1] - 3 * u], footW, footCol);
    }
  } else {
    const L = mode === "run" ? 64 : mode === "walk" ? 42 : 0;
    for (const [side, ph] of [[-1, 0], [1, 0.5]] as const) {
      const up = Math.max(0, Math.sin(two * (phase + ph))) * L;
      const hx = 300 + side * 15 * u, fx = 300 + side * (20 + (mode === "run" ? 12 : 0)) * u, fy = sole - 4 * u - up;
      const k: P2 = [(hx + fx) / 2 + side * (1.5 * u + up * 0.15), (hipY + fy) / 2 - up * 0.08];
      p.stroke(curve([hx, hipY], k, [fx, fy]), legW, legCol);
      footStroke(p, [fx - side * 3 * u, fy], [fx + side * 13 * u, fy + 0.5 * u], footW, footCol);
    }
  }

  // ---- upper body ----
  const sway = mode === "walk" ? 1.5 * Math.sin(two * phase) : mode === "run" ? 4.0 * Math.sin(two * phase) : 0;
  const A = tilt + sway;
  p.rot = A ? [rad(A), 300, hipY] : null;
  const T: Blob = {
    a: ((Bd.tw / 2) * W) / 1.06, b: 0.5 * (torsoBot - (chin - 0.25 * HH)),
    nTop: 2.2, nBot: 2.6, egg: o.build === "stout" ? 0.18 : 0.12, asym: 0.04 * facing, rot: 0, noise: 0.006, seed: seed + 7,
  };
  const tcx = 300 + 3 * u * facing, tcy = torsoBot - T.b, tp = blobPts(tcx, tcy, T);
  const sh = (side: number): P2 => [tcx + side * 0.85 * T.a, chin + 0.12 * HH];
  const hang = (side: number, fwd: number): [P2, P2, P2] => {
    const S = sh(side), ex = tcx + side * (1.12 * T.a + 4 * u);
    const hx = ex + side * 3 * u - side * 6 * u * Math.max(0, fwd) + side * 4 * u * Math.max(0, -fwd);
    return [S, [ex, S[1] + 0.48 * HH], [hx, chin + 1.04 * HH - Math.abs(fwd) * 9 * u]];
  };
  const sw = mode === "walk" || mode === "run" ? Math.sin(two * phase) : 0;

  type Arm = { pts: [P2, P2, P2]; front: boolean };
  const arms: Arm[] = [];
  if (mode === "shrug") {
    for (const side of [-1, 1]) {
      arms.push({ pts: [sh(side), [tcx + side * (1.18 * T.a + 14 * u), chin + 0.44 * HH], [tcx + side * (1.42 * T.a + 28 * u), chin + 0.12 * HH]], front: true });
    }
  } else if (mode === "refuse") {
    const w = 10 * u * Math.sin(two * phase * 2);
    for (const side of [-1, 1]) {
      arms.push({ pts: [sh(side), [tcx + side * (1.15 * T.a + 12 * u), chin + 0.28 * HH], [tcx + side * (1.30 * T.a + 24 * u) + w, chin - 0.14 * HH]], front: true });
    }
  } else if (mode === "wave") {
    const w = 16 * u * Math.sin(two * phase * 2);
    arms.push({ pts: hang(-1, 0), front: false });
    arms.push({ pts: [sh(1), [tcx + 1.20 * T.a + 18 * u, chin + 0.08 * HH], [tcx + 1.34 * T.a + 28 * u + w, chin - 0.30 * HH]], front: true });
  } else if (mode === "point") {
    arms.push({ pts: hang(-1, 0), front: false });
    arms.push({ pts: [sh(1), [tcx + 1.18 * T.a + 20 * u, chin + 0.08 * HH], [tcx + 1.56 * T.a + 44 * u, chin - 0.08 * HH]], front: true });
  } else if (mode === "offer") {
    arms.push({ pts: [sh(-1), [tcx - 1.12 * T.a - 10 * u, chin + 0.44 * HH], [tcx - 0.36 * T.a, chin + 0.48 * HH]], front: true });
    arms.push({ pts: [sh(1), [tcx + 1.12 * T.a + 10 * u, chin + 0.44 * HH], [tcx + 0.36 * T.a, chin + 0.48 * HH]], front: true });
  } else if (prop === "map") {
    arms.push({ pts: [sh(-1), [tcx - 1.12 * T.a - 10 * u, chin + 0.42 * HH], [tcx - 0.54 * T.a, chin + 0.36 * HH]], front: true });
    arms.push({ pts: [sh(1), [tcx + 1.12 * T.a + 10 * u, chin + 0.42 * HH], [tcx + 0.54 * T.a, chin + 0.36 * HH]], front: true });
  } else if (prop === "lantern" || prop === "clipboard" || prop === "phone" || prop === "clapper") {
    arms.push({ pts: hang(-1, 0), front: false });
    arms.push({ pts: [sh(1), [tcx + 1.16 * T.a + 16 * u, chin + 0.34 * HH], [tcx + 1.10 * T.a + 28 * u, chin + 0.14 * HH]], front: true });
  } else if (prop === "paddle") {
    arms.push({ pts: [sh(-1), [tcx - 0.9 * T.a - 10 * u, chin + 0.44 * HH], [tcx - 0.18 * T.a, chin + 0.46 * HH]], front: true });
    arms.push({ pts: [sh(1), [tcx + 1.05 * T.a + 10 * u, chin + 0.46 * HH], [tcx + 0.65 * T.a, chin + 0.54 * HH]], front: true });
  } else if (mode === "sit") {
    for (const side of [-1, 1]) arms.push({ pts: [sh(side), [tcx + side * (1.08 * T.a + 8 * u), sh(side)[1] + 0.36 * HH], [tcx + side * (0.72 * T.a), torsoBot - 0.05 * HH]], front: true });
  } else {
    arms.push({ pts: hang(-1, -sw), front: false });
    arms.push({ pts: hang(1, sw), front: false });
  }

  const drawArm = (a: Arm) => { p.stroke(curve(a.pts[0], a.pts[1], a.pts[2]), 5.2 * u, armCol); p.dot(a.pts[2][0], a.pts[2][1], 5.5 * u); };
  for (const a of arms) if (!a.front) drawArm(a);

  // ---- Baro't Saya skirt or regular torso ----
  if (o.saya && mode !== "sit") {
    const D: Blob = { a: 0.44 * W, b: 0.5 * ((sole - 0.36 * HH) - (torsoBot - 0.2 * HH)), nTop: 2.0, nBot: 2.8, egg: 0.25, asym: 0.02 * facing, rot: 0, noise: 0.006, seed: seed + 11 };
    const dp = blobPts(tcx, sole - 0.36 * HH - D.b, D);
    p.gradFill(dp, o.saya, mul(o.saya, SH_CLOTH), light);
    p.inkRing(dp, ow, thick);
  }
  p.gradFill(tp, o.jacket, mul(o.jacket, SH_CLOTH), light);
  p.clip(tp, () => drawTorsoDetails(p, o, tcx, chin, torsoBot, HH, T, u, facing));
  p.inkRing(tp, ow, thick);

  // ---- front arms & held props ----
  const drawHeldProp = (hx: number, hy: number) => {
    if (prop === "map") {
      // Unfolded parchment map with green Samar silhouette & empty red circle (ZERO text!)
      p.poly([[tcx - 42 * u, hy - 28 * u], [tcx + 42 * u, hy - 24 * u], [tcx + 46 * u, hy + 28 * u], [tcx - 46 * u, hy + 24 * u]], "#f4e7c6", 3.4 * u);
      p.ell(tcx, hy, 18 * u, 14 * u, "#82bc66", 2.2 * u);
      p.ell(tcx + 4 * u, hy + 2 * u, 9 * u, 9 * u, null, 2.5 * u);
    } else if (prop === "lantern") {
      p.stroke([[hx, hy], [hx + 6 * u, hy + 10 * u]], 2.8 * u, INK);
      p.poly(rrect(hx - 10 * u, hy + 10 * u, hx + 22 * u, hy + 46 * u, 5 * u), "#ffdc78", 3 * u);
      p.ell(hx + 6 * u, hy + 28 * u, 7 * u, 10 * u, "#fff8d4", 0);
      p.poly([[hx - 14 * u, hy + 10 * u], [hx + 6 * u, hy - 2 * u], [hx + 26 * u, hy + 10 * u]], "#5c4330", 3 * u);
    } else if (prop === "clipboard") {
      p.poly(rrect(hx - 14 * u, hy - 28 * u, hx + 20 * u, hy + 18 * u, 4 * u), "#94643b", 3 * u);
      p.poly(rrect(hx - 10 * u, hy - 22 * u, hx + 16 * u, hy + 14 * u, 2 * u), "#faf6ea", 2 * u);
      for (let k = 0; k < 3; k++) p.stroke([[hx - 5 * u, hy - 12 * u + k * 9 * u], [hx + 10 * u, hy - 12 * u + k * 9 * u]], 2.2 * u, "#48424c");
    } else if (prop === "paddle") {
      p.stroke([[tcx - 42 * u, hy - 18 * u], [tcx + 62 * u, hy + 38 * u]], 5.5 * u, "#946032");
      p.ell(tcx + 64 * u, hy + 40 * u, 18 * u, 8 * u, "#b2763c", 3 * u, 0, 360, 28);
    } else if (prop === "phone") {
      p.poly(rrect(hx - 8 * u, hy - 18 * u, hx + 14 * u, hy + 12 * u, 4 * u), "#2a3040", 2.8 * u);
      p.poly(rrect(hx - 5 * u, hy - 14 * u, hx + 11 * u, hy + 8 * u, 2 * u), "#7ee0ff", 0);
    } else if (prop === "clapper") {
      p.poly(rrect(hx - 20 * u, hy - 20 * u, hx + 24 * u, hy + 14 * u, 3 * u), "#24242c", 3 * u);
      p.poly([[hx - 20 * u, hy - 22 * u], [hx + 22 * u, hy - 34 * u], [hx + 24 * u, hy - 24 * u], [hx - 18 * u, hy - 12 * u]], "#f4f2ec", 2.8 * u);
    } else if (prop === "riceBowl") {
      // Gleaming white ceramic bowl heaped with glossy pitch-black rice!
      p.ell(tcx, hy - 10 * u, 26 * u, 16 * u, "#1b1822", 3.2 * u);
      p.ell(tcx, hy - 14 * u, 20 * u, 10 * u, "#2c2838", 0);
      p.poly([[tcx - 30 * u, hy - 6 * u], [tcx + 30 * u, hy - 6 * u], [tcx + 20 * u, hy + 18 * u], [tcx - 20 * u, hy + 18 * u]], "#faf7f0", 3.4 * u);
      p.stroke([[tcx - 24 * u, hy + 2 * u], [tcx + 24 * u, hy + 2 * u]], 2.5 * u, "#d4a63e");
    }
  };

  let propDrawn = false;
  for (const a of arms) if (a.front) {
    drawArm(a);
    if (!propDrawn && prop) {
      drawHeldProp(a.pts[2][0], a.pts[2][1]);
      p.dot(a.pts[2][0], a.pts[2][1], 5.5 * u);
      propDrawn = true;
    }
  }

  // ---- head ----
  const Ah = A + headTilt, [cpx, cpy] = rotAbout([300, chin], rad(A), [300, hipY]);
  p.rot = Ah ? [rad(Ah), 300, chin, cpx - 300, cpy - chin] : null;
  const hp = blobPts(300, hc, H);
  p.shadedFill(hp, skin, mul(skin, SH_SKIN), light, H.a);
  p.inkRing(hp, ow, thick);
  drawHat(p, o, hp, H, 300, hc, light, facing, false);
  faceFront(p, 300, hc, W, expr, facing, look, lid, o);
};

export type SideOpts = {
  phase?: number;
  expr?: Expr;
  mode?: "walk" | "run" | "stand";
  blink?: boolean | number;
  lean?: number;
  headTilt?: number;
  light?: number;
  seed?: number;
};

export const bodySide = (p: Pen, o: Outfit, opts: SideOpts) => {
  const { phase = 0, expr = "neutral", mode = "walk", blink = false, lean = 4, headTilt = 0, light = DEF_LIGHT, seed = 1 } = opts;
  const Bd = BUILD[o.build ?? "adult"], skin = o.skin ?? SKIN, two = Math.PI * 2, lid = lidOf(blink);
  const H = headBlob(seed, Bd.a, 1), W = 2 * H.a, HH = 2 * H.b, u = W / 100;
  const tall = (1 + Bd.torso + Bd.legs) * HH, sole = 975;
  const stride = mode === "run" ? 0.56 * HH : mode === "walk" ? 0.36 * HH : 0;
  const lift = mode === "run" ? 0.28 * HH : mode === "walk" ? 0.16 * HH : 0;
  const bob = mode === "stand" ? 0 : (mode === "run" ? 0.036 : 0.022) * tall * Math.cos(2 * two * phase);
  const torsoBot = sole - Bd.legs * HH + bob;
  const chin = torsoBot - Bd.torso * HH, hc = chin - H.b, hipY = torsoBot - 0.1 * HH;
  const thick = thickAngle(light), ow = 5 * u;
  const legCol = mix(o.pants, INK, 0.55), armCol = mix(o.jacket, INK, 0.5), footCol = o.boots;
  const legW = 5.8 * u, footW = 7.6 * u;

  p.rot = null;
  for (const ph of [0.5, 0]) {
    const a = Math.sin(two * (phase + ph));
    const up = Math.max(0, Math.cos(two * (phase + ph))) * lift;
    const fx = 300 + a * stride, fy = sole - 4 * u - up;
    const kx = (300 + fx) / 2 + 12 * u + up * 0.22, ky = (hipY + fy) / 2 - up * 0.14;
    p.stroke(curve([300, hipY], [kx, ky], [fx, fy]), legW, legCol);
    footStroke(p, [fx - 4 * u, fy], [fx + 16 * u, fy + 0.5 * u], footW, footCol);
  }

  const A = lean + (mode === "run" ? 8 : 0);
  p.rot = A ? [rad(A), 300, hipY] : null;
  const T: Blob = { a: 0.33 * W, b: 0.5 * (torsoBot - (chin - 0.25 * HH)), nTop: 2.2, nBot: 2.6, egg: 0.12, asym: 0.05, rot: 0, noise: 0.006, seed: seed + 7 };
  const tcy = torsoBot - T.b, tp = blobPts(300, tcy, T);
  const sw = mode === "stand" ? 0 : Math.sin(two * phase);
  const arm = (dir: number): [P2, P2, P2] => {
    const S: P2 = [300, chin + 0.14 * HH];
    const ex = 300 + dir * (mode === "run" ? 36 : 22) * u;
    const ey = S[1] + 0.42 * HH;
    const hx = ex + (mode === "run" ? 28 : 16) * u + dir * 18 * u;
    const hy = ey + (mode === "run" ? -10 : 24) * u;
    return [S, [ex, ey], [hx, hy]];
  };
  const backA = arm(-sw), frontA = arm(sw);
  p.stroke(curve(backA[0], backA[1], backA[2]), 5.2 * u, armCol); p.dot(backA[2][0], backA[2][1], 5.5 * u);

  p.gradFill(tp, o.jacket, mul(o.jacket, SH_CLOTH), light);
  p.clip(tp, () => drawTorsoDetails(p, o, 300, chin, torsoBot, HH, T, u, 1));
  p.inkRing(tp, ow, thick);

  p.stroke(curve(frontA[0], frontA[1], frontA[2]), 5.2 * u, armCol); p.dot(frontA[2][0], frontA[2][1], 5.5 * u);

  const Ah = A + headTilt, [cpx, cpy] = rotAbout([300, chin], rad(A), [300, hipY]);
  p.rot = Ah ? [rad(Ah), 300, chin, cpx - 300, cpy - chin] : null;
  const hp = blobPts(300, hc, H);
  p.shadedFill(hp, skin, mul(skin, SH_SKIN), light, H.a);
  p.inkRing(hp, ow, thick);
  drawHat(p, o, hp, H, 300, hc, light, 1, true);
  faceSide(p, 300, hc, W, expr, lid, o);
};

// ---------------- 2D Cartoon FX Cards (NOINK layer, ZERO text!) ----------------
export const fxContact = (p: Pen, hex: string, alpha = 0.5) => {
  const g = p.g;
  g.fillStyle = "#ffffff"; g.fillRect(0, 0, 256, 256);
  const n = parseInt(hex.slice(1), 16), r = (n >> 16) & 255, gr = (n >> 8) & 255, b = n & 255;
  const rg = g.createRadialGradient(128, 128, 12, 128, 128, 120);
  rg.addColorStop(0, `rgba(${r},${gr},${b},${alpha})`);
  rg.addColorStop(0.55, `rgba(${r},${gr},${b},${alpha * 0.65})`);
  rg.addColorStop(1, `rgba(${r},${gr},${b},0)`);
  g.fillStyle = rg; g.fillRect(0, 0, 256, 256);
};

export const fxShadow = (p: Pen, hex: string) => {
  const g = p.g;
  g.fillStyle = "#ffffff"; g.fillRect(0, 0, 256, 256);
  const n = parseInt(hex.slice(1), 16), r = (n >> 16) & 255, gr = (n >> 8) & 255, b = n & 255;
  const rg = g.createRadialGradient(128, 128, 16, 128, 128, 118);
  rg.addColorStop(0, `rgba(${r},${gr},${b},0.34)`);
  rg.addColorStop(1, `rgba(${r},${gr},${b},0)`);
  g.fillStyle = rg; g.fillRect(0, 0, 256, 256);
};

/** 4-point mystical golden/cyan Biringan star sparkle */
export const fxSparkle = (p: Pen, col = "#ffe48a", rim = "#f4a836") => {
  const pts: P2[] = [];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const r = i % 2 === 0 ? 112 : 28;
    pts.push([128 + Math.cos(a) * r, 128 + Math.sin(a) * r]);
  }
  p.poly(pts, col, 7);
  p.ell(128, 128, 22, 22, "#ffffff", 0);
  p.dot(52, 54, 12, rim);
  p.dot(204, 198, 10, rim);
};

/** Soft glowing golden firefly orb */
export const fxFirefly = (p: Pen, col = "#ffe488") => {
  const g = p.g;
  const rg = g.createRadialGradient(128, 128, 6, 128, 128, 110);
  rg.addColorStop(0, "#ffffff");
  rg.addColorStop(0.28, col);
  rg.addColorStop(1, "rgba(255,210,90,0)");
  g.fillStyle = rg; g.fillRect(0, 0, 256, 256);
};

/** Stylized magical POOF vanish ring & cloud when Biringan disappears */
export const fxVanishPoof = (p: Pen) => {
  const g = p.g;
  const circles: [number, number, number][] = [[82, 136, 46], [174, 138, 44], [128, 86, 54], [128, 168, 46], [56, 102, 32], [200, 104, 30]];
  g.fillStyle = "#364c78";
  for (const [x, y, r] of circles) { g.beginPath(); g.arc(x, y, r + 6, 0, Math.PI * 2); g.fill(); }
  g.fillStyle = "#dcf8ff";
  for (const [x, y, r] of circles) { g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill(); }
  // Inner golden sparkle burst
  const pts: P2[] = [];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const r = i % 2 === 0 ? 54 : 16;
    pts.push([128 + Math.cos(a) * r, 128 + Math.sin(a) * r]);
  }
  p.poly(pts, "#ffe48a", 4);
};

/** Cartoon mechanical crash sparks for San Jorge mining mishap */
export const fxSparks = (p: Pen) => {
  const pts: P2[] = [], pts2: P2[] = [];
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2;
    const r = i % 2 ? 38 : 112;
    pts.push([128 + Math.cos(a) * r, 128 + Math.sin(a) * r]);
    pts2.push([128 + Math.cos(a) * r * 0.56, 128 + Math.sin(a) * r * 0.56]);
  }
  p.poly(pts, "#ff8e26", 7);
  p.poly(pts2, "#fff5b8", 0);
};

/** Cartoon smoke/dust puff */
export const fxPuff = (p: Pen, col = "#dedcd4", rim = "#4a4452") => {
  const g = p.g;
  const circles: [number, number, number][] = [[96, 142, 48], [158, 144, 46], [128, 102, 54], [74, 118, 36], [180, 118, 36]];
  g.fillStyle = rim;
  for (const [x, y, r] of circles) { g.beginPath(); g.arc(x, y, r + 6, 0, Math.PI * 2); g.fill(); }
  g.fillStyle = col;
  for (const [x, y, r] of circles) { g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill(); }
};

/** Viral floating social chat bubble with graphic heart/star/dots (ZERO text!) */
export const fxChatIcon = (p: Pen, variant = 0) => {
  const bg = variant === 0 ? "#ffffff" : variant === 1 ? "#ffe9a8" : "#d8f4ff";
  p.poly(rrect(26, 44, 230, 176, 36), bg, 8);
  p.poly([[72, 174], [52, 224], [116, 174]], bg, 8);
  p.poly([[70, 166], [118, 166], [114, 180], [72, 180]], bg, 0);
  if (variant === 0) {
    // 3 lively chat typing dots
    for (const dx of [-44, 0, 44]) p.ell(128 + dx, 110, 15, 15, "#3a6ea5", 4);
  } else if (variant === 1) {
    // Golden star icon
    const pts: P2[] = [];
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
      const r = i % 2 === 0 ? 48 : 22;
      pts.push([128 + Math.cos(a) * r, 112 + Math.sin(a) * r]);
    }
    p.poly(pts, "#f09c24", 5);
  } else {
    // Crimson heart icon
    p.ell(104, 100, 26, 26, "#dc3842", 5);
    p.ell(152, 100, 26, 26, "#dc3842", 5);
    p.poly([[80, 108], [176, 108], [128, 158]], "#dc3842", 5);
    p.poly([[86, 104], [170, 104], [128, 148]], "#dc3842", 0);
  }
};

/** Shimmering vertical heat-wave ripples rising above hot highway */
export const fxHeatWave = (p: Pen, phase = 0) => {
  for (let col = 0; col < 3; col++) {
    const cx = 64 + col * 64;
    const pts: P2[] = [];
    for (let i = 0; i <= 14; i++) {
      const u = i / 14;
      pts.push([cx + Math.sin(u * Math.PI * 3 + phase * Math.PI * 2 + col * 1.4) * 14, 232 - u * 204]);
    }
    p.stroke(pts, 11, "rgba(255,250,224,0.72)");
    p.stroke(pts, 5, "rgba(130,210,255,0.68)");
  }
};

/** Eerie silver-violet steam wisps curling up from the bowl of black rice */
export const fxSteam = (p: Pen, phase = 0) => {
  for (let col = 0; col < 3; col++) {
    const cx = 74 + col * 54;
    const pts: P2[] = [];
    for (let i = 0; i <= 14; i++) {
      const u = i / 14;
      pts.push([cx + Math.sin(u * Math.PI * 2.5 + phase * Math.PI * 2 + col * 1.9) * 16, 236 - u * 208]);
    }
    p.stroke(pts, 14, "rgba(192,168,236,0.45)");
    p.stroke(pts, 7, "rgba(248,242,255,0.75)");
  }
};

/** Stylized pure-graphic mystery compass swirl (ZERO text!) */
export const fxCompassGlow = (p: Pen) => {
  p.ell(128, 128, 92, 92, "rgba(255,232,148,0.34)", 0);
  p.ell(128, 128, 72, 72, "#fbf3da", 7);
  p.poly([[128, 66], [146, 128], [110, 128]], "#d43832", 5);
  p.poly([[128, 190], [146, 128], [110, 128]], "#2a3b58", 5);
  p.ell(128, 128, 12, 12, "#e8bc42", 4);
};

// ---------------- Pinoy Big Brother (Kuya) Cast Outfits ----------------
export const KUYA_SHADOW: Outfit = {
  jacket: "#1c2238", pants: "#141828", boots: "#10121e", skin: "#2b3048",
  hat: "sleek", hair: "#121524", collar: "#e6b842", tie: "#d63b36", build: "adult",
};
export const DIREK_LAUREN: Outfit = {
  jacket: "#2c3448", pants: "#242834", boots: "#1d1a22", skin: "#d6a076",
  hat: "sleek", hair: "#2b2830", collar: "#f5f2ea", glasses: true, build: "adult",
};
export const HOUSEMATE_A: Outfit = {
  jacket: "#e5a82e", pants: "#2e4876", boots: "#f2ece0", skin: "#d8a47a",
  hat: "cap", hatCol: "#c83832", collar: "#faf6ee", build: "adult",
};
export const HOUSEMATE_B: Outfit = {
  jacket: "#326cb8", pants: "#384256", boots: "#f0ece0", skin: "#cf986e",
  hat: "bob", hair: "#221a20", collar: "#f4eee0", build: "adult",
};
export const HOUSEMATE_C: Outfit = {
  jacket: "#d45848", pants: "#3a4454", boots: "#3a2c24", skin: "#dfa980",
  hat: "bun", hair: "#241b22", collar: "#faf2e4", build: "adult",
};
export const HOUSEMATE_D: Outfit = {
  jacket: "#3d8c78", pants: "#36404e", boots: "#322824", skin: "#c89066",
  hat: "sleek", hair: "#20191e", collar: "#f4f0e4", build: "adult",
};
export const PRODUCER_A: Outfit = {
  jacket: "#485672", pants: "#2c3240", boots: "#221e26", skin: "#d29c72",
  hat: "sleek", hair: "#221c22", glasses: true, collar: "#ece8de", build: "adult",
};
export const PRODUCER_B: Outfit = {
  jacket: "#6e4e7a", pants: "#2e3240", boots: "#242028", skin: "#dca87e",
  hat: "bun", hair: "#241d24", collar: "#f2ece0", build: "adult",
};
export const SOUND_TECH: Outfit = {
  jacket: "#384858", pants: "#2a303c", boots: "#201e24", skin: "#c99268",
  hat: "cap", hatCol: "#366ea6", build: "stout",
};
export const FAN_VIEWER: Outfit = {
  jacket: "#e07246", pants: "#3b5882", boots: "#f0ebe0", skin: "#d49e74",
  hat: "none", hair: "#241c20", collar: "#f8f2e4", build: "adult",
};
export const PANGANAY_KUYA: Outfit = {
  jacket: "#efe6d0", pants: "#36547c", boots: "#4a3424", skin: "#cf976b",
  hat: "sleek", hair: "#221a1e", collar: "#d8cbb2", build: "adult",
};
export const BUNSO_KID: Outfit = {
  jacket: "#db5a46", pants: "#3c587c", boots: "#f2eee2", skin: "#d9a47a",
  hat: "cap", hatCol: "#e6b43c", build: "kid",
};

// ---------------- PBB Kuya Custom 2D FX Cards (ZERO text!) ----------------

/** Expanding crimson CCTV alert radar rings when whispers are caught */
export const fxRadarRing = (p: Pen, phase = 0) => {
  const g = p.g;
  for (let i = 0; i < 3; i++) {
    const t = (phase + i / 3) % 1;
    const rad = 22 + t * 96;
    g.strokeStyle = `rgba(235, 56, 52, ${(1 - t) * 0.9})`;
    g.lineWidth = 10 - t * 6;
    g.beginPath(); g.arc(128, 128, rad, 0, Math.PI * 2); g.stroke();
  }
  p.ell(128, 128, 18, 18, "#ff3b36", 5);
};

/** Warm golden-amber advice sound waves emanating from Kuya's speaker */
export const fxAdviceWave = (p: Pen, phase = 0) => {
  const g = p.g;
  for (let i = 0; i < 3; i++) {
    const t = (phase + i / 3) % 1;
    const rad = 28 + t * 88;
    g.strokeStyle = `rgba(255, 212, 102, ${(1 - t) * 0.88})`;
    g.lineWidth = 11 - t * 6;
    g.beginPath(); g.arc(128, 128, rad, -Math.PI * 0.4, Math.PI * 0.4); g.stroke();
    g.beginPath(); g.arc(128, 128, rad, Math.PI * 0.6, Math.PI * 1.4); g.stroke();
  }
  p.ell(128, 128, 22, 22, "#ffe388", 5);
};

/** Cartoon sweat drops for exhausted Direk Lauren ("imposible 24/7!") */
export const fxSweat = (p: Pen) => {
  for (const [cx, cy, sc] of [[86, 98, 1.0], [164, 72, 0.78], [144, 166, 0.85]]) {
    const pts: P2[] = [
      [cx, cy - 42 * sc],
      [cx + 24 * sc, cy + 8 * sc],
      [cx + 16 * sc, cy + 32 * sc],
      [cx, cy + 38 * sc],
      [cx - 16 * sc, cy + 32 * sc],
      [cx - 24 * sc, cy + 8 * sc],
    ];
    p.poly(pts, "#8fd6ff", 7);
    p.ell(cx - 6 * sc, cy + 12 * sc, 5 * sc, 9 * sc, "#ffffff", 0);
  }
};

/** Pure-graphic magnifying glass badge (rumor / mystery speculation — ZERO text!) */
export const fxMagnify = (p: Pen) => {
  p.stroke([[154, 154], [214, 214]], 24, INK);
  p.stroke([[154, 154], [212, 212]], 13, "#d49a3a");
  p.ell(108, 108, 66, 66, "#d9f0ff", 10);
  p.ell(86, 86, 16, 24, "rgba(255,255,255,0.75)", 0);
};

/** Joyful golden/coral laugh-burst stars when Kuya holds back laughter */
export const fxLaughBurst = (p: Pen) => {
  const stars: [number, number, number, string][] = [
    [128, 118, 56, "#ffd858"],
    [66, 72, 28, "#ff9652"],
    [194, 80, 30, "#76d6ff"],
    [82, 184, 24, "#ff7888"],
    [186, 178, 26, "#ffe88a"],
  ];
  for (const [cx, cy, R, col] of stars) {
    const pts: P2[] = [];
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const r = i % 2 === 0 ? R : R * 0.34;
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
    p.poly(pts, col, 6);
  }
};

/** Soft whispering squiggle arcs between two housemates */
export const fxWhisperWave = (p: Pen, phase = 0) => {
  for (let row = 0; row < 3; row++) {
    const y0 = 84 + row * 44;
    const pts: P2[] = [];
    for (let i = 0; i <= 12; i++) {
      const u = i / 12;
      pts.push([40 + u * 176, y0 + Math.sin(u * Math.PI * 4 + phase * Math.PI * 2 + row) * 10]);
    }
    p.stroke(pts, 11, INK);
    p.stroke(pts, 5, "#d4e8ff");
  }
};

/** Bold graphic red X mark for strict PBB rules / forced eviction beat (no text) */
export const fxRedX = (p: Pen) => {
  p.stroke([[58, 58], [198, 198]], 34, INK);
  p.stroke([[198, 58], [58, 198]], 34, INK);
  p.stroke([[58, 58], [198, 198]], 20, "#e23836");
  p.stroke([[198, 58], [58, 198]], 20, "#e23836");
};

/** Warm floating heart glow for Kuya's caring / panganay beats */
export const fxHeartGlow = (p: Pen) => {
  p.ell(128, 128, 98, 98, "rgba(255,212,130,0.34)", 0);
  p.ell(98, 102, 34, 34, "#e64652", 7);
  p.ell(158, 102, 34, 34, "#e64652", 7);
  p.poly([[68, 114], [188, 114], [128, 184]], "#e64652", 7);
  p.poly([[76, 108], [180, 108], [128, 172]], "#e64652", 0);
};

// ---------------- Adobong Manok Cast Outfits ----------------
export const NINUNO_COOK: Outfit = {
  jacket: "#e8d6b2", pants: "#8e442c", boots: "#5a3a24", skin: "#c88d5e",
  hat: "bandana", hatCol: "#c23b2b", hair: "#20181c", collar: "#c8944a", build: "adult",
};
export const NINUNO_WOMAN: Outfit = {
  jacket: "#f2e5c8", pants: "#7a3b2a", boots: "#583a24", skin: "#d2986a",
  hat: "bun", hair: "#1e161a", saya: "#b84434", collar: "#e6b858", build: "adult",
};
export const NINUNO_VILLAGER: Outfit = {
  jacket: "#5b8e5a", pants: "#6a4c36", boots: "#4d3424", skin: "#c99062",
  hat: "salakot", hatCol: "#d8b26a", build: "adult",
};
export const PADRE_PEDRO: Outfit = {
  jacket: "#5c402c", pants: "#463020", boots: "#2e1e14", skin: "#ecc3a4",
  hat: "none", hair: "#5a483a", collar: "#e6dcc8", glasses: true, build: "stout",
};
export const CHINESE_MERCHANT: Outfit = {
  jacket: "#b83028", pants: "#2c3448", boots: "#221e26", skin: "#e6ba94",
  hat: "salakot", hatCol: "#caa054", collar: "#eab842", build: "adult",
};
export const HISTORIAN: Outfit = {
  jacket: "#48647c", pants: "#323c4c", boots: "#2c2220", skin: "#d49c70",
  hat: "sleek", hair: "#262024", glasses: true, collar: "#f5efe2", build: "adult",
};
export const BICOL_COOK: Outfit = {
  jacket: "#d85a3a", pants: "#3a4c64", boots: "#3c2c24", skin: "#cf966a",
  hat: "bun", hair: "#221a1e", saya: "#346e54", collar: "#f4ebd8", build: "adult",
};
export const BATANGAS_COOK: Outfit = {
  jacket: "#e0a430", pants: "#425068", boots: "#3a2a20", skin: "#c88d60",
  hat: "bandana", hatCol: "#2e6494", hair: "#221a1e", collar: "#f8f0dc", build: "stout",
};
export const NANAY_COOK: Outfit = {
  jacket: "#d65258", pants: "#3c4e6c", boots: "#443028", skin: "#d69e74",
  hat: "bun", hair: "#241b20", saya: "#f6eee0", collar: "#f8e8cc", build: "adult",
};
export const TATAY_HOME: Outfit = {
  jacket: "#3c729e", pants: "#4a443c", boots: "#382a22", skin: "#c88e62",
  hat: "sleek", hair: "#241e22", collar: "#edf2f6", build: "adult",
};
export const ATE_KID: Outfit = {
  jacket: "#e89438", pants: "#3a5c88", boots: "#f2ece0", skin: "#daa47c",
  hat: "bob", hair: "#22191e", collar: "#fff6e6", build: "kid",
};

// ---------------- Adobong Manok Custom 2D FX Cards (ZERO text!) ----------------

/** Warm savory golden-ivory aroma curls rising from a simmering palayok */
export const fxAromaSteam = (p: Pen, phase = 0) => {
  for (let col = 0; col < 3; col++) {
    const cx = 68 + col * 60;
    const pts: P2[] = [];
    for (let i = 0; i <= 14; i++) {
      const u = i / 14;
      pts.push([cx + Math.sin(u * Math.PI * 2.6 + phase * Math.PI * 2 + col * 1.7) * 18, 236 - u * 204]);
    }
    p.stroke(pts, 15, "rgba(255,222,150,0.48)");
    p.stroke(pts, 7, "rgba(255,252,240,0.82)");
  }
};

/** Golden vinegar droplets & splash ring */
export const fxVinegarSplash = (p: Pen, phase = 0) => {
  const bob = Math.sin(phase * Math.PI * 2) * 8;
  for (const [cx, cy, sc] of [[128, 118 + bob, 1.15], [74, 152 - bob * 0.7, 0.75], [184, 146 + bob * 0.6, 0.8]]) {
    const pts: P2[] = [
      [cx, cy - 42 * sc],
      [cx + 24 * sc, cy + 8 * sc],
      [cx + 18 * sc, cy + 32 * sc],
      [cx, cy + 40 * sc],
      [cx - 18 * sc, cy + 32 * sc],
      [cx - 24 * sc, cy + 8 * sc],
    ];
    p.poly(pts, "#f4d268", 7);
    p.ell(cx - 7 * sc, cy + 12 * sc, 6 * sc, 10 * sc, "#fffbe4", 0);
  }
};

/** Glossy dark soy sauce splash ribbon */
export const fxSoySplash = (p: Pen, phase = 0) => {
  const s = Math.sin(phase * Math.PI * 2) * 10;
  p.ell(128, 134, 62, 46, "#3b2016", 8);
  p.ell(112, 118, 22, 14, "#683c28", 0);
  p.ell(74, 88 + s, 18, 18, "#3b2016", 6);
  p.ell(182, 82 - s, 22, 22, "#3b2016", 6);
  p.ell(168, 178 + s * 0.5, 14, 14, "#3b2016", 5);
};

/** Comical green cartoon bacteria blob getting bounced away by vinegar */
export const fxBacteria = (p: Pen, phase = 0) => {
  const wobble = Math.sin(phase * Math.PI * 2) * 6;
  p.ell(128, 128 + wobble, 66, 56, "#6ec246", 8);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + phase * 1.4;
    p.ell(128 + Math.cos(a) * 68, 128 + wobble + Math.sin(a) * 58, 14, 14, "#88d85c", 6);
  }
  // Dizzy cartoon eyes
  p.ell(106, 122 + wobble, 13, 13, "#ffffff", 5);
  p.ell(150, 122 + wobble, 13, 13, "#ffffff", 5);
  p.dot(106, 122 + wobble, 5);
  p.dot(150, 122 + wobble, 5);
  p.arc(128, 152 + wobble, 18, 10, 200, 340, 6);
};

/** Radiant golden vinegar protection shield ring */
export const fxShieldRing = (p: Pen, phase = 0) => {
  const g = p.g;
  for (let i = 0; i < 3; i++) {
    const t = (phase + i / 3) % 1;
    const rad = 34 + t * 84;
    g.strokeStyle = `rgba(255, 208, 86, ${(1 - t) * 0.92})`;
    g.lineWidth = 12 - t * 6;
    g.beginPath(); g.arc(128, 128, rad, 0, Math.PI * 2); g.stroke();
  }
  // Pure geometric shield silhouette (ZERO text!)
  p.poly([[128, 72], [174, 92], [166, 150], [128, 186], [90, 150], [82, 92]], "#ffe278", 7);
  p.poly([[128, 86], [160, 100], [154, 144], [128, 170], [102, 144], [96, 100]], "#fff6cc", 0);
};

/** Graphic mystery cloud puff (for the forgotten original Filipino name — ZERO text!) */
export const fxMysteryCloud = (p: Pen, phase = 0) => {
  const b = Math.sin(phase * Math.PI * 2) * 8;
  p.ell(96, 136 + b, 44, 38, "#dfd8e8", 7);
  p.ell(158, 138 - b, 42, 36, "#dfd8e8", 7);
  p.ell(128, 112 + b * 0.5, 52, 44, "#efeaf6", 7);
  p.ell(128, 136, 56, 36, "#efeaf6", 0);
  // Three soft floating dots inside cloud (pure graphic mystery icon, no text)
  p.ell(100, 126, 9, 9, "#6a5c88", 0);
  p.ell(128, 126, 9, 9, "#6a5c88", 0);
  p.ell(156, 126, 9, 9, "#6a5c88", 0);
};

