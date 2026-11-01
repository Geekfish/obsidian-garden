const fs = require("fs");
const path = require("path");

// Template updates overwrite this file, so the plugin replaces it instead of
// editing it. Both templates claim /feed.xml, and Eleventy refuses to build
// two outputs at one path, so the core one must be ignored.
const CORE_FEED = "src/site/feed.njk";

// An empty garden has no newest note, but Atom still requires a feed date.
function updatedAt(item) {
  return item ? new Date(item.data.updated || item.date) : new Date();
}

// The Obsidian publisher drops unknown dg- keys, but it passes plain properties
// through under dg-note-properties. "feed: false" therefore follows the same
// form as "comments: false".
function optedOut(item) {
  const properties = item.data["dg-note-properties"] || {};
  return properties.feed === false || item.data.feed === false;
}

function feedNotes(notes) {
  return (notes || [])
    .filter((item) => item.url !== "/" && !item.data.hide && !optedOut(item))
    .sort((a, b) => updatedAt(b) - updatedAt(a));
}

module.exports = {
  feedNotes,
  updatedAt,
  setupEleventy(eleventyConfig, context) {
    eleventyConfig.ignores.add(CORE_FEED);
    eleventyConfig.addFilter("siteFeedNotes", feedNotes);
    eleventyConfig.addFilter("siteFeedUpdatedAt", updatedAt);
    eleventyConfig.addTemplate(
      "site-feed.njk",
      fs.readFileSync(path.join(context.pluginDir, "templates/feed.njk"), "utf8"),
      {
        permalink: "/feed.xml",
        eleventyExcludeFromCollections: true,
        feedAuthorName: context.settings.authorName,
      },
    );
  },
};
