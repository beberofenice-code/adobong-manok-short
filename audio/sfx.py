"""Frame-locked procedural SFX & culinary foley for 'Sino Ba Talaga ang Nag-imbento ng Adobong Manok?'.
Every cue is computed directly from out/adobo/timeline.json events.
"""
import numpy as np
from dsp import SR, TAU, ns, rng, place, pan, lp, hp, bp, colored, fades
from instruments import m2f, glock, vibes, timpani, triangle, snare


def _whoosh(dur=0.42, f0=220.0, f1=1200.0, r=None):
    r = r or rng(1)
    n = ns(dur)
    t = np.arange(n) / SR
    noise = colored(n, r, slope=-1.0)
    env = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 1.4
    sig = bp(noise, max(60.0, f0), min(6000.0, f1)) * env
    return fades(sig, 0.04, 0.08)


def _sizzle(dur=1.4, r=None):
    """Warm bubbling/simmering palayok sizzle bed"""
    r = r or rng(7)
    n = ns(dur)
    t = np.arange(n) / SR
    noise = colored(n, r, slope=-0.25)
    sig = bp(noise, 1800.0, 6800.0) * (0.65 + 0.35 * np.sin(TAU * 4.5 * t))
    # Subtle low bubbling pops
    for _ in range(int(dur * 6)):
        ti = r.uniform(0.05, max(0.08, dur - 0.1))
        i0 = ns(ti)
        bl = ns(0.045)
        if i0 + bl < n:
            tb = np.arange(bl) / SR
            fb = r.uniform(180.0, 360.0)
            sig[i0:i0 + bl] += 0.42 * np.sin(TAU * fb * (1 + 2.5 * tb) * tb) * np.exp(-tb * 48.0)
    return fades(sig, 0.12, 0.20) * 0.45


def _splash(dur=0.35, f0=320.0, f1=1600.0, r=None):
    """Liquid vinegar / soy sauce pour splash"""
    r = r or rng(11)
    n = ns(dur)
    t = np.arange(n) / SR
    noise = bp(colored(n, r, slope=-0.6), f0, f1) * np.exp(-t * 7.5)
    plop = np.sin(TAU * (240.0 + 480.0 * t) * t) * np.exp(-t * 22.0) * 0.55
    return fades(noise * 0.75 + plop, 0.008, 0.06)


def _comic_pop(f0=340.0, f1=940.0, dur=0.12):
    n = ns(dur)
    t = np.arange(n) / SR
    f = f0 * (f1 / f0) ** (t / dur)
    return fades(np.sin(np.cumsum(TAU * f / SR)) * np.exp(-t * 14.0), 0.003, 0.02)


def _boing(f0=220.0, f1=540.0, dur=0.28):
    """Cartoon bounce when bacteria hit the vinegar shield"""
    n = ns(dur)
    t = np.arange(n) / SR
    f = f0 + (f1 - f0) * (1 - np.exp(-t * 14.0)) + 45.0 * np.sin(TAU * 18.0 * t)
    return fades(np.sin(np.cumsum(TAU * f / SR)) * np.exp(-t * 7.5), 0.004, 0.04)


def _buzzer(freq=175.0, dur=0.36):
    n = ns(dur)
    t = np.arange(n) / SR
    sig = np.tanh(2.2 * (np.sin(TAU * freq * t) + 0.5 * np.sin(TAU * freq * 2.02 * t)))
    return lp(fades(sig, 0.01, 0.07), 1600.0) * 0.58


def _chime(freq=880.0, dur=0.85):
    n = ns(dur)
    t = np.arange(n) / SR
    sig = (
        np.sin(TAU * freq * t) * np.exp(-t * 4.5)
        + 0.4 * np.sin(TAU * freq * 2.0 * t) * np.exp(-t * 7.5)
    )
    return fades(sig, 0.004, 0.06)


def _quill_scratch(dur=0.45, r=None):
    r = r or rng(23)
    n = ns(dur)
    t = np.arange(n) / SR
    env = 0.5 + 0.5 * np.sin(TAU * 9.0 * t)
    return fades(bp(colored(n, r, slope=-0.2), 1400.0, 4800.0) * env, 0.03, 0.06) * 0.45


