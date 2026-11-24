// Modular 3D painted storybook sets for "Sino Ba Talaga ang Nag-imbento ng Adobong Manok?".
// 11 distinct sets built with calibrated two-tone shading (twoTone), painted HD Canvas2D textures,
// unlit HDR emissives for embers/glows/windows, and ZERO readable text/letters anywhere.
import * as THREE from "three";
import { twoTone } from "./shade";
import { NOINK } from "./ink";
import {
  stuccoHD, sawaliHD, nipaHD, plazaStoneHD, grassHD, woodPlanksHD,
  clayPotHD, bananaLeafHD, seaWaterHD, capizWindowHD, bookPageHD, rep,
} from "./paint";
import { SetId } from "./story";

export type BuiltSets = {
  groups: Record<SetId, THREE.Group>;
  plazaGalleon: THREE.Group;
  ghostFridge: THREE.Group;
  emberMat: THREE.MeshBasicMaterial;
  hearthSauceMat: THREE.MeshLambertMaterial;
  sukaProp: THREE.Group;
  bawangProp: THREE.Group;
  asinProp: THREE.Group;
  sneakSoy: THREE.Group;
  quillGroup: THREE.Group;
  junkShip: THREE.Group;
  pierSauceMat: THREE.MeshLambertMaterial;
  floatingScroll: THREE.Group;
  heroDrumstick: THREE.Group;
  acidShield: THREE.Mesh;
  iceCubes: THREE.Group;
  sukaHero: THREE.Group;
  regPots: THREE.Group[];
};

const M = (color: string, map?: THREE.Texture | null) =>
  twoTone(new THREE.MeshLambertMaterial({ color, map: map ?? null }));

const UNLIT = (color: string | THREE.Color, map?: THREE.Texture | null, transparent = false, opacity = 1) =>
  new THREE.MeshBasicMaterial({ color, map: map ?? null, transparent, opacity });

const box = (w: number, h: number, d: number, mat: THREE.Material, x = 0, y = 0, z = 0) => {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
};

const cyl = (rt: number, rb: number, h: number, seg: number, mat: THREE.Material, x = 0, y = 0, z = 0) => {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
};

const sph = (r: number, seg: number, mat: THREE.Material, x = 0, y = 0, z = 0) => {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, seg, Math.max(8, seg - 2)), mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
};

/** Painted tropical palm tree */
function makePalmTree(x: number, z: number, h = 5.4, seed = 1): THREE.Group {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  const trunkMat = M("#8c6244");
  const leafMat = M(seed % 2 === 0 ? "#4c8e3c" : "#5ea046");
  const segs = 5;
  for (let i = 0; i < segs; i++) {
    const t = i / segs;
    g.add(cyl(0.22 - t * 0.07, 0.26 - t * 0.07, h / segs + 0.08, 7, trunkMat, Math.sin(t * 1.4 + seed) * 0.24, (i + 0.5) * (h / segs), 0));
  }
  const topY = h, topX = Math.sin(1.4 + seed) * 0.24;
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + seed * 0.7;
    const frond = box(0.45, 0.14, 2.0, leafMat, topX + Math.cos(a) * 0.9, topY + 0.1, Math.sin(a) * 0.9);
    frond.rotation.y = -a + Math.PI / 2;
    frond.rotation.x = 0.28;
    g.add(frond);
  }
  const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(0.62, 1), leafMat);
  crown.position.set(topX, topY + 0.28, 0);
  g.add(crown);
  return g;
}

