// Master timeline, camera choreography, DOF table, kicks, and beat markers for
// "Sino Ba Talaga ang Nag-imbento ng Adobong Manok?" (Tagalog, ElevenLabs eleven_v4, 12 shots, 2300 frames = 76.67s @ 30fps).
// Every visual reaction lands 0-3 frames before its spoken word in voice/words.json.
import { LightMode } from "./lights";

export const FPS = 30;
export const TOTAL = 2300; // 76.67s (voice ends at 76.11s = f2286, +14f clean visual settle)

export type V3 = [number, number, number];
export type SetId =
  | "bahay_plaza"
  | "pre_1521_coast"
  | "palayok_hearth"
  | "white_adobo_table"
  | "spanish_convento"
  | "trade_harbor"
  | "lost_name_archive"
  | "vinegar_science"
  | "kitchen_fridge"
  | "regional_feast"
  | "pinoy_kitchen";

export type Shot = {
  id: number;
  a: number;
  b: number;
  light: LightMode;
  set: SetId;
  xfade?: number;
  sunAz?: number;
  sunEl?: number;
};

// ---------------- Frame-accurate beat markers (from voice/words.json, 0-3f lead) ----------------
export const F_ADOBONG_MANOK = 46;    // "adobong" f48
export const F_PILIPINO = 115;        // "Pilipino" f117
export const F_ESPANYOL = 167;        // "Espanyol." f169
export const F_1521 = 206;            // "1521," f208
export const F_NO_REF = 294;          // "refrigerator" f297
export const F_MAINIT = 326;          // "mainit" f328
export const F_MAPANIS = 390;         // "mapanis" f392
export const F_PALAYOK = 490;         // "palayok" f492
export const F_SUKA = 527;            // "suka," f529
export const F_BAWANG = 548;          // "bawang," f550
export const F_ASIN = 574;            // "asin." f576
export const F_WALANG_TOYO = 593;     // "toyo" f595
export const F_PUTI = 610;            // "noon—puti" f611
export const F_ARAW = 695;            // "araw" f697
export const F_1613 = 761;            // "1613," f763
export const F_NATIKMAN = 833;        // "natikman" f835
export const F_ADOBO_NAT = 952;       // "adobo" f954
export const F_ADOBAR = 1055;         // "adobar" f1057
export const F_TSINO = 1174;          // "Tsino" f1176
export const F_TOYO = 1189;           // "toyo," f1191
export const F_MAITIM = 1229;         // "maitim" f1231
export const F_MABUTI = 1293;         // "Mabuti" f1295
export const F_MASAMA = 1417;         // "Masama" f1419
export const F_NAKALIMUTAN = 1465;    // "nakalimutan" f1467
export const F_ASIDO = 1584;          // "asido" f1586
export const F_BAKTERYA = 1643;       // "bakterya" f1645
export const F_PINAPALAMBOT = 1670;   // "pinapalambot" f1672
export const F_FRIDGE = 1721;         // "refrigerator" f1723
export const F_YELO = 1777;           // "yelo," f1779
export const F_PANANGGA = 1814;       // "panangga" f1816
export const F_REG_PUTI = 1949;       // "puti," f1951
export const F_REG_GATA = 1967;       // "gata" f1969
export const F_REG_DILAW = 2010;      // "dilaw" f2012
export const F_IMBENTOR = 2084;       // "imbentor" f2086
export const F_KUSINA = 2171;         // "kusinang" f2173
export const F_NANAY = 2261;          // "nanay" f2263

