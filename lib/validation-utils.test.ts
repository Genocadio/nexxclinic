import { describe, expect, it } from "vitest";
import {
  calculateAge,
  checkRwandaNationalIdMismatch,
  formatPhoneNumber,
  getInputType,
  isDominantMemberRequired,
  normalizePhoneNumber,
  parseRwandaNationalId,
  sanitizeEmailInput,
  sanitizeEmailOrPhoneInput,
  sanitizeNationalIdInput,
  sanitizePhoneInput,
  sanitizePriceInput,
  validateDateOfBirth,
  validateEmailOrPhone,
} from "@/lib/validation-utils";

describe("sanitizePriceInput", () => {
  it("removes commas from pasted price numbers", () => {
    expect(sanitizePriceInput("5,000")).toBe("5000");
    expect(sanitizePriceInput("1,250,000")).toBe("1250000");
    expect(sanitizePriceInput("10,000.50")).toBe("10000.50");
  });

  it("strips whitespace, currency labels and non-numeric characters", () => {
    expect(sanitizePriceInput(" 5,000 RWF ")).toBe("5000");
    expect(sanitizePriceInput("$12,500")).toBe("12500");
    expect(sanitizePriceInput("RWF 3,000.00")).toBe("3000.00");
  });

  it("handles empty or blank values", () => {
    expect(sanitizePriceInput("")).toBe("");
    expect(sanitizePriceInput("   ")).toBe("");
  });
});

describe("sanitizeEmailInput", () => {
  it("strips whitespace and invalid characters", () => {
    expect(sanitizeEmailInput("a b@c.d")).toBe("ab@c.d");
    expect(sanitizeEmailInput("dr;name@clinic.com")).toBe("drname@clinic.com");
    expect(sanitizeEmailInput("user@domain.com")).toBe("user@domain.com");
  });
});

describe("formatPhoneNumber & sanitizePhoneInput", () => {
  it("formats Rwandan MTN numbers (078, 079)", () => {
    expect(formatPhoneNumber("0788123456")).toBe("+250 788 123 456");
    expect(formatPhoneNumber("0791234567")).toBe("+250 791 234 567");
    expect(sanitizePhoneInput("0788123456")).toBe("+250 788 123 456");
  });

  it("formats Rwandan Airtel numbers (072, 073, 077)", () => {
    expect(formatPhoneNumber("0721234567")).toBe("+250 721 234 567");
    expect(formatPhoneNumber("0731234567")).toBe("+250 731 234 567");
    expect(formatPhoneNumber("0771234567")).toBe("+250 771 234 567");
  });

  it("formats 9-digit local entries starting with 7x with +250 prefix", () => {
    expect(formatPhoneNumber("788123456")).toBe("+250 788 123 456");
    expect(formatPhoneNumber("791234567")).toBe("+250 791 234 567");
    expect(formatPhoneNumber("731234567")).toBe("+250 731 234 567");
    expect(formatPhoneNumber("721234567")).toBe("+250 721 234 567");
    expect(formatPhoneNumber("771234567")).toBe("+250 771 234 567");
  });

  it("formats numbers starting with 250 with +250 prefix", () => {
    expect(formatPhoneNumber("250788123456")).toBe("+250 788 123 456");
    expect(formatPhoneNumber("+250788123456")).toBe("+250 788 123 456");
  });

  it("preserves other international numbers", () => {
    expect(formatPhoneNumber("+256701234567")).toBe("+256 701 234 567");
    expect(formatPhoneNumber("+254712345678")).toBe("+254 712 345 678");
  });

  it("normalizes phone numbers to compact E.164 without spaces", () => {
    expect(normalizePhoneNumber("0788123456")).toBe("+250788123456");
    expect(normalizePhoneNumber("+250 788 123 456")).toBe("+250788123456");
    expect(normalizePhoneNumber("+256 701 234 567")).toBe("+256701234567");
  });
});

describe("sanitizeEmailOrPhoneInput", () => {
  it("routes to email sanitizer when it contains @", () => {
    expect(sanitizeEmailOrPhoneInput("a b@c.d")).toBe("ab@c.d");
  });
  it("routes to phone sanitizer for phone-like input", () => {
    expect(sanitizeEmailOrPhoneInput("0788 123 456")).toBe("+250 788 123 456");
    expect(sanitizeEmailOrPhoneInput("+256 701 234 567")).toBe("+256 701 234 567");
  });
});

