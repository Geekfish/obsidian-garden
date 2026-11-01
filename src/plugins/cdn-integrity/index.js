const manifest = require("./package.json");
const pins = require("./pins.json");
const vendored = require("./vendor/versions.json");
const { rewriteHtml } = require("./rewrite.js");
const { findMismatches } = require("./versions.js");

module.exports = {
  setupEleventy(eleventyConfig) {
    const mismatches = findMismatches(manifest, pins, vendored);

    // Plugin hooks register after the template's transforms, so this sees the
    // final HTML, including any script tag that a template update adds. The
    // loader only logs errors from setup, so the version check throws here too.
    eleventyConfig.addTransform("cdn-integrity", function (content) {
      if (mismatches.length > 0) {
        throw new Error(
          `[cdn-integrity] Run update-pins.mjs. ${mismatches.join(". ")}. ` +
            "See src/plugins/cdn-integrity/README.md.",
        );
      }
      if (!(this.page.outputPath || "").endsWith(".html")) return content;
      return rewriteHtml(content, pins, this.page.inputPath);
    });
  },
};
