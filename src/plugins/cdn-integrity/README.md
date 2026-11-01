# CDN Integrity

This plugin protects the site from changed third-party scripts. The template loads these scripts in files that a template update replaces. The plugin rewrites the built HTML instead, so the protection survives template updates.

- Scripts in `tags` in `pins.json` get an exact version and an SRI hash. SRI makes the browser reject a file that changed.
- Modules in `modules` in `pins.json` are served from `vendor/`. jsDelivr warns against SRI on generated `+esm` files, and Mermaid loads many chunks that a script tag hash cannot cover.
- Scripts in `allowed` in `pins.json` stay unprotected, for the reason given there.
- If a page loads any other external script without an SRI hash, the build fails.

## If the build fails with "not in pins.json"

A template update or a note added a script. A failed build stops the deployment.

1. Read the script and decide whether to trust it.
2. Add the URL to `tags` in `pins.json`. For an exact version, use `{}`. If the template URL has no exact version, add a `url`.
3. Run `node src/plugins/cdn-integrity/update-pins.mjs`.
4. Commit the changes.

## Update a self-hosted version

1. Change `MERMAID` or `D3_ROOTS` in `update-pins.mjs`.
2. Run `node src/plugins/cdn-integrity/update-pins.mjs`.
3. Build the site and test a Mermaid diagram and the graph in a browser.

Dependabot does not see these files, so check for new versions by hand.

## Test

Run `node --test src/plugins/cdn-integrity/rewrite.test.js`. The `npm test` command skips plugins that do not start with `dg-`.

## Known gaps

- The giscus script has no pin and no hash.
- The Prism autoloader loads language files from cdnjs at runtime, without SRI.
- The Content-Security-Policy in `vercel.json` only reports, and only to the browser console of the visitor. It must allow inline scripts and `eval`, because the template and Alpine use them.
- If the hooks of this plugin fail to load, the loader only prints a warning, so the build continues without protection.
