#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { renderMedia, selectComposition } from "@remotion/renderer";

const [, , shotIdStr, startStr, endStr, outFile] = process.argv;
const shotId = Number(shotIdStr), start = Number(startStr), end = Number(endStr);
const serveUrl = path.resolve(".remotion-bundle");
const browserExecutable = ["/usr/bin/google-chrome", "/usr/bin/chromium"].find((p) => fs.existsSync(p));
const chromiumOptions = { gl: "swangle" };
const composition = await selectComposition({ serveUrl, id: "AdoboShort", browserExecutable, chromiumOptions, timeoutInMilliseconds: 180000 });
const totalF = end - start + 1;
const t0 = Date.now();
let last = 0;
console.log(`[range] Shot ${shotId}: ${start}..${end} (${totalF} f) -> ${outFile}`);
await renderMedia({
  composition, serveUrl, codec: "h264", crf: 16, scale: 2 / 3,
  imageFormat: "jpeg", jpegQuality: 95, frameRange: [start, end], concurrency: 2,
  outputLocation: outFile, inputProps: { shotId }, browserExecutable, chromiumOptions, timeoutInMilliseconds: 180000,
  onProgress: ({ renderedFrames }) => {
    if (renderedFrames - last >= 30 || renderedFrames === totalF) {
      last = renderedFrames;
      const dt = (Date.now() - t0) / 1000;
      console.log(`  [Shot ${shotId}] ${renderedFrames}/${totalF} f (${(renderedFrames / Math.max(dt, 0.1)).toFixed(2)} fps, ${dt.toFixed(1)}s)`);
    }
  },
});
console.log(`[range] Done in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
