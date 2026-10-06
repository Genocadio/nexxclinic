(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/hooks/use-debounced-validation.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * use-debounced-validation.ts
 *
 * Debounces react-hook-form's live validation so complex schemas (cross-field
 * `superRefine` rules, conditional fields, arrays) aren't re-parsed on every
 * keystroke. Use it alongside `mode: "onSubmit"` on the forms it powers:
 *
 *   const form = useForm({ resolver, mode: "onSubmit" });
 *   useDebouncedValidation({ control: form.control, trigger: form.trigger });
 *
 * Behavior:
 * - Values still update instantly (no input lag) — only the validation pass is
 *   deferred until `delay` ms after the last change.
 * - Only fields the user has edited (or that already show an error) are
 *   re-validated, so untouched fields never flash errors while cross-field
 *   rules (superRefine) still re-run as you type.
 */ __turbopack_context__.s([
    "useDebouncedValidation",
    ()=>useDebouncedValidation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hook-form/dist/index.esm.mjs [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
function useDebouncedValidation({ control, trigger, delay = 350 }) {
    _s();
    const values = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWatch"])({
        control
    });
    const { dirtyFields, errors } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFormState"])({
        control
    });
    const timer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const triggerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(trigger);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useDebouncedValidation.useEffect": ()=>{
            triggerRef.current = trigger;
        }
    }["useDebouncedValidation.useEffect"], [
        trigger
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useDebouncedValidation.useEffect": ()=>{
            if (timer.current) clearTimeout(timer.current);
            timer.current = setTimeout({
                "useDebouncedValidation.useEffect": ()=>{
                    const dirtyNames = Object.keys(dirtyFields).filter({
                        "useDebouncedValidation.useEffect.dirtyNames": (key)=>Boolean(dirtyFields[key])
                    }["useDebouncedValidation.useEffect.dirtyNames"]);
                    const errorNames = Object.keys(errors);
                    const names = Array.from(new Set([
                        ...dirtyNames,
                        ...errorNames
                    ]));
                    if (names.length > 0) {
                        void triggerRef.current(names);
                    }
                }
            }["useDebouncedValidation.useEffect"], delay);
        // Re-run only when the form values (or delay) change; dirtyFields/errors
        // are read from the same render the change was applied in.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["useDebouncedValidation.useEffect"], [
        values,
        delay
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useDebouncedValidation.useEffect": ()=>({
                "useDebouncedValidation.useEffect": ()=>{
                    if (timer.current) clearTimeout(timer.current);
                }
            })["useDebouncedValidation.useEffect"]
    }["useDebouncedValidation.useEffect"], []);
}
_s(useDebouncedValidation, "0qVQ/lT/ztmaY44xWvlqj38gYp4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWatch"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFormState"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/validation-utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DAYS",
    ()=>DAYS,
    "MONTHS",
    ()=>MONTHS,
    "YEARS",
    ()=>YEARS,
    "calculateAge",
    ()=>calculateAge,
    "canAddNewInsurance",
    ()=>canAddNewInsurance,
    "checkRwandaNationalIdMismatch",
    ()=>checkRwandaNationalIdMismatch,
    "composeDob",
    ()=>composeDob,
    "formatPhoneNumber",
    ()=>formatPhoneNumber,
    "getDaysInMonth",
    ()=>getDaysInMonth,
    "getInputType",
    ()=>getInputType,
    "isDominantMemberRequired",
    ()=>isDominantMemberRequired,
    "isInsuranceEntryComplete",
    ()=>isInsuranceEntryComplete,
    "normalizePhoneNumber",
    ()=>normalizePhoneNumber,
    "parseDob",
    ()=>parseDob,
    "parseRwandaNationalId",
    ()=>parseRwandaNationalId,
    "sanitizeEmailInput",
    ()=>sanitizeEmailInput,
    "sanitizeEmailOrPhoneInput",
    ()=>sanitizeEmailOrPhoneInput,
    "sanitizeNationalIdInput",
    ()=>sanitizeNationalIdInput,
    "sanitizePhoneInput",
    ()=>sanitizePhoneInput,
    "sanitizePriceInput",
    ()=>sanitizePriceInput,
    "validateDateOfBirth",
    ()=>validateDateOfBirth,
    "validateEmailOrPhone",
    ()=>validateEmailOrPhone
]);
function sanitizeEmailInput(input) {
    return input.replace(/\s+/g, "").replace(/[;,]/g, "").replace(/[^a-zA-Z0-9@._%+-]/g, "");
}
function sanitizePriceInput(input) {
    if (!input) return "";
    // Remove commas, whitespace, and currency labels
    const cleaned = input.replace(/,/g, "").replace(/[^\d.]/g, "");
    // Ensure at most one decimal point
    const parts = cleaned.split(".");
    if (parts.length > 2) {
        return `${parts[0]}.${parts.slice(1).join("")}`;
    }
    return cleaned;
}
function formatPhoneNumber(input) {
    if (!input) return "";
    const isInternational = input.trim().startsWith("+");
    const digits = input.replace(/\D/g, "");
    if (!digits) {
        return isInternational ? "+" : "";
    }
    // Check if starts with "07" or "0" + Rwandan mobile prefix (078, 079, 073, 072, 077, etc.)
    if (input.trim().startsWith("0") && digits.startsWith("07")) {
        return formatRwandaDigits(digits.slice(1));
    }
    // Check if user entered "250"
    if (digits.startsWith("250")) {
        return formatRwandaDigits(digits.slice(3));
    }
    // Check if user entered "78...", "79...", "73...", "72...", "77..." (9 digits without leading 0)
    if (/^7[23789]/.test(digits) && !isInternational) {
        return formatRwandaDigits(digits);
    }
    // If international with other country code
    if (isInternational) {
        if (digits.length <= 3) return `+${digits}`;
        if (digits.length <= 6) return `+${digits.slice(0, 3)} ${digits.slice(3)}`;
        if (digits.length <= 9) return `+${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
        return `+${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
    }
    // Other local digits without recognized prefix
    if (digits.length <= 4) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
}
function formatRwandaDigits(rwaDigits) {
    const d = rwaDigits.slice(0, 9);
    if (d.length === 0) return "+250 ";
    if (d.length <= 3) return `+250 ${d}`;
    if (d.length <= 6) return `+250 ${d.slice(0, 3)} ${d.slice(3)}`;
    return `+250 ${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
}
function normalizePhoneNumber(input) {
    if (!input) return "";
    const formatted = formatPhoneNumber(input);
    return formatted.replace(/\s+/g, "");
}
function sanitizePhoneInput(input) {
    return formatPhoneNumber(input);
}
function sanitizeEmailOrPhoneInput(input) {
    const compact = input.replace(/\s+/g, "").replace(/[;,]/g, "");
    if (compact.includes("@")) {
        return sanitizeEmailInput(compact);
    }
    const looksLikePhone = compact.startsWith("+") || compact.startsWith("07") || /^\d+$/.test(compact);
    if (looksLikePhone) {
        return formatPhoneNumber(input);
    }
    return sanitizeEmailInput(compact);
}
function calculateAge(dateOfBirth) {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || monthDiff === 0 && today.getDate() < birthDate.getDate()) {
        age--;
    }
    return age;
}
function isDominantMemberRequired(dateOfBirth, hasInsurance) {
    if (!hasInsurance) return false;
    return calculateAge(dateOfBirth) <= 18;
}
function validateEmailOrPhone(input) {
    const trimmed = input.trim();
    if (!trimmed) {
        return {
            valid: false,
            error: "Email or phone number is required"
        };
    }
    const compact = trimmed.replace(/[\s\-().,;]/g, "");
    // International phone format: + followed by 7-15 digits
    if (compact.startsWith("+")) {
        const digitsOnly = compact.slice(1);
        if (/^\d{7,15}$/.test(digitsOnly)) {
            return {
                valid: true
            };
        }
        return {
            valid: false,
            error: "Phone number must be between 7 and 15 digits"
        };
    }
    // Local phone format: starts with 07, 7, etc. (7 to 15 digits)
    if (/^\d{7,15}$/.test(compact)) {
        return {
            valid: true
        };
    }
    // Email format: basic validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailPattern.test(trimmed)) {
        return {
            valid: true
        };
    }
    return {
        valid: false,
        error: "Enter a valid email address or phone number"
    };
}
function getInputType(input) {
    const trimmed = input.trim();
    if (trimmed.startsWith("+")) {
        return "phone_international";
    }
    if (trimmed.startsWith("07") || trimmed.startsWith("0")) {
        return "phone_local";
    }
    if (/^\d+$/.test(trimmed.replace(/\s+/g, ""))) {
        return "phone_local";
    }
    return "email";
}
const MONTHS = [
    {
        value: "01",
        label: "January"
    },
    {
        value: "02",
        label: "February"
    },
    {
        value: "03",
        label: "March"
    },
    {
        value: "04",
        label: "April"
    },
    {
        value: "05",
        label: "May"
    },
    {
        value: "06",
        label: "June"
    },
    {
        value: "07",
        label: "July"
    },
    {
        value: "08",
        label: "August"
    },
    {
        value: "09",
        label: "September"
    },
    {
        value: "10",
        label: "October"
    },
    {
        value: "11",
        label: "November"
    },
    {
        value: "12",
        label: "December"
    }
];
const DAYS = Array.from({
    length: 31
}, (_, i)=>String(i + 1).padStart(2, "0"));
const _currentYear = new Date().getFullYear();
const YEARS = Array.from({
    length: _currentYear - 1899
}, (_, i)=>String(_currentYear - i));
function parseDob(dateOfBirth) {
    if (!dateOfBirth) return {
        day: "",
        month: "",
        year: ""
    };
    const [y, m, d] = dateOfBirth.split("-");
    return {
        day: d || "",
        month: m || "",
        year: y || ""
    };
}
function composeDob(day, month, year) {
    if (!day || !month || !year) return "";
    return `${year}-${month}-${day}`;
}
function getDaysInMonth(month, year) {
    if (!month || !year) return DAYS;
    const m = Number.parseInt(month, 10);
    const y = Number.parseInt(year, 10);
    const lastDay = new Date(y, m, 0).getDate();
    return Array.from({
        length: lastDay
    }, (_, i)=>String(i + 1).padStart(2, "0"));
}
function validateDateOfBirth(dateOfBirth) {
    if (!dateOfBirth) {
        return {
            valid: false,
            error: "Date of birth is required"
        };
    }
    const date = new Date(dateOfBirth);
    if (isNaN(date.getTime())) {
        return {
            valid: false,
            error: "Please select a valid date"
        };
    }
    if (date > new Date()) {
        return {
            valid: false,
            error: "Date of birth cannot be in the future"
        };
    }
    // Verify the parsed date matches (catches Feb 30, etc.)
    const [y, m, d] = dateOfBirth.split("-").map(Number);
    if (date.getFullYear() !== y || date.getMonth() + 1 !== m || date.getDate() !== d) {
        return {
            valid: false,
            error: "Please select a valid date"
        };
    }
    return {
        valid: true
    };
}
function isInsuranceEntryComplete(ins, dateOfBirth) {
    if (!ins) return false;
    if (!ins.insuranceId || String(ins.insuranceId) === "0" || String(ins.insuranceId).trim() === "") {
        return false;
    }
    if (!ins.insuranceCardNumber?.trim()) {
        return false;
    }
    if (!ins.providingCompanyOrEmployer?.trim()) {
        return false;
    }
    const isAdult = calculateAge(dateOfBirth || "") >= 18;
    const isSelf = isAdult ? ins.isSelf !== false : false;
    if (!isSelf) {
        if (!ins.dominantMember?.firstName?.trim() || !ins.dominantMember?.lastName?.trim() || !ins.dominantMember?.phone?.trim()) {
            return false;
        }
    }
    return true;
}
function canAddNewInsurance(insurances, dateOfBirth) {
    if (!insurances || insurances.length === 0) return true;
    return insurances.every((ins)=>isInsuranceEntryComplete(ins, dateOfBirth));
}
function sanitizeNationalIdInput(input) {
    if (!input) return "";
    return input.replace(/[\s\-_]/g, "").trim();
}
function parseRwandaNationalId(input) {
    if (!input) return {
        valid: false,
        rawDigits: ""
    };
    const digits = input.replace(/\D/g, "");
    if (digits.length !== 16) {
        return {
            valid: false,
            rawDigits: digits
        };
    }
    const statusDigit = digits[0];
    const currentYear = new Date().getFullYear();
    const yearStr = digits.slice(1, 5);
    const yearOfBirth = parseInt(yearStr, 10);
    const isYearValid = yearOfBirth >= 1900 && yearOfBirth <= currentYear;
    const genderDigit = digits[5];
    let gender;
    let genderLabel;
    if (genderDigit === "8") {
        gender = "M";
        genderLabel = "Male";
    } else if (genderDigit === "7") {
        gender = "F";
        genderLabel = "Female";
    }
    const valid = isYearValid && gender !== undefined;
    const formatted = `${digits[0]} ${digits.slice(1, 5)} ${digits[5]} ${digits.slice(6, 13)} ${digits[13]} ${digits.slice(14)}`;
    return {
        valid,
        rawDigits: digits,
        statusDigit,
        yearOfBirth: isYearValid ? yearOfBirth : undefined,
        gender,
        genderLabel,
        formatted
    };
}
function checkRwandaNationalIdMismatch(nid, selectedGender, selectedDob) {
    const info = parseRwandaNationalId(nid);
    if (!info.valid) {
        return {
            hasMismatch: false,
            info
        };
    }
    const warnings = [];
    // Check gender mismatch
    if (selectedGender && info.gender) {
        const normGender = selectedGender.toUpperCase().startsWith("M") ? "M" : selectedGender.toUpperCase().startsWith("F") ? "F" : "";
        if (normGender && normGender !== info.gender) {
            warnings.push(`ID specifies ${info.genderLabel} (digit '${info.rawDigits[5]}'), but ${normGender === "M" ? "Male" : "Female"} is selected.`);
        }
    }
    // Check year of birth mismatch
    if (selectedDob && info.yearOfBirth) {
        const dobYear = parseInt(selectedDob.split("-")[0], 10);
        if (!isNaN(dobYear) && dobYear !== info.yearOfBirth) {
            warnings.push(`ID specifies birth year ${info.yearOfBirth}, but Date of Birth is ${dobYear}.`);
        }
    }
    return {
        hasMismatch: warnings.length > 0,
        warning: warnings.length > 0 ? warnings.join(" ") : undefined,
        info
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/form-schemas.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

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
 */ __turbopack_context__.s([
    "accountProfileFormSchema",
    ()=>accountProfileFormSchema,
    "changePasswordFormSchema",
    ()=>changePasswordFormSchema,
    "clinicProfileFormSchema",
    ()=>clinicProfileFormSchema,
    "confirmPasswordSchema",
    ()=>confirmPasswordSchema,
    "coveragePercentageFieldSchema",
    ()=>coveragePercentageFieldSchema,
    "createPasswordFormSchema",
    ()=>createPasswordFormSchema,
    "createPatientInsuranceFormSchema",
    ()=>createPatientInsuranceFormSchema,
    "createUserFormSchema",
    ()=>createUserFormSchema,
    "dateOfBirthSchema",
    ()=>dateOfBirthSchema,
    "emailOrPhoneSchema",
    ()=>emailOrPhoneSchema,
    "emailSchema",
    ()=>emailSchema,
    "insuranceProviderFormSchema",
    ()=>insuranceProviderFormSchema,
    "loginFormSchema",
    ()=>loginFormSchema,
    "passwordSchema",
    ()=>passwordSchema,
    "patientBasicFieldsSchema",
    ()=>patientBasicFieldsSchema,
    "productFormSchema",
    ()=>productFormSchema,
    "registerFormSchema",
    ()=>registerFormSchema,
    "requiredString",
    ()=>requiredString,
    "setupPasswordFormSchema",
    ()=>setupPasswordFormSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v3/external.js [app-client] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/validation-utils.ts [app-client] (ecmascript)");
;
;
const requiredString = (message = "This field is required")=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().min(1, message);
const emailSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().min(1, "Email is required").email("Enter a valid email address");
const emailOrPhoneSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().min(1, "Email or phone number is required").refine((value)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateEmailOrPhone"])(value).valid, (value)=>({
        message: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateEmailOrPhone"])(value).error || "Enter a valid email (user@domain.com) or phone (+256… / 07…)"
    }));
const passwordSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(8, "Password must be at least 8 characters").regex(/[A-Z]/, "Include at least one uppercase letter").regex(/[a-z]/, "Include at least one lowercase letter").regex(/[0-9]/, "Include at least one digit").regex(/[^a-zA-Z0-9]/, "Include at least one special character").regex(/^\S*$/, "Password cannot contain whitespace");
const confirmPasswordSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Please confirm your password");
const coveragePercentageFieldSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().min(1, "Coverage percentage is required").refine((value)=>{
    const n = Number(value);
    return !Number.isNaN(n) && n >= 0 && n <= 100;
}, "Coverage must be between 0 and 100");
const dateOfBirthSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().min(1, "Date of birth is required").refine((value)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateDateOfBirth"])(value).valid, (value)=>({
        message: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateDateOfBirth"])(value).error || "Invalid date of birth"
    }));
const loginFormSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    identifier: emailOrPhoneSchema,
    password: requiredString("Password is required")
});
const registerFormSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    name: requiredString("Full name is required"),
    gender: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "MALE",
        "FEMALE"
    ], {
        required_error: "Gender is required",
        invalid_type_error: "Gender is required"
    }),
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim(),
    phone: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim(),
    password: passwordSchema
}).superRefine((data, ctx)=>{
    const { email, phone, password, name, gender } = data;
    if (!gender) {
        ctx.addIssue({
            code: "custom",
            path: [
                "gender"
            ],
            message: "Gender is required"
        });
    }
    if (!email && !phone) {
        ctx.addIssue({
            code: "custom",
            path: [
                "email"
            ],
            message: "Email or phone number is required"
        });
        ctx.addIssue({
            code: "custom",
            path: [
                "phone"
            ],
            message: "Email or phone number is required"
        });
    }
    if (email) {
        const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateEmailOrPhone"])(email);
        if (!result.valid) {
            ctx.addIssue({
                code: "custom",
                path: [
                    "email"
                ],
                message: "Enter a valid email address"
            });
        }
    }
    if (phone) {
        const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateEmailOrPhone"])(phone);
        if (!result.valid) {
            ctx.addIssue({
                code: "custom",
                path: [
                    "phone"
                ],
                message: phone.includes("@") ? "Please enter a valid phone number, not email" : "Enter a valid phone number"
            });
        }
    }
    if (password && name) {
        const lowered = password.toLowerCase();
        for (const part of name.split(/\s+/)){
            if (part && lowered.includes(part.toLowerCase())) {
                ctx.addIssue({
                    code: "custom",
                    path: [
                        "password"
                    ],
                    message: "Password cannot contain your name"
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
                path: [
                    "password"
                ],
                message: "Password cannot contain your email prefix"
            });
        }
    }
});
const createPasswordFormSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    identifier: requiredString("Email or identifier is required"),
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema
}).refine((d)=>d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: [
        "confirmPassword"
    ]
});
const setupPasswordFormSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema
}).refine((d)=>d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: [
        "confirmPassword"
    ]
});
const changePasswordFormSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    currentPassword: requiredString("Current password is required"),
    newPassword: passwordSchema,
    confirmPassword: confirmPasswordSchema
}).refine((d)=>d.newPassword === d.confirmPassword, {
    message: "New passwords do not match",
    path: [
        "confirmPassword"
    ]
});
const accountProfileFormSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    name: requiredString("Name is required"),
    email: emailSchema,
    phoneNumber: requiredString("Phone number is required"),
    username: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim(),
    dateOfBirth: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim(),
    gender: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim()
});
const insuranceProviderFormSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    name: requiredString("Insurance name is required"),
    acronym: requiredString("Acronym is required"),
    coverage: coveragePercentageFieldSchema,
    supportedByClinic: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean()
});
const productFormSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    name: requiredString("Product name is required"),
    description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim(),
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Product type is required"),
    privatePrice: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().transform((val)=>val.replace(/,/g, "").trim()).refine((value)=>{
        const n = Number(value);
        return !Number.isNaN(n) && n >= 0 && value.length > 0;
    }, "Private price must be a positive number"),
    clinicPrice: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().transform((val)=>val ? val.replace(/,/g, "").trim() : "").refine((value)=>{
        if (!value) return true;
        const n = Number(value);
        return !Number.isNaN(n) && n >= 0;
    }, "Clinic price must be a valid non-negative number"),
    quantifiable: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(true)
});
function createUserFormSchema(options) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().optional(),
        firstName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().optional(),
        lastName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().optional(),
        email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim(),
        phoneNumber: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim(),
        gender: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim(),
        dateOfBirth: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim(),
        username: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim(),
        roles: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).min(1, "Select at least one role")
    }).superRefine((data, ctx)=>{
        const hasName = Boolean(data.name?.trim() || data.firstName?.trim());
        if (!hasName) {
            ctx.addIssue({
                code: "custom",
                path: [
                    data.name !== undefined ? "name" : "firstName"
                ],
                message: "Full name is required"
            });
        }
        if (!options.requireProfileFields) return;
        // For new users at least one contact + gender + dob are required.
        if (!data.email && !data.phoneNumber) {
            ctx.addIssue({
                code: "custom",
                path: [
                    "email"
                ],
                message: "Email or phone number is required"
            });
        }
        if (data.email) {
            const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateEmailOrPhone"])(data.email);
            if (!result.valid) {
                ctx.addIssue({
                    code: "custom",
                    path: [
                        "email"
                    ],
                    message: "Enter a valid email address"
                });
            }
        }
        if (!data.gender) {
            ctx.addIssue({
                code: "custom",
                path: [
                    "gender"
                ],
                message: "Gender is required"
            });
        }
        if (!data.dateOfBirth) {
            ctx.addIssue({
                code: "custom",
                path: [
                    "dateOfBirth"
                ],
                message: "Date of birth is required"
            });
        }
    });
}
const clinicProfileFormSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    name: requiredString("Clinic name is required"),
    tinNumber: requiredString("TIN number is required"),
    username: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim(),
    address: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim(),
    contacts: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        contactType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
        value: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim(),
        description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim()
    })).refine((contacts)=>contacts.some((c)=>c.value), "At least one clinic contact is required")
});
// ─────────────────────────────────────────────────────────────────────────────
// Patient insurance (dominant member rules depend on the patient's age)
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Matches the backend rule for principalMemberPhoneNumber:
 * optional leading +, then 7-15 digits.
 */ const PHONE_NUMBER_REGEX = /^\+?\d{7,15}$/;
const PHONE_FORMAT_MESSAGE = "Enter a valid phone number (7-15 digits, optional leading +)";
function createPatientInsuranceFormSchema(options) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        insuranceCardNumber: requiredString("Insurance card number is required"),
        providingCompanyOrEmployer: requiredString("Providing company or employer is required"),
        isSelf: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
        dominantName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().optional(),
        dominantFirstName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().optional(),
        dominantLastName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().optional(),
        dominantPhone: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().optional(),
        patientSharePercentage: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].union([
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number()
        ]).optional().nullable().refine((val)=>{
            if (val === null || val === undefined || val === '') return true;
            const num = Number(val);
            return !isNaN(num) && num >= 0 && num <= 100;
        }, {
            message: 'Patient share must be between 0 and 100'
        }),
        patientShareCoverageId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().nullable()
    }).superRefine((data, ctx)=>{
        // If patient is principal self, skip dominant member validation
        if (data.isSelf) {
            return;
        }
        // ── Format validation (runs if phone is supplied) ──
        if (data.dominantPhone && !PHONE_NUMBER_REGEX.test(data.dominantPhone.replace(/\s+/g, ""))) {
            ctx.addIssue({
                code: "custom",
                path: [
                    "dominantPhone"
                ],
                message: PHONE_FORMAT_MESSAGE
            });
        }
        // ── Dominant-member rules ──
        // Required if patient is <=18, OR isSelf is explicitly false, OR any dominant field is typed
        const hasAnyDominant = Boolean(data.dominantName || data.dominantFirstName || data.dominantLastName || data.dominantPhone);
        const mustFillDominant = options.dominantRequired || data.isSelf === false || hasAnyDominant;
        if (mustFillDominant) {
            const hasName = Boolean(data.dominantName?.trim() || data.dominantFirstName?.trim() && data.dominantLastName?.trim());
            if (!hasName) {
                if (data.dominantFirstName !== undefined || data.dominantLastName !== undefined) {
                    if (!data.dominantFirstName?.trim()) {
                        ctx.addIssue({
                            code: "custom",
                            path: [
                                "dominantFirstName"
                            ],
                            message: "Dominant member first name is required"
                        });
                    }
                    if (!data.dominantLastName?.trim()) {
                        ctx.addIssue({
                            code: "custom",
                            path: [
                                "dominantLastName"
                            ],
                            message: "Dominant member last name is required"
                        });
                    }
                } else {
                    ctx.addIssue({
                        code: "custom",
                        path: [
                            "dominantName"
                        ],
                        message: "Principal member full name is required"
                    });
                }
            }
            if (!data.dominantPhone) {
                ctx.addIssue({
                    code: "custom",
                    path: [
                        "dominantPhone"
                    ],
                    message: "Dominant member phone is required"
                });
            }
        }
    });
}
const patientBasicFieldsSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().optional(),
    firstName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().optional(),
    dateOfBirth: dateOfBirthSchema,
    gender: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().min(1, "Gender is required")
}).superRefine((data, ctx)=>{
    const hasName = Boolean(data.name?.trim() || data.firstName?.trim());
    if (!hasName) {
        ctx.addIssue({
            code: "custom",
            path: [
                data.name !== undefined ? "name" : "firstName"
            ],
            message: "Full name is required"
        });
    }
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/theme-switcher.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeSwitcher",
    ()=>ThemeSwitcher
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/moon.js [app-client] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sun.js [app-client] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/theme-context.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function ThemeSwitcher() {
    _s();
    const { theme, toggleTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: toggleTheme,
        className: "p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors",
        title: `Switch to ${theme === "dark" ? "light" : "dark"} mode`,
        children: theme === "dark" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
            className: "w-5 h-5 text-foreground"
        }, void 0, false, {
            fileName: "[project]/components/theme-switcher.tsx",
            lineNumber: 15,
            columnNumber: 27
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
            className: "w-5 h-5 text-foreground"
        }, void 0, false, {
            fileName: "[project]/components/theme-switcher.tsx",
            lineNumber: 15,
            columnNumber: 73
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/theme-switcher.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, this);
}
_s(ThemeSwitcher, "Q4eAjrIZ0CuRuhycs6byifK2KBk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
_c = ThemeSwitcher;
var _c;
__turbopack_context__.k.register(_c, "ThemeSwitcher");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
function Input({ className, type, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: type,
        "data-slot": "input",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-border/70 h-10 w-full min-w-0 rounded-md border bg-background px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm', 'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]', 'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/input.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Input;
;
var _c;
__turbopack_context__.k.register(_c, "Input");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/skeleton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Skeleton",
    ()=>Skeleton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
function Skeleton({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "skeleton",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('bg-accent animate-pulse rounded-md', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/skeleton.tsx",
        lineNumber: 5,
        columnNumber: 5
    }, this);
}
_c = Skeleton;
;
var _c;
__turbopack_context__.k.register(_c, "Skeleton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/field-error.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * FieldError — tiny inline validation message used below form fields.
 * Rendered directly under the input (never as a toast). Imported by the
 * react-hook-form + zod powered forms.
 */ __turbopack_context__.s([
    "FieldError",
    ()=>FieldError,
    "hasError",
    ()=>hasError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function FieldError({ message, className }) {
    if (!message) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        role: "alert",
        className: `mt-1.5 text-xs font-medium text-red-600 dark:text-red-400 ${className ?? ""}`,
        children: message
    }, void 0, false, {
        fileName: "[project]/components/ui/field-error.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
_c = FieldError;
function hasError(message) {
    return Boolean(message);
}
var _c;
__turbopack_context__.k.register(_c, "FieldError");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/auth/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*  ==============================
    pages/auth/page.tsx (fixed)
   ============================== */ __turbopack_context__.s([
    "AuthPageContent",
    ()=>AuthPageContent,
    "default",
    ()=>AuthPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye-off.js [app-client] (ecmascript) <export default as EyeOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-toastify/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hook-form/dist/index.esm.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$hookform$2f$resolvers$2f$zod$2f$dist$2f$zod$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@hookform/resolvers/zod/dist/zod.mjs [app-client] (ecmascript)");
/* ---- custom hooks ----------------------------------------------------- */ var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$auth$2d$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hooks/auth-hooks.ts [app-client] (ecmascript) <locals>"); // ← new
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$auth$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/auth/hooks.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth-context.tsx [app-client] (ecmascript)"); // ← now includes setClinicProfile
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$debounced$2d$validation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-debounced-validation.ts [app-client] (ecmascript)");
/* ---- helpers ---------------------------------------------------------- */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$clinic$2d$profile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/clinic-profile.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$role$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/role-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/validation-utils.ts [app-client] (ecmascript)");
/* ---- validation schemas ------------------------------------------------ */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$form$2d$schemas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/form-schemas.ts [app-client] (ecmascript)");
/* ---- ui --------------------------------------------------------------- */ var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$theme$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/theme-switcher.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/skeleton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2d$error$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/field-error.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
function AuthPageContent() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    /* --------------------------------------------------------------------- */ /* 1️⃣  Use the AuthProvider ------------------------------------------------- */ /* --------------------------------------------------------------------- */ const { isAuthenticated, isLoading, doctor, clinicProfile, login, register, setClinicProfile } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    /* --------------------------------------------------------------------- */ /* 2️⃣  Fetch clinic profile from the backend                            */ /* --------------------------------------------------------------------- */ const { clinicProfile: fetchedClinicProfile, loading: clinicLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$auth$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClinicProfile"])(); // runs on every mount of /auth
    /* Push fetched data into context (and localStorage via setClinicProfile) */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthPageContent.useEffect": ()=>{
            if (!clinicLoading && fetchedClinicProfile && !clinicProfile) {
                setClinicProfile(fetchedClinicProfile);
            }
        }
    }["AuthPageContent.useEffect"], [
        fetchedClinicProfile,
        clinicLoading,
        clinicProfile,
        setClinicProfile
    ]);
    /* --------------------------------------------------------------------- */ /* 3️⃣  Tab mode & form state                                           */ /* --------------------------------------------------------------------- */ const initialMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AuthPageContent.useMemo[initialMode]": ()=>searchParams.get("mode") === "register" ? "register" : "login"
    }["AuthPageContent.useMemo[initialMode]"], [
        searchParams
    ]);
    const [mode, setMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialMode);
    const [showPassword, setShowPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isLoadingForm, setIsLoadingForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const loginForm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useForm"])({
        resolver: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$hookform$2f$resolvers$2f$zod$2f$dist$2f$zod$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zodResolver"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$form$2d$schemas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loginFormSchema"]),
        mode: "onChange",
        defaultValues: {
            identifier: "",
            password: ""
        }
    });
    const registerForm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useForm"])({
        resolver: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$hookform$2f$resolvers$2f$zod$2f$dist$2f$zod$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zodResolver"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$form$2d$schemas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["registerFormSchema"]),
        // The register schema re-runs cross-field superRefine checks (email/phone
        // presence + format, password-vs-name/email rules) as you type, so its
        // live validation is debounced instead of re-parsing on every keystroke.
        mode: "onSubmit",
        defaultValues: {
            name: "",
            gender: "MALE",
            email: "",
            phone: "",
            password: ""
        }
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$debounced$2d$validation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDebouncedValidation"])({
        control: registerForm.control,
        trigger: registerForm.trigger
    });
    /* --------------------------------------------------------------------- */ /* 4️⃣  UI helpers                                                      */ /* --------------------------------------------------------------------- */ const clinicName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$clinic$2d$profile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getClinicDisplayName"])(clinicProfile);
    const clinicLogoUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$clinic$2d$profile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getClinicLogoUrl"])(clinicProfile);
    // Show skeleton while either the auth context or the profile query
    // is still loading. After first render `clinicLoading` will be true.
    const showBrandSkeleton = isLoading || clinicLoading;
    const baseInputClass = "rounded-xl border-slate-300 bg-white/95 text-slate-900 placeholder:text-slate-500 shadow-sm focus-visible:border-slate-500 focus-visible:ring-slate-300/70 dark:border-input dark:bg-input/30 dark:text-foreground dark:placeholder:text-muted-foreground";
    const tabButtonClass = (isActive)=>`rounded-xl transition-all duration-300 ${isActive ? "shadow-md" : "text-slate-700 hover:text-slate-900 hover:bg-white/80 dark:text-slate-300 dark:hover:text-slate-50 dark:hover:bg-slate-700/60"}`;
    /* --------------------------------------------------------------------- */ /* 5️⃣  Handlers                                                       */ /* --------------------------------------------------------------------- */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthPageContent.useEffect": ()=>{
            setMode(initialMode);
            loginForm.clearErrors();
            registerForm.clearErrors();
        }
    }["AuthPageContent.useEffect"], [
        initialMode
    ]);
    // Redirect after login
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthPageContent.useEffect": ()=>{
            if (isAuthenticated) {
                const roles = doctor?.roles || [];
                router.replace((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$role$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPostLoginPath"])(roles));
            }
        }
    }["AuthPageContent.useEffect"], [
        doctor,
        isAuthenticated,
        router
    ]);
    const switchMode = (next)=>{
        setMode(next);
        loginForm.clearErrors();
        registerForm.clearErrors();
        router.replace(next === "register" ? "/auth?mode=register" : "/auth");
    };
    // Password strength meter for the register tab.
    const registerPassword = registerForm.watch("password");
    const registerName = registerForm.watch("name");
    const registerEmail = registerForm.watch("email");
    const passwordStrength = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AuthPageContent.useMemo[passwordStrength]": ()=>{
            const pw = registerPassword;
            if (!pw) return null;
            const checks = {
                length: pw.length >= 8,
                upper: /[A-Z]/.test(pw),
                lower: /[a-z]/.test(pw),
                digit: /[0-9]/.test(pw),
                special: /[^a-zA-Z0-9]/.test(pw),
                noWhitespace: !/\s/.test(pw),
                noName: ({
                    "AuthPageContent.useMemo[passwordStrength]": ()=>{
                        if (!registerName) return true;
                        const lowered = pw.toLowerCase();
                        return !registerName.split(/\s+/).some({
                            "AuthPageContent.useMemo[passwordStrength]": (part)=>part && lowered.includes(part.toLowerCase())
                        }["AuthPageContent.useMemo[passwordStrength]"]);
                    }
                })["AuthPageContent.useMemo[passwordStrength]"](),
                noEmailPrefix: ({
                    "AuthPageContent.useMemo[passwordStrength]": ()=>{
                        if (!registerEmail) return true;
                        const prefix = registerEmail.split("@")[0].toLowerCase();
                        return !prefix || !pw.toLowerCase().includes(prefix);
                    }
                })["AuthPageContent.useMemo[passwordStrength]"]()
            };
            const score = [
                checks.length,
                checks.upper,
                checks.lower,
                checks.digit,
                checks.special
            ].filter(Boolean).length;
            const label = score >= 4 ? "Strong" : score >= 2 ? "Medium" : "Easy";
            const color = score >= 4 ? "bg-green-500" : score >= 2 ? "bg-amber-500" : "bg-red-500";
            const textColor = score >= 4 ? "text-green-600" : score >= 2 ? "text-amber-600" : "text-red-600";
            return {
                score,
                label,
                color,
                textColor,
                checks
            };
        }
    }["AuthPageContent.useMemo[passwordStrength]"], [
        registerPassword,
        registerName,
        registerEmail
    ]);
    const getWelcomeName = (identifier)=>{
        if ("TURBOPACK compile-time truthy", 1) {
            try {
                const storedDoctor = localStorage.getItem("doctor");
                if (storedDoctor) {
                    const parsedDoctor = JSON.parse(storedDoctor);
                    if (parsedDoctor?.name?.trim()) {
                        return parsedDoctor.name.trim();
                    }
                }
            } catch  {
            // fallback below
            }
        }
        if (identifier.includes("@")) {
            const emailPrefix = identifier.split("@")[0]?.trim();
            if (emailPrefix) {
                return emailPrefix.replace(/[._-]+/g, " ").replace(/\b\w/g, (char)=>char.toUpperCase());
            }
        }
        return "Doctor";
    };
    const getStoredRoles = ()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        try {
            const storedDoctor = localStorage.getItem("doctor");
            if (!storedDoctor) return [];
            const parsedDoctor = JSON.parse(storedDoctor);
            return parsedDoctor?.roles || [];
        } catch  {
            return [];
        }
    };
    /* ---- Submit handlers ------------------------------------------------- */ const handleLogin = async (values)=>{
        setIsLoadingForm(true);
        try {
            const result = await login(values.identifier, values.password);
            if (result.success) {
                const welcomeName = getWelcomeName(values.identifier);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Welcome back, ${welcomeName}`, {
                    position: "top-center",
                    autoClose: 2200,
                    closeOnClick: false,
                    draggable: false,
                    pauseOnHover: false,
                    pauseOnFocusLoss: false,
                    closeButton: false,
                    className: "nexx-toast-welcome"
                });
                router.replace((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$role$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPostLoginPath"])(getStoredRoles()));
                return;
            }
            if (result.requiresPasswordSetup) {
                const params = new URLSearchParams({
                    identifier: values.identifier
                });
                router.replace(`/create-password?${params.toString()}`);
                return;
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(result.message || "Login failed");
        } catch  {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Login failed");
        } finally{
            setIsLoadingForm(false);
        }
    };
    const handleRegister = async (values)=>{
        setIsLoadingForm(true);
        try {
            const result = await register(values.name, values.email, values.password, values.phone, values.gender);
            if (result.success) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(result.message || "Registration successful");
                switchMode("login");
                return;
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(result.message || "Registration failed");
        } catch  {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Registration failed");
        } finally{
            setIsLoadingForm(false);
        }
    };
    const loginErrors = loginForm.formState.errors;
    const registerErrors = registerForm.formState.errors;
    const errorInputClass = "border-amber-500 focus-visible:ring-amber-300";
    /* --------------------------------------------------------------------- */ /* 6️⃣  Render                                                          */ /* --------------------------------------------------------------------- */ return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-e40d7299303a7414" + " " + "relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-amber-50 to-orange-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center px-4 py-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-e40d7299303a7414" + " " + "pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-orange-200/50 blur-3xl dark:bg-orange-500/20"
            }, void 0, false, {
                fileName: "[project]/app/auth/page.tsx",
                lineNumber: 290,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-e40d7299303a7414" + " " + "pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-cyan-200/40 blur-3xl dark:bg-cyan-500/20"
            }, void 0, false, {
                fileName: "[project]/app/auth/page.tsx",
                lineNumber: 291,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-e40d7299303a7414" + " " + "absolute right-4 top-4 z-20 rounded-2xl border border-slate-300/90 bg-white/90 p-1.5 shadow-lg ring-1 ring-white/80 backdrop-blur-md dark:border-white/15 dark:bg-slate-900/70 dark:ring-white/10 sm:right-6 sm:top-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$theme$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeSwitcher"], {}, void 0, false, {
                    fileName: "[project]/app/auth/page.tsx",
                    lineNumber: 295,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/auth/page.tsx",
                lineNumber: 294,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-e40d7299303a7414" + " " + "w-full max-w-md relative z-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-e40d7299303a7414" + " " + "mb-8 text-center fly-in fly-in-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-e40d7299303a7414" + " " + "flex items-center justify-center mb-4 fly-in fly-in-2",
                                children: showBrandSkeleton ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                    className: "h-16 w-16 rounded-2xl bg-white/70 dark:bg-slate-900/60 ring-1 ring-white/60 dark:ring-white/10"
                                }, void 0, false, {
                                    fileName: "[project]/app/auth/page.tsx",
                                    lineNumber: 304,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-e40d7299303a7414" + " " + "relative h-16 w-16 rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-md shadow-lg ring-1 ring-white/60 dark:ring-white/10 overflow-hidden flex items-center justify-center",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: clinicLogoUrl,
                                        alt: `${clinicName} logo`,
                                        className: "jsx-e40d7299303a7414" + " " + "h-16 w-16 object-contain"
                                    }, void 0, false, {
                                        fileName: "[project]/app/auth/page.tsx",
                                        lineNumber: 307,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/auth/page.tsx",
                                    lineNumber: 306,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/auth/page.tsx",
                                lineNumber: 302,
                                columnNumber: 11
                            }, this),
                            showBrandSkeleton ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-e40d7299303a7414" + " " + "space-y-3 flex flex-col items-center fly-in fly-in-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                        className: "h-8 w-44 rounded-xl bg-white/70 dark:bg-slate-900/60"
                                    }, void 0, false, {
                                        fileName: "[project]/app/auth/page.tsx",
                                        lineNumber: 315,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                        className: "h-4 w-28 rounded-xl bg-white/60 dark:bg-slate-900/50"
                                    }, void 0, false, {
                                        fileName: "[project]/app/auth/page.tsx",
                                        lineNumber: 316,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/auth/page.tsx",
                                lineNumber: 314,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "jsx-e40d7299303a7414" + " " + "text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2 fly-in fly-in-3",
                                        children: clinicName
                                    }, void 0, false, {
                                        fileName: "[project]/app/auth/page.tsx",
                                        lineNumber: 320,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "jsx-e40d7299303a7414" + " " + "text-slate-600 dark:text-slate-300 fly-in fly-in-4",
                                        children: "Welcome back"
                                    }, void 0, false, {
                                        fileName: "[project]/app/auth/page.tsx",
                                        lineNumber: 321,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/auth/page.tsx",
                        lineNumber: 300,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-e40d7299303a7414" + " " + "rounded-3xl border border-slate-300/90 dark:border-white/10 bg-white/88 dark:bg-slate-900/70 backdrop-blur-xl p-8 shadow-2xl ring-1 ring-white/90 dark:ring-white/5 space-y-5 fly-in fly-in-5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-e40d7299303a7414" + " " + "grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-slate-100/90 dark:border-white/10 dark:bg-slate-800/80 p-1 ring-1 ring-white/90 dark:ring-white/10 fly-in fly-in-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        type: "button",
                                        variant: mode === "login" ? "default" : "ghost",
                                        className: tabButtonClass(mode === "login"),
                                        onClick: ()=>switchMode("login"),
                                        disabled: isLoadingForm,
                                        children: "Login"
                                    }, void 0, false, {
                                        fileName: "[project]/app/auth/page.tsx",
                                        lineNumber: 330,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        type: "button",
                                        variant: mode === "register" ? "default" : "ghost",
                                        className: tabButtonClass(mode === "register"),
                                        onClick: ()=>switchMode("register"),
                                        disabled: isLoadingForm,
                                        children: "Register"
                                    }, void 0, false, {
                                        fileName: "[project]/app/auth/page.tsx",
                                        lineNumber: 333,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/auth/page.tsx",
                                lineNumber: 329,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-e40d7299303a7414" + " " + "mode-switch-panel",
                                children: [
                                    mode === "login" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                        onSubmit: loginForm.handleSubmit(handleLogin),
                                        noValidate: true,
                                        className: "jsx-e40d7299303a7414" + " " + "space-y-4 fly-in fly-in-7",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-e40d7299303a7414",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "jsx-e40d7299303a7414" + " " + "block text-sm font-medium text-slate-800 dark:text-slate-200 mb-1.5",
                                                        children: "Email or Phone"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/auth/page.tsx",
                                                        lineNumber: 343,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                        ...loginForm.register("identifier"),
                                                        onChange: (e)=>loginForm.setValue("identifier", (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sanitizeEmailOrPhoneInput"])(e.target.value)),
                                                        type: "text",
                                                        disabled: isLoadingForm,
                                                        placeholder: "dr.name@eyecare.com or +256701234567 or 0712345678",
                                                        className: `w-full ${baseInputClass} ${loginErrors.identifier ? errorInputClass : ""}`
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/auth/page.tsx",
                                                        lineNumber: 344,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2d$error$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FieldError"], {
                                                        message: loginErrors.identifier?.message
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/auth/page.tsx",
                                                        lineNumber: 352,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/auth/page.tsx",
                                                lineNumber: 342,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-e40d7299303a7414",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "jsx-e40d7299303a7414" + " " + "block text-sm font-medium text-slate-800 dark:text-slate-200 mb-1.5",
                                                        children: "Password"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/auth/page.tsx",
                                                        lineNumber: 355,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-e40d7299303a7414" + " " + "relative",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                ...loginForm.register("password"),
                                                                type: showPassword ? "text" : "password",
                                                                disabled: isLoadingForm,
                                                                placeholder: "Enter your password",
                                                                className: `w-full pr-10 ${baseInputClass} ${loginErrors.password ? errorInputClass : ""}`
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/auth/page.tsx",
                                                                lineNumber: 357,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                disabled: isLoadingForm,
                                                                onClick: ()=>setShowPassword(!showPassword),
                                                                className: "jsx-e40d7299303a7414" + " " + "absolute right-3 top-2.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors",
                                                                children: showPassword ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__["EyeOff"], {
                                                                    className: "w-4 h-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/auth/page.tsx",
                                                                    lineNumber: 365,
                                                                    columnNumber: 39
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                                    className: "w-4 h-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/auth/page.tsx",
                                                                    lineNumber: 365,
                                                                    columnNumber: 72
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/auth/page.tsx",
                                                                lineNumber: 364,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/auth/page.tsx",
                                                        lineNumber: 356,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2d$error$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FieldError"], {
                                                        message: loginErrors.password?.message
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/auth/page.tsx",
                                                        lineNumber: 368,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/auth/page.tsx",
                                                lineNumber: 354,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                type: "submit",
                                                disabled: isLoadingForm,
                                                className: "w-full mt-2 rounded-xl",
                                                children: isLoadingForm ? "Signing In..." : "Sign In"
                                            }, void 0, false, {
                                                fileName: "[project]/app/auth/page.tsx",
                                                lineNumber: 370,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/auth/page.tsx",
                                        lineNumber: 341,
                                        columnNumber: 15
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                        onSubmit: registerForm.handleSubmit(handleRegister),
                                        noValidate: true,
                                        className: "jsx-e40d7299303a7414" + " " + "space-y-4 fly-in fly-in-7",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-e40d7299303a7414",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "jsx-e40d7299303a7414" + " " + "block text-sm font-medium text-slate-800 dark:text-slate-200 mb-1.5",
                                                        children: "Full Name"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/auth/page.tsx",
                                                        lineNumber: 377,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                        ...registerForm.register("name"),
                                                        type: "text",
                                                        disabled: isLoadingForm,
                                                        placeholder: "Enter your full name",
                                                        className: `${baseInputClass} ${registerErrors.name ? errorInputClass : ""}`
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/auth/page.tsx",
                                                        lineNumber: 378,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2d$error$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FieldError"], {
                                                        message: registerErrors.name?.message
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/auth/page.tsx",
                                                        lineNumber: 385,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/auth/page.tsx",
                                                lineNumber: 376,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-e40d7299303a7414",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "jsx-e40d7299303a7414" + " " + "block text-sm font-medium text-slate-800 dark:text-slate-200 mb-1.5",
                                                        children: "Gender"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/auth/page.tsx",
                                                        lineNumber: 388,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-e40d7299303a7414" + " " + "grid grid-cols-2 gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                disabled: isLoadingForm,
                                                                onClick: ()=>registerForm.setValue("gender", "MALE", {
                                                                        shouldValidate: true
                                                                    }),
                                                                className: "jsx-e40d7299303a7414" + " " + `h-10 rounded-xl border text-sm font-medium transition-all ${registerForm.watch("gender") === "MALE" ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-white/95 dark:bg-input/30 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-input hover:bg-slate-50 dark:hover:bg-slate-800"}`,
                                                                children: "Male"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/auth/page.tsx",
                                                                lineNumber: 390,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                disabled: isLoadingForm,
                                                                onClick: ()=>registerForm.setValue("gender", "FEMALE", {
                                                                        shouldValidate: true
                                                                    }),
                                                                className: "jsx-e40d7299303a7414" + " " + `h-10 rounded-xl border text-sm font-medium transition-all ${registerForm.watch("gender") === "FEMALE" ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-white/95 dark:bg-input/30 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-input hover:bg-slate-50 dark:hover:bg-slate-800"}`,
                                                                children: "Female"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/auth/page.tsx",
                                                                lineNumber: 402,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/auth/page.tsx",
                                                        lineNumber: 389,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2d$error$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FieldError"], {
                                                        message: registerErrors.gender?.message
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/auth/page.tsx",
                                                        lineNumber: 415,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/auth/page.tsx",
                                                lineNumber: 387,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-e40d7299303a7414",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "jsx-e40d7299303a7414" + " " + "block text-sm font-medium text-slate-800 dark:text-slate-200 mb-1.5",
                                                        children: "Email Address"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/auth/page.tsx",
                                                        lineNumber: 418,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                        ...registerForm.register("email"),
                                                        onChange: (e)=>registerForm.setValue("email", (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sanitizeEmailInput"])(e.target.value)),
                                                        type: "email",
                                                        disabled: isLoadingForm,
                                                        placeholder: "dr.name@eyecare.com",
                                                        className: `${baseInputClass} ${registerErrors.email ? errorInputClass : ""}`
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/auth/page.tsx",
                                                        lineNumber: 419,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2d$error$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FieldError"], {
                                                        message: registerErrors.email?.message
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/auth/page.tsx",
                                                        lineNumber: 427,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/auth/page.tsx",
                                                lineNumber: 417,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-e40d7299303a7414",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "jsx-e40d7299303a7414" + " " + "block text-sm font-medium text-slate-800 dark:text-slate-200 mb-1.5",
                                                        children: "Phone Number"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/auth/page.tsx",
                                                        lineNumber: 430,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                        ...registerForm.register("phone"),
                                                        onChange: (e)=>registerForm.setValue("phone", (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sanitizePhoneInput"])(e.target.value)),
                                                        type: "tel",
                                                        disabled: isLoadingForm,
                                                        placeholder: "+256701234567 or 0712345678",
                                                        className: `${baseInputClass} ${registerErrors.phone ? errorInputClass : ""}`
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/auth/page.tsx",
                                                        lineNumber: 431,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2d$error$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FieldError"], {
                                                        message: registerErrors.phone?.message
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/auth/page.tsx",
                                                        lineNumber: 439,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "jsx-e40d7299303a7414" + " " + "mt-1 text-xs text-muted-foreground",
                                                        children: "At least one contact method required"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/auth/page.tsx",
                                                        lineNumber: 440,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/auth/page.tsx",
                                                lineNumber: 429,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-e40d7299303a7414",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "jsx-e40d7299303a7414" + " " + "block text-sm font-medium text-slate-800 dark:text-slate-200 mb-1.5",
                                                        children: "Password"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/auth/page.tsx",
                                                        lineNumber: 443,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-e40d7299303a7414" + " " + "relative",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                ...registerForm.register("password"),
                                                                type: showPassword ? "text" : "password",
                                                                disabled: isLoadingForm,
                                                                placeholder: "Enter your password",
                                                                className: `w-full pr-10 ${baseInputClass} ${registerErrors.password ? errorInputClass : ""}`
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/auth/page.tsx",
                                                                lineNumber: 445,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                disabled: isLoadingForm,
                                                                onClick: ()=>setShowPassword(!showPassword),
                                                                className: "jsx-e40d7299303a7414" + " " + "absolute right-3 top-2.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors",
                                                                children: showPassword ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__["EyeOff"], {
                                                                    className: "w-4 h-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/auth/page.tsx",
                                                                    lineNumber: 453,
                                                                    columnNumber: 39
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                                    className: "w-4 h-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/auth/page.tsx",
                                                                    lineNumber: 453,
                                                                    columnNumber: 72
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/auth/page.tsx",
                                                                lineNumber: 452,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/auth/page.tsx",
                                                        lineNumber: 444,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2d$error$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FieldError"], {
                                                        message: registerErrors.password?.message
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/auth/page.tsx",
                                                        lineNumber: 456,
                                                        columnNumber: 19
                                                    }, this),
                                                    passwordStrength && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-e40d7299303a7414" + " " + "mt-2 space-y-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-e40d7299303a7414" + " " + "flex items-center gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-e40d7299303a7414" + " " + "flex-1 h-1.5 rounded-full bg-muted overflow-hidden",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            style: {
                                                                                width: `${passwordStrength.score / 5 * 100}%`
                                                                            },
                                                                            className: "jsx-e40d7299303a7414" + " " + `h-full rounded-full transition-all ${passwordStrength.color}`
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/auth/page.tsx",
                                                                            lineNumber: 461,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/auth/page.tsx",
                                                                        lineNumber: 460,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "jsx-e40d7299303a7414" + " " + `text-xs font-medium ${passwordStrength.textColor}`,
                                                                        children: passwordStrength.label
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/auth/page.tsx",
                                                                        lineNumber: 463,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/auth/page.tsx",
                                                                lineNumber: 459,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                                className: "jsx-e40d7299303a7414" + " " + "space-y-0.5",
                                                                children: [
                                                                    {
                                                                        key: "length",
                                                                        label: "At least 8 characters"
                                                                    },
                                                                    {
                                                                        key: "upper",
                                                                        label: "Uppercase letter"
                                                                    },
                                                                    {
                                                                        key: "lower",
                                                                        label: "Lowercase letter"
                                                                    },
                                                                    {
                                                                        key: "digit",
                                                                        label: "Digit"
                                                                    },
                                                                    {
                                                                        key: "special",
                                                                        label: "Special character"
                                                                    },
                                                                    {
                                                                        key: "noWhitespace",
                                                                        label: "No whitespace"
                                                                    },
                                                                    {
                                                                        key: "noName",
                                                                        label: "Doesn't contain your name"
                                                                    },
                                                                    {
                                                                        key: "noEmailPrefix",
                                                                        label: "Doesn't contain your email prefix"
                                                                    }
                                                                ].map(({ key, label })=>{
                                                                    const ok = passwordStrength.checks[key];
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                        className: "jsx-e40d7299303a7414" + " " + `text-xs flex items-center gap-1.5 ${ok ? "text-green-600" : "text-muted-foreground"}`,
                                                                        children: [
                                                                            ok ? "✓" : "○",
                                                                            " ",
                                                                            label
                                                                        ]
                                                                    }, key, true, {
                                                                        fileName: "[project]/app/auth/page.tsx",
                                                                        lineNumber: 478,
                                                                        columnNumber: 29
                                                                    }, this);
                                                                })
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/auth/page.tsx",
                                                                lineNumber: 465,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/auth/page.tsx",
                                                        lineNumber: 458,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/auth/page.tsx",
                                                lineNumber: 442,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                type: "submit",
                                                disabled: isLoadingForm,
                                                className: "w-full mt-2 rounded-xl",
                                                children: isLoadingForm ? "Registering..." : "Register"
                                            }, void 0, false, {
                                                fileName: "[project]/app/auth/page.tsx",
                                                lineNumber: 487,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/auth/page.tsx",
                                        lineNumber: 375,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "jsx-e40d7299303a7414" + " " + "text-xs text-muted-foreground text-center fly-in fly-in-8",
                                        children: mode === "login" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                "Need an account?",
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/auth?mode=register",
                                                    className: "text-primary hover:underline",
                                                    children: "Register"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/auth/page.tsx",
                                                    lineNumber: 498,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                "Already have an account?",
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/auth",
                                                    className: "text-primary hover:underline",
                                                    children: "Login"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/auth/page.tsx",
                                                    lineNumber: 505,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true)
                                    }, void 0, false, {
                                        fileName: "[project]/app/auth/page.tsx",
                                        lineNumber: 494,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, mode, true, {
                                fileName: "[project]/app/auth/page.tsx",
                                lineNumber: 339,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/auth/page.tsx",
                        lineNumber: 327,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/auth/page.tsx",
                lineNumber: 299,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "e40d7299303a7414",
                children: ".fly-in.jsx-e40d7299303a7414{opacity:0;will-change:transform,opacity;animation:.56s cubic-bezier(.21,1.02,.73,1) forwards flyIn}.fly-in-1.jsx-e40d7299303a7414{animation-delay:30ms}.fly-in-2.jsx-e40d7299303a7414{animation-delay:80ms}.fly-in-3.jsx-e40d7299303a7414{animation-delay:.13s}.fly-in-4.jsx-e40d7299303a7414{animation-delay:.18s}.fly-in-5.jsx-e40d7299303a7414{animation-delay:.23s}.fly-in-6.jsx-e40d7299303a7414{animation-delay:.29s}.fly-in-7.jsx-e40d7299303a7414{animation-delay:.35s}.fly-in-8.jsx-e40d7299303a7414{animation-delay:.42s}@keyframes flyIn{0%{opacity:0;filter:blur(6px);transform:translateY(22px)scale(.985)}60%{opacity:1;filter:blur();transform:translateY(-2px)scale(1.002)}to{opacity:1;filter:none;transform:translateY(0)scale(1)}}.mode-switch-panel.jsx-e40d7299303a7414{transform-origin:top;animation:.32s cubic-bezier(.2,.75,.35,1) both modeSwitchIn}@keyframes modeSwitchIn{0%{opacity:0;transform:translateY(10px)scale(.992)}to{opacity:1;transform:translateY(0)scale(1)}}@media (prefers-reduced-motion:reduce){.fly-in.jsx-e40d7299303a7414,.mode-switch-panel.jsx-e40d7299303a7414{opacity:1;animation:none}}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/auth/page.tsx",
        lineNumber: 288,
        columnNumber: 5
    }, this);
}
_s(AuthPageContent, "YK9umN15jV8A9hUxIiGXv1zbc/E=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$auth$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClinicProfile"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useForm"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useForm"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$debounced$2d$validation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDebouncedValidation"]
    ];
});
_c = AuthPageContent;
function AuthPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-gradient-to-br from-slate-100 via-amber-50 to-orange-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
        }, void 0, false, {
            fileName: "[project]/app/auth/page.tsx",
            lineNumber: 583,
            columnNumber: 9
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthPageContent, {}, void 0, false, {
            fileName: "[project]/app/auth/page.tsx",
            lineNumber: 586,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/auth/page.tsx",
        lineNumber: 581,
        columnNumber: 5
    }, this);
}
_c1 = AuthPage;
var _c, _c1;
__turbopack_context__.k.register(_c, "AuthPageContent");
__turbopack_context__.k.register(_c1, "AuthPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_ec4dfaea._.js.map