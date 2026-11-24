// Unified Three.js scene controller for "Sino Ba Talaga ang Nag-imbento ng Adobong Manok?".
// Poses the active modular 3D set, sky/clouds/fog, camera-relative frozen sun, dynamic props,
// and cast billboard sprites as a pure deterministic function of (shotId, frame).
import * as THREE from "three";
import { buildAllSets, BuiltSets } from "./build";
import { ctex, cloudHD } from "./paint";
import { LIGHTS, LOOK, LightMode } from "./lights";
import { TONE, CHAR } from "./shade";
import { NOINK } from "./ink";
import { Pool, Actor, Fx, stageShot, CamInfo } from "./cast";
import {
  FPS, SHOTS, camAt, clamp01, smooth,
  F_NO_REF, F_SUKA, F_BAWANG, F_ASIN, F_WALANG_TOYO, F_ADOBO_NAT,
  F_TOYO, F_MAITIM, F_NAKALIMUTAN, F_ASIDO, F_YELO, F_PANANGGA,
  F_REG_PUTI, F_REG_GATA, F_REG_DILAW,
} from "./story";

const discTex = () => ctex("sunDisc", 128, 128, (g) => {
  const gr = g.createRadialGradient(64, 64, 58, 64, 64, 64);
  gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
}, false);

const haloTex = () => ctex("sunHalo", 256, 256, (g) => {
  const im = g.createImageData(256, 256);
  for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
    const u = Math.hypot(x - 127.5, y - 127.5) / 128;
    const a = (0.55 * Math.exp(-((u / 0.25) ** 2)) + 0.35 * Math.exp(-((u / 0.6) ** 2))) * (1 - Math.min(1, Math.max(0, (u - 0.8) / 0.2)));
    const i = (y * 256 + x) * 4;
    im.data[i] = im.data[i + 1] = im.data[i + 2] = 255;
    im.data[i + 3] = Math.round(255 * Math.min(1, a));
  }
  g.putImageData(im, 0, 0);
}, false);

const colIvory = new THREE.Color("#f0e4c8");
const colMahogany = new THREE.Color("#4f2312");

export class World {
  root = new THREE.Group();
  private sets: BuiltSets;
  private pool = new Pool();
  private actors: Actor[] = [];
  private fxs: Fx[] = [];
  private hemi: THREE.HemisphereLight;
  private sun: THREE.DirectionalLight;
  private fill: THREE.DirectionalLight;
  private sky: THREE.Mesh;
  private skyMat: THREE.ShaderMaterial;
  private fog = new THREE.Fog("#b8d0ec", 25, 300);
  private sunDisc: THREE.Sprite;
  private sunHalo: THREE.Sprite;
  private sunCache = new Map<number, THREE.Vector3>();
  private clouds: THREE.Mesh[] = [];
  private cloudMaps: Record<LightMode, THREE.Texture[]>;
  private lastLight: LightMode | null = null;
  private tmpRight = new THREE.Vector3();
  private tmpFwd = new THREE.Vector3();
  private tmpUp = new THREE.Vector3(0, 1, 0);
  private tmpTarget = new THREE.Vector3();

