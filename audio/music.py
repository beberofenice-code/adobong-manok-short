"""Original synthesized Filipino rondalla-inspired folk/storyteller score for
'Sino Ba Talaga ang Nag-imbento ng Adobong Manok?'.
All cues and section boundaries follow out/adobo/timeline.json deterministically.
"""
import numpy as np
from dsp import SR, ns, rng, place, pan, lp, hp, make_ir, convolve_st
from instruments import m2f, pluck, vibes, glock, brass, timpani, brush, snare, pad, triangle


def build_sections(tl):
    fps = float(tl["fps"])
    shots = {s["id"]: (s["a"] / fps, s["b"] / fps) for s in tl["shots"]}
    return [
        ("hook",       shots[1][0],  shots[1][1]),
        ("pre1521",    shots[2][0],  shots[2][1]),
        ("hearth",     shots[3][0],  shots[3][1]),
        ("whiteadobo", shots[4][0],  shots[4][1]),
        ("convento",   shots[5][0],  shots[5][1]),
        ("harbor",     shots[6][0],  shots[6][1]),
        ("mabuti",     shots[7][0],  shots[7][1]),
        ("masama",     shots[8][0],  shots[8][1]),
        ("science",    shots[9][0],  shots[9][1]),
        ("fridge",     shots[10][0], shots[10][1]),
        ("regional",   shots[11][0], shots[11][1]),
        ("finale",     shots[12][0], shots[12][1]),
    ]


