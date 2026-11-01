const ALBUM_CLASS = "photo-album";

function hasClass(item, className) {
  return String(item.data.contentClasses || "").split(/\s+/).includes(className);
}

// Obsidian keeps album notes as plain images, so the first one is the cover.
function coverOf(item) {
  const match = /!\[[^\]]*\]\(([^)\s]+)\)/.exec(item.rawInput || "");
  return match ? match[1] : null;
}

// A missing or non-numeric year means an ongoing album, which sorts first.
function yearOf(item) {
  const properties = item.data["dg-note-properties"] || {};
  const year = Number(properties["album-year"]);
  return Number.isFinite(year) && year > 0 ? year : Infinity;
}

module.exports = {
  setupMarkdown(md) {
    // Photos come from the CDN at full size and skip the image optimizer.
    const renderImage = md.renderer.rules.image;
    md.renderer.rules.image = (tokens, idx, options, env, self) => {
      tokens[idx].attrSet("loading", "lazy");
      return renderImage(tokens, idx, options, env, self);
    };
  },
  setupEleventy(eleventyConfig) {
    eleventyConfig.addFilter("photoAlbums", (notes) =>
      (notes || [])
        .filter((item) => hasClass(item, ALBUM_CLASS))
        .map((item) => ({
          title: item.data.title || item.fileSlug,
          url: item.url,
          cover: coverOf(item),
          year: yearOf(item),
        }))
        .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title)),
    );
  },
};