/** Traditional Filipino Bahay Kubo (nipa hut on bamboo stilts) */
function makeBahayKubo(x: number, z: number, rotY = 0, scale = 1): THREE.Group {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.rotation.y = rotY;
  g.scale.setScalar(scale);
  const bambooMat = M("#b68b4c");
  const wallMat = M("#ffffff", rep(sawaliHD("sawaliHut"), 2, 1));
  const roofMat = M("#ffffff", rep(nipaHD("nipaRoof"), 3, 2));
  const darkWin = UNLIT("#261c18");

  // 4 bamboo stilts
  for (const sx of [-1.8, 1.8]) for (const sz of [-1.4, 1.4]) {
    g.add(cyl(0.11, 0.12, 1.8, 8, bambooMat, sx, 0.9, sz));
  }
  // Raised floor & sawali walls
  g.add(box(4.2, 0.24, 3.4, bambooMat, 0, 1.75, 0));
  g.add(box(3.8, 2.3, 3.0, wallMat, 0, 3.0, 0));
  // Window & awning
  g.add(box(1.1, 0.9, 0.12, darkWin, 0, 3.1, 1.52));
  const awning = box(1.25, 0.08, 0.85, roofMat, 0, 3.65, 1.85);
  awning.rotation.x = 0.45;
  g.add(awning);
  // Steep pyramidal nipa roof
  const roof = new THREE.Mesh(new THREE.ConeGeometry(3.4, 2.4, 4), roofMat);
  roof.position.set(0, 5.2, 0);
  roof.rotation.y = Math.PI / 4;
  roof.castShadow = true;
  roof.receiveShadow = true;
  g.add(roof);
  return g;
}

/** Stylized 3D Chicken Drumstick (golden brown glazed meat + ivory bone tip) */
function makeDrumstick(scale = 1, sauceHex = "#8c4a24"): THREE.Group {
  const g = new THREE.Group();
  g.scale.setScalar(scale);
  const meatMat = M(sauceHex);
  const boneMat = M("#f4ece0");
  const meat = sph(0.28, 12, meatMat, 0.18, 0, 0);
  meat.scale.set(1.45, 0.92, 0.92);
  g.add(meat);
  const bone = cyl(0.065, 0.075, 0.42, 8, boneMat, -0.26, 0, 0);
  bone.rotation.z = Math.PI / 2;
  g.add(bone);
  g.add(sph(0.085, 8, boneMat, -0.46, 0.04, 0));
  g.add(sph(0.085, 8, boneMat, -0.46, -0.04, 0));
  return g;
}

/** Hero Terracotta Palayok (clay cooking pot) with sauce disc, drumsticks, garlic & bay leaves */
function makePalayok(sauceHex: string, scale = 1, sauceMatOut?: { mat: THREE.MeshLambertMaterial }): THREE.Group {
  const g = new THREE.Group();
  g.scale.setScalar(scale);
  const clayMat = M("#ffffff", clayPotHD("clayPotMain"));
  const body = sph(0.88, 16, clayMat, 0, 0.62, 0);
  body.scale.set(1.06, 0.78, 1.06);
  g.add(body);
  // Flared terracotta rim
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.11, 10, 20), clayMat);
  rim.rotation.x = Math.PI / 2;
  rim.position.set(0, 1.18, 0);
  rim.castShadow = true;
  g.add(rim);
  // Simmering sauce surface
  const sMat = M(sauceHex);
  if (sauceMatOut) sauceMatOut.mat = sMat;
  const sauce = cyl(0.64, 0.64, 0.08, 18, sMat, 0, 1.12, 0);
  g.add(sauce);
  // 3 chicken drumsticks peeking out of the sauce
  const d1 = makeDrumstick(0.72, "#7e3e1c");
  d1.position.set(-0.18, 1.24, 0.12); d1.rotation.set(0.2, 0.5, 0.45);
  const d2 = makeDrumstick(0.68, "#8c4822");
  d2.position.set(0.22, 1.26, -0.08); d2.rotation.set(-0.2, -0.8, 0.35);
  g.add(d1, d2);
  // Bay leaves & garlic cloves floating on top
  const leafMat = M("#4d7c36");
  const leaf = box(0.28, 0.03, 0.12, leafMat, 0.05, 1.20, 0.28);
  leaf.rotation.y = 0.6;
  g.add(leaf);
  const pepMat = M("#2a2220");
  for (const [px, pz] of [[-0.32, -0.18], [0.34, 0.22], [0.02, -0.34]]) {
    g.add(sph(0.045, 6, pepMat, px, 1.18, pz));
  }
  return g;
}

/** Stylized bottle (vinegar or soy sauce) */
function makeBottle(liquidHex: string, bodyHex: string, scale = 1): THREE.Group {
  const g = new THREE.Group();
  g.scale.setScalar(scale);
  const bMat = M(bodyHex);
  const lMat = M(liquidHex);
  const corkMat = M("#9e6b3b");
  g.add(cyl(0.26, 0.28, 0.65, 12, bMat, 0, 0.32, 0));
  g.add(cyl(0.22, 0.25, 0.42, 12, lMat, 0, 0.28, 0));
  g.add(cyl(0.10, 0.22, 0.26, 12, bMat, 0, 0.76, 0));
  g.add(cyl(0.10, 0.10, 0.28, 10, bMat, 0, 0.98, 0));
  g.add(cyl(0.11, 0.09, 0.14, 10, corkMat, 0, 1.16, 0));
  return g;
}