def render_sfx(tl):
    fps = float(tl["fps"])
    dur = float(tl["duration_s"])
    N = ns(dur)
    out = np.zeros((2, N), dtype=np.float64)
    ev = tl["events"]
    r = rng(9002)
    cues = []

    def add(sig, frame_or_s, label, gain=0.75, p=0.0, is_sec=False):
        t = float(frame_or_s) if is_sec else float(frame_or_s) / fps
        if sig.ndim == 1:
            sig = pan(sig, p)
        place(out, sig, t, gain)
        cues.append((t, label))

    # Shot 1: Sizzling palayok + hero sparkle + post-hook flash whoosh
    add(_sizzle(2.2, r), 10, "Palayok simmer (Shot 1)", 0.48, 0.0)
    add(_chime(880.0, 0.7), ev["F_ADOBONG_MANOK"], "Hero adobo sparkle", 0.52, 0.15)
    add(_whoosh(0.45, 280, 1800, r), 190, "Post-hook white flash whoosh", 0.72, 0.0)

    # Shot 2: Comical buzzer when modern refrigerator gets X'd out in pre-1521
    add(_buzzer(175.0, 0.34), ev["F_NO_REF"], "No-refrigerator comic buzz", 0.58, 0.2)

    # Shot 3: Bubbling hearth + 3 rhythmic ingredient pops (suka, bawang, asin)
    add(_sizzle(3.4, r), 390, "Dapogan clay pot simmer", 0.52, 0.0)
    add(_splash(0.35, 360, 1800, r), ev["F_SUKA"], "Vinegar (suka) splash", 0.68, -0.25)
    add(_comic_pop(420, 980, 0.12), ev["F_BAWANG"], "Garlic (bawang) pop-in", 0.62, 0.2)
    add(_comic_pop(540, 1200, 0.12), ev["F_ASIN"], "Salt (asin) pop-in", 0.62, 0.3)

    # Shot 4: Soy sauce bottle pushed away + fresh sparkle
    add(_whoosh(0.28, 300, 1400, r), ev["F_WALANG_TOYO"], "Push away soy sauce whoosh", 0.58, 0.25)
    add(_chime(1046.5, 0.65), ev["F_ARAW"], "Fresh days-long sparkle", 0.48, 0.1)

    # Shot 5: 1613 Convento — Padre Pedro tastes & scribbles with quill!
    add(_comic_pop(380, 920, 0.14), ev["F_NATIKMAN"], "Padre Pedro delighted taste pop", 0.60, 0.0)
    add(_chime(784.0, 0.8), ev["F_ADOBO_NAT"], "1613 naming chime", 0.54, 0.15)
    add(_quill_scratch(0.65, r), ev["F_ADOBAR"], "Quill writing in 1613 dictionary", 0.55, 0.2)

    # Shot 6: Trade harbor — soy sauce pour splash & glossy sizzle!
    add(_splash(0.45, 260, 1400, r), ev["F_TOYO"], "Chinese soy sauce (toyo) pour", 0.72, 0.1)
    add(_sizzle(1.6, r), ev["F_MAITIM"], "Rich dark sauce sizzle", 0.50, 0.0)

    # Shot 7: Mabuti na lang warm chime + simmer
    add(_chime(659.25, 0.85), ev["F_MABUTI"], "Mabuti warm chime", 0.50, 0.0)
    add(_sizzle(2.4, r), ev["F_MABUTI"] + 6, "Savory palayok simmer", 0.46, 0.0)

    # Shot 8: Masama nga lang — mysterious drift whoosh
    add(_whoosh(0.55, 180, 900, r), ev["F_MASAMA"], "Masama twist whoosh", 0.62, 0.0)
    add(_whoosh(0.65, 220, 1100, r), ev["F_NAKALIMUTAN"], "Forgotten name scroll drift", 0.54, 0.15)

    # Shot 9: Vinegar science — acid shield ring + cartoon bacteria bounce!
    add(_chime(987.7, 0.75), ev["F_ASIDO"], "Vinegar acid shield chime", 0.56, 0.0)
    add(_boing(220, 560, 0.28), ev["F_BAKTERYA"], "Bacteria bounce off shield", 0.68, -0.25)
    add(_boing(260, 620, 0.26), ev["F_BAKTERYA"] + 7, "Second bacteria bounce", 0.58, 0.25)
    add(_chime(1174.6, 0.6), ev["F_PINAPALAMBOT"], "Tender chicken sparkle", 0.48, 0.1)

    # Shot 10: Fridge analogy — ice buzz + suka shield pop
    add(_buzzer(190.0, 0.28), ev["F_YELO"], "Cross out ice cubes", 0.48, -0.2)
    add(_chime(880.0, 0.8), ev["F_PANANGGA"], "Suka shield glow", 0.56, 0.2)

    # Shot 11: Regional feast — 3 cheerful pops (Puti, Bicol Gata, Batangas Dilaw)
    add(_comic_pop(440, 880, 0.12), ev["F_REG_PUTI"], "Adobong Puti pop", 0.58, -0.3)
    add(_comic_pop(520, 1040, 0.12), ev["F_REG_GATA"], "Bicol Gata pop", 0.62, 0.0)
    add(_comic_pop(600, 1200, 0.12), ev["F_REG_DILAW"], "Batangas Dilaw pop", 0.58, 0.3)

    # Shot 12: Golden family finale — warm dinner chime & sparkle on "nanay mo"
    add(_sizzle(2.0, r), ev["F_KUSINA"], "Family table warm simmer", 0.38, 0.0)
    add(_chime(1046.5, 1.1), ev["F_NANAY"], "Nanay finale warm sparkle", 0.60, 0.0)

    return hp(lp(out, 15000.0), 32.0), sorted(cues, key=lambda x: x[0])
