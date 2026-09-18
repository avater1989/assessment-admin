import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const sharp = require('C:/Users/barr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');

const sourcePath = path.resolve('reference-site', 'capture', 'viewport-top.png');
const localPath = path.resolve('verification', 'home.png');
const source = await sharp(sourcePath).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const local = await sharp(localPath).removeAlpha().raw().toBuffer({ resolveWithObject: true });
if (source.info.width !== local.info.width || source.info.height !== local.info.height) throw new Error('Screenshot sizes differ');

let absolute = 0;
let changed = 0;
const diff = Buffer.alloc(source.data.length);
for (let i = 0; i < source.data.length; i += 3) {
  const dr = Math.abs(source.data[i] - local.data[i]);
  const dg = Math.abs(source.data[i + 1] - local.data[i + 1]);
  const db = Math.abs(source.data[i + 2] - local.data[i + 2]);
  const average = (dr + dg + db) / 3;
  absolute += average;
  if (average > 12) changed++;
  diff[i] = Math.min(255, dr * 3);
  diff[i + 1] = Math.min(255, dg * 3);
  diff[i + 2] = Math.min(255, db * 3);
}
const pixels = source.info.width * source.info.height;
await sharp(diff, { raw: source.info }).png().toFile(path.resolve('verification', 'diff.png'));
console.log(JSON.stringify({
  dimensions: `${source.info.width}x${source.info.height}`,
  meanAbsoluteDifference: Number((absolute / pixels).toFixed(2)),
  changedPixelsPercent: Number((changed / pixels * 100).toFixed(2)),
}, null, 2));
