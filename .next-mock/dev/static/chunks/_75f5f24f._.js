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
"[project]/lib/location-data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "COUNTRIES",
    ()=>COUNTRIES,
    "RWANDA_PROVINCES",
    ()=>RWANDA_PROVINCES,
    "findRwandaCellInfo",
    ()=>findRwandaCellInfo,
    "findRwandaSectorInfo",
    ()=>findRwandaSectorInfo,
    "findRwandaVillageInfo",
    ()=>findRwandaVillageInfo,
    "getAllRwandaCells",
    ()=>getAllRwandaCells,
    "getAllRwandaDistricts",
    ()=>getAllRwandaDistricts,
    "getAllRwandaSectors",
    ()=>getAllRwandaSectors,
    "getAllRwandaVillages",
    ()=>getAllRwandaVillages,
    "getCellsForSelection",
    ()=>getCellsForSelection,
    "getDistrictsForSelection",
    ()=>getDistrictsForSelection,
    "getRwandaCells",
    ()=>getRwandaCells,
    "getRwandaDistricts",
    ()=>getRwandaDistricts,
    "getRwandaSectors",
    ()=>getRwandaSectors,
    "getRwandaVillages",
    ()=>getRwandaVillages,
    "getSectorsForSelection",
    ()=>getSectorsForSelection,
    "getVillagesForSelection",
    ()=>getVillagesForSelection,
    "isRwandaSelected",
    ()=>isRwandaSelected
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$devrw$2f$rwanda$2d$location$2f$dist$2f$db$2f$locations$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/node_modules/@devrw/rwanda-location/dist/db/locations.json (json)");
;
const COUNTRIES = [
    "Rwanda",
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Comoros",
    "Congo",
    "Costa Rica",
    "Côte d'Ivoire",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Democratic Republic of the Congo",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini",
    "Ethiopia",
    "Fiji",
    "Finland",
    "France",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Grenada",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Kosovo",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "North Korea",
    "North Macedonia",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestine",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Russia",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Korea",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Sweden",
    "Switzerland",
    "Syria",
    "Taiwan",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Vatican City",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe"
];
const RWANDA_PROVINCES = [
    "Kigali City",
    "Eastern Province",
    "Northern Province",
    "Southern Province",
    "Western Province"
];
const PROVINCE_MAP = {
    KIGALI: "Kigali City",
    EAST: "Eastern Province",
    NORTH: "Northern Province",
    SOUTH: "Southern Province",
    WEST: "Western Province",
    "Kigali City": "Kigali City",
    "Eastern Province": "Eastern Province",
    "Northern Province": "Northern Province",
    "Southern Province": "Southern Province",
    "Western Province": "Western Province"
};
function formatNameSpacing(str) {
    if (!str) return "";
    return str.replace(/([a-zA-Z]+?)(I{1,3}|Ii|Il|IV|V|VI{0,3})$/, (_m, p1, p2)=>{
        const roman = p2.toUpperCase().replace(/L/g, "I");
        return `${p1} ${roman}`;
    }).trim();
}
const normKey = (s)=>s?.toLowerCase().replace(/[\s\-_]/g, "") || "";
const hierarchy = new Map();
const allDistrictsList = [];
const allSectorsList = [];
const allCellsList = [];
const allVillagesList = [];
// Direct O(1) lookup maps by normalized name
const villageLookup = new Map();
const cellLookup = new Map();
const sectorLookup = new Map();
const districtLookup = new Map();
// Pre-computed cached selection arrays
const districtsByProvince = new Map();
const sectorsByProvince = new Map();
const sectorsByDistrict = new Map();
const sectorsByProvAndDist = new Map();
const cellsBySectorKey = new Map();
const villagesByCellKey = new Map();
let isInitialized = false;
function ensureInitialized() {
    if (isInitialized) return;
    isInitialized = true;
    // Initialize provinces
    for (const p of RWANDA_PROVINCES){
        hierarchy.set(p, {
            province: p,
            districts: new Map()
        });
    }
    // Process 14,842 official locations in a single pass
    for (const raw of __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$devrw$2f$rwanda$2d$location$2f$dist$2f$db$2f$locations$2e$json__$28$json$29$__["default"]){
        const province = PROVINCE_MAP[raw.province_name] || raw.province_name;
        const district = raw.district_name;
        const sector = raw.sector_name;
        const cell = formatNameSpacing(raw.cell_name);
        const village = formatNameSpacing(raw.village_name);
        let provObj = hierarchy.get(province);
        if (!provObj) {
            provObj = {
                province,
                districts: new Map()
            };
            hierarchy.set(province, provObj);
        }
        let distObj = provObj.districts.get(district);
        if (!distObj) {
            distObj = {
                district,
                province,
                sectors: new Map()
            };
            provObj.districts.set(district, distObj);
            const dOpt = {
                district,
                province
            };
            allDistrictsList.push(dOpt);
            // Add to district lookup
            const dKey = normKey(district);
            const existingD = districtLookup.get(dKey) || [];
            existingD.push(dOpt);
            districtLookup.set(dKey, existingD);
        }
        let sectObj = distObj.sectors.get(sector);
        if (!sectObj) {
            sectObj = {
                sector,
                district,
                province,
                cells: new Map()
            };
            distObj.sectors.set(sector, sectObj);
            const sOpt = {
                sector,
                district,
                province
            };
            allSectorsList.push(sOpt);
            // Add to sector lookup
            const sKey = normKey(sector);
            const existingS = sectorLookup.get(sKey) || [];
            existingS.push(sOpt);
            sectorLookup.set(sKey, existingS);
        }
        let cellObj = sectObj.cells.get(cell);
        if (!cellObj) {
            cellObj = {
                cell,
                sector,
                district,
                province,
                villages: []
            };
            sectObj.cells.set(cell, cellObj);
            const cOpt = {
                cell,
                sector,
                district,
                province
            };
            allCellsList.push(cOpt);
            // Add to cell lookup
            const cKey = normKey(cell);
            const existingC = cellLookup.get(cKey) || [];
            existingC.push(cOpt);
            cellLookup.set(cKey, existingC);
        }
        if (!cellObj.villages.includes(village)) {
            cellObj.villages.push(village);
            const vOpt = {
                village,
                cell,
                sector,
                district,
                province
            };
            allVillagesList.push(vOpt);
            // Add to village lookup
            const vKey = normKey(village);
            const existingV = villageLookup.get(vKey) || [];
            existingV.push(vOpt);
            villageLookup.set(vKey, existingV);
        }
    }
    // Sort all global lists once
    allDistrictsList.sort((a, b)=>a.district.localeCompare(b.district));
    allSectorsList.sort((a, b)=>a.sector.localeCompare(b.sector));
    allCellsList.sort((a, b)=>a.cell.localeCompare(b.cell));
    allVillagesList.sort((a, b)=>a.village.localeCompare(b.village));
    // Pre-build all hierarchical selection caches
    for (const [provName, provObj] of hierarchy.entries()){
        const pDistricts = [];
        const pSectors = [];
        for (const [distName, distObj] of provObj.districts.entries()){
            pDistricts.push({
                district: distName,
                province: provName
            });
            const dSectors = [];
            for (const [sectName, sectObj] of distObj.sectors.entries()){
                const sOpt = {
                    sector: sectName,
                    district: distName,
                    province: provName
                };
                dSectors.push(sOpt);
                pSectors.push(sOpt);
                const sCells = [];
                for (const [cellName, cellObj] of sectObj.cells.entries()){
                    const cOpt = {
                        cell: cellName,
                        sector: sectName,
                        district: distName,
                        province: provName
                    };
                    sCells.push(cOpt);
                    const cVillages = cellObj.villages.map((v)=>({
                            village: v,
                            cell: cellName,
                            sector: sectName,
                            district: distName,
                            province: provName
                        }));
                    cVillages.sort((a, b)=>a.village.localeCompare(b.village));
                    villagesByCellKey.set(`${provName}::${distName}::${sectName}::${cellName}`, cVillages);
                    villagesByCellKey.set(`*::*::${sectName}::${cellName}`, cVillages);
                    villagesByCellKey.set(`*::*::*::${cellName}`, cVillages);
                }
                sCells.sort((a, b)=>a.cell.localeCompare(b.cell));
                cellsBySectorKey.set(`${provName}::${distName}::${sectName}`, sCells);
                cellsBySectorKey.set(`*::${distName}::${sectName}`, sCells);
                cellsBySectorKey.set(`*::*::${sectName}`, sCells);
            }
            dSectors.sort((a, b)=>a.sector.localeCompare(b.sector));
            sectorsByDistrict.set(distName, dSectors);
            sectorsByProvAndDist.set(`${provName}::${distName}`, dSectors);
        }
        pDistricts.sort((a, b)=>a.district.localeCompare(b.district));
        pSectors.sort((a, b)=>a.sector.localeCompare(b.sector));
        districtsByProvince.set(provName, pDistricts);
        sectorsByProvince.set(provName, pSectors);
    }
}
function getRwandaDistricts(province) {
    ensureInitialized();
    if (!province) return allDistrictsList.map((d)=>d.district);
    const cached = districtsByProvince.get(province);
    return cached ? cached.map((d)=>d.district) : [];
}
function getRwandaSectors(province, district) {
    ensureInitialized();
    if (province && district) {
        const cached = sectorsByProvAndDist.get(`${province}::${district}`);
        return cached ? cached.map((s)=>s.sector) : [];
    }
    if (district) {
        const cached = sectorsByDistrict.get(district);
        return cached ? cached.map((s)=>s.sector) : [];
    }
    if (province) {
        const cached = sectorsByProvince.get(province);
        return cached ? cached.map((s)=>s.sector) : [];
    }
    return allSectorsList.map((s)=>s.sector);
}
function getRwandaCells(province, district, sector) {
    ensureInitialized();
    if (!sector) return [];
    if (province && district) {
        const cached = cellsBySectorKey.get(`${province}::${district}::${sector}`);
        if (cached) return cached.map((c)=>c.cell);
    }
    if (district) {
        const cached = cellsBySectorKey.get(`*::${district}::${sector}`);
        if (cached) return cached.map((c)=>c.cell);
    }
    const cached = cellsBySectorKey.get(`*::*::${sector}`);
    return cached ? cached.map((c)=>c.cell) : [];
}
function getRwandaVillages(province, district, sector, cell) {
    ensureInitialized();
    if (!cell) return [];
    if (province && district && sector) {
        const cached = villagesByCellKey.get(`${province}::${district}::${sector}::${cell}`);
        if (cached) return cached.map((v)=>v.village);
    }
    if (sector) {
        const cached = villagesByCellKey.get(`*::*::${sector}::${cell}`);
        if (cached) return cached.map((v)=>v.village);
    }
    const cached = villagesByCellKey.get(`*::*::*::${cell}`);
    return cached ? cached.map((v)=>v.village) : [];
}
function getAllRwandaDistricts() {
    ensureInitialized();
    return allDistrictsList;
}
function getAllRwandaSectors() {
    ensureInitialized();
    return allSectorsList;
}
function getAllRwandaCells() {
    ensureInitialized();
    return allCellsList;
}
function getAllRwandaVillages() {
    ensureInitialized();
    return allVillagesList;
}
function getDistrictsForSelection(province) {
    ensureInitialized();
    if (province) {
        return districtsByProvince.get(province) || allDistrictsList;
    }
    return allDistrictsList;
}
function getSectorsForSelection(province, district) {
    ensureInitialized();
    if (province && district) {
        return sectorsByProvAndDist.get(`${province}::${district}`) || allSectorsList;
    }
    if (district) {
        return sectorsByDistrict.get(district) || allSectorsList;
    }
    if (province) {
        return sectorsByProvince.get(province) || allSectorsList;
    }
    return allSectorsList;
}
function getCellsForSelection(province, district, sector) {
    ensureInitialized();
    if (province && district && sector) {
        const cached = cellsBySectorKey.get(`${province}::${district}::${sector}`);
        if (cached) return cached;
    }
    if (district && sector) {
        const cached = cellsBySectorKey.get(`*::${district}::${sector}`);
        if (cached) return cached;
    }
    if (sector) {
        const cached = cellsBySectorKey.get(`*::*::${sector}`);
        if (cached) return cached;
    }
    return allCellsList;
}
function getVillagesForSelection(province, district, sector, cell) {
    ensureInitialized();
    if (province && district && sector && cell) {
        const cached = villagesByCellKey.get(`${province}::${district}::${sector}::${cell}`);
        if (cached) return cached;
    }
    if (sector && cell) {
        const cached = villagesByCellKey.get(`*::*::${sector}::${cell}`);
        if (cached) return cached;
    }
    if (cell) {
        const cached = villagesByCellKey.get(`*::*::*::${cell}`);
        if (cached) return cached;
    }
    return allVillagesList;
}
function findRwandaVillageInfo(village, cell, sector, district, province) {
    ensureInitialized();
    const vKey = normKey(village);
    if (!vKey) return undefined;
    const matches = villageLookup.get(vKey);
    if (!matches || matches.length === 0) return undefined;
    if (matches.length === 1 && !cell && !sector && !district && !province) {
        return matches[0];
    }
    const cKey = normKey(cell);
    const sKey = normKey(sector);
    const dKey = normKey(district);
    const pKey = normKey(province);
    return matches.find((item)=>{
        if (cKey && normKey(item.cell) !== cKey) return false;
        if (sKey && normKey(item.sector) !== sKey) return false;
        if (dKey && normKey(item.district) !== dKey) return false;
        if (pKey && normKey(item.province) !== pKey) return false;
        return true;
    }) || matches[0];
}
function findRwandaCellInfo(cell, sector, district, province) {
    ensureInitialized();
    const cKey = normKey(cell);
    if (!cKey) return undefined;
    const matches = cellLookup.get(cKey);
    if (!matches || matches.length === 0) return undefined;
    if (matches.length === 1 && !sector && !district && !province) {
        return matches[0];
    }
    const sKey = normKey(sector);
    const dKey = normKey(district);
    const pKey = normKey(province);
    return matches.find((item)=>{
        if (sKey && normKey(item.sector) !== sKey) return false;
        if (dKey && normKey(item.district) !== dKey) return false;
        if (pKey && normKey(item.province) !== pKey) return false;
        return true;
    }) || matches[0];
}
function findRwandaSectorInfo(sector, district, province) {
    ensureInitialized();
    const sKey = normKey(sector);
    if (!sKey) return undefined;
    const matches = sectorLookup.get(sKey);
    if (!matches || matches.length === 0) return undefined;
    if (matches.length === 1 && !district && !province) {
        return matches[0];
    }
    const dKey = normKey(district);
    const pKey = normKey(province);
    return matches.find((item)=>{
        if (dKey && normKey(item.district) !== dKey) return false;
        if (pKey && normKey(item.province) !== pKey) return false;
        return true;
    }) || matches[0];
}
function isRwandaSelected(country) {
    return country?.toLowerCase() === "rwanda";
}
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
"[project]/components/ui/select.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Select",
    ()=>Select,
    "SelectContent",
    ()=>SelectContent,
    "SelectGroup",
    ()=>SelectGroup,
    "SelectItem",
    ()=>SelectItem,
    "SelectLabel",
    ()=>SelectLabel,
    "SelectScrollDownButton",
    ()=>SelectScrollDownButton,
    "SelectScrollUpButton",
    ()=>SelectScrollUpButton,
    "SelectSeparator",
    ()=>SelectSeparator,
    "SelectTrigger",
    ()=>SelectTrigger,
    "SelectValue",
    ()=>SelectValue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-select/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as CheckIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDownIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDownIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUpIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUpIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
