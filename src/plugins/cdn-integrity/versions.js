/**
 * Finds versions that disagree with this plugin's `package.json`.
 *
 * Dependabot changes only the manifest. The build runs this check, so a
 * Dependabot PR fails its preview build until someone runs `update-pins.mjs`
 * and reviews the result.
 */
function findMismatches(manifest, pins, vendored) {
  const versions = manifest.dependencies;
  const mismatches = [];

  for (const [url, pin] of Object.entries(pins.tags)) {
    const version = versions[pin.package];
    if (!pin.url?.includes(`${version}/`)) {
      mismatches.push(`${url} should use ${pin.package} ${version}, but pins to ${pin.url}`);
    }
  }
  for (const [name, version] of Object.entries(vendored)) {
    if (versions[name] !== version) {
      mismatches.push(`vendor/ has ${name} ${version}, but package.json has ${versions[name]}`);
    }
  }
  return mismatches;
}

module.exports = { findMismatches };
