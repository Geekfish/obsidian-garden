const pins = require("./pins.json");
const { rewriteHtml } = require("./rewrite.js");

module.exports = {
  setupEleventy(eleventyConfig) {
    // Plugin hooks register after the template's transforms, so this sees the
    // final HTML, including any script tag that a template update adds.
    eleventyConfig.addTransform("cdn-integrity", function (content) {
      if (!(this.page.outputPath || "").endsWith(".html")) return content;
      return rewriteHtml(content, pins, this.page.inputPath);
    });
  },
};