  constructor() {
    const R = this.root;
    this.skyMat = new THREE.ShaderMaterial({
      uniforms: {
        c0: { value: new THREE.Color() }, c1: { value: new THREE.Color() }, c2: { value: new THREE.Color() },
        c3: { value: new THREE.Color() }, c4: { value: new THREE.Color() }, e: { value: new THREE.Vector4() },
      },
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      fragmentShader: `uniform vec3 c0, c1, c2, c3, c4; uniform vec4 e; varying vec3 vP;
        void main(){ float el = asin(clamp(normalize(vP).y, -1.0, 1.0));
          vec3 c = mix(c0, c1, smoothstep(0.0, e.x, el));
          c = mix(c, c2, smoothstep(e.x, e.y, el));
          c = mix(c, c3, smoothstep(e.y, e.z, el));
          c = mix(c, c4, smoothstep(e.z, e.w, el));
          gl_FragColor = vec4(c, 1.0); }`,
      side: THREE.BackSide, depthWrite: false, fog: false,
    });
    this.sky = new THREE.Mesh(new THREE.SphereGeometry(900, 48, 24), this.skyMat);
    this.sky.renderOrder = -1;
    this.sky.frustumCulled = false;
    this.sky.layers.set(NOINK);
    R.add(this.sky);

    this.sunDisc = new THREE.Sprite(new THREE.SpriteMaterial({ map: discTex(), color: new THREE.Color(6.0, 4.4, 2.4), fog: false, depthWrite: false }));
    this.sunHalo = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTex(), color: new THREE.Color(1, 1, 1), fog: false, depthWrite: false, depthTest: true, transparent: true, blending: THREE.AdditiveBlending }));
    this.sunDisc.renderOrder = -0.5;
    this.sunHalo.renderOrder = 5;
    for (const m of [this.sunDisc, this.sunHalo]) { m.frustumCulled = false; m.layers.set(NOINK); R.add(m); }

    this.hemi = new THREE.HemisphereLight("#dcecff", "#b49a78", 0.55);
    this.sun = new THREE.DirectionalLight("#fff3e0", 2.8);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(1024, 1024);
    this.sun.shadow.camera.near = 2;
    this.sun.shadow.camera.far = 130;
    this.sun.shadow.camera.left = -24;
    this.sun.shadow.camera.right = 24;
    this.sun.shadow.camera.top = 24;
    this.sun.shadow.camera.bottom = -24;
    this.fill = new THREE.DirectionalLight("#9fb8ff", 0.35);
    R.add(this.hemi, this.sun, this.sun.target, this.fill, this.fill.target);

    const modes: LightMode[] = ["day", "golden", "interior", "dusk", "storm"];
    this.cloudMaps = Object.fromEntries(modes.map((m) => [m, [0, 1, 2, 3].map((k) => cloudHD(k, LOOK[m].cloud))])) as unknown as Record<LightMode, THREE.Texture[]>;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + 0.35, d = 520 + (i % 3) * 55;
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1),
        new THREE.MeshBasicMaterial({ map: this.cloudMaps.day[i % 4], color: new THREE.Color(1.08, 1.08, 1.08), transparent: true, depthWrite: false, fog: false })
      );
      const w = 125 + (i % 4) * 28;
      m.position.set(Math.cos(a) * d, 95 + (i % 4) * 32, Math.sin(a) * d);
      m.scale.set(w, w / 2, 1);
      m.layers.set(NOINK);
      this.clouds.push(m);
      R.add(m);
    }

    this.sets = buildAllSets(R);
  }

  private sunDirFor(id: number): THREE.Vector3 {
    let dir = this.sunCache.get(id);
    if (!dir) {
      const s = SHOTS[id - 1];
      const L = LIGHTS[s.light];
      const az = ((s.sunAz ?? L.az) * Math.PI) / 180;
      const el = ((s.sunEl ?? L.el) * Math.PI) / 180;
      const c0 = camAt(id, s.a);
      const fw = new THREE.Vector3(c0.look[0] - c0.pos[0], 0, c0.look[2] - c0.pos[2]).normalize();
      if (fw.lengthSq() < 1e-4) fw.set(0, 0, 1);
      const rt = new THREE.Vector3().crossVectors(fw, this.tmpUp).normalize();
      const horiz = fw.clone().multiplyScalar(Math.cos(az)).addScaledVector(rt, Math.sin(az));
      dir = horiz.multiplyScalar(Math.cos(el)).addScaledVector(this.tmpUp, Math.sin(el)).normalize();
      this.sunCache.set(id, dir);
    }
    return dir;
  }

  private applyLight(light: LightMode, scene: THREE.Scene) {
    const L = LIGHTS[light], K = LOOK[light];
    TONE.uLitCol.value.set(...L.lit);
    TONE.uShadeCol.value.set(...L.shade);
    TONE.uShadeLift.value.set(...L.lift);
    TONE.uLambert.value = L.lambert;
    TONE.uSideK.value = L.sideK;
    TONE.uTerm.value = L.term;
    TONE.uBounce.value.set(...K.bounce);
    TONE.uSat.value = K.sat;

    CHAR.uCharTint.value.set(...L.charTint);
    CHAR.uCharShade.value = L.charShade;
    CHAR.uGrad.value = L.charGrad;
    CHAR.uBodyGrad.value = L.bodyGrad;
    CHAR.uSideTint.value.set(...L.sideTint);

    this.hemi.color.set(L.sky);
    this.hemi.groundColor.set(L.ground);
    this.hemi.intensity = L.hemiI;
    this.sun.color.set(L.sunCol);
    this.sun.intensity = L.sunI;
    this.sun.shadow.bias = L.bias;
    this.sun.shadow.normalBias = L.normalBias;
    this.fill.color.set("#9fb8ff");
    this.fill.intensity = 0.35;

    const u = this.skyMat.uniforms;
    u.c0.value.set(K.sky.c[0]); u.c1.value.set(K.sky.c[1]); u.c2.value.set(K.sky.c[2]);
    u.c3.value.set(K.sky.c[3]); u.c4.value.set(K.sky.c[4]);
    const eRad = K.sky.e.map((d) => (d * Math.PI) / 180);
    u.e.value.set(eRad[1], eRad[2], eRad[3], eRad[4]);

    this.fog.color.set(L.fog);
    this.fog.near = L.fogNear;
    this.fog.far = L.fogFar;
    scene.fog = this.fog;
    scene.background = this.fog.color;

    const showClouds = light === "day" || light === "golden" || light === "dusk";
    for (let i = 0; i < this.clouds.length; i++) {
      this.clouds[i].visible = showClouds;
      const mat = this.clouds[i].material as THREE.MeshBasicMaterial;
      mat.map = this.cloudMaps[light][i % 4];
      mat.needsUpdate = true;
    }
    this.lastLight = light;
  }

  update(id: number, f: number, cam: THREE.PerspectiveCamera, scene: THREE.Scene): THREE.Vector3 {
    const s = SHOTS[id - 1];
    const t = f / FPS;

    if (this.lastLight !== s.light) this.applyLight(s.light, scene);

    // 1. Pose camera
    const cp = camAt(id, f);
    cam.position.set(...cp.pos);
    cam.fov = cp.fov;
    cam.updateProjectionMatrix();
    this.tmpTarget.set(...cp.look);
    cam.up.set(Math.sin(cp.roll), Math.cos(cp.roll), 0);
    cam.lookAt(this.tmpTarget);
    cam.updateMatrixWorld();

    this.tmpFwd.subVectors(this.tmpTarget, cam.position).normalize();
    this.tmpRight.crossVectors(this.tmpFwd, this.tmpUp).normalize();

    // 2. Position sky, clouds, and frozen per-shot camera-relative sun
    this.sky.position.copy(cam.position);
    const sdir = this.sunDirFor(id);
    this.sun.position.copy(this.tmpTarget).addScaledVector(sdir, 46);
    this.sun.target.position.copy(this.tmpTarget);
    this.sun.target.updateMatrixWorld();
    this.fill.position.copy(this.tmpTarget).addScaledVector(sdir, -32).add(new THREE.Vector3(0, 18, 0));
    this.fill.target.position.copy(this.tmpTarget);
    this.fill.target.updateMatrixWorld();

    const showSun = s.light === "golden" || s.light === "dusk";
    this.sunDisc.visible = showSun;
    this.sunHalo.visible = showSun;
    if (showSun) {
      this.sunDisc.position.copy(cam.position).addScaledVector(sdir, 720);
      this.sunDisc.scale.set(62, 62, 1);
      this.sunHalo.position.copy(cam.position).addScaledVector(sdir, 690);
      this.sunHalo.scale.set(220, 220, 1);
    }
    for (let i = 0; i < this.clouds.length; i++) {
      this.clouds[i].lookAt(cam.position);
    }

    // 3. Toggle active 3D set & animate set-specific props
    for (const [k, g] of Object.entries(this.sets.groups)) {
      g.visible = k === s.set;
    }

    // Shot 1: Distant Spanish galleon rocks gently on the bay
    this.sets.plazaGalleon.rotation.z = Math.sin(t * 1.4) * 0.04;
    this.sets.plazaGalleon.position.x = 6.5 - smooth(f / 194) * 2.2;

    // Shot 2: Ghost refrigerator shakes and fades/shrinks after F_NO_REF
    const refFade = smooth((f - F_NO_REF) / 22);
    this.sets.ghostFridge.scale.setScalar(Math.max(0.01, 1 - refFade * 0.35));
    this.sets.ghostFridge.rotation.y = Math.sin(t * 3.5) * 0.08 + refFade * 0.4;

    // Shots 3 & 7: Bubbling embers, sauce color (ivory in Shot 3 -> glossy mahogany in Shot 7), ingredient pop-ins
    const flicker = 0.88 + 0.14 * Math.sin(t * 11) + 0.08 * Math.cos(t * 17);
    this.sets.emberMat.color.setRGB(2.4 * flicker, 0.82 * flicker, 0.24 * flicker);
    if (id === 3) {
      this.sets.hearthSauceMat.color.copy(colIvory);
      this.sets.sukaProp.visible = f >= F_SUKA;
      this.sets.sukaProp.scale.setScalar(smooth((f - F_SUKA) / 10) * 1.1 + 0.01);
      this.sets.bawangProp.visible = f >= F_BAWANG;
      this.sets.bawangProp.scale.setScalar(smooth((f - F_BAWANG) / 10) + 0.01);
      this.sets.asinProp.visible = f >= F_ASIN;
      this.sets.asinProp.scale.setScalar(smooth((f - F_ASIN) / 10) + 0.01);
    } else if (id === 7) {
      this.sets.hearthSauceMat.color.copy(colMahogany);
      this.sets.sukaProp.visible = true; this.sets.sukaProp.scale.setScalar(1.0);
      this.sets.bawangProp.visible = true; this.sets.bawangProp.scale.setScalar(1.0);
      this.sets.asinProp.visible = false;
    }

    // Shot 4: Sneaking soy sauce bottle gets pushed off table on F_WALANG_TOYO
    const pushSoy = smooth((f - F_WALANG_TOYO) / 20);
    this.sets.sneakSoy.position.x = 1.75 + pushSoy * 2.4;
    this.sets.sneakSoy.rotation.z = -pushSoy * 0.9;

    // Shot 5: Padre Pedro's quill scribbles excitedly on F_ADOBO_NAT
    const scribble = f >= F_ADOBO_NAT ? 1 : 0.2;
    this.sets.quillGroup.position.x = 1.5 + Math.sin(t * 14) * 0.14 * scribble;
    this.sets.quillGroup.rotation.z = Math.cos(t * 14) * 0.16 * scribble;

    // Shot 6: Chinese junk rocks on waves; pier pot sauce darkens from ivory to glossy mahogany on F_TOYO -> F_MAITIM!
    this.sets.junkShip.rotation.z = Math.sin(t * 1.6) * 0.035;
    this.sets.junkShip.position.y = -0.1 + Math.sin(t * 1.6 + 0.5) * 0.09;
    const soyMix = smooth((f - F_TOYO) / Math.max(1, F_MAITIM - F_TOYO + 18));
    this.sets.pierSauceMat.color.copy(colIvory).lerp(colMahogany, soyMix);

    // Shot 8: Ancient scroll floats upward into twilight mist after F_NAKALIMUTAN
    const drift = smooth((f - F_NAKALIMUTAN) / 75);
    this.sets.floatingScroll.position.y = 2.2 + drift * 2.8 + Math.sin(t * 2.4) * 0.12;
    this.sets.floatingScroll.rotation.y = Math.sin(t * 1.4) * 0.25 + drift * 0.8;

    // Shot 9: Hero chicken drumstick spins slowly inside pulsing golden vinegar shield
    this.sets.heroDrumstick.rotation.y = t * 0.9;
    this.sets.heroDrumstick.position.y = 2.1 + Math.sin(t * 2.6) * 0.12;
    const shScale = 0.2 + 0.88 * smooth((f - F_ASIDO) / 14) + Math.sin(t * 6) * 0.04;
    this.sets.acidShield.scale.setScalar(clamp01(shScale) * 1.08 + 0.05);

    // Shot 10: Ice cubes shrink/melt on F_YELO; Suka hero bounces up on F_PANANGGA
    const melt = smooth((f - F_YELO) / 28);
    this.sets.iceCubes.scale.set(1 + melt * 0.2, Math.max(0.15, 1 - melt * 0.78), 1 + melt * 0.2);
    const heroPop = 1 + 0.14 * Math.sin(smooth((f - F_PANANGGA) / 16) * Math.PI);
    this.sets.sukaHero.scale.setScalar(heroPop);

    // Shot 11: Regional pots bounce proudly as each region is named (preserve 0.52 tabletop scale!)
    const regFrames = [F_REG_PUTI, F_REG_GATA, F_REG_DILAW];
    for (let i = 0; i < 3; i++) {
      const k = clamp01((f - regFrames[i]) / 18);
      const b = f >= regFrames[i] ? 1 + 0.14 * Math.sin(k * Math.PI) : 1;
      this.sets.regPots[i].scale.setScalar(0.52 * b);
    }

    // 4. Stage & bind 2D cast billboards and FX cards
    const camInfo: CamInfo = { pos: cam.position, right: this.tmpRight, sun: sdir };
    const { places, fxs } = stageShot(id, f, s.light, camInfo);

    while (this.actors.length < places.length) this.actors.push(new Actor(this.root));
    while (this.fxs.length < fxs.length) this.fxs.push(new Fx(this.root));

    for (let i = 0; i < places.length; i++) {
      const pl = places[i];
      this.actors[i].r = this.pool.req(pl.key, pl.size[0], pl.size[1], pl.size[2], pl.draw);
    }
    for (let i = 0; i < fxs.length; i++) {
      const fx = fxs[i];
      this.fxs[i].r = this.pool.req(fx.key, fx.cw, fx.ch, 1, fx.draw);
    }
    this.pool.flush();

    for (let i = 0; i < this.actors.length; i++) {
      const a = this.actors[i];
      if (i < places.length) {
        const pl = places[i];
        a.bind();
        a.mesh.visible = true;
        a.mesh.position.set(pl.x, pl.y, pl.z);
        const sc = pl.scale ?? 1;
        a.mesh.scale.set(pl.mirror ? -sc : sc, sc, sc);
        a.mesh.rotation.set(0, Math.atan2(cam.position.x - pl.x, cam.position.z - pl.z), pl.roll ?? 0);
      } else {
        a.mesh.visible = false;
      }
    }

    for (let i = 0; i < this.fxs.length; i++) {
      const fxm = this.fxs[i];
      if (i < fxs.length) {
        const fp = fxs[i];
        fxm.use(fp.soft ?? true);
        fxm.bind();
        fxm.mesh.visible = true;
        fxm.mesh.position.set(fp.x, fp.y, fp.z);
        fxm.mesh.scale.set(fp.w, fp.h, 1);
        if (fp.flat) {
          fxm.mesh.rotation.set(-Math.PI / 2, 0, fp.rot ?? 0);
        } else {
          fxm.mesh.lookAt(cam.position);
        }
      } else {
        fxm.mesh.visible = false;
      }
    }

    return this.tmpTarget;
  }
}
