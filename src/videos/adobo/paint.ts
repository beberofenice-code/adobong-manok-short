// Hand-painted HD Canvas2D textures for "Sino Ba Talaga ang Nag-imbento ng Adobong Manok?".
// Storybook saturated hues (never neon, never lemon), painted dark seams, organic brushwork,
// and ZERO readable text or letters anywhere on screen.
import * as THREE from "three";

export const rng = (seed: number) => {
  let s = (seed * 9301 + 49297) % 233280 || 1;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
};

const cache = new Map<string, THREE.CanvasTexture>();
export const ctex = (key: string, w: number, h: number, draw: (g: CanvasRenderingContext2D, r: () => number) => void, repeat = true) => {
  let t = cache.get(key);
  if (!t) {
    const cv = document.createElement("canvas");
    cv.width = w; cv.height = h;
    let hseed = key.length * 131;
    for (let i = 0; i < key.length; i++) hseed = (hseed * 31 + key.charCodeAt(i)) % 233280;
    draw(cv.getContext("2d")!, rng(hseed));
    t = new THREE.CanvasTexture(cv);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 1;
    t.wrapS = t.wrapT = repeat ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
    cache.set(key, t);
  }
  return t;
};

export const rep = (t: THREE.Texture, x: number, y: number) => {
  const c = t.clone(); c.repeat.set(x, y); c.needsUpdate = true; return c;
};

const pick = <T,>(r: () => number, a: T[]) => a[Math.floor(r() * a.length) % a.length];
const _jc = new THREE.Color(), _hsl = { h: 0, s: 0, l: 0 };

export const jit = (r: () => number, hex: string, dv = 0.08, dh = 4, ds = 0.12) => {
  _jc.set(hex).getHSL(_hsl);
  const k = (a: number) => 1 + (r() * 2 - 1) * a;
  _jc.setHSL((_hsl.h + ((r() * 2 - 1) * dh) / 360 + 1) % 1, Math.min(1, _hsl.s * k(ds)), Math.min(0.95, _hsl.l * k(dv)));
  return "#" + _jc.getHexString();
};

/** Painted stucco / adobe stone wall with subtle brush texture & dark seams */
export const stuccoHD = (key: string, base: string, seam = "rgba(38,28,36,0.18)") =>
  ctex(key, 512, 512, (g, r) => {
    g.fillStyle = base; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 180; i++) {
      g.fillStyle = jit(r, base, 0.07, 4, 0.1);
      g.globalAlpha = 0.22 + r() * 0.22;
      g.beginPath();
      g.ellipse(r() * 512, r() * 512, 24 + r() * 68, 12 + r() * 34, (r() - 0.5) * 0.4, 0, Math.PI * 2);
      g.fill();
    }
    g.globalAlpha = 1;
    g.strokeStyle = seam; g.lineWidth = 3;
    for (let x = 128; x < 512; x += 128) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 512); g.stroke(); }
    for (let y = 128; y < 512; y += 128) { g.beginPath(); g.moveTo(0, y); g.lineTo(512, y); g.stroke(); }
  });

/** Woven bamboo sawali wall for traditional Filipino bahay kubo */
export const sawaliHD = (key = "sawali", base = "#c99b56", dark = "#785328") =>
  ctex(key, 512, 512, (g, r) => {
    g.fillStyle = dark; g.fillRect(0, 0, 512, 512);
    const step = 32;
    for (let y = 0; y < 512; y += step) {
      for (let x = 0; x < 512; x += step) {
        const horiz = ((x / step) + (y / step)) % 2 === 0;
        g.fillStyle = jit(r, base, 0.09, 3, 0.1);
        g.fillRect(x + 2, y + 2, step - 4, step - 4);
        g.strokeStyle = "rgba(70,44,18,0.28)";
        g.lineWidth = 2;
        if (horiz) {
          g.beginPath(); g.moveTo(x + 2, y + step * 0.5); g.lineTo(x + step - 2, y + step * 0.5); g.stroke();
        } else {
          g.beginPath(); g.moveTo(x + step * 0.5, y + 2); g.lineTo(x + step * 0.5, y + step - 2); g.stroke();
        }
      }
    }
  });

/** Nipa palm thatch roof texture */
export const nipaHD = (key = "nipa", base = "#9c7844") =>
  ctex(key, 512, 512, (g, r) => {
    g.fillStyle = "#6e522c"; g.fillRect(0, 0, 512, 512);
    for (let row = 0; row < 16; row++) {
      const y = row * 32;
      g.fillStyle = "rgba(44,30,16,0.35)";
      g.fillRect(0, y, 512, 4);
      for (let x = 0; x < 512; x += 6) {
        g.strokeStyle = jit(r, base, 0.14, 4, 0.14);
        g.lineWidth = 3;
        g.beginPath();
        g.moveTo(x, y);
        g.lineTo(x + (r() - 0.5) * 6, y + 32 + r() * 4);
        g.stroke();
      }
    }
  });

