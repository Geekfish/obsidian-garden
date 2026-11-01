import { describe, expect, it } from "vitest";
import plugin from "./index.js";

const note = (url, data = {}, date = "2020-01-01T00:00:00Z") => ({
  url,
  date: new Date(date),
  data,
});

describe("feedNotes", () => {
  it("sorts by the updated property, newest first", () => {
    const urls = plugin.feedNotes([
      note("/old/", { updated: "2024-01-01T00:00:00Z" }),
      note("/new/", { updated: "2026-01-01T00:00:00Z" }),
    ]).map((item) => item.url);
    expect(urls).toEqual(["/new/", "/old/"]);
  });

  it("falls back to the file date without an updated property", () => {
    const urls = plugin.feedNotes([
      note("/old/", {}, "2021-01-01T00:00:00Z"),
      note("/new/", { updated: "2022-01-01T00:00:00Z" }),
    ]).map((item) => item.url);
    expect(urls).toEqual(["/new/", "/old/"]);
  });

  it("leaves out the home page, hidden notes and opted-out notes", () => {
    const urls = plugin.feedNotes([
      note("/"),
      note("/hidden/", { hide: true }),
      note("/published-opt-out/", { "dg-note-properties": { feed: false } }),
      note("/source-opt-out/", { feed: false }),
      note("/kept/", { "dg-note-properties": { feed: true } }),
    ]).map((item) => item.url);
    expect(urls).toEqual(["/kept/"]);
  });

  it("handles a missing collection", () => {
    expect(plugin.feedNotes(undefined)).toEqual([]);
  });
});

describe("updatedAt", () => {
  it("returns a date when there is no note", () => {
    expect(plugin.updatedAt(undefined)).toBeInstanceOf(Date);
  });
});
