(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
"[project]/components/ui/badge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge,
    "badgeVariants",
    ()=>badgeVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
const badgeVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])('inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden', {
    variants: {
        variant: {
            default: 'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
            secondary: 'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
            destructive: 'border-transparent bg-destructive text-destructive-foreground [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
            outline: 'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground'
        }
    },
    defaultVariants: {
        variant: 'default'
    }
});
function Badge({ className, variant, asChild = false, ...props }) {
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : 'span';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "badge",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(badgeVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/badge.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
_c = Badge;
;
var _c;
__turbopack_context__.k.register(_c, "Badge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/insurance-utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Shared utilities for insurance status checks across billing, visit creation,
 * and patient registration UIs.
 */ __turbopack_context__.s([
    "getInsuranceAwarePricing",
    ()=>getInsuranceAwarePricing,
    "getInsuranceDisplayName",
    ()=>getInsuranceDisplayName,
    "insuranceStatusLabel",
    ()=>insuranceStatusLabel,
    "isInsuranceActive",
    ()=>isInsuranceActive
]);
function isInsuranceActive(ins) {
    if (ins.deactivated) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (ins.validFrom) {
        const from = new Date(ins.validFrom);
        from.setHours(0, 0, 0, 0);
        if (from > today) return false;
    }
    if (ins.validUntil) {
        const until = new Date(ins.validUntil);
        until.setHours(0, 0, 0, 0);
        if (until < today) return false;
    }
    return true;
}
function insuranceStatusLabel(ins) {
    if (ins.deactivated) return "Insurance is deactivated";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (ins.validFrom) {
        const from = new Date(ins.validFrom);
        from.setHours(0, 0, 0, 0);
        if (from > today) {
            return `Insurance starts on ${formatDate(ins.validFrom)}`;
        }
    }
    if (ins.validUntil) {
        const until = new Date(ins.validUntil);
        until.setHours(0, 0, 0, 0);
        if (until < today) {
            return `Insurance expired on ${formatDate(ins.validUntil)}`;
        }
    }
    return "Insurance is active";
}
function formatDate(dateStr) {
    try {
        return new Date(dateStr).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    } catch  {
        return dateStr;
    }
}
function getInsuranceDisplayName(provider) {
    if (!provider) return "Insurance";
    if (provider.acronym && provider.acronym.trim()) return provider.acronym.trim();
    if (provider.insuranceName && provider.insuranceName.trim()) return provider.insuranceName.trim();
    if (provider.name && provider.name.trim()) return provider.name.trim();
    return "Insurance";
}
function getInsuranceAwarePricing(item, linkedInsurances) {
    const privatePrice = Number(item?.clinicPrice ?? item?.privateRhicPrice ?? 0);
    if (!linkedInsurances || linkedInsurances.length === 0) {
        return {
            price: privatePrice,
            coverage: null,
            isCovered: false,
            coverageDetails: [],
            hasZeroPayingCoverages: false,
            allCoveragesZeroOrNotCovered: false
        };
    }
    const insuranceProviderIds = new Set(linkedInsurances.map((ins)=>ins?.insuranceProvider?.id || ins?.insuranceProviderId).filter(Boolean));
    const matchingCoverages = (item?.insuranceCoverages || []).filter((cov)=>{
        const providerId = cov?.insuranceProvider?.id || cov?.insuranceProviderId;
        return providerId && insuranceProviderIds.has(providerId);
    });
    const validCoverages = matchingCoverages.filter((c)=>c.covered !== false && !Boolean(c.notPaid) && Number(c.cost) > 0);
    const firstCovered = validCoverages[0];
    if (matchingCoverages.length === 0) {
        return {
            price: privatePrice,
            coverage: null,
            isCovered: false,
            coverageDetails: [],
            hasZeroPayingCoverages: false,
            allCoveragesZeroOrNotCovered: false
        };
    }
    return {
        price: firstCovered ? Number(firstCovered.cost) : privatePrice,
        coverage: firstCovered || null,
        isCovered: Boolean(firstCovered),
        coverageDetails: matchingCoverages,
        hasZeroPayingCoverages: matchingCoverages.some((c)=>Number(c.cost) <= 0 || c.covered === false || Boolean(c.notPaid)),
        allCoveragesZeroOrNotCovered: validCoverages.length === 0
    };
}
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
"[project]/components/ui/department-autocomplete.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DepartmentAutocomplete",
    ()=>DepartmentAutocomplete
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/command.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/popover.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
function DepartmentAutocomplete({ departments, selectedDepartmentId, onDepartmentSelect, placeholder = 'Search departments...', disabled = false, className }) {
    _s();
    const [open, setOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const [inputValue, setInputValue] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]('');
    const displayDepartments = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "DepartmentAutocomplete.useMemo[displayDepartments]": ()=>{
            if (!inputValue.trim()) return departments;
            const query = inputValue.trim().toLowerCase();
            return departments.filter({
                "DepartmentAutocomplete.useMemo[displayDepartments]": (dept)=>dept.name.toLowerCase().includes(query)
            }["DepartmentAutocomplete.useMemo[displayDepartments]"]);
        }
    }["DepartmentAutocomplete.useMemo[displayDepartments]"], [
        departments,
        inputValue
    ]);
    const selectedDepartment = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "DepartmentAutocomplete.useMemo[selectedDepartment]": ()=>{
            return departments.find({
                "DepartmentAutocomplete.useMemo[selectedDepartment]": (dept)=>String(dept.id) === selectedDepartmentId
            }["DepartmentAutocomplete.useMemo[selectedDepartment]"]);
        }
    }["DepartmentAutocomplete.useMemo[selectedDepartment]"], [
        departments,
        selectedDepartmentId
    ]);
    const handleSelect = (departmentId)=>{
        onDepartmentSelect(departmentId);
        setOpen(false);
        setInputValue('');
    };
    const handleClearSelection = ()=>{
        onDepartmentSelect('');
        setInputValue('');
    };
    if (selectedDepartment) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex items-center gap-2 w-full', className),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg border",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-sm font-medium",
                        children: selectedDepartment.name
                    }, void 0, false, {
                        fileName: "[project]/components/ui/department-autocomplete.tsx",
                        lineNumber: 61,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "ghost",
                        size: "sm",
                        type: "button",
                        onClick: handleClearSelection,
                        className: "h-6 w-6 p-0 rounded-full hover:bg-muted-foreground/20",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                            className: "h-3 w-3"
                        }, void 0, false, {
                            fileName: "[project]/components/ui/department-autocomplete.tsx",
                            lineNumber: 69,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ui/department-autocomplete.tsx",
                        lineNumber: 62,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/department-autocomplete.tsx",
                lineNumber: 60,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/ui/department-autocomplete.tsx",
            lineNumber: 59,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Popover"], {
        open: open,
        onOpenChange: setOpen,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PopoverTrigger"], {
                asChild: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    variant: "outline",
                    role: "combobox",
                    "aria-expanded": open,
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('w-full justify-between rounded-lg', className),
                    disabled: disabled,
                    type: "button",
                    children: [
                        placeholder,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                            className: "ml-2 h-4 w-4 shrink-0 opacity-50"
                        }, void 0, false, {
                            fileName: "[project]/components/ui/department-autocomplete.tsx",
                            lineNumber: 88,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ui/department-autocomplete.tsx",
                    lineNumber: 79,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ui/department-autocomplete.tsx",
                lineNumber: 78,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PopoverContent"], {
                className: "w-full p-0 rounded-lg",
                align: "start",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandInput"], {
                            placeholder: placeholder,
                            value: inputValue,
                            onValueChange: (value)=>{
                                setInputValue(value);
                                if (!open && value.length > 0) {
                                    setOpen(true);
                                }
                            }
                        }, void 0, false, {
                            fileName: "[project]/components/ui/department-autocomplete.tsx",
                            lineNumber: 93,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandList"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandEmpty"], {
                                    children: "No departments found."
                                }, void 0, false, {
                                    fileName: "[project]/components/ui/department-autocomplete.tsx",
                                    lineNumber: 104,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandGroup"], {
                                    children: displayDepartments.map((department)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandItem"], {
                                            value: department.name,
                                            onSelect: ()=>handleSelect(String(department.id)),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('mr-2 h-4 w-4', String(department.id) === selectedDepartmentId ? 'opacity-100' : 'opacity-0')
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ui/department-autocomplete.tsx",
                                                    lineNumber: 112,
                                                    columnNumber: 19
                                                }, this),
                                                department.name
                                            ]
                                        }, department.id, true, {
                                            fileName: "[project]/components/ui/department-autocomplete.tsx",
                                            lineNumber: 107,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/components/ui/department-autocomplete.tsx",
                                    lineNumber: 105,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ui/department-autocomplete.tsx",
                            lineNumber: 103,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ui/department-autocomplete.tsx",
                    lineNumber: 92,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ui/department-autocomplete.tsx",
                lineNumber: 91,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/department-autocomplete.tsx",
        lineNumber: 77,
        columnNumber: 5
    }, this);
}
_s(DepartmentAutocomplete, "vH5gmXNUJP07odKubOQFX8IB0S8=");
_c = DepartmentAutocomplete;
var _c;
__turbopack_context__.k.register(_c, "DepartmentAutocomplete");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/patient-search-utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "resolvePatientSearchFilter",
    ()=>resolvePatientSearchFilter
]);
function resolvePatientSearchFilter(query, searchFilterType = "name") {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
        return {};
    }
    if (searchFilterType === "insuranceCardNumber") {
        return {
            insuranceCardNumber: trimmedQuery
        };
    }
    const digitsOnly = trimmedQuery.replace(/\D/g, "");
    const hasLetters = /[a-zA-Z]/.test(trimmedQuery);
    if (hasLetters) {
        return {
            name: trimmedQuery
        };
    }
    if (digitsOnly.length > 12) {
        // Digits exceed 12 -> silently and automatically switch to ID search
        return {
            name: trimmedQuery
        };
    }
    if (digitsOnly.length > 0) {
        // Digits <= 12 -> phone number search
        return {
            phoneNumber: trimmedQuery
        };
    }
    return {
        name: trimmedQuery
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/visit-creation-modal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>VisitCreationModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$auth$2d$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hooks/auth-hooks.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$patients$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/patients/hooks.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$departments$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/departments/hooks.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$visit$2d$mutations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/visits/visit-mutations.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$insurances$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/insurances/hooks.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/skeleton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/popover.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square-pen.js [app-client] (ecmascript) <export default as Edit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldPlus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-plus.js [app-client] (ecmascript) <export default as ShieldPlus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldAlert$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-alert.js [app-client] (ecmascript) <export default as ShieldAlert>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/credit-card.js [app-client] (ecmascript) <export default as CreditCard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sliders-horizontal.js [app-client] (ecmascript) <export default as SlidersHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rotate-ccw.js [app-client] (ecmascript) <export default as RotateCcw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$media$2d$url$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/media-url.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$insurance$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/insurance-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/validation-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-toastify/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$department$2d$autocomplete$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/department-autocomplete.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$patient$2d$search$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/patient-search-utils.ts [app-client] (ecmascript)");
;
;
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
const PatientEditModal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/components/patient-edit-modal.tsx [app-client] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/components/patient-edit-modal.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
_c = PatientEditModal;
const AddPatientInsuranceModal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/components/patient/add-patient-insurance-modal.tsx [app-client] (ecmascript, next/dynamic entry, async loader)").then((m)=>m.AddPatientInsuranceModal), {
    loadableGenerated: {
        modules: [
            "[project]/components/patient/add-patient-insurance-modal.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
_c1 = AddPatientInsuranceModal;
;
;
const TRIAGE_SERVICE_ID = "__TRIAGE__";
function PatientCardSkeleton() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-3.5 rounded-2xl border border-border/50 bg-white/60 dark:bg-slate-950/60 shadow-sm flex flex-col justify-between animate-pulse min-h-[160px]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start justify-between gap-2.5 mb-2.5",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2.5 w-full",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                            className: "w-10 h-10 rounded-xl shrink-0"
                        }, void 0, false, {
                            fileName: "[project]/components/visit-creation-modal.tsx",
                            lineNumber: 80,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-1.5 flex-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                    className: "h-4 w-3/4 rounded-md"
                                }, void 0, false, {
                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                    lineNumber: 82,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                    className: "h-3 w-1/2 rounded-md"
                                }, void 0, false, {
                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                    lineNumber: 83,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/visit-creation-modal.tsx",
                            lineNumber: 81,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/visit-creation-modal.tsx",
                    lineNumber: 79,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/visit-creation-modal.tsx",
                lineNumber: 78,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2 my-2 bg-muted/20 p-2 rounded-xl border border-border/40",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                        className: "h-3 w-full rounded-md"
                    }, void 0, false, {
                        fileName: "[project]/components/visit-creation-modal.tsx",
                        lineNumber: 88,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                        className: "h-3 w-4/5 rounded-md"
                    }, void 0, false, {
                        fileName: "[project]/components/visit-creation-modal.tsx",
                        lineNumber: 89,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/visit-creation-modal.tsx",
                lineNumber: 87,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pt-2 border-t border-border/40 flex items-center justify-between gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                        className: "h-4 w-1/3 rounded-md"
                    }, void 0, false, {
                        fileName: "[project]/components/visit-creation-modal.tsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                        className: "h-4 w-12 rounded-md"
                    }, void 0, false, {
                        fileName: "[project]/components/visit-creation-modal.tsx",
                        lineNumber: 93,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/visit-creation-modal.tsx",
                lineNumber: 91,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/visit-creation-modal.tsx",
        lineNumber: 77,
        columnNumber: 5
    }, this);
}
_c2 = PatientCardSkeleton;
function VisitCreationModal({ isOpen, onClose, onVisitCreated, preSelectedPatientId }) {
    _s();
    const [currentStep, setCurrentStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("patient-selection");
    const [selectedPatientId, setSelectedPatientId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(preSelectedPatientId || null);
    const [selectedPatient, setSelectedPatient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const { patient: preSelectedPatientData, loading: _patientLoading, refetch: refetchPreSelectedPatient } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$patients$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePatient"])(preSelectedPatientId || null);
    const { patient: selectedPatientDetails, refetch: refetchSelectedPatientDetails } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$patients$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePatient"])(selectedPatientId && !preSelectedPatientId ? selectedPatientId : null);
    const { departments, loading: departmentsLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$departments$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDepartments"])();
    const { insurances: availableInsurances, loading: insurancesLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$insurances$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInsurances"])();
    const { createVisit, loading: visitLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$visit$2d$mutations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCreateVisit"])();
    // Search and filter states
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [searchFilterType, setSearchFilterType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("name");
    const [selectedInsuranceProviderId, setSelectedInsuranceProviderId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [genderFilter, setGenderFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [ageRange, setAgeRange] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [customAgeMin, setCustomAgeMin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [customAgeMax, setCustomAgeMax] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [exactAge, setExactAge] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isFilterOpen, setIsFilterOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [patientFilter, setPatientFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [shouldSearch, setShouldSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const activeFilterCount = [
        Boolean(selectedInsuranceProviderId),
        Boolean(genderFilter && genderFilter !== "all"),
        Boolean(ageRange !== "all" && (ageRange !== "custom" || customAgeMin || customAgeMax) && (ageRange !== "exact" || exactAge))
    ].filter(Boolean).length;
    const handleResetFilters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "VisitCreationModal.useCallback[handleResetFilters]": ()=>{
            setSelectedInsuranceProviderId("");
            setGenderFilter("all");
            setAgeRange("all");
            setCustomAgeMin("");
            setCustomAgeMax("");
            setExactAge("");
        }
    }["VisitCreationModal.useCallback[handleResetFilters]"], []);
    const [selectedServiceId, setSelectedServiceId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(TRIAGE_SERVICE_ID);
    const [selectedInsuranceIds, setSelectedInsuranceIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [editPatientModal, setEditPatientModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedPatientForEdit, setSelectedPatientForEdit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showAddInsuranceModal, setShowAddInsuranceModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [addInsurancePatientId, setAddInsurancePatientId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editingInsurance, setEditingInsurance] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [insuranceToDelete, setInsuranceToDelete] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isDeletingInsurance, setIsDeletingInsurance] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [hoveredPatientId, setHoveredPatientId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const { deletePatientInsurance } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$patients$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDeletePatientInsurance"])();
    // Only fetch patients when search is triggered
    const { patients, loading: patientsLoading, refetch: refetchPatients } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$patients$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePatients"])(shouldSearch ? patientFilter : undefined, 0, 20);
    const { patient: insuranceTargetPatient, refetch: refetchInsuranceTargetPatient } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$patients$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePatient"])(showAddInsuranceModal ? addInsurancePatientId : null);
    const effectiveSelectedPatient = preSelectedPatientData || selectedPatientDetails || selectedPatient;
    const expiredInsurances = (effectiveSelectedPatient?.patientInsurances || []).filter((ins)=>!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$insurance$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInsuranceActive"])(ins));
    const handleInsuranceSaved = async ()=>{
        await refetchPatients();
        await refetchInsuranceTargetPatient();
        if (selectedPatientId) await refetchSelectedPatientDetails();
        if (preSelectedPatientId) await refetchPreSelectedPatient();
    };
    const handleDeleteInsurance = async (insurance)=>{
        try {
            setIsDeletingInsurance(true);
            const res = await deletePatientInsurance(insurance.id);
            if (res.status === "SUCCESS") {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("Insurance removed from patient record");
                setSelectedInsuranceIds((prev)=>prev.filter((id)=>id !== insurance.id));
                setInsuranceToDelete(null);
                await handleInsuranceSaved();
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(res.message || "Failed to remove insurance");
            }
        } catch (err) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(err?.message || "Failed to remove insurance");
        } finally{
            setIsDeletingInsurance(false);
        }
    };
    const triageSelected = selectedServiceId === TRIAGE_SERVICE_ID;
    const hasSelectedDepartment = Boolean(selectedServiceId && !triageSelected);
    const canCreateVisit = triageSelected || hasSelectedDepartment;
    // Debounced search effect
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VisitCreationModal.useEffect": ()=>{
            const hasQuery = Boolean(searchQuery.trim());
            const hasFilter = Boolean(selectedInsuranceProviderId) || genderFilter && genderFilter !== "all" || ageRange !== "all" && (ageRange !== "custom" || customAgeMin || customAgeMax) && (ageRange !== "exact" || exactAge);
            if (!hasQuery && !hasFilter) {
                setShouldSearch(false);
                setPatientFilter({});
                return;
            }
            const timeoutId = setTimeout({
                "VisitCreationModal.useEffect.timeoutId": ()=>{
                    const searchFilter = hasQuery ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$patient$2d$search$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolvePatientSearchFilter"])(searchQuery, searchFilterType) : {};
                    const isIdSearch = Boolean(searchFilter.name && searchFilter.name.replace(/\D/g, "").length > 12);
                    const filter = {
                        ...searchFilter
                    };
                    if (selectedInsuranceProviderId) {
                        filter.insuranceProviderId = selectedInsuranceProviderId;
                    }
                    // If ID search is active, do not constrain by age or gender filters because ID already codes that
                    if (!isIdSearch) {
                        if (genderFilter && genderFilter !== "all") {
                            filter.gender = genderFilter;
                        }
                        if (ageRange === "pediatric") {
                            filter.minAge = 0;
                            filter.maxAge = 17;
                        } else if (ageRange === "adult") {
                            filter.minAge = 18;
                            filter.maxAge = 64;
                        } else if (ageRange === "senior") {
                            filter.minAge = 65;
                        } else if (ageRange === "exact" && exactAge.trim() && !isNaN(Number(exactAge))) {
                            filter.age = Number(exactAge);
                        } else if (ageRange === "custom") {
                            if (customAgeMin.trim() && !isNaN(Number(customAgeMin))) {
                                filter.minAge = Number(customAgeMin);
                            }
                            if (customAgeMax.trim() && !isNaN(Number(customAgeMax))) {
                                filter.maxAge = Number(customAgeMax);
                            }
                        }
                    }
                    setPatientFilter(filter);
                    setShouldSearch(true);
                }
            }["VisitCreationModal.useEffect.timeoutId"], 400);
            return ({
                "VisitCreationModal.useEffect": ()=>clearTimeout(timeoutId)
            })["VisitCreationModal.useEffect"];
        }
    }["VisitCreationModal.useEffect"], [
        searchQuery,
        searchFilterType,
        selectedInsuranceProviderId,
        genderFilter,
        ageRange,
        customAgeMin,
        customAgeMax,
        exactAge
    ]);
    const displayedPatients = preSelectedPatientData && !patients.some((p)=>p.id === preSelectedPatientData.id) ? [
        preSelectedPatientData,
        ...patients
    ] : patients;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VisitCreationModal.useEffect": ()=>{
            if (preSelectedPatientData) {
                setSelectedPatient(preSelectedPatientData);
                setSelectedPatientId(preSelectedPatientData.id);
                setCurrentStep({
                    "VisitCreationModal.useEffect": (current)=>current === "visit-details" ? current : "visit-details"
                }["VisitCreationModal.useEffect"]);
            }
        }
    }["VisitCreationModal.useEffect"], [
        preSelectedPatientData
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VisitCreationModal.useEffect": ()=>{
            if (selectedPatientDetails && !preSelectedPatientId) {
                setSelectedPatient(selectedPatientDetails);
            }
        }
    }["VisitCreationModal.useEffect"], [
        selectedPatientDetails,
        preSelectedPatientId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VisitCreationModal.useEffect": ()=>{
            const patient = preSelectedPatientData || selectedPatientDetails;
            if (patient && patient.patientInsurances) {
                const activeInsurances = patient.patientInsurances.filter({
                    "VisitCreationModal.useEffect.activeInsurances": (ins)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$insurance$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInsuranceActive"])(ins)
                }["VisitCreationModal.useEffect.activeInsurances"]);
                if (activeInsurances.length === 1) {
                    setSelectedInsuranceIds([
                        String(activeInsurances[0].id)
                    ]);
                } else {
                    setSelectedInsuranceIds([]);
                }
            }
        }
    }["VisitCreationModal.useEffect"], [
        preSelectedPatientData,
        selectedPatientDetails
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VisitCreationModal.useEffect": ()=>{
            if (preSelectedPatientId) {
                setSelectedPatientId({
                    "VisitCreationModal.useEffect": (current)=>current === preSelectedPatientId ? current : preSelectedPatientId
                }["VisitCreationModal.useEffect"]);
                // Skip patient-selection step entirely if preselected
                if (preSelectedPatientData) {
                    setSelectedPatient({
                        "VisitCreationModal.useEffect": (current)=>current?.id === preSelectedPatientData.id ? current : preSelectedPatientData
                    }["VisitCreationModal.useEffect"]);
                    setCurrentStep({
                        "VisitCreationModal.useEffect": (current)=>current === "visit-details" ? current : "visit-details"
                    }["VisitCreationModal.useEffect"]);
                }
            } else {
                setSelectedPatientId({
                    "VisitCreationModal.useEffect": (current)=>current === null ? current : null
                }["VisitCreationModal.useEffect"]);
                setCurrentStep({
                    "VisitCreationModal.useEffect": (current)=>current === "patient-selection" ? current : "patient-selection"
                }["VisitCreationModal.useEffect"]);
            }
        }
    }["VisitCreationModal.useEffect"], [
        preSelectedPatientId,
        preSelectedPatientData
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VisitCreationModal.useEffect": ()=>{
            if (!isOpen) {
                // Reset modal state when closed
                setCurrentStep("patient-selection");
                setSelectedPatientId(preSelectedPatientId || null);
                setSelectedPatient(null);
                setSearchQuery("");
                setSearchFilterType("name");
                handleResetFilters();
                setPatientFilter({});
                setShouldSearch(false);
                setSelectedServiceId(TRIAGE_SERVICE_ID);
                setSelectedInsuranceIds([]);
            }
        }
    }["VisitCreationModal.useEffect"], [
        isOpen,
        handleResetFilters,
        preSelectedPatientId
    ]);
    const canCreateNewVisit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "VisitCreationModal.useCallback[canCreateNewVisit]": (_patient)=>{
            // Patient.lastVisit was removed from API schema.
            // Allow creation; backend should enforce any "already has open visit" rule.
            return true;
        }
    }["VisitCreationModal.useCallback[canCreateNewVisit]"], []);
    const handlePatientSelect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "VisitCreationModal.useCallback[handlePatientSelect]": (patient)=>{
            setSelectedPatientId(patient.id);
            setSelectedPatient(patient);
            setCurrentStep("visit-details");
        }
    }["VisitCreationModal.useCallback[handlePatientSelect]"], [
        canCreateNewVisit
    ]);
    const handleCreateVisit = async ()=>{
        if (!selectedPatientId) return;
        // The Create Visit button is disabled until a service is selected, so
        // this is a safety net (no toast — the UI already guides the user).
        if (!canCreateVisit) return;
        try {
            const visitInput = {
                patientId: selectedPatientId
            };
            if (hasSelectedDepartment) {
                visitInput.departmentIds = [
                    selectedServiceId
                ];
            }
            // Add insurance IDs if selected
            if (selectedInsuranceIds.length > 0) {
                visitInput.insuranceIds = selectedInsuranceIds;
            }
            const result = await createVisit(visitInput);
            if (result.status === "SUCCESS") {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(result.message || "Visit created successfully!");
                if (onVisitCreated) {
                    onVisitCreated();
                }
                handleClose();
            } else {
                const message = result.message || result.messages?.[0]?.text || "Visit creation failed";
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(message);
            }
        } catch  {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Network error occurred while creating visit");
        }
    };
    const handleClose = ()=>{
        setCurrentStep("patient-selection");
        setSelectedPatientId(null);
        setSelectedPatient(null);
        setSearchQuery("");
        setSearchFilterType("name");
        handleResetFilters();
        setPatientFilter({});
        setShouldSearch(false);
        setSelectedServiceId(TRIAGE_SERVICE_ID);
        setSelectedInsuranceIds([]);
        onClose();
    };
    const handleBackToPatientSelection = ()=>{
        if (preSelectedPatientId) {
            // If we have a preselected patient, close modal instead of going back
            handleClose();
        } else {
            setCurrentStep("patient-selection");
            setSelectedServiceId(TRIAGE_SERVICE_ID);
            setSelectedInsuranceIds([]);
        }
    };
    const selectedDepartmentLabel = triageSelected ? "Triage" : hasSelectedDepartment ? departments.find((dept)=>String(dept.id) === String(selectedServiceId))?.name || "Selected department" : "";
    const dialogWidthClass = (()=>{
        if (currentStep === "visit-details") {
            return "sm:max-w-[620px] max-w-[95vw]";
        }
        if (patientsLoading) {
            return "sm:max-w-[1050px] max-w-[96vw]";
        }
        if (displayedPatients.length === 1) {
            return "sm:max-w-[460px] max-w-[95vw]";
        }
        if (displayedPatients.length === 2) {
            return "sm:max-w-[760px] max-w-[95vw]";
        }
        if (displayedPatients.length >= 3) {
            return "sm:max-w-[1050px] max-w-[96vw]";
        }
        // Idle or No results:
        return "sm:max-w-[540px] max-w-[95vw]";
    })();
    const gridColsClass = (()=>{
        if (displayedPatients.length === 1) {
            return "grid-cols-1";
        }
        if (displayedPatients.length === 2) {
            return "grid-cols-1 sm:grid-cols-2";
        }
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    })();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
                open: isOpen,
                onOpenChange: (open)=>{
                    if (!open) {
                        handleClose();
                    }
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
                    showCloseButton: false,
                    onPointerDownOutside: (e)=>{
                        if (currentStep === "visit-details") {
                            e.preventDefault();
                        }
                    },
                    onEscapeKeyDown: (e)=>{
                        if (currentStep === "visit-details") {
                            e.preventDefault();
                        }
                    },
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("overflow-hidden rounded-3xl border border-border/80 bg-card/95 dark:bg-card/95 text-card-foreground shadow-2xl backdrop-blur-2xl p-2.5 sm:p-3.5 gap-0 transition-all duration-300 ease-in-out", dialogWidthClass),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                            className: "sr-only",
                            children: currentStep === "patient-selection" ? preSelectedPatientId ? "Create Visit for Patient" : "Create Visit - Select Patient" : "Create Visit - Visit Details"
                        }, void 0, false, {
                            fileName: "[project]/components/visit-creation-modal.tsx",
                            lineNumber: 538,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "max-h-[calc(92vh-40px)] overflow-y-auto",
                            children: [
                                currentStep === "patient-selection" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-2xl border border-border/50 bg-[#FBF2ED] dark:bg-slate-900 shadow-md p-3.5 sm:p-4.5 flex flex-col space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-center space-y-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "text-lg font-bold text-foreground",
                                                    children: preSelectedPatientId ? "Create Visit for Patient" : "Create Visit - Select Patient"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                    lineNumber: 550,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-muted-foreground",
                                                    children: "Search and select a registered patient to proceed with clinic visit creation."
                                                }, void 0, false, {
                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                    lineNumber: 555,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                            lineNumber: 549,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative rounded-2xl border border-border/60 bg-white dark:bg-slate-950 p-2.5 sm:p-3 shadow-sm space-y-2.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex gap-2 items-center justify-center flex-wrap",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>setSearchFilterType("name"),
                                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer", searchFilterType === "name" ? "bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] text-white shadow-sm scale-105" : "bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground"),
                                                            children: "Name / Phone / ID"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                            lineNumber: 564,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>setSearchFilterType("insuranceCardNumber"),
                                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer", searchFilterType === "insuranceCardNumber" ? "bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] text-white shadow-sm scale-105" : "bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground"),
                                                            children: "Card #"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                            lineNumber: 576,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Popover"], {
                                                            open: isFilterOpen,
                                                            onOpenChange: setIsFilterOpen,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PopoverTrigger"], {
                                                                    asChild: true,
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border", activeFilterCount > 0 ? "border-primary bg-primary/10 text-primary shadow-xs" : "border-border/70 bg-background text-muted-foreground hover:text-foreground hover:border-primary/50"),
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__["SlidersHorizontal"], {
                                                                                className: "w-3.5 h-3.5"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                lineNumber: 601,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                children: "Filters"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                lineNumber: 602,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            activeFilterCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "w-4 h-4 rounded-full bg-primary text-white text-[11px] flex items-center justify-center font-bold",
                                                                                children: activeFilterCount
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                lineNumber: 604,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/visit-creation-modal.tsx",
                                                                        lineNumber: 592,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                                    lineNumber: 591,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PopoverContent"], {
                                                                    align: "center",
                                                                    side: "bottom",
                                                                    sideOffset: 8,
                                                                    className: "w-[320px] sm:w-[380px] p-4 rounded-2xl shadow-2xl border border-border/80 bg-background text-foreground z-[160] space-y-4",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center justify-between pb-2 border-b border-border/40",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "flex items-center gap-2",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__["SlidersHorizontal"], {
                                                                                            className: "w-4 h-4 text-primary"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                            lineNumber: 620,
                                                                                            columnNumber: 29
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-sm font-semibold text-foreground",
                                                                                            children: "Filter Patients"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                            lineNumber: 621,
                                                                                            columnNumber: 29
                                                                                        }, this),
                                                                                        activeFilterCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "px-1.5 py-0.5 rounded-full bg-primary/15 text-primary text-[11px] font-bold",
                                                                                            children: [
                                                                                                activeFilterCount,
                                                                                                " active"
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                            lineNumber: 623,
                                                                                            columnNumber: 31
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                    lineNumber: 619,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "flex items-center gap-2",
                                                                                    children: [
                                                                                        activeFilterCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                            type: "button",
                                                                                            onClick: handleResetFilters,
                                                                                            className: "text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors cursor-pointer",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__["RotateCcw"], {
                                                                                                    className: "w-3 h-3"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                                    lineNumber: 635,
                                                                                                    columnNumber: 33
                                                                                                }, this),
                                                                                                "Reset"
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                            lineNumber: 630,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                            type: "button",
                                                                                            onClick: ()=>setIsFilterOpen(false),
                                                                                            className: "text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors cursor-pointer",
                                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                                                                className: "w-3.5 h-3.5"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                                lineNumber: 644,
                                                                                                columnNumber: 31
                                                                                            }, this)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                            lineNumber: 639,
                                                                                            columnNumber: 29
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                    lineNumber: 628,
                                                                                    columnNumber: 27
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                                            lineNumber: 618,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "space-y-1.5",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                    className: "text-xs font-semibold text-muted-foreground flex items-center gap-1.5",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                                                                            className: "w-3.5 h-3.5 text-primary"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                            lineNumber: 652,
                                                                                            columnNumber: 29
                                                                                        }, this),
                                                                                        "Insurance Provider"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                    lineNumber: 651,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1.5 rounded-xl bg-muted/40 dark:bg-slate-900/60 border border-border/40",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                            type: "button",
                                                                                            onClick: ()=>setSelectedInsuranceProviderId(""),
                                                                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1", !selectedInsuranceProviderId ? "bg-background text-foreground shadow-xs font-semibold border border-border/80" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"),
                                                                                            children: "All Insurances"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                            lineNumber: 656,
                                                                                            columnNumber: 29
                                                                                        }, this),
                                                                                        availableInsurances && availableInsurances.map((ins)=>{
                                                                                            const isSelected = selectedInsuranceProviderId === ins.id;
                                                                                            const acronym = ins.acronym || ins.insuranceName;
                                                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                                type: "button",
                                                                                                onClick: ()=>setSelectedInsuranceProviderId(isSelected ? "" : ins.id),
                                                                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5", isSelected ? "bg-primary/15 text-primary border border-primary/40 font-semibold shadow-xs scale-105" : "text-muted-foreground hover:text-foreground hover:bg-muted/60 border border-transparent"),
                                                                                                title: ins.insuranceName,
                                                                                                children: [
                                                                                                    ins.iconUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                                                        src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$media$2d$url$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMediaUrl"])(ins.iconUrl),
                                                                                                        alt: ins.insuranceName,
                                                                                                        className: "h-3.5 w-3.5 rounded-full object-cover shrink-0"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                                        lineNumber: 686,
                                                                                                        columnNumber: 39
                                                                                                    }, this) : null,
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                        children: acronym
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                                        lineNumber: 692,
                                                                                                        columnNumber: 37
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, ins.id, true, {
                                                                                                fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                                lineNumber: 673,
                                                                                                columnNumber: 35
                                                                                            }, this);
                                                                                        })
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                    lineNumber: 655,
                                                                                    columnNumber: 27
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                                            lineNumber: 650,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "space-y-1.5",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                    className: "text-xs font-semibold text-muted-foreground flex items-center gap-1.5",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                                                            className: "w-3.5 h-3.5 text-primary"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                            lineNumber: 702,
                                                                                            columnNumber: 29
                                                                                        }, this),
                                                                                        "Gender"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                    lineNumber: 701,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "grid grid-cols-4 gap-1 p-1 rounded-xl bg-muted/40 dark:bg-slate-900/60 border border-border/40",
                                                                                    children: [
                                                                                        {
                                                                                            id: "all",
                                                                                            label: "All"
                                                                                        },
                                                                                        {
                                                                                            id: "MALE",
                                                                                            label: "Male"
                                                                                        },
                                                                                        {
                                                                                            id: "FEMALE",
                                                                                            label: "Female"
                                                                                        },
                                                                                        {
                                                                                            id: "OTHER",
                                                                                            label: "Other"
                                                                                        }
                                                                                    ].map((g)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                            type: "button",
                                                                                            onClick: ()=>setGenderFilter(g.id),
                                                                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("py-1.5 px-2 rounded-lg text-xs font-medium text-center transition-all cursor-pointer", genderFilter === g.id ? "bg-background text-foreground shadow-xs font-semibold border border-border/80" : "text-muted-foreground hover:text-foreground"),
                                                                                            children: g.label
                                                                                        }, g.id, false, {
                                                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                            lineNumber: 714,
                                                                                            columnNumber: 31
                                                                                        }, this))
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                    lineNumber: 705,
                                                                                    columnNumber: 27
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                                            lineNumber: 700,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "space-y-1.5",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                    className: "text-xs font-semibold text-muted-foreground flex items-center gap-1.5",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                                                            className: "w-3.5 h-3.5 text-primary"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                            lineNumber: 734,
                                                                                            columnNumber: 29
                                                                                        }, this),
                                                                                        "Age Range"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                    lineNumber: 733,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "grid grid-cols-3 gap-1 p-1 rounded-xl bg-muted/40 dark:bg-slate-900/60 border border-border/40 text-xs",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                            type: "button",
                                                                                            onClick: ()=>{
                                                                                                setAgeRange("all");
                                                                                                setExactAge("");
                                                                                                setCustomAgeMin("");
                                                                                                setCustomAgeMax("");
                                                                                            },
                                                                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("py-1 px-2 rounded-lg font-medium transition-all text-center cursor-pointer", ageRange === "all" ? "bg-background text-foreground shadow-xs font-semibold border border-border/80" : "text-muted-foreground hover:text-foreground"),
                                                                                            children: "All ages"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                            lineNumber: 738,
                                                                                            columnNumber: 29
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                            type: "button",
                                                                                            onClick: ()=>{
                                                                                                setAgeRange("pediatric");
                                                                                                setExactAge("");
                                                                                            },
                                                                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("py-1 px-2 rounded-lg font-medium transition-all text-center cursor-pointer", ageRange === "pediatric" ? "bg-background text-foreground shadow-xs font-semibold border border-border/80" : "text-muted-foreground hover:text-foreground"),
                                                                                            children: "0-17 yrs"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                            lineNumber: 755,
                                                                                            columnNumber: 29
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                            type: "button",
                                                                                            onClick: ()=>{
                                                                                                setAgeRange("adult");
                                                                                                setExactAge("");
                                                                                            },
                                                                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("py-1 px-2 rounded-lg font-medium transition-all text-center cursor-pointer", ageRange === "adult" ? "bg-background text-foreground shadow-xs font-semibold border border-border/80" : "text-muted-foreground hover:text-foreground"),
                                                                                            children: "18-64 yrs"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                            lineNumber: 770,
                                                                                            columnNumber: 29
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                            type: "button",
                                                                                            onClick: ()=>{
                                                                                                setAgeRange("senior");
                                                                                                setExactAge("");
                                                                                            },
                                                                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("py-1 px-2 rounded-lg font-medium transition-all text-center cursor-pointer", ageRange === "senior" ? "bg-background text-foreground shadow-xs font-semibold border border-border/80" : "text-muted-foreground hover:text-foreground"),
                                                                                            children: "65+ yrs"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                            lineNumber: 785,
                                                                                            columnNumber: 29
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                            type: "button",
                                                                                            onClick: ()=>{
                                                                                                setAgeRange("custom");
                                                                                                setExactAge("");
                                                                                            },
                                                                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("py-1 px-2 rounded-lg font-medium transition-all text-center cursor-pointer", ageRange === "custom" ? "bg-background text-foreground shadow-xs font-semibold border border-border/80" : "text-muted-foreground hover:text-foreground"),
                                                                                            children: "Custom"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                            lineNumber: 800,
                                                                                            columnNumber: 29
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                            type: "button",
                                                                                            onClick: ()=>{
                                                                                                setAgeRange("exact");
                                                                                                setCustomAgeMin("");
                                                                                                setCustomAgeMax("");
                                                                                            },
                                                                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("py-1 px-2 rounded-lg font-medium transition-all text-center cursor-pointer", ageRange === "exact" ? "bg-background text-foreground shadow-xs font-semibold border border-border/80" : "text-muted-foreground hover:text-foreground"),
                                                                                            children: "Exact Age"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                            lineNumber: 815,
                                                                                            columnNumber: 29
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                    lineNumber: 737,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                ageRange === "custom" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "flex items-center gap-2 pt-1",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                            type: "number",
                                                                                            min: "0",
                                                                                            max: "150",
                                                                                            placeholder: "Min age",
                                                                                            value: customAgeMin,
                                                                                            onChange: (e)=>setCustomAgeMin(e.target.value),
                                                                                            className: "w-full px-3 py-1.5 text-xs bg-background border border-border/60 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                            lineNumber: 835,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-xs text-muted-foreground",
                                                                                            children: "to"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                            lineNumber: 844,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                            type: "number",
                                                                                            min: "0",
                                                                                            max: "150",
                                                                                            placeholder: "Max age",
                                                                                            value: customAgeMax,
                                                                                            onChange: (e)=>setCustomAgeMax(e.target.value),
                                                                                            className: "w-full px-3 py-1.5 text-xs bg-background border border-border/60 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                            lineNumber: 845,
                                                                                            columnNumber: 31
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                    lineNumber: 834,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                ageRange === "exact" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "pt-1",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                        type: "number",
                                                                                        min: "0",
                                                                                        max: "150",
                                                                                        placeholder: "Exact age (e.g. 25)",
                                                                                        value: exactAge,
                                                                                        onChange: (e)=>setExactAge(e.target.value),
                                                                                        className: "w-full px-3 py-1.5 text-xs bg-background border border-border/60 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                        lineNumber: 859,
                                                                                        columnNumber: 31
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                    lineNumber: 858,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                                            lineNumber: 732,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                                    lineNumber: 611,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                            lineNumber: 590,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                    lineNumber: 563,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                            className: "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                            lineNumber: 877,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                            type: "text",
                                                            placeholder: searchFilterType === "insuranceCardNumber" ? "Search patients by insurance card number..." : "Search patients by name, phone, or national ID...",
                                                            value: searchQuery,
                                                            onChange: (e)=>setSearchQuery(e.target.value),
                                                            className: "pl-10 pr-9 h-11 text-sm rounded-xl border-border/60 bg-background/50 focus-visible:ring-primary/40",
                                                            autoFocus: true
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                            lineNumber: 878,
                                                            columnNumber: 21
                                                        }, this),
                                                        searchQuery && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>setSearchQuery(""),
                                                            className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                                className: "w-4 h-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/visit-creation-modal.tsx",
                                                                lineNumber: 896,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                            lineNumber: 891,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                    lineNumber: 876,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                            lineNumber: 561,
                                            columnNumber: 17
                                        }, this),
                                        patientsLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between text-xs text-muted-foreground px-1",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "flex items-center gap-1.5 font-medium",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "w-2 h-2 rounded-full bg-primary animate-pulse"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/visit-creation-modal.tsx",
                                                                lineNumber: 907,
                                                                columnNumber: 25
                                                            }, this),
                                                            "Searching patient database..."
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/visit-creation-modal.tsx",
                                                        lineNumber: 906,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                    lineNumber: 905,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[460px] overflow-y-auto pr-1",
                                                    children: Array.from({
                                                        length: 9
                                                    }).map((_, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PatientCardSkeleton, {}, idx, false, {
                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                            lineNumber: 913,
                                                            columnNumber: 25
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                    lineNumber: 911,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                            lineNumber: 904,
                                            columnNumber: 19
                                        }, this) : displayedPatients.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between text-xs text-muted-foreground px-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-semibold text-foreground",
                                                            children: [
                                                                "Found ",
                                                                displayedPatients.length,
                                                                " matching patient",
                                                                displayedPatients.length > 1 ? "s" : ""
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                            lineNumber: 920,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[12px] text-muted-foreground",
                                                            children: "Click a card to select"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                            lineNumber: 923,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                    lineNumber: 919,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("grid gap-3 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin", gridColsClass),
                                                    children: displayedPatients.map((patient)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("group relative p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between bg-white dark:bg-slate-950 shadow-sm", selectedPatientId === patient.id ? "border-primary ring-2 ring-primary/20 bg-primary/5 shadow-md" : "border-border/60 hover:border-primary/60 hover:shadow-md hover:-translate-y-0.5", !canCreateNewVisit(patient) && "opacity-60 cursor-not-allowed"),
                                                            onClick: ()=>handlePatientSelect(patient),
                                                            onMouseEnter: ()=>setHoveredPatientId(patient.id),
                                                            onMouseLeave: ()=>setHoveredPatientId(null),
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-start justify-between gap-2 mb-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2.5 min-w-0",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "w-10 h-10 rounded-xl bg-gradient-to-tr from-[#25D2D8]/20 via-[#5F77E8]/20 to-[#3CAAD8]/20 border border-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0",
                                                                                    children: [
                                                                                        patient.firstName?.[0] || "",
                                                                                        patient.lastName?.[0] || ""
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                    lineNumber: 943,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "min-w-0",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                                            className: "font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors",
                                                                                            children: [
                                                                                                patient.firstName,
                                                                                                " ",
                                                                                                patient.lastName
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                            lineNumber: 947,
                                                                                            columnNumber: 33
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "flex items-center gap-1.5 text-xs text-muted-foreground",
                                                                                            children: [
                                                                                                patient.dateOfBirth && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    children: [
                                                                                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateAge"])(patient.dateOfBirth),
                                                                                                        " yrs"
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                                    lineNumber: 952,
                                                                                                    columnNumber: 37
                                                                                                }, this),
                                                                                                patient.gender && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                                                    children: [
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                            children: "•"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                                            lineNumber: 956,
                                                                                                            columnNumber: 39
                                                                                                        }, this),
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                            className: "capitalize",
                                                                                                            children: patient.gender.toLowerCase()
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                                            lineNumber: 957,
                                                                                                            columnNumber: 39
                                                                                                        }, this)
                                                                                                    ]
                                                                                                }, void 0, true)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                            lineNumber: 950,
                                                                                            columnNumber: 33
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                    lineNumber: 946,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                                            lineNumber: 942,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-0.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                                    type: "button",
                                                                                    variant: "ghost",
                                                                                    size: "icon",
                                                                                    onClick: (e)=>{
                                                                                        e.stopPropagation();
                                                                                        setAddInsurancePatientId(patient.id);
                                                                                        setShowAddInsuranceModal(true);
                                                                                    },
                                                                                    className: "h-7 w-7 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10",
                                                                                    title: "Add insurance",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldPlus$3e$__["ShieldPlus"], {
                                                                                        className: "w-3.5 h-3.5"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                        lineNumber: 978,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                    lineNumber: 966,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                                    type: "button",
                                                                                    variant: "ghost",
                                                                                    size: "icon",
                                                                                    onClick: (e)=>{
                                                                                        e.stopPropagation();
                                                                                        setSelectedPatientForEdit(patient);
                                                                                        setEditPatientModal(true);
                                                                                    },
                                                                                    className: "h-7 w-7 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10",
                                                                                    title: "Edit patient",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"], {
                                                                                        className: "w-3.5 h-3.5"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                        lineNumber: 992,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                    lineNumber: 980,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                                            lineNumber: 965,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                                    lineNumber: 941,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "space-y-1 text-xs text-muted-foreground my-2 bg-muted/20 p-2 rounded-xl border border-border/40",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center justify-between gap-1",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-muted-foreground",
                                                                                    children: "Phone:"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                    lineNumber: 1000,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "font-medium text-foreground truncate",
                                                                                    children: patient.primaryPhoneNumber || "—"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                    lineNumber: 1001,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                                            lineNumber: 999,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center justify-between gap-1",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-muted-foreground",
                                                                                    children: "National ID:"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                    lineNumber: 1004,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "font-medium text-foreground truncate max-w-[120px]",
                                                                                    children: patient.nationalIdNumber || "—"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                    lineNumber: 1005,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                                            lineNumber: 1003,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                                    lineNumber: 998,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "pt-2 border-t border-border/40 flex items-center justify-between gap-2 mt-auto",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex flex-wrap gap-1.5 min-w-0 max-w-[70%]",
                                                                            children: patient.patientInsurances && patient.patientInsurances.length > 0 ? patient.patientInsurances.map((ins, idx)=>{
                                                                                const active = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$insurance$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInsuranceActive"])(ins);
                                                                                const acronym = ins.insuranceProvider?.acronym || ins.insuranceProvider?.insuranceName || "INS";
                                                                                const name = ins.insuranceProvider?.insuranceName || ins.insuranceProvider?.name || acronym;
                                                                                const iconUrl = ins.insuranceProvider?.iconUrl;
                                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "relative group/ins inline-block",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                                            variant: "outline",
                                                                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-[11px] px-1.5 py-0.5 h-5 rounded-md font-medium cursor-help transition-all flex items-center gap-1", active ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20" : "border-amber-300 dark:border-amber-700 bg-amber-500/10 text-amber-600 dark:text-amber-400 opacity-70"),
                                                                                            children: [
                                                                                                iconUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                                                    src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$media$2d$url$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMediaUrl"])(iconUrl),
                                                                                                    alt: name,
                                                                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-3 w-3 rounded-full object-cover shrink-0", !active && "grayscale")
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                                    lineNumber: 1030,
                                                                                                    columnNumber: 43
                                                                                                }, this) : !active ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldAlert$3e$__["ShieldAlert"], {
                                                                                                    className: "h-3 w-3 shrink-0 text-amber-500"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                                    lineNumber: 1036,
                                                                                                    columnNumber: 43
                                                                                                }, this) : null,
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    children: acronym
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                                    lineNumber: 1038,
                                                                                                    columnNumber: 41
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                            lineNumber: 1020,
                                                                                            columnNumber: 39
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "absolute bottom-full left-0 mb-2 opacity-0 invisible group-hover/ins:opacity-100 group-hover/ins:visible transition-all duration-150 z-[150] pointer-events-none w-56",
                                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                className: "bg-slate-900 dark:bg-slate-800 text-white text-[12px] rounded-xl p-2.5 shadow-2xl border border-slate-700/60 backdrop-blur-md space-y-1",
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex items-center justify-between gap-1 border-b border-slate-700 pb-1",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "font-bold text-xs text-white truncate",
                                                                                                                children: name
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                                                lineNumber: 1045,
                                                                                                                columnNumber: 45
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0", active ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"),
                                                                                                                children: active ? "Active" : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$insurance$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["insuranceStatusLabel"])(ins)
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                                                lineNumber: 1046,
                                                                                                                columnNumber: 45
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                                        lineNumber: 1044,
                                                                                                        columnNumber: 43
                                                                                                    }, this),
                                                                                                    ins.insuranceCardNumber && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex justify-between text-slate-300 gap-2",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "text-slate-400 shrink-0",
                                                                                                                children: "Card #:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                                                lineNumber: 1059,
                                                                                                                columnNumber: 47
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "font-mono font-medium truncate",
                                                                                                                children: ins.insuranceCardNumber
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                                                lineNumber: 1060,
                                                                                                                columnNumber: 47
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                                        lineNumber: 1058,
                                                                                                        columnNumber: 45
                                                                                                    }, this),
                                                                                                    ins.providingCompanyOrEmployer && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex justify-between text-slate-300 gap-2",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "text-slate-400 shrink-0",
                                                                                                                children: "Employer:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                                                lineNumber: 1065,
                                                                                                                columnNumber: 47
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "truncate max-w-[120px]",
                                                                                                                children: ins.providingCompanyOrEmployer
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                                                lineNumber: 1066,
                                                                                                                columnNumber: 47
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                                        lineNumber: 1064,
                                                                                                        columnNumber: 45
                                                                                                    }, this),
                                                                                                    ins.principalMemberName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex justify-between text-slate-300 gap-2",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "text-slate-400 shrink-0",
                                                                                                                children: "Member:"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                                                lineNumber: 1071,
                                                                                                                columnNumber: 47
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "truncate max-w-[120px]",
                                                                                                                children: ins.principalMemberName
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                                                lineNumber: 1072,
                                                                                                                columnNumber: 47
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                                        lineNumber: 1070,
                                                                                                        columnNumber: 45
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "absolute top-full left-4 border-4 border-transparent border-t-slate-900 dark:border-t-slate-800"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                                        lineNumber: 1075,
                                                                                                        columnNumber: 43
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                                lineNumber: 1043,
                                                                                                columnNumber: 41
                                                                                            }, this)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                            lineNumber: 1042,
                                                                                            columnNumber: 39
                                                                                        }, this)
                                                                                    ]
                                                                                }, idx, true, {
                                                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                    lineNumber: 1019,
                                                                                    columnNumber: 37
                                                                                }, this);
                                                                            }) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-[11px] text-muted-foreground italic",
                                                                                children: "Private / Self-pay"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                lineNumber: 1082,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                                            lineNumber: 1011,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-xs font-semibold text-primary flex items-center gap-1 group-hover:translate-x-0.5 transition-transform shrink-0",
                                                                            children: [
                                                                                "Select ",
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                                                                    className: "w-3.5 h-3.5 rotate-180"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                    lineNumber: 1087,
                                                                                    columnNumber: 38
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                                            lineNumber: 1086,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                                    lineNumber: 1010,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, patient.id, true, {
                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                            lineNumber: 927,
                                                            columnNumber: 25
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                    lineNumber: 925,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                            lineNumber: 918,
                                            columnNumber: 19
                                        }, this) : shouldSearch ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "rounded-2xl border border-dashed border-border/70 p-6 text-center bg-white/40 dark:bg-slate-950/40",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                    className: "w-8 h-8 text-muted-foreground/50 mx-auto mb-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                    lineNumber: 1096,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "font-semibold text-sm text-foreground",
                                                    children: "No matching patients found"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                    lineNumber: 1097,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-muted-foreground mt-1 max-w-sm mx-auto",
                                                    children: [
                                                        "We couldn't find any patient matching \"",
                                                        searchQuery,
                                                        '". Please check for typos or register a new patient.'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                    lineNumber: 1098,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                            lineNumber: 1095,
                                            columnNumber: 19
                                        }, this) : null
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                    lineNumber: 548,
                                    columnNumber: 15
                                }, this),
                                currentStep === "visit-details" && selectedPatient && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-4 bg-[#FBF2ED] dark:bg-slate-900 border border-border/50 p-4 sm:p-5 rounded-2xl shadow-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-white dark:bg-slate-950 border border-border/60 p-3.5 rounded-xl shadow-sm",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between gap-2 mb-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs",
                                                                    children: [
                                                                        selectedPatient.firstName?.[0] || "",
                                                                        selectedPatient.lastName?.[0] || ""
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                                    lineNumber: 1112,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "font-semibold text-sm",
                                                                    children: "Selected Patient"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                                    lineNumber: 1115,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                            lineNumber: 1111,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                    type: "button",
                                                                    variant: "outline",
                                                                    size: "sm",
                                                                    className: "h-7 px-2.5 text-xs rounded-lg border-border/60",
                                                                    onClick: ()=>{
                                                                        setAddInsurancePatientId(selectedPatient.id);
                                                                        setShowAddInsuranceModal(true);
                                                                    },
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldPlus$3e$__["ShieldPlus"], {
                                                                            className: "w-3.5 h-3.5 mr-1"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                                            lineNumber: 1128,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        "Add insurance"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                                    lineNumber: 1118,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                    type: "button",
                                                                    variant: "outline",
                                                                    size: "sm",
                                                                    className: "h-7 px-2.5 text-xs rounded-lg border-border/60",
                                                                    onClick: ()=>{
                                                                        setSelectedPatientForEdit(selectedPatient);
                                                                        setEditPatientModal(true);
                                                                    },
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"], {
                                                                            className: "w-3.5 h-3.5 mr-1"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                                            lineNumber: 1141,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        "Edit"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                                    lineNumber: 1131,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                            lineNumber: 1117,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                    lineNumber: 1110,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-sm",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "font-medium text-foreground",
                                                            children: [
                                                                selectedPatient.firstName,
                                                                " ",
                                                                selectedPatient.lastName
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                            lineNumber: 1147,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-xs text-muted-foreground mt-0.5",
                                                            children: [
                                                                "DOB:",
                                                                " ",
                                                                new Date(selectedPatient.dateOfBirth).toLocaleDateString(),
                                                                selectedPatient.primaryPhoneNumber && ` • Phone: ${selectedPatient.primaryPhoneNumber}`
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                            lineNumber: 1150,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                    lineNumber: 1146,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                            lineNumber: 1109,
                                            columnNumber: 17
                                        }, this),
                                        expiredInsurances.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "rounded-2xl border border-amber-300 dark:border-amber-700/80 bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent p-3.5 sm:p-4 text-amber-950 dark:text-amber-100 shadow-xs space-y-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-start gap-2.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                                className: "w-4 h-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/visit-creation-modal.tsx",
                                                                lineNumber: 1166,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                            lineNumber: 1165,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-1 flex-1 min-w-0",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center justify-between gap-2 flex-wrap",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        className: "font-bold text-xs sm:text-sm text-amber-900 dark:text-amber-100 flex items-center gap-1.5",
                                                                        children: [
                                                                            "Expired Insurance Policy Detected",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                                variant: "outline",
                                                                                className: "text-[11px] px-1.5 py-0 h-4.5 border-amber-400/60 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold",
                                                                                children: [
                                                                                    expiredInsurances.length,
                                                                                    " Expired"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                lineNumber: 1172,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/visit-creation-modal.tsx",
                                                                        lineNumber: 1170,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                                    lineNumber: 1169,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs text-amber-800/90 dark:text-amber-300/90 leading-relaxed",
                                                                    children: "This patient has expired insurance recorded. Since the patient is present at reception, please update their card/validity details or remove the policy if it is no longer used."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                                    lineNumber: 1180,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                            lineNumber: 1168,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                    lineNumber: 1164,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2 pt-1 border-t border-amber-200/70 dark:border-amber-800/50",
                                                    children: expiredInsurances.map((expIns)=>{
                                                        const acronym = expIns.insuranceProvider?.acronym || expIns.insuranceProvider?.insuranceName || "INS";
                                                        const name = expIns.insuranceProvider?.insuranceName || acronym;
                                                        const statusText = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$insurance$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["insuranceStatusLabel"])(expIns);
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between gap-2 bg-white/80 dark:bg-slate-950/80 p-2 sm:p-2.5 rounded-xl border border-amber-200/80 dark:border-amber-800/40 shadow-xs",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "min-w-0 flex items-center gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "w-6 h-6 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center text-[11px] font-bold shrink-0",
                                                                            children: acronym.slice(0, 3)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                                            lineNumber: 1202,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "min-w-0 text-xs",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "font-semibold text-foreground truncate",
                                                                                    children: [
                                                                                        name,
                                                                                        " ",
                                                                                        expIns.insuranceCardNumber ? `(${expIns.insuranceCardNumber})` : ""
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                    lineNumber: 1206,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "text-[12px] text-amber-600 dark:text-amber-400 font-medium truncate",
                                                                                    children: statusText
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                    lineNumber: 1212,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                                            lineNumber: 1205,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                                    lineNumber: 1201,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-1.5 shrink-0",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                            type: "button",
                                                                            size: "sm",
                                                                            variant: "outline",
                                                                            onClick: ()=>{
                                                                                setEditingInsurance(expIns);
                                                                                setAddInsurancePatientId(selectedPatient.id);
                                                                                setShowAddInsuranceModal(true);
                                                                            },
                                                                            className: "h-7 px-2.5 text-xs rounded-lg border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-800 dark:text-amber-200",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"], {
                                                                                    className: "w-3 h-3 mr-1"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                    lineNumber: 1229,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                "Update / Renew"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                                            lineNumber: 1218,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                            type: "button",
                                                                            size: "sm",
                                                                            variant: "ghost",
                                                                            onClick: ()=>setInsuranceToDelete(expIns),
                                                                            className: "h-7 px-2 text-xs rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-700",
                                                                            title: "Delete insurance",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                                className: "w-3.5 h-3.5"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                lineNumber: 1240,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                                            lineNumber: 1232,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                                    lineNumber: 1217,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, expIns.id, true, {
                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                            lineNumber: 1197,
                                                            columnNumber: 27
                                                        }, this);
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                    lineNumber: 1187,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                            lineNumber: 1163,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-sm font-semibold text-foreground",
                                                            children: "Insurance for Visit"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                            lineNumber: 1253,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs text-muted-foreground",
                                                            children: selectedInsuranceIds.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "italic text-muted-foreground",
                                                                children: "Private / Self-pay"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/visit-creation-modal.tsx",
                                                                lineNumber: 1258,
                                                                columnNumber: 25
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-primary font-medium",
                                                                children: [
                                                                    selectedInsuranceIds.length,
                                                                    " insurance",
                                                                    selectedInsuranceIds.length > 1 ? "s" : "",
                                                                    " selected"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/visit-creation-modal.tsx",
                                                                lineNumber: 1260,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                            lineNumber: 1256,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                    lineNumber: 1252,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5",
                                                    children: [
                                                        selectedPatient.patientInsurances && selectedPatient.patientInsurances.map((insurance)=>{
                                                            const active = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$insurance$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInsuranceActive"])(insurance);
                                                            const isSelected = selectedInsuranceIds.includes(insurance.id);
                                                            const acronym = insurance.insuranceProvider?.acronym || insurance.insuranceProvider?.insuranceName || "INS";
                                                            const providerName = insurance.insuranceProvider?.insuranceName || insurance.insuranceProvider?.name || acronym;
                                                            const iconUrl = insurance.insuranceProvider?.iconUrl;
                                                            const patientSharePct = insurance.patientSharePercentage ?? (insurance.insuranceProvider ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getBasePatientSharePercentage"])(insurance.insuranceProvider) : null);
                                                            const memberLabel = insurance.principalMember ? "Principal / Self" : insurance.principalMemberName ? insurance.principalMemberName : "Dependent";
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                onClick: ()=>{
                                                                    if (!active) {
                                                                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].warn(`This ${acronym} insurance has expired. Please update it before selecting it for a visit.`);
                                                                        return;
                                                                    }
                                                                    setSelectedInsuranceIds((prev)=>prev.includes(insurance.id) ? prev.filter((id)=>id !== insurance.id) : [
                                                                            ...prev,
                                                                            insurance.id
                                                                        ]);
                                                                },
                                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("group/card relative p-3 rounded-2xl border transition-all duration-200 flex flex-col justify-between select-none min-h-[110px]", active ? "cursor-pointer" : "bg-amber-50/40 dark:bg-amber-950/10 border-amber-300 dark:border-amber-800/80", active && isSelected ? "border-primary bg-primary/5 dark:bg-primary/10 ring-2 ring-primary/25 shadow-sm" : active ? "border-border/60 bg-white dark:bg-slate-950 hover:border-primary/50 hover:shadow-xs" : ""),
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-start justify-between gap-1.5 mb-1.5",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex items-center gap-1.5 min-w-0",
                                                                                children: [
                                                                                    iconUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                                        src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$media$2d$url$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMediaUrl"])(iconUrl),
                                                                                        alt: providerName,
                                                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-4 w-4 rounded-full object-cover shrink-0", !active && "grayscale")
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                        lineNumber: 1325,
                                                                                        columnNumber: 35
                                                                                    }, this) : null,
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "font-bold text-xs text-foreground truncate",
                                                                                        title: providerName,
                                                                                        children: acronym
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                        lineNumber: 1334,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                lineNumber: 1323,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex items-center gap-1 shrink-0",
                                                                                children: [
                                                                                    patientSharePct !== null && patientSharePct !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                                        variant: "outline",
                                                                                        className: "text-[11px] px-1.5 py-0 h-4.5 rounded-md font-semibold bg-primary/10 text-primary border-primary/25",
                                                                                        children: [
                                                                                            patientSharePct,
                                                                                            "% share"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                        lineNumber: 1344,
                                                                                        columnNumber: 35
                                                                                    }, this),
                                                                                    active && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-4 h-4 rounded-md border flex items-center justify-center transition-all", isSelected ? "bg-primary border-primary text-white" : "border-border/80 bg-background/50"),
                                                                                        children: isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                                            className: "w-3 h-3 stroke-[3]"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                            lineNumber: 1360,
                                                                                            columnNumber: 52
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                        lineNumber: 1352,
                                                                                        columnNumber: 35
                                                                                    }, this),
                                                                                    !active && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                                        variant: "outline",
                                                                                        className: "text-[10px] px-1.5 py-0 h-4.5 rounded-md font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700",
                                                                                        children: "Expired"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                        lineNumber: 1364,
                                                                                        columnNumber: 35
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                lineNumber: 1342,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/visit-creation-modal.tsx",
                                                                        lineNumber: 1322,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "space-y-0.5 text-[12px] text-muted-foreground my-1",
                                                                        children: [
                                                                            insurance.insuranceCardNumber && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex items-center gap-1 truncate font-mono text-foreground font-medium",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__["CreditCard"], {
                                                                                        className: "w-3 h-3 text-muted-foreground shrink-0"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                        lineNumber: 1378,
                                                                                        columnNumber: 35
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "truncate",
                                                                                        children: insurance.insuranceCardNumber
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                        lineNumber: 1379,
                                                                                        columnNumber: 35
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                lineNumber: 1377,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex items-center gap-1 truncate text-muted-foreground",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                                                        className: "w-3 h-3 text-muted-foreground shrink-0"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                        lineNumber: 1383,
                                                                                        columnNumber: 33
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "truncate",
                                                                                        children: memberLabel
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                        lineNumber: 1384,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                lineNumber: 1382,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/visit-creation-modal.tsx",
                                                                        lineNumber: 1375,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    !active ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "pt-1.5 border-t border-amber-200/70 dark:border-amber-800/40 flex items-center justify-between gap-1 mt-1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-[11px] font-semibold text-amber-600 dark:text-amber-400 truncate",
                                                                                title: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$insurance$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["insuranceStatusLabel"])(insurance),
                                                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$insurance$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["insuranceStatusLabel"])(insurance)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                lineNumber: 1391,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex items-center gap-1 shrink-0",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                                        type: "button",
                                                                                        size: "sm",
                                                                                        variant: "outline",
                                                                                        onClick: (e)=>{
                                                                                            e.stopPropagation();
                                                                                            setEditingInsurance(insurance);
                                                                                            setAddInsurancePatientId(selectedPatient.id);
                                                                                            setShowAddInsuranceModal(true);
                                                                                        },
                                                                                        className: "h-6 px-1.5 text-[11px] rounded-md border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/30",
                                                                                        title: "Update card details and validity",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"], {
                                                                                                className: "w-2.5 h-2.5 mr-1"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                                lineNumber: 1411,
                                                                                                columnNumber: 37
                                                                                            }, this),
                                                                                            "Update"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                        lineNumber: 1398,
                                                                                        columnNumber: 35
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                                        type: "button",
                                                                                        size: "sm",
                                                                                        variant: "ghost",
                                                                                        onClick: (e)=>{
                                                                                            e.stopPropagation();
                                                                                            setInsuranceToDelete(insurance);
                                                                                        },
                                                                                        className: "h-6 w-6 p-0 rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-700",
                                                                                        title: "Delete insurance",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                                            className: "w-3 h-3"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                            lineNumber: 1425,
                                                                                            columnNumber: 37
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                        lineNumber: 1414,
                                                                                        columnNumber: 35
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/visit-creation-modal.tsx",
                                                                                lineNumber: 1397,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/visit-creation-modal.tsx",
                                                                        lineNumber: 1390,
                                                                        columnNumber: 31
                                                                    }, this) : null
                                                                ]
                                                            }, insurance.id, true, {
                                                                fileName: "[project]/components/visit-creation-modal.tsx",
                                                                lineNumber: 1294,
                                                                columnNumber: 27
                                                            }, this);
                                                        }),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>{
                                                                setEditingInsurance(null);
                                                                setAddInsurancePatientId(selectedPatient.id);
                                                                setShowAddInsuranceModal(true);
                                                            },
                                                            className: "flex flex-col items-center justify-center p-3 rounded-2xl border border-dashed border-primary/40 hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all text-primary text-xs font-semibold gap-1.5 min-h-[110px] group cursor-pointer bg-white/40 dark:bg-slate-950/40",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "w-7 h-7 rounded-full bg-primary/10 group-hover:bg-primary group-hover:text-white text-primary flex items-center justify-center transition-all",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                                        className: "w-4 h-4"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/visit-creation-modal.tsx",
                                                                        lineNumber: 1445,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                                    lineNumber: 1444,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: "Add Insurance"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                                    lineNumber: 1447,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                                            lineNumber: 1435,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                    lineNumber: 1268,
                                                    columnNumber: 19
                                                }, this),
                                                (!selectedPatient.patientInsurances || selectedPatient.patientInsurances.length === 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[12px] text-muted-foreground italic px-0.5",
                                                    children: 'No insurance recorded for this patient. Click "Add Insurance" above to link a card or continue as Private.'
                                                }, void 0, false, {
                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                    lineNumber: 1453,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                            lineNumber: 1251,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-foreground mb-2",
                                                    children: "Select Service"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                    lineNumber: 1461,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-muted-foreground mb-2",
                                                    children: "Choose Triage or one or more departments for this visit."
                                                }, void 0, false, {
                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                    lineNumber: 1464,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$department$2d$autocomplete$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DepartmentAutocomplete"], {
                                                    departments: [
                                                        {
                                                            id: TRIAGE_SERVICE_ID,
                                                            name: "Triage"
                                                        },
                                                        ...departments
                                                    ],
                                                    selectedDepartmentId: selectedServiceId,
                                                    onDepartmentSelect: setSelectedServiceId,
                                                    placeholder: departmentsLoading ? "Loading services..." : "Choose service",
                                                    disabled: departmentsLoading
                                                }, void 0, false, {
                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                    lineNumber: 1467,
                                                    columnNumber: 19
                                                }, this),
                                                selectedDepartmentLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-muted-foreground mt-2",
                                                    children: [
                                                        "Selected service: ",
                                                        selectedDepartmentLabel
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                                    lineNumber: 1482,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                            lineNumber: 1460,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "pt-1"
                                        }, void 0, false, {
                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                            lineNumber: 1489,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                    lineNumber: 1107,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/visit-creation-modal.tsx",
                            lineNumber: 546,
                            columnNumber: 11
                        }, this),
                        currentStep === "visit-details" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogFooter"], {
                            className: "mt-3 flex justify-center items-center gap-3 px-0 pb-1 pt-2",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-center items-center gap-3 w-full",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "outline",
                                        onClick: handleBackToPatientSelection,
                                        className: "rounded-full px-6 border-white/20 bg-white/10 text-red-600 hover:bg-white/20 dark:border-white/10 dark:bg-white/5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                                className: "w-4 h-4 mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/components/visit-creation-modal.tsx",
                                                lineNumber: 1502,
                                                columnNumber: 19
                                            }, this),
                                            preSelectedPatientId ? "Cancel" : "Back to Patient Selection"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/visit-creation-modal.tsx",
                                        lineNumber: 1497,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        onClick: handleCreateVisit,
                                        disabled: visitLoading || !canCreateVisit,
                                        className: "rounded-full px-6 bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] hover:opacity-90 text-white shadow-lg",
                                        children: visitLoading ? "Creating..." : "Create Visit"
                                    }, void 0, false, {
                                        fileName: "[project]/components/visit-creation-modal.tsx",
                                        lineNumber: 1507,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/visit-creation-modal.tsx",
                                lineNumber: 1496,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/visit-creation-modal.tsx",
                            lineNumber: 1495,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/visit-creation-modal.tsx",
                    lineNumber: 521,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/visit-creation-modal.tsx",
                lineNumber: 513,
                columnNumber: 7
            }, this),
            insuranceTargetPatient && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AddPatientInsuranceModal, {
                open: showAddInsuranceModal,
                onOpenChange: (open)=>{
                    setShowAddInsuranceModal(open);
                    if (!open) {
                        setAddInsurancePatientId(null);
                        setEditingInsurance(null);
                    }
                },
                patientId: insuranceTargetPatient.id,
                patientDateOfBirth: insuranceTargetPatient.dateOfBirth,
                patientInsurances: insuranceTargetPatient.patientInsurances || [],
                editingInsurance: editingInsurance,
                onSuccess: async ()=>{
                    await handleInsuranceSaved();
                    setEditingInsurance(null);
                },
                context: "reception"
            }, void 0, false, {
                fileName: "[project]/components/visit-creation-modal.tsx",
                lineNumber: 1521,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
                open: Boolean(insuranceToDelete),
                onOpenChange: (open)=>!open && setInsuranceToDelete(null),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
                    className: "sm:max-w-[440px] rounded-2xl p-5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                    className: "flex items-center gap-2 text-red-600 text-base font-bold",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                            className: "w-5 h-5"
                                        }, void 0, false, {
                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                            lineNumber: 1550,
                                            columnNumber: 15
                                        }, this),
                                        "Remove Insurance Policy"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                    lineNumber: 1549,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogDescription"], {
                                    className: "text-xs sm:text-sm text-muted-foreground pt-2",
                                    children: [
                                        "Are you sure you want to remove the",
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-semibold text-foreground",
                                            children: insuranceToDelete?.insuranceProvider?.insuranceName || insuranceToDelete?.insuranceProvider?.acronym || "selected"
                                        }, void 0, false, {
                                            fileName: "[project]/components/visit-creation-modal.tsx",
                                            lineNumber: 1555,
                                            columnNumber: 15
                                        }, this),
                                        " ",
                                        "insurance policy",
                                        insuranceToDelete?.insuranceCardNumber ? ` (Card: ${insuranceToDelete.insuranceCardNumber})` : "",
                                        " ",
                                        "from ",
                                        effectiveSelectedPatient?.firstName,
                                        " ",
                                        effectiveSelectedPatient?.lastName,
                                        "?"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                    lineNumber: 1553,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/visit-creation-modal.tsx",
                            lineNumber: 1548,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogFooter"], {
                            className: "gap-2 mt-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    type: "button",
                                    variant: "outline",
                                    onClick: ()=>setInsuranceToDelete(null),
                                    disabled: isDeletingInsurance,
                                    className: "rounded-xl",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                    lineNumber: 1569,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    type: "button",
                                    variant: "destructive",
                                    onClick: ()=>insuranceToDelete && handleDeleteInsurance(insuranceToDelete),
                                    disabled: isDeletingInsurance,
                                    className: "rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-sm",
                                    children: isDeletingInsurance ? "Removing..." : "Remove Insurance"
                                }, void 0, false, {
                                    fileName: "[project]/components/visit-creation-modal.tsx",
                                    lineNumber: 1578,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/visit-creation-modal.tsx",
                            lineNumber: 1568,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/visit-creation-modal.tsx",
                    lineNumber: 1547,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/visit-creation-modal.tsx",
                lineNumber: 1543,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PatientEditModal, {
                isOpen: editPatientModal,
                onClose: ()=>{
                    setEditPatientModal(false);
                    setSelectedPatientForEdit(null);
                },
                patient: selectedPatientForEdit,
                onPatientUpdated: (updatedPatient)=>{
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Patient updated: ${updatedPatient.firstName} ${updatedPatient.lastName}`);
                    setEditPatientModal(false);
                    setSelectedPatientForEdit(null);
                    // Update selection to edited patient
                    setSelectedPatientId(updatedPatient.id.toString());
                    setSelectedPatient(updatedPatient);
                    setCurrentStep("visit-details");
                }
            }, void 0, false, {
                fileName: "[project]/components/visit-creation-modal.tsx",
                lineNumber: 1593,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(VisitCreationModal, "x1YgN2Q/PIDvv1sh3sl1MsXK+UI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$patients$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePatient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$patients$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePatient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$departments$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDepartments"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$insurances$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInsurances"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$visit$2d$mutations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCreateVisit"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$patients$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDeletePatientInsurance"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$patients$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePatients"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$patients$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePatient"]
    ];
});
_c3 = VisitCreationModal;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "PatientEditModal");
__turbopack_context__.k.register(_c1, "AddPatientInsuranceModal");
__turbopack_context__.k.register(_c2, "PatientCardSkeleton");
__turbopack_context__.k.register(_c3, "VisitCreationModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/visit-creation-modal.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/components/visit-creation-modal.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=_5274e244._.js.map