const assert = require("node:assert/strict");
const { test } = require("node:test");
const { rewriteHtml } = require("./rewrite.js");

const pins = {
  tags: {
    "https://cdn.test/a@latest": { url: "https://cdn.test/a@1.0.0/a.js", integrity: "sha384-a" },
    "https://cdn.test/b@1.0.0/b.js": { url: "https://cdn.test/b@1.0.0/b.js", integrity: "sha384-b" },
    "https://cdn.test/c@1.0.0/c.css": { url: "https://cdn.test/c@2.0.0/c.css", integrity: "sha384-new" },
  },
  modules: { "https://cdn.test/m@1/m.mjs": "/vendor/m.mjs" },
  allowed: { "https://host.test/client.js": "no versioned file" },
};
const rewrite = (html) => rewriteHtml(html, pins, "note.md");

test("pins a floating URL and adds SRI", () => {
  assert.equal(
    rewrite('<script defer src="https://cdn.test/a@latest"></script>'),
    '<script defer src="https://cdn.test/a@1.0.0/a.js" integrity="sha384-a" crossorigin="anonymous"></script>',
  );
});

test("trims spaces in the URL and keeps an existing crossorigin", () => {
  assert.equal(
    rewrite('<script src=" https://cdn.test/b@1.0.0/b.js " crossorigin="anonymous"></script>'),
    '<script src="https://cdn.test/b@1.0.0/b.js" crossorigin="anonymous" integrity="sha384-b"></script>',
  );
});

test("replaces the version and hash of a tag that already has SRI", () => {
  assert.equal(
    rewrite('<link rel="stylesheet" href="https://cdn.test/c@1.0.0/c.css" integrity="sha512-old" crossorigin="anonymous" />'),
    '<link rel="stylesheet" href="https://cdn.test/c@2.0.0/c.css" crossorigin="anonymous" integrity="sha384-new" />',
  );
});

test("replaces self-hosted modules in import maps and inline imports", () => {
  assert.equal(
    rewrite(`<script type="importmap">{"imports":{"m":"https://cdn.test/m@1/m.mjs"}}</script>`),
    `<script type="importmap">{"imports":{"m":"/vendor/m.mjs"}}</script>`,
  );
  assert.equal(
    rewrite(`<script type="module">import m from'https://cdn.test/m@1/m.mjs';</script>`),
    `<script type="module">import m from'/vendor/m.mjs';</script>`,
  );
});

test("leaves local, allowed and already hashed scripts unchanged", () => {
  for (const html of [
    '<script src="/local.js"></script>',
    '<script src="https://host.test/client.js"></script>',
    '<script src="https://cdn.test/c.js" integrity="sha512-c"></script>',
    '<link rel="canonical" href="https://blog.test/">',
  ]) {
    assert.equal(rewrite(html), html);
  }
});

test("rejects every kind of unreviewed external code", () => {
  for (const html of [
    '<script src="https://evil.test/x.js"></script>',
    '<script src="//evil.test/x.js"></script>',
    '<link rel="stylesheet" href="https://evil.test/x.css">',
    `<script type="module">import x from "https://evil.test/x.mjs"</script>`,
    `<script type="module">await import('https://evil.test/x.mjs')</script>`,
    `<script type="importmap">{"imports":{"x":"https://evil.test/x.mjs"}}</script>`,
  ]) {
    assert.throws(() => rewrite(html), /evil\.test/);
  }
});
