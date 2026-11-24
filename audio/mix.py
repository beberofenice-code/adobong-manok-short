#!/usr/bin/env python3
"""Final BS.1770-4 master mix for 'Sino Ba Talaga ang Nag-imbento ng Adobong Manok?'.
Standard cartoon-3d-short mix:
  - Voice unchanged (ElevenLabs eleven_v4 Tagalog narration, gain only)
  - Music +3 dB standard (-10.0 to -10.8 LU relative to voice after -3 dB speech ducking)
  - SFX -6 dB crisp under speech
  - Master normalized to -15.0 LUFS integrated, 4x-oversampled true-peak limit <= -1.2 dBTP
  - Outputs: audio/mix.wav (48 kHz stereo 24-bit), stems, and audio/cues.md
"""
import json
import os
import sys
import time
import numpy as np
from scipy import ndimage, signal

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)

from dsp import SR, ns, st, dbg, read_wav, write_wav, integrated, lra, true_peak
import music as M
import sfx as S

TARGET_LUFS = -15.0
CEIL_DBTP = -1.2
DUCK_DB = -3.0

MUSIC_TARGET = {
    "hook":       -10.2,
    "pre1521":    -10.4,
    "hearth":     -10.4,
    "whiteadobo": -10.4,
    "convento":   -10.4,
    "harbor":     -10.4,
    "mabuti":     -10.6,
    "masama":     -10.6,
    "science":    -10.4,
    "fridge":     -10.4,
    "regional":   -10.2,
    "finale":     -10.0,
}


def log(*a):
    print(f"[{time.strftime('%H:%M:%S')}]", *a, flush=True)


def speech_spans(words, merge=0.28):
    sp = []
    for w in words:
        s, e = float(w["s"]), float(w["e"])
        if sp and s - sp[-1][1] < merge:
            sp[-1][1] = max(sp[-1][1], e)
        else:
            sp.append([s, e])
    return sp


def duck_db(spans, dur, N, depth=DUCK_DB, pre=0.07, post=0.11, att=0.06, rel=0.40):
    ctrl = 1000
    nc = int(dur * ctrl) + 2
    va = np.zeros(nc)
    for s, e in spans:
        va[max(0, int((s - pre) * ctrl)): int((e + post) * ctrl)] = 1.0
    ka, kr = 1 - np.exp(-1 / (att * ctrl)), 1 - np.exp(-1 / (rel * ctrl))
    env = np.zeros(nc)
    e = 0.0
    for i in range(nc):
        tgt = va[i]
        e += (tgt - e) * (ka if tgt > e else kr)
        env[i] = e
    return np.interp(np.arange(N) / SR, np.arange(nc) / ctrl, depth * env)


def limiter(x, ceil_db=CEIL_DBTP, look=0.003, rel=0.08):
    c = dbg(ceil_db)
    n = x.shape[1]
    up = np.abs(signal.resample_poly(x, 4, 1, axis=-1)).max(0)
    pk = np.pad(up, (0, max(0, 4 * n - len(up))))[: 4 * n].reshape(n, 4).max(1)
    gr = np.minimum(1.0, c / np.maximum(pk, 1e-12))
    La = max(1, ns(look))
    g1 = ndimage.minimum_filter1d(gr, 2 * La + 1, mode="nearest")
    g2 = g1.copy()
    idx = np.flatnonzero(g1 < 1.0)
    if len(idx):
        kr = 1 - np.exp(-1 / (rel * SR))
        gap = ns(rel * 8)
        brk = np.flatnonzero(np.diff(idx) > gap)
        starts = np.concatenate([[idx[0]], idx[brk + 1]])
        ends = np.concatenate([idx[brk], [idx[-1]]])
        for a, b_ in zip(starts, ends):
            e = min(n, b_ + gap)
            seg = g1[a:e]
            out = np.empty(len(seg))
            g = 1.0
            for k in range(len(seg)):
                g = min(seg[k], g + (1 - g) * kr)
                out[k] = g
            g2[a:e] = out
    g3 = np.minimum(ndimage.uniform_filter1d(g2, 2 * La + 1, mode="nearest"), 1.0)
    return x * g3[None, :], g3


