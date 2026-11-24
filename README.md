# Sino Ba Talaga ang Nag-imbento ng Adobong Manok?

A 76.7-second vertical (1440×2560, 30 fps) 2D-characters-in-a-painted-3D-world animated history short in **Tagalog**, built with **Three.js + Remotion** and voiced with **ElevenLabs `eleven_v4`**.

## Highlights
- **12 handcrafted 3D storybook shots** across 11 modular painted sets: tropical pre-colonial *bahay kubo* plaza, pre-1521 coast, *dapogan* clay-pot hearth, sun-drenched *Adobong Puti* table, 1613 Spanish *convento* (Padre Pedro de San Buenaventura), Manila/Tondo trade harbor with Chinese junk ship, dusk lost-name archive, stylized vinegar-acid science stage, sunny kitchen fridge analogy, festive 3-region showcase (*Puti*, Bicol *Gata*, Batangas *Dilaw*), and golden-hour Filipino family veranda finale.
- **Zero captions or text overlays** anywhere on screen.
- **Custom procedural audio** (`audio/music.py`, `audio/sfx.py`, `audio/mix.py`): Filipino rondalla-inspired folk score, culinary sizzle/splash/boing foley, BS.1770-4 normalized to `-15.0 LUFS` with `-1.2 dBTP` ceiling.

## Build & Reproduce
```bash
npm ci
npm run typecheck
node scripts/export_timeline.mjs
python3 scripts/gen_voice_v4.py --script SCRIPT.md --out-dir voice --model eleven_v4 --speed 1.18
python3 audio/mix.py
node scripts/render.mjs stills --out out/adobo/stills --scale 0.5
node scripts/render.mjs full --scale 4/3 --audio out/adobo/audio/mix.wav --out out/adobo/adobong-manok-2k.mp4
python3 scripts/short_qa.py out/adobo/adobong-manok-2k.mp4 out/adobo/qa out/adobo/shots_qa.json
```
