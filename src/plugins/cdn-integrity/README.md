# CDN Integrity

This plugin protects the site from changed third-party scripts. The template loads these scripts in files that a template update replaces. The plugin rewrites the built HTML instead, so the protection survives template updates.

- Scripts in `tags` in `pins.json` get an exact version and an SRI hash. SRI makes the browser reject a file that changed.
- Modules in `modules` in `pins.json` are served from `vendor/`. jsDelivr warns against SRI on generated `+esm` files, and Mermaid loads many chunks that a script tag hash cannot cover.
- Scripts in `allowed` in `pins.json` stay unprotected, for the reason given there.
- If a page loads any other external script without an SRI hash, the build fails.

## If the build fails with "not in pins.json"

A template update or a note added or changed a script. A failed build stops the deployment.

1. Read the script and decide whether to trust it.
2. Add the URL to `tags` in `pins.json`, with its `package` and `file`. If the file is on cdnjs, also add `cdnjs`. Use a file that the npm package ships, because `update-pins.mjs` rejects files that the CDN generates.
3. Add the package to `package.json` in this folder, if it is not there.
4. Run `node src/plugins/cdn-integrity/update-pins.mjs`.
5. Commit the changes.

## If the build fails with "Run update-pins.mjs"

The versions in `package.json` in this folder are the source of truth. Dependabot changes only that file and its lockfile, so its PRs fail the preview build until you do these steps:

1. Check out the PR branch.
2. Run `node src/plugins/cdn-integrity/update-pins.mjs`.
3. Build the site and test the graph, code blocks, search and a Mermaid diagram in a browser.
4. Commit the changes to the PR branch.

## Test

Run `node --test src/plugins/cdn-integrity/rewrite.test.js src/plugins/cdn-integrity/versions.test.js`. The `npm test` command skips plugins that do not start with `dg-`.

## Known gaps

- The giscus script has no pin and no hash.
- The Prism autoloader loads language files from cdnjs at runtime, without SRI.
- The Content-Security-Policy in `vercel.json` only reports, and only to the browser console of the visitor. It must allow inline scripts and `eval`, because the template and Alpine use them.
- If the hooks of this plugin fail to load, the loader only prints a warning, so the build continues without protection.
