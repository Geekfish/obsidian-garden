/**
 * Rewrites third-party script references in a built HTML page.
 *
 * The template owns the files that emit these tags, so edits there disappear
 * on a template update. Rewriting the output keeps the protection outside the
 * template, and rejecting unknown URLs means an update cannot add a script
 * that nobody reviewed.
 */
const SCRIPT_OR_LINK = /<(script|link)\b[^>]*>/gi;
const INLINE_SCRIPT = /<script\b([^>]*)>([\s\S]*?)<\/script\b[^>]*>/gi;
const MODULE_IMPORT = /(?:\bfrom\s*|\bimport\s*\(?\s*)["'`]((?:https?:)?\/\/[^"'`]+)/g;
const IMPORT_MAP_URL = /"((?:https?:)?\/\/[^"]+)"/g;
const LOADS_CODE = new Set(["stylesheet", "modulepreload", "preload"]);

function attribute(tag, name) {
  const match = new RegExp(
    `\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`,
    "i",
  ).exec(tag);
  if (!match) return null;
  return { raw: match[0], value: (match[1] ?? match[2] ?? match[3]).trim() };
}

function isExternal(url) {
  return /^(https?:)?\/\//i.test(url);
}

function rewriteTag(tag, urlName, url, pin) {
  const oldHash = attribute(tag, "integrity");
  const unhashed = oldHash ? tag.replace(oldHash.raw, "") : tag;
  const pinned = unhashed.replace(attribute(unhashed, urlName).raw, ` ${urlName}="${pin.url}"`);
  const extra = ` integrity="${pin.integrity}"${attribute(tag, "crossorigin") ? "" : ' crossorigin="anonymous"'}`;
  return pinned.replace(/\s*\/?>$/, (end) => `${extra}${end}`);
}

function rewriteHtml(html, pins, page) {
  const unknown = new Set();

  let output = html.replace(SCRIPT_OR_LINK, (tag, name) => {
    const isScript = name.toLowerCase() === "script";
    if (!isScript && !LOADS_CODE.has(attribute(tag, "rel")?.value.toLowerCase())) return tag;

    const urlName = isScript ? "src" : "href";
    const url = attribute(tag, urlName)?.value;
    if (!url || !isExternal(url) || pins.allowed[url]) return tag;

    const pin = pins.tags[url];
    if (pin) return rewriteTag(tag, urlName, url, pin);
    if (!attribute(tag, "integrity")) unknown.add(url);
    return tag;
  });

  for (const [url, local] of Object.entries(pins.modules)) {
    output = output.split(url).join(local);
  }

  for (const [, attributes, body] of output.matchAll(INLINE_SCRIPT)) {
    const type = attribute(attributes, "type")?.value;
    if (type !== "module" && type !== "importmap") continue;
    const pattern = type === "importmap" ? IMPORT_MAP_URL : MODULE_IMPORT;
    for (const [, url] of body.matchAll(pattern)) unknown.add(url);
  }

  if (unknown.size > 0) {
    throw new Error(
      `[cdn-integrity] ${page} loads scripts that are not in pins.json: ` +
        `${[...unknown].join(", ")}. See src/plugins/cdn-integrity/README.md.`,
    );
  }
  return output;
}

module.exports = { rewriteHtml };