describe("validateEmailOrPhone", () => {
  it("accepts a valid email", () => {
    expect(validateEmailOrPhone("user@domain.com").valid).toBe(true);
  });
  it("accepts a local phone (7-15 digits)", () => {
    expect(validateEmailOrPhone("0788123456").valid).toBe(true);
    expect(validateEmailOrPhone("+250 788 123 456").valid).toBe(true);
  });
  it("accepts an international phone", () => {
    expect(validateEmailOrPhone("+256701234567").valid).toBe(true);
    expect(validateEmailOrPhone("+14155552671").valid).toBe(true);
  });
  it("rejects invalid values", () => {
    expect(validateEmailOrPhone("").valid).toBe(false);
    expect(validateEmailOrPhone("abc").valid).toBe(false);
    expect(validateEmailOrPhone("12345").valid).toBe(false); // too short
    expect(validateEmailOrPhone("+12345").valid).toBe(false); // too short
    expect(validateEmailOrPhone("123456789012345678").valid).toBe(false); // too long
  });
});

describe("getInputType", () => {
  it("detects email, local and international phone", () => {
    expect(getInputType("user@domain.com")).toBe("email");
    expect(getInputType("0788123456")).toBe("phone_local");
    expect(getInputType("+256701234567")).toBe("phone_international");
  });
});

const yearsAgo = (years: number) => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - years);
  return d.toISOString().slice(0, 10);
};

describe("date helpers", () => {
  it("calculates age", () => {
    expect(calculateAge(yearsAgo(30))).toBeGreaterThanOrEqual(29);
    expect(calculateAge("2000-01-01")).toBeGreaterThanOrEqual(20);
  });
  it("validates a real date", () => {
    expect(validateDateOfBirth("2000-01-01").valid).toBe(true);
  });
  it("rejects future dates", () => {
    expect(validateDateOfBirth("2100-01-01").valid).toBe(false);
  });
  it("rejects impossible dates (Feb 30)", () => {
    expect(validateDateOfBirth("2001-02-30").valid).toBe(false);
  });
});

describe("isDominantMemberRequired", () => {
  it("is false without insurance", () => {
    expect(isDominantMemberRequired("2010-01-01", false)).toBe(false);
  });
  it("is true for patients 18 or younger with insurance", () => {
    expect(isDominantMemberRequired(yearsAgo(17), true)).toBe(true);
    expect(isDominantMemberRequired(yearsAgo(18), true)).toBe(true);
  });
  it("is false for adults with insurance", () => {
    expect(isDominantMemberRequired(yearsAgo(20), true)).toBe(false);
    expect(isDominantMemberRequired("2000-01-01", true)).toBe(false);
  });
});

describe("Rwanda National ID validation and parsing", () => {
  it("sanitizes National ID input with spaces, dashes, or formatting", () => {
    expect(sanitizeNationalIdInput("1 1998 8 0012345 0 23")).toBe("1199880012345023");
    expect(sanitizeNationalIdInput("1-1998-8-0012345-0-23")).toBe("1199880012345023");
  });

  it("parses valid 16-digit Rwandan Male National ID (gender digit 8)", () => {
    const info = parseRwandaNationalId("1 1998 8 0012345 0 23");
    expect(info.valid).toBe(true);
    expect(info.yearOfBirth).toBe(1998);
    expect(info.gender).toBe("M");
    expect(info.genderLabel).toBe("Male");
    expect(info.statusDigit).toBe("1");
    expect(info.formatted).toBe("1 1998 8 0012345 0 23");
  });

  it("parses valid 16-digit Rwandan Female National ID (gender digit 7)", () => {
    const info = parseRwandaNationalId("1200270054321012");
    expect(info.valid).toBe(true);
    expect(info.yearOfBirth).toBe(2002);
    expect(info.gender).toBe("F");
    expect(info.genderLabel).toBe("Female");
    expect(info.statusDigit).toBe("1");
  });

  it("rejects non-16-digit or invalid National IDs", () => {
    expect(parseRwandaNationalId("12345").valid).toBe(false);
    expect(parseRwandaNationalId("").valid).toBe(false);
    expect(parseRwandaNationalId(null).valid).toBe(false);
  });

  it("detects gender mismatch between selected gender and NID", () => {
    const res = checkRwandaNationalIdMismatch("1199880012345023", "FEMALE", "1998-05-12");
    expect(res.hasMismatch).toBe(true);
    expect(res.warning).toContain("ID specifies Male");
  });

  it("detects birth year mismatch between selected DOB and NID", () => {
    const res = checkRwandaNationalIdMismatch("1199880012345023", "MALE", "1995-05-12");
    expect(res.hasMismatch).toBe(true);
    expect(res.warning).toContain("ID specifies birth year 1998, but Date of Birth is 1995");
  });

  it("passes without mismatch when gender and birth year match", () => {
    const res = checkRwandaNationalIdMismatch("1199880012345023", "M", "1998-05-12");
    expect(res.hasMismatch).toBe(false);
    expect(res.warning).toBeUndefined();
  });
});