/** Painted stone / adobe courtyard pavement */
export const plazaStoneHD = (key = "plazaStone", base = "#b9ae9e", mortar = "#6e655c") =>
  ctex(key, 512, 512, (g, r) => {
    g.fillStyle = mortar; g.fillRect(0, 0, 512, 512);
    const cols = 4, rows = 8, cw = 512 / cols, rh = 512 / rows;
    for (let j = 0; j < rows; j++) {
      const ox = (j % 2) * (cw * 0.5);
      for (let i = -1; i <= cols; i++) {
        g.fillStyle = jit(r, base, 0.08, 3, 0.12);
        g.fillRect(i * cw + ox + 3, j * rh + 3, cw - 6, rh - 6);
      }
    }
    for (let i = 0; i < 400; i++) {
      g.fillStyle = r() < 0.5 ? "rgba(70,60,55,0.14)" : "rgba(245,238,225,0.14)";
      g.beginPath(); g.arc(r() * 512, r() * 512, 1.5 + r() * 3.5, 0, Math.PI * 2); g.fill();
    }
  });

/** Lush tropical grass & warm sandy earth */
export const grassHD = (key = "grassHD", base = "#589a44") =>
  ctex(key, 512, 512, (g, r) => {
    g.fillStyle = base; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 70; i++) {
      g.fillStyle = r() < 0.5 ? "rgba(44,98,34,0.22)" : "rgba(130,188,80,0.20)";
      g.beginPath(); g.ellipse(r() * 512, r() * 512, 30 + r() * 65, 22 + r() * 44, r() * 3, 0, Math.PI * 2); g.fill();
    }
    g.lineCap = "round";
    for (let i = 0; i < 1600; i++) {
      const x = r() * 512, y = r() * 512, len = 6 + r() * 10;
      g.strokeStyle = pick(r, ["#3c762b", "#6fb44c", "#4c8a38", "#80c05a"]);
      g.lineWidth = 2;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - 0.5) * 5, y - len); g.stroke();
    }
  });

/** Warm Filipino hardwood planks with dark painted seams */
export const woodPlanksHD = (key = "woodPlanks", base = "#c48446", dark = "#5e361c") =>
  ctex(key, 512, 512, (g, r) => {
    g.fillStyle = dark; g.fillRect(0, 0, 512, 512);
    const n = 8, h = 512 / n;
    for (let i = 0; i < n; i++) {
      g.fillStyle = jit(r, base, 0.08, 4, 0.12);
      g.fillRect(0, i * h + 2, 512, h - 4);
      g.strokeStyle = "rgba(85,46,20,0.20)"; g.lineWidth = 1.6;
      for (let k = 0; k < 5; k++) {
        const y = i * h + 8 + r() * (h - 16);
        g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(170, y - 4 + r() * 8, 340, y - 4 + r() * 8, 512, y); g.stroke();
      }
      const jx = Math.floor(r() * 4) * 128 + (i % 2) * 64;
      g.fillStyle = dark; g.fillRect(jx, i * h, 4, h);
    }
  });

/** Terracotta clay pot (palayok) painted surface */
export const clayPotHD = (key = "clayPot", base = "#b55836") =>
  ctex(key, 256, 256, (g, r) => {
    g.fillStyle = base; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 90; i++) {
      g.fillStyle = jit(r, base, 0.1, 4, 0.1);
      g.globalAlpha = 0.25;
      g.beginPath(); g.ellipse(r() * 256, r() * 256, 16 + r() * 40, 8 + r() * 18, 0, 0, Math.PI * 2); g.fill();
    }
    g.globalAlpha = 1;
    // Soot darkened base & subtle wheel-thrown grooves
    const gr = g.createLinearGradient(0, 140, 0, 256);
    gr.addColorStop(0, "rgba(28,18,14,0)");
    gr.addColorStop(1, "rgba(28,18,14,0.52)");
    g.fillStyle = gr; g.fillRect(0, 140, 256, 116);
    g.strokeStyle = "rgba(60,28,18,0.22)"; g.lineWidth = 2;
    for (let y = 16; y < 256; y += 22) { g.beginPath(); g.moveTo(0, y); g.lineTo(256, y); g.stroke(); }
  });

