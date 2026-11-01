// Downloads the self-hosted files and writes the SRI hashes into pins.json.
// Run it after you change a URL in pins.json. Review the diff before you commit,
// because a hash that changes for the same URL means that the CDN file changed.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const MERMAID = "mermaid@11.17.2";
const D3_ROOTS = ["d3-force@3.0.0", "d3-selection@3.0.0", "d3-zoom@3.0.0", "d3-drag@3.0.0"];

async function download(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url}: ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}

async function updateHashes(pinsPath) {
  const pins = JSON.parse(fs.readFileSync(pinsPath, "utf8"));
  for (const [url, pin] of Object.entries(pins.tags)) {
    const hash = createHash("sha384").update(await download(pin.url || url)).digest("base64");
    pin.integrity = `sha384-${hash}`;
  }
  fs.writeFileSync(pinsPath, `${JSON.stringify(pins, null, 2)}\n`);
}

// jsDelivr generates +esm files on request and warns against SRI on them, so
// these are stored here, with imports changed to point at the neighbouring files.
async function vendorD3(outDir) {
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  const seen = new Set();
  const licences = [];
  const queue = [...D3_ROOTS];
  while (queue.length > 0) {
    const pkg = queue.pop();
    if (seen.has(pkg)) continue;
    seen.add(pkg);
    const source = (await download(`https://cdn.jsdelivr.net/npm/${pkg}/+esm`)).toString("utf8");
    const local = source
      .replace(/"\/npm\/([^"@]+@[^"/]+)\/\+esm"/g, (_, dep) => {
        queue.push(dep);
        return `"./${dep.split("@")[0]}.js"`;
      })
      .replace(/\n?\/\/# sourceMappingURL=.*$/m, "\n");
    fs.writeFileSync(path.join(outDir, `${pkg.split("@")[0]}.js`), local);
    licences.push(`${pkg}\n\n${await download(`https://cdn.jsdelivr.net/npm/${pkg}/LICENSE`)}`);
  }
  fs.writeFileSync(path.join(outDir, "LICENSES.txt"), licences.sort().join("\n---\n\n"));
}

function vendorMermaid(outDir) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "cdn-integrity-"));
  const name = execFileSync("npm", ["pack", MERMAID, "--silent"], { cwd: tmp, encoding: "utf8" }).trim();
  execFileSync("tar", ["-xzf", name], { cwd: tmp });
  const pkg = path.join(tmp, "package");
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(path.join(outDir, "chunks"), { recursive: true });
  fs.copyFileSync(path.join(pkg, "dist/mermaid.esm.min.mjs"), path.join(outDir, "mermaid.esm.min.mjs"));
  fs.copyFileSync(path.join(pkg, "LICENSE"), path.join(outDir, "LICENSE"));
  fs.cpSync(path.join(pkg, "dist/chunks/mermaid.esm.min"), path.join(outDir, "chunks/mermaid.esm.min"), {
    recursive: true,
    filter: (file) => !file.endsWith(".map"),
  });
  fs.rmSync(tmp, { recursive: true, force: true });
}

await updateHashes(path.join(root, "pins.json"));
await vendorD3(path.join(root, "vendor/d3"));
vendorMermaid(path.join(root, "vendor/mermaid"));
