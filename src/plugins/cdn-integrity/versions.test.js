const assert = require("node:assert/strict");
const { test } = require("node:test");
const { findMismatches } = require("./versions.js");

const manifest = { dependencies: { a: "2.0.0", m: "1.0.0" } };
const tag = (url) => ({ tags: { "https://cdn.test/a": { package: "a", url } } });

test("accepts pins and vendored files that match the manifest", () => {
  assert.deepEqual(findMismatches(manifest, tag("https://cdn.test/a@2.0.0/a.js"), { m: "1.0.0" }), []);
  assert.deepEqual(findMismatches(manifest, tag("https://cdn.test/a/2.0.0/a.js"), { m: "1.0.0" }), []);
});

test("reports a pin that is behind the manifest", () => {
  assert.match(findMismatches(manifest, tag("https://cdn.test/a@1.0.0/a.js"), {})[0], /should use a 2\.0\.0/);
});

test("reports a pin that has no URL yet", () => {
  assert.equal(findMismatches(manifest, tag(undefined), {}).length, 1);
});

test("reports vendored files that are behind the manifest", () => {
  assert.match(findMismatches(manifest, tag("https://cdn.test/a@2.0.0/a.js"), { m: "0.9.0" })[0], /vendor\/ has m 0\.9\.0/);
});
