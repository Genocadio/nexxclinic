(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
"[project]/hooks/patients/use-save-patient-insurance.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSavePatientInsurance",
    ()=>useSavePatientInsurance,
    "validateSavePatientInsuranceInput",
    ()=>validateSavePatientInsuranceInput
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/validation-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$patient$2d$display$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/patient-display-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$patients$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/patients/hooks.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
;
/**
 * Matches the backend rule for principalMemberPhoneNumber:
 * optional leading +, then 7-15 digits.
 */ const PHONE_NUMBER_REGEX = /^\+?\d{7,15}$/;
function validateSavePatientInsuranceInput(input) {
    const errors = {};
    const dominantRequired = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDominantMemberRequired"])(input.patientDateOfBirth, true);
    if (!input.insuranceCardNumber.trim()) {
        errors.card = 'Insurance card number is required.';
    }
    if (!input.providingCompanyOrEmployer.trim()) {
        errors.employer = 'Providing company or employer is required.';
    }
    // If patient is self, no dominant member validation required
    if (input.isSelf) {
        return errors;
    }
    // Format validation — reject invalid phone even if dominant is not required
    if (input.dominantPhone?.trim() && !PHONE_NUMBER_REGEX.test(input.dominantPhone.trim().replace(/\s+/g, ''))) {
        errors.dominant = 'Enter a valid phone number (7-15 digits, optional leading +)';
    }
    const resolved = input.dominantName ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$patient$2d$display$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["splitFullName"])(input.dominantName) : {
        firstName: input.dominantFirstName?.trim() || '',
        lastName: input.dominantLastName?.trim() || ''
    };
    const firstName = resolved.firstName || input.dominantFirstName?.trim() || '';
    const lastName = resolved.lastName || input.dominantLastName?.trim() || '';
    const mustFillDominant = dominantRequired || input.isSelf === false || Boolean(input.dominantName?.trim() || firstName || lastName || input.dominantPhone?.trim());
    if (mustFillDominant && (!firstName || !lastName || !input.dominantPhone?.trim())) {
        errors.dominant = dominantRequired ? 'Principal member full name and phone are required for patients 18 years or younger.' : 'Principal member full name and phone are required when patient is not the principal policyholder.';
    }
    return errors;
}
function useSavePatientInsurance() {
    _s();
    const { createPatientInsurance, loading: creating } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$patients$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCreatePatientInsurance"])();
    const { updatePatientInsurance, loading: updating } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$patients$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUpdatePatientInsurance"])();
    const savePatientInsurance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSavePatientInsurance.useCallback[savePatientInsurance]": async (input)=>{
            const fieldErrors = validateSavePatientInsuranceInput(input);
            if (Object.keys(fieldErrors).length > 0) {
                return {
                    status: 'VALIDATION_ERROR',
                    fieldErrors
                };
            }
            const resolved = input.dominantName ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$patient$2d$display$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["splitFullName"])(input.dominantName) : {
                firstName: input.dominantFirstName || '',
                lastName: input.dominantLastName || ''
            };
            const dominantMember = !input.isSelf && (input.dominantName || input.dominantFirstName || input.dominantLastName || input.dominantPhone) ? {
                name: input.dominantName || [
                    resolved.firstName,
                    resolved.lastName
                ].filter(Boolean).join(' ') || undefined,
                firstName: resolved.firstName || '',
                lastName: resolved.lastName || '',
                phone: input.dominantPhone || ''
            } : undefined;
            const existingInsurance = (input.existingPatientInsurances || []).find({
                "useSavePatientInsurance.useCallback[savePatientInsurance].existingInsurance": (ins)=>String(ins.insuranceProvider.id) === input.insuranceProviderId
            }["useSavePatientInsurance.useCallback[savePatientInsurance].existingInsurance"]);
            const commonPayload = {
                patientId: input.patientId,
                insuranceProviderId: input.insuranceProviderId,
                insuranceCardNumber: input.insuranceCardNumber,
                providingCompanyOrEmployer: input.providingCompanyOrEmployer || null,
                dominantMember,
                validFrom: new Date().toISOString().slice(0, 10),
                validUntil: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()).toISOString().slice(0, 10),
                patientSharePercentage: input.patientSharePercentage ?? null,
                patientShareCoverageId: input.patientShareCoverageId ?? null
            };
            const response = existingInsurance ? await updatePatientInsurance(existingInsurance.id, commonPayload) : await createPatientInsurance(commonPayload);
            return {
                status: response?.status || 'ERROR',
                response,
                fieldErrors: {}
            };
        }
    }["useSavePatientInsurance.useCallback[savePatientInsurance]"], [
        createPatientInsurance,
        updatePatientInsurance
    ]);
    return {
        savePatientInsurance,
        loading: creating || updating
    };
}
_s(useSavePatientInsurance, "40+JcPWw1idEcVuIgn9hfXEBoEo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$patients$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCreatePatientInsurance"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$patients$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUpdatePatientInsurance"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/checkbox.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Checkbox",
    ()=>Checkbox
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$checkbox$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-checkbox/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as CheckIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
'use client';
;
;
;
;
function Checkbox({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$checkbox$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "checkbox",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('peer border-border/70 bg-background dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50', className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$checkbox$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Indicator"], {
            "data-slot": "checkbox-indicator",
            className: "flex items-center justify-center text-current transition-none",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckIcon$3e$__["CheckIcon"], {
                className: "size-3.5"
            }, void 0, false, {
                fileName: "[project]/components/ui/checkbox.tsx",
                lineNumber: 26,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/ui/checkbox.tsx",
            lineNumber: 22,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/checkbox.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
_c = Checkbox;
;
var _c;
__turbopack_context__.k.register(_c, "Checkbox");
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
"[project]/components/ui/command.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Command",
    ()=>Command,
    "CommandDialog",
    ()=>CommandDialog,
    "CommandEmpty",
    ()=>CommandEmpty,
    "CommandGroup",
    ()=>CommandGroup,
    "CommandInput",
    ()=>CommandInput,
    "CommandItem",
    ()=>CommandItem,
    "CommandList",
    ()=>CommandList,
    "CommandSeparator",
    ()=>CommandSeparator,
    "CommandShortcut",
    ()=>CommandShortcut
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/cmdk/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SearchIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as SearchIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dialog.tsx [app-client] (ecmascript)");
'use client';
;
;
;
;
;
function Command({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"], {
        "data-slot": "command",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/command.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, this);
}
_c = Command;
function CommandDialog({ title = 'Command Palette', description = 'Search for a command to run...', children, className, showCloseButton = true, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                className: "sr-only",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/components/ui/command.tsx",
                        lineNumber: 48,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogDescription"], {
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/components/ui/command.tsx",
                        lineNumber: 49,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/command.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('overflow-hidden p-0', className),
                showCloseButton: showCloseButton,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Command, {
                    className: "[&_[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/components/ui/command.tsx",
                    lineNumber: 55,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ui/command.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/command.tsx",
        lineNumber: 46,
        columnNumber: 5
    }, this);
}
_c1 = CommandDialog;
function CommandInput({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "command-input-wrapper",
        className: "flex h-9 items-center gap-2 border-b px-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SearchIcon$3e$__["SearchIcon"], {
                className: "size-4 shrink-0 opacity-50"
            }, void 0, false, {
                fileName: "[project]/components/ui/command.tsx",
                lineNumber: 72,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"].Input, {
                "data-slot": "command-input",
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50', className),
                ...props
            }, void 0, false, {
                fileName: "[project]/components/ui/command.tsx",
                lineNumber: 73,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/command.tsx",
        lineNumber: 68,
        columnNumber: 5
    }, this);
}
_c2 = CommandInput;
function CommandList({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"].List, {
        "data-slot": "command-list",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/command.tsx",
        lineNumber: 90,
        columnNumber: 5
    }, this);
}
_c3 = CommandList;
function CommandEmpty({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"].Empty, {
        "data-slot": "command-empty",
        className: "py-6 text-center text-sm",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/command.tsx",
        lineNumber: 105,
        columnNumber: 5
    }, this);
}
_c4 = CommandEmpty;
function CommandGroup({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"].Group, {
        "data-slot": "command-group",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/command.tsx",
        lineNumber: 118,
        columnNumber: 5
    }, this);
}
_c5 = CommandGroup;
function CommandSeparator({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"].Separator, {
        "data-slot": "command-separator",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('bg-border -mx-1 h-px', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/command.tsx",
        lineNumber: 134,
        columnNumber: 5
    }, this);
}
_c6 = CommandSeparator;
function CommandItem({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"].Item, {
        "data-slot": "command-item",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/command.tsx",
        lineNumber: 147,
        columnNumber: 5
    }, this);
}
_c7 = CommandItem;
function CommandShortcut({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        "data-slot": "command-shortcut",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-muted-foreground ml-auto text-xs tracking-widest', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/command.tsx",
        lineNumber: 163,
        columnNumber: 5
    }, this);
}
_c8 = CommandShortcut;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8;
__turbopack_context__.k.register(_c, "Command");
__turbopack_context__.k.register(_c1, "CommandDialog");
__turbopack_context__.k.register(_c2, "CommandInput");
__turbopack_context__.k.register(_c3, "CommandList");
__turbopack_context__.k.register(_c4, "CommandEmpty");
__turbopack_context__.k.register(_c5, "CommandGroup");
__turbopack_context__.k.register(_c6, "CommandSeparator");
__turbopack_context__.k.register(_c7, "CommandItem");
__turbopack_context__.k.register(_c8, "CommandShortcut");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/patient/add-patient-insurance-modal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AddPatientInsuranceModal",
    ()=>AddPatientInsuranceModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hook-form/dist/index.esm.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$hookform$2f$resolvers$2f$zod$2f$dist$2f$zod$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@hookform/resolvers/zod/dist/zod.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$auth$2d$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hooks/auth-hooks.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$insurances$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/insurances/hooks.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$insurances$2f$coverage$2d$rules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/insurances/coverage-rules.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$patients$2f$use$2d$save$2d$patient$2d$insurance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/patients/use-save-patient-insurance.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/validation-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$patient$2d$display$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/patient-display-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/checkbox.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2d$error$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/field-error.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$form$2d$schemas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/form-schemas.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$debounced$2d$validation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-debounced-validation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/command.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/popover.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsUpDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevrons-up-down.js [app-client] (ecmascript) <export default as ChevronsUpDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-toastify/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
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
;
const DESCRIPTIONS = {
    billing: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            "This saves insurance on the patient's profile, not directly on the visit. After saving, open ",
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "font-medium text-foreground",
                children: "Patient insurances"
            }, void 0, false, {
                fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                lineNumber: 64,
                columnNumber: 12
            }, ("TURBOPACK compile-time value", void 0)),
            " in the billing header and check it to use for billing on this visit."
        ]
    }, void 0, true),
    reception: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: "Saves insurance on the patient profile. You can then select it when creating the visit or enable it later from billing."
    }, void 0, false)
};
function AddPatientInsuranceModal({ open, onOpenChange, patientId, patientDateOfBirth, patientInsurances = [], editingInsurance, onSuccess, context = 'billing', disabled = false }) {
    _s();
    const { insurances: availableInsurances, loading: insurancesLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$insurances$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInsurances"])();
    const { savePatientInsurance, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$patients$2f$use$2d$save$2d$patient$2d$insurance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSavePatientInsurance"])();
    const [step, setStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('select');
    const [popoverOpen, setPopoverOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedInsuranceId, setSelectedInsuranceId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedInsuranceName, setSelectedInsuranceName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const selectableInsurances = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AddPatientInsuranceModal.useMemo[selectableInsurances]": ()=>availableInsurances || []
    }["AddPatientInsuranceModal.useMemo[selectableInsurances]"], [
        availableInsurances
    ]);
    const selectedProvider = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AddPatientInsuranceModal.useMemo[selectedProvider]": ()=>selectableInsurances.find({
                "AddPatientInsuranceModal.useMemo[selectedProvider]": (ins)=>String(ins.id) === selectedInsuranceId
            }["AddPatientInsuranceModal.useMemo[selectedProvider]"])
    }["AddPatientInsuranceModal.useMemo[selectedProvider]"], [
        selectableInsurances,
        selectedInsuranceId
    ]);
    const { rules: selectedProviderRules, loading: rulesLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$insurances$2f$coverage$2d$rules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInsuranceCoverages"])(selectedInsuranceId ? {
        insuranceProviderId: selectedInsuranceId
    } : undefined);
    /** Coverage tiers available for this provider from backend coverage rules / provider entity. */ const coverages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AddPatientInsuranceModal.useMemo[coverages]": ()=>{
            if (selectedProviderRules && selectedProviderRules.length > 0) {
                return selectedProviderRules.filter({
                    "AddPatientInsuranceModal.useMemo[coverages]": (r)=>r.patientSharePercentage != null
                }["AddPatientInsuranceModal.useMemo[coverages]"]);
            }
            return (selectedProvider?.coverages || []).filter({
                "AddPatientInsuranceModal.useMemo[coverages]": (r)=>r.patientSharePercentage != null
            }["AddPatientInsuranceModal.useMemo[coverages]"]);
        }
    }["AddPatientInsuranceModal.useMemo[coverages]"], [
        selectedProviderRules,
        selectedProvider
    ]);
    const getCoverageLabel = (cov)=>{
        if (cov.departmentName) return `${cov.departmentName} (${cov.patientSharePercentage}%)`;
        if (cov.encounterType) {
            const typeName = cov.encounterType.replace(/_/g, ' ').toLowerCase();
            const formatted = typeName.charAt(0).toUpperCase() + typeName.slice(1);
            return `${formatted} (${cov.patientSharePercentage}%)`;
        }
        return `Base / General (${cov.patientSharePercentage}%)`;
    };
    const isAdult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateAge"])(patientDateOfBirth) >= 18;
    const dominantRequired = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDominantMemberRequired"])(patientDateOfBirth, true);
    const { register, handleSubmit, setError, clearErrors, reset: resetFormErrors, control, trigger, setValue, watch, getValues, formState: { errors: formErrors } } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useForm"])({
        resolver: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$hookform$2f$resolvers$2f$zod$2f$dist$2f$zod$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zodResolver"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$form$2d$schemas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPatientInsuranceFormSchema"])({
            dominantRequired
        })),
        // Dominant-member rules are conditional (superRefine), so live validation
        // is debounced rather than re-run on every keystroke.
        mode: 'onSubmit',
        defaultValues: {
            insuranceCardNumber: '',
            providingCompanyOrEmployer: '',
            isSelf: isAdult,
            dominantName: '',
            dominantFirstName: '',
            dominantLastName: '',
            dominantPhone: '',
            patientSharePercentage: ''
        }
    });
    const watchIsSelf = watch('isSelf') ?? isAdult;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$debounced$2d$validation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDebouncedValidation"])({
        control,
        trigger
    });
    const alreadyAddedInsuranceIds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AddPatientInsuranceModal.useMemo[alreadyAddedInsuranceIds]": ()=>new Set(patientInsurances.filter({
                "AddPatientInsuranceModal.useMemo[alreadyAddedInsuranceIds]": (pIns)=>!editingInsurance || String(pIns.id) !== String(editingInsurance.id)
            }["AddPatientInsuranceModal.useMemo[alreadyAddedInsuranceIds]"]).map({
                "AddPatientInsuranceModal.useMemo[alreadyAddedInsuranceIds]": (pIns)=>String(pIns.insuranceProvider.id)
            }["AddPatientInsuranceModal.useMemo[alreadyAddedInsuranceIds]"]))
    }["AddPatientInsuranceModal.useMemo[alreadyAddedInsuranceIds]"], [
        patientInsurances,
        editingInsurance
    ]);
    const resetForm = ()=>{
        setStep('select');
        setSelectedInsuranceId('');
        setSelectedInsuranceName('');
        resetFormErrors();
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AddPatientInsuranceModal.useEffect": ()=>{
            if (!open) {
                resetForm();
                return;
            }
            if (editingInsurance) {
                const provId = String(editingInsurance.insuranceProvider.id);
                setSelectedInsuranceId(provId);
                setSelectedInsuranceName(editingInsurance.insuranceProvider.insuranceName || editingInsurance.insuranceProvider.acronym || 'Insurance');
                setStep('card');
                setValue('insuranceCardNumber', editingInsurance.insuranceCardNumber || '');
                setValue('providingCompanyOrEmployer', editingInsurance.providingCompanyOrEmployer || '');
                setValue('isSelf', editingInsurance.principalMember ?? isAdult);
                setValue('dominantName', editingInsurance.principalMemberName || '');
                setValue('dominantPhone', editingInsurance.principalMemberPhoneNumber || '');
                setValue('patientSharePercentage', editingInsurance.patientSharePercentage != null ? String(editingInsurance.patientSharePercentage) : '');
            }
        }
    }["AddPatientInsuranceModal.useEffect"], [
        open,
        editingInsurance,
        isAdult,
        setValue
    ]);
    const handleProviderSelect = (id, name)=>{
        setSelectedInsuranceId(id);
        setSelectedInsuranceName(name);
        const prov = selectableInsurances.find((ins)=>String(ins.id) === id);
        const covs = (prov?.coverages || []).filter((r)=>r.patientSharePercentage != null);
        if (covs.length === 1 && covs[0]) {
            setValue('patientShareCoverageId', covs[0].id, {
                shouldValidate: true
            });
            setValue('patientSharePercentage', String(covs[0].patientSharePercentage), {
                shouldValidate: true
            });
        } else if (covs.length > 1) {
            const base = covs.find((c)=>!c.departmentId && !c.encounterType) || covs[0];
            if (base) {
                setValue('patientShareCoverageId', base.id, {
                    shouldValidate: true
                });
                setValue('patientSharePercentage', String(base.patientSharePercentage), {
                    shouldValidate: true
                });
            }
        } else {
            setValue('patientShareCoverageId', null);
            setValue('patientSharePercentage', '');
        }
        setPopoverOpen(false);
        setStep('card');
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AddPatientInsuranceModal.useEffect": ()=>{
            if (!selectedInsuranceId || getValues('patientShareCoverageId')) return;
            if (coverages.length === 1 && coverages[0]) {
                setValue('patientShareCoverageId', coverages[0].id, {
                    shouldValidate: true
                });
                setValue('patientSharePercentage', String(coverages[0].patientSharePercentage), {
                    shouldValidate: true
                });
            } else if (coverages.length > 1) {
                const base = coverages.find({
                    "AddPatientInsuranceModal.useEffect": (c)=>!c.departmentId && !c.encounterType
                }["AddPatientInsuranceModal.useEffect"]) || coverages[0];
                if (base) {
                    setValue('patientShareCoverageId', base.id, {
                        shouldValidate: true
                    });
                    setValue('patientSharePercentage', String(base.patientSharePercentage), {
                        shouldValidate: true
                    });
                }
            }
        }
    }["AddPatientInsuranceModal.useEffect"], [
        coverages,
        selectedInsuranceId,
        getValues,
        setValue
    ]);
    const handleProceedToDetails = ()=>{
        setStep('details');
    };
    const handleSave = async (values)=>{
        const rawDominantName = values.dominantName || [
            values.dominantFirstName,
            values.dominantLastName
        ].filter(Boolean).join(' ');
        const resolvedDominant = rawDominantName ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$patient$2d$display$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["splitWorkerName"])(rawDominantName) : {
            firstName: '',
            lastName: ''
        };
        const result = await savePatientInsurance({
            patientId,
            patientDateOfBirth,
            insuranceProviderId: selectedInsuranceId,
            insuranceCardNumber: values.insuranceCardNumber,
            providingCompanyOrEmployer: values.providingCompanyOrEmployer,
            isSelf: isAdult ? Boolean(values.isSelf) : false,
            dominantName: rawDominantName || undefined,
            dominantFirstName: resolvedDominant.firstName,
            dominantLastName: resolvedDominant.lastName,
            dominantPhone: values.dominantPhone,
            existingPatientInsurances: patientInsurances,
            patientSharePercentage: values.patientSharePercentage ? Number(values.patientSharePercentage) : null,
            patientShareCoverageId: values.patientShareCoverageId || null
        });
        if (result.status === 'VALIDATION_ERROR') {
            const fe = result.fieldErrors;
            if (fe.card) setError('insuranceCardNumber', {
                type: 'server',
                message: fe.card
            });
            if (fe.employer) setError('providingCompanyOrEmployer', {
                type: 'server',
                message: fe.employer
            });
            if (fe.dominant) {
                setError('dominantName', {
                    type: 'server',
                    message: fe.dominant
                });
                setError('dominantPhone', {
                    type: 'server',
                    message: fe.dominant
                });
            }
            return;
        }
        if (result.status === 'SUCCESS') {
            await onSuccess?.();
            onOpenChange(false);
            resetForm();
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(context === 'billing' ? 'Insurance saved on patient record. Check it under Patient insurances to use on this visit.' : 'Insurance saved on patient record.');
            return;
        }
        const errorMsg = result.response?.messages?.[0]?.text || 'Failed to add insurance';
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(errorMsg);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
        open: open,
        onOpenChange: (nextOpen)=>{
            onOpenChange(nextOpen);
            if (!nextOpen) resetForm();
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
            className: "sm:max-w-md",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2",
                            children: [
                                (step === 'card' || step === 'details') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>setStep(step === 'details' ? 'card' : 'select'),
                                    className: "text-muted-foreground hover:text-foreground transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                        lineNumber: 314,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                    lineNumber: 309,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                    className: "text-base",
                                    children: editingInsurance ? 'Update patient insurance' : step === 'select' ? 'Select insurance provider' : step === 'card' ? 'Enter card number' : 'Insurance details'
                                }, void 0, false, {
                                    fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                    lineNumber: 317,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                            lineNumber: 307,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2 mt-2",
                            children: [
                                'Provider',
                                'Card #',
                                'Details'
                            ].map((label, idx)=>{
                                const stepKey = [
                                    'select',
                                    'card',
                                    'details'
                                ][idx];
                                const isActive = step === stepKey;
                                const isDone = step === 'card' && idx === 0 || step === 'details' && idx <= 1;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-semibold ${isActive ? 'bg-primary text-primary-foreground' : isDone ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`,
                                            children: isDone && !isActive ? '✓' : idx + 1
                                        }, void 0, false, {
                                            fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                            lineNumber: 335,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `text-[11px] ${isActive ? 'text-foreground font-medium' : 'text-muted-foreground'}`,
                                            children: label
                                        }, void 0, false, {
                                            fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                            lineNumber: 341,
                                            columnNumber: 19
                                        }, this),
                                        idx < 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-4 h-px bg-border/60 mx-0.5"
                                        }, void 0, false, {
                                            fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                            lineNumber: 344,
                                            columnNumber: 31
                                        }, this)
                                    ]
                                }, label, true, {
                                    fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                    lineNumber: 334,
                                    columnNumber: 17
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                            lineNumber: 328,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogDescription"], {
                            className: "text-sm text-muted-foreground",
                            children: DESCRIPTIONS[context]
                        }, void 0, false, {
                            fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                            lineNumber: 349,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                    lineNumber: 306,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-3",
                    children: [
                        step === 'select' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[12px] text-muted-foreground",
                                    children: "Insurance Provider"
                                }, void 0, false, {
                                    fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                    lineNumber: 358,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Popover"], {
                                    open: popoverOpen,
                                    onOpenChange: setPopoverOpen,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PopoverTrigger"], {
                                            asChild: true,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: "outline",
                                                role: "combobox",
                                                "aria-expanded": popoverOpen,
                                                className: "w-full justify-between h-10 text-sm font-normal",
                                                disabled: insurancesLoading,
                                                children: [
                                                    selectedInsuranceName ? selectedInsuranceName : insurancesLoading ? 'Loading insurances...' : 'Search insurance...',
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsUpDown$3e$__["ChevronsUpDown"], {
                                                        className: "ml-2 h-4 w-4 shrink-0 opacity-50"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                                        lineNumber: 373,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                                lineNumber: 361,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                            lineNumber: 360,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PopoverContent"], {
                                            className: "w-[var(--radix-popover-trigger-width)] p-0",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandInput"], {
                                                        placeholder: "Search insurance..."
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                                        lineNumber: 378,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandList"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandEmpty"], {
                                                                children: "No insurance found."
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                                                lineNumber: 380,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandGroup"], {
                                                                children: selectableInsurances.map((insurance)=>{
                                                                    const isAlreadyAdded = alreadyAddedInsuranceIds.has(String(insurance.id));
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandItem"], {
                                                                        value: `${insurance.insuranceName} ${insurance.acronym || ''}`,
                                                                        disabled: isAlreadyAdded,
                                                                        onSelect: ()=>{
                                                                            if (!isAlreadyAdded) {
                                                                                handleProviderSelect(String(insurance.id), `${insurance.insuranceName} (${insurance.acronym || ''})`);
                                                                            }
                                                                        },
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('mr-2 h-4 w-4', selectedInsuranceId === String(insurance.id) ? 'opacity-100' : 'opacity-0')
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                                                                lineNumber: 398,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: isAlreadyAdded ? 'opacity-50' : '',
                                                                                children: [
                                                                                    insurance.insuranceName,
                                                                                    insurance.acronym && ` (${insurance.acronym})`,
                                                                                    ' — ',
                                                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getBasePatientSharePercentage"])(insurance),
                                                                                    "%",
                                                                                    isAlreadyAdded && ' (Already Added)'
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                                                                lineNumber: 406,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, insurance.id, true, {
                                                                        fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                                                        lineNumber: 385,
                                                                        columnNumber: 29
                                                                    }, this);
                                                                })
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                                                lineNumber: 381,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                                        lineNumber: 379,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                                lineNumber: 377,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                            lineNumber: 376,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                    lineNumber: 359,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                            lineNumber: 357,
                            columnNumber: 13
                        }, this),
                        step === 'card' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-lg border bg-muted/30 px-3 py-2 text-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-muted-foreground text-xs",
                                            children: "Provider"
                                        }, void 0, false, {
                                            fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                            lineNumber: 427,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-medium",
                                            children: selectedInsuranceName
                                        }, void 0, false, {
                                            fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                            lineNumber: 428,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                    lineNumber: 426,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[12px] text-muted-foreground",
                                            children: "Insurance Card Number"
                                        }, void 0, false, {
                                            fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                            lineNumber: 432,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                            ...register('insuranceCardNumber'),
                                            placeholder: "Card number",
                                            autoFocus: true,
                                            className: formErrors.insuranceCardNumber ? 'border-red-500 focus-visible:ring-red-300' : ''
                                        }, void 0, false, {
                                            fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                            lineNumber: 433,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2d$error$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FieldError"], {
                                            message: formErrors.insuranceCardNumber?.message
                                        }, void 0, false, {
                                            fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                            lineNumber: 439,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                    lineNumber: 431,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true),
                        step === 'details' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-lg border bg-muted/30 px-3 py-2 text-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-muted-foreground text-xs",
                                            children: "Provider"
                                        }, void 0, false, {
                                            fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                            lineNumber: 448,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-medium",
                                            children: selectedInsuranceName
                                        }, void 0, false, {
                                            fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                            lineNumber: 449,
                                            columnNumber: 17
                                        }, this),
                                        selectedProvider && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-muted-foreground",
                                            children: [
                                                "Default patient share: ",
                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getBasePatientSharePercentage"])(selectedProvider),
                                                "%"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                            lineNumber: 451,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                    lineNumber: 447,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[12px] text-muted-foreground",
                                            children: "Insurance Card Number"
                                        }, void 0, false, {
                                            fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                            lineNumber: 458,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "rounded-lg border bg-muted/20 px-3 py-2 text-sm font-mono",
                                            children: getValues('insuranceCardNumber') || ''
                                        }, void 0, false, {
                                            fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                            lineNumber: 459,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                    lineNumber: 457,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[12px] text-muted-foreground",
                                            children: "Providing Company / Employer (required)"
                                        }, void 0, false, {
                                            fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                            lineNumber: 465,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                            ...register('providingCompanyOrEmployer'),
                                            placeholder: "Employer or company name",
                                            className: formErrors.providingCompanyOrEmployer ? 'border-red-500 focus-visible:ring-red-300' : ''
                                        }, void 0, false, {
                                            fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                            lineNumber: 466,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2d$error$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FieldError"], {
                                            message: formErrors.providingCompanyOrEmployer?.message
                                        }, void 0, false, {
                                            fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                            lineNumber: 471,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                    lineNumber: 464,
                                    columnNumber: 15
                                }, this),
                                coverages.length > 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-1.5 p-3 rounded-xl border border-border/60 bg-muted/20",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs font-medium text-foreground",
                                                    children: "Default Patient Share / Coverage Tier"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                                    lineNumber: 477,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border/60",
                                                    children: [
                                                        coverages.length,
                                                        " tiers available"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                                    lineNumber: 480,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                            lineNumber: 476,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[12px] text-muted-foreground",
                                            children: "This insurance has multiple coverage conditions. Select the default tier for this patient:"
                                        }, void 0, false, {
                                            fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                            lineNumber: 484,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap gap-2 pt-1",
                                            children: coverages.map((cov)=>{
                                                const currentCoverageId = watch('patientShareCoverageId');
                                                const isSelected = currentCoverageId === cov.id;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>{
                                                        if (isSelected) {
                                                            setValue('patientShareCoverageId', null, {
                                                                shouldValidate: true
                                                            });
                                                            setValue('patientSharePercentage', '', {
                                                                shouldValidate: true
                                                            });
                                                        } else {
                                                            setValue('patientShareCoverageId', cov.id, {
                                                                shouldValidate: true
                                                            });
                                                            setValue('patientSharePercentage', String(cov.patientSharePercentage), {
                                                                shouldValidate: true
                                                            });
                                                        }
                                                    },
                                                    className: `px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${isSelected ? 'bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] text-white border-transparent shadow-sm' : 'bg-white dark:bg-slate-900 border-border/60 hover:border-primary/50 text-foreground'}`,
                                                    children: getCoverageLabel(cov)
                                                }, cov.id, false, {
                                                    fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                                    lineNumber: 492,
                                                    columnNumber: 25
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                            lineNumber: 487,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "hidden",
                                            ...register('patientShareCoverageId')
                                        }, void 0, false, {
                                            fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                            lineNumber: 515,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "hidden",
                                            ...register('patientSharePercentage')
                                        }, void 0, false, {
                                            fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                            lineNumber: 516,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                    lineNumber: 475,
                                    columnNumber: 17
                                }, this) : coverages.length === 1 && coverages[0] ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-2.5 rounded-xl border border-border/40 bg-muted/20 flex items-center justify-between text-xs",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-medium text-foreground",
                                                    children: "Default Coverage: "
                                                }, void 0, false, {
                                                    fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                                    lineNumber: 521,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-muted-foreground",
                                                    children: getCoverageLabel(coverages[0])
                                                }, void 0, false, {
                                                    fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                                    lineNumber: 522,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                            lineNumber: 520,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold text-[12px]",
                                            children: [
                                                coverages[0].patientSharePercentage,
                                                "% Patient Share"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                            lineNumber: 524,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "hidden",
                                            ...register('patientShareCoverageId')
                                        }, void 0, false, {
                                            fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                            lineNumber: 527,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "hidden",
                                            ...register('patientSharePercentage')
                                        }, void 0, false, {
                                            fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                            lineNumber: 528,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                    lineNumber: 519,
                                    columnNumber: 17
                                }, this) : null,
                                isAdult ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-3 rounded-xl border border-border/60 bg-muted/20 p-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center space-x-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                                                    id: "isSelf",
                                                    checked: Boolean(watchIsSelf),
                                                    onCheckedChange: (checked)=>{
                                                        setValue('isSelf', Boolean(checked), {
                                                            shouldValidate: true
                                                        });
                                                        if (checked) {
                                                            setValue('dominantName', '');
                                                            setValue('dominantFirstName', '');
                                                            setValue('dominantLastName', '');
                                                            setValue('dominantPhone', '');
                                                            clearErrors([
                                                                'dominantName',
                                                                'dominantFirstName',
                                                                'dominantLastName',
                                                                'dominantPhone'
                                                            ]);
                                                        }
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                                    lineNumber: 535,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "isSelf",
                                                    className: "text-xs font-medium text-foreground cursor-pointer select-none",
                                                    children: "Self (Patient is the principal policyholder)"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                                    lineNumber: 549,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                            lineNumber: 534,
                                            columnNumber: 19
                                        }, this),
                                        !watchIsSelf && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2 pt-2 border-t border-border/40",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[12px] font-medium text-foreground",
                                                    children: [
                                                        "Principal Member Information ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-red-500",
                                                            children: "*"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                                            lineNumber: 560,
                                                            columnNumber: 54
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                                    lineNumber: 559,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                            ...register('dominantName', {
                                                                onChange: (e)=>{
                                                                    const split = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$patient$2d$display$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["splitWorkerName"])(e.target.value);
                                                                    setValue('dominantFirstName', split.firstName);
                                                                    setValue('dominantLastName', split.lastName || '');
                                                                }
                                                            }),
                                                            placeholder: "Principal member full name (e.g. John Doe)",
                                                            className: formErrors.dominantName || formErrors.dominantFirstName || formErrors.dominantLastName ? 'border-red-500 focus-visible:ring-red-300' : ''
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                                            lineNumber: 563,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2d$error$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FieldError"], {
                                                            message: formErrors.dominantName?.message || formErrors.dominantFirstName?.message || formErrors.dominantLastName?.message
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                                            lineNumber: 574,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                                    lineNumber: 562,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                            ...register('dominantPhone', {
                                                                onChange: (e)=>{
                                                                    setValue('dominantPhone', (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sanitizePhoneInput"])(e.target.value), {
                                                                        shouldValidate: true
                                                                    });
                                                                }
                                                            }),
                                                            placeholder: "Phone (e.g. 0788 123 456 or +250 788 123 456)",
                                                            className: formErrors.dominantPhone ? 'border-red-500 focus-visible:ring-red-300' : ''
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                                            lineNumber: 577,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2d$error$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FieldError"], {
                                                            message: formErrors.dominantPhone?.message
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                                            lineNumber: 586,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                                    lineNumber: 576,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                            lineNumber: 558,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                    lineNumber: 533,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2 rounded-xl border border-border/60 bg-muted/20 p-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[12px] font-medium text-foreground",
                                                    children: [
                                                        "Principal Member Information ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-red-500",
                                                            children: "*"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                                            lineNumber: 595,
                                                            columnNumber: 52
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                                    lineNumber: 594,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border/60",
                                                    children: "Required for patients ≤18 years"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                                    lineNumber: 597,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                            lineNumber: 593,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                    ...register('dominantName', {
                                                        onChange: (e)=>{
                                                            const split = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$patient$2d$display$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["splitWorkerName"])(e.target.value);
                                                            setValue('dominantFirstName', split.firstName);
                                                            setValue('dominantLastName', split.lastName || '');
                                                        }
                                                    }),
                                                    placeholder: "Principal member full name (e.g. John Doe)",
                                                    className: formErrors.dominantName || formErrors.dominantFirstName || formErrors.dominantLastName ? 'border-red-500 focus-visible:ring-red-300' : ''
                                                }, void 0, false, {
                                                    fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                                    lineNumber: 602,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2d$error$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FieldError"], {
                                                    message: formErrors.dominantName?.message || formErrors.dominantFirstName?.message || formErrors.dominantLastName?.message
                                                }, void 0, false, {
                                                    fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                                    lineNumber: 613,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                            lineNumber: 601,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                    ...register('dominantPhone', {
                                                        onChange: (e)=>{
                                                            setValue('dominantPhone', (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sanitizePhoneInput"])(e.target.value), {
                                                                shouldValidate: true
                                                            });
                                                        }
                                                    }),
                                                    placeholder: "Phone (e.g. 0788 123 456 or +250 788 123 456)",
                                                    className: formErrors.dominantPhone ? 'border-red-500 focus-visible:ring-red-300' : ''
                                                }, void 0, false, {
                                                    fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                                    lineNumber: 616,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2d$error$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FieldError"], {
                                                    message: formErrors.dominantPhone?.message
                                                }, void 0, false, {
                                                    fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                                    lineNumber: 625,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                            lineNumber: 615,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                    lineNumber: 592,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                    lineNumber: 354,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogFooter"], {
                    className: "gap-2",
                    children: [
                        step === 'select' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            onClick: ()=>onOpenChange(false),
                            children: "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                            lineNumber: 635,
                            columnNumber: 13
                        }, this),
                        step === 'card' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outline",
                                    onClick: ()=>onOpenChange(false),
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                    lineNumber: 641,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    onClick: handleProceedToDetails,
                                    children: "Next"
                                }, void 0, false, {
                                    fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                    lineNumber: 644,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true),
                        step === 'details' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outline",
                                    onClick: ()=>onOpenChange(false),
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                    lineNumber: 651,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    onClick: ()=>{
                                        if (!selectedInsuranceId) {
                                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Please select an insurance provider");
                                            return;
                                        }
                                        void handleSubmit(handleSave)();
                                    },
                                    disabled: !selectedInsuranceId || loading || disabled,
                                    children: editingInsurance ? 'Update insurance' : 'Save to patient record'
                                }, void 0, false, {
                                    fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                                    lineNumber: 654,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
                    lineNumber: 633,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
            lineNumber: 305,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/patient/add-patient-insurance-modal.tsx",
        lineNumber: 298,
        columnNumber: 5
    }, this);
}
_s(AddPatientInsuranceModal, "3VOWBu1FAtL8cydPDrXT4+ks5Z8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$insurances$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInsurances"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$patients$2f$use$2d$save$2d$patient$2d$insurance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSavePatientInsurance"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$insurances$2f$coverage$2d$rules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInsuranceCoverages"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useForm"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$debounced$2d$validation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDebouncedValidation"]
    ];
});
_c = AddPatientInsuranceModal;
var _c;
__turbopack_context__.k.register(_c, "AddPatientInsuranceModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/patient/add-patient-insurance-modal.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/components/patient/add-patient-insurance-modal.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=_fdbe1ed8._.js.map