/**
 * form-schemas.ts
 *
 * Shared zod schemas powering inline form validation (react-hook-form +
 * zodResolver). Errors render below each field and validation runs as you
 * type (`mode: "onChange"`); the heaviest schemas (cross-field superRefine)
 * debounce their live validation via hooks/use-debounced-validation.
 * Validation failures are shown inline — they are never surfaced as toasts.
 *
 * Reuses the existing validators in lib/validation-utils.ts so the rules stay
 * consistent with the rest of the app.
 */
import { z } from "zod";
import {
  validateDateOfBirth,
  validateEmailOrPhone,
} from "@/lib/validation-utils";

// ─────────────────────────────────────────────────────────────────────────────
// Primitives
// ─────────────────────────────────────────────────────────────────────────────

export const requiredString = (message = "This field is required") =>
  z.string().trim().min(1, message);

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Enter a valid email address");

/** Email or local/international phone — used for login identifiers & contacts. */
export const emailOrPhoneSchema = z
  .string()
  .trim()
  .min(1, "Email or phone number is required")
  .refine((value) => validateEmailOrPhone(value).valid, (value) => ({
    message:
      validateEmailOrPhone(value).error ||
      "Enter a valid email (user@domain.com) or phone (+256… / 07…)",
  }));

/** Mirrors the password rules enforced on the auth pages. */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Include at least one uppercase letter")
  .regex(/[a-z]/, "Include at least one lowercase letter")
  .regex(/[0-9]/, "Include at least one digit")
  .regex(/[^a-zA-Z0-9]/, "Include at least one special character")
  .regex(/^\S*$/, "Password cannot contain whitespace");

export const confirmPasswordSchema = z
  .string()
  .min(1, "Please confirm your password");

/** 0–100 coverage percentage stored as a string (input keeps raw value). */
export const coveragePercentageFieldSchema = z
  .string()
  .trim()
  .min(1, "Coverage percentage is required")
  .refine((value) => {
    const n = Number(value);
    return !Number.isNaN(n) && n >= 0 && n <= 100;
  }, "Coverage must be between 0 and 100");

export const dateOfBirthSchema = z
  .string()
  .trim()
  .min(1, "Date of birth is required")
  .refine((value) => validateDateOfBirth(value).valid, (value) => ({
    message: validateDateOfBirth(value).error || "Invalid date of birth",
  }));

// ─────────────────────────────────────────────────────────────────────────────
// Auth
// ─────────────────────────────────────────────────────────────────────────────

export const loginFormSchema = z.object({
  identifier: emailOrPhoneSchema,
  password: requiredString("Password is required"),
});
export type LoginFormValues = z.infer<typeof loginFormSchema>;

/** Register: full name + at least one contact (email and/or phone) + password. */
export const registerFormSchema = z
  .object({
    name: requiredString("Full name is required"),
    email: z.string().trim(),
    phone: z.string().trim(),
    password: passwordSchema,
  })
  .superRefine((data, ctx) => {
    const { email, phone, password, name } = data;

    if (!email && !phone) {
      ctx.addIssue({
        code: "custom",
        path: ["email"],
        message: "Email or phone number is required",
      });
      ctx.addIssue({
        code: "custom",
        path: ["phone"],
        message: "Email or phone number is required",
      });
    }
    if (email) {
      const result = validateEmailOrPhone(email);
      if (!result.valid) {
        ctx.addIssue({
          code: "custom",
          path: ["email"],
          message: "Enter a valid email address",
        });
      }
    }
    if (phone) {
      const result = validateEmailOrPhone(phone);
      if (!result.valid) {
        ctx.addIssue({
          code: "custom",
          path: ["phone"],
          message: phone.includes("@")
            ? "Please enter a valid phone number, not email"
            : "Enter a valid phone number",
        });
      }
    }
    if (password && name) {
      const lowered = password.toLowerCase();
      for (const part of name.split(/\s+/)) {
        if (part && lowered.includes(part.toLowerCase())) {
          ctx.addIssue({
            code: "custom",
            path: ["password"],
            message: "Password cannot contain your name",
          });
          break;
        }
      }
    }
    if (password && email) {
      const prefix = email.split("@")[0].toLowerCase();
      if (prefix && password.toLowerCase().includes(prefix)) {
        ctx.addIssue({
          code: "custom",
          path: ["password"],
          message: "Password cannot contain your email prefix",
        });
      }
    }
  });
export type RegisterFormValues = z.infer<typeof registerFormSchema>;