def main():
    tl = json.load(open(os.path.join(ROOT, "out", "adobo", "timeline.json"), encoding="utf-8"))
    words = json.load(open(os.path.join(ROOT, "voice", "words.json"), encoding="utf-8"))
    dur = float(tl["duration_s"])
    N = ns(dur)

    # 1. Load pure ElevenLabs v4 Tagalog voice unchanged
    vx, sr = read_wav(os.path.join(ROOT, "voice", "voice.wav"))
    assert sr == SR, f"Expected {SR} Hz voice, got {sr}"
    v_mono = vx[0] if vx.shape[0] == 1 else vx.mean(0)
    v_pad = np.zeros(N)
    v_pad[: min(N, len(v_mono))] = v_mono[:N]
    v = st(v_pad)
    Lv_all = integrated(v)
    log(f"Voice loaded: {dur:.3f} s ({N} samples), integrated = {Lv_all:.2f} LUFS")

    # 2. Synthesize score & SFX
    log("Synthesizing Filipino rondalla-inspired score...")
    mus = M.render_music(tl)
    log("Synthesizing culinary & comedic SFX...")
    sfx, cues = S.render_sfx(tl)

    # 3. Balance music per section relative to voice + speech ducking
    secs = M.build_sections(tl)
    spans = speech_spans(words)
    duck = dbg(duck_db(spans, dur, N))
    mus_bal = np.zeros_like(mus)
    for name, a, b in secs:
        i0, i1 = max(0, ns(a)), min(N, ns(b))
        seg = mus[:, i0:i1]
        Lm = integrated(seg)
        if np.isfinite(Lm) and Lm > -60.0:
            tgt = Lv_all + MUSIC_TARGET.get(name, -10.4)
            g = dbg(tgt - Lm)
            mus_bal[:, i0:i1] = seg * g
    mus_ducked = mus_bal * duck[None, :]

    # 4. Balance SFX (-6 dB standard under voice)
    Ls = integrated(sfx)
    sfx_bal = sfx * dbg((Lv_all - 6.0) - Ls) if (np.isfinite(Ls) and Ls > -60.0) else sfx

    # 5. Master bus + BS.1770-4 normalization + 4x true-peak limiting
    master = v + mus_ducked + sfx_bal
    L0 = integrated(master)
    master = master * dbg(TARGET_LUFS - L0)
    master, _ = limiter(master, CEIL_DBTP)
    L_fin = integrated(master)
    lra_fin = lra(master)
    tp_fin = true_peak(master)
    log(f"Master ready: {L_fin:.2f} LUFS | LRA {lra_fin:.2f} LU | True Peak {tp_fin:.2f} dBTP")

    # 6. Write outputs
    out_dir = os.path.join(ROOT, "out", "adobo", "audio")
    os.makedirs(out_dir, exist_ok=True)
    write_wav(os.path.join(out_dir, "mix.wav"), master, bits=24)
    write_wav(os.path.join(out_dir, "voice_stem.wav"), v, bits=24)
    write_wav(os.path.join(out_dir, "music_stem.wav"), mus_ducked, bits=24)
    write_wav(os.path.join(out_dir, "sfx_stem.wav"), sfx_bal, bits=24)

    with open(os.path.join(HERE, "cues.md"), "w", encoding="utf-8") as cf:
        cf.write("# Audio Cue Sheet — Sino Ba Talaga ang Nag-imbento ng Adobong Manok?\n\n")
        cf.write(f"- Duration: {dur:.2f} s ({tl['total_frames']} frames @ {tl['fps']} fps)\n")
        cf.write(f"- Master: {L_fin:.2f} LUFS | LRA {lra_fin:.2f} LU | True Peak {tp_fin:.2f} dBTP\n\n")
        cf.write("## SFX & Foley Cues\n")
        for t, label in cues:
            cf.write(f"- `{t:6.2f}s` (f{int(round(t * tl['fps'])):4d}): {label}\n")
    log(f"Wrote {out_dir}/mix.wav and audio/cues.md")


if __name__ == "__main__":
    main()
