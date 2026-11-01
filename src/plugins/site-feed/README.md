# Site Feed

Replaces the core Atom feed at `/feed.xml`. The core template fails the W3C feed validator and sorts entries by file date. Template updates overwrite that file, so this plugin replaces it. If you disable this plugin, the core feed comes back.

The plugin also adds a discovery tag to each page and a feed link to the page footer.

## Keep a note out of the feed

Add the property `feed: false` to the note in Obsidian, then publish the note. The Obsidian publisher drops unknown `dg-` properties, so do not use a `dg-` name.

The feed also leaves out the home page and notes with `dg-hide`.

## Settings

- `authorName`: the feed author. The default is the site name.

## Tests

`npm test` skips plugins without the `dg-` prefix. Run `npx vitest run src/plugins/site-feed`.
