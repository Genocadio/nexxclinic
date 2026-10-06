(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/patient-history-side-pane.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PatientHistorySidePane
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/react/hooks/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$visits$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/queries/visits.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/filter.js [app-client] (ecmascript) <export default as Filter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-toastify/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$departments$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/departments/hooks.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function PatientHistorySidePane({ patientId, currentVisitId, currentVisitDepartmentId, onPreviewDepartmentAnswers, onClose }) {
    _s();
    const [filters, setFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        selectedDepartments: []
    });
    const [hoveredDepartment, setHoveredDepartment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [expandedDepartment, setExpandedDepartment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showFilters, setShowFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const lastErrorMessageRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const { departments: clinicDepartments, loading: clinicDepartmentsLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$departments$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDepartments"])({
        skip: !showFilters
    });
    const historyInput = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PatientHistorySidePane.useMemo[historyInput]": ()=>{
            const input = {
                page: 0,
                size: 100
            };
            if (filters.selectedDepartments.length > 0) {
                input.departmentIds = filters.selectedDepartments;
            }
            if (filters.fromType && filters.fromValue && !filters.toType) {
                if (filters.fromType === "year") {
                    const parsedYear = Number(filters.fromValue);
                    if (!Number.isNaN(parsedYear)) input.year = parsedYear;
                }
                if (filters.fromType === "month") {
                    const [yearPart, monthPart] = filters.fromValue.split("-");
                    const parsedYear = Number(yearPart);
                    const parsedMonth = Number(monthPart);
                    if (!Number.isNaN(parsedYear) && !Number.isNaN(parsedMonth)) {
                        input.year = parsedYear;
                        input.month = parsedMonth;
                    }
                }
                if (filters.fromType === "day") {
                    const selectedDate = new Date(filters.fromValue);
                    if (!Number.isNaN(selectedDate.getTime())) {
                        input.day = selectedDate.getDate();
                        input.month = selectedDate.getMonth() + 1;
                        input.year = selectedDate.getFullYear();
                    }
                }
            }
            if (filters.fromType && filters.fromValue && filters.toType && filters.toValue) {
                if (filters.fromType === "year" && filters.toType === "year") {
                    const startYear = Number(filters.fromValue);
                    const endYear = Number(filters.toValue);
                    if (!Number.isNaN(startYear)) input.startYear = startYear;
                    if (!Number.isNaN(endYear)) input.endYear = endYear;
                }
                if (filters.fromType === "month" && filters.toType === "month") {
                    input.startMonth = filters.fromValue;
                    input.endMonth = filters.toValue;
                }
                if (filters.fromType === "day" && filters.toType === "day") {
                    input.startDate = filters.fromValue;
                    input.endDate = filters.toValue;
                }
            }
            return input;
        }
    }["PatientHistorySidePane.useMemo[historyInput]"], [
        filters
    ]);
    const { data: historyData, loading: historyLoading, error: historyError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$visits$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GET_PATIENT_HISTORY_QUERY"], {
        variables: {
            patientId,
            input: historyInput
        },
        skip: !patientId
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PatientHistorySidePane.useEffect": ()=>{
            const message = historyError?.message?.trim();
            if (!message || lastErrorMessageRef.current === message) return;
            lastErrorMessageRef.current = message;
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(message);
        }
    }["PatientHistorySidePane.useEffect"], [
        historyError
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PatientHistorySidePane.useEffect": ()=>{
            lastErrorMessageRef.current = null;
        }
    }["PatientHistorySidePane.useEffect"], [
        patientId
    ]);
    const visits = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PatientHistorySidePane.useMemo[visits]": ()=>{
            return historyData?.getPatientHistory?.data || [];
        }
    }["PatientHistorySidePane.useMemo[visits]"], [
        historyData
    ]);
    const currentVisit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PatientHistorySidePane.useMemo[currentVisit]": ()=>visits.find({
                "PatientHistorySidePane.useMemo[currentVisit]": (visit)=>visit.id === currentVisitId
            }["PatientHistorySidePane.useMemo[currentVisit]"]) || null
    }["PatientHistorySidePane.useMemo[currentVisit]"], [
        visits,
        currentVisitId
    ]);
    const patient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PatientHistorySidePane.useMemo[patient]": ()=>currentVisit?.patient || visits[0]?.patient || null
    }["PatientHistorySidePane.useMemo[patient]"], [
        currentVisit,
        visits
    ]);
    const allDepartments = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PatientHistorySidePane.useMemo[allDepartments]": ()=>{
            return clinicDepartments.map({
                "PatientHistorySidePane.useMemo[allDepartments]": (dept)=>({
                        id: String(dept.id),
                        name: dept.name
                    })
            }["PatientHistorySidePane.useMemo[allDepartments]"]);
        }
    }["PatientHistorySidePane.useMemo[allDepartments]"], [
        clinicDepartments
    ]);
    // Filter visits based on selected criteria
    const filteredVisits = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PatientHistorySidePane.useMemo[filteredVisits]": ()=>{
            let filtered = visits.slice();
            // Filter by selected departments
            if (filters.selectedDepartments.length > 0) {
                filtered = filtered.filter({
                    "PatientHistorySidePane.useMemo[filteredVisits]": (visit)=>visit.departments?.some({
                            "PatientHistorySidePane.useMemo[filteredVisits]": (dept)=>filters.selectedDepartments.includes(dept.department?.id || "")
                        }["PatientHistorySidePane.useMemo[filteredVisits]"])
                }["PatientHistorySidePane.useMemo[filteredVisits]"]);
            }
            // Sort by date, newest first
            return filtered.sort({
                "PatientHistorySidePane.useMemo[filteredVisits]": (a, b)=>new Date(b.visitDate || "").getTime() - new Date(a.visitDate || "").getTime()
            }["PatientHistorySidePane.useMemo[filteredVisits]"]);
        }
    }["PatientHistorySidePane.useMemo[filteredVisits]"], [
        visits,
        currentVisitId,
        filters
    ]);
    const toggleDepartmentFilter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PatientHistorySidePane.useCallback[toggleDepartmentFilter]": (deptId)=>{
            setFilters({
                "PatientHistorySidePane.useCallback[toggleDepartmentFilter]": (prev)=>({
                        ...prev,
                        selectedDepartments: prev.selectedDepartments.includes(deptId) ? prev.selectedDepartments.filter({
                            "PatientHistorySidePane.useCallback[toggleDepartmentFilter]": (id)=>id !== deptId
                        }["PatientHistorySidePane.useCallback[toggleDepartmentFilter]"]) : [
                            ...prev.selectedDepartments,
                            deptId
                        ]
                    })
            }["PatientHistorySidePane.useCallback[toggleDepartmentFilter]"]);
        }
    }["PatientHistorySidePane.useCallback[toggleDepartmentFilter]"], []);
    const handleFromTypeChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PatientHistorySidePane.useCallback[handleFromTypeChange]": (type)=>{
            setFilters({
                "PatientHistorySidePane.useCallback[handleFromTypeChange]": (prev)=>({
                        ...prev,
                        fromType: prev.fromType === type ? undefined : type,
                        fromValue: prev.fromType === type ? undefined : prev.fromValue,
                        toType: prev.fromType === type ? undefined : type,
                        toValue: prev.fromType === type ? undefined : undefined
                    })
            }["PatientHistorySidePane.useCallback[handleFromTypeChange]"]);
        }
    }["PatientHistorySidePane.useCallback[handleFromTypeChange]"], []);
    const handleToTypeChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PatientHistorySidePane.useCallback[handleToTypeChange]": (type)=>{
            setFilters({
                "PatientHistorySidePane.useCallback[handleToTypeChange]": (prev)=>{
                    if (!prev.fromType || prev.fromType !== type) return prev;
                    return {
                        ...prev,
                        toType: prev.toType === type ? undefined : type,
                        toValue: prev.toType === type ? undefined : prev.toValue
                    };
                }
            }["PatientHistorySidePane.useCallback[handleToTypeChange]"]);
        }
    }["PatientHistorySidePane.useCallback[handleToTypeChange]"], []);
    const currentYear = new Date().getFullYear();
    const yearOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PatientHistorySidePane.useMemo[yearOptions]": ()=>{
            const startYear = Math.max(1900, currentYear - 80);
            return Array.from({
                length: currentYear - startYear + 1
            }, {
                "PatientHistorySidePane.useMemo[yearOptions]": (_, index)=>currentYear - index
            }["PatientHistorySidePane.useMemo[yearOptions]"]);
        }
    }["PatientHistorySidePane.useMemo[yearOptions]"], [
        currentYear
    ]);
    const monthOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PatientHistorySidePane.useMemo[monthOptions]": ()=>Array.from({
                length: 12
            }, {
                "PatientHistorySidePane.useMemo[monthOptions]": (_, index)=>index + 1
            }["PatientHistorySidePane.useMemo[monthOptions]"])
    }["PatientHistorySidePane.useMemo[monthOptions]"], []);
    const parseDateValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PatientHistorySidePane.useCallback[parseDateValue]": (value)=>{
            const now = new Date();
            const [year = String(now.getFullYear()), month = String(now.getMonth() + 1).padStart(2, "0"), day = String(now.getDate()).padStart(2, "0")] = String(value || "").split("-");
            return {
                year: Number(year) || now.getFullYear(),
                month: Number(month) || now.getMonth() + 1,
                day: Number(day) || now.getDate()
            };
        }
    }["PatientHistorySidePane.useCallback[parseDateValue]"], []);
    const daysInMonth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PatientHistorySidePane.useCallback[daysInMonth]": (year, month)=>new Date(year, month, 0).getDate()
    }["PatientHistorySidePane.useCallback[daysInMonth]"], []);
    const composeValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PatientHistorySidePane.useCallback[composeValue]": (type, year, month, day)=>{
            if (type === "year") return String(year);
            if (type === "month") return `${year}-${String(month).padStart(2, "0")}`;
            return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        }
    }["PatientHistorySidePane.useCallback[composeValue]"], []);
    const formatPatientAge = (dateOfBirth)=>{
        if (!dateOfBirth) return "Unknown age";
        const birthDate = new Date(dateOfBirth);
        if (Number.isNaN(birthDate.getTime())) return "Unknown age";
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || monthDiff === 0 && today.getDate() < birthDate.getDate()) {
            age -= 1;
        }
        return `${age} years`;
    };
    const formatDate = (dateString)=>{
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };
    const handleDepartmentClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PatientHistorySidePane.useCallback[handleDepartmentClick]": (dept, visitId)=>{
            if (!visitId) return;
            const visit = visits.find({
                "PatientHistorySidePane.useCallback[handleDepartmentClick].visit": (item)=>item.id === visitId
            }["PatientHistorySidePane.useCallback[handleDepartmentClick].visit"]);
            const visitDepartmentId = String(dept.id || "");
            const answerId = String(dept.answerId || "");
            if (onPreviewDepartmentAnswers && visitDepartmentId && answerId) {
                onPreviewDepartmentAnswers({
                    visitId,
                    visitDepartmentId,
                    answerId,
                    departmentName: dept.department?.name || "Department",
                    patientName: visit?.patient ? `${visit.patient.firstName || ""} ${visit.patient.lastName || ""}`.trim() || "Unknown patient" : "Unknown patient",
                    visitDepartment: dept
                });
                return;
            }
            setExpandedDepartment({
                visitDepartmentId,
                visitId,
                departmentName: dept.department?.name || "Department",
                diagnostics: (dept.diagnostics || []).map({
                    "PatientHistorySidePane.useCallback[handleDepartmentClick]": (diag)=>({
                            id: String(diag.id || ""),
                            diagnosisName: diag.diagnosisName || "Unknown diagnosis",
                            icd11Code: diag.icd11Code || undefined
                        })
                }["PatientHistorySidePane.useCallback[handleDepartmentClick]"]),
                medications: (dept.medications || []).map({
                    "PatientHistorySidePane.useCallback[handleDepartmentClick]": (med)=>({
                            id: String(med.id || ""),
                            medicationName: med.medicationName || "Unknown medication",
                            instructions: med.instructions || ""
                        })
                }["PatientHistorySidePane.useCallback[handleDepartmentClick]"])
            });
        }
    }["PatientHistorySidePane.useCallback[handleDepartmentClick]"], [
        onPreviewDepartmentAnswers,
        visits
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed top-0 bottom-0 left-0 w-[min(420px,100vw)] bg-background border-r border-border shadow-2xl z-[89] flex flex-col overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between p-4 border-b border-border flex-shrink-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-semibold text-card-foreground",
                                children: patient ? `${patient.firstName || ""} ${patient.lastName || ""}`.trim() || "Name of patient" : "Name of patient"
                            }, void 0, false, {
                                fileName: "[project]/components/patient-history-side-pane.tsx",
                                lineNumber: 351,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-muted-foreground mt-0.5",
                                children: patient ? `${formatPatientAge(patient.dateOfBirth)} • ${patient.gender || "Unknown sex"}` : "Unknown age • Unknown sex"
                            }, void 0, false, {
                                fileName: "[project]/components/patient-history-side-pane.tsx",
                                lineNumber: 357,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-muted-foreground mt-0.5",
                                children: [
                                    filteredVisits.length,
                                    " of ",
                                    visits.length,
                                    " visits"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/patient-history-side-pane.tsx",
                                lineNumber: 362,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/patient-history-side-pane.tsx",
                        lineNumber: 350,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onClose,
                        className: "p-2 rounded-lg hover:bg-muted/70 text-muted-foreground transition-colors",
                        "aria-label": "Close history",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                            className: "w-4 h-4"
                        }, void 0, false, {
                            fileName: "[project]/components/patient-history-side-pane.tsx",
                            lineNumber: 371,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/patient-history-side-pane.tsx",
                        lineNumber: 366,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/patient-history-side-pane.tsx",
                lineNumber: 349,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 py-2 border-b border-border flex-shrink-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setShowFilters(!showFilters),
                        className: "flex items-center gap-2 flex-1 px-3 py-2 rounded-lg hover:bg-muted/50 bg-muted/30 transition-colors text-sm font-medium text-card-foreground",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__["Filter"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/components/patient-history-side-pane.tsx",
                                lineNumber: 382,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Filters"
                            }, void 0, false, {
                                fileName: "[project]/components/patient-history-side-pane.tsx",
                                lineNumber: 383,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                className: `w-4 h-4 ml-auto transition-transform ${showFilters ? "rotate-180" : ""}`
                            }, void 0, false, {
                                fileName: "[project]/components/patient-history-side-pane.tsx",
                                lineNumber: 384,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/patient-history-side-pane.tsx",
                        lineNumber: 378,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/patient-history-side-pane.tsx",
                    lineNumber: 377,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/patient-history-side-pane.tsx",
                lineNumber: 376,
                columnNumber: 7
            }, this),
            showFilters && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 py-3 border-b border-border space-y-4 flex-shrink-0 bg-muted",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "text-xs font-semibold text-foreground uppercase tracking-wider mb-2 block",
                                children: "Departments"
                            }, void 0, false, {
                                fileName: "[project]/components/patient-history-side-pane.tsx",
                                lineNumber: 398,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2 max-h-[150px] overflow-y-auto",
                                children: clinicDepartmentsLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-muted-foreground",
                                    children: "Loading departments..."
                                }, void 0, false, {
                                    fileName: "[project]/components/patient-history-side-pane.tsx",
                                    lineNumber: 403,
                                    columnNumber: 17
                                }, this) : allDepartments.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-muted-foreground",
                                    children: "No departments found"
                                }, void 0, false, {
                                    fileName: "[project]/components/patient-history-side-pane.tsx",
                                    lineNumber: 407,
                                    columnNumber: 17
                                }, this) : allDepartments.map((dept)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "flex items-center gap-2 cursor-pointer",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                checked: filters.selectedDepartments.includes(dept.id),
                                                onChange: ()=>toggleDepartmentFilter(dept.id),
                                                className: "w-4 h-4 rounded border-border"
                                            }, void 0, false, {
                                                fileName: "[project]/components/patient-history-side-pane.tsx",
                                                lineNumber: 416,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm text-card-foreground",
                                                children: dept.name
                                            }, void 0, false, {
                                                fileName: "[project]/components/patient-history-side-pane.tsx",
                                                lineNumber: 422,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, dept.id, true, {
                                        fileName: "[project]/components/patient-history-side-pane.tsx",
                                        lineNumber: 412,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/patient-history-side-pane.tsx",
                                lineNumber: 401,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/patient-history-side-pane.tsx",
                        lineNumber: 397,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-foreground",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                        className: "h-3.5 w-3.5"
                                    }, void 0, false, {
                                        fileName: "[project]/components/patient-history-side-pane.tsx",
                                        lineNumber: 434,
                                        columnNumber: 15
                                    }, this),
                                    "Date Filter"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/patient-history-side-pane.tsx",
                                lineNumber: 433,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3 rounded-lg border border-border bg-background p-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
                                                children: "From"
                                            }, void 0, false, {
                                                fileName: "[project]/components/patient-history-side-pane.tsx",
                                                lineNumber: 439,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-3 gap-1",
                                                children: [
                                                    "year",
                                                    "month",
                                                    "day"
                                                ].map((type)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>handleFromTypeChange(type),
                                                        className: `rounded-md px-2 py-1 text-[11px] font-medium capitalize transition-colors ${filters.fromType === type ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"}`,
                                                        children: [
                                                            "from ",
                                                            type
                                                        ]
                                                    }, `from-${type}`, true, {
                                                        fileName: "[project]/components/patient-history-side-pane.tsx",
                                                        lineNumber: 444,
                                                        columnNumber: 21
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/components/patient-history-side-pane.tsx",
                                                lineNumber: 442,
                                                columnNumber: 17
                                            }, this),
                                            filters.fromType && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-2",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-1 gap-2 sm:grid-cols-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                            value: parseDateValue(filters.fromValue).year,
                                                            onChange: (e)=>{
                                                                const year = Number(e.target.value);
                                                                const parts = parseDateValue(filters.fromValue);
                                                                const month = parts.month;
                                                                const day = Math.min(parts.day, daysInMonth(year, month));
                                                                setFilters((prev)=>({
                                                                        ...prev,
                                                                        fromValue: composeValue(filters.fromType, year, month, day)
                                                                    }));
                                                            },
                                                            className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground",
                                                            children: yearOptions.map((year)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: year,
                                                                    children: year
                                                                }, `from-year-${year}`, false, {
                                                                    fileName: "[project]/components/patient-history-side-pane.tsx",
                                                                    lineNumber: 485,
                                                                    columnNumber: 27
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/patient-history-side-pane.tsx",
                                                            lineNumber: 462,
                                                            columnNumber: 23
                                                        }, this),
                                                        filters.fromType !== "year" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                            value: parseDateValue(filters.fromValue).month,
                                                            onChange: (e)=>{
                                                                const month = Number(e.target.value);
                                                                const parts = parseDateValue(filters.fromValue);
                                                                const day = Math.min(parts.day, daysInMonth(parts.year, month));
                                                                setFilters((prev)=>({
                                                                        ...prev,
                                                                        fromValue: composeValue(filters.fromType, parts.year, month, day)
                                                                    }));
                                                            },
                                                            className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground",
                                                            children: monthOptions.map((month)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: month,
                                                                    children: new Date(0, month - 1).toLocaleString("en-US", {
                                                                        month: "short"
                                                                    })
                                                                }, `from-month-${month}`, false, {
                                                                    fileName: "[project]/components/patient-history-side-pane.tsx",
                                                                    lineNumber: 514,
                                                                    columnNumber: 29
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/patient-history-side-pane.tsx",
                                                            lineNumber: 492,
                                                            columnNumber: 25
                                                        }, this),
                                                        filters.fromType === "day" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                            value: parseDateValue(filters.fromValue).day,
                                                            onChange: (e)=>{
                                                                const day = Number(e.target.value);
                                                                const parts = parseDateValue(filters.fromValue);
                                                                setFilters((prev)=>({
                                                                        ...prev,
                                                                        fromValue: composeValue("day", parts.year, parts.month, day)
                                                                    }));
                                                            },
                                                            className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground",
                                                            children: Array.from({
                                                                length: daysInMonth(parseDateValue(filters.fromValue).year, parseDateValue(filters.fromValue).month)
                                                            }, (_, index)=>index + 1).map((day)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: day,
                                                                    children: day
                                                                }, `from-day-${day}`, false, {
                                                                    fileName: "[project]/components/patient-history-side-pane.tsx",
                                                                    lineNumber: 550,
                                                                    columnNumber: 29
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/patient-history-side-pane.tsx",
                                                            lineNumber: 524,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/patient-history-side-pane.tsx",
                                                    lineNumber: 461,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/patient-history-side-pane.tsx",
                                                lineNumber: 460,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/patient-history-side-pane.tsx",
                                        lineNumber: 438,
                                        columnNumber: 15
                                    }, this),
                                    filters.fromType && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
                                                children: "To"
                                            }, void 0, false, {
                                                fileName: "[project]/components/patient-history-side-pane.tsx",
                                                lineNumber: 563,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-3 gap-1",
                                                children: [
                                                    "year",
                                                    "month",
                                                    "day"
                                                ].map((type)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>handleToTypeChange(type),
                                                        disabled: type !== filters.fromType,
                                                        className: `rounded-md px-2 py-1 text-[11px] font-medium capitalize transition-colors ${type !== filters.fromType ? "cursor-not-allowed bg-muted/40 text-muted-foreground/50" : filters.toType === type ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"}`,
                                                        children: [
                                                            "to ",
                                                            type
                                                        ]
                                                    }, `to-${type}`, true, {
                                                        fileName: "[project]/components/patient-history-side-pane.tsx",
                                                        lineNumber: 568,
                                                        columnNumber: 23
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/components/patient-history-side-pane.tsx",
                                                lineNumber: 566,
                                                columnNumber: 19
                                            }, this),
                                            filters.toType && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-1 gap-2 sm:grid-cols-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        value: parseDateValue(filters.toValue).year,
                                                        onChange: (e)=>{
                                                            const year = Number(e.target.value);
                                                            const parts = parseDateValue(filters.toValue);
                                                            const month = parts.month;
                                                            const day = Math.min(parts.day, daysInMonth(year, month));
                                                            setFilters((prev)=>({
                                                                    ...prev,
                                                                    toValue: composeValue(filters.toType, year, month, day)
                                                                }));
                                                        },
                                                        className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground",
                                                        children: yearOptions.map((year)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: year,
                                                                children: year
                                                            }, `to-year-${year}`, false, {
                                                                fileName: "[project]/components/patient-history-side-pane.tsx",
                                                                lineNumber: 611,
                                                                columnNumber: 27
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/patient-history-side-pane.tsx",
                                                        lineNumber: 588,
                                                        columnNumber: 23
                                                    }, this),
                                                    filters.toType !== "year" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        value: parseDateValue(filters.toValue).month,
                                                        onChange: (e)=>{
                                                            const month = Number(e.target.value);
                                                            const parts = parseDateValue(filters.toValue);
                                                            const day = Math.min(parts.day, daysInMonth(parts.year, month));
                                                            setFilters((prev)=>({
                                                                    ...prev,
                                                                    toValue: composeValue(filters.toType, parts.year, month, day)
                                                                }));
                                                        },
                                                        className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground",
                                                        children: monthOptions.map((month)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: month,
                                                                children: new Date(0, month - 1).toLocaleString("en-US", {
                                                                    month: "short"
                                                                })
                                                            }, `to-month-${month}`, false, {
                                                                fileName: "[project]/components/patient-history-side-pane.tsx",
                                                                lineNumber: 640,
                                                                columnNumber: 29
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/patient-history-side-pane.tsx",
                                                        lineNumber: 618,
                                                        columnNumber: 25
                                                    }, this),
                                                    filters.toType === "day" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        value: parseDateValue(filters.toValue).day,
                                                        onChange: (e)=>{
                                                            const day = Number(e.target.value);
                                                            const parts = parseDateValue(filters.toValue);
                                                            setFilters((prev)=>({
                                                                    ...prev,
                                                                    toValue: composeValue("day", parts.year, parts.month, day)
                                                                }));
                                                        },
                                                        className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground",
                                                        children: Array.from({
                                                            length: daysInMonth(parseDateValue(filters.toValue).year, parseDateValue(filters.toValue).month)
                                                        }, (_, index)=>index + 1).map((day)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: day,
                                                                children: day
                                                            }, `to-day-${day}`, false, {
                                                                fileName: "[project]/components/patient-history-side-pane.tsx",
                                                                lineNumber: 676,
                                                                columnNumber: 29
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/patient-history-side-pane.tsx",
                                                        lineNumber: 650,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/patient-history-side-pane.tsx",
                                                lineNumber: 587,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/patient-history-side-pane.tsx",
                                        lineNumber: 562,
                                        columnNumber: 17
                                    }, this),
                                    (filters.fromType || filters.selectedDepartments.length > 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setFilters({
                                                selectedDepartments: []
                                            });
                                        },
                                        className: "w-full rounded-lg bg-secondary px-3 py-2 text-xs font-medium text-secondary-foreground transition-colors hover:opacity-90",
                                        children: "Clear All Filters"
                                    }, void 0, false, {
                                        fileName: "[project]/components/patient-history-side-pane.tsx",
                                        lineNumber: 688,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/patient-history-side-pane.tsx",
                                lineNumber: 437,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/patient-history-side-pane.tsx",
                        lineNumber: 432,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/patient-history-side-pane.tsx",
                lineNumber: 395,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto",
                children: historyLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center h-full",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-muted-foreground",
                        children: "Loading history..."
                    }, void 0, false, {
                        fileName: "[project]/components/patient-history-side-pane.tsx",
                        lineNumber: 706,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/patient-history-side-pane.tsx",
                    lineNumber: 705,
                    columnNumber: 11
                }, this) : filteredVisits.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center h-full px-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-muted-foreground text-center",
                        children: visits.length === 0 ? "No previous visits found" : "No visits match your filters"
                    }, void 0, false, {
                        fileName: "[project]/components/patient-history-side-pane.tsx",
                        lineNumber: 710,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/patient-history-side-pane.tsx",
                    lineNumber: 709,
                    columnNumber: 11
                }, this) : !expandedDepartment ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-3 space-y-2",
                    children: filteredVisits.map((visit)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "border border-border rounded-lg p-3 bg-card hover:bg-muted transition-colors",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-start justify-between gap-2 mb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm font-semibold text-card-foreground",
                                                    children: formatDate(visit.visitDate)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/patient-history-side-pane.tsx",
                                                    lineNumber: 725,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-muted-foreground mt-0.5",
                                                    children: visit.patient ? `${visit.patient.firstName || ""} ${visit.patient.lastName || ""}`.trim() || "Unknown patient" : "Unknown patient"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/patient-history-side-pane.tsx",
                                                    lineNumber: 728,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-muted-foreground mt-0.5",
                                                    children: [
                                                        visit.departments?.length || 0,
                                                        " department(s)"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/patient-history-side-pane.tsx",
                                                    lineNumber: 734,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/patient-history-side-pane.tsx",
                                            lineNumber: 724,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col items-end gap-1",
                                            children: [
                                                visit.id === currentVisitId && !currentVisitDepartmentId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "px-2 py-1 rounded text-[10px] font-semibold uppercase tracking-wide whitespace-nowrap bg-primary text-primary-foreground",
                                                    children: "Current Visit"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/patient-history-side-pane.tsx",
                                                    lineNumber: 741,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${visit.status === "COMPLETED" ? "bg-primary/20 text-primary" : visit.status === "IN_PROGRESS" ? "bg-accent/20 text-accent" : "bg-secondary/20 text-secondary"}`,
                                                    children: visit.status.replace(/_/g, " ")
                                                }, void 0, false, {
                                                    fileName: "[project]/components/patient-history-side-pane.tsx",
                                                    lineNumber: 745,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/patient-history-side-pane.tsx",
                                            lineNumber: 738,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/patient-history-side-pane.tsx",
                                    lineNumber: 723,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-1.5 mt-2",
                                    children: visit.departments?.map((dept)=>{
                                        const isCurrentDepartment = visit.id === currentVisitId && dept.id === currentVisitDepartmentId;
                                        const hasPreviewAnswer = Boolean(dept.answerId);
                                        const disableDepartmentEntry = isCurrentDepartment || !hasPreviewAnswer;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative group",
                                            onMouseEnter: ()=>{
                                                if (disableDepartmentEntry) return;
                                                setHoveredDepartment(dept.id || "");
                                            },
                                            onMouseLeave: ()=>setHoveredDepartment(null),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleDepartmentClick(dept, visit.id || ""),
                                                    disabled: disableDepartmentEntry,
                                                    className: `w-full flex items-center justify-between px-2 py-1.5 rounded text-xs bg-muted text-card-foreground group transition-colors ${disableDepartmentEntry ? "cursor-not-allowed opacity-50" : "hover:bg-accent"}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "flex items-center gap-2 font-medium",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: dept.department?.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/patient-history-side-pane.tsx",
                                                                    lineNumber: 791,
                                                                    columnNumber: 29
                                                                }, this),
                                                                isCurrentDepartment && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground",
                                                                    children: "Current"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/patient-history-side-pane.tsx",
                                                                    lineNumber: 793,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/patient-history-side-pane.tsx",
                                                            lineNumber: 790,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                            className: `w-3 h-3 transition-opacity ${disableDepartmentEntry ? "opacity-0" : "opacity-0 group-hover:opacity-100"}`
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/patient-history-side-pane.tsx",
                                                            lineNumber: 798,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/patient-history-side-pane.tsx",
                                                    lineNumber: 779,
                                                    columnNumber: 25
                                                }, this),
                                                hoveredDepartment === dept.id && (dept.diagnostics?.length || 0) + (dept.medications?.length || 0) > 0 && !disableDepartmentEntry && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute left-0 top-full mt-1 z-[150] bg-popover border border-border rounded-lg shadow-lg p-3 w-48 pointer-events-none",
                                                    children: [
                                                        dept.diagnostics && dept.diagnostics.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mb-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs font-semibold text-foreground mb-1",
                                                                    children: "Diagnostics:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/patient-history-side-pane.tsx",
                                                                    lineNumber: 812,
                                                                    columnNumber: 37
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                                    className: "text-xs text-muted-foreground space-y-0.5",
                                                                    children: dept.diagnostics.map((diag)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                            children: [
                                                                                "• ",
                                                                                diag.diagnosisName,
                                                                                diag.icd11Code && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-muted-foreground ml-1",
                                                                                    children: [
                                                                                        "(",
                                                                                        diag.icd11Code,
                                                                                        ")"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/components/patient-history-side-pane.tsx",
                                                                                    lineNumber: 820,
                                                                                    columnNumber: 45
                                                                                }, this)
                                                                            ]
                                                                        }, diag.id, true, {
                                                                            fileName: "[project]/components/patient-history-side-pane.tsx",
                                                                            lineNumber: 817,
                                                                            columnNumber: 41
                                                                        }, this))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/patient-history-side-pane.tsx",
                                                                    lineNumber: 815,
                                                                    columnNumber: 37
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/patient-history-side-pane.tsx",
                                                            lineNumber: 811,
                                                            columnNumber: 35
                                                        }, this),
                                                        dept.medications && dept.medications.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs font-semibold text-foreground mb-1",
                                                                    children: "Medications:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/patient-history-side-pane.tsx",
                                                                    lineNumber: 833,
                                                                    columnNumber: 37
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                                    className: "text-xs text-muted-foreground space-y-0.5",
                                                                    children: dept.medications.map((med)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                            children: [
                                                                                "• ",
                                                                                med.medicationName
                                                                            ]
                                                                        }, med.id, true, {
                                                                            fileName: "[project]/components/patient-history-side-pane.tsx",
                                                                            lineNumber: 838,
                                                                            columnNumber: 41
                                                                        }, this))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/patient-history-side-pane.tsx",
                                                                    lineNumber: 836,
                                                                    columnNumber: 37
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/patient-history-side-pane.tsx",
                                                            lineNumber: 832,
                                                            columnNumber: 35
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/patient-history-side-pane.tsx",
                                                    lineNumber: 808,
                                                    columnNumber: 29
                                                }, this)
                                            ]
                                        }, dept.id, true, {
                                            fileName: "[project]/components/patient-history-side-pane.tsx",
                                            lineNumber: 770,
                                            columnNumber: 23
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/components/patient-history-side-pane.tsx",
                                    lineNumber: 760,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, visit.id, true, {
                            fileName: "[project]/components/patient-history-side-pane.tsx",
                            lineNumber: 719,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/components/patient-history-side-pane.tsx",
                    lineNumber: 717,
                    columnNumber: 11
                }, this) : /* Department Details View */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col h-full",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-4 py-3 border-b border-border flex-shrink-0",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start justify-between gap-3",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setExpandedDepartment(null),
                                            className: "flex items-center gap-2 text-sm font-medium text-primary hover:underline mb-2",
                                            children: "← Back to Visits"
                                        }, void 0, false, {
                                            fileName: "[project]/components/patient-history-side-pane.tsx",
                                            lineNumber: 861,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-semibold text-card-foreground",
                                            children: expandedDepartment.departmentName
                                        }, void 0, false, {
                                            fileName: "[project]/components/patient-history-side-pane.tsx",
                                            lineNumber: 867,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-muted-foreground mt-1",
                                            children: [
                                                "Visit on",
                                                " ",
                                                formatDate(visits.find((v)=>v.id === expandedDepartment.visitId)?.visitDate)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/patient-history-side-pane.tsx",
                                            lineNumber: 870,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/patient-history-side-pane.tsx",
                                    lineNumber: 860,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/patient-history-side-pane.tsx",
                                lineNumber: 859,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/patient-history-side-pane.tsx",
                            lineNumber: 858,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 overflow-y-auto px-4 py-3 space-y-4",
                            children: [
                                expandedDepartment.diagnostics.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            className: "text-sm font-semibold text-card-foreground mb-2",
                                            children: "Diagnostics"
                                        }, void 0, false, {
                                            fileName: "[project]/components/patient-history-side-pane.tsx",
                                            lineNumber: 886,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            className: "space-y-1",
                                            children: expandedDepartment.diagnostics.map((diag)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    className: "text-sm text-card-foreground",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-medium",
                                                            children: diag.diagnosisName
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/patient-history-side-pane.tsx",
                                                            lineNumber: 895,
                                                            columnNumber: 25
                                                        }, this),
                                                        diag.icd11Code && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-muted-foreground ml-2",
                                                            children: [
                                                                "(",
                                                                diag.icd11Code,
                                                                ")"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/patient-history-side-pane.tsx",
                                                            lineNumber: 899,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, diag.id, true, {
                                                    fileName: "[project]/components/patient-history-side-pane.tsx",
                                                    lineNumber: 891,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/components/patient-history-side-pane.tsx",
                                            lineNumber: 889,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/patient-history-side-pane.tsx",
                                    lineNumber: 885,
                                    columnNumber: 17
                                }, this),
                                expandedDepartment.medications.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            className: "text-sm font-semibold text-card-foreground mb-2",
                                            children: "Medications"
                                        }, void 0, false, {
                                            fileName: "[project]/components/patient-history-side-pane.tsx",
                                            lineNumber: 912,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            className: "space-y-1",
                                            children: expandedDepartment.medications.map((med)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    className: "text-sm text-card-foreground",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-medium",
                                                            children: med.medicationName
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/patient-history-side-pane.tsx",
                                                            lineNumber: 918,
                                                            columnNumber: 25
                                                        }, this),
                                                        med.instructions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-muted-foreground mt-0.5",
                                                            children: med.instructions
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/patient-history-side-pane.tsx",
                                                            lineNumber: 922,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, med.id, true, {
                                                    fileName: "[project]/components/patient-history-side-pane.tsx",
                                                    lineNumber: 917,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/components/patient-history-side-pane.tsx",
                                            lineNumber: 915,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/patient-history-side-pane.tsx",
                                    lineNumber: 911,
                                    columnNumber: 17
                                }, this),
                                expandedDepartment.diagnostics.length === 0 && expandedDepartment.medications.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-muted-foreground text-center py-8",
                                    children: "No details available for this department"
                                }, void 0, false, {
                                    fileName: "[project]/components/patient-history-side-pane.tsx",
                                    lineNumber: 934,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/patient-history-side-pane.tsx",
                            lineNumber: 882,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/patient-history-side-pane.tsx",
                    lineNumber: 856,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/patient-history-side-pane.tsx",
                lineNumber: 703,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/patient-history-side-pane.tsx",
        lineNumber: 347,
        columnNumber: 5
    }, this);
}
_s(PatientHistorySidePane, "nwdDup3g3utKz5jhj/GX0iXelQI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$departments$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDepartments"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
_c = PatientHistorySidePane;
var _c;
__turbopack_context__.k.register(_c, "PatientHistorySidePane");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/patient-history-side-pane.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/components/patient-history-side-pane.tsx [app-client] (ecmascript)"));
}),
"[project]/node_modules/lucide-react/dist/esm/icons/filter.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>Filter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const Filter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("Filter", [
    [
        "polygon",
        {
            points: "22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3",
            key: "1yg77f"
        }
    ]
]);
;
 //# sourceMappingURL=filter.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/filter.js [app-client] (ecmascript) <export default as Filter>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Filter",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/filter.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>ChevronRight
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const ChevronRight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("ChevronRight", [
    [
        "path",
        {
            d: "m9 18 6-6-6-6",
            key: "mthhwq"
        }
    ]
]);
;
 //# sourceMappingURL=chevron-right.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChevronRight",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_b10c563f._.js.map