/** Glossy tropical banana leaf table runner */
export const bananaLeafHD = (key = "bananaLeaf") =>
  ctex(key, 512, 256, (g, r) => {
    g.fillStyle = "#3f8838"; g.fillRect(0, 0, 512, 256);
    g.fillStyle = "#66ad4a"; g.fillRect(0, 122, 512, 12);
    g.strokeStyle = "rgba(28,64,24,0.34)"; g.lineWidth = 3;
    for (let x = 0; x < 512; x += 24) {
      g.beginPath(); g.moveTo(x, 128); g.lineTo(x + 14, 0); g.stroke();
      g.beginPath(); g.moveTo(x, 128); g.lineTo(x + 14, 256); g.stroke();
    }
    for (let i = 0; i < 60; i++) {
      g.fillStyle = "rgba(148,205,98,0.16)";
      g.beginPath(); g.ellipse(r() * 512, r() * 256, 22 + r() * 34, 8 + r() * 12, 0, 0, Math.PI * 2); g.fill();
    }
  });

/** Tropical turquoise coastal sea water with painted wave ripples */
export const seaWaterHD = (key = "seaWater", base = "#328cb4") =>
  ctex(key, 512, 512, (g, r) => {
    g.fillStyle = base; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 90; i++) {
      g.strokeStyle = r() < 0.5 ? "rgba(180,235,250,0.32)" : "rgba(24,72,102,0.24)";
      g.lineWidth = 4;
      const x = r() * 440, y = r() * 512, w = 36 + r() * 56;
      g.beginPath();
      g.moveTo(x, y);
      g.quadraticCurveTo(x + w * 0.5, y - 6, x + w, y);
      g.stroke();
    }
  });

/** Warm Capiz-shell Filipino heritage window grid */
export const capizWindowHD = (key = "capizWindow") =>
  ctex(key, 256, 256, (g, r) => {
    g.fillStyle = "#5c3b24"; g.fillRect(0, 0, 256, 256);
    const step = 32;
    for (let y = 0; y < 256; y += step) {
      for (let x = 0; x < 256; x += step) {
        g.fillStyle = jit(r, "#f8e8c6", 0.06, 3, 0.08);
        g.fillRect(x + 3, y + 3, step - 6, step - 6);
        g.fillStyle = "rgba(255,252,240,0.45)";
        g.fillRect(x + 6, y + 6, step - 14, 8);
      }
    }
  });

/** Decorative 1613 open dictionary page (purely graphic lines + tiny pot sketch, ZERO readable text!) */
export const bookPageHD = (key = "bookPage") =>
  ctex(key, 256, 256, (g) => {
    g.fillStyle = "#f2e3c0"; g.fillRect(0, 0, 256, 256);
    g.strokeStyle = "#8a6840"; g.lineWidth = 6; g.strokeRect(10, 10, 236, 236);
    // Decorative ink squiggle bars (NOT letters)
    g.strokeStyle = "#4c3828"; g.lineWidth = 4; g.lineCap = "round";
    for (let y = 40; y <= 104; y += 16) {
      g.beginPath(); g.moveTo(32, y); g.lineTo(220, y); g.stroke();
    }
    // Small hand-drawn clay pot icon in center
    g.fillStyle = "#b55836";
    g.beginPath(); g.arc(128, 168, 30, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#2b1b24"; g.lineWidth = 5; g.stroke();
    g.fillStyle = "#d4764c"; g.fillRect(104, 134, 48, 12); g.strokeRect(104, 134, 48, 12);
    // Wavy steam lines
    g.strokeStyle = "#6e5440"; g.lineWidth = 3;
    for (const sx of [116, 128, 140]) {
      g.beginPath(); g.moveTo(sx, 128); g.quadraticCurveTo(sx - 5, 118, sx + 4, 110); g.stroke();
    }
  }, false);

/** Soft painted storybook clouds tinted per lighting mode */
export const cloudHD = (variant: number, cols: { lit: string; mid: string; shade: string }) =>
  ctex(`cloud_${variant}_${cols.lit}_${cols.mid}`, 512, 256, (g, r) => {
    g.clearRect(0, 0, 512, 256);
    const puffs = 6 + (variant % 3);
    for (let i = 0; i < puffs; i++) {
      const t = i / (puffs - 1);
      const cx = 85 + t * 342 + (r() - 0.5) * 26;
      const cy = 148 - Math.sin(t * Math.PI) * 52 + (r() - 0.5) * 18;
      const rx = 56 + Math.sin(t * Math.PI) * 40 + r() * 18;
      const ry = 42 + Math.sin(t * Math.PI) * 32 + r() * 12;
      const gr = g.createRadialGradient(cx, cy - ry * 0.25, rx * 0.1, cx, cy, rx);
      gr.addColorStop(0, cols.lit);
      gr.addColorStop(0.75, cols.mid);
      gr.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = gr;
      g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); g.fill();
    }
  }, false);
