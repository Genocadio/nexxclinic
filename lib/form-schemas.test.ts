import { describe, expect, it } from "vitest";
import {
  coveragePercentageFieldSchema,
  createPasswordFormSchema,
  createPatientInsuranceFormSchema,
  createUserFormSchema,
  loginFormSchema,
  productFormSchema,
  registerFormSchema,
} from "@/lib/form-schemas";

const strongPassword = "Abcdef1!";

describe("loginFormSchema", () => {
  it("accepts an email identifier", () => {
    expect(
      loginFormSchema.safeParse({ identifier: "dr@clinic.com", password: "x" })
        .success,
    ).toBe(true);
  });
  it("accepts a phone identifier", () => {
    expect(
      loginFormSchema.safeParse({ identifier: "0712345678", password: "x" })
        .success,
    ).toBe(true);
  });
  it("rejects an invalid identifier", () => {
    expect(
      loginFormSchema.safeParse({ identifier: "not-an-identifier", password: "x" })
        .success,
    ).toBe(false);
  });
  it("requires a password", () => {
    expect(
      loginFormSchema.safeParse({ identifier: "dr@clinic.com", password: "" })
        .success,
    ).toBe(false);
  });
});

describe("password rules", () => {
  it("accepts a strong password", () => {
    expect(
      createPasswordFormSchema.safeParse({
        identifier: "dr@clinic.com",
        password: strongPassword,
        confirmPassword: strongPassword,
      }).success,
    ).toBe(true);
  });
  it("rejects a short password", () => {
    expect(
      createPasswordFormSchema.safeParse({
        identifier: "dr@clinic.com",
        password: "Abc1!",
        confirmPassword: "Abc1!",
      }).success,
    ).toBe(false);
  });
  it("rejects a password without uppercase", () => {
    expect(
      createPasswordFormSchema.safeParse({
        identifier: "dr@clinic.com",
        password: "abcdef1!",
        confirmPassword: "abcdef1!",
      }).success,
    ).toBe(false);
  });
  it("rejects a password without a special character", () => {
    expect(
      createPasswordFormSchema.safeParse({
        identifier: "dr@clinic.com",
        password: "Abcdef12",
        confirmPassword: "Abcdef12",
      }).success,
    ).toBe(false);
  });
  it("rejects mismatched confirm passwords", () => {
    expect(
      createPasswordFormSchema.safeParse({
        identifier: "dr@clinic.com",
        password: strongPassword,
        confirmPassword: "Different1!",
      }).success,
    ).toBe(false);
  });
});

describe("registerFormSchema", () => {
  it("accepts a complete registration", () => {
    expect(
      registerFormSchema.safeParse({
        name: "Jane Doe",
        email: "jane@clinic.com",
        phone: "",
        password: strongPassword,
      }).success,
    ).toBe(true);
  });
  it("requires at least one contact (email or phone)", () => {
    const result = registerFormSchema.safeParse({
      name: "Jane Doe",
      email: "",
      phone: "",
      password: strongPassword,
    });
    expect(result.success).toBe(false);
  });
  it("rejects a password containing the name", () => {
    const result = registerFormSchema.safeParse({
      name: "Bob",
      email: "bob@clinic.com",
      phone: "",
      password: "Bob1234!",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const passwordIssues = result.error.issues.filter(
        (issue) => issue.path[0] === "password",
      );
      expect(passwordIssues.length).toBeGreaterThan(0);
    }
  });
});

describe("coveragePercentageFieldSchema", () => {
  it("accepts 0..100", () => {
    expect(coveragePercentageFieldSchema.safeParse("0").success).toBe(true);
    expect(coveragePercentageFieldSchema.safeParse("75").success).toBe(true);
    expect(coveragePercentageFieldSchema.safeParse("100").success).toBe(true);
  });
  it("rejects out-of-range and empty values", () => {
    expect(coveragePercentageFieldSchema.safeParse("150").success).toBe(false);
    expect(coveragePercentageFieldSchema.safeParse("-5").success).toBe(false);
    expect(coveragePercentageFieldSchema.safeParse("").success).toBe(false);
  });
});

describe("productFormSchema", () => {
  it("accepts a valid product", () => {
    expect(
      productFormSchema.safeParse({
        name: "Panadol",
        description: "",
        type: "DRUG",
        privatePrice: "5000",
        clinicPrice: "",
      }).success,
    ).toBe(true);
  });
  it("requires a name and a non-negative private price", () => {
    expect(
      productFormSchema.safeParse({
        name: "",
        description: "",
        type: "DRUG",
        privatePrice: "5000",
        clinicPrice: "",
      }).success,
    ).toBe(false);
    expect(
      productFormSchema.safeParse({
        name: "Panadol",
        description: "",
        type: "DRUG",
        privatePrice: "-5",
        clinicPrice: "",
      }).success,
    ).toBe(false);
  });
});

describe("createUserFormSchema", () => {
  const base = {
    firstName: "Jane",
    lastName: "",
    email: "jane@clinic.com",
    phoneNumber: "",
    gender: "FEMALE",
    dateOfBirth: "1990-01-01",
    username: "",
  };

  it("requires roles", () => {
    const result = createUserFormSchema({ requireProfileFields: false }).safeParse({
      ...base,
      roles: [],
    });
    expect(result.success).toBe(false);
  });

  it("requires profile fields only when creating", () => {
    const full = createUserFormSchema({ requireProfileFields: true }).safeParse({
      ...base,
      roles: ["STAFF"],
    });
    expect(full.success).toBe(true);

    const missing = createUserFormSchema({ requireProfileFields: true }).safeParse({
      firstName: "Jane",
      lastName: "",
      email: "",
      phoneNumber: "",
      gender: "",
      dateOfBirth: "",
      username: "",
      roles: ["STAFF"],
    });
    expect(missing.success).toBe(false);
  });

  it("skips profile-field rules when editing", () => {
    const edit = createUserFormSchema({ requireProfileFields: false }).safeParse({
      firstName: "Jane",
      lastName: "",
      email: "",
      phoneNumber: "",
      gender: "",
      dateOfBirth: "",
      username: "",
      roles: ["STAFF"],
    });
    expect(edit.success).toBe(true);
  });
});

describe("createPatientInsuranceFormSchema", () => {
  const base = {
    insuranceCardNumber: "CARD-1",
    providingCompanyOrEmployer: "Acme Ltd",
    dominantFirstName: "",
    dominantLastName: "",
    dominantPhone: "",
  };

  it("requires dominant-member fields when the patient is a minor", () => {
    const result = createPatientInsuranceFormSchema({
      dominantRequired: true,
    }).safeParse(base);
    expect(result.success).toBe(false);
  });

  it("does not require dominant-member fields for adults", () => {
    const result = createPatientInsuranceFormSchema({
      dominantRequired: false,
    }).safeParse(base);
    expect(result.success).toBe(true);
  });

  it("accepts complete dominant-member info", () => {
    const result = createPatientInsuranceFormSchema({
      dominantRequired: true,
    }).safeParse({
      ...base,
      dominantFirstName: "Jane",
      dominantLastName: "Doe",
      dominantPhone: "0712345678",
    });
    expect(result.success).toBe(true);
  });
});
