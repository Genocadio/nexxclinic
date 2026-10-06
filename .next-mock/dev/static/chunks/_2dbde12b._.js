(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/add-department-modal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AddDepartmentModal",
    ()=>AddDepartmentModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building-2.js [app-client] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$auth$2d$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hooks/auth-hooks.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$department$2d$mutations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/visits/department-mutations.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$departments$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/departments/hooks.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$workers$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/workers/hooks.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-toastify/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$response$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/response-handler.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function AddDepartmentModal({ visit, isOpen, onClose, onSuccess }) {
    _s();
    const { departments, error: departmentsError, loading: departmentsLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$departments$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDepartments"])();
    const [selectedDepartmentId, setSelectedDepartmentId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [departmentQuery, setDepartmentQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [mode, setMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("department");
    const [processorQuery, setProcessorQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [selectedProcessorId, setSelectedProcessorId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [selectedProcessorDepartmentId, setSelectedProcessorDepartmentId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [formError, setFormError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const clearFormError = ()=>{
        if (formError) setFormError("");
    };
    const clearProcessorSelections = ()=>{
        setProcessorQuery("");
        setSelectedProcessorId("");
        setSelectedProcessorDepartmentId("");
        clearFormError();
    };
    const { addDepartmentToVisit, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$department$2d$mutations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAddDepartmentToVisit"])();
    const { workers: processorWorkers, loading: processorsLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$workers$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchWorkers"])({
        name: processorQuery,
        role: "CLINICIAN",
        activeOnly: true
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AddDepartmentModal.useEffect": ()=>{
            if (!isOpen || !departmentsError) return;
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(departmentsError || "Failed to load departments for this visit");
            onClose();
        }
    }["AddDepartmentModal.useEffect"], [
        departmentsError,
        isOpen,
        onClose
    ]);
    // Block adding departments to locked visit statuses
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AddDepartmentModal.useEffect": ()=>{
            if (!isOpen) return;
            const lockedStatuses = [
                "COMPLETED",
                "CANCELLED"
            ];
            if (lockedStatuses.includes(visit.status)) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Cannot add departments to this visit.");
                onClose();
            }
        }
    }["AddDepartmentModal.useEffect"], [
        isOpen,
        visit.status,
        onClose
    ]);
    // Filter out non-cancelled departments already in the visit
    const existingDepartmentIds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AddDepartmentModal.useMemo[existingDepartmentIds]": ()=>visit.departments?.filter({
                "AddDepartmentModal.useMemo[existingDepartmentIds]": (d)=>d.status !== "CANCELLED"
            }["AddDepartmentModal.useMemo[existingDepartmentIds]"]).map({
                "AddDepartmentModal.useMemo[existingDepartmentIds]": (d)=>String(d.department?.id)
            }["AddDepartmentModal.useMemo[existingDepartmentIds]"]) || []
    }["AddDepartmentModal.useMemo[existingDepartmentIds]"], [
        visit.departments
    ]);
    const isDepartmentAlreadyInVisit = (departmentId)=>existingDepartmentIds.includes(String(departmentId));
    const availableDepartments = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AddDepartmentModal.useMemo[availableDepartments]": ()=>departments.filter({
                "AddDepartmentModal.useMemo[availableDepartments]": (dept)=>!isDepartmentAlreadyInVisit(String(dept.id))
            }["AddDepartmentModal.useMemo[availableDepartments]"])
    }["AddDepartmentModal.useMemo[availableDepartments]"], [
        departments,
        existingDepartmentIds
    ]);
    const filteredDepartments = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AddDepartmentModal.useMemo[filteredDepartments]": ()=>{
            const q = departmentQuery.trim().toLowerCase();
            if (!q) return departments;
            return departments.filter({
                "AddDepartmentModal.useMemo[filteredDepartments]": (dept)=>dept.name?.toLowerCase().includes(q)
            }["AddDepartmentModal.useMemo[filteredDepartments]"]);
        }
    }["AddDepartmentModal.useMemo[filteredDepartments]"], [
        departments,
        departmentQuery
    ]);
    if (departmentsError) {
        return null;
    }
    const handleSubmit = async ()=>{
        const departmentIdToUse = mode === "processor" ? selectedProcessorDepartmentId || selectedDepartmentId : selectedDepartmentId;
        if (mode === "processor" && !selectedProcessorId) {
            setFormError("Select a clinician/processor first");
            return;
        }
        if (!departmentIdToUse) {
            setFormError("Choose a department before adding it to the visit");
            return;
        }
        setFormError("");
        try {
            const result = await addDepartmentToVisit(visit.id, departmentIdToUse, mode === "processor" ? selectedProcessorId : null, null);
            const ok = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$response$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleResponse"])(result, {
                successMessage: "Department added to visit",
                errorMessage: true
            });
            if (ok) {
                onSuccess?.();
                onClose();
                setSelectedDepartmentId("");
                setDepartmentQuery("");
            }
        } catch (error) {
            console.error("Error adding department:", error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Failed to add department to visit");
        }
    };
    if (!isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-card/95 text-card-foreground rounded-2xl border border-border/80 shadow-2xl backdrop-blur-2xl w-full max-w-md p-6 animate-in fade-in-50 zoom-in-95 duration-200",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative mb-4 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-lg font-semibold text-foreground",
                            children: "Add Department to Visit"
                        }, void 0, false, {
                            fileName: "[project]/components/add-department-modal.tsx",
                            lineNumber: 159,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "absolute right-0 top-0 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                            "aria-label": "Close",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "h-5 w-5"
                            }, void 0, false, {
                                fileName: "[project]/components/add-department-modal.tsx",
                                lineNumber: 167,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/add-department-modal.tsx",
                            lineNumber: 162,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/add-department-modal.tsx",
                    lineNumber: 158,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center rounded-xl bg-muted/60 backdrop-blur-sm border border-border/60 p-3 mb-5 space-y-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm font-medium text-foreground",
                            children: [
                                "Patient: ",
                                visit.patient?.firstName,
                                " ",
                                visit.patient?.lastName
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/add-department-modal.tsx",
                            lineNumber: 173,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-muted-foreground",
                            children: [
                                "Visit Date: ",
                                visit.visitDate ? new Date(visit.visitDate).toLocaleDateString() : "N/A"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/add-department-modal.tsx",
                            lineNumber: 176,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/add-department-modal.tsx",
                    lineNumber: 172,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: departmentsLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-center justify-center py-8 text-muted-foreground gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                className: "h-6 w-6 animate-spin text-primary"
                            }, void 0, false, {
                                fileName: "[project]/components/add-department-modal.tsx",
                                lineNumber: 184,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm",
                                children: "Loading departments..."
                            }, void 0, false, {
                                fileName: "[project]/components/add-department-modal.tsx",
                                lineNumber: 185,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/add-department-modal.tsx",
                        lineNumber: 183,
                        columnNumber: 13
                    }, this) : availableDepartments.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center py-8 text-muted-foreground",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm font-medium",
                            children: "All departments have been added to this visit"
                        }, void 0, false, {
                            fileName: "[project]/components/add-department-modal.tsx",
                            lineNumber: 189,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/add-department-modal.tsx",
                        lineNumber: 188,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        type: "button",
                                        size: "sm",
                                        variant: mode === "department" ? "default" : "outline",
                                        onClick: ()=>{
                                            setMode("department");
                                            clearProcessorSelections();
                                        },
                                        className: "px-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                                                className: "h-4 w-4 mr-1.5"
                                            }, void 0, false, {
                                                fileName: "[project]/components/add-department-modal.tsx",
                                                lineNumber: 207,
                                                columnNumber: 19
                                            }, this),
                                            "Department"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/add-department-modal.tsx",
                                        lineNumber: 197,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        type: "button",
                                        size: "sm",
                                        variant: mode === "processor" ? "default" : "outline",
                                        onClick: ()=>{
                                            setMode("processor");
                                            setSelectedDepartmentId("");
                                            setDepartmentQuery("");
                                            clearFormError();
                                        },
                                        className: "px-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                className: "h-4 w-4 mr-1.5"
                                            }, void 0, false, {
                                                fileName: "[project]/components/add-department-modal.tsx",
                                                lineNumber: 222,
                                                columnNumber: 19
                                            }, this),
                                            "Clinician"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/add-department-modal.tsx",
                                        lineNumber: 210,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/add-department-modal.tsx",
                                lineNumber: 196,
                                columnNumber: 15
                            }, this),
                            mode === "processor" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-center text-sm font-medium text-foreground mb-1.5",
                                                children: "Search Clinician"
                                            }, void 0, false, {
                                                fileName: "[project]/components/add-department-modal.tsx",
                                                lineNumber: 230,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                        className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/add-department-modal.tsx",
                                                        lineNumber: 234,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        value: processorQuery,
                                                        onChange: (e)=>{
                                                            setProcessorQuery(e.target.value);
                                                            setSelectedProcessorId("");
                                                            setSelectedProcessorDepartmentId("");
                                                            clearFormError();
                                                        },
                                                        placeholder: "Search clinician by name...",
                                                        className: "w-full rounded-md border border-input bg-background pl-9 pr-8 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/add-department-modal.tsx",
                                                        lineNumber: 235,
                                                        columnNumber: 23
                                                    }, this),
                                                    processorQuery && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>{
                                                            setProcessorQuery("");
                                                            setSelectedProcessorId("");
                                                            setSelectedProcessorDepartmentId("");
                                                        },
                                                        className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                            className: "h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/add-department-modal.tsx",
                                                            lineNumber: 256,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/add-department-modal.tsx",
                                                        lineNumber: 247,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/add-department-modal.tsx",
                                                lineNumber: 233,
                                                columnNumber: 21
                                            }, this),
                                            processorsLoading && processorQuery.trim().length >= 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-1 text-center text-xs text-muted-foreground",
                                                children: "Searching..."
                                            }, void 0, false, {
                                                fileName: "[project]/components/add-department-modal.tsx",
                                                lineNumber: 261,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/add-department-modal.tsx",
                                        lineNumber: 229,
                                        columnNumber: 19
                                    }, this),
                                    processorWorkers.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "max-h-44 overflow-y-auto rounded-md border border-border bg-card",
                                        children: processorWorkers.map((w)=>{
                                            const fullName = `${w.firstName || ""} ${w.lastName || ""}`.trim();
                                            const linkedDepartments = Array.isArray(w.departments) ? w.departments : [];
                                            const linkedAlreadyAdded = linkedDepartments.filter((d)=>isDepartmentAlreadyInVisit(String(d.id)));
                                            const linkedAvailable = linkedDepartments.filter((d)=>!isDepartmentAlreadyInVisit(String(d.id)));
                                            const isFullyAlreadyAdded = linkedDepartments.length > 0 && linkedAvailable.length === 0;
                                            const isSelected = String(w.id) === String(selectedProcessorId);
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                disabled: isFullyAlreadyAdded,
                                                onClick: ()=>{
                                                    if (isFullyAlreadyAdded) return;
                                                    clearFormError();
                                                    setSelectedProcessorId(String(w.id));
                                                    if (linkedAvailable.length === 1) {
                                                        setSelectedProcessorDepartmentId(String(linkedAvailable[0].id));
                                                    } else {
                                                        setSelectedProcessorDepartmentId("");
                                                    }
                                                },
                                                className: `w-full text-left px-3 py-2 text-sm border-b last:border-b-0 border-border/60 transition-colors ${isFullyAlreadyAdded ? "opacity-50 cursor-not-allowed bg-muted/20" : isSelected ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-foreground"}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-between gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "font-medium",
                                                                children: fullName || "Unnamed"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/add-department-modal.tsx",
                                                                lineNumber: 318,
                                                                columnNumber: 31
                                                            }, this),
                                                            isFullyAlreadyAdded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border",
                                                                children: "Already added"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/add-department-modal.tsx",
                                                                lineNumber: 322,
                                                                columnNumber: 33
                                                            }, this) : isSelected ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                className: "h-4 w-4 text-primary shrink-0"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/add-department-modal.tsx",
                                                                lineNumber: 326,
                                                                columnNumber: 33
                                                            }, this) : null
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/add-department-modal.tsx",
                                                        lineNumber: 317,
                                                        columnNumber: 29
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs text-muted-foreground mt-0.5",
                                                        children: linkedDepartments.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        "Departments:",
                                                                        " ",
                                                                        linkedDepartments.map((d)=>d.name).join(", ")
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/add-department-modal.tsx",
                                                                    lineNumber: 333,
                                                                    columnNumber: 35
                                                                }, this),
                                                                linkedAlreadyAdded.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        "Already in visit:",
                                                                        " ",
                                                                        linkedAlreadyAdded.map((d)=>d.name).join(", ")
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/add-department-modal.tsx",
                                                                    lineNumber: 340,
                                                                    columnNumber: 37
                                                                }, this)
                                                            ]
                                                        }, void 0, true) : "No department linked"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/add-department-modal.tsx",
                                                        lineNumber: 330,
                                                        columnNumber: 29
                                                    }, this)
                                                ]
                                            }, w.id, true, {
                                                fileName: "[project]/components/add-department-modal.tsx",
                                                lineNumber: 292,
                                                columnNumber: 27
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/components/add-department-modal.tsx",
                                        lineNumber: 268,
                                        columnNumber: 21
                                    }, this),
                                    selectedProcessorId ? (()=>{
                                        const chosen = processorWorkers.find((w)=>String(w.id) === String(selectedProcessorId));
                                        const linked = Array.isArray(chosen?.departments) ? chosen.departments : [];
                                        if (linked.length > 1) {
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-center text-sm font-medium text-foreground mb-1.5",
                                                        children: "Choose department for this clinician"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/add-department-modal.tsx",
                                                        lineNumber: 371,
                                                        columnNumber: 31
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        value: selectedProcessorDepartmentId,
                                                        onChange: (e)=>setSelectedProcessorDepartmentId(e.target.value),
                                                        className: "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "",
                                                                children: "Select department..."
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/add-department-modal.tsx",
                                                                lineNumber: 383,
                                                                columnNumber: 33
                                                            }, this),
                                                            linked.filter((d)=>availableDepartments.some((ad)=>String(ad.id) === String(d.id))).map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: String(d.id),
                                                                    children: d.name
                                                                }, d.id, false, {
                                                                    fileName: "[project]/components/add-department-modal.tsx",
                                                                    lineNumber: 391,
                                                                    columnNumber: 37
                                                                }, this))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/add-department-modal.tsx",
                                                        lineNumber: 374,
                                                        columnNumber: 31
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/add-department-modal.tsx",
                                                lineNumber: 370,
                                                columnNumber: 29
                                            }, this);
                                        }
                                        // If none linked, allow selecting from available departments
                                        if (linked.length === 0) {
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-center text-sm font-medium text-foreground mb-1.5",
                                                        children: "Select Department for clinician"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/add-department-modal.tsx",
                                                        lineNumber: 404,
                                                        columnNumber: 31
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "max-h-40 overflow-y-auto rounded-md border border-border bg-card",
                                                        children: [
                                                            departments.filter((d)=>!isDepartmentAlreadyInVisit(String(d.id))).map((d)=>{
                                                                const isSelected = String(d.id) === String(selectedDepartmentId);
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    onClick: ()=>setSelectedDepartmentId(String(d.id)),
                                                                    className: `w-full flex items-center justify-between px-3 py-2 text-sm border-b last:border-b-0 border-border/60 transition-colors ${isSelected ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-foreground"}`,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            children: d.name
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/add-department-modal.tsx",
                                                                            lineNumber: 431,
                                                                            columnNumber: 41
                                                                        }, this),
                                                                        isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                            className: "h-4 w-4 text-primary shrink-0"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/add-department-modal.tsx",
                                                                            lineNumber: 433,
                                                                            columnNumber: 43
                                                                        }, this)
                                                                    ]
                                                                }, d.id, true, {
                                                                    fileName: "[project]/components/add-department-modal.tsx",
                                                                    lineNumber: 419,
                                                                    columnNumber: 39
                                                                }, this);
                                                            }),
                                                            departments.filter((d)=>isDepartmentAlreadyInVisit(String(d.id))).map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    disabled: true,
                                                                    className: "w-full flex items-center justify-between px-3 py-2 text-sm border-b last:border-b-0 border-border/60 opacity-50 cursor-not-allowed bg-muted/20",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            children: d.name
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/add-department-modal.tsx",
                                                                            lineNumber: 450,
                                                                            columnNumber: 39
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border",
                                                                            children: "Already added"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/add-department-modal.tsx",
                                                                            lineNumber: 451,
                                                                            columnNumber: 39
                                                                        }, this)
                                                                    ]
                                                                }, d.id, true, {
                                                                    fileName: "[project]/components/add-department-modal.tsx",
                                                                    lineNumber: 444,
                                                                    columnNumber: 37
                                                                }, this))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/add-department-modal.tsx",
                                                        lineNumber: 408,
                                                        columnNumber: 31
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/add-department-modal.tsx",
                                                lineNumber: 403,
                                                columnNumber: 29
                                            }, this);
                                        }
                                        return null;
                                    })() : null
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/add-department-modal.tsx",
                                lineNumber: 228,
                                columnNumber: 17
                            }, this) : /* Department Search with Auto-suggestion */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-center text-sm font-medium text-foreground mb-1.5",
                                                children: "Search Department"
                                            }, void 0, false, {
                                                fileName: "[project]/components/add-department-modal.tsx",
                                                lineNumber: 469,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                        className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/add-department-modal.tsx",
                                                        lineNumber: 473,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        value: departmentQuery,
                                                        onChange: (e)=>{
                                                            setDepartmentQuery(e.target.value);
                                                            setSelectedDepartmentId("");
                                                            clearFormError();
                                                        },
                                                        placeholder: "Search department by name...",
                                                        className: "w-full rounded-md border border-input bg-background pl-9 pr-8 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/add-department-modal.tsx",
                                                        lineNumber: 474,
                                                        columnNumber: 23
                                                    }, this),
                                                    departmentQuery && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>{
                                                            setDepartmentQuery("");
                                                            setSelectedDepartmentId("");
                                                        },
                                                        className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                            className: "h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/add-department-modal.tsx",
                                                            lineNumber: 493,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/add-department-modal.tsx",
                                                        lineNumber: 485,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/add-department-modal.tsx",
                                                lineNumber: 472,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/add-department-modal.tsx",
                                        lineNumber: 468,
                                        columnNumber: 19
                                    }, this),
                                    filteredDepartments.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "max-h-48 overflow-y-auto rounded-md border border-border bg-card",
                                        children: filteredDepartments.map((dept)=>{
                                            const isAlreadyAdded = isDepartmentAlreadyInVisit(String(dept.id));
                                            const isSelected = String(dept.id) === String(selectedDepartmentId);
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                disabled: isAlreadyAdded,
                                                onClick: ()=>{
                                                    if (isAlreadyAdded) return;
                                                    setSelectedDepartmentId(String(dept.id));
                                                    setDepartmentQuery(dept.name);
                                                    clearFormError();
                                                },
                                                className: `w-full text-left px-3 py-2.5 text-sm border-b last:border-b-0 border-border/60 flex items-center justify-between transition-colors ${isAlreadyAdded ? "opacity-50 cursor-not-allowed bg-muted/20" : isSelected ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-foreground"}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                                                                className: "h-4 w-4 text-muted-foreground shrink-0"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/add-department-modal.tsx",
                                                                lineNumber: 529,
                                                                columnNumber: 31
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: dept.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/add-department-modal.tsx",
                                                                lineNumber: 530,
                                                                columnNumber: 31
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/add-department-modal.tsx",
                                                        lineNumber: 528,
                                                        columnNumber: 29
                                                    }, this),
                                                    isAlreadyAdded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border",
                                                        children: "Already added"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/add-department-modal.tsx",
                                                        lineNumber: 533,
                                                        columnNumber: 31
                                                    }, this) : isSelected ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                        className: "h-4 w-4 text-primary shrink-0"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/add-department-modal.tsx",
                                                        lineNumber: 537,
                                                        columnNumber: 31
                                                    }, this) : null
                                                ]
                                            }, dept.id, true, {
                                                fileName: "[project]/components/add-department-modal.tsx",
                                                lineNumber: 510,
                                                columnNumber: 27
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/components/add-department-modal.tsx",
                                        lineNumber: 501,
                                        columnNumber: 21
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center py-6 text-sm text-muted-foreground rounded-md border border-dashed border-border",
                                        children: [
                                            "No departments found matching “",
                                            departmentQuery,
                                            "”"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/add-department-modal.tsx",
                                        lineNumber: 544,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/add-department-modal.tsx",
                                lineNumber: 467,
                                columnNumber: 17
                            }, this),
                            formError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-center text-xs font-medium text-destructive mt-2",
                                role: "alert",
                                children: formError
                            }, void 0, false, {
                                fileName: "[project]/components/add-department-modal.tsx",
                                lineNumber: 552,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-6",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    onClick: handleSubmit,
                                    className: "w-full",
                                    disabled: loading || mode === "department" && !selectedDepartmentId || mode === "processor" && (!selectedProcessorId || !(selectedProcessorDepartmentId || selectedDepartmentId)),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                            className: "h-4 w-4 mr-1.5"
                                        }, void 0, false, {
                                            fileName: "[project]/components/add-department-modal.tsx",
                                            lineNumber: 575,
                                            columnNumber: 19
                                        }, this),
                                        loading ? "Adding..." : "Add Department"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/add-department-modal.tsx",
                                    lineNumber: 562,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/add-department-modal.tsx",
                                lineNumber: 561,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true)
                }, void 0, false, {
                    fileName: "[project]/components/add-department-modal.tsx",
                    lineNumber: 181,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/add-department-modal.tsx",
            lineNumber: 156,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/add-department-modal.tsx",
        lineNumber: 155,
        columnNumber: 5
    }, this);
}
_s(AddDepartmentModal, "cXuma7RJrTeNZkpbveKna4zAAWI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$departments$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDepartments"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$department$2d$mutations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAddDepartmentToVisit"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$workers$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchWorkers"]
    ];
});
_c = AddDepartmentModal;
var _c;
__turbopack_context__.k.register(_c, "AddDepartmentModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/add-department-modal.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/components/add-department-modal.tsx [app-client] (ecmascript)"));
}),
"[project]/node_modules/lucide-react/dist/esm/icons/building-2.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>Building2
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const Building2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("Building2", [
    [
        "path",
        {
            d: "M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z",
            key: "1b4qmf"
        }
    ],
    [
        "path",
        {
            d: "M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2",
            key: "i71pzd"
        }
    ],
    [
        "path",
        {
            d: "M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2",
            key: "10jefs"
        }
    ],
    [
        "path",
        {
            d: "M10 6h4",
            key: "1itunk"
        }
    ],
    [
        "path",
        {
            d: "M10 10h4",
            key: "tcdvrf"
        }
    ],
    [
        "path",
        {
            d: "M10 14h4",
            key: "kelpxr"
        }
    ],
    [
        "path",
        {
            d: "M10 18h4",
            key: "1ulq68"
        }
    ]
]);
;
 //# sourceMappingURL=building-2.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/building-2.js [app-client] (ecmascript) <export default as Building2>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Building2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building-2.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_2dbde12b._.js.map