export const SHOTS: Shot[] = [
  { id: 1,  a: 0,    b: 194,  light: "day",      set: "bahay_plaza",       xfade: 0,  sunAz: 72, sunEl: 46 },
  { id: 2,  a: 194,  b: 366,  light: "golden",   set: "pre_1521_coast",    xfade: 0,  sunAz: 10, sunEl: 9  },
  { id: 3,  a: 366,  b: 588,  light: "interior", set: "palayok_hearth",    xfade: 8,  sunAz: 62, sunEl: 38 },
  { id: 4,  a: 588,  b: 754,  light: "day",      set: "white_adobo_table", xfade: 8,  sunAz: 74, sunEl: 48 },
  { id: 5,  a: 754,  b: 1106, light: "golden",   set: "spanish_convento",  xfade: 8,  sunAz: 12, sunEl: 11 },
  { id: 6,  a: 1106, b: 1295, light: "day",      set: "trade_harbor",      xfade: 8,  sunAz: 70, sunEl: 44 },
  { id: 7,  a: 1295, b: 1419, light: "interior", set: "palayok_hearth",    xfade: 6,  sunAz: 64, sunEl: 40 },
  { id: 8,  a: 1419, b: 1552, light: "dusk",     set: "lost_name_archive", xfade: 0,  sunAz: 18, sunEl: 12 },
  { id: 9,  a: 1552, b: 1715, light: "storm",    set: "vinegar_science",   xfade: 6,  sunAz: 52, sunEl: 34 },
  { id: 10, a: 1715, b: 1876, light: "day",      set: "kitchen_fridge",    xfade: 8,  sunAz: 72, sunEl: 46 },
  { id: 11, a: 1876, b: 2053, light: "day",      set: "regional_feast",    xfade: 8,  sunAz: 74, sunEl: 48 },
  { id: 12, a: 2053, b: 2300, light: "golden",   set: "pinoy_kitchen",     xfade: 10, sunAz: 8,  sunEl: 10 },
];

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const smooth = (t: number) => {
  const u = clamp01(t);
  return u * u * u * (u * (u * 6 - 15) + 10);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerp3 = (a: V3, b: V3, t: number): V3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

// White flash right after the hook (Shot 1 -> Shot 2)
export const FLASHES: { f: number; color: string; curve: number[] }[] = [
  { f: 191, color: "#fff8ec", curve: [0.35, 0.85, 0.92, 0.55, 0.22] },
];

export const flashAt = (f: number) => {
  for (const fl of FLASHES) {
    const k = f - fl.f;
    if (k >= 0 && k < fl.curve.length) return { color: fl.color, opacity: fl.curve[k] };
  }
  return { color: "#ffffff", opacity: 0 };
};

export const layersAt = (f: number): { id: number; alpha: number }[] => {
  for (let i = 0; i < SHOTS.length; i++) {
    const s = SHOTS[i];
    if (f >= s.a && f < s.b) {
      const next = SHOTS[i + 1];
      if (next && next.xfade && f >= s.b - next.xfade) {
        const t = smooth((f - (s.b - next.xfade)) / next.xfade);
        return [{ id: s.id, alpha: 1 }, { id: next.id, alpha: t }];
      }
      return [{ id: s.id, alpha: 1 }];
    }
  }
  return [{ id: SHOTS[SHOTS.length - 1].id, alpha: 1 }];
};

// Impact flip-kicks [frame, amplitude] decaying over 7 frames
export const KICKS: [number, number][] = [
  [F_ADOBONG_MANOK, 0.14],
  [F_NO_REF, 0.18],
  [F_SUKA, 0.14],
  [F_WALANG_TOYO, 0.15],
  [F_NATIKMAN, 0.16],
  [F_TOYO, 0.15],
  [F_MASAMA, 0.16],
  [F_BAKTERYA, 0.19],
  [F_PANANGGA, 0.15],
  [F_REG_GATA, 0.14],
  [F_NANAY, 0.15],
];

const kickOffset = (f: number): [number, number] => {
  let ox = 0, oy = 0;
  for (const [kf, amp] of KICKS) {
    const k = f - kf;
    if (k >= 0 && k < 7) {
      const sgn = k % 2 === 0 ? 1 : -1;
      const env = Math.pow(1 - k / 7, 1.8) * amp;
      ox += sgn * env;
      oy += sgn * env * 0.65;
    }
  }
  return [ox, oy];
};

export type CamPose = { pos: V3; look: V3; fov: number; roll: number };

// Smooth camera choreography per shot — every single hold creeps gently (zero frozen frames)
export const camAt = (id: number, f: number): CamPose => {
  const s = SHOTS[id - 1];
  const dur = Math.max(1, s.b - s.a);
  const u = clamp01((f - s.a) / dur);
  const su = smooth(u);
  let pos: V3 = [0, 3, 12];
  let look: V3 = [0, 2.2, 0];
  let fov = 40;
  let roll = 0;

  switch (id) {
    case 1: {
      // Hero tropical coastal village plaza with steaming palayok & distant bay galleon
      const p1 = smooth((f - 0) / 110);
      const p2 = smooth((f - 110) / 84);
      const posA: V3 = [4.6, 3.6, 17.5];
      const posB: V3 = [1.2, 3.0, 12.6];
      const posC: V3 = [-1.4, 2.8, 10.2];
      const lookA: V3 = [0, 2.5, 0];
      const lookB: V3 = [0, 2.2, 0.4];
      const lookC: V3 = [0, 2.3, -1.2];
      pos = f < 110 ? lerp3(posA, posB, p1) : lerp3(posB, posC, p2);
      look = f < 110 ? lerp3(lookA, lookB, p1) : lerp3(lookB, lookC, p2);
      fov = lerp(42, 37, su);
      roll = lerp(-0.022, 0.024, su);
      break;
    }
    case 2: {
      // Golden blazing sun pre-1521 coast: sweating villager & crossed-out ghost refrigerator
      pos = lerp3([-3.8, 2.7, 14.2], [2.2, 2.6, 10.6], su);
      look = lerp3([0, 2.3, 0], [0.2, 2.2, 0.2], su);
      fov = lerp(42, 37, su);
      roll = lerp(0.028, -0.022, su);
      break;
    }
    case 3: {
      // Cozy earthy bahay-kubo dapogan hearth: bubbling palayok + cook + suka, bawang, asin pop-ins
      pos = lerp3([-2.4, 2.65, 11.8], [1.2, 2.5, 9.6], su);
      look = lerp3([-0.2, 2.0, 0], [0.0, 1.95, -0.2], su);
      fov = lerp(42, 38, su);
      roll = lerp(-0.018, 0.018, su);
      break;
    }
    case 4: {
      // Bright sun-drenched bamboo table with white adobo (Adobong Puti) & cook
      pos = lerp3([2.6, 2.7, 12.6], [-1.4, 2.5, 10.2], su);
      look = lerp3([-0.2, 1.95, 0.2], [-0.1, 1.9, 0.2], su);
      fov = lerp(42, 38, su);
      roll = lerp(0.02, -0.02, su);
      break;
    }
    case 5: {
      // 1613 Spanish convento courtyard: Padre Pedro tastes adobo & writes in dictionary
      const p1 = smooth((f - 754) / 180);
      const p2 = smooth((f - 934) / 172);
      const posA: V3 = [-3.8, 2.9, 14.8];
      const posB: V3 = [0.2, 2.6, 11.8];
      const posC: V3 = [2.0, 2.5, 9.8];
      pos = f < 934 ? lerp3(posA, posB, p1) : lerp3(posB, posC, p2);
      look = lerp3([-0.3, 2.1, 0], [0.1, 2.05, -0.3], su);
      fov = lerp(42, 37, su);
      roll = lerp(-0.022, 0.022, su);
      break;
    }
    case 6: {
      // Bustling Manila/Tondo trade pier with Chinese junk ship & soy sauce jar exchange
      pos = lerp3([-4.2, 3.1, 15.2], [2.0, 2.75, 11.6], su);
      look = lerp3([0, 2.4, -0.6], [0.1, 2.15, 0.4], su);
      fov = lerp(43, 38, su);
      roll = lerp(0.02, -0.022, su);
      break;
    }
    case 7: {
      // "Mabuti na lang..." intimate warm push-in on bubbling dark glossy adobo palayok & happy cooks
      pos = lerp3([1.6, 2.55, 11.4], [-0.8, 2.4, 9.4], su);
      look = lerp3([0, 2.0, 0], [0, 1.95, 0.1], su);
      fov = lerp(41, 37, su);
      roll = lerp(-0.016, 0.016, su);
      break;
    }
    case 8: {
      // "Masama nga lang..." dusk courtyard as the forgotten native scroll drifts into mist
      pos = lerp3([-2.2, 2.7, 12.2], [1.4, 3.1, 10.4], su);
      look = lerp3([-0.2, 2.2, 0], [0, 2.6, -0.4], su);
      fov = lerp(42, 38, su);
      roll = lerp(0.024, -0.026, su);
      break;
    }
    case 9: {
      // Stylized vinegar science stage: golden acid shield bouncing away green bacteria
      pos = lerp3([2.6, 2.8, 12.8], [-1.6, 2.55, 10.4], su);
      look = lerp3([0, 2.1, 0], [0, 2.1, 0], su);
      fov = lerp(42, 38, su);
      roll = lerp(-0.026, 0.024, su);
      break;
    }
    case 10: {
      // Sunny Filipino kitchen counter: open fridge analogy (vinegar shield replaces ice!)
      pos = lerp3([-2.6, 2.6, 13.0], [1.4, 2.5, 10.8], su);
      look = lerp3([0, 2.0, -0.4], [0.1, 2.0, -0.4], su);
      fov = lerp(42, 38, su);
      roll = lerp(0.018, -0.02, su);
      break;
    }
    case 11: {
      // Festive regional adobo showcase: glide across Puti -> Bicol Gata -> Batangas Dilaw
      pos = lerp3([-3.8, 3.2, 12.6], [3.8, 3.1, 12.2], su);
      look = lerp3([-2.2, 1.9, 0], [2.2, 1.9, 0], su);
      fov = lerp(42, 39, su);
      roll = lerp(-0.02, 0.02, su);
      break;
    }
    case 12: {
      // Golden-hour Filipino family dining veranda finale — Nanay's steaming chicken adobo
      pos = lerp3([0.8, 3.1, 11.4], [-2.6, 3.9, 15.6], su);
      look = lerp3([0, 2.2, 0.2], [0, 2.35, 0], su);
      fov = lerp(39, 43, su);
      roll = lerp(0.014, -0.02, su);
      break;
    }
  }

  const [kx, ky] = kickOffset(f);
  return {
    pos: [pos[0] + kx, pos[1] + ky, pos[2]],
    look: [look[0] + kx * 0.5, look[1] + ky * 0.5, look[2]],
    fov,
    roll,
  };
};

// Depth-of-field table: close-ups/MS get lush bokeh (cInf 8-13), wide establishing shots stay crisp (0-5)
export const dofAt = (f: number): { cInf: number; focus?: (f: number) => V3 } => {
  const s = SHOTS.find((x) => f >= x.a && f < x.b) ?? SHOTS[SHOTS.length - 1];
  switch (s.id) {
    case 1: return { cInf: f > 120 ? 8 : 0 };
    case 2: return { cInf: 6 };
    case 3: return { cInf: 11 };
    case 4: return { cInf: 10 };
    case 5: return { cInf: 8 };
    case 6: return { cInf: 0 };
    case 7: return { cInf: 13 };
    case 8: return { cInf: 9 };
    case 9: return { cInf: 10 };
    case 10: return { cInf: 10 };
    case 11: return { cInf: 6 };
    case 12: return { cInf: 0 };
    default: return { cInf: 0 };
  }
};