'use client';
;
;
;
;
function Select({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "select",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 12,
        columnNumber: 10
    }, this);
}
_c = Select;
function SelectGroup({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"], {
        "data-slot": "select-group",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 18,
        columnNumber: 10
    }, this);
}
_c1 = SelectGroup;
function SelectValue({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Value"], {
        "data-slot": "select-value",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 24,
        columnNumber: 10
    }, this);
}
_c2 = SelectValue;
function SelectTrigger({ className, size = 'default', children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
        "data-slot": "select-trigger",
        "data-size": size,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("border-border/70 data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-background px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-10 data-[size=sm]:h-9 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className),
        ...props,
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                asChild: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDownIcon$3e$__["ChevronDownIcon"], {
                    className: "size-4 opacity-50"
                }, void 0, false, {
                    fileName: "[project]/components/ui/select.tsx",
                    lineNumber: 47,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ui/select.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
_c3 = SelectTrigger;
function SelectContent({ className, children, position = 'popper', ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
            "data-slot": "select-content",
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-[150] max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border border-border/70 shadow-md', position === 'popper' && 'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1', className),
            position: position,
            ...props,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SelectScrollUpButton, {}, void 0, false, {
                    fileName: "[project]/components/ui/select.tsx",
                    lineNumber: 72,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Viewport"], {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('p-1', position === 'popper' && 'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1'),
                    children: children
                }, void 0, false, {
                    fileName: "[project]/components/ui/select.tsx",
                    lineNumber: 73,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SelectScrollDownButton, {}, void 0, false, {
                    fileName: "[project]/components/ui/select.tsx",
                    lineNumber: 82,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/ui/select.tsx",
            lineNumber: 61,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 60,
        columnNumber: 5
    }, this);
}
_c4 = SelectContent;
function SelectLabel({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
        "data-slot": "select-label",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-muted-foreground px-2 py-1.5 text-xs', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 93,
        columnNumber: 5
    }, this);
}
_c5 = SelectLabel;
function SelectItem({ className, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"], {
        "data-slot": "select-item",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2", className),
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "absolute right-2 flex size-3.5 items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemIndicator"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckIcon$3e$__["CheckIcon"], {
                        className: "size-4"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/select.tsx",
                        lineNumber: 117,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/ui/select.tsx",
                    lineNumber: 116,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ui/select.tsx",
                lineNumber: 115,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemText"], {
                children: children
            }, void 0, false, {
                fileName: "[project]/components/ui/select.tsx",
                lineNumber: 120,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 107,
        columnNumber: 5
    }, this);
}
_c6 = SelectItem;
function SelectSeparator({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
        "data-slot": "select-separator",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('bg-border pointer-events-none -mx-1 my-1 h-px', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 130,
        columnNumber: 5
    }, this);
}
_c7 = SelectSeparator;
function SelectScrollUpButton({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollUpButton"], {
        "data-slot": "select-scroll-up-button",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex cursor-default items-center justify-center py-1', className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUpIcon$3e$__["ChevronUpIcon"], {
            className: "size-4"
        }, void 0, false, {
            fileName: "[project]/components/ui/select.tsx",
            lineNumber: 151,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 143,
        columnNumber: 5
    }, this);
}
_c8 = SelectScrollUpButton;
function SelectScrollDownButton({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollDownButton"], {
        "data-slot": "select-scroll-down-button",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex cursor-default items-center justify-center py-1', className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDownIcon$3e$__["ChevronDownIcon"], {
            className: "size-4"
        }, void 0, false, {
            fileName: "[project]/components/ui/select.tsx",
            lineNumber: 169,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 161,
        columnNumber: 5
    }, this);
}
_c9 = SelectScrollDownButton;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9;
__turbopack_context__.k.register(_c, "Select");
__turbopack_context__.k.register(_c1, "SelectGroup");
__turbopack_context__.k.register(_c2, "SelectValue");
__turbopack_context__.k.register(_c3, "SelectTrigger");
__turbopack_context__.k.register(_c4, "SelectContent");
__turbopack_context__.k.register(_c5, "SelectLabel");
__turbopack_context__.k.register(_c6, "SelectItem");
__turbopack_context__.k.register(_c7, "SelectSeparator");
__turbopack_context__.k.register(_c8, "SelectScrollUpButton");
__turbopack_context__.k.register(_c9, "SelectScrollDownButton");
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
"[project]/components/ui/date-picker-grid.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DatePickerGrid",
    ()=>DatePickerGrid
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/popover.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const ALL_DAYS = Array.from({
    length: 31
}, (_, i)=>String(i + 1).padStart(2, "0"));
const MONTHS = [
    {
        value: "01",
        label: "Jan",
        full: "January"
    },
    {
        value: "02",
        label: "Feb",
        full: "February"
    },
    {
        value: "03",
        label: "Mar",
        full: "March"
    },
    {
        value: "04",
        label: "Apr",
        full: "April"
    },
    {
        value: "05",
        label: "May",
        full: "May"
    },
    {
        value: "06",
        label: "Jun",
        full: "June"
    },
    {
        value: "07",
        label: "Jul",
        full: "July"
    },
    {
        value: "08",
        label: "Aug",
        full: "August"
    },
    {
        value: "09",
        label: "Sep",
        full: "September"
    },
    {
        value: "10",
        label: "Oct",
        full: "October"
    },
    {
        value: "11",
        label: "Nov",
        full: "November"
    },
    {
        value: "12",
        label: "Dec",
        full: "December"
    }
];
const MONTHS_31 = new Set([
    "01",
    "03",
    "05",
    "07",
    "08",
    "10",
    "12"
]);
const MONTHS_30 = new Set([
    "04",
    "06",
    "09",
    "11"
]);
function isLeapYear(y) {
    return y % 4 === 0 && y % 100 !== 0 || y % 400 === 0;
}
function daysInMonth(monthNum, yearNum) {
    return new Date(yearNum, monthNum, 0).getDate();
}
function DatePickerGrid({ value = "", onChange, className }) {
    _s();
    const parsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DatePickerGrid.useMemo[parsed]": ()=>{
            if (!value) return {
                day: "",
                month: "",
                year: ""
            };
            const parts = value.split("-");
            if (parts.length !== 3) return {
                day: "",
                month: "",
                year: ""
            };
            return {
                year: parts[0],
                month: parts[1],
                day: parts[2]
            };
        }
    }["DatePickerGrid.useMemo[parsed]"], [
        value
    ]);
    const [day, setDay] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(parsed.day);
    const [month, setMonth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(parsed.month);
    const [year, setYear] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(parsed.year);
    const [dayOpen, setDayOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [monthOpen, setMonthOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [yearOpen, setYearOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const yearListRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [yearSearch, setYearSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const yearSearchRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Sync state if external value changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DatePickerGrid.useEffect": ()=>{
            setDay(parsed.day);
            setMonth(parsed.month);
            setYear(parsed.year);
        }
    }["DatePickerGrid.useEffect"], [
        parsed.day,
        parsed.month,
        parsed.year
    ]);
    const currentYear = new Date().getFullYear();
    // Generate full list of years from current year down to 1900
    const allYears = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DatePickerGrid.useMemo[allYears]": ()=>{
            const list = [];
            for(let y = currentYear; y >= 1900; y--){
                list.push(String(y));
            }
            return list;
        }
    }["DatePickerGrid.useMemo[allYears]"], [
        currentYear
    ]);
    const validMonths = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DatePickerGrid.useMemo[validMonths]": ()=>{
            if (!day) return MONTHS.map({
                "DatePickerGrid.useMemo[validMonths]": (m)=>m.value
            }["DatePickerGrid.useMemo[validMonths]"]);
            const d = Number.parseInt(day, 10);
            if (d === 31) return Array.from(MONTHS_31);
            if (d === 30) return Array.from(new Set([
                ...MONTHS_31,
                ...MONTHS_30
            ]));
            return MONTHS.map({
                "DatePickerGrid.useMemo[validMonths]": (m)=>m.value
            }["DatePickerGrid.useMemo[validMonths]"]);
        }
    }["DatePickerGrid.useMemo[validMonths]"], [
        day
    ]);
    const validDays = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DatePickerGrid.useMemo[validDays]": ()=>{
            if (!month) return ALL_DAYS;
            const m = Number.parseInt(month, 10);
            const y = year ? Number.parseInt(year, 10) : currentYear;
            const max = daysInMonth(m, y);
            return ALL_DAYS.filter({
                "DatePickerGrid.useMemo[validDays]": (d)=>Number.parseInt(d, 10) <= max
            }["DatePickerGrid.useMemo[validDays]"]);
        }
    }["DatePickerGrid.useMemo[validDays]"], [
        month,
        year,
        currentYear
    ]);
    const validYears = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DatePickerGrid.useMemo[validYears]": ()=>{
            if (!day || !month) return allYears;
            const d = Number.parseInt(day, 10);
            const m = Number.parseInt(month, 10);
            if (m !== 2) return allYears;
            if (d <= 28) return allYears;
            return allYears.filter({
                "DatePickerGrid.useMemo[validYears]": (y)=>isLeapYear(Number.parseInt(y, 10))
            }["DatePickerGrid.useMemo[validYears]"]);
        }
    }["DatePickerGrid.useMemo[validYears]"], [
        day,
        month,
        allYears
    ]);
    // Years filtered by the typed search query (digits only)
    const displayYears = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DatePickerGrid.useMemo[displayYears]": ()=>{
            const q = yearSearch.trim();
            if (!q) return allYears;
            return allYears.filter({
                "DatePickerGrid.useMemo[displayYears]": (y)=>y.includes(q)
            }["DatePickerGrid.useMemo[displayYears]"]);
        }
    }["DatePickerGrid.useMemo[displayYears]"], [
        allYears,
        yearSearch
    ]);
    const commitDate = (d, m, y)=>{
        if (d && m && y) {
            onChange?.(`${y}-${m}-${d}`);
        } else {
            onChange?.("");
        }
    };
    const handleDaySelect = (d)=>{
        const nextDay = d;
        const nextMonth = validMonths.includes(month) ? month : "";
        const nextYear = nextMonth && validYears.includes(year) ? year : "";
        setDay(nextDay);
        setMonth(nextMonth);
        setYear(nextYear);
        commitDate(nextDay, nextMonth, nextYear);
        setDayOpen(false);
        // Flow forward to month if not yet chosen
        if (!nextMonth) {
            setTimeout(()=>setMonthOpen(true), 120);
        } else if (!nextYear) {
            setTimeout(()=>setYearOpen(true), 120);
        }
    };
    const handleMonthSelect = (m)=>{
        const nextMonth = m;
        const nextDay = validDays.includes(day) ? day : "";
        const nextYear = nextMonth && validYears.includes(year) && (nextMonth !== "02" || !nextDay || Number.parseInt(nextDay, 10) <= 28 || isLeapYear(Number.parseInt(year, 10))) ? year : "";
        setMonth(nextMonth);
        setDay(nextDay);
        setYear(nextYear);
        commitDate(nextDay, nextMonth, nextYear);
        setMonthOpen(false);
        // Flow forward to year if not yet chosen
        if (!nextYear) {
            setTimeout(()=>setYearOpen(true), 120);
        }
    };
    const handleYearSelect = (y)=>{
        const nextYear = y;
        const nextMonth = validMonths.includes(month) ? month : "";
        const nextDay = nextMonth ? validDays.includes(day) ? day : "" : "";
        setYear(nextYear);
        setMonth(nextMonth);
        setDay(nextDay);
        commitDate(nextDay, nextMonth, nextYear);
        setYearOpen(false);
        setYearSearch("");
    };
    // Enter picks the first enabled match, like the location search
    const handleYearSearchKeyDown = (e)=>{
        if (e.key === "Enter") {
            e.preventDefault();
            const match = displayYears.find((y)=>validYears.includes(y));
            if (match) handleYearSelect(match);
        }
    };
    // Auto-scroll selected year into view when year dropdown opens;
    // also reset & focus the search box so typing filters immediately
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DatePickerGrid.useEffect": ()=>{
            if (yearOpen && yearListRef.current) {
                const selectedEl = yearListRef.current.querySelector("[data-selected='true']");
                if (selectedEl) {
                    selectedEl.scrollIntoView({
                        block: "center"
                    });
                }
                setYearSearch("");
                requestAnimationFrame({
                    "DatePickerGrid.useEffect": ()=>yearSearchRef.current?.focus()
                }["DatePickerGrid.useEffect"]);
            }
        }
    }["DatePickerGrid.useEffect"], [
        yearOpen
    ]);
    const triggerBaseClass = "h-10 w-full rounded-xl border border-border/70 bg-background dark:bg-gray-900 px-3 py-2 text-xs sm:text-sm font-medium transition-all hover:bg-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/40 flex items-center justify-between cursor-pointer";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("grid grid-cols-3 gap-2", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Popover"], {
                open: dayOpen,
                onOpenChange: setDayOpen,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PopoverTrigger"], {
                        asChild: true,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(triggerBaseClass, day ? "text-foreground font-semibold" : "text-muted-foreground", dayOpen && "ring-2 ring-primary/40 border-primary"),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: day ? day.padStart(2, "0") : "Day"
                                }, void 0, false, {
                                    fileName: "[project]/components/ui/date-picker-grid.tsx",
                                    lineNumber: 215,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                    className: "h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-70"
                                }, void 0, false, {
                                    fileName: "[project]/components/ui/date-picker-grid.tsx",
                                    lineNumber: 216,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ui/date-picker-grid.tsx",
                            lineNumber: 207,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ui/date-picker-grid.tsx",
                        lineNumber: 206,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PopoverContent"], {
                        align: "start",
                        sideOffset: 6,
                        className: "w-[240px] p-2.5 rounded-2xl shadow-2xl border border-border/80 bg-white dark:bg-slate-900 text-foreground z-[160] opacity-100 backdrop-blur-none",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between pb-2 mb-2 border-b border-border/40 px-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-semibold text-foreground",
                                        children: "Select Day"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ui/date-picker-grid.tsx",
                                        lineNumber: 225,
                                        columnNumber: 13
                                    }, this),
                                    day && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>{
                                            setDay("");
                                            commitDate("", month, year);
                                        },
                                        className: "text-[12px] text-muted-foreground hover:text-foreground flex items-center gap-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                className: "w-3 h-3"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ui/date-picker-grid.tsx",
                                                lineNumber: 235,
                                                columnNumber: 17
                                            }, this),
                                            "Clear"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ui/date-picker-grid.tsx",
                                        lineNumber: 227,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ui/date-picker-grid.tsx",
                                lineNumber: 224,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-7 gap-1",
                                children: ALL_DAYS.map((d)=>{
                                    const disabled = !validDays.includes(d);
                                    const isSelected = day === d;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        disabled: disabled,
                                        onClick: ()=>handleDaySelect(d),
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-8 rounded-lg text-xs font-medium transition-all flex items-center justify-center cursor-pointer", isSelected ? "bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] text-white shadow-xs font-bold scale-105" : disabled ? "text-muted-foreground/30 cursor-not-allowed bg-muted/20" : "bg-muted/40 hover:bg-muted text-foreground hover:scale-105"),
                                        children: d
                                    }, d, false, {
                                        fileName: "[project]/components/ui/date-picker-grid.tsx",
                                        lineNumber: 245,
                                        columnNumber: 17
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/components/ui/date-picker-grid.tsx",
                                lineNumber: 240,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ui/date-picker-grid.tsx",
                        lineNumber: 219,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/date-picker-grid.tsx",
                lineNumber: 205,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Popover"], {
                open: monthOpen,
                onOpenChange: setMonthOpen,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PopoverTrigger"], {
                        asChild: true,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(triggerBaseClass, month ? "text-foreground font-semibold" : "text-muted-foreground", monthOpen && "ring-2 ring-primary/40 border-primary"),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: month ? MONTHS.find((m)=>m.value === month)?.label || month : "Month"
                                }, void 0, false, {
                                    fileName: "[project]/components/ui/date-picker-grid.tsx",
                                    lineNumber: 278,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                    className: "h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-70"
                                }, void 0, false, {
                                    fileName: "[project]/components/ui/date-picker-grid.tsx",
                                    lineNumber: 283,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ui/date-picker-grid.tsx",
                            lineNumber: 270,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ui/date-picker-grid.tsx",
                        lineNumber: 269,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PopoverContent"], {
                        align: "center",
                        sideOffset: 6,
                        className: "w-[230px] p-2.5 rounded-2xl shadow-2xl border border-border/80 bg-white dark:bg-slate-900 text-foreground z-[160] opacity-100 backdrop-blur-none",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between pb-2 mb-2 border-b border-border/40 px-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-semibold text-foreground",
                                        children: "Select Month"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ui/date-picker-grid.tsx",
                                        lineNumber: 292,
                                        columnNumber: 13
                                    }, this),
                                    month && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>{
                                            setMonth("");
                                            commitDate(day, "", year);
                                        },
                                        className: "text-[12px] text-muted-foreground hover:text-foreground flex items-center gap-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                className: "w-3 h-3"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ui/date-picker-grid.tsx",
                                                lineNumber: 302,
                                                columnNumber: 17
                                            }, this),
                                            "Clear"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ui/date-picker-grid.tsx",
                                        lineNumber: 294,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ui/date-picker-grid.tsx",
                                lineNumber: 291,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-3 gap-1.5",
                                children: MONTHS.map((m)=>{
                                    const disabled = !validMonths.includes(m.value);
                                    const isSelected = month === m.value;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        disabled: disabled,
                                        onClick: ()=>handleMonthSelect(m.value),
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("py-2 px-1 rounded-lg text-xs font-medium transition-all text-center cursor-pointer", isSelected ? "bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] text-white shadow-xs font-bold scale-105" : disabled ? "text-muted-foreground/30 cursor-not-allowed bg-muted/20" : "bg-muted/40 hover:bg-muted text-foreground hover:scale-105"),
                                        children: m.label
                                    }, m.value, false, {
                                        fileName: "[project]/components/ui/date-picker-grid.tsx",
                                        lineNumber: 312,
                                        columnNumber: 17
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/components/ui/date-picker-grid.tsx",
                                lineNumber: 307,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ui/date-picker-grid.tsx",
                        lineNumber: 286,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/date-picker-grid.tsx",
                lineNumber: 268,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Popover"], {
                open: yearOpen,
                onOpenChange: (open)=>{
                    setYearOpen(open);
                    if (!open) setYearSearch("");
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PopoverTrigger"], {
                        asChild: true,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(triggerBaseClass, year ? "text-foreground font-semibold" : "text-muted-foreground", yearOpen && "ring-2 ring-primary/40 border-primary"),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: year || "Year"
                                }, void 0, false, {
                                    fileName: "[project]/components/ui/date-picker-grid.tsx",
                                    lineNumber: 351,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                    className: "h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-70"
                                }, void 0, false, {
                                    fileName: "[project]/components/ui/date-picker-grid.tsx",
                                    lineNumber: 352,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ui/date-picker-grid.tsx",
                            lineNumber: 343,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ui/date-picker-grid.tsx",
                        lineNumber: 342,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PopoverContent"], {
                        align: "end",
                        sideOffset: 6,
                        className: "w-[240px] p-2.5 rounded-2xl shadow-2xl border border-border/80 bg-white dark:bg-slate-900 text-foreground z-[160] opacity-100 backdrop-blur-none",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between pb-2 mb-2 border-b border-border/40 px-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-semibold text-foreground",
                                        children: "Select Year"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ui/date-picker-grid.tsx",
                                        lineNumber: 361,
                                        columnNumber: 13
                                    }, this),
                                    year && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>{
                                            setYear("");
                                            commitDate(day, month, "");
                                        },
                                        className: "text-[12px] text-muted-foreground hover:text-foreground flex items-center gap-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                className: "w-3 h-3"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ui/date-picker-grid.tsx",
                                                lineNumber: 371,
                                                columnNumber: 17
                                            }, this),
                                            "Clear"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ui/date-picker-grid.tsx",
                                        lineNumber: 363,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ui/date-picker-grid.tsx",
                                lineNumber: 360,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-2 flex items-center gap-2 border-b border-border/40 px-1 pb-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                        className: "h-3.5 w-3.5 shrink-0 text-muted-foreground"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ui/date-picker-grid.tsx",
                                        lineNumber: 378,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        ref: yearSearchRef,
                                        type: "text",
                                        inputMode: "numeric",
                                        value: yearSearch,
                                        onChange: (e)=>setYearSearch(e.target.value.replace(/\D/g, "")),
                                        onKeyDown: handleYearSearchKeyDown,
                                        placeholder: "Type to search year...",
                                        "aria-label": "Search year",
                                        className: "w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ui/date-picker-grid.tsx",
                                        lineNumber: 379,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ui/date-picker-grid.tsx",
                                lineNumber: 377,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                ref: yearListRef,
                                className: "grid grid-cols-3 gap-1.5 max-h-[210px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-muted-foreground/20",
                                children: [
                                    displayYears.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "col-span-3 py-6 text-center text-xs text-muted-foreground",
                                        children: "No year found."
                                    }, void 0, false, {
                                        fileName: "[project]/components/ui/date-picker-grid.tsx",
                                        lineNumber: 397,
                                        columnNumber: 15
                                    }, this),
                                    displayYears.map((y)=>{
                                        const disabled = !validYears.includes(y);
                                        const isSelected = year === y;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            "data-selected": isSelected,
                                            disabled: disabled,
                                            onClick: ()=>handleYearSelect(y),
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("py-2 px-1 rounded-lg text-xs font-medium transition-all text-center cursor-pointer", isSelected ? "bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] text-white shadow-xs font-bold scale-105" : disabled ? "text-muted-foreground/30 cursor-not-allowed bg-muted/20" : "bg-muted/40 hover:bg-muted text-foreground hover:scale-105"),
                                            children: y
                                        }, y, false, {
                                            fileName: "[project]/components/ui/date-picker-grid.tsx",
                                            lineNumber: 405,
                                            columnNumber: 17
                                        }, this);
                                    })
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ui/date-picker-grid.tsx",
                                lineNumber: 392,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ui/date-picker-grid.tsx",
                        lineNumber: 355,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/date-picker-grid.tsx",
                lineNumber: 335,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/date-picker-grid.tsx",
        lineNumber: 203,
        columnNumber: 5
    }, this);
}
_s(DatePickerGrid, "ksb0RALyjw4a2aR+jsZ6b1OAijg=");
_c = DatePickerGrid;
var _c;
__turbopack_context__.k.register(_c, "DatePickerGrid");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/patient/patient-form-fields.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PatientFormFields
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/checkbox.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/select.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/popover.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/command.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2d$error$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/field-error.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsUpDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevrons-up-down.js [app-client] (ecmascript) <export default as ChevronsUpDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/validation-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$date$2d$picker$2d$grid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/date-picker-grid.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$location$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/location-data.ts [app-client] (ecmascript)");
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
function PatientFormFields({ formData, onFieldChange, onCountryChange, onProvinceChange, onDistrictChange, onSectorChange, onCellChange, onVillageChange, onUpdateInsurance, onRemoveInsurance, availableInsurances, dateError, fieldErrors = {}, onFieldBlur }) {
    _s();
    const [insurancePopoverOpen, setInsurancePopoverOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [countryPopoverOpen, setCountryPopoverOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [provincePopoverOpen, setProvincePopoverOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [districtPopoverOpen, setDistrictPopoverOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [sectorPopoverOpen, setSectorPopoverOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [cellPopoverOpen, setCellPopoverOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [villagePopoverOpen, setVillagePopoverOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Emergency contact stays behind a small button (desktop density); it opens
    // automatically when editing a patient that already has one.
    const [emergencyOpen, setEmergencyOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [countrySearch, setCountrySearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [provinceSearch, setProvinceSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [districtSearch, setDistrictSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [sectorSearch, setSectorSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [cellSearch, setCellSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [villageSearch, setVillageSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const prov = formData.contactInfo?.address?.province;
    const dist = formData.contactInfo?.address?.district;
    const sect = formData.contactInfo?.address?.sector;
    const cell = formData.contactInfo?.address?.cell;
    const rawDistricts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PatientFormFields.useMemo[rawDistricts]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$location$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDistrictsForSelection"])(prov)
    }["PatientFormFields.useMemo[rawDistricts]"], [
        prov
    ]);
    const rawSectors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PatientFormFields.useMemo[rawSectors]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$location$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSectorsForSelection"])(prov, dist)
    }["PatientFormFields.useMemo[rawSectors]"], [
        prov,
        dist
    ]);
    const rawCells = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PatientFormFields.useMemo[rawCells]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$location$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCellsForSelection"])(prov, dist, sect)
    }["PatientFormFields.useMemo[rawCells]"], [
        prov,
        dist,
        sect
    ]);
    const rawVillages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PatientFormFields.useMemo[rawVillages]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$location$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getVillagesForSelection"])(prov, dist, sect, cell)
    }["PatientFormFields.useMemo[rawVillages]"], [
        prov,
        dist,
        sect,
        cell
    ]);
    const filteredCountries = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PatientFormFields.useMemo[filteredCountries]": ()=>{
            const q = countrySearch.trim().toLowerCase();
            if (!q) return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$location$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COUNTRIES"].slice(0, 50);
            return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$location$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COUNTRIES"].filter({
                "PatientFormFields.useMemo[filteredCountries]": (c)=>c.toLowerCase().includes(q)
            }["PatientFormFields.useMemo[filteredCountries]"]).slice(0, 50);
        }
    }["PatientFormFields.useMemo[filteredCountries]"], [
        countrySearch
    ]);
    const filteredProvinces = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PatientFormFields.useMemo[filteredProvinces]": ()=>{
            const q = provinceSearch.trim().toLowerCase();
            if (!q) return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$location$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RWANDA_PROVINCES"];
            return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$location$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RWANDA_PROVINCES"].filter({
                "PatientFormFields.useMemo[filteredProvinces]": (p)=>p.toLowerCase().includes(q)
            }["PatientFormFields.useMemo[filteredProvinces]"]);
        }
    }["PatientFormFields.useMemo[filteredProvinces]"], [
        provinceSearch
    ]);
    const filteredDistricts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PatientFormFields.useMemo[filteredDistricts]": ()=>{
            const q = districtSearch.trim().toLowerCase();
            if (!q) return rawDistricts.slice(0, 50);
            return rawDistricts.filter({
                "PatientFormFields.useMemo[filteredDistricts]": (item)=>item.district.toLowerCase().includes(q) || item.province.toLowerCase().includes(q)
            }["PatientFormFields.useMemo[filteredDistricts]"]).slice(0, 50);
        }
    }["PatientFormFields.useMemo[filteredDistricts]"], [
        rawDistricts,
        districtSearch
    ]);
    const filteredSectors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PatientFormFields.useMemo[filteredSectors]": ()=>{
            const q = sectorSearch.trim().toLowerCase();
            if (!q) return rawSectors.slice(0, 50);
            return rawSectors.filter({
                "PatientFormFields.useMemo[filteredSectors]": (item)=>item.sector.toLowerCase().includes(q) || item.district.toLowerCase().includes(q) || item.province.toLowerCase().includes(q)
            }["PatientFormFields.useMemo[filteredSectors]"]).slice(0, 50);
        }
    }["PatientFormFields.useMemo[filteredSectors]"], [
        rawSectors,
        sectorSearch
    ]);
    const filteredCells = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PatientFormFields.useMemo[filteredCells]": ()=>{
            const q = cellSearch.trim().toLowerCase();
            if (!q) return rawCells.slice(0, 50);
            return rawCells.filter({
                "PatientFormFields.useMemo[filteredCells]": (item)=>item.cell.toLowerCase().includes(q) || item.sector.toLowerCase().includes(q) || item.district.toLowerCase().includes(q)
            }["PatientFormFields.useMemo[filteredCells]"]).slice(0, 50);
        }
    }["PatientFormFields.useMemo[filteredCells]"], [
        rawCells,
        cellSearch
    ]);
    const filteredVillages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PatientFormFields.useMemo[filteredVillages]": ()=>{
            const q = villageSearch.trim().toLowerCase();
            if (!q) return rawVillages.slice(0, 50);
            return rawVillages.filter({
                "PatientFormFields.useMemo[filteredVillages]": (item)=>item.village.toLowerCase().includes(q) || item.cell.toLowerCase().includes(q) || item.sector.toLowerCase().includes(q)
            }["PatientFormFields.useMemo[filteredVillages]"]).slice(0, 50);
        }
    }["PatientFormFields.useMemo[filteredVillages]"], [
        rawVillages,
        villageSearch
    ]);
    const solidFieldClass = "w-full bg-white dark:bg-gray-900 border-border/70";
    const solidPanelClass = "rounded-2xl border border-border/60 bg-white dark:bg-slate-950 shadow-sm";
    const fieldValue = (value)=>value ?? "";
    const getInsuranceName = (insuranceId)=>{
        if (!insuranceId || String(insuranceId) === "0") return "Select insurance...";
        const insurance = availableInsurances.find((ins)=>String(ins.id) === String(insuranceId));
        return insurance ? `${insurance.acronym || insurance.insuranceName || insurance.name || 'Insurance'}` : 'Select insurance...';
    };
    const dobValidation = formData.dateOfBirth ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateDateOfBirth"])(formData.dateOfBirth) : null;
    const canAddInsurance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canAddNewInsurance"])(formData.insurances, formData.dateOfBirth);
    const hasInsurances = Boolean(formData.insurances?.length);
    const hasEmergencyData = Boolean(formData.emergencyContact?.name?.trim() || formData.emergencyContact?.relation?.trim() || formData.emergencyContact?.phone?.trim());
    const showEmergency = emergencyOpen || hasEmergencyData;
    const nidInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseRwandaNationalId"])(formData.nationalIdNumber);
    const nidMismatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["checkRwandaNationalIdMismatch"])(formData.nationalIdNumber, formData.gender, formData.dateOfBirth);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "@container flex flex-col gap-2 sm:gap-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `${solidPanelClass} grid grid-cols-1 gap-2 p-2 sm:gap-3 sm:p-3 @md:grid-cols-2 @3xl:grid-cols-4`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "@md:col-span-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-1.5",
                                children: "Full Name *"
                            }, void 0, false, {
                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                lineNumber: 212,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                type: "text",
                                value: fieldValue(formData.name ?? [
                                    formData.firstName,
                                    formData.middleName,
                                    formData.lastName
                                ].filter(Boolean).join(" ")),
                                onChange: (e)=>onFieldChange("name", e.target.value),
                                onBlur: ()=>onFieldBlur?.("name", formData.name || formData.firstName || ""),
                                placeholder: "Enter full name (e.g. Jean Paul Habimana)",
                                className: `${solidFieldClass} rounded-xl focus:ring-primary/50 ${fieldErrors["name"] || fieldErrors["firstName"] ? "border-red-500" : ""}`,
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                lineNumber: 215,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2d$error$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FieldError"], {
                                message: fieldErrors["name"] || fieldErrors["firstName"]
                            }, void 0, false, {
                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                lineNumber: 224,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                        lineNumber: 211,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-1.5",
                                children: "Date of Birth *"
                            }, void 0, false, {
                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                lineNumber: 227,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$date$2d$picker$2d$grid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DatePickerGrid"], {
                                value: formData.dateOfBirth,
                                onChange: (date)=>onFieldChange("dateOfBirth", date)
                            }, formData.dateOfBirth || "empty", false, {
                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                lineNumber: 230,
                                columnNumber: 11
                            }, this),
                            formData.dateOfBirth && dobValidation?.valid && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-muted-foreground mt-1",
                                children: [
                                    "Age: ",
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateAge"])(formData.dateOfBirth),
                                    " years"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                lineNumber: 236,
                                columnNumber: 13
                            }, this),
                            dateError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-destructive mt-1",
                                children: dateError
                            }, void 0, false, {
                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                lineNumber: 241,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                        lineNumber: 226,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-1.5",
                                children: "Gender"
                            }, void 0, false, {
                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                lineNumber: 245,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 gap-2 sm:gap-3 rounded-xl border border-border/70 bg-background dark:bg-gray-900 p-2 sm:p-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium text-foreground cursor-pointer",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                                                checked: formData.gender === "M",
                                                onCheckedChange: (checked)=>onFieldChange("gender", checked ? "M" : "")
                                            }, void 0, false, {
                                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                lineNumber: 250,
                                                columnNumber: 15
                                            }, this),
                                            "Male"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                                        lineNumber: 249,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium text-foreground cursor-pointer",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                                                checked: formData.gender === "F",
                                                onCheckedChange: (checked)=>onFieldChange("gender", checked ? "F" : "")
                                            }, void 0, false, {
                                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                lineNumber: 259,
                                                columnNumber: 15
                                            }, this),
                                            "Female"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                                        lineNumber: 258,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                lineNumber: 248,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2d$error$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FieldError"], {
                                message: fieldErrors["gender"]
                            }, void 0, false, {
                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                lineNumber: 268,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                        lineNumber: 244,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "@3xl:col-span-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between gap-1 mb-1 sm:mb-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-xs sm:text-sm font-medium text-foreground",
                                        children: "National ID / Passport Number"
                                    }, void 0, false, {
                                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                                        lineNumber: 272,
                                        columnNumber: 13
                                    }, this),
                                    nidInfo.valid && !nidMismatch.hasMismatch && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[11px] sm:text-[12px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full",
                                        children: [
                                            "🇷🇼 NID: ",
                                            nidInfo.genderLabel,
                                            ", ",
                                            nidInfo.yearOfBirth
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                                        lineNumber: 276,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                lineNumber: 271,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                type: "text",
                                value: fieldValue(formData.nationalIdNumber),
                                onChange: (e)=>onFieldChange("nationalIdNumber", e.target.value),
                                onBlur: ()=>onFieldBlur?.("nationalIdNumber", formData.nationalIdNumber || ""),
                                placeholder: "Enter 16-digit national ID or passport",
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(solidFieldClass, nidMismatch.hasMismatch && "border-amber-500/80 focus-visible:ring-amber-500/30")
                            }, void 0, false, {
                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                lineNumber: 281,
                                columnNumber: 11
                            }, this),
                            nidMismatch.hasMismatch && nidMismatch.warning && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[12px] text-amber-600 dark:text-amber-400 font-medium mt-1 flex items-center gap-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "⚠️"
                                    }, void 0, false, {
                                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                                        lineNumber: 294,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: nidMismatch.warning
                                    }, void 0, false, {
                                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                                        lineNumber: 295,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                lineNumber: 293,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                        lineNumber: 270,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "@3xl:col-span-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-1.5",
                                children: "Phone Number"
                            }, void 0, false, {
                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                lineNumber: 300,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                type: "tel",
                                value: fieldValue(formData.contactInfo?.phone),
                                onChange: (e)=>onFieldChange("contactInfo.phone", (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sanitizePhoneInput"])(e.target.value)),
                                onBlur: ()=>onFieldBlur?.("contactInfo.phone", formData.contactInfo?.phone || ""),
                                placeholder: "e.g. 0788 123 456 or +250 788 123 456",
                                className: solidFieldClass
                            }, void 0, false, {
                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                lineNumber: 303,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                        lineNumber: 299,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/patient/patient-form-fields.tsx",
                lineNumber: 208,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `${solidPanelClass} border-t p-2 sm:p-3`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "mb-1 text-sm font-medium text-foreground sm:mb-2",
                        children: "Address"
                    }, void 0, false, {
                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                        lineNumber: 320,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 gap-2 @md:grid-cols-2 @2xl:grid-cols-3 @3xl:grid-cols-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-1.5",
                                        children: "Country"
                                    }, void 0, false, {
                                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                                        lineNumber: 326,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Popover"], {
                                        open: countryPopoverOpen,
                                        onOpenChange: (open)=>{
                                            setCountryPopoverOpen(open);
                                            if (!open) setCountrySearch("");
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PopoverTrigger"], {
                                                asChild: true,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                    variant: "outline",
                                                    role: "combobox",
                                                    "aria-expanded": countryPopoverOpen,
                                                    className: "w-full justify-between bg-background dark:bg-gray-900 border-border/70 text-left font-normal",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "truncate",
                                                            children: formData.contactInfo?.address?.country || "Select country..."
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                            lineNumber: 343,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsUpDown$3e$__["ChevronsUpDown"], {
                                                            className: "ml-2 h-4 w-4 shrink-0 opacity-50"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                            lineNumber: 346,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                    lineNumber: 337,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                lineNumber: 336,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PopoverContent"], {
                                                className: "w-[var(--radix-popover-trigger-width)] min-w-[240px] p-0 bg-white dark:bg-slate-900 text-foreground border-border/80 shadow-2xl opacity-100 z-[160] backdrop-blur-none",
                                                align: "start",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"], {
                                                    shouldFilter: false,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandInput"], {
                                                            placeholder: "Search country...",
                                                            value: countrySearch,
                                                            onValueChange: setCountrySearch
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                            lineNumber: 354,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandList"], {
                                                            className: "max-h-60 overflow-y-auto",
                                                            children: [
                                                                filteredCountries.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandEmpty"], {
                                                                    children: "No country found."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                    lineNumber: 361,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandGroup"], {
                                                                    children: filteredCountries.map((country)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandItem"], {
                                                                            value: country,
                                                                            onSelect: ()=>{
                                                                                onCountryChange(country);
                                                                                setCountryPopoverOpen(false);
                                                                                setCountrySearch("");
                                                                            },
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mr-2 h-4 w-4 shrink-0", formData.contactInfo?.address?.country === country ? "opacity-100" : "opacity-0")
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                                    lineNumber: 374,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                country
                                                                            ]
                                                                        }, country, true, {
                                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                            lineNumber: 365,
                                                                            columnNumber: 25
                                                                        }, this))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                    lineNumber: 363,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                            lineNumber: 359,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                    lineNumber: 353,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                lineNumber: 349,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                                        lineNumber: 329,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                lineNumber: 325,
                                columnNumber: 11
                            }, this),
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$location$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isRwandaSelected"])(formData.contactInfo?.address?.country) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "contents",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-1.5",
                                                        children: "Province"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                        lineNumber: 398,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Popover"], {
                                                        open: provincePopoverOpen,
                                                        onOpenChange: (open)=>{
                                                            setProvincePopoverOpen(open);
                                                            if (!open) setProvinceSearch("");
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PopoverTrigger"], {
                                                                asChild: true,
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                    variant: "outline",
                                                                    role: "combobox",
                                                                    "aria-expanded": provincePopoverOpen,
                                                                    className: "w-full justify-between bg-background dark:bg-gray-900 border-border/70 text-left font-normal",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "truncate",
                                                                            children: formData.contactInfo?.address?.province || "Select province..."
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                            lineNumber: 415,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsUpDown$3e$__["ChevronsUpDown"], {
                                                                            className: "ml-2 h-4 w-4 shrink-0 opacity-50"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                            lineNumber: 418,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                    lineNumber: 409,
                                                                    columnNumber: 23
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                lineNumber: 408,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PopoverContent"], {
                                                                className: "w-[var(--radix-popover-trigger-width)] min-w-[220px] p-0 bg-white dark:bg-slate-900 text-foreground border-border/80 shadow-2xl opacity-100 z-[160] backdrop-blur-none",
                                                                align: "start",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"], {
                                                                    shouldFilter: false,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandInput"], {
                                                                            placeholder: "Search province...",
                                                                            value: provinceSearch,
                                                                            onValueChange: setProvinceSearch
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                            lineNumber: 426,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandList"], {
                                                                            className: "max-h-60 overflow-y-auto",
                                                                            children: [
                                                                                filteredProvinces.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandEmpty"], {
                                                                                    children: "No province found."
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                                    lineNumber: 433,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandGroup"], {
                                                                                    children: filteredProvinces.map((province)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandItem"], {
                                                                                            value: province,
                                                                                            onSelect: ()=>{
                                                                                                onProvinceChange(province);
                                                                                                setProvincePopoverOpen(false);
                                                                                                setProvinceSearch("");
                                                                                            },
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mr-2 h-4 w-4 shrink-0", formData.contactInfo?.address?.province === province ? "opacity-100" : "opacity-0")
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                                                    lineNumber: 446,
                                                                                                    columnNumber: 33
                                                                                                }, this),
                                                                                                province
                                                                                            ]
                                                                                        }, province, true, {
                                                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                                            lineNumber: 437,
                                                                                            columnNumber: 31
                                                                                        }, this))
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                                    lineNumber: 435,
                                                                                    columnNumber: 27
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                            lineNumber: 431,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                    lineNumber: 425,
                                                                    columnNumber: 23
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                lineNumber: 421,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                        lineNumber: 401,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                lineNumber: 397,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-1.5",
                                                        children: "District"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                        lineNumber: 466,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Popover"], {
                                                        open: districtPopoverOpen,
                                                        onOpenChange: (open)=>{
                                                            setDistrictPopoverOpen(open);
                                                            if (!open) setDistrictSearch("");
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PopoverTrigger"], {
                                                                asChild: true,
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                    variant: "outline",
                                                                    role: "combobox",
                                                                    "aria-expanded": districtPopoverOpen,
                                                                    className: "w-full justify-between bg-background dark:bg-gray-900 border-border/70 text-left font-normal",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "truncate",
                                                                            children: formData.contactInfo?.address?.district || "Select district..."
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                            lineNumber: 483,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsUpDown$3e$__["ChevronsUpDown"], {
                                                                            className: "ml-2 h-4 w-4 shrink-0 opacity-50"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                            lineNumber: 486,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                    lineNumber: 477,
                                                                    columnNumber: 23
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                lineNumber: 476,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PopoverContent"], {
                                                                className: "w-[var(--radix-popover-trigger-width)] min-w-[240px] p-0 bg-white dark:bg-slate-900 text-foreground border-border/80 shadow-2xl opacity-100 z-[160] backdrop-blur-none",
                                                                align: "start",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"], {
                                                                    shouldFilter: false,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandInput"], {
                                                                            placeholder: "Search district...",
                                                                            value: districtSearch,
                                                                            onValueChange: setDistrictSearch
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                            lineNumber: 494,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandList"], {
                                                                            className: "max-h-60 overflow-y-auto",
                                                                            children: [
                                                                                filteredDistricts.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandEmpty"], {
                                                                                    children: "No district found."
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                                    lineNumber: 501,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandGroup"], {
                                                                                    children: filteredDistricts.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandItem"], {
                                                                                            value: `${item.district} ${item.province}`,
                                                                                            onSelect: ()=>{
                                                                                                onDistrictChange(item.district, item.province);
                                                                                                setDistrictPopoverOpen(false);
                                                                                                setDistrictSearch("");
                                                                                            },
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mr-2 h-4 w-4 shrink-0", formData.contactInfo?.address?.district === item.district ? "opacity-100" : "opacity-0")
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                                                    lineNumber: 514,
                                                                                                    columnNumber: 33
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                    className: "flex flex-col min-w-0",
                                                                                                    children: [
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                            className: "font-medium text-foreground text-xs sm:text-sm [[data-selected=true]_&]:text-accent-foreground",
                                                                                                            children: item.district
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                                                            lineNumber: 523,
                                                                                                            columnNumber: 35
                                                                                                        }, this),
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                            className: "text-[11px] sm:text-[12px] text-muted-foreground [[data-selected=true]_&]:text-accent-foreground/80",
                                                                                                            children: item.province
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                                                            lineNumber: 524,
                                                                                                            columnNumber: 35
                                                                                                        }, this)
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                                                    lineNumber: 522,
                                                                                                    columnNumber: 33
                                                                                                }, this)
                                                                                            ]
                                                                                        }, `${item.province}-${item.district}`, true, {
                                                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                                            lineNumber: 505,
                                                                                            columnNumber: 31
                                                                                        }, this))
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                                    lineNumber: 503,
                                                                                    columnNumber: 27
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                            lineNumber: 499,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                    lineNumber: 493,
                                                                    columnNumber: 23
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                lineNumber: 489,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                        lineNumber: 469,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                lineNumber: 465,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-1.5",
                                                        children: "Sector"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                        lineNumber: 537,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Popover"], {
                                                        open: sectorPopoverOpen,
                                                        onOpenChange: (open)=>{
                                                            setSectorPopoverOpen(open);
                                                            if (!open) setSectorSearch("");
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PopoverTrigger"], {
                                                                asChild: true,
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                    variant: "outline",
                                                                    role: "combobox",
                                                                    "aria-expanded": sectorPopoverOpen,
                                                                    className: "w-full justify-between bg-background dark:bg-gray-900 border-border/70 text-left font-normal",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "truncate",
                                                                            children: formData.contactInfo?.address?.sector || "Select sector..."
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                            lineNumber: 554,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsUpDown$3e$__["ChevronsUpDown"], {
                                                                            className: "ml-2 h-4 w-4 shrink-0 opacity-50"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                            lineNumber: 557,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                    lineNumber: 548,
                                                                    columnNumber: 23
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                lineNumber: 547,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PopoverContent"], {
                                                                className: "w-[var(--radix-popover-trigger-width)] min-w-[260px] p-0 bg-white dark:bg-slate-900 text-foreground border-border/80 shadow-2xl opacity-100 z-[160] backdrop-blur-none",
                                                                align: "start",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"], {
                                                                    shouldFilter: false,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandInput"], {
                                                                            placeholder: "Search any sector...",
                                                                            value: sectorSearch,
                                                                            onValueChange: setSectorSearch
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                            lineNumber: 565,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandList"], {
                                                                            className: "max-h-60 overflow-y-auto",
                                                                            children: [
                                                                                filteredSectors.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandEmpty"], {
                                                                                    children: "No sector found."
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                                    lineNumber: 572,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandGroup"], {
                                                                                    children: filteredSectors.map((item)=>{
                                                                                        const isSelected = formData.contactInfo?.address?.sector === item.sector && (!formData.contactInfo?.address?.district || formData.contactInfo?.address?.district === item.district);
                                                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandItem"], {
                                                                                            value: `${item.sector} ${item.district} ${item.province}`,
                                                                                            onSelect: ()=>{
                                                                                                onSectorChange(item.sector, item.district, item.province);
                                                                                                setSectorPopoverOpen(false);
                                                                                                setSectorSearch("");
                                                                                            },
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mr-2 h-4 w-4 shrink-0", isSelected ? "opacity-100" : "opacity-0")
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                                                    lineNumber: 590,
                                                                                                    columnNumber: 35
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                    className: "flex flex-col min-w-0",
                                                                                                    children: [
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                            className: "font-medium text-foreground text-xs sm:text-sm [[data-selected=true]_&]:text-accent-foreground",
                                                                                                            children: item.sector
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                                                            lineNumber: 597,
                                                                                                            columnNumber: 37
                                                                                                        }, this),
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                            className: "text-[11px] sm:text-[12px] text-muted-foreground [[data-selected=true]_&]:text-accent-foreground/80",
                                                                                                            children: [
                                                                                                                item.district,
                                                                                                                ", ",
                                                                                                                item.province
                                                                                                            ]
                                                                                                        }, void 0, true, {
                                                                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                                                            lineNumber: 598,
                                                                                                            columnNumber: 37
                                                                                                        }, this)
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                                                    lineNumber: 596,
                                                                                                    columnNumber: 35
                                                                                                }, this)
                                                                                            ]
                                                                                        }, `${item.province}-${item.district}-${item.sector}`, true, {
                                                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                                            lineNumber: 581,
                                                                                            columnNumber: 33
                                                                                        }, this);
                                                                                    })
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                                    lineNumber: 574,
                                                                                    columnNumber: 27
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                            lineNumber: 570,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                    lineNumber: 564,
                                                                    columnNumber: 23
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                lineNumber: 560,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                        lineNumber: 540,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                lineNumber: 536,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                                        lineNumber: 395,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "contents",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-1.5",
                                                        children: "Cell"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                        lineNumber: 616,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Popover"], {
                                                        open: cellPopoverOpen,
                                                        onOpenChange: (open)=>{
                                                            setCellPopoverOpen(open);
                                                            if (!open) setCellSearch("");
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PopoverTrigger"], {
                                                                asChild: true,
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                    variant: "outline",
                                                                    role: "combobox",
                                                                    "aria-expanded": cellPopoverOpen,
                                                                    className: "w-full justify-between bg-background dark:bg-gray-900 border-border/70 text-left font-normal",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "truncate",
                                                                            children: formData.contactInfo?.address?.cell || "Select cell..."
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                            lineNumber: 633,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsUpDown$3e$__["ChevronsUpDown"], {
                                                                            className: "ml-2 h-4 w-4 shrink-0 opacity-50"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                            lineNumber: 636,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                    lineNumber: 627,
                                                                    columnNumber: 23
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                lineNumber: 626,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PopoverContent"], {
                                                                className: "w-[var(--radix-popover-trigger-width)] min-w-[260px] p-0 bg-white dark:bg-slate-900 text-foreground border-border/80 shadow-2xl opacity-100 z-[160] backdrop-blur-none",
                                                                align: "start",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"], {
                                                                    shouldFilter: false,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandInput"], {
                                                                            placeholder: "Search any cell...",
                                                                            value: cellSearch,
                                                                            onValueChange: setCellSearch
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                            lineNumber: 644,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandList"], {
                                                                            className: "max-h-60 overflow-y-auto",
                                                                            children: [
                                                                                filteredCells.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandEmpty"], {
                                                                                    children: "No cell found."
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                                    lineNumber: 651,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandGroup"], {
                                                                                    children: filteredCells.map((item)=>{
                                                                                        const isSelected = formData.contactInfo?.address?.cell === item.cell && (!formData.contactInfo?.address?.sector || formData.contactInfo?.address?.sector === item.sector);
                                                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandItem"], {
                                                                                            value: `${item.cell} ${item.sector} ${item.district}`,
                                                                                            onSelect: ()=>{
                                                                                                if (onCellChange) {
                                                                                                    onCellChange(item.cell, item.sector, item.district, item.province);
                                                                                                } else {
                                                                                                    onFieldChange("contactInfo.address.cell", item.cell);
                                                                                                }
                                                                                                setCellPopoverOpen(false);
                                                                                                setCellSearch("");
                                                                                            },
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mr-2 h-4 w-4 shrink-0", isSelected ? "opacity-100" : "opacity-0")
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                                                    lineNumber: 673,
                                                                                                    columnNumber: 35
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                    className: "flex flex-col min-w-0",
                                                                                                    children: [
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                            className: "font-medium text-foreground text-xs sm:text-sm [[data-selected=true]_&]:text-accent-foreground",
                                                                                                            children: item.cell
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                                                            lineNumber: 680,
                                                                                                            columnNumber: 37
                                                                                                        }, this),
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                            className: "text-[11px] sm:text-[12px] text-muted-foreground [[data-selected=true]_&]:text-accent-foreground/80",
                                                                                                            children: [
                                                                                                                item.sector,
                                                                                                                ", ",
                                                                                                                item.district
                                                                                                            ]
                                                                                                        }, void 0, true, {
                                                                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                                                            lineNumber: 681,
                                                                                                            columnNumber: 37
                                                                                                        }, this)
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                                                    lineNumber: 679,
                                                                                                    columnNumber: 35
                                                                                                }, this)
                                                                                            ]
                                                                                        }, `${item.province}-${item.district}-${item.sector}-${item.cell}`, true, {
                                                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                                            lineNumber: 660,
                                                                                            columnNumber: 33
                                                                                        }, this);
                                                                                    })
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                                    lineNumber: 653,
                                                                                    columnNumber: 27
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                            lineNumber: 649,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                    lineNumber: 643,
                                                                    columnNumber: 23
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                lineNumber: 639,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                        lineNumber: 619,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                lineNumber: 615,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-1.5",
                                                        children: "Village"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                        lineNumber: 697,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Popover"], {
                                                        open: villagePopoverOpen,
                                                        onOpenChange: (open)=>{
                                                            setVillagePopoverOpen(open);
                                                            if (!open) setVillageSearch("");
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PopoverTrigger"], {
                                                                asChild: true,
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                    variant: "outline",
                                                                    role: "combobox",
                                                                    "aria-expanded": villagePopoverOpen,
                                                                    className: "w-full justify-between bg-background dark:bg-gray-900 border-border/70 text-left font-normal",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "truncate",
                                                                            children: formData.contactInfo?.address?.village || "Select village..."
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                            lineNumber: 714,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsUpDown$3e$__["ChevronsUpDown"], {
                                                                            className: "ml-2 h-4 w-4 shrink-0 opacity-50"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                            lineNumber: 717,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                    lineNumber: 708,
                                                                    columnNumber: 23
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                lineNumber: 707,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PopoverContent"], {
                                                                className: "w-[var(--radix-popover-trigger-width)] min-w-[280px] p-0 bg-white dark:bg-slate-900 text-foreground border-border/80 shadow-2xl opacity-100 z-[160] backdrop-blur-none",
                                                                align: "start",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"], {
                                                                    shouldFilter: false,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandInput"], {
                                                                            placeholder: "Search any village...",
                                                                            value: villageSearch,
                                                                            onValueChange: setVillageSearch
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                            lineNumber: 725,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandList"], {
                                                                            className: "max-h-60 overflow-y-auto",
                                                                            children: [
                                                                                filteredVillages.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandEmpty"], {
                                                                                    children: "No village found."
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                                    lineNumber: 732,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandGroup"], {
                                                                                    children: filteredVillages.map((item)=>{
                                                                                        const isSelected = formData.contactInfo?.address?.village === item.village && (!formData.contactInfo?.address?.cell || formData.contactInfo?.address?.cell === item.cell);
                                                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandItem"], {
                                                                                            value: `${item.village} ${item.cell} ${item.sector} ${item.district}`,
                                                                                            onSelect: ()=>{
                                                                                                if (onVillageChange) {
                                                                                                    onVillageChange(item.village, item.cell, item.sector, item.district, item.province);
                                                                                                } else {
                                                                                                    onFieldChange("contactInfo.address.village", item.village);
                                                                                                }
                                                                                                setVillagePopoverOpen(false);
                                                                                                setVillageSearch("");
                                                                                            },
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mr-2 h-4 w-4 shrink-0", isSelected ? "opacity-100" : "opacity-0")
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                                                    lineNumber: 754,
                                                                                                    columnNumber: 35
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                    className: "flex flex-col min-w-0",
                                                                                                    children: [
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                            className: "font-medium text-foreground text-xs sm:text-sm [[data-selected=true]_&]:text-accent-foreground",
                                                                                                            children: item.village
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                                                            lineNumber: 761,
                                                                                                            columnNumber: 37
                                                                                                        }, this),
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                            className: "text-[11px] sm:text-[12px] text-muted-foreground [[data-selected=true]_&]:text-accent-foreground/80",
                                                                                                            children: [
                                                                                                                item.cell,
                                                                                                                ", ",
                                                                                                                item.sector,
                                                                                                                ", ",
                                                                                                                item.district
                                                                                                            ]
                                                                                                        }, void 0, true, {
                                                                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                                                            lineNumber: 762,
                                                                                                            columnNumber: 37
                                                                                                        }, this)
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                                                    lineNumber: 760,
                                                                                                    columnNumber: 35
                                                                                                }, this)
                                                                                            ]
                                                                                        }, `${item.province}-${item.district}-${item.sector}-${item.cell}-${item.village}`, true, {
                                                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                                            lineNumber: 741,
                                                                                            columnNumber: 33
                                                                                        }, this);
                                                                                    })
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                                    lineNumber: 734,
                                                                                    columnNumber: 27
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                            lineNumber: 730,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                    lineNumber: 724,
                                                                    columnNumber: 23
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                lineNumber: 720,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                        lineNumber: 700,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                lineNumber: 696,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                                        lineNumber: 613,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true) : formData.contactInfo?.address?.country ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "contents",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                        type: "text",
                                        value: fieldValue(formData.contactInfo?.address?.province),
                                        onChange: (e)=>onFieldChange("contactInfo.address.province", e.target.value),
                                        placeholder: "Province / State",
                                        className: solidFieldClass
                                    }, void 0, false, {
                                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                                        lineNumber: 779,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                        type: "text",
                                        value: fieldValue(formData.contactInfo?.address?.district),
                                        onChange: (e)=>onFieldChange("contactInfo.address.district", e.target.value),
                                        placeholder: "District",
                                        className: solidFieldClass
                                    }, void 0, false, {
                                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                                        lineNumber: 791,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                        type: "text",
                                        value: fieldValue(formData.contactInfo?.address?.sector),
                                        onChange: (e)=>onFieldChange("contactInfo.address.sector", e.target.value),
                                        placeholder: "Sector / City",
                                        className: solidFieldClass
                                    }, void 0, false, {
                                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                                        lineNumber: 803,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                        type: "text",
                                        value: fieldValue(formData.contactInfo?.address?.cell),
                                        onChange: (e)=>onFieldChange("contactInfo.address.cell", e.target.value),
                                        placeholder: "Cell",
                                        className: solidFieldClass
                                    }, void 0, false, {
                                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                                        lineNumber: 812,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                        type: "text",
                                        value: fieldValue(formData.contactInfo?.address?.village),
                                        onChange: (e)=>onFieldChange("contactInfo.address.village", e.target.value),
                                        placeholder: "Village",
                                        className: solidFieldClass
                                    }, void 0, false, {
                                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                                        lineNumber: 821,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                lineNumber: 778,
                                columnNumber: 13
                            }, this) : null,
                            formData.contactInfo?.address?.country && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-1.5",
                                        children: "Street / Additional Address (optional)"
                                    }, void 0, false, {
                                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                                        lineNumber: 839,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                        type: "text",
                                        value: fieldValue(formData.contactInfo?.address?.address),
                                        onChange: (e)=>onFieldChange("contactInfo.address.address", e.target.value),
                                        placeholder: "Street (optional)",
                                        className: solidFieldClass
                                    }, void 0, false, {
                                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                                        lineNumber: 842,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                lineNumber: 838,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                        lineNumber: 324,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/patient/patient-form-fields.tsx",
                lineNumber: 317,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `${solidPanelClass} border-t p-2 sm:p-3`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-1 sm:mb-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-sm sm:text-lg font-semibold",
                                children: "Insurance: Private"
                            }, void 0, false, {
                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                lineNumber: 864,
                                columnNumber: 11
                            }, this),
                            !canAddInsurance && (formData.insurances?.length ?? 0) > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[12px] text-amber-600 dark:text-amber-400 mt-0.5",
                                children: "Complete existing insurance details before adding another"
                            }, void 0, false, {
                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                lineNumber: 866,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                        lineNumber: 863,
                        columnNumber: 9
                    }, this),
                    formData.insurances?.map((insurance, index)=>{
                        const hasProvider = insurance.insuranceId && String(insurance.insuranceId) !== "0";
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "border border-border/60 rounded-xl sm:rounded-2xl p-2 sm:p-4 mb-2 sm:mb-4 bg-background dark:bg-gray-900 shadow-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between items-start mb-2 sm:mb-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            className: "font-medium text-xs sm:text-base",
                                            children: [
                                                "Insurance #",
                                                index + 1
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                            lineNumber: 883,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>onRemoveInsurance(index),
                                            className: "rounded-full px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs",
                                            children: "Remove"
                                        }, void 0, false, {
                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                            lineNumber: 886,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                    lineNumber: 882,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-1.5",
                                                    children: "Insurance Provider"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                    lineNumber: 897,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2d$error$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FieldError"], {
                                                    message: fieldErrors[`insurance.${index}.provider`]
                                                }, void 0, false, {
                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                    lineNumber: 900,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Popover"], {
                                                    open: insurancePopoverOpen[index] || false,
                                                    onOpenChange: (open)=>setInsurancePopoverOpen((prev)=>({
                                                                ...prev,
                                                                [index]: open
                                                            })),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PopoverTrigger"], {
                                                            asChild: true,
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                variant: "outline",
                                                                role: "combobox",
                                                                "aria-expanded": insurancePopoverOpen[index],
                                                                className: "w-full justify-between bg-background dark:bg-gray-900 border-border/70",
                                                                children: [
                                                                    getInsuranceName(insurance.insuranceId ?? "") || insurance.insuranceId,
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsUpDown$3e$__["ChevronsUpDown"], {
                                                                        className: "ml-2 h-4 w-4 shrink-0 opacity-50"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                        lineNumber: 918,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                lineNumber: 911,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                            lineNumber: 910,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PopoverContent"], {
                                                            className: "w-full p-0 bg-background dark:bg-gray-900 border-border/70",
                                                            align: "start",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"], {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandInput"], {
                                                                        placeholder: "Search insurance..."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                        lineNumber: 926,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandList"], {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandEmpty"], {
                                                                                children: "No insurance found."
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                                lineNumber: 928,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandGroup"], {
                                                                                children: availableInsurances.map((ins)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandItem"], {
                                                                                        value: ins.acronym || ins.name || ins.id,
                                                                                        onSelect: ()=>{
                                                                                            onUpdateInsurance(index, "insuranceId", ins.id);
                                                                                            const covs = ins.coverages || [];
                                                                                            if (covs.length === 1 && covs[0]) {
                                                                                                onUpdateInsurance(index, "patientShareCoverageId", covs[0].id);
                                                                                                onUpdateInsurance(index, "patientSharePercentage", covs[0].patientSharePercentage);
                                                                                            } else if (covs.length > 1) {
                                                                                                const base = covs.find((c)=>!c.departmentId && !c.encounterType) || covs[0];
                                                                                                if (base) {
                                                                                                    onUpdateInsurance(index, "patientShareCoverageId", base.id);
                                                                                                    onUpdateInsurance(index, "patientSharePercentage", base.patientSharePercentage);
                                                                                                }
                                                                                            }
                                                                                            setInsurancePopoverOpen((prev)=>({
                                                                                                    ...prev,
                                                                                                    [index]: false
                                                                                                }));
                                                                                        },
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mr-2 h-4 w-4", String(insurance.insuranceId) === String(ins.id) ? "opacity-100" : "opacity-0")
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                                                lineNumber: 952,
                                                                                                columnNumber: 33
                                                                                            }, this),
                                                                                            ins.acronym || ins.name || 'Insurance'
                                                                                        ]
                                                                                    }, ins.id, true, {
                                                                                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                                        lineNumber: 931,
                                                                                        columnNumber: 31
                                                                                    }, this))
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                                lineNumber: 929,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                        lineNumber: 927,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                lineNumber: 925,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                            lineNumber: 921,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                    lineNumber: 901,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                            lineNumber: 896,
                                            columnNumber: 17
                                        }, this),
                                        hasProvider && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-1.5",
                                                    children: "Card Number *"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                    lineNumber: 973,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                    type: "text",
                                                    value: insurance.insuranceCardNumber,
                                                    onChange: (e)=>onUpdateInsurance(index, "insuranceCardNumber", e.target.value),
                                                    placeholder: "Enter card number",
                                                    className: `${solidFieldClass} ${fieldErrors[`insurance.${index}.card`] ? "border-red-500" : ""}`,
                                                    required: true
                                                }, void 0, false, {
                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                    lineNumber: 976,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2d$error$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FieldError"], {
                                                    message: fieldErrors[`insurance.${index}.card`]
                                                }, void 0, false, {
                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                    lineNumber: 990,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                            lineNumber: 972,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                    lineNumber: 895,
                                    columnNumber: 15
                                }, this),
                                hasProvider && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 mt-2 sm:mt-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-1.5",
                                                children: "Providing Company / Employer *"
                                            }, void 0, false, {
                                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                lineNumber: 998,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                type: "text",
                                                value: insurance.providingCompanyOrEmployer,
                                                onChange: (e)=>onUpdateInsurance(index, "providingCompanyOrEmployer", e.target.value),
                                                placeholder: "Enter company or employer",
                                                className: `${solidFieldClass} ${fieldErrors[`insurance.${index}.employer`] ? "border-red-500" : ""}`,
                                                required: true
                                            }, void 0, false, {
                                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                lineNumber: 1001,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2d$error$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FieldError"], {
                                                message: fieldErrors[`insurance.${index}.employer`]
                                            }, void 0, false, {
                                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                lineNumber: 1015,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                                        lineNumber: 997,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                    lineNumber: 996,
                                    columnNumber: 17
                                }, this),
                                hasProvider && (()=>{
                                    const selectedProvider = availableInsurances.find((ins)=>String(ins.id) === String(insurance.insuranceId));
                                    const coverages = selectedProvider?.coverages || [];
                                    const getCoverageLabel = (cov)=>{
                                        if (cov.departmentName) return `${cov.departmentName} (${cov.patientSharePercentage}%)`;
                                        if (cov.encounterType) {
                                            const typeName = cov.encounterType.replace(/_/g, " ").toLowerCase();
                                            const formatted = typeName.charAt(0).toUpperCase() + typeName.slice(1);
                                            return `${formatted} (${cov.patientSharePercentage}%)`;
                                        }
                                        return `Base / General (${cov.patientSharePercentage}%)`;
                                    };
                                    if (coverages.length > 1) {
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-2 sm:mt-4 p-3 rounded-xl border border-border/60 bg-muted/20",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between gap-2 mb-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-xs sm:text-sm font-medium text-foreground",
                                                            children: "Default Patient Share / Coverage Tier"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                            lineNumber: 1040,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[12px] text-muted-foreground",
                                                            children: [
                                                                coverages.length,
                                                                " tiers available"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                            lineNumber: 1043,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                    lineNumber: 1039,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[12px] text-muted-foreground mb-2",
                                                    children: "This insurance has multiple coverage conditions. Select the default tier for this patient:"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                    lineNumber: 1047,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-wrap gap-2",
                                                    children: coverages.map((cov)=>{
                                                        const isSelected = insurance.patientShareCoverageId === cov.id;
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>{
                                                                if (isSelected) {
                                                                    onUpdateInsurance(index, "patientShareCoverageId", "");
                                                                    onUpdateInsurance(index, "patientSharePercentage", "");
                                                                } else {
                                                                    onUpdateInsurance(index, "patientShareCoverageId", cov.id);
                                                                    onUpdateInsurance(index, "patientSharePercentage", cov.patientSharePercentage);
                                                                }
                                                            },
                                                            className: `px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-medium transition-all ${isSelected ? "bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] text-white border-transparent shadow-sm" : "bg-white dark:bg-slate-900 border-border/60 hover:border-primary/50 text-foreground"}`,
                                                            children: getCoverageLabel(cov)
                                                        }, cov.id, false, {
                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                            lineNumber: 1054,
                                                            columnNumber: 29
                                                        }, this);
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                    lineNumber: 1050,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                            lineNumber: 1038,
                                            columnNumber: 21
                                        }, this);
                                    }
                                    if (coverages.length === 1 && coverages[0]) {
                                        const singleCov = coverages[0];
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-2 sm:mt-4 p-2.5 rounded-xl border border-border/40 bg-muted/20 flex items-center justify-between text-xs",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-medium text-foreground",
                                                            children: "Default Coverage: "
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                            lineNumber: 1086,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-muted-foreground",
                                                            children: getCoverageLabel(singleCov)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                            lineNumber: 1087,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                    lineNumber: 1085,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold text-[12px]",
                                                    children: [
                                                        singleCov.patientSharePercentage,
                                                        "% Patient Share"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                    lineNumber: 1089,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                            lineNumber: 1084,
                                            columnNumber: 21
                                        }, this);
                                    }
                                    return null;
                                })(),
                                hasProvider && (()=>{
                                    const isAdult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateAge"])(formData.dateOfBirth) >= 18;
                                    const isSelf = isAdult ? insurance.isSelf !== false : false;
                                    if (isAdult) {
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-2 sm:mt-4 p-3 rounded-xl border border-border/50 bg-muted/20 space-y-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center space-x-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                                                            id: `insurance-${index}-isSelf`,
                                                            checked: insurance.isSelf !== false,
                                                            onCheckedChange: (checked)=>{
                                                                onUpdateInsurance(index, "isSelf", Boolean(checked));
                                                                if (checked) {
                                                                    onUpdateInsurance(index, "dominantMember.firstName", "");
                                                                    onUpdateInsurance(index, "dominantMember.lastName", "");
                                                                    onUpdateInsurance(index, "dominantMember.phone", "");
                                                                }
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                            lineNumber: 1107,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            htmlFor: `insurance-${index}-isSelf`,
                                                            className: "text-xs sm:text-sm font-medium text-foreground cursor-pointer select-none",
                                                            children: "Self (Patient is the principal policyholder)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                            lineNumber: 1119,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                    lineNumber: 1106,
                                                    columnNumber: 23
                                                }, this),
                                                !isSelf && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "pt-2 border-t border-border/40 space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                                            className: "text-xs sm:text-sm font-medium text-foreground",
                                                            children: [
                                                                "Principal Member Information ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-red-500",
                                                                    children: "*"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                    lineNumber: 1130,
                                                                    columnNumber: 58
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                            lineNumber: 1129,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "md:col-span-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                            className: "block text-xs sm:text-sm font-medium text-foreground mb-1",
                                                                            children: [
                                                                                "Principal Member Full Name ",
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-red-500",
                                                                                    children: "*"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                                    lineNumber: 1135,
                                                                                    columnNumber: 60
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                            lineNumber: 1134,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                            type: "text",
                                                                            value: insurance.dominantMember?.name ?? [
                                                                                insurance.dominantMember?.firstName,
                                                                                insurance.dominantMember?.lastName
                                                                            ].filter(Boolean).join(" "),
                                                                            onChange: (e)=>onUpdateInsurance(index, "dominantMember.name", e.target.value),
                                                                            placeholder: "Enter principal member name",
                                                                            className: solidFieldClass,
                                                                            required: true
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                            lineNumber: 1137,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                    lineNumber: 1133,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                            className: "block text-xs sm:text-sm font-medium text-foreground mb-1",
                                                                            children: [
                                                                                "Phone ",
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-red-500",
                                                                                    children: "*"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                                    lineNumber: 1154,
                                                                                    columnNumber: 39
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                            lineNumber: 1153,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                            type: "tel",
                                                                            value: insurance.dominantMember?.phone || "",
                                                                            onChange: (e)=>onUpdateInsurance(index, "dominantMember.phone", (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sanitizePhoneInput"])(e.target.value)),
                                                                            placeholder: "Phone number",
                                                                            className: solidFieldClass,
                                                                            required: true
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                            lineNumber: 1156,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                    lineNumber: 1152,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                            lineNumber: 1132,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2d$error$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FieldError"], {
                                                            message: fieldErrors[`insurance.${index}.dominant`]
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                            lineNumber: 1172,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                    lineNumber: 1128,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                            lineNumber: 1105,
                                            columnNumber: 21
                                        }, this);
                                    }
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-2 sm:mt-4 p-3 rounded-xl border border-border/50 bg-muted/20 space-y-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                                        className: "text-xs sm:text-sm font-medium text-foreground",
                                                        children: [
                                                            "Principal Member Information ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-red-500",
                                                                children: "*"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                lineNumber: 1183,
                                                                columnNumber: 54
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                        lineNumber: 1182,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[12px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border/60",
                                                        children: "Required for patients <18 years"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                        lineNumber: 1185,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                lineNumber: 1181,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "md:col-span-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-xs sm:text-sm font-medium text-foreground mb-1",
                                                                children: [
                                                                    "Principal Member Full Name ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-red-500",
                                                                        children: "*"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                        lineNumber: 1192,
                                                                        columnNumber: 54
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                lineNumber: 1191,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                type: "text",
                                                                value: insurance.dominantMember?.name ?? [
                                                                    insurance.dominantMember?.firstName,
                                                                    insurance.dominantMember?.lastName
                                                                ].filter(Boolean).join(" "),
                                                                onChange: (e)=>onUpdateInsurance(index, "dominantMember.name", e.target.value),
                                                                placeholder: "Enter principal member name",
                                                                className: solidFieldClass,
                                                                required: true
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                lineNumber: 1194,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                        lineNumber: 1190,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-xs sm:text-sm font-medium text-foreground mb-1",
                                                                children: [
                                                                    "Phone ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-red-500",
                                                                        children: "*"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                        lineNumber: 1211,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                lineNumber: 1210,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                type: "tel",
                                                                value: insurance.dominantMember?.phone || "",
                                                                onChange: (e)=>onUpdateInsurance(index, "dominantMember.phone", (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sanitizePhoneInput"])(e.target.value)),
                                                                placeholder: "Phone number",
                                                                className: solidFieldClass,
                                                                required: true
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                                lineNumber: 1213,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                        lineNumber: 1209,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                lineNumber: 1189,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$field$2d$error$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FieldError"], {
                                                message: fieldErrors[`insurance.${index}.dominant`]
                                            }, void 0, false, {
                                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                lineNumber: 1229,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                                        lineNumber: 1180,
                                        columnNumber: 19
                                    }, this);
                                })()
                            ]
                        }, index, true, {
                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                            lineNumber: 878,
                            columnNumber: 13
                        }, this);
                    })
                ]
            }, void 0, true, {
                fileName: "[project]/components/patient/patient-form-fields.tsx",
                lineNumber: 860,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `${solidPanelClass} border-t p-2 sm:p-3`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-1 flex items-center justify-between gap-2 sm:mb-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-sm font-semibold",
                                children: "Emergency Contact"
                            }, void 0, false, {
                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                lineNumber: 1244,
                                columnNumber: 11
                            }, this),
                            showEmergency && !hasEmergencyData ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setEmergencyOpen(false),
                                className: "rounded-full border border-border/60 px-2.5 py-1 text-[11px] text-muted-foreground hover:bg-muted",
                                children: "Hide"
                            }, void 0, false, {
                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                lineNumber: 1246,
                                columnNumber: 13
                            }, this) : !showEmergency ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setEmergencyOpen(true),
                                className: "rounded-full border border-border/70 bg-background px-3 py-1.5 text-xs font-medium text-foreground shadow-sm hover:bg-muted",
                                children: "+ Add emergency contact"
                            }, void 0, false, {
                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                lineNumber: 1254,
                                columnNumber: 13
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                        lineNumber: 1243,
                        columnNumber: 9
                    }, this),
                    showEmergency && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2 grid grid-cols-1 gap-2 md:grid-cols-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                type: "text",
                                value: fieldValue(formData.emergencyContact?.name),
                                onChange: (e)=>onFieldChange("emergencyContact.name", e.target.value),
                                placeholder: "Contact name",
                                className: solidFieldClass
                            }, void 0, false, {
                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                lineNumber: 1265,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                                value: formData.emergencyContact?.relation || "",
                                onValueChange: (value)=>onFieldChange("emergencyContact.relation", value),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                        className: "h-10 text-sm",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {
                                            placeholder: "Relation"
                                        }, void 0, false, {
                                            fileName: "[project]/components/patient/patient-form-fields.tsx",
                                            lineNumber: 1281,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                                        lineNumber: 1280,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                value: "Spouse",
                                                children: "Spouse"
                                            }, void 0, false, {
                                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                lineNumber: 1284,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                value: "Parent",
                                                children: "Parent"
                                            }, void 0, false, {
                                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                lineNumber: 1285,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                value: "Child",
                                                children: "Child"
                                            }, void 0, false, {
                                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                lineNumber: 1286,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                value: "Sibling",
                                                children: "Sibling"
                                            }, void 0, false, {
                                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                lineNumber: 1287,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                value: "Relative",
                                                children: "Relative"
                                            }, void 0, false, {
                                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                lineNumber: 1288,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                value: "Friend",
                                                children: "Friend"
                                            }, void 0, false, {
                                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                lineNumber: 1289,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                value: "Neighbor",
                                                children: "Neighbor"
                                            }, void 0, false, {
                                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                lineNumber: 1290,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                value: "Colleague",
                                                children: "Colleague"
                                            }, void 0, false, {
                                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                lineNumber: 1291,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                value: "Other",
                                                children: "Other"
                                            }, void 0, false, {
                                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                                lineNumber: 1292,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                                        lineNumber: 1283,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                lineNumber: 1274,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                type: "tel",
                                value: fieldValue(formData.emergencyContact?.phone),
                                onChange: (e)=>onFieldChange("emergencyContact.phone", e.target.value),
                                placeholder: "Phone number",
                                className: solidFieldClass
                            }, void 0, false, {
                                fileName: "[project]/components/patient/patient-form-fields.tsx",
                                lineNumber: 1295,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/patient/patient-form-fields.tsx",
                        lineNumber: 1264,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/patient/patient-form-fields.tsx",
                lineNumber: 1240,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/patient/patient-form-fields.tsx",
        lineNumber: 206,
        columnNumber: 5
    }, this);
}
_s(PatientFormFields, "2uRmm7N0eW1UAZJuPjn3TC2zmow=");
_c = PatientFormFields;
var _c;
__turbopack_context__.k.register(_c, "PatientFormFields");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/patient/patient-form-dialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PatientFormDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$auth$2d$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hooks/auth-hooks.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$patients$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/patients/hooks.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$insurances$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/insurances/hooks.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$patients$2f$use$2d$save$2d$patient$2d$insurance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/patients/use-save-patient-insurance.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-toastify/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/validation-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$patient$2d$display$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/patient-display-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$location$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/location-data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$patient$2f$patient$2d$form$2d$fields$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/patient/patient-form-fields.tsx [app-client] (ecmascript)");
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
const flatToNested = (flat)=>{
    const gender = flat.gender === "MALE" ? "M" : flat.gender === "FEMALE" ? "F" : "";
    const fullName = [
        flat.firstName,
        flat.middleName,
        flat.lastName
    ].filter(Boolean).join(" ").trim();
    return {
        name: fullName,
        firstName: flat.firstName || "",
        lastName: flat.lastName || "",
        middleName: flat.middleName || "",
        dateOfBirth: flat.dateOfBirth || "",
        gender,
        contactInfo: {
            phone: flat.primaryPhoneNumber || "",
            email: flat.alternativePhone || "",
            address: {
                country: flat.postalAddress || "Rwanda",
                province: "",
                district: flat.district || "",
                sector: flat.city || "",
                cell: flat.cell || "",
                village: flat.village || "",
                address: ""
            }
        },
        nationalIdNumber: flat.nationalIdNumber || "",
        emergencyContact: {
            name: flat.emergencyContactName || "",
            relation: flat.emergencyContactRelationship || "",
            phone: flat.emergencyContactPhoneNumber || ""
        },
        insurances: []
    };
};
const nestedToFlat = (nested)=>{
    const resolved = nested.name ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$patient$2d$display$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["splitFullName"])(nested.name) : {
        firstName: nested.firstName,
        middleName: nested.middleName,
        lastName: nested.lastName
    };
    return {
        firstName: resolved.firstName || undefined,
        lastName: resolved.lastName || undefined,
        middleName: resolved.middleName || undefined,
        dateOfBirth: nested.dateOfBirth || undefined,
        gender: nested.gender === "M" ? "MALE" : nested.gender === "F" ? "FEMALE" : undefined,
        primaryPhoneNumber: nested.contactInfo?.phone || undefined,
        alternativePhone: nested.contactInfo?.email || undefined,
        cell: nested.contactInfo?.address?.cell || undefined,
        village: nested.contactInfo?.address?.village || undefined,
        city: nested.contactInfo?.address?.sector || undefined,
        district: nested.contactInfo?.address?.district || undefined,
        postalAddress: nested.contactInfo?.address?.country || undefined,
        nationalIdNumber: nested.nationalIdNumber || undefined,
        passportNumber: undefined,
        emergencyContactName: nested.emergencyContact?.name || undefined,
        emergencyContactRelationship: nested.emergencyContact?.relation || undefined,
        emergencyContactPhoneNumber: nested.emergencyContact?.phone || undefined
    };
};
const EMPTY_FORM = {
    name: "",
    firstName: "",
    lastName: "",
    middleName: "",
    dateOfBirth: "",
    gender: "",
    contactInfo: {
        phone: "",
        email: "",
        address: {
            country: "Rwanda",
            province: "",
            district: "",
            sector: "",
            cell: "",
            village: "",
            address: ""
        }
    },
    emergencyContact: {
        name: "",
        relation: "",
        phone: ""
    },
    nationalIdNumber: "",
    insurances: []
};
function PatientFormDialog({ isOpen, onClose, mode, patient, onPatientSaved, onFieldBlur, onFormChange }) {
    _s();
    const { registerPatient, loading: registerLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$patients$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRegisterPatient"])();
    const { updatePatient, loading: updateLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$patients$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUpdatePatient"])();
    const { savePatientInsurance } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$patients$2f$use$2d$save$2d$patient$2d$insurance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSavePatientInsurance"])();
    const { insurances } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$insurances$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInsurances"])();
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [fieldErrors, setFieldErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(EMPTY_FORM);
    const [savingInsurances, setSavingInsurances] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const hasInteractedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const isEdit = mode === "edit";
    const savePatientInsuranceRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(savePatientInsurance);
    savePatientInsuranceRef.current = savePatientInsurance;
    /**
   * Convert existing PatientInsurance records from the API into the form's
   * RegisterPatientInput.insurances shape so they appear pre-filled in edit mode.
   */ const mapExistingInsurances = (patientInsurances)=>{
        return (patientInsurances || []).filter((pi)=>!pi.deactivated).map((pi)=>{
            const isPrincipal = pi.principalMember;
            const fullName = pi.principalMemberName?.trim() || "";
            const nameParts = fullName ? fullName.split(/\s+/) : [];
            return {
                id: pi.id,
                insuranceId: pi.insuranceProvider.id,
                insuranceCardNumber: pi.insuranceCardNumber,
                providingCompanyOrEmployer: pi.providingCompanyOrEmployer || "",
                isSelf: isPrincipal,
                dominantMember: isPrincipal ? {
                    name: "",
                    firstName: "",
                    lastName: "",
                    phone: ""
                } : {
                    name: fullName,
                    firstName: nameParts[0] || "",
                    lastName: nameParts.slice(1).join(" ") || "",
                    phone: pi.principalMemberPhoneNumber || ""
                }
            };
        });
    };
    /** Tracks which insurance entries the user has actually modified (via
   * updateInsurance).  Existing insurances loaded from the DB start with an
   * `id` — we skip auto-saving them until the user touches a field. */ const touchedInsuranceIndices = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Set());
    // Pre-fill form in edit mode (including existing insurances)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PatientFormDialog.useEffect": ()=>{
            if (!isOpen) return;
            if (isEdit && patient) {
                const nested = flatToNested({
                    firstName: patient.firstName || "",
                    lastName: patient.lastName || "",
                    middleName: patient.middleName || "",
                    dateOfBirth: patient.dateOfBirth || "",
                    gender: patient.gender,
                    primaryPhoneNumber: patient.primaryPhoneNumber || "",
                    alternativePhone: patient.alternativePhone || "",
                    cell: patient.cell || "",
                    village: patient.village || "",
                    city: patient.city || "",
                    district: patient.district || "",
                    postalAddress: patient.postalAddress || "",
                    nationalIdNumber: patient.nationalIdNumber || "",
                    passportNumber: patient.passportNumber || "",
                    emergencyContactName: patient.emergencyContactName || "",
                    emergencyContactRelationship: patient.emergencyContactRelationship || "",
                    emergencyContactPhoneNumber: patient.emergencyContactPhoneNumber || ""
                });
                // Populate insurance from existing patient records
                nested.insurances = mapExistingInsurances(patient.patientInsurances || []);
                setFormData(nested);
                touchedInsuranceIndices.current = new Set();
            } else if (!isEdit) {
                setFormData(EMPTY_FORM);
            }
            setError("");
            setFieldErrors({});
            setSavingInsurances(new Set());
        }
    }["PatientFormDialog.useEffect"], [
        isOpen,
        isEdit,
        patient
    ]);
    const handleInputChange = (field, value)=>{
        hasInteractedRef.current = true;
        const sanitizedValue = field === "contactInfo.email" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sanitizeEmailOrPhoneInput"])(value) : field === "contactInfo.phone" || field === "emergencyContact.phone" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sanitizePhoneInput"])(value) : field === "nationalIdNumber" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sanitizeNationalIdInput"])(value) : value;
        setFormData((prev)=>{
            const keys = field.split(".");
            const updated = {
                ...prev
            };
            let current = updated;
            for(let i = 0; i < keys.length - 1; i++){
                if (!current[keys[i]]) current[keys[i]] = {};
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = sanitizedValue;
            if (field === "name") {
                const parts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$patient$2d$display$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["splitFullName"])(sanitizedValue);
                updated.name = sanitizedValue;
                updated.firstName = parts.firstName;
                updated.middleName = parts.middleName || "";
                updated.lastName = parts.lastName || "";
            }
            // Auto-populate Gender & Year of Birth from Rwandan 16-digit National ID
            if (field === "nationalIdNumber") {
                const nidInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseRwandaNationalId"])(sanitizedValue);
                if (nidInfo.valid) {
                    if (nidInfo.gender) {
                        updated.gender = nidInfo.gender;
                    }
                    if (nidInfo.yearOfBirth) {
                        if (prev.dateOfBirth && /^\d{4}-\d{2}-\d{2}$/.test(prev.dateOfBirth)) {
                            const [, mm, dd] = prev.dateOfBirth.split("-");
                            updated.dateOfBirth = `${nidInfo.yearOfBirth}-${mm}-${dd}`;
                        } else {
                            updated.dateOfBirth = `${nidInfo.yearOfBirth}-01-01`;
                        }
                    }
                }
            }
            return updated;
        });
        // Clear the inline error for the field being edited (or its group).
        setFieldErrors((prev)=>{
            if (Object.keys(prev).length === 0) return prev;
            const next = {
                ...prev
            };
            if (field === "name" || field === "firstName") {
                delete next["name"];
                delete next["firstName"];
            } else if (field === "dateOfBirth") {
                delete next["dateOfBirth"];
            } else if (field.startsWith("insurance.")) {
                const idx = field.split(".")[1];
                delete next[`insurance.${idx}.provider`];
                delete next[`insurance.${idx}.card`];
                delete next[`insurance.${idx}.employer`];
                delete next[`insurance.${idx}.dominant`];
            } else {
                delete next[field];
            }
            return next;
        });
    };
    const addInsurance = ()=>{
        hasInteractedRef.current = true;
        const insurances = formData.insurances || [];
        if (insurances.length > 0) {
            const incompleteIndex = insurances.findIndex((ins)=>!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInsuranceEntryComplete"])(ins, formData.dateOfBirth));
            if (incompleteIndex !== -1) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].warning(`Please fill in all required fields for Insurance #${incompleteIndex + 1} before adding another.`);
                return;
            }
        }
        const isAdult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateAge"])(formData.dateOfBirth) >= 18;
        setFormData((prev)=>({
                ...prev,
                insurances: [
                    ...prev.insurances || [],
                    {
                        insuranceId: "0",
                        insuranceCardNumber: "",
                        providingCompanyOrEmployer: "",
                        patientShareCoverageId: "",
                        patientSharePercentage: "",
                        isSelf: isAdult,
                        dominantMember: {
                            firstName: "",
                            lastName: "",
                            phone: ""
                        }
                    }
                ]
            }));
    };
    const updateInsurance = (index, field, value)=>{
        hasInteractedRef.current = true;
        touchedInsuranceIndices.current.add(index);
        setFormData((prev)=>({
                ...prev,
                insurances: (prev.insurances || []).map((insurance, i)=>{
                    if (i === index) {
                        if (field.startsWith("dominantMember.")) {
                            const dmField = field.split(".")[1];
                            let dm = {
                                ...insurance.dominantMember,
                                [dmField]: value
                            };
                            if (dmField === "name") {
                                const split = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$patient$2d$display$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["splitWorkerName"])(String(value));
                                dm = {
                                    ...dm,
                                    name: String(value),
                                    firstName: split.firstName,
                                    lastName: split.lastName || ""
                                };
                            }
                            return {
                                ...insurance,
                                dominantMember: dm
                            };
                        }
                        if (field === "isSelf") {
                            const isSelf = Boolean(value);
                            return {
                                ...insurance,
                                isSelf,
                                dominantMember: isSelf ? {
                                    name: "",
                                    firstName: "",
                                    lastName: "",
                                    phone: ""
                                } : insurance.dominantMember || {
                                    name: "",
                                    firstName: "",
                                    lastName: "",
                                    phone: ""
                                }
                            };
                        }
                        return {
                            ...insurance,
                            [field]: value
                        };
                    }
                    return insurance;
                })
            }));
    };
    const removeInsurance = (index)=>{
        hasInteractedRef.current = true;
        setFormData((prev)=>({
                ...prev,
                insurances: (prev.insurances || []).filter((_, i)=>i !== index)
            }));
    };
    // In edit mode, auto-save insurance when all required fields are filled.
    // Existing insurances (those with an `id`) are only saved once the user
    // has actually modified them (tracked via touchedInsuranceIndices).
    const pendingSaveRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Set());
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PatientFormDialog.useEffect": ()=>{
            if (!isEdit || !patient?.id) return;
            const insurances = formData.insurances || [];
            for(let i = 0; i < insurances.length; i++){
                const ins = insurances[i];
                // Skip existing insurances the user hasn't touched yet
                const isExistingSaved = Boolean(ins.id);
                if (isExistingSaved && !touchedInsuranceIndices.current.has(i)) continue;
                if (ins.insuranceId && String(ins.insuranceId) !== "0" && ins.insuranceCardNumber?.trim() && ins.providingCompanyOrEmployer?.trim() && !savingInsurances.has(i) && !pendingSaveRef.current.has(i)) {
                    const isAdult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateAge"])(formData.dateOfBirth) >= 18;
                    const isSelf = isAdult ? ins.isSelf !== false : false;
                    const dominantRequired = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDominantMemberRequired"])(formData.dateOfBirth, true);
                    const dmResolved = ins.dominantMember?.name ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$patient$2d$display$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["splitFullName"])(ins.dominantMember.name) : {
                        firstName: ins.dominantMember?.firstName?.trim() || "",
                        lastName: ins.dominantMember?.lastName?.trim() || ""
                    };
                    const hasDmName = Boolean(ins.dominantMember?.name?.trim() || dmResolved.firstName && dmResolved.lastName);
                    const dominantValid = isSelf ? true : Boolean(hasDmName && ins.dominantMember?.phone?.trim() && /^\+?\d{7,15}$/.test(ins.dominantMember.phone.trim().replace(/\s+/g, "")));
                    if (dominantValid) {
                        pendingSaveRef.current.add(i);
                        setSavingInsurances({
                            "PatientFormDialog.useEffect": (prev)=>new Set(prev).add(i)
                        }["PatientFormDialog.useEffect"]);
                        savePatientInsuranceRef.current({
                            patientId: patient.id,
                            patientDateOfBirth: patient.dateOfBirth,
                            insuranceProviderId: String(ins.insuranceId),
                            insuranceCardNumber: ins.insuranceCardNumber,
                            providingCompanyOrEmployer: ins.providingCompanyOrEmployer,
                            isSelf,
                            dominantName: ins.dominantMember?.name || undefined,
                            dominantFirstName: isSelf ? undefined : dmResolved.firstName || undefined,
                            dominantLastName: isSelf ? undefined : dmResolved.lastName || undefined,
                            dominantPhone: isSelf ? undefined : ins.dominantMember?.phone || undefined,
                            existingPatientInsurances: patient.patientInsurances
                        }).then({
                            "PatientFormDialog.useEffect": ()=>{
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(isExistingSaved ? "Insurance updated" : "Insurance saved to patient record");
                            }
                        }["PatientFormDialog.useEffect"]).catch({
                            "PatientFormDialog.useEffect": ()=>{
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Failed to save insurance");
                            }
                        }["PatientFormDialog.useEffect"]).finally({
                            "PatientFormDialog.useEffect": ()=>{
                                pendingSaveRef.current.delete(i);
                                setSavingInsurances({
                                    "PatientFormDialog.useEffect": (prev)=>{
                                        const next = new Set(prev);
                                        next.delete(i);
                                        return next;
                                    }
                                }["PatientFormDialog.useEffect"]);
                            }
                        }["PatientFormDialog.useEffect"]);
                    }
                }
            }
        }
    }["PatientFormDialog.useEffect"], [
        isEdit,
        patient?.id,
        formData
    ]);
    const handleCountryChange = (country)=>{
        hasInteractedRef.current = true;
        setFormData((prev)=>({
                ...prev,
                contactInfo: {
                    ...prev.contactInfo,
                    email: prev.contactInfo?.email,
                    phone: prev.contactInfo?.phone,
                    address: {
                        country,
                        province: "",
                        district: "",
                        sector: "",
                        village: prev.contactInfo?.address?.village || "",
                        address: prev.contactInfo?.address?.address || ""
                    }
                }
            }));
    };
    const handleProvinceChange = (province)=>{
        hasInteractedRef.current = true;
        setFormData((prev)=>{
            const validDistricts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$location$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getRwandaDistricts"])(province);
            const currentDistrict = prev.contactInfo?.address?.district || "";
            const keepDistrict = validDistricts.includes(currentDistrict);
            return {
                ...prev,
                contactInfo: {
                    ...prev.contactInfo,
                    email: prev.contactInfo?.email,
                    phone: prev.contactInfo?.phone,
                    address: {
                        ...prev.contactInfo?.address,
                        country: "Rwanda",
                        province,
                        district: keepDistrict ? currentDistrict : "",
                        sector: keepDistrict ? prev.contactInfo?.address?.sector || "" : ""
                    }
                }
            };
        });
    };
    const handleDistrictChange = (district, province)=>{
        hasInteractedRef.current = true;
        setFormData((prev)=>{
            let resolvedProvince = province || prev.contactInfo?.address?.province || "";
            if (!resolvedProvince) {
                const allDistricts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$location$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAllRwandaDistricts"])();
                const found = allDistricts.find((d)=>d.district.toLowerCase() === district.toLowerCase());
                if (found) resolvedProvince = found.province;
            }
            const validSectors = resolvedProvince ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$location$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getRwandaSectors"])(resolvedProvince, district) : [];
            const keepSector = validSectors.includes(prev.contactInfo?.address?.sector || "");
            return {
                ...prev,
                contactInfo: {
                    ...prev.contactInfo,
                    email: prev.contactInfo?.email,
                    phone: prev.contactInfo?.phone,
                    address: {
                        ...prev.contactInfo?.address,
                        country: "Rwanda",
                        province: resolvedProvince,
                        district,
                        sector: keepSector ? prev.contactInfo?.address?.sector || "" : ""
                    }
                }
            };
        });
    };
    const handleSectorChange = (sector, district, province)=>{
        hasInteractedRef.current = true;
        setFormData((prev)=>{
            let resolvedDistrict = district || prev.contactInfo?.address?.district || "";
            let resolvedProvince = province || prev.contactInfo?.address?.province || "";
            if (!resolvedDistrict || !resolvedProvince) {
                const allSectors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$location$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAllRwandaSectors"])();
                const match = allSectors.find((s)=>s.sector.toLowerCase() === sector.toLowerCase() && (!district || s.district.toLowerCase() === district.toLowerCase()) && (!province || s.province.toLowerCase() === province.toLowerCase()));
                if (match) {
                    resolvedDistrict = match.district;
                    resolvedProvince = match.province;
                }
            }
            return {
                ...prev,
                contactInfo: {
                    ...prev.contactInfo,
                    email: prev.contactInfo?.email,
                    phone: prev.contactInfo?.phone,
                    address: {
                        ...prev.contactInfo?.address,
                        country: "Rwanda",
                        province: resolvedProvince,
                        district: resolvedDistrict,
                        sector,
                        cell: prev.contactInfo?.address?.cell || "",
                        village: prev.contactInfo?.address?.village || ""
                    }
                }
            };
        });
    };
    const handleCellChange = (cell, sector, district, province)=>{
        hasInteractedRef.current = true;
        setFormData((prev)=>{
            let resolvedSector = sector || prev.contactInfo?.address?.sector || "";
            let resolvedDistrict = district || prev.contactInfo?.address?.district || "";
            let resolvedProvince = province || prev.contactInfo?.address?.province || "";
            if (!resolvedSector || !resolvedDistrict || !resolvedProvince) {
                const found = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$location$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findRwandaCellInfo"])(cell, resolvedSector, resolvedDistrict, resolvedProvince) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$location$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findRwandaCellInfo"])(cell);
                if (found) {
                    resolvedSector = found.sector;
                    resolvedDistrict = found.district;
                    resolvedProvince = found.province;
                }
            }
            return {
                ...prev,
                contactInfo: {
                    ...prev.contactInfo,
                    email: prev.contactInfo?.email,
                    phone: prev.contactInfo?.phone,
                    address: {
                        ...prev.contactInfo?.address,
                        country: "Rwanda",
                        province: resolvedProvince,
                        district: resolvedDistrict,
                        sector: resolvedSector,
                        cell,
                        village: prev.contactInfo?.address?.village || ""
                    }
                }
            };
        });
    };
    const handleVillageChange = (village, cell, sector, district, province)=>{
        hasInteractedRef.current = true;
        setFormData((prev)=>{
            let resolvedCell = cell || prev.contactInfo?.address?.cell || "";
            let resolvedSector = sector || prev.contactInfo?.address?.sector || "";
            let resolvedDistrict = district || prev.contactInfo?.address?.district || "";
            let resolvedProvince = province || prev.contactInfo?.address?.province || "";
            if (!resolvedCell || !resolvedSector || !resolvedDistrict || !resolvedProvince) {
                const found = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$location$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findRwandaVillageInfo"])(village, resolvedCell, resolvedSector, resolvedDistrict, resolvedProvince) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$location$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findRwandaVillageInfo"])(village);
                if (found) {
                    resolvedCell = found.cell;
                    resolvedSector = found.sector;
                    resolvedDistrict = found.district;
                    resolvedProvince = found.province;
                }
            }
            return {
                ...prev,
                contactInfo: {
                    ...prev.contactInfo,
                    email: prev.contactInfo?.email,
                    phone: prev.contactInfo?.phone,
                    address: {
                        ...prev.contactInfo?.address,
                        country: "Rwanda",
                        province: resolvedProvince,
                        district: resolvedDistrict,
                        sector: resolvedSector,
                        cell: resolvedCell,
                        village
                    }
                }
            };
        });
    };
    // ── Notify parent of ALL form data changes (duplicate detection) ─────────
    // A single useEffect on formData ensures every handler — handleInputChange,
    // handleCountryChange, addInsurance, updateInsurance, removeInsurance, etc.
    // — automatically notifies the parent without needing individual calls.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PatientFormDialog.useEffect": ()=>{
            if (hasInteractedRef.current) {
                onFormChange?.(formData);
            }
        }
    }["PatientFormDialog.useEffect"], [
        formData,
        onFormChange
    ]);
    const loading = isEdit ? updateLoading : registerLoading;
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError("");
        // Inline field validation (shown below the fields, never as toasts).
        const nextErrors = {};
        const fullNameValue = (formData.name ?? [
            formData.firstName,
            formData.middleName,
            formData.lastName
        ].filter(Boolean).join(" ")).trim();
        if (!fullNameValue) {
            nextErrors["name"] = "Full name is required";
            nextErrors["firstName"] = "Full name is required";
        }
        if (!formData.dateOfBirth) {
            nextErrors["dateOfBirth"] = "Date of birth is required";
        } else {
            const dobValidation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateDateOfBirth"])(formData.dateOfBirth);
            if (!dobValidation.valid) {
                nextErrors["dateOfBirth"] = dobValidation.error || "Invalid date of birth";
            }
        }
        if (!formData.gender) {
            nextErrors["gender"] = "Gender is required";
        }
        if (Object.keys(nextErrors).length > 0) {
            setFieldErrors(nextErrors);
            return;
        }
        if (isEdit) {
            if (!patient?.id) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Patient ID not found");
                return;
            }
            try {
                const updateInput = nestedToFlat(formData);
                const result = await updatePatient(patient.id, updateInput);
                if (result.status === "SUCCESS") {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(result.message || "Patient updated successfully!");
                    if (onPatientSaved && result.data) {
                        onPatientSaved(patient.id, [], false, undefined, result.data);
                    }
                    onClose();
                } else {
                    const message = result.message || result.messages?.[0]?.text || "Patient update failed";
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(message);
                }
            } catch  {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Network error occurred");
            }
        } else {
            const hasInsurance = (formData.insurances?.length ?? 0) > 0;
            const dominantMemberRequired = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDominantMemberRequired"])(formData.dateOfBirth, hasInsurance);
            const insuranceErrors = {};
            for(let i = 0; i < (formData.insurances?.length || 0); i++){
                const insurance = formData.insurances[i];
                const missing = (v)=>!v?.trim();
                const prefix = `insurance.${i}`;
                if (missing(String(insurance.insuranceId)) || String(insurance.insuranceId) === "0") {
                    insuranceErrors[`${prefix}.provider`] = "Select an insurance provider";
                }
                if (missing(insurance.insuranceCardNumber)) {
                    insuranceErrors[`${prefix}.card`] = "Insurance card number is required";
                }
                if (missing(insurance.providingCompanyOrEmployer)) {
                    insuranceErrors[`${prefix}.employer`] = "Providing company or employer is required";
                }
                const isAdult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateAge"])(formData.dateOfBirth) >= 18;
                const isSelf = isAdult ? insurance.isSelf !== false : false;
                if (!isSelf) {
                    const phone = insurance.dominantMember?.phone?.trim();
                    if (phone && !/^\+?\d{7,15}$/.test(phone.replace(/\s+/g, ""))) {
                        insuranceErrors[`${prefix}.dominant`] = "Enter a valid phone number (7-15 digits, optional leading +)";
                    }
                    const dmResolved = insurance.dominantMember?.name ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$patient$2d$display$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["splitFullName"])(insurance.dominantMember.name) : {
                        firstName: insurance.dominantMember?.firstName?.trim() || "",
                        lastName: insurance.dominantMember?.lastName?.trim() || ""
                    };
                    const hasDmName = Boolean(insurance.dominantMember?.name?.trim() || dmResolved.firstName && dmResolved.lastName);
                    if (!hasDmName || missing(insurance.dominantMember?.phone)) {
                        insuranceErrors[`${prefix}.dominant`] = isAdult ? "Principal member full name and phone are required when patient is not the principal policyholder" : "Principal member full name and phone are required for patients 18 years or younger";
                    }
                }
            }
            if (Object.keys(insuranceErrors).length > 0) {
                setFieldErrors(insuranceErrors);
                return;
            }
            try {
                const result = await registerPatient(formData);
                if (result.status === "SUCCESS") {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(result.message || "Patient registered successfully!");
                    if (onPatientSaved && result.data?.patient?.id) {
                        onPatientSaved(result.data.patient.id, result.data.linkedInsurances || [], false, result.data);
                    }
                    setFormData(EMPTY_FORM);
                    onClose();
                } else {
                    const message = result.message || result.messages?.[0]?.text || "Patient registration failed";
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(message);
                }
            } catch  {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Network error occurred");
            }
        }
    };
    const submitLabel = isEdit ? loading ? "Saving..." : "Save Changes" : loading ? "Registering..." : "Register";
    // Add Insurance stays disabled while an existing entry is unfilled
    const canAddInsurance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canAddNewInsurance"])(formData.insurances, formData.dateOfBirth);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 p-3 mb-4 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive",
                children: error
            }, void 0, false, {
                fileName: "[project]/components/patient/patient-form-dialog.tsx",
                lineNumber: 835,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit,
                className: "space-y-2",
                noValidate: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$patient$2f$patient$2d$form$2d$fields$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        formData: formData,
                        onFieldChange: handleInputChange,
                        onFieldBlur: onFieldBlur,
                        onCountryChange: handleCountryChange,
                        onProvinceChange: handleProvinceChange,
                        onDistrictChange: handleDistrictChange,
                        onSectorChange: handleSectorChange,
                        onCellChange: handleCellChange,
                        onVillageChange: handleVillageChange,
                        onUpdateInsurance: updateInsurance,
                        onRemoveInsurance: removeInsurance,
                        availableInsurances: insurances,
                        loading: loading,
                        fieldErrors: fieldErrors,
                        dateError: fieldErrors["dateOfBirth"]
                    }, void 0, false, {
                        fileName: "[project]/components/patient/patient-form-dialog.tsx",
                        lineNumber: 841,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "sticky bottom-0 z-10 -mx-1 flex flex-col gap-2 border-t border-border/30 bg-card/95 px-1 pt-2 backdrop-blur-sm dark:bg-card/95 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:pt-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: addInsurance,
                                disabled: !canAddInsurance,
                                title: !canAddInsurance ? "Please complete all required fields on the current insurance first" : undefined,
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-full px-4 py-2 text-sm font-medium shadow-md transition-all duration-200 flex-1 sm:flex-none", canAddInsurance ? "bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] text-white hover:opacity-90 cursor-pointer" : "bg-muted text-muted-foreground border border-border/60 opacity-60 cursor-not-allowed"),
                                children: "+ Add Insurance"
                            }, void 0, false, {
                                fileName: "[project]/components/patient/patient-form-dialog.tsx",
                                lineNumber: 863,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: onClose,
                                        className: "rounded-full px-5 py-2 bg-background dark:bg-gray-900 border border-border/70 text-foreground hover:bg-muted/40 dark:hover:bg-muted/50 shadow-lg text-sm flex-1 sm:flex-none",
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/components/patient/patient-form-dialog.tsx",
                                        lineNumber: 882,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        disabled: loading,
                                        className: "rounded-full px-8 py-2 bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] text-white shadow-lg hover:opacity-90 transition-all duration-200 text-sm flex-1 sm:flex-none disabled:opacity-40 disabled:cursor-not-allowed",
                                        children: submitLabel
                                    }, void 0, false, {
                                        fileName: "[project]/components/patient/patient-form-dialog.tsx",
                                        lineNumber: 889,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/patient/patient-form-dialog.tsx",
                                lineNumber: 881,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/patient/patient-form-dialog.tsx",
                        lineNumber: 862,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/patient/patient-form-dialog.tsx",
                lineNumber: 840,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(PatientFormDialog, "VI09skm21xKFzE8p9b0GgwN+j7s=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$patients$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRegisterPatient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$patients$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUpdatePatient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$patients$2f$use$2d$save$2d$patient$2d$insurance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSavePatientInsurance"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$insurances$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInsurances"]
    ];
});
_c = PatientFormDialog;
var _c;
__turbopack_context__.k.register(_c, "PatientFormDialog");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/patient-edit-modal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PatientEditModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$patient$2f$patient$2d$form$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/patient/patient-form-dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$patients$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/patients/hooks.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function PatientEditModal({ isOpen, onClose, patient, onPatientUpdated }) {
    _s();
    const patientId = isOpen && patient?.id ? String(patient.id) : null;
    const { patient: loadedPatient, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$patients$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePatient"])(patientId);
    // Merge loaded patient (which has complete patientInsurances) with initial prop
    const effectivePatient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PatientEditModal.useMemo[effectivePatient]": ()=>{
            if (!patient) return null;
            if (!loadedPatient) return patient;
            return {
                ...patient,
                ...loadedPatient,
                patientInsurances: loadedPatient.patientInsurances && loadedPatient.patientInsurances.length > 0 ? loadedPatient.patientInsurances : patient.patientInsurances || []
            };
        }
    }["PatientEditModal.useMemo[effectivePatient]"], [
        patient,
        loadedPatient
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
        open: isOpen,
        onOpenChange: onClose,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
            showCloseButton: false,
            className: "max-w-full sm:max-w-[1180px] max-h-[calc(100dvh-2rem)] overflow-hidden backdrop-blur-2xl bg-card/95 dark:bg-card/95 text-card-foreground border border-border/80 rounded-3xl shadow-2xl p-2 sm:p-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                    className: "sr-only",
                    children: "Edit Patient"
                }, void 0, false, {
                    fileName: "[project]/components/patient-edit-modal.tsx",
                    lineNumber: 46,
                    columnNumber: 9
                }, this),
                loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                    className: "pointer-events-none absolute right-4 top-4 z-10 h-4 w-4 animate-spin text-muted-foreground"
                }, void 0, false, {
                    fileName: "[project]/components/patient-edit-modal.tsx",
                    lineNumber: 48,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-h-[calc(100dvh-4rem)] min-h-0 overflow-y-auto scrollbar-hide px-1",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$patient$2f$patient$2d$form$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        isOpen: isOpen,
                        onClose: onClose,
                        mode: "edit",
                        patient: effectivePatient,
                        onPatientSaved: (_id, _insurances, _proceed, _visit, updatedPatient)=>{
                            if (updatedPatient && onPatientUpdated) {
                                onPatientUpdated(updatedPatient);
                            }
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/patient-edit-modal.tsx",
                        lineNumber: 51,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/patient-edit-modal.tsx",
                    lineNumber: 50,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/patient-edit-modal.tsx",
            lineNumber: 42,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/patient-edit-modal.tsx",
        lineNumber: 41,
        columnNumber: 5
    }, this);
}
_s(PatientEditModal, "SHd4PZFxruQ4apLSQZUGEi+cupo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$patients$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePatient"]
    ];
});
_c = PatientEditModal;
var _c;
__turbopack_context__.k.register(_c, "PatientEditModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/patient-edit-modal.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/components/patient-edit-modal.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=_75f5f24f._.js.map