export const createPasswordFormSchema = z
  .object({
    identifier: requiredString("Email or identifier is required"),
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type CreatePasswordFormValues = z.infer<typeof createPasswordFormSchema>;

export const setupPasswordFormSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type SetupPasswordFormValues = z.infer<typeof setupPasswordFormSchema>;

export const changePasswordFormSchema = z
  .object({
    currentPassword: requiredString("Current password is required"),
    newPassword: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });
export type ChangePasswordFormValues = z.infer<typeof changePasswordFormSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Account profile
// ─────────────────────────────────────────────────────────────────────────────

export const accountProfileFormSchema = z.object({
  name: requiredString("Name is required"),
  email: emailSchema,
  phoneNumber: requiredString("Phone number is required"),
  username: z.string().trim(),
  dateOfBirth: z.string().trim(),
  gender: z.string().trim(),
});
export type AccountProfileFormValues = z.infer<typeof accountProfileFormSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Admin
// ─────────────────────────────────────────────────────────────────────────────

export const insuranceProviderFormSchema = z.object({
  name: requiredString("Insurance name is required"),
  acronym: requiredString("Acronym is required"),
  coverage: coveragePercentageFieldSchema,
  supportedByClinic: z.boolean(),
});
export type InsuranceProviderFormValues = z.infer<
  typeof insuranceProviderFormSchema
>;

export const productFormSchema = z.object({
  name: requiredString("Product name is required"),
  description: z.string().trim(),
  type: z.string().min(1, "Product type is required"),
  privatePrice: z
    .string()
    .trim()
    .min(1, "Private price is required")
    .refine((value) => {
      const n = Number(value);
      return !Number.isNaN(n) && n >= 0;
    }, "Private price must be a positive number"),
  clinicPrice: z.string().trim(),
});
export type ProductFormValues = z.infer<typeof productFormSchema>;

/**
 * User create/edit form. `requireProfileFields` is false when editing an
 * existing user (the profile fields are disabled then — only roles change).
 */
export function createUserFormSchema(options: { requireProfileFields: boolean }) {
  return z
    .object({
      firstName: requiredString("First name is required"),
      lastName: z.string().trim(),
      email: z.string().trim(),
      phoneNumber: z.string().trim(),
      gender: z.string().trim(),
      dateOfBirth: z.string().trim(),
      username: z.string().trim(),
      roles: z.array(z.string()).min(1, "Select at least one role"),
    })
    .superRefine((data, ctx) => {
      if (!options.requireProfileFields) return;
      // For new users at least one contact + gender + dob are required.
      if (!data.email && !data.phoneNumber) {
        ctx.addIssue({
          code: "custom",
          path: ["email"],
          message: "Email or phone number is required",
        });
      }
      if (data.email) {
        const result = validateEmailOrPhone(data.email);
        if (!result.valid) {
          ctx.addIssue({
            code: "custom",
            path: ["email"],
            message: "Enter a valid email address",
          });
        }
      }
      if (!data.gender) {
        ctx.addIssue({
          code: "custom",
          path: ["gender"],
          message: "Gender is required",
        });
      }
      if (!data.dateOfBirth) {
        ctx.addIssue({
          code: "custom",
          path: ["dateOfBirth"],
          message: "Date of birth is required",
        });
      }
    });
}
export type UserFormValues = z.infer<
  ReturnType<typeof createUserFormSchema>
>;

export const clinicProfileFormSchema = z.object({
  name: requiredString("Clinic name is required"),
  tinNumber: requiredString("TIN number is required"),
  username: z.string().trim(),
  address: z.string().trim(),
  contacts: z
    .array(
      z.object({
        contactType: z.string(),
        value: z.string().trim(),
        description: z.string().trim(),
      }),
    )
    .refine(
      (contacts) => contacts.some((c) => c.value),
      "At least one clinic contact is required",
    ),
});
export type ClinicProfileFormValues = z.infer<typeof clinicProfileFormSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Patient insurance (dominant member rules depend on the patient's age)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Matches the backend rule for principalMemberPhoneNumber:
 * optional leading +, then 7-15 digits.
 */
const PHONE_NUMBER_REGEX = /^\+?\d{7,15}$/
const PHONE_FORMAT_MESSAGE = "Enter a valid phone number (7-15 digits, optional leading +)"

export function createPatientInsuranceFormSchema(options: {
  dominantRequired: boolean;
}) {
  return z
    .object({
      insuranceCardNumber: requiredString("Insurance card number is required"),
      providingCompanyOrEmployer: requiredString(
        "Providing company or employer is required",
      ),
      dominantFirstName: z.string().trim(),
      dominantLastName: z.string().trim(),
      dominantPhone: z.string().trim(),
      patientSharePercentage: z
        .union([z.string(), z.number()])
        .optional()
        .nullable()
        .refine(
          (val) => {
            if (val === null || val === undefined || val === '') return true;
            const num = Number(val);
            return !isNaN(num) && num >= 0 && num <= 100;
          },
          { message: 'Patient share must be between 0 and 100' },
        ),
    })
    .superRefine((data, ctx) => {
      // ── Format validation (runs whether or not dominant is required) ──
      if (data.dominantPhone && !PHONE_NUMBER_REGEX.test(data.dominantPhone)) {
        ctx.addIssue({
          code: "custom",
          path: ["dominantPhone"],
          message: PHONE_FORMAT_MESSAGE,
        });
      }

      // ── Dominant-member required rules ──
      if (!options.dominantRequired) return;
      if (!data.dominantFirstName) {
        ctx.addIssue({
          code: "custom",
          path: ["dominantFirstName"],
          message: "Dominant member first name is required",
        });
      }
      if (!data.dominantLastName) {
        ctx.addIssue({
          code: "custom",
          path: ["dominantLastName"],
          message: "Dominant member last name is required",
        });
      }
      if (!data.dominantPhone) {
        ctx.addIssue({
          code: "custom",
          path: ["dominantPhone"],
          message: "Dominant member phone is required",
        });
      }
    });
}
export type PatientInsuranceFormValues = z.infer<
  ReturnType<typeof createPatientInsuranceFormSchema>
>;

// ─────────────────────────────────────────────────────────────────────────────
// Patient registration (nested structure used by PatientFormDialog)
// ─────────────────────────────────────────────────────────────────────────────

export const patientBasicFieldsSchema = z.object({
  firstName: requiredString("First name is required"),
  dateOfBirth: dateOfBirthSchema,
  gender: z
    .string()
    .trim()
    .min(1, "Gender is required"),
});
export type PatientBasicFieldErrors = z.inferFlattenedErrors<
  typeof patientBasicFieldsSchema
>;
