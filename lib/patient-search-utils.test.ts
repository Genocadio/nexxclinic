import { describe, it, expect } from "vitest";
import { resolvePatientSearchFilter } from "./patient-search-utils";

describe("resolvePatientSearchFilter", () => {
  it("returns empty object for blank input", () => {
    expect(resolvePatientSearchFilter("")).toEqual({});
    expect(resolvePatientSearchFilter("   ")).toEqual({});
  });

  it("returns insuranceCardNumber when mode is insuranceCardNumber", () => {
    expect(
      resolvePatientSearchFilter("123456", "insuranceCardNumber")
    ).toEqual({
      insuranceCardNumber: "123456",
    });
    expect(
      resolvePatientSearchFilter("RAMA-8899", "insuranceCardNumber")
    ).toEqual({
      insuranceCardNumber: "RAMA-8899",
    });
  });

  describe("smart search mode", () => {
    it("searches with name when characters/letters are entered", () => {
      expect(resolvePatientSearchFilter("Jean Dupont")).toEqual({
        name: "Jean Dupont",
      });
      expect(resolvePatientSearchFilter("Alice")).toEqual({
        name: "Alice",
      });
      expect(resolvePatientSearchFilter("Patient 123")).toEqual({
        name: "Patient 123",
      });
    });

    it("searches with phone number when digits are entered with length <= 12", () => {
      // Local phone numbers
      expect(resolvePatientSearchFilter("0788123456")).toEqual({
        phoneNumber: "0788123456",
      });
      // International phone numbers (up to 12 digits, e.g. +250788123456)
      expect(resolvePatientSearchFilter("+250788123456")).toEqual({
        phoneNumber: "+250788123456",
      });
      expect(resolvePatientSearchFilter("250788123456")).toEqual({
        phoneNumber: "250788123456",
      });
      expect(resolvePatientSearchFilter("+12345678901")).toEqual({
        phoneNumber: "+12345678901",
      });
    });

    it("silently and automatically switches to ID search when digits exceed 12", () => {
      // 16-digit Rwandan National ID
      const nationalId = "1199080012345678";
      expect(resolvePatientSearchFilter(nationalId)).toEqual({
        name: nationalId,
      });

      // Formatted with spaces
      expect(resolvePatientSearchFilter("1 1998 8 0012345 0 23")).toEqual({
        name: "1 1998 8 0012345 0 23",
      });

      // 13-digit ID
      const longId = "1234567890123";
      expect(resolvePatientSearchFilter(longId)).toEqual({
        name: longId,
      });
    });
  });
});
