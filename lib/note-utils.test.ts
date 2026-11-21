import { describe, expect, it } from "vitest";
import { filterNotesByDisplayTypes } from "./note-utils";

describe("filterNotesByDisplayTypes", () => {
  it("treats legacy notes without a type as public", () => {
    const notes = [
      { id: "legacy", content: "Old note", noteType: null },
      { id: "billing", content: "Billing note", noteType: "BILLING" },
    ];

    expect(filterNotesByDisplayTypes(notes, ["PUBLIC"])).toEqual([notes[0]]);
  });

  it("matches note types case-insensitively", () => {
    const notes = [{ id: "clinical", noteType: "consultation" }];

    expect(filterNotesByDisplayTypes(notes, ["CONSULTATION"])).toEqual(notes);
  });
});
