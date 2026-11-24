// Cast staging & canvas sprite pool for "Sino Ba Talaga ang Nag-imbento ng Adobong Manok?".
// Every character card uses cardShade() (scene light tint + shadow floor + sun-side gradient + golden inner rim)
// and sits on the NOINK layer so world ink never outlines sprite quads.
import * as THREE from "three";
import {
  Pen, bodyFront, bodySide,
  NINUNO_COOK, NINUNO_WOMAN, NINUNO_VILLAGER, PADRE_PEDRO, CHINESE_MERCHANT,
  HISTORIAN, BICOL_COOK, BATANGAS_COOK, NANAY_COOK, TATAY_HOME, ATE_KID, BUNSO_KID,
  fxContact, fxShadow, fxSparkle, fxSweat, fxRedX, fxHeartGlow, fxLaughBurst,
  fxAromaSteam, fxVinegarSplash, fxSoySplash, fxBacteria, fxShieldRing, fxMysteryCloud,
  Outfit, FrontOpts, SideOpts,
} from "./toon";
import {
  FPS, clamp01, smooth,
  F_ADOBONG_MANOK, F_PILIPINO, F_NO_REF, F_SUKA, F_BAWANG, F_ASIN,
  F_WALANG_TOYO, F_ARAW, F_NATIKMAN, F_ADOBO_NAT, F_TOYO, F_MAITIM,
  F_MABUTI, F_MASAMA, F_NAKALIMUTAN, F_ASIDO, F_BAKTERYA, F_PINAPALAMBOT,
  F_YELO, F_PANANGGA, F_REG_PUTI, F_REG_GATA, F_REG_DILAW, F_NANAY,
} from "./story";
import { LIGHTS, LightMode } from "./lights";
import { NOINK } from "./ink";
import { cardShade, blobMaterial, CARD_K } from "./cardshade";

type Entry = { cv: HTMLCanvasElement; tex: THREE.CanvasTexture; w: number; h: number };
export type Req = { key: string; w: number; h: number; k: number; draw: (p: Pen) => void; tex?: THREE.CanvasTexture };

const makeEntry = (w: number, h: number): Entry => {
  const cv = document.createElement("canvas");
  cv.width = w; cv.height = h;
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 1;
  return { cv, tex, w, h };
};

export class Pool {
  private live = new Map<string, Entry>();
  private free: Entry[] = [];
  private reqs: Req[] = [];
  req(key: string, w: number, h: number, k: number, draw: (p: Pen) => void) {
    const r: Req = { key: `${w}x${h}|${key}`, w, h, k, draw };
    this.reqs.push(r);
    return r;
  }
  flush() {
    const want = new Map<string, Req[]>();
    for (const r of this.reqs) {
      const l = want.get(r.key);
      if (l) l.push(r); else want.set(r.key, [r]);
    }
    for (const [key, e] of this.live) if (!want.has(key)) { this.live.delete(key); this.free.push(e); }
    for (const [key, rs] of want) {
      let e = this.live.get(key);
      if (!e) {
        const r = rs[0], i = this.free.findIndex((x) => x.w === r.w && x.h === r.h);
        e = i >= 0 ? this.free.splice(i, 1)[0] : makeEntry(r.w, r.h);
        const g = e.cv.getContext("2d")!;
        g.setTransform(1, 0, 0, 1, 0, 0);
        g.clearRect(0, 0, e.w, e.h);
        g.setTransform(r.k, 0, 0, r.k, 0, 0);
        r.draw(new Pen(g));
        e.tex.needsUpdate = true;
        this.live.set(key, e);
      }
      for (const r of rs) r.tex = e.tex;
    }
    this.reqs = [];
  }
}

const blank = (() => { const c = document.createElement("canvas"); c.width = c.height = 2; return new THREE.CanvasTexture(c); })();
export const SU = 0.00216;
const BODY = (() => { const g = new THREE.PlaneGeometry(600 * SU, 1000 * SU); g.translate(0, (975 - 500) * SU, 0); return g; })();
const CARD = new THREE.PlaneGeometry(1, 1);

