import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dir = dirname(fileURLToPath(import.meta.url));
const raw = JSON.parse(readFileSync(join(__dir, "../indicators_raw.json"), "utf8"));

const out = `export const INDICATORS = ${JSON.stringify(raw)};\n`;
writeFileSync(join(__dir, "../src/indicators.js"), out, "utf8");
console.log("src/indicators.js written —", Object.keys(raw).length, "tickers");