def render_music(tl):
    dur = float(tl["duration_s"])
    N = ns(dur)
    out = np.zeros((2, N), dtype=np.float64)
    r = rng(20261124)
    secs = dict((name, (a, b)) for name, a, b in build_sections(tl))

    def add(sig, t, gain=1.0, p=0.0):
        if sig.ndim == 1:
            sig = pan(sig, p)
        place(out, sig, t, gain)

    # 1. Hook (Shot 1): Bright upbeat G-major Filipino rondalla-style plucked march
    a, b = secs["hook"]
    t, k = a, 0
    bass = [55, 50, 55, 59, 60, 55, 57, 50]
    mel  = [79, 81, 83, 79, 76, 74, 76, 79]
    while t < b - 0.12:
        add(pluck(m2f(bass[k % len(bass)]), 0.72, r, dur=0.5, bright=0.55), t, 0.52, -0.25)
        if k % 2 == 0:
            add(pluck(m2f(mel[(k // 2) % len(mel)]), 0.65, r, dur=0.65, bright=0.72), t, 0.44, 0.25)
        if k % 2 == 1:
            add(brush(0.45, r, dur=0.16), t, 0.30, 0.08)
        t += 0.30
        k += 1
    add(pad([m2f(55), m2f(59), m2f(62)], b - a, 0.36, r, att=0.4, rel=0.6, warm=950), a, 0.24, 0.0)

    # 2. Pre-1521 blazing coast (Shot 2): Playful warm tropical sway + comical brass bass
    a, b = secs["pre1521"]
    t, k = a, 0
    notes = [62, 65, 69, 67, 65, 62, 60, 62]
    while t < b - 0.15:
        if k % 2 == 0:
            add(brass(m2f(45 if (k // 2) % 2 == 0 else 50), 0.34, 0.55, r, kind="tuba"), t, 0.36, -0.18)
        add(vibes(m2f(notes[k % len(notes)]), 0.52, r, dur=0.8), t, 0.32, 0.22 if k % 2 == 0 else -0.22)
        if k % 4 == 3:
            add(triangle(0.35, r, dur=0.25), t, 0.24, 0.3)
        t += 0.34
        k += 1

    # 3. Palayok Hearth (Shot 3): Cozy rustic plucked groove building as ingredients pop in
    a, b = secs["hearth"]
    t, k = a, 0
    pat = [57, 60, 64, 60, 55, 59, 62, 59]
    while t < b - 0.12:
        add(pluck(m2f(pat[k % len(pat)]), 0.68, r, dur=0.55, bright=0.62), t, 0.48, -0.22 if k % 2 == 0 else 0.22)
        if k % 4 == 0:
            add(timpani(m2f(45), 0.58, r, dur=0.9), t, 0.36, 0.0)
        if k % 4 == 2:
            add(snare(0.38, r), t, 0.26, 0.1)
        t += 0.28
        k += 1
    add(pad([m2f(57), m2f(64), m2f(69)], b - a, 0.34, r, att=0.4, rel=0.6, warm=850), a, 0.22, 0.0)

    # 4. White Adobo Table (Shot 4): Crisp sunny pizzicato + sparkling glockenspiel
    a, b = secs["whiteadobo"]
    t, k = a, 0
    g_mel = [72, 76, 79, 84, 79, 76, 74, 72]
    while t < b - 0.12:
        add(pluck(m2f(g_mel[k % len(g_mel)] - 12), 0.65, r, dur=0.5, bright=0.65), t, 0.46, -0.2)
        if k % 2 == 0:
            add(glock(m2f(g_mel[(k // 2) % len(g_mel)]), 0.45, r, dur=0.7), t, 0.28, 0.28)
        t += 0.30
        k += 1

    # 5. Spanish Convento 1613 (Shot 5): Playful Spanish/classical waltz-like plucked guitar + chimes
    a, b = secs["convento"]
    t, k = a, 0
    # E-Phrygian / A-minor Spanish-colonial flavor
    bass5 = [45, 52, 52, 40, 47, 47, 45, 52, 52, 43, 50, 50]
    mel5  = [69, 71, 72, 76, 72, 71, 69, 68, 69, 71, 72, 76]
    while t < b - 0.15:
        add(pluck(m2f(bass5[k % len(bass5)]), 0.72, r, dur=0.6, bright=0.58), t, 0.48, -0.25)
        add(pluck(m2f(mel5[k % len(mel5)]), 0.62, r, dur=0.65, bright=0.75), t, 0.40, 0.25)
        if k % 3 == 0:
            add(vibes(m2f(mel5[k % len(mel5)] + 12), 0.42, r, dur=0.8), t, 0.26, 0.15)
        t += 0.32
        k += 1
    add(pad([m2f(45), m2f(52), m2f(60)], b - a, 0.35, r, att=0.5, rel=0.7, warm=900), a, 0.24, 0.0)

    # 6. Trade Harbor (Shot 6): Lively pentatonic sea-trade groove (Chinese merchant toyo arrival!)
    a, b = secs["harbor"]
    t, k = a, 0
    pent = [62, 64, 67, 69, 74, 69, 67, 64]
    while t < b - 0.12:
        add(pluck(m2f(pent[k % len(pent)]), 0.70, r, dur=0.55, bright=0.78), t, 0.48, 0.24 if k % 2 == 0 else -0.24)
        if k % 4 == 0:
            add(timpani(m2f(50), 0.62, r, dur=0.9), t, 0.40, -0.1)
            add(glock(m2f(pent[(k // 2) % len(pent)] + 12), 0.44, r, dur=0.7), t, 0.26, 0.3)
        t += 0.26
        k += 1

    # 7. Mabuti na lang (Shot 7): Warm comforting major swell
    a, b = secs["mabuti"]
    add(pad([m2f(53), m2f(57), m2f(60), m2f(65)], b - a, 0.50, r, att=0.35, rel=0.7, warm=1150), a, 0.32, 0.0)
    for k, note in enumerate([65, 69, 72, 77, 72, 69]):
        tk = a + k * ((b - a) / 6.2)
        if tk < b - 0.1:
            add(vibes(m2f(note), 0.55, r, dur=1.1), tk, 0.36, -0.2 if k % 2 == 0 else 0.2)

    # 8. Masama nga lang (Shot 8): Quirky deadpan minor misterioso pluck
    a, b = secs["masama"]
    add(pad([m2f(45), m2f(48), m2f(52)], b - a, 0.42, r, att=0.3, rel=0.7, warm=680), a, 0.28, 0.0)
    t, k = a, 0
    m8 = [69, 68, 65, 64, 60, 62]
    while t < b - 0.15:
        add(pluck(m2f(m8[k % len(m8)]), 0.60, r, dur=0.6, bright=0.45), t, 0.42, -0.22 if k % 2 == 0 else 0.22)
        t += 0.38
        k += 1

    # 9. Vinegar Science (Shot 9): Punchy playful bouncy science rhythm
    a, b = secs["science"]
    t, k = a, 0
    sci = [57, 60, 62, 64, 67, 64, 62, 60]
    while t < b - 0.12:
        add(pluck(m2f(sci[k % len(sci)]), 0.72, r, dur=0.45, bright=0.8), t, 0.46, 0.2 if k % 2 == 0 else -0.2)
        if k % 2 == 0:
            add(snare(0.35, r), t, 0.25, 0.0)
        if k % 4 == 0:
            add(glock(m2f(sci[k % len(sci)] + 12), 0.48, r, dur=0.6), t, 0.30, -0.28)
        t += 0.25
        k += 1

    # 10. Kitchen Fridge Analogy (Shot 10): Cheerful sunny domestic kitchen bounce
    a, b = secs["fridge"]
    t, k = a, 0
    fr = [60, 64, 67, 72, 67, 64, 62, 67]
    while t < b - 0.12:
        add(pluck(m2f(fr[k % len(fr)]), 0.66, r, dur=0.5, bright=0.65), t, 0.45, -0.2)
        if k % 2 == 1:
            add(brush(0.42, r, dur=0.16), t, 0.28, 0.15)
        t += 0.28
        k += 1

    # 11. Regional Feast (Shot 11): Festive fiesta march building energy across Puti, Bicol, Batangas!
    a, b = secs["regional"]
    t, k = a, 0
    fiesta = [67, 71, 74, 79, 76, 74, 71, 74]
    while t < b - 0.12:
        add(pluck(m2f(fiesta[k % len(fiesta)] - 12), 0.74, r, dur=0.5, bright=0.72), t, 0.50, -0.25)
        add(vibes(m2f(fiesta[k % len(fiesta)]), 0.56, r, dur=0.75), t, 0.36, 0.25)
        if k % 2 == 0:
            add(snare(0.42, r), t, 0.28, 0.0)
        if k % 4 == 2:
            add(triangle(0.4, r, dur=0.25), t, 0.26, 0.28)
        t += 0.27
        k += 1

    # 12. Pinoy Kitchen Finale (Shot 12): Heartwarming golden Filipino home acoustic swell + resolved cadence
    a, b = secs["finale"]
    chords = [[55, 59, 62, 67], [60, 64, 67, 72], [57, 60, 64, 69], [55, 59, 62, 67]]
    dc = (b - a) / len(chords)
    for idx, ch in enumerate(chords):
        tc = a + idx * dc
        add(pad([m2f(m) for m in ch[:3]], dc + 0.45, 0.54, r, att=0.35, rel=0.9, warm=1200), tc, 0.34, 0.0)
        for j, note in enumerate(ch):
            add(pluck(m2f(note + 12), 0.62, r, dur=0.85, bright=0.70), tc + j * 0.22, 0.38, -0.25 + j * 0.16)
    # Warm resolved final chord bell at the very end
    add(vibes(m2f(79), 0.62, r, dur=1.8), b - 1.4, 0.44, 0.0)
    add(glock(m2f(83), 0.42, r, dur=1.4), b - 1.35, 0.26, 0.2)

    # Gentle warm room reverb & clean spectral shaping
    ir = make_ir(1.1, 42)
    wet = convolve_st(out, ir)
    mix = 0.80 * out + 0.20 * wet
    mix = hp(mix, 36.0)
    mix = lp(mix, 14500.0)
    return mix