export class Actor {
  mesh: THREE.Mesh; mat: THREE.MeshLambertMaterial; dmat: THREE.MeshDepthMaterial; r: Req | null = null;
  constructor(parent: THREE.Object3D) {
    this.mat = cardShade(new THREE.MeshLambertMaterial({ map: blank, alphaTest: 0.5, side: THREE.DoubleSide }));
    this.mat.alphaToCoverage = false;
    this.dmat = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: blank, alphaTest: 0.5, side: THREE.DoubleSide });
    this.mesh = new THREE.Mesh(BODY, this.mat);
    this.mesh.customDepthMaterial = this.dmat;
    this.mesh.onBeforeRender = (r) => { const rt = r.getRenderTarget(); CARD_K.uPx.value = (rt ? rt.height : r.domElement.height) / 1920; };
    this.mesh.castShadow = false;
    this.mesh.receiveShadow = true;
    this.mesh.visible = false;
    this.mesh.rotation.order = "YXZ";
    this.mesh.renderOrder = 1;
    this.mesh.layers.set(NOINK);
    parent.add(this.mesh);
  }
  bind() { const t = this.r?.tex; if (t) { this.mat.map = t; this.dmat.map = t; } }
}

export class Fx {
  mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial; soft: THREE.MeshBasicMaterial; blob: THREE.MeshBasicMaterial; r: Req | null = null;
  constructor(parent: THREE.Object3D) {
    this.mat = new THREE.MeshBasicMaterial({ map: blank, alphaTest: 0.5, side: THREE.DoubleSide });
    this.mat.alphaToCoverage = false;
    this.soft = new THREE.MeshBasicMaterial({ map: blank, transparent: true, depthWrite: false, side: THREE.DoubleSide });
    this.blob = blobMaterial(blank);
    this.mesh = new THREE.Mesh(CARD, this.mat);
    this.mesh.visible = false;
    this.mesh.layers.set(NOINK);
    parent.add(this.mesh);
  }
  use(soft: boolean) { this.mesh.material = soft ? this.soft : this.mat; }
  bind() {
    const t = this.r?.tex;
    if (!t) return;
    if (this.r!.key.includes("|blob|")) {
      if (t.generateMipmaps) { t.generateMipmaps = false; t.minFilter = THREE.LinearFilter; t.needsUpdate = true; }
      this.blob.map = t;
      this.mesh.material = this.blob;
      this.mesh.renderOrder = 0.5;
    } else {
      this.mat.map = t;
      this.soft.map = t;
      this.mesh.renderOrder = 0;
    }
  }
}

export type Place = {
  key: string; draw: (p: Pen) => void; x: number; y: number; z: number;
  scale?: number; mirror?: boolean; roll?: number; size: [number, number, number];
  shadow?: boolean;
};
export type FxPlace = {
  key: string; cw: number; ch: number; draw: (p: Pen) => void;
  x: number; y: number; z: number; w: number; h: number;
  flat?: boolean; rot?: number; soft?: boolean;
};
export type CamInfo = { pos: THREE.Vector3; right: THREE.Vector3; sun: THREE.Vector3 };

const hh = (i: number, s = 0) => { const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return v - Math.floor(v); };
const q = (v: number, n = 24) => Math.round(v * n) / n;
const tier = (d: number): [number, number, number] =>
  d < 3.4 ? [660, 1100, 1.1] : d < 7.0 ? [480, 800, 0.8] : d < 18 ? [300, 500, 0.5] : [180, 300, 0.3];

const LID = [0.5, 1, 1, 0.5];
const lidAt = (f: number, i: number, swaps: number[] = []) => {
  for (const sf of swaps) { const k = f - sf + 1; if (k >= 0 && k < 4) return LID[k]; }
  let s = Math.round(-50 * hh(i, 9));
  for (let n = 0; s <= f && n < 300; n++) {
    const k = f - s;
    if (k >= 0 && k < 4) return LID[k];
    s += Math.round(22 + 48 * hh(i * 31 + n, 13));
  }
  return 0;
};

const light2D = (cam: CamInfo, mirror: boolean) => {
  const sx = cam.sun.dot(cam.right) * (mirror ? -1 : 1), sy = -cam.sun.y;
  return Math.round(Math.atan2(sy, sx) / (Math.PI / 4)) * (Math.PI / 4);
};

const blobHex = (light: LightMode) => {
  const b = LIGHTS[light].blob;
  const h = (v: number) => Math.min(255, Math.round(v * 255)).toString(16).padStart(2, "0");
  return `#${h(b[0])}${h(b[1])}${h(b[2])}`;
};