/** Stylized wooden dining table */
function makeWoodTable(w: number, h: number, d: number): THREE.Group {
  const g = new THREE.Group();
  const topMat = M("#ffffff", rep(woodPlanksHD("tableWood", "#b8743c", "#5a3218"), 2, 1));
  const legMat = M("#764624");
  g.add(box(w, 0.18, d, topMat, 0, h, 0));
  for (const sx of [-w * 0.42, w * 0.42]) for (const sz of [-d * 0.38, d * 0.38]) {
    g.add(box(0.18, h, 0.18, legMat, sx, h * 0.5, sz));
  }
  return g;
}

export function buildAllSets(root: THREE.Group): BuiltSets {
  const groups = {} as Record<SetId, THREE.Group>;
  const makeSet = (id: SetId) => {
    const g = new THREE.Group();
    g.visible = false;
    root.add(g);
    groups[id] = g;
    return g;
  };

  const grassMat = M("#ffffff", rep(grassHD("grassMain"), 12, 12));
  const stoneMat = M("#ffffff", rep(plazaStoneHD("stoneMain"), 10, 10));
  const seaMat = M("#ffffff", rep(seaWaterHD("seaMain"), 14, 14));
  const woodFloorMat = M("#ffffff", rep(woodPlanksHD("woodFloor"), 8, 8));
  const stuccoCream = M("#ffffff", rep(stuccoHD("creamWall", "#efe3cc"), 3, 2));
  const stuccoOchre = M("#ffffff", rep(stuccoHD("ochreWall", "#dfb066"), 3, 2));
  const stuccoAdobe = M("#ffffff", rep(stuccoHD("adobeWall", "#c8b79e"), 3, 2));
  const terracottaMat = M("#b65436");
  const bananaMat = M("#ffffff", rep(bananaLeafHD("bananaMain"), 3, 1));
  const capizMat = UNLIT(new THREE.Color(1.45, 1.25, 0.92), rep(capizWindowHD("capizMain"), 2, 2));

  // ==================== 1. BAHAY PLAZA (Shot 1) ====================
  const s1 = makeSet("bahay_plaza");
  s1.add(box(80, 0.2, 80, grassMat, 0, -0.1, 4));
  s1.add(box(140, 0.2, 70, seaMat, 0, -0.18, -50));
  // Sandy coastal path & central stone cooking hearth
  s1.add(cyl(4.2, 4.6, 0.14, 24, M("#d8c298"), 0, 0.04, 0.5));
  s1.add(cyl(1.3, 1.5, 0.72, 12, stuccoAdobe, 0, 0.36, 0.4));
  const p1 = makePalayok("#6b341c", 1.12);
  p1.position.set(0, 0.72, 0.4);
  s1.add(p1);
  // Bahay kubo village houses & palms framing the bay
  s1.add(makeBahayKubo(-6.6, -6.5, 0.38, 1.05));
  s1.add(makeBahayKubo(6.8, -7.2, -0.42, 1.0));
  s1.add(makePalmTree(-9.5, -2.5, 6.4, 1));
  s1.add(makePalmTree(9.2, -3.0, 6.0, 2));
  s1.add(makePalmTree(-4.2, -13.5, 5.6, 3));
  s1.add(makePalmTree(5.0, -14.0, 5.8, 4));
  // Distant Spanish galleon out on the bay
  const plazaGalleon = new THREE.Group();
  plazaGalleon.position.set(6.5, 0.1, -30);
  plazaGalleon.add(box(5.2, 1.6, 1.8, M("#6a4228"), 0, 0.8, 0));
  plazaGalleon.add(box(1.8, 1.0, 1.8, M("#7a4d2e"), 1.7, 2.0, 0));
  plazaGalleon.add(cyl(0.12, 0.14, 5.8, 8, M("#52321e"), 0, 3.6, 0));
  plazaGalleon.add(box(0.16, 3.2, 2.8, M("#f5ebd6"), -0.2, 4.1, 0));
  plazaGalleon.add(box(0.12, 0.65, 1.2, M("#c6382e"), 0, 6.3, 0));
  s1.add(plazaGalleon);

  // ==================== 2. PRE-1521 COAST (Shot 2) ====================
  const s2 = makeSet("pre_1521_coast");
  s2.add(box(80, 0.2, 80, grassMat, 0, -0.1, 4));
  s2.add(box(140, 0.2, 70, seaMat, 0, -0.18, -44));
  s2.add(makeBahayKubo(-5.8, -5.8, 0.3, 1.0));
  s2.add(makePalmTree(-8.4, -1.5, 6.2, 5));
  s2.add(makePalmTree(7.6, -4.5, 5.8, 6));
  // Woven basket with fresh chicken on wooden stump
  s2.add(cyl(0.7, 0.78, 0.85, 10, M("#7a5234"), -1.4, 0.42, 0.8));
  s2.add(cyl(0.64, 0.48, 0.42, 12, M("#c69854"), -1.4, 1.02, 0.8));
  const rawChick = makeDrumstick(0.95, "#e8b48c");
  rawChick.position.set(-1.4, 1.32, 0.8); rawChick.rotation.z = 0.4;
  s2.add(rawChick);
  // Comical ghost modern refrigerator (dashed/translucent cyan-white) that gets X'd out!
  const ghostFridge = new THREE.Group();
  ghostFridge.position.set(1.6, 0, 0.4);
  const fMat = UNLIT(new THREE.Color(0.86, 0.94, 1.0), null, true, 0.58);
  const fBody = box(1.5, 2.8, 1.2, fMat, 0, 1.4, 0);
  fBody.layers.set(NOINK);
  ghostFridge.add(fBody);
  ghostFridge.add(box(1.54, 0.06, 1.24, M("#5c7490"), 0, 1.85, 0));
  ghostFridge.add(box(0.08, 0.52, 0.14, M("#7c94b0"), -0.58, 2.22, 0.66));
  ghostFridge.add(box(0.08, 0.78, 0.14, M("#7c94b0"), -0.58, 1.25, 0.66));
  s2.add(ghostFridge);

  // ==================== 3 & 7. PALAYOK HEARTH (Shots 3 & 7) ====================
  const s3 = makeSet("palayok_hearth");
  s3.add(box(24, 0.2, 24, woodFloorMat, 0, -0.1, 0));
  const sawaliWall = M("#ffffff", rep(sawaliHD("sawaliInterior"), 4, 2));
  s3.add(box(18, 8, 0.4, sawaliWall, 0, 4, -5.2));
  s3.add(box(0.4, 8, 16, sawaliWall, -8.5, 4, 0));
  s3.add(box(0.4, 8, 16, sawaliWall, 8.5, 4, 0));
  // Dapogan clay hearth counter
  s3.add(box(5.6, 1.15, 2.6, stuccoAdobe, 0, 0.58, -0.4));
  s3.add(box(5.8, 0.14, 2.8, M("#8a684c"), 0, 1.18, -0.4));
  // Glowing embers + firewood under the palayok
  const emberMat = UNLIT(new THREE.Color(2.4, 0.82, 0.24));
  const ember = sph(0.62, 10, emberMat, 0, 1.32, -0.2);
  ember.scale.set(1.2, 0.45, 1.1);
  ember.layers.set(NOINK);
  s3.add(ember);
  for (const ang of [-0.45, 0.45]) {
    const log = cyl(0.11, 0.12, 1.35, 7, M("#4a2d1c"), 0, 1.32, -0.2);
    log.rotation.z = Math.PI / 2; log.rotation.y = ang;
    s3.add(log);
  }
  const hearthSauceRef = { mat: M("#f0e4c8") };
  const hearthPot = makePalayok("#f0e4c8", 1.18, hearthSauceRef);
  hearthPot.position.set(0, 1.48, -0.2);
  s3.add(hearthPot);
  const hearthSauceMat = hearthSauceRef.mat;
  // 3 Hero Ingredients that pop in rhythmically during Shot 3
  const sukaProp = makeBottle("#f2d06b", "#e6dbb8", 1.1);
  sukaProp.position.set(-2.0, 1.25, 0.15);
  s3.add(sukaProp);
  const bawangProp = new THREE.Group();
  bawangProp.position.set(1.65, 1.42, 0.35);
  for (const [bx, bz] of [[0, 0], [0.24, 0.14], [-0.22, 0.16]]) {
    const bulb = sph(0.22, 10, M("#f5efe2"), bx, 0, bz);
    bulb.scale.set(1, 0.85, 1);
    bawangProp.add(bulb);
    bawangProp.add(cyl(0.04, 0.08, 0.24, 6, M("#d8c8a8"), bx, 0.22, bz));
  }
  s3.add(bawangProp);
  const asinProp = new THREE.Group();
  asinProp.position.set(2.35, 1.25, -0.25);
  asinProp.add(cyl(0.42, 0.28, 0.34, 12, M("#8a5632"), 0, 0.17, 0));
  const saltMound = sph(0.36, 10, M("#faf8f2"), 0, 0.32, 0);
  saltMound.scale.set(1, 0.55, 1);
  asinProp.add(saltMound);
  s3.add(asinProp);

  // ==================== 4. WHITE ADOBO TABLE (Shot 4) ====================
  const s4 = makeSet("white_adobo_table");
  s4.add(box(80, 0.2, 80, grassMat, 0, -0.1, 4));
  s4.add(makeBahayKubo(-7.0, -8.0, 0.35, 1.0));
  s4.add(makePalmTree(7.4, -6.5, 6.2, 7));
  s4.add(makePalmTree(-9.0, -3.0, 5.8, 8));
  const t4 = makeWoodTable(4.8, 1.25, 2.2);
  t4.position.set(0, 0, 0.2);
  s4.add(t4);
  s4.add(box(4.2, 0.04, 1.7, bananaMat, 0, 1.36, 0.2));
  // Gleaming bowl of Adobong Puti (clear/ivory broth)
  const whitePot = makePalayok("#f2e8ce", 1.08);
  whitePot.position.set(0, 1.38, 0.2);
  s4.add(whitePot);
  // Sneaking dark soy sauce bottle that gets waved away on "walang toyo"
  const sneakSoy = makeBottle("#2a160e", "#3e2216", 1.05);
  sneakSoy.position.set(1.75, 1.38, 0.35);
  s4.add(sneakSoy);

  // ==================== 5. SPANISH CONVENTO 1613 (Shot 5) ====================
  const s5 = makeSet("spanish_convento");
  s5.add(box(60, 0.2, 60, stoneMat, 0, -0.1, 0));
  // Adobe colonial cloister wall & arches
  s5.add(box(20, 6.2, 1.2, stuccoAdobe, 0, 3.1, -5.6));
  s5.add(box(20.6, 0.7, 2.2, terracottaMat, 0, 6.4, -5.4));
  for (const ax of [-6.5, -2.2, 2.2, 6.5]) {
    s5.add(box(0.95, 5.2, 1.5, stuccoCream, ax, 2.6, -4.9));
  }
  s5.add(makePalmTree(-9.5, -2.5, 6.2, 9));
  s5.add(makePalmTree(9.5, -3.5, 5.8, 10));
  // Wooden lectern with open 1613 dictionary (ZERO text — bookPageHD graphic lines + pot icon)
  s5.add(box(1.1, 1.5, 0.9, M("#6a4224"), 1.2, 0.75, -0.2));
  const bookTop = new THREE.Group();
  bookTop.position.set(1.2, 1.58, -0.1);
  bookTop.rotation.x = 0.26;
  bookTop.add(box(1.55, 0.14, 1.05, M("#5e3222"), 0, 0, 0));
  const pageMat = UNLIT("#ffffff", bookPageHD("dictPage"));
  bookTop.add(box(0.68, 0.06, 0.92, pageMat, -0.36, 0.08, 0));
  bookTop.add(box(0.68, 0.06, 0.92, pageMat, 0.36, 0.08, 0));
  s5.add(bookTop);
  // Giant animated white feather quill
  const quillGroup = new THREE.Group();
  quillGroup.position.set(1.5, 1.95, 0.1);
  const shaft = cyl(0.02, 0.04, 1.15, 6, M("#faf5e8"), 0, 0.45, 0);
  shaft.rotation.z = -0.32;
  quillGroup.add(shaft);
  const plume = box(0.28, 0.72, 0.06, M("#fffcf4"), 0.22, 0.78, 0);
  plume.rotation.z = -0.32;
  quillGroup.add(plume);
  s5.add(quillGroup);
  // Stone pedestal with steaming native clay pot
  s5.add(cyl(0.85, 0.95, 1.1, 10, stuccoCream, -1.2, 0.55, 0.2));
  const p5 = makePalayok("#eee2c4", 0.92);
  p5.position.set(-1.2, 1.12, 0.2);
  s5.add(p5);

  // ==================== 6. TRADE HARBOR (Shot 6) ====================
  const s6 = makeSet("trade_harbor");
  s6.add(box(120, 0.2, 120, seaMat, 0, -0.45, -18));
  // Wooden Manila/Tondo trade pier
  s6.add(box(18, 0.4, 10, woodFloorMat, 0, -0.05, 3.2));
  for (const px of [-7.5, -2.5, 2.5, 7.5]) {
    s6.add(cyl(0.24, 0.28, 2.2, 8, M("#5c3a22"), px, 0.85, -1.6));
  }
  // Wooden crates & ceramic soy sauce jars on pier
  s6.add(box(1.3, 1.1, 1.3, M("#a8703c"), -4.4, 0.65, -0.5));
  s6.add(makeBottle("#28140c", "#6c3622", 1.25)).position.set(0, 0, 0);
  const pierJar = makeBottle("#24120a", "#783c26", 1.2);
  pierJar.position.set(1.5, 0.15, 0.8);
  s6.add(pierJar);
  // Simmering pier palayok whose sauce darkens from ivory to glossy mahogany!
  s6.add(cyl(0.95, 1.1, 0.85, 10, stuccoAdobe, -0.2, 0.52, 0.6));
  const pierSauceRef = { mat: M("#efe2c4") };
  const pierPot = makePalayok("#efe2c4", 1.0, pierSauceRef);
  pierPot.position.set(-0.2, 0.96, 0.6);
  s6.add(pierPot);
  const pierSauceMat = pierSauceRef.mat;
  // Colorful Chinese junk ship docked behind the pier
  const junkShip = new THREE.Group();
  junkShip.position.set(1.5, -0.1, -11.5);
  junkShip.add(box(9.6, 2.2, 3.4, M("#7a3622"), 0, 1.0, 0));
  junkShip.add(box(3.2, 1.5, 3.4, M("#a83428"), 3.2, 2.5, 0));
  junkShip.add(cyl(0.18, 0.22, 8.2, 8, M("#4e2c18"), -0.6, 4.8, 0));
  // Red ribbed junk sail
  const sail = box(0.22, 5.2, 4.6, M("#c6382c"), -0.4, 5.3, 0);
  sail.rotation.y = Math.PI / 2;
  junkShip.add(sail);
  for (let r = -1.8; r <= 1.8; r += 0.9) {
    junkShip.add(box(4.8, 0.12, 0.34, M("#4c2a18"), -0.4, 5.3 + r, 0));
  }
  // Glowing warm lanterns on the ship
  const lanternMat = UNLIT(new THREE.Color(2.2, 1.1, 0.38));
  for (const lx of [-3.6, 3.8]) {
    const l = sph(0.38, 10, lanternMat, lx, 3.6, 1.6);
    l.layers.set(NOINK);
    junkShip.add(l);
  }
  s6.add(junkShip);

  // ==================== 8. LOST NAME ARCHIVE (Shot 8) ====================
  const s8 = makeSet("lost_name_archive");
  s8.add(box(50, 0.2, 50, stoneMat, 0, -0.1, 0));
  s8.add(box(18, 7.0, 1.2, stuccoAdobe, 0, 3.5, -5.8));
  s8.add(makeWoodTable(3.8, 1.2, 1.8)).position.set(0, 0, -0.6);
  const archTable = makeWoodTable(3.8, 1.2, 1.8);
  archTable.position.set(0, 0, -0.6);
  s8.add(archTable);
  const lamp8 = sph(0.32, 10, UNLIT(new THREE.Color(2.2, 1.35, 0.55)), -1.4, 1.62, -0.6);
  lamp8.layers.set(NOINK);
  s8.add(lamp8);
  // Floating ancient scroll drifting upward into twilight mist
  const floatingScroll = new THREE.Group();
  floatingScroll.position.set(0.35, 2.35, -0.5);
  floatingScroll.add(box(1.45, 1.85, 0.08, UNLIT("#f6e7c4", bookPageHD("scrollPage")), 0, 0, 0));
  const topRod = cyl(0.10, 0.10, 1.72, 10, M("#7a4a24"), 0, 0.94, 0);
  topRod.rotation.z = Math.PI / 2;
  floatingScroll.add(topRod);
  const botRod = cyl(0.10, 0.10, 1.72, 10, M("#7a4a24"), 0, -0.94, 0);
  botRod.rotation.z = Math.PI / 2;
  floatingScroll.add(botRod);
  s8.add(floatingScroll);

  // ==================== 9. VINEGAR SCIENCE STAGE (Shot 9) ====================
  const s9 = makeSet("vinegar_science");
  s9.add(box(50, 0.2, 50, M("#2c3852"), 0, -0.1, 0));
  s9.add(cyl(2.2, 2.6, 0.85, 20, M("#d8cbb4"), 0, 0.42, 0));
  s9.add(cyl(1.85, 1.85, 0.12, 20, M("#f4ece0"), 0, 0.88, 0));
  // Hero giant chicken drumstick floating above pedestal
  const heroDrumstick = makeDrumstick(2.6, "#8f4a22");
  heroDrumstick.position.set(0, 2.15, 0);
  s9.add(heroDrumstick);
  // Sleek translucent golden vinegar acid shield ring (never occludes drumstick)
  const shieldMat = UNLIT(new THREE.Color(1.45, 1.18, 0.35), null, true, 0.32);
  const acidShield = new THREE.Mesh(new THREE.TorusGeometry(1.45, 0.09, 12, 32), shieldMat);
  acidShield.position.set(0, 2.15, 0);
  acidShield.layers.set(NOINK);
  s9.add(acidShield);

  // ==================== 10. KITCHEN FRIDGE ANALOGY (Shot 10) ====================
  const s10 = makeSet("kitchen_fridge");
  s10.add(box(24, 0.2, 24, M("#d8cbb8"), 0, -0.1, 0));
  s10.add(box(18, 7.5, 0.4, stuccoCream, 0, 3.75, -4.4));
  // Sunny kitchen counter
  s10.add(box(11, 1.25, 2.2, M("#e8dfd0"), 0, 0.62, -1.6));
  s10.add(box(11.2, 0.16, 2.35, M("#8e5b34"), 0, 1.30, -1.6));
  // Open pastel-teal cartoon refrigerator on left
  const fridge = new THREE.Group();
  fridge.position.set(-2.0, 0, -1.4);
  fridge.add(box(1.9, 3.5, 1.6, M("#6cb4b8"), 0, 1.75, 0));
  fridge.add(box(1.65, 3.1, 0.2, UNLIT("#eaf6fa"), 0, 1.75, 0.72));
  const door = box(1.8, 3.4, 0.18, M("#5aa0a6"), -1.55, 1.75, 1.25);
  door.rotation.y = 0.65;
  fridge.add(door);
  s10.add(fridge);
  // Melting ice cubes on counter (crossed out on "imbes na yelo")
  const iceCubes = new THREE.Group();
  iceCubes.position.set(-0.35, 1.54, -1.1);
  const iceMat = UNLIT(new THREE.Color(0.75, 0.94, 1.15), null, true, 0.85);
  for (const [ix, iy, iz] of [[-0.28, 0, 0], [0.22, 0, 0.15], [0, 0.36, 0.05]]) {
    const c = box(0.38, 0.38, 0.38, iceMat, ix, iy, iz);
    c.rotation.y = ix * 1.4;
    iceCubes.add(c);
  }
  s10.add(iceCubes);
  // Hero glowing Suka bottle + Palayok on right
  const sukaHero = new THREE.Group();
  sukaHero.position.set(1.75, 1.38, -1.1);
  sukaHero.add(makeBottle("#f4d060", "#f4ebd4", 1.25));
  const p10 = makePalayok("#68321a", 0.68);
  p10.position.set(0.95, 0, 0.25);
  sukaHero.add(p10);
  s10.add(sukaHero);

  // ==================== 11. REGIONAL FEAST (Shot 11) ====================
  const s11 = makeSet("regional_feast");
  s11.add(box(80, 0.2, 80, grassMat, 0, -0.1, 4));
  s11.add(makeBahayKubo(-8.0, -9.0, 0.3, 1.0));
  s11.add(makeBahayKubo(8.2, -9.2, -0.35, 1.0));
  s11.add(makePalmTree(-10.5, -3.5, 6.2, 11));
  s11.add(makePalmTree(10.5, -3.5, 6.0, 12));
  // Grand festive banana-leaf feast table (waist-height so cooks behind it are 100% visible!)
  const t11 = makeWoodTable(9.4, 0.92, 2.0);
  t11.position.set(0, 0, 0.4);
  s11.add(t11);
  s11.add(box(8.8, 0.05, 1.6, bananaMat, 0, 1.03, 0.4));
  // 3 Regional Adobo Clay Pots: Puti (left), Bicol Gata (center), Batangas Dilaw (right)
  const potPuti = makePalayok("#f2e8ce", 0.62);
  potPuti.position.set(-2.6, 1.05, 0.45);
  const potGata = makePalayok("#faf5e6", 0.66);
  potGata.position.set(0, 1.05, 0.45);
  potGata.add(cyl(0.05, 0.02, 0.35, 6, M("#d83028"), 0.82, 0.24, 0.35));
  potGata.add(sph(0.32, 10, M("#5c3a22"), -0.92, 0.24, 0.35));
  const potDilaw = makePalayok("#e8b62c", 0.62);
  potDilaw.position.set(2.6, 1.05, 0.45);
  s11.add(potPuti, potGata, potDilaw);
  const regPots = [potPuti, potGata, potDilaw];

  // ==================== 12. PINOY KITCHEN FINALE (Shot 12) ====================
  const s12 = makeSet("pinoy_kitchen");
  s12.add(box(80, 0.2, 80, grassMat, 0, -0.1, 4));
  // Warm Filipino Bahay-na-Bato wooden dining veranda
  s12.add(box(12.5, 0.55, 8.5, woodFloorMat, 0, 0.28, -0.8));
  s12.add(box(12.5, 6.4, 0.5, stuccoOchre, 0, 3.5, -4.8));
  // Glowing golden Capiz shell heritage windows
  for (const wx of [-3.4, 0, 3.4]) {
    s12.add(box(2.5, 2.6, 0.16, capizMat, wx, 3.6, -4.48));
    s12.add(box(2.7, 0.14, 0.24, M("#5c3820"), wx, 2.28, -4.45));
    s12.add(box(2.7, 0.14, 0.24, M("#5c3820"), wx, 4.92, -4.45));
  }
  // Wooden veranda roof & warm hanging lantern
  s12.add(box(13.6, 0.45, 9.6, terracottaMat, 0, 6.7, -0.8));
  const lamp12 = sph(0.38, 12, UNLIT(new THREE.Color(2.4, 1.65, 0.72)), 0, 5.2, 0.4);
  lamp12.layers.set(NOINK);
  s12.add(lamp12);
  // Family dining table (waist-height so Nanay & family behind it are 100% clear!)
  const t12 = makeWoodTable(4.8, 0.92, 1.9);
  t12.position.set(0, 0.55, 1.15);
  s12.add(t12);
  s12.add(box(4.2, 0.04, 1.5, bananaMat, 0, 1.58, 1.15));
  const finalPot = makePalayok("#5a2a14", 0.65);
  finalPot.position.set(0, 1.60, 1.15);
  s12.add(finalPot);
  // Steaming white rice bowl beside the adobo
  s12.add(cyl(0.45, 0.30, 0.32, 12, M("#faf7f0"), -1.25, 1.74, 1.2));
  const riceMound = sph(0.40, 12, M("#ffffff"), -1.25, 1.90, 1.2);
  riceMound.scale.set(1, 0.60, 1);
  s12.add(riceMound);
  s12.add(makePalmTree(-8.6, -2.5, 6.6, 13));
  s12.add(makePalmTree(8.6, -2.5, 6.4, 14));

  return {
    groups, plazaGalleon, ghostFridge, emberMat, hearthSauceMat,
    sukaProp, bawangProp, asinProp, sneakSoy, quillGroup,
    junkShip, pierSauceMat, floatingScroll, heroDrumstick,
    acidShield, iceCubes, sukaHero, regPots,
  };
}
