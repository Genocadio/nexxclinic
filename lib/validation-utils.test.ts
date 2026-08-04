import { describe, expect, it } from "vitest";
import {
  calculateAge,
  getInputType,
  isDominantMemberRequired,
  sanitizeEmailInput,
  sanitizeEmailOrPhoneInput,
  sanitizePhoneInput,
  validateDateOfBirth,
  validateEmailOrPhone,
} from "@/lib/validation-utils";

describe("sanitizeEmailInput", () => {
  it("strips whitespace and invalid characters", () => {
    expect(sanitizeEmailInput("a b@c.d")).toBe("ab@c.d");
    expect(sanitizeEmailInput("dr;name@clinic.com")).toBe("drname@clinic.com");
    expect(sanitizeEmailInput("user@domain.com")).toBe("user@domain.com");
  });
});

describe("sanitizePhoneInput", () => {
  it("keeps + and digits only", () => {
    expect(sanitizePhoneInput("+256 701 234 567")).toBe("+256701234567");
    expect(sanitizePhoneInput("0712-3456-78")).toBe("0712345678");
    expect(sanitizePhoneInput("07a1b2c3")).toBe("07123");
  });
});

describe("sanitizeEmailOrPhoneInput", () => {
  it("routes to email sanitizer when it contains @", () => {
    expect(sanitizeEmailOrPhoneInput("a b@c.d")).toBe("ab@c.d");
  });
  it("routes to phone sanitizer for phone-like input", () => {
    expect(sanitizeEmailOrPhoneInput("07 1234 5678")).toBe("0712345678");
    expect(sanitizeEmailOrPhoneInput("+256 701 234 567")).toBe("+256701234567");
  });
});

describe("validateEmailOrPhone", () => {
  it("accepts a valid email", () => {
    expect(validateEmailOrPhone("user@domain.com").valid).toBe(true);
  });
  it("accepts a local phone (10 digits starting with 07)", () => {
    expect(validateEmailOrPhone("0712345678").valid).toBe(true);
  });
  it("accepts an international phone (+ and 12 digits)", () => {
    expect(validateEmailOrPhone("+256701234567").valid).toBe(true);
  });
  it("rejects invalid values", () => {
    expect(validateEmailOrPhone("").valid).toBe(false);
    expect(validateEmailOrPhone("abc").valid).toBe(false);
    expect(validateEmailOrPhone("07123456789").valid).toBe(false);
    expect(validateEmailOrPhone("+25670123456").valid).toBe(false);
  });
});

describe("getInputType", () => {
  it("detects email, local and international phone", () => {
    expect(getInputType("user@domain.com")).toBe("email");
    expect(getInputType("0712345678")).toBe("phone_local");
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