export function stageShot(
  shotId: number, f: number, light: LightMode, cam: CamInfo
): { places: Place[]; fxs: FxPlace[] } {
  const places: Place[] = [];
  const fxs: FxPlace[] = [];
  const t = f / FPS;
  const bHex = blobHex(light);
  const sunYaw = Math.atan2(-cam.sun.x, -cam.sun.z);

  const addShadow = (x: number, y: number, z: number, sc = 1) => {
    fxs.push({
      key: `blob|c_${bHex}`, cw: 128, ch: 128, draw: (p) => fxContact(p, bHex, 0.52),
      x, y: y + 0.025, z, w: 1.15 * sc, h: 0.72 * sc, flat: true, rot: 0, soft: true,
    });
    if (light === "day" || light === "golden") {
      fxs.push({
        key: `blob|t_${bHex}`, cw: 128, ch: 128, draw: (p) => fxShadow(p, bHex),
        x: x - Math.sin(sunYaw) * 0.45 * sc, y: y + 0.02, z: z - Math.cos(sunYaw) * 0.45 * sc,
        w: 1.05 * sc, h: 1.7 * sc, flat: true, rot: sunYaw, soft: true,
      });
    }
  };

  const front = (
    id: number, name: string, outfit: Outfit, x: number, y: number, z: number,
    opts: FrontOpts, scale = 1, mirror = false, swaps: number[] = []
  ) => {
    const d = Math.hypot(cam.pos.x - x, cam.pos.y - (y + 1.0), cam.pos.z - z);
    const L = light2D(cam, mirror);
    const blink = lidAt(f, id, swaps);
    const phase = q(opts.phase ?? 0, 16);
    const key = `F|${name}|${opts.expr ?? "neutral"}|${opts.mode ?? "stand"}|${opts.prop ?? "none"}|p${phase}|b${blink}|L${L.toFixed(2)}|m${mirror ? 1 : 0}`;
    places.push({
      key,
      draw: (p) => bodyFront(p, outfit, { ...opts, phase, blink, light: L, seed: id }),
      x, y, z, scale, mirror, size: tier(d),
    });
    addShadow(x, y, z, scale);
  };

  const side = (
    id: number, name: string, outfit: Outfit, x: number, y: number, z: number,
    opts: SideOpts, scale = 1, mirror = false, swaps: number[] = []
  ) => {
    const d = Math.hypot(cam.pos.x - x, cam.pos.y - (y + 1.0), cam.pos.z - z);
    const L = light2D(cam, mirror);
    const blink = lidAt(f, id, swaps);
    const phase = q(opts.phase ?? 0, 16);
    const key = `S|${name}|${opts.expr ?? "neutral"}|${opts.mode ?? "walk"}|p${phase}|b${blink}|L${L.toFixed(2)}|m${mirror ? 1 : 0}`;
    places.push({
      key,
      draw: (p) => bodySide(p, outfit, { ...opts, phase, blink, light: L, seed: id }),
      x, y, z, scale, mirror, size: tier(d),
    });
    addShadow(x, y, z, scale);
  };

  const addFx = (key: string, draw: (p: Pen) => void, x: number, y: number, z: number, w: number, h = w, soft = true) => {
    fxs.push({ key, cw: 256, ch: 256, draw, x, y, z, w, h, soft });
  };

  const steamPh = q((t * 0.55) % 1, 12);

  switch (shotId) {
    case 1: {
      // Shot 1: Tropical coastal village plaza — proud pre-colonial cooks around steaming palayok
      const cheer = f >= F_ADOBONG_MANOK;
      front(101, "ninuno_cook", NINUNO_COOK, -1.75, 0, 0.8, {
        expr: cheer ? "grin" : "smile",
        mode: cheer ? "wave" : "stand",
        phase: (t * 0.65) % 1,
        facing: 1,
      }, 1.04, false, [F_ADOBONG_MANOK, F_PILIPINO]);
      front(102, "ninuno_woman", NINUNO_WOMAN, 1.85, 0, 0.7, {
        expr: f >= F_PILIPINO ? "smug" : "smile",
        mode: f >= F_PILIPINO ? "offer" : "stand",
        phase: (t * 0.5) % 1,
        facing: -1,
      }, 1.0, false, [F_PILIPINO]);
      side(103, "ninuno_villager", NINUNO_VILLAGER, -4.6 + smooth(f / 180) * 1.4, 0, -2.2, {
        expr: "smile", mode: "walk", phase: (t * 0.8) % 1,
      }, 0.96, false);
      addFx(`aroma_${steamPh}`, (p) => fxAromaSteam(p, steamPh), 0, 2.75, 0.4, 1.75, 1.95, true);
      if (cheer) {
        addFx("sp_hero", fxSparkle, 0.85, 2.95, 0.8, 1.05, 1.05, true);
      }
      break;
    }

    case 2: {
      // Shot 2: Pre-1521 blazing sun coast — sweating villager waving away ghost refrigerator!
      const noRef = f >= F_NO_REF;
      front(201, "hot_villager", NINUNO_VILLAGER, -0.35, 0, 1.6, {
        expr: noRef ? "shock" : "nervous",
        mode: noRef ? "refuse" : "shrug",
        phase: (t * 0.75) % 1,
        facing: 1,
      }, 1.06, false, [F_NO_REF]);
      addFx("sweat_hot", fxSweat, -1.15, 2.35, 1.8, 0.9, 0.9, true);
      if (noRef) {
        const pop = 0.65 + 0.45 * smooth((f - F_NO_REF) / 8);
        addFx("redx_ref", fxRedX, 1.6, 1.65, 1.25, 1.85 * pop, 1.85 * pop, true);
      }
      break;
    }

    case 3: {
      // Shot 3: Bahay kubo dapogan hearth — ancestor cook adding suka, bawang, asin into palayok
      const happy = f >= F_SUKA;
      front(301, "hearth_cook", NINUNO_WOMAN, -1.55, 0, 1.6, {
        expr: happy ? "grin" : "awe",
        mode: f >= F_BAWANG ? "wave" : "offer",
        phase: (t * 0.65) % 1,
        facing: 1,
      }, 1.05, false, [F_SUKA, F_BAWANG, F_ASIN]);
      addFx(`aroma3_${steamPh}`, (p) => fxAromaSteam(p, steamPh), 0, 3.35, -0.2, 1.65, 1.85, true);
      if (f >= F_SUKA) {
        const vph = q((t * 0.8) % 1, 10);
        addFx(`vin_${vph}`, (p) => fxVinegarSplash(p, vph), -1.1, 2.75, 0.25, 1.15, 1.15, true);
      }
      if (f >= F_ASIN) {
        addFx("sp_asin", fxSparkle, 1.9, 2.25, 0.2, 0.95, 0.95, true);
      }
      break;
    }

    case 4: {
      // Shot 4: White Adobo table — cook refuses sneaking soy sauce, celebrates fresh white adobo!
      const refuse = f >= F_WALANG_TOYO && f < F_ARAW;
      front(401, "puti_cook", NINUNO_COOK, -1.25, 0, 1.75, {
        expr: refuse ? "stern" : "smug",
        mode: refuse ? "refuse" : "point",
        phase: (t * 0.7) % 1,
        facing: 1,
      }, 1.04, false, [F_WALANG_TOYO, F_ARAW]);
      addFx(`aroma4_${steamPh}`, (p) => fxAromaSteam(p, steamPh), 0, 3.05, 0.2, 1.45, 1.65, true);
      if (f >= F_WALANG_TOYO && f < F_WALANG_TOYO + 70) {
        addFx("redx_soy", fxRedX, 1.85, 2.15, 0.6, 1.15, 1.15, true);
      }
      if (f >= F_ARAW) {
        addFx("sp_fresh", fxSparkle, 0.95, 2.85, 0.5, 1.15, 1.15, true);
      }
      break;
    }

    case 5: {
      // Shot 5: 1613 Spanish Convento — Padre Pedro tastes native adobo and writes "adobo de los naturales"!
      const tasted = f >= F_NATIKMAN;
      const naming = f >= F_ADOBO_NAT;
      front(501, "padre_pedro", PADRE_PEDRO, 0.35, 0, 1.45, {
        expr: naming ? "laugh" : tasted ? "awe" : "talk",
        mode: naming ? "wave" : tasted ? "point" : "stand",
        phase: (t * 0.7) % 1,
        facing: -1,
      }, 1.08, false, [F_NATIKMAN, F_ADOBO_NAT]);
      front(502, "native_host", NINUNO_COOK, -1.95, 0, 1.25, {
        expr: tasted ? "grin" : "smile",
        mode: "offer",
        phase: (t * 0.5) % 1,
        facing: 1,
      }, 1.02, false, [F_NATIKMAN]);
      addFx(`aroma5_${steamPh}`, (p) => fxAromaSteam(p, steamPh), -1.2, 2.65, 0.2, 1.3, 1.45, true);
      if (naming) {
        addFx("burst_1613", fxLaughBurst, 1.45, 2.95, 0.8, 1.35, 1.35, true);
      }
      break;
    }

    case 6: {
      // Shot 6: Manila/Tondo Trade Pier — Chinese merchant brings toyo, sauce turns dark & glossy!
      const poured = f >= F_TOYO;
      const dark = f >= F_MAITIM;
      front(601, "chinese_trader", CHINESE_MERCHANT, 1.65, 0, 1.55, {
        expr: poured ? "grin" : "smile",
        mode: poured ? "offer" : "wave",
        phase: (t * 0.6) % 1,
        facing: -1,
      }, 1.05, false, [F_TOYO]);
      front(602, "pier_cook", NINUNO_WOMAN, -1.55, 0, 1.55, {
        expr: dark ? "laugh" : "awe",
        mode: dark ? "wave" : "offer",
        phase: (t * 0.65) % 1,
        facing: 1,
      }, 1.04, false, [F_TOYO, F_MAITIM]);
      if (poured) {
        const sph = q((t * 0.8) % 1, 10);
        addFx(`soy_${sph}`, (p) => fxSoySplash(p, sph), -0.1, 2.35, 0.85, 1.45, 1.45, true);
      }
      if (dark) {
        addFx("sp_toyo", fxSparkle, 0.6, 2.85, 0.9, 1.25, 1.25, true);
      }
      break;
    }

    case 7: {
      // Shot 7: "Mabuti na lang..." cozy palayok close-up with delighted cooks & hearts
      front(701, "happy_cook1", NINUNO_COOK, -1.45, 0, 1.55, {
        expr: "grin", mode: "offer", phase: (t * 0.55) % 1, facing: 1,
      }, 1.04, false, [F_MABUTI]);
      front(702, "happy_cook2", NINUNO_WOMAN, 1.45, 0, 1.55, {
        expr: "laugh", mode: "wave", phase: (t * 0.6) % 1, facing: -1,
      }, 1.02, false, [F_MABUTI]);
      addFx(`aroma7_${steamPh}`, (p) => fxAromaSteam(p, steamPh), 0, 3.35, -0.1, 1.85, 2.0, true);
      addFx("heart_adobo", fxHeartGlow, 0, 3.55, 0.55, 1.25, 1.25, true);
      break;
    }

    case 8: {
      // Shot 8: "Masama nga lang..." dusk courtyard — historian shrugs as native name fades into mist
      const lost = f >= F_NAKALIMUTAN;
      front(801, "historian", HISTORIAN, -1.25, 0, 1.65, {
        expr: lost ? "deadpan" : "nervous",
        mode: "shrug",
        phase: (t * 0.55) % 1,
        facing: 1,
      }, 1.05, false, [F_MASAMA, F_NAKALIMUTAN]);
      const mph = q((t * 0.5) % 1, 10);
      addFx(`myst_${mph}`, (p) => fxMysteryCloud(p, mph), 0.35, 3.75 + smooth((f - F_MASAMA) / 90) * 0.65, -0.2, 1.75, 1.45, true);
      break;
    }

    case 9: {
      // Shot 9: Vinegar science stage — golden acid shield bouncing away green bacteria blobs!
      const shieldOn = f >= F_ASIDO;
      const bounce = smooth((f - F_BAKTERYA) / 28);
      const bph = q((t * 0.9) % 1, 10);
      const bx1 = -1.35 - bounce * 1.15;
      const bx2 = 1.35 + bounce * 1.15;
      const by1 = 2.45 + Math.sin(t * 5) * 0.22 + bounce * 0.6;
      const by2 = 1.95 + Math.cos(t * 4.5) * 0.22 + bounce * 0.5;
      addFx(`bact1_${bph}`, (p) => fxBacteria(p, bph), bx1, by1, 0.85, 1.25, 1.25, true);
      addFx(`bact2_${bph}`, (p) => fxBacteria(p, (bph + 0.5) % 1), bx2, by2, 0.85, 1.15, 1.15, true);
      if (shieldOn) {
        const rph = q((t * 0.75) % 1, 10);
        addFx(`shield_${rph}`, (p) => fxShieldRing(p, rph), 0, 3.25, 0.8, 1.55, 1.55, true);
      }
      if (f >= F_PINAPALAMBOT) {
        addFx("sp_tender", fxSparkle, 0.75, 3.0, 1.1, 1.1, 1.1, true);
      }
      break;
    }

    case 10: {
      // Shot 10: Sunny Filipino kitchen — open fridge analogy (suka shield replaces ice!)
      const noIce = f >= F_YELO;
      const shield = f >= F_PANANGGA;
      front(1001, "kitchen_cook", NANAY_COOK, 0.85, 0, 1.7, {
        expr: shield ? "smug" : "smile",
        mode: shield ? "point" : "stand",
        phase: (t * 0.6) % 1,
        facing: 1,
      }, 1.05, false, [F_YELO, F_PANANGGA]);
      if (noIce) {
        addFx("redx_ice", fxRedX, -0.35, 1.95, -0.5, 1.15, 1.15, true);
      }
      if (shield) {
        const rph = q((t * 0.75) % 1, 10);
        addFx(`shield10_${rph}`, (p) => fxShieldRing(p, rph), 1.85, 2.75, -0.4, 1.65, 1.65, true);
      }
      break;
    }

    case 11: {
      // Shot 11: Festive regional adobo showcase — Puti, Bicol Gata, Batangas Dilaw!
      front(1101, "reg_puti", NINUNO_COOK, -2.6, 0.52, -0.85, {
        expr: f >= F_REG_PUTI ? "grin" : "smile",
        mode: f >= F_REG_PUTI ? "wave" : "stand",
        phase: (t * 0.65) % 1, facing: 0,
      }, 1.08, false, [F_REG_PUTI]);
      front(1102, "reg_bicol", BICOL_COOK, 0, 0.52, -0.85, {
        expr: f >= F_REG_GATA ? "laugh" : "smile",
        mode: f >= F_REG_GATA ? "wave" : "offer",
        phase: (t * 0.7) % 1, facing: 0,
      }, 1.10, false, [F_REG_GATA]);
      front(1103, "reg_batangas", BATANGAS_COOK, 2.6, 0.52, -0.85, {
        expr: f >= F_REG_DILAW ? "smug" : "smile",
        mode: f >= F_REG_DILAW ? "wave" : "stand",
        phase: (t * 0.65) % 1, facing: 0,
      }, 1.08, false, [F_REG_DILAW]);
      addFx(`aroma11a_${steamPh}`, (p) => fxAromaSteam(p, steamPh), -2.6, 2.15, 0.55, 0.95, 1.1, true);
      addFx(`aroma11b_${steamPh}`, (p) => fxAromaSteam(p, (steamPh + 0.3) % 1), 0, 2.2, 0.55, 1.0, 1.15, true);
      addFx(`aroma11c_${steamPh}`, (p) => fxAromaSteam(p, (steamPh + 0.6) % 1), 2.6, 2.15, 0.55, 0.95, 1.1, true);
      break;
    }

    case 12: {
      // Shot 12: Warm golden-hour Filipino family dining veranda finale — Nanay's chicken adobo!
      const nanayBeat = f >= F_NANAY;
      front(1201, "nanay", NANAY_COOK, 0.68, 1.05, -0.35, {
        expr: nanayBeat ? "laugh" : "grin",
        mode: nanayBeat ? "wave" : "offer",
        phase: (t * 0.65) % 1, facing: 0,
      }, 1.15, false, [F_NANAY]);
      front(1202, "tatay", TATAY_HOME, -1.75, 0.95, -0.2, {
        expr: "grin", mode: "wave", phase: (t * 0.55) % 1, facing: 1,
      }, 1.08, false, [F_NANAY]);
      front(1203, "ate", ATE_KID, 2.15, 0.92, -0.15, {
        expr: "laugh", mode: "wave", phase: (t * 0.75) % 1, facing: -1,
      }, 0.98, false, [F_NANAY]);
      front(1204, "bunso", BUNSO_KID, 1.35, 0.55, 2.55, {
        expr: "grin", mode: "wave", phase: (t * 0.8) % 1, facing: -1,
      }, 0.88, false, [F_NANAY]);
      addFx(`aroma12_${steamPh}`, (p) => fxAromaSteam(p, steamPh), -0.15, 2.85, 1.15, 1.25, 1.4, true);
      if (nanayBeat) {
        addFx("heart_nanay", fxHeartGlow, 0.68, 4.25, -0.1, 1.25, 1.25, true);
        addFx("sp_fin", fxSparkle, -1.15, 3.85, 0.2, 1.05, 1.05, true);
      }
      break;
    }
  }

  return { places, fxs };
}
