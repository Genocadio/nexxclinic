module.exports = [
"[project]/lib/visit-product-utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "canDischargeVisit",
    ()=>canDischargeVisit,
    "countBilledVisitProducts",
    ()=>countBilledVisitProducts,
    "countPendingOperatorConfirmations",
    ()=>countPendingOperatorConfirmations,
    "countUnbilledVisitProducts",
    ()=>countUnbilledVisitProducts,
    "flattenVisitDepartments",
    ()=>flattenVisitDepartments,
    "getAllVisitDepartmentProducts",
    ()=>getAllVisitDepartmentProducts,
    "getBilledVisitProductNames",
    ()=>getBilledVisitProductNames,
    "getDepartmentsReadyForBilling",
    ()=>getDepartmentsReadyForBilling,
    "getDerivedVisitBillingStatus",
    ()=>getDerivedVisitBillingStatus,
    "getUnbilledVisitProductNames",
    ()=>getUnbilledVisitProductNames,
    "getVisitDepartmentBillingStatus",
    ()=>getVisitDepartmentBillingStatus,
    "isBilledVisitProductStatus",
    ()=>isBilledVisitProductStatus,
    "isPendingConfirmationVisitProduct",
    ()=>isPendingConfirmationVisitProduct,
    "isUnbilledVisitProductStatus",
    ()=>isUnbilledVisitProductStatus,
    "normalizeVisitProductStatus",
    ()=>normalizeVisitProductStatus,
    "visitHasBillableProducts",
    ()=>visitHasBillableProducts,
    "visitHasDepartmentReadyForBilling",
    ()=>visitHasDepartmentReadyForBilling,
    "visitHasUnbilledProducts",
    ()=>visitHasUnbilledProducts,
    "visitProductsFullySettled",
    ()=>visitProductsFullySettled
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-types.ts [app-ssr] (ecmascript)");
;
function flattenVisitDepartments(departments = []) {
    const flattened = [];
    const stack = [
        ...departments
    ];
    while(stack.length > 0){
        const current = stack.shift();
        if (!current) continue;
        flattened.push(current);
        if (current.childVisitDepartments?.length) {
            stack.push(...current.childVisitDepartments);
        }
    }
    return flattened;
}
function getAllVisitDepartmentProducts(visit) {
    return flattenVisitDepartments(visit.departments || []).flatMap((dept)=>dept.products || []);
}
function normalizeVisitProductStatus(status) {
    return String(status || "").toUpperCase();
}
function isUnbilledVisitProductStatus(status) {
    const normalized = normalizeVisitProductStatus(status);
    return normalized === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VisitProductStatus"].UNPAID || normalized === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VisitProductStatus"].PENDING;
}
function isBilledVisitProductStatus(status) {
    return normalizeVisitProductStatus(status) === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VisitProductStatus"].BILLED;
}
function visitHasUnbilledProducts(visit) {
    return getAllVisitDepartmentProducts(visit).some((product)=>isUnbilledVisitProductStatus(product.status));
}
function visitHasBillableProducts(visit) {
    return getAllVisitDepartmentProducts(visit).length > 0;
}
function visitProductsFullySettled(visit) {
    const products = getAllVisitDepartmentProducts(visit);
    if (products.length === 0) return false;
    return products.every((product)=>{
        const status = normalizeVisitProductStatus(product.status);
        return status === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VisitProductStatus"].BILLED || status === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VisitProductStatus"].EXEMPTED || status === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VisitProductStatus"].PATIENT_SHARE_EXEMPTED;
    });
}
function isPendingConfirmationVisitProduct(product) {
    return product.billingConfirmationStatus === "PENDING_OPERATOR_CONFIRMATION";
}
function countPendingOperatorConfirmations(visit) {
    return getAllVisitDepartmentProducts(visit).filter(isPendingConfirmationVisitProduct).length;
}
function countUnbilledVisitProducts(visit) {
    return getAllVisitDepartmentProducts(visit).filter((product)=>isUnbilledVisitProductStatus(product.status)).length;
}
function countBilledVisitProducts(visit) {
    return getAllVisitDepartmentProducts(visit).filter((product)=>isBilledVisitProductStatus(product.status)).length;
}
function getUnbilledVisitProductNames(visit) {
    return getAllVisitDepartmentProducts(visit).filter((product)=>isUnbilledVisitProductStatus(product.status)).map((product)=>product.product?.name || "Product");
}
function getBilledVisitProductNames(visit) {
    return getAllVisitDepartmentProducts(visit).filter((product)=>isBilledVisitProductStatus(product.status)).map((product)=>product.product?.name || "Product");
}
function getDepartmentsReadyForBilling(visit) {
    return flattenVisitDepartments(visit.departments || []).filter((dept)=>normalizeVisitProductStatus(dept.status) === "BILLING").map((dept)=>dept.department?.name || "Department");
}
function visitHasDepartmentReadyForBilling(visit) {
    return getDepartmentsReadyForBilling(visit).length > 0;
}
function getVisitDepartmentBillingStatus(dept) {
    if (dept.billing?.status) {
        return dept.billing.status;
    }
    const products = dept.products || [];
    if (products.length === 0) return null;
    const allBilled = products.every((p)=>{
        const s = normalizeVisitProductStatus(p.status);
        return s === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VisitProductStatus"].BILLED || s === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VisitProductStatus"].EXEMPTED || s === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VisitProductStatus"].PATIENT_SHARE_EXEMPTED;
    });
    if (allBilled) return "BILLED";
    const someBilled = products.some((p)=>normalizeVisitProductStatus(p.status) === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VisitProductStatus"].BILLED);
    if (someBilled) return "PARTIALLY_BILLED";
    return "UNBILLED";
}
function getDerivedVisitBillingStatus(visit) {
    if (visitProductsFullySettled(visit)) return "BILLED";
    if (visitHasDepartmentReadyForBilling(visit)) return "BILLING";
    return "PENDING";
}
function canDischargeVisit(visit) {
    if (!visit) return false;
    const visitStatus = String(visit.status || "").toUpperCase();
    if (visitStatus === "COMPLETED" || visitStatus === "CANCELLED" || visitStatus === "FINALISED") {
        return false;
    }
    const allDepts = flattenVisitDepartments(visit.departments || []);
    if (allDepts.length === 0) return false;
    const hasAnyAnswer = allDepts.some((dept)=>Boolean(dept.answerId || dept.hasFinalizedConsultationAnswers));
    if (!hasAnyAnswer) return false;
    return allDepts.every((dept)=>{
        const status = String(dept.status || "").toUpperCase();
        return status === "COMPLETED" || status === "FINALISED" || status === "CANCELLED";
    });
}
}),
"[project]/components/floating-header.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FloatingHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-out.js [app-ssr] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/moon.js [app-ssr] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sun.js [app-ssr] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$cog$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCog$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user-cog.js [app-ssr] (ecmascript) <export default as UserCog>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-ssr] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$monitor$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Monitor$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/monitor.js [app-ssr] (ecmascript) <export default as Monitor>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-ssr] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-ssr] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/theme-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$role$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/role-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$clinic$2d$profile$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/clinic-profile.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
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
function FloatingHeader({ doctor }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const { logout, clinicProfile } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const { preference, setThemePreference } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTheme"])();
    const [dropdownOpen, setDropdownOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showClinicName, setShowClinicName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const roles = doctor?.roles || [];
    const canAccessAdmin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$role$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasAdminAccess"])(roles);
    const isAdminPath = pathname?.startsWith("/admin");
    const isRootPage = pathname === "/" || pathname === "/admin";
    const clinicName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$clinic$2d$profile$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getClinicDisplayName"])(clinicProfile);
    const clinicLogoUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$clinic$2d$profile$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getClinicLogoUrl"])(clinicProfile);
    const OPERATIONAL_REPORT_ROLES = [
        "CLINICIAN",
        "NURSE",
        "FINANCE",
        "RECEPTION"
    ];
    const canAccessReports = roles.some((r)=>OPERATIONAL_REPORT_ROLES.includes(String(r)));
    const getInitials = (name)=>{
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return (parts[0]?.substring(0, 2) || "DR").toUpperCase();
    };
    const handleMouseEnter = ()=>{
        setShowClinicName(true);
    };
    const handleMouseLeave = ()=>{
        setShowClinicName(false);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed top-3 left-3 sm:top-3.5 sm:left-4 z-40",
                children: isRootPage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    onClick: ()=>router.push(isAdminPath ? "/admin" : "/"),
                    onMouseEnter: handleMouseEnter,
                    onMouseLeave: handleMouseLeave,
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("h-10 sm:h-11 rounded-full bg-card/85 dark:bg-slate-900/85 backdrop-blur-xl border border-border/60 shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer ring-2 ring-background/60 group select-none overflow-hidden", showClinicName ? "px-3 gap-2" : "w-10 sm:w-11 px-0"),
                    title: clinicName,
                    "aria-label": clinicName,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: clinicLogoUrl,
                            alt: `${clinicName} logo`,
                            className: "h-6 w-6 sm:h-7 sm:w-7 object-contain rounded-full shrink-0"
                        }, void 0, false, {
                            fileName: "[project]/components/floating-header.tsx",
                            lineNumber: 68,
                            columnNumber: 13
                        }, this),
                        showClinicName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "font-bold text-xs sm:text-sm text-foreground max-w-[140px] sm:max-w-[200px] truncate group-hover:text-primary transition-all duration-300 animate-in fade-in-0 slide-in-from-left-2 duration-200",
                            children: clinicName
                        }, void 0, false, {
                            fileName: "[project]/components/floating-header.tsx",
                            lineNumber: 74,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/floating-header.tsx",
                    lineNumber: 56,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    onClick: ()=>router.push(isAdminPath ? "/admin" : "/"),
                    className: "h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-card/85 dark:bg-slate-900/85 backdrop-blur-xl border border-border/60 shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer ring-2 ring-background/60 group select-none",
                    title: isAdminPath ? "Back to Admin" : "Back to Dashboard",
                    "aria-label": isAdminPath ? "Back to Admin" : "Back to Dashboard",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
                            className: "h-5 w-5 text-foreground group-hover:hidden transition-all duration-200"
                        }, void 0, false, {
                            fileName: "[project]/components/floating-header.tsx",
                            lineNumber: 87,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                            className: "h-5 w-5 text-primary hidden group-hover:block transition-all duration-200 -translate-x-0.5"
                        }, void 0, false, {
                            fileName: "[project]/components/floating-header.tsx",
                            lineNumber: 88,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/floating-header.tsx",
                    lineNumber: 80,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/floating-header.tsx",
                lineNumber: 54,
                columnNumber: 7
            }, this),
            doctor && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed top-3 right-3 sm:top-3.5 sm:right-4 z-40",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>setDropdownOpen(!dropdownOpen),
                            className: "flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer ring-2 ring-background border border-border/40 select-none",
                            title: `${doctor.firstName} ${doctor.lastName || ""}`,
                            "aria-label": "User profile & navigation",
                            children: getInitials(`${doctor.firstName} ${doctor.lastName || ""}`)
                        }, void 0, false, {
                            fileName: "[project]/components/floating-header.tsx",
                            lineNumber: 97,
                            columnNumber: 13
                        }, this),
                        dropdownOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "fixed inset-0 z-[95]",
                                    onClick: ()=>setDropdownOpen(false)
                                }, void 0, false, {
                                    fileName: "[project]/components/floating-header.tsx",
                                    lineNumber: 109,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute right-0 mt-2 w-64 bg-card/95 dark:bg-slate-900/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl z-[100] overflow-hidden isolate animate-in fade-in-0 zoom-in-95 duration-150",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "px-4 py-3 border-b border-border/30",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm font-semibold text-card-foreground",
                                                    children: [
                                                        doctor.firstName,
                                                        " ",
                                                        doctor.lastName
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/floating-header.tsx",
                                                    lineNumber: 115,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-muted-foreground mt-0.5",
                                                    children: doctor.roles?.join(", ") || ""
                                                }, void 0, false, {
                                                    fileName: "[project]/components/floating-header.tsx",
                                                    lineNumber: 118,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/floating-header.tsx",
                                            lineNumber: 114,
                                            columnNumber: 19
                                        }, this),
                                        isAdminPath ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>{
                                                router.push("/");
                                                setDropdownOpen(false);
                                            },
                                            className: "w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-all duration-200 text-left text-foreground cursor-pointer",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center text-[12px] font-semibold",
                                                    children: "M"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/floating-header.tsx",
                                                    lineNumber: 131,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-sm font-medium",
                                                    children: "Medical Dashboard"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/floating-header.tsx",
                                                    lineNumber: 134,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/floating-header.tsx",
                                            lineNumber: 123,
                                            columnNumber: 21
                                        }, this) : canAccessAdmin && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>{
                                                router.push("/admin");
                                                setDropdownOpen(false);
                                            },
                                            className: "w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-all duration-200 text-left text-foreground cursor-pointer",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center text-[12px] font-semibold",
                                                    children: "A"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/floating-header.tsx",
                                                    lineNumber: 146,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-sm font-medium",
                                                    children: "Admin Dashboard"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/floating-header.tsx",
                                                    lineNumber: 149,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/floating-header.tsx",
                                            lineNumber: 138,
                                            columnNumber: 23
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>{
                                                router.push("/account");
                                                setDropdownOpen(false);
                                            },
                                            className: "w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-all duration-200 text-left text-foreground cursor-pointer",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$cog$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCog$3e$__["UserCog"], {
                                                    className: "w-4 h-4 text-muted-foreground"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/floating-header.tsx",
                                                    lineNumber: 161,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-sm font-medium",
                                                    children: "My Account"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/floating-header.tsx",
                                                    lineNumber: 162,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/floating-header.tsx",
                                            lineNumber: 153,
                                            columnNumber: 19
                                        }, this),
                                        canAccessReports && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>{
                                                router.push("/reports");
                                                setDropdownOpen(false);
                                            },
                                            className: "w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-all duration-200 text-left text-foreground cursor-pointer",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"], {
                                                    className: "w-4 h-4 text-primary"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/floating-header.tsx",
                                                    lineNumber: 173,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-sm font-medium",
                                                    children: "My Reports & Activity"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/floating-header.tsx",
                                                    lineNumber: 174,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/floating-header.tsx",
                                            lineNumber: 165,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "px-3 py-2 border-t border-border/30",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between p-1 bg-muted/60 dark:bg-muted/40 rounded-xl border border-border/40",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>setThemePreference("light"),
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer", preference === "light" ? "bg-background text-foreground shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"),
                                                        title: "Light Theme",
                                                        "aria-label": "Light Theme",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                                                                className: "w-3.5 h-3.5"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/floating-header.tsx",
                                                                lineNumber: 193,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[12px]",
                                                                children: "Light"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/floating-header.tsx",
                                                                lineNumber: 194,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/floating-header.tsx",
                                                        lineNumber: 181,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>setThemePreference("system"),
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer", preference === "system" ? "bg-background text-foreground shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"),
                                                        title: "System Theme",
                                                        "aria-label": "System Theme",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$monitor$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Monitor$3e$__["Monitor"], {
                                                                className: "w-3.5 h-3.5"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/floating-header.tsx",
                                                                lineNumber: 209,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[12px]",
                                                                children: "System"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/floating-header.tsx",
                                                                lineNumber: 210,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/floating-header.tsx",
                                                        lineNumber: 197,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>setThemePreference("dark"),
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer", preference === "dark" ? "bg-background text-foreground shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"),
                                                        title: "Dark Theme",
                                                        "aria-label": "Dark Theme",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
                                                                className: "w-3.5 h-3.5"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/floating-header.tsx",
                                                                lineNumber: 225,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[12px]",
                                                                children: "Dark"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/floating-header.tsx",
                                                                lineNumber: 226,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/floating-header.tsx",
                                                        lineNumber: 213,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/floating-header.tsx",
                                                lineNumber: 180,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/floating-header.tsx",
                                            lineNumber: 179,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "border-t border-border/30"
                                        }, void 0, false, {
                                            fileName: "[project]/components/floating-header.tsx",
                                            lineNumber: 231,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>{
                                                logout();
                                                setDropdownOpen(false);
                                            },
                                            className: "w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-all duration-200 text-left text-foreground cursor-pointer",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                                    className: "w-4 h-4 text-destructive"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/floating-header.tsx",
                                                    lineNumber: 240,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-sm font-medium text-destructive",
                                                    children: "Logout"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/floating-header.tsx",
                                                    lineNumber: 241,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/floating-header.tsx",
                                            lineNumber: 232,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/floating-header.tsx",
                                    lineNumber: 113,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/floating-header.tsx",
                    lineNumber: 96,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/floating-header.tsx",
                lineNumber: 95,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true);
}
}),
"[project]/components/ui/alert-dialog.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AlertDialog",
    ()=>AlertDialog,
    "AlertDialogAction",
    ()=>AlertDialogAction,
    "AlertDialogCancel",
    ()=>AlertDialogCancel,
    "AlertDialogContent",
    ()=>AlertDialogContent,
    "AlertDialogDescription",
    ()=>AlertDialogDescription,
    "AlertDialogFooter",
    ()=>AlertDialogFooter,
    "AlertDialogHeader",
    ()=>AlertDialogHeader,
    "AlertDialogOverlay",
    ()=>AlertDialogOverlay,
    "AlertDialogPortal",
    ()=>AlertDialogPortal,
    "AlertDialogTitle",
    ()=>AlertDialogTitle,
    "AlertDialogTrigger",
    ()=>AlertDialogTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-alert-dialog/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function AlertDialog({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "alert-dialog",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/alert-dialog.tsx",
        lineNumber: 12,
        columnNumber: 10
    }, this);
}
function AlertDialogTrigger({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Trigger"], {
        "data-slot": "alert-dialog-trigger",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/alert-dialog.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, this);
}
function AlertDialogPortal({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Portal"], {
        "data-slot": "alert-dialog-portal",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/alert-dialog.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
function AlertDialogOverlay({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Overlay"], {
        "data-slot": "alert-dialog-overlay",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-[100] bg-black/50', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/alert-dialog.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
function AlertDialogContent({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AlertDialogPortal, {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AlertDialogOverlay, {}, void 0, false, {
                fileName: "[project]/components/ui/alert-dialog.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Content"], {
                "data-slot": "alert-dialog-content",
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-[100] grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg', className),
                ...props
            }, void 0, false, {
                fileName: "[project]/components/ui/alert-dialog.tsx",
                lineNumber: 54,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/alert-dialog.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
function AlertDialogHeader({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "alert-dialog-header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('flex flex-col gap-2 text-center sm:text-left', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/alert-dialog.tsx",
        lineNumber: 71,
        columnNumber: 5
    }, this);
}
function AlertDialogFooter({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "alert-dialog-footer",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/alert-dialog.tsx",
        lineNumber: 84,
        columnNumber: 5
    }, this);
}
function AlertDialogTitle({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Title"], {
        "data-slot": "alert-dialog-title",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('text-lg font-semibold', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/alert-dialog.tsx",
        lineNumber: 100,
        columnNumber: 5
    }, this);
}
function AlertDialogDescription({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Description"], {
        "data-slot": "alert-dialog-description",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('text-muted-foreground text-sm', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/alert-dialog.tsx",
        lineNumber: 113,
        columnNumber: 5
    }, this);
}
function AlertDialogAction({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Action"], {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buttonVariants"])(), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/alert-dialog.tsx",
        lineNumber: 126,
        columnNumber: 5
    }, this);
}
function AlertDialogCancel({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Cancel"], {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buttonVariants"])({
            variant: 'outline'
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/alert-dialog.tsx",
        lineNumber: 138,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/components/ui/confirm-dialog.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ConfirmDialog",
    ()=>ConfirmDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/alert-dialog.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
function ConfirmDialog({ open, onOpenChange, title, description, confirmLabel = "Confirm", cancelLabel = "Cancel", destructive = false, busy = false, onConfirm }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialog"], {
        open: open,
        onOpenChange: onOpenChange,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogContent"], {
            className: "sm:max-w-md",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogHeader"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogTitle"], {
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/components/ui/confirm-dialog.tsx",
                            lineNumber: 50,
                            columnNumber: 11
                        }, this),
                        description ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogDescription"], {
                            children: description
                        }, void 0, false, {
                            fileName: "[project]/components/ui/confirm-dialog.tsx",
                            lineNumber: 52,
                            columnNumber: 13
                        }, this) : null
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ui/confirm-dialog.tsx",
                    lineNumber: 49,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogFooter"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogCancel"], {
                            disabled: busy,
                            onClick: ()=>onOpenChange(false),
                            children: cancelLabel
                        }, void 0, false, {
                            fileName: "[project]/components/ui/confirm-dialog.tsx",
                            lineNumber: 56,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogAction"], {
                            disabled: busy,
                            onClick: (e)=>{
                                e.preventDefault();
                                onConfirm();
                            },
                            className: destructive ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : undefined,
                            children: busy ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                        className: "h-4 w-4 mr-1.5 animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ui/confirm-dialog.tsx",
                                        lineNumber: 76,
                                        columnNumber: 17
                                    }, this),
                                    confirmLabel,
                                    "…"
                                ]
                            }, void 0, true) : confirmLabel
                        }, void 0, false, {
                            fileName: "[project]/components/ui/confirm-dialog.tsx",
                            lineNumber: 62,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ui/confirm-dialog.tsx",
                    lineNumber: 55,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/ui/confirm-dialog.tsx",
            lineNumber: 48,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/confirm-dialog.tsx",
        lineNumber: 47,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/dashboard/dashboard-header.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DashboardHeader",
    ()=>DashboardHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$stethoscope$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Stethoscope$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/stethoscope.js [app-ssr] (ecmascript) <export default as Stethoscope>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UserPlus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user-plus.js [app-ssr] (ecmascript) <export default as UserPlus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
function DashboardHeader({ canSeeRegisterAndCreate, onRegisterNewPatient, onCreateVisit }) {
    if (!canSeeRegisterAndCreate) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "hidden md:flex flex-row items-center gap-3 w-full justify-end pr-14 sm:pr-20 py-0.5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                onClick: onRegisterNewPatient,
                className: "bg-orange-500 hover:bg-orange-600 text-white rounded-full px-5 py-2 shadow-md hover:shadow-lg transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2 cursor-pointer",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UserPlus$3e$__["UserPlus"], {
                        className: "w-4 h-4"
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/dashboard-header.tsx",
                        lineNumber: 27,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Register New Patient"
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/dashboard-header.tsx",
                        lineNumber: 28,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/dashboard/dashboard-header.tsx",
                lineNumber: 23,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                onClick: onCreateVisit,
                className: "bg-yellow-500 hover:bg-yellow-600 text-white rounded-full px-5 py-2 shadow-md hover:shadow-lg transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2 cursor-pointer",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$stethoscope$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Stethoscope$3e$__["Stethoscope"], {
                        className: "w-4 h-4"
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/dashboard-header.tsx",
                        lineNumber: 34,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Create Visit"
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/dashboard-header.tsx",
                        lineNumber: 35,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/dashboard/dashboard-header.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/dashboard/dashboard-header.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/ui/skeleton.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Skeleton",
    ()=>Skeleton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
;
;
function Skeleton({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "skeleton",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('bg-accent animate-pulse rounded-md', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/skeleton.tsx",
        lineNumber: 5,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/components/dashboard/dashboard-stats.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DashboardStats",
    ()=>DashboardStats
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-ssr] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-ssr] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-ssr] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/skeleton.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
function DashboardStats({ showMetrics, loading, totalOpen = 0, totalCompleted = 0, totalWaitingForBilling = 0 }) {
    if (!showMetrics) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid grid-cols-3 gap-2 md:gap-4 mb-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-1.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl md:rounded-3xl p-3 md:p-6 shadow-lg hover:shadow-xl transition-all duration-200",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start justify-between gap-2 md:gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "min-w-0 w-full md:w-auto",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "hidden md:block text-xs md:text-sm text-muted-foreground mb-1 md:mb-2 font-medium truncate",
                                            children: "Open"
                                        }, void 0, false, {
                                            fileName: "[project]/components/dashboard/dashboard-stats.tsx",
                                            lineNumber: 23,
                                            columnNumber: 15
                                        }, this),
                                        loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                                            className: "h-7 md:h-9 w-12 md:w-16"
                                        }, void 0, false, {
                                            fileName: "[project]/components/dashboard/dashboard-stats.tsx",
                                            lineNumber: 24,
                                            columnNumber: 26
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xl md:text-3xl font-bold text-foreground text-center md:text-left",
                                            children: totalOpen
                                        }, void 0, false, {
                                            fileName: "[project]/components/dashboard/dashboard-stats.tsx",
                                            lineNumber: 24,
                                            columnNumber: 77
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/dashboard/dashboard-stats.tsx",
                                    lineNumber: 22,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "hidden md:block bg-orange-500/10 p-2 md:p-3 rounded-xl md:rounded-2xl flex-shrink-0",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                        className: "w-4 h-4 md:w-6 md:h-6 text-orange-500"
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/dashboard-stats.tsx",
                                        lineNumber: 27,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/dashboard-stats.tsx",
                                    lineNumber: 26,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/dashboard/dashboard-stats.tsx",
                            lineNumber: 21,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/dashboard-stats.tsx",
                        lineNumber: 20,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "md:hidden text-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "inline-block px-2.5 py-1 bg-orange-500/10 text-orange-700 dark:text-orange-400 text-xs font-semibold rounded-full border border-orange-200 dark:border-orange-900/50",
                            children: "Open"
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard/dashboard-stats.tsx",
                            lineNumber: 32,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/dashboard-stats.tsx",
                        lineNumber: 31,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/dashboard/dashboard-stats.tsx",
                lineNumber: 19,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-1.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl md:rounded-3xl p-3 md:p-6 shadow-lg hover:shadow-xl transition-all duration-200",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start justify-between gap-2 md:gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "min-w-0 w-full md:w-auto",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "hidden md:block text-xs md:text-sm text-muted-foreground mb-1 md:mb-2 font-medium truncate",
                                            children: "Discharged"
                                        }, void 0, false, {
                                            fileName: "[project]/components/dashboard/dashboard-stats.tsx",
                                            lineNumber: 39,
                                            columnNumber: 15
                                        }, this),
                                        loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                                            className: "h-7 md:h-9 w-12 md:w-16"
                                        }, void 0, false, {
                                            fileName: "[project]/components/dashboard/dashboard-stats.tsx",
                                            lineNumber: 40,
                                            columnNumber: 26
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xl md:text-3xl font-bold text-foreground text-center md:text-left",
                                            children: totalCompleted
                                        }, void 0, false, {
                                            fileName: "[project]/components/dashboard/dashboard-stats.tsx",
                                            lineNumber: 40,
                                            columnNumber: 77
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/dashboard/dashboard-stats.tsx",
                                    lineNumber: 38,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "hidden md:block bg-primary/10 p-2 md:p-3 rounded-xl md:rounded-2xl flex-shrink-0",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                        className: "w-4 h-4 md:w-6 md:h-6 text-primary"
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/dashboard-stats.tsx",
                                        lineNumber: 43,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/dashboard-stats.tsx",
                                    lineNumber: 42,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/dashboard/dashboard-stats.tsx",
                            lineNumber: 37,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/dashboard-stats.tsx",
                        lineNumber: 36,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "md:hidden text-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "inline-block px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20",
                            children: "Discharged"
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard/dashboard-stats.tsx",
                            lineNumber: 48,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/dashboard-stats.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/dashboard/dashboard-stats.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-1.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl md:rounded-3xl p-3 md:p-6 shadow-lg hover:shadow-xl transition-all duration-200",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start justify-between gap-2 md:gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "min-w-0 w-full md:w-auto",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "hidden md:block text-xs md:text-sm text-muted-foreground mb-1 md:mb-2 font-medium truncate",
                                            children: "Waiting"
                                        }, void 0, false, {
                                            fileName: "[project]/components/dashboard/dashboard-stats.tsx",
                                            lineNumber: 55,
                                            columnNumber: 15
                                        }, this),
                                        loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                                            className: "h-7 md:h-9 w-12 md:w-16"
                                        }, void 0, false, {
                                            fileName: "[project]/components/dashboard/dashboard-stats.tsx",
                                            lineNumber: 56,
                                            columnNumber: 26
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xl md:text-3xl font-bold text-foreground text-center md:text-left",
                                            children: totalWaitingForBilling
                                        }, void 0, false, {
                                            fileName: "[project]/components/dashboard/dashboard-stats.tsx",
                                            lineNumber: 56,
                                            columnNumber: 77
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/dashboard/dashboard-stats.tsx",
                                    lineNumber: 54,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "hidden md:block bg-green-500/10 p-2 md:p-3 rounded-xl md:rounded-2xl flex-shrink-0",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                        className: "w-4 h-4 md:w-6 md:h-6 text-green-500"
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/dashboard-stats.tsx",
                                        lineNumber: 59,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/dashboard-stats.tsx",
                                    lineNumber: 58,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/dashboard/dashboard-stats.tsx",
                            lineNumber: 53,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/dashboard-stats.tsx",
                        lineNumber: 52,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "md:hidden text-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "inline-block px-2.5 py-1 bg-green-500/10 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full border border-green-200 dark:border-green-900/50",
                            children: "Waiting"
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard/dashboard-stats.tsx",
                            lineNumber: 64,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/dashboard-stats.tsx",
                        lineNumber: 63,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/dashboard/dashboard-stats.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/dashboard/dashboard-stats.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/dashboard/dashboard-mobile-ui.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DashboardMobileUi",
    ()=>DashboardMobileUi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$stethoscope$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Stethoscope$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/stethoscope.js [app-ssr] (ecmascript) <export default as Stethoscope>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UserPlus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user-plus.js [app-ssr] (ecmascript) <export default as UserPlus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/alert-dialog.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function DashboardMobileUi({ canSeeRegisterAndCreate, allVisits, searchQuery, setSearchQuery, mobileSearchActive, setMobileSearchActive, showMobileActionSheet, setShowMobileActionSheet, setShowPatientRegistrationModal, openVisitCreationModal }) {
    const matchedVisits = allVisits.filter((visit)=>`${visit.patient.firstName} ${visit.patient.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            mobileSearchActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "md:hidden fixed inset-0 top-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 p-4 border-b border-border/30",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                        className: "absolute left-4 top-3.5 w-4 h-4 text-muted-foreground"
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/dashboard-mobile-ui.tsx",
                                        lineNumber: 51,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        placeholder: "Search patients...",
                                        value: searchQuery,
                                        onChange: (e)=>setSearchQuery(e.target.value),
                                        autoFocus: true,
                                        className: "w-full pl-11 pr-4 py-3 bg-card/80 dark:bg-slate-900/70 backdrop-blur-sm border border-border/50 dark:border-slate-800 rounded-full text-foreground dark:text-slate-100 placeholder-muted-foreground dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 shadow-sm"
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/dashboard-mobile-ui.tsx",
                                        lineNumber: 52,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/dashboard/dashboard-mobile-ui.tsx",
                                lineNumber: 50,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                type: "button",
                                size: "icon",
                                variant: "outline",
                                className: "rounded-full h-10 w-10 flex-shrink-0",
                                onClick: ()=>{
                                    setMobileSearchActive(false);
                                    setSearchQuery("");
                                },
                                title: "Close",
                                "aria-label": "Close search",
                                children: "✕"
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/dashboard-mobile-ui.tsx",
                                lineNumber: 61,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/dashboard/dashboard-mobile-ui.tsx",
                        lineNumber: 49,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 overflow-y-auto",
                        children: searchQuery ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "divide-y divide-border/30",
                            children: [
                                matchedVisits.map((visit)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setSearchQuery(`${visit.patient.firstName} ${visit.patient.lastName}`);
                                            setMobileSearchActive(false);
                                        },
                                        className: "w-full px-4 py-4 text-left hover:bg-muted/50 active:bg-muted/70 transition-colors",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-medium text-foreground text-base",
                                                children: [
                                                    visit.patient.firstName,
                                                    " ",
                                                    visit.patient.lastName
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/dashboard/dashboard-mobile-ui.tsx",
                                                lineNumber: 89,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-muted-foreground mt-1",
                                                children: new Date(visit.visitDate).toLocaleDateString()
                                            }, void 0, false, {
                                                fileName: "[project]/components/dashboard/dashboard-mobile-ui.tsx",
                                                lineNumber: 92,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, visit.id, true, {
                                        fileName: "[project]/components/dashboard/dashboard-mobile-ui.tsx",
                                        lineNumber: 81,
                                        columnNumber: 19
                                    }, this)),
                                matchedVisits.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "px-4 py-8 text-center text-muted-foreground",
                                    children: "No patients found"
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/dashboard-mobile-ui.tsx",
                                    lineNumber: 96,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/dashboard/dashboard-mobile-ui.tsx",
                            lineNumber: 79,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-center h-full",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-muted-foreground text-center",
                                children: "Start typing to search patients"
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/dashboard-mobile-ui.tsx",
                                lineNumber: 101,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard/dashboard-mobile-ui.tsx",
                            lineNumber: 100,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/dashboard-mobile-ui.tsx",
                        lineNumber: 77,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/dashboard/dashboard-mobile-ui.tsx",
                lineNumber: 48,
                columnNumber: 9
            }, this),
            canSeeRegisterAndCreate && !mobileSearchActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "md:hidden fixed bottom-6 right-6 z-40",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>setShowMobileActionSheet(true),
                    className: "w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                        className: "w-6 h-6"
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/dashboard-mobile-ui.tsx",
                        lineNumber: 114,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/dashboard/dashboard-mobile-ui.tsx",
                    lineNumber: 110,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/dashboard/dashboard-mobile-ui.tsx",
                lineNumber: 109,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialog"], {
                open: showMobileActionSheet,
                onOpenChange: setShowMobileActionSheet,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogContent"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogTitle"], {
                                    children: "What would you like to do?"
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/dashboard-mobile-ui.tsx",
                                    lineNumber: 122,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogDescription"], {
                                    children: "Create a new patient record or start a visit for an existing patient."
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/dashboard-mobile-ui.tsx",
                                    lineNumber: 123,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/dashboard/dashboard-mobile-ui.tsx",
                            lineNumber: 121,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogAction"], {
                                    onClick: ()=>{
                                        setShowMobileActionSheet(false);
                                        setShowPatientRegistrationModal(true);
                                    },
                                    className: "bg-orange-500 hover:bg-orange-600 text-white",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UserPlus$3e$__["UserPlus"], {
                                            className: "w-4 h-4 mr-2"
                                        }, void 0, false, {
                                            fileName: "[project]/components/dashboard/dashboard-mobile-ui.tsx",
                                            lineNumber: 135,
                                            columnNumber: 15
                                        }, this),
                                        "Register New Patient"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/dashboard/dashboard-mobile-ui.tsx",
                                    lineNumber: 128,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogAction"], {
                                    onClick: ()=>{
                                        setShowMobileActionSheet(false);
                                        openVisitCreationModal();
                                    },
                                    className: "bg-yellow-500 hover:bg-yellow-600 text-white",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$stethoscope$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Stethoscope$3e$__["Stethoscope"], {
                                            className: "w-4 h-4 mr-2"
                                        }, void 0, false, {
                                            fileName: "[project]/components/dashboard/dashboard-mobile-ui.tsx",
                                            lineNumber: 145,
                                            columnNumber: 15
                                        }, this),
                                        "Create Visit"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/dashboard/dashboard-mobile-ui.tsx",
                                    lineNumber: 138,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogCancel"], {
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/dashboard-mobile-ui.tsx",
                                    lineNumber: 148,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/dashboard/dashboard-mobile-ui.tsx",
                            lineNumber: 127,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/dashboard/dashboard-mobile-ui.tsx",
                    lineNumber: 120,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/dashboard/dashboard-mobile-ui.tsx",
                lineNumber: 119,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
}),
"[project]/components/inline-try-again.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>InlineTryAgain
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2d$off$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__WifiOff$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wifi-off.js [app-ssr] (ecmascript) <export default as WifiOff>");
"use client";
;
;
function InlineTryAgain({ onTryAgain, className = "", trying = false }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `w-full flex items-center justify-center py-6 ${className}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            role: "button",
            tabIndex: 0,
            onClick: onTryAgain,
            onKeyDown: (event)=>{
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onTryAgain();
                }
            },
            "aria-disabled": trying,
            className: `group flex flex-col items-center gap-3 rounded-2xl border px-8 py-6 shadow-sm transition ${trying ? "cursor-wait border-slate-300 bg-slate-100 text-slate-500" : "cursor-pointer border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100"}`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2d$off$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__WifiOff$3e$__["WifiOff"], {
                    className: `h-20 w-20 ${trying ? "animate-pulse" : "group-hover:scale-105"} transition`
                }, void 0, false, {
                    fileName: "[project]/components/inline-try-again.tsx",
                    lineNumber: 31,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-base font-semibold",
                    children: trying ? "Trying again..." : "Disconnected"
                }, void 0, false, {
                    fileName: "[project]/components/inline-try-again.tsx",
                    lineNumber: 32,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-sm opacity-80",
                    children: trying ? "Please wait" : "Tap icon to try again"
                }, void 0, false, {
                    fileName: "[project]/components/inline-try-again.tsx",
                    lineNumber: 33,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/inline-try-again.tsx",
            lineNumber: 14,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/inline-try-again.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/ui/popover.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Popover",
    ()=>Popover,
    "PopoverAnchor",
    ()=>PopoverAnchor,
    "PopoverArrow",
    ()=>PopoverArrow,
    "PopoverContent",
    ()=>PopoverContent,
    "PopoverTrigger",
    ()=>PopoverTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-popover/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
function Popover({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "popover",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/popover.tsx",
        lineNumber: 11,
        columnNumber: 10
    }, this);
}
function PopoverTrigger({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Trigger"], {
        "data-slot": "popover-trigger",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/popover.tsx",
        lineNumber: 17,
        columnNumber: 10
    }, this);
}
function PopoverContent({ className, align = 'center', sideOffset = 4, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Portal"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Content"], {
            "data-slot": "popover-content",
            align: align,
            sideOffset: sideOffset,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-[150] w-72 max-h-(--radix-popover-content-available-height) overflow-y-auto origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden', className),
            ...props
        }, void 0, false, {
            fileName: "[project]/components/ui/popover.tsx",
            lineNumber: 28,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/popover.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
function PopoverAnchor({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Anchor"], {
        "data-slot": "popover-anchor",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/popover.tsx",
        lineNumber: 45,
        columnNumber: 10
    }, this);
}
function PopoverArrow({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Arrow"], {
        "data-slot": "popover-arrow",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('fill-current', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/popover.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/lib/invoice-utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildInvoiceHtml",
    ()=>buildInvoiceHtml,
    "getInvoiceErrorMessage",
    ()=>getInvoiceErrorMessage,
    "openInvoicePreview",
    ()=>openInvoicePreview,
    "resolveInvoiceUrl",
    ()=>resolveInvoiceUrl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$runtime$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/runtime-config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoice$2d$viewer$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/invoice-viewer.ts [app-ssr] (ecmascript)");
;
;
;
function getInvoiceErrorMessage(response, fallback = "Failed to generate invoice") {
    if (response?.message) return response.message;
    const fromMessages = response?.messages?.map((m)=>m.text).filter(Boolean).join(", ");
    return fromMessages || fallback;
}
function buildFullUrl(path) {
    if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
        return path;
    }
    // Signed storage URLs returned by the backend must be served through the
    // frontend proxy route so the browser never talks to the backend or storage
    // directly. The rewrite maps /storage/sign/:path* onto
    // ${SUPABASE_INTERNAL_URL}/storage/v1/object/sign/:path*.
    if (path.startsWith("/storage/v1/object/sign/")) {
        return path.replace(/^\/storage\/v1\/object\/sign\//, "/storage/sign/");
    }
    if (path.startsWith("/storage/sign/")) {
        return path; // already proxied
    }
    if (path.startsWith("/storage/v1/object/public/")) {
        return `/supa/${path.slice("/storage/v1/object/public/".length)}`;
    }
    if (path.startsWith("/supa/")) {
        return path; // already proxied public file
    }
    // Any other root-relative path is already frontend-relative.
    if (path.startsWith("/")) {
        return path;
    }
    const base = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$runtime$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getRuntimeConfig"])().API_BASE_URL || "";
    const separator = base.endsWith("/") ? "" : "/";
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `${base}${separator}${cleanPath}`;
}
async function resolveInvoiceUrl(billId, generateInvoice, copyType) {
    const response = await generateInvoice(billId, {
        copyType
    });
    const signedUrl = response?.data?.signedUrl;
    if (response?.status === "SUCCESS" && signedUrl) {
        return buildFullUrl(signedUrl);
    }
    throw new Error(getInvoiceErrorMessage(response));
}
const escapeHtml = (value)=>value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
function buildInvoiceHtml(options) {
    const { invoiceNumber, invoiceDate, patientName, patientId, paymentMethod, visitDate, items, totals } = options;
    return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Invoice ${escapeHtml(invoiceNumber)}</title>
    <style>
      @page { size: A4; margin: 16mm; }
      body { font-family: Arial, Helvetica, sans-serif; color: #1f2937; margin: 0; }
      .invoice { width: 100%; }
      .header { display: flex; justify-content: space-between; border-bottom: 2px solid #111827; padding-bottom: 12px; margin-bottom: 18px; }
      .title { font-size: 24px; font-weight: 700; margin: 0; letter-spacing: .3px; }
      .muted { color: #6b7280; font-size: 12px; margin: 2px 0; }
      .section { margin-bottom: 16px; }
      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      .box { border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px; }
      table { width: 100%; border-collapse: collapse; margin-top: 8px; }
      th, td { border: 1px solid #e5e7eb; padding: 8px; font-size: 12px; }
      th { background: #f3f4f6; text-align: left; }
      .right { text-align: right; }
      .totals { width: 320px; margin-left: auto; margin-top: 14px; }
      .totals td { border: none; padding: 4px 0; }
      .grand td { border-top: 1px solid #d1d5db; font-weight: 700; padding-top: 8px; }
      .footer { margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 10px; font-size: 11px; color: #6b7280; }
    </style>
  </head>
  <body>
    <div class="invoice">
      <div class="header">
        <div>
          <h1 class="title">med Invoice</h1>
          <p class="muted">Formal Billing Statement</p>
        </div>
        <div>
          <p class="muted"><strong>Invoice #:</strong> ${escapeHtml(invoiceNumber)}</p>
          <p class="muted"><strong>Date:</strong> ${new Date(invoiceDate).toLocaleString()}</p>
        </div>
      </div>

      <div class="section grid">
        <div class="box">
          <p class="muted"><strong>Patient</strong></p>
          <p>${escapeHtml(patientName || "N/A")}</p>
          <p class="muted">Patient ID: ${escapeHtml(patientId || "N/A")}</p>
        </div>
        <div class="box">
          <p class="muted"><strong>Payment</strong></p>
          <p class="muted">Method: ${escapeHtml((paymentMethod || "MOBILE_MONEY").toUpperCase())}</p>
          <p class="muted">Visit Date: ${visitDate ? new Date(visitDate).toLocaleDateString() : ""}</p>
        </div>
      </div>

      <div class="section">
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th class="right">Qty</th>
              <th class="right">Unit Price</th>
              <th class="right">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((item)=>`<tr>
                  <td>${escapeHtml(item.description || "Item")}</td>
                  <td class="right">${item.quantity}</td>
                  <td class="right">${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatRWF"])(item.unitPrice || 0)}</td>
                  <td class="right">${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatRWF"])(item.lineTotal || 0)}</td>
                </tr>`).join("")}
          </tbody>
        </table>
      </div>

      <table class="totals">
        <tr><td>Subtotal</td><td class="right">${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatRWF"])(totals.subtotal || 0)}</td></tr>
        <tr class="grand"><td>Total Due</td><td class="right">${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatRWF"])(totals.totalDue || 0)}</td></tr>
        <tr><td>Paid</td><td class="right">${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatRWF"])(totals.paid || 0)}</td></tr>
        <tr><td>Balance</td><td class="right">${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatRWF"])(totals.balance || 0)}</td></tr>
      </table>

      <div class="footer">
        Generated by med Billing Module.
      </div>
    </div>
  </body>
</html>`;
}
function deriveInvoiceFileName(url) {
    if (url.startsWith("data:") || url.startsWith("blob:")) return "invoice.pdf";
    const segment = (url.split("?")[0].split("/").pop() || "").trim();
    if (!segment) return "invoice.pdf";
    return segment.endsWith(".pdf") ? segment : `${segment}.pdf`;
}
function openInvoicePreview(urlOrBase64) {
    const fullUrl = buildFullUrl(urlOrBase64);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoice$2d$viewer$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["openInvoiceViewer"])(fullUrl, deriveInvoiceFileName(fullUrl));
}
}),
"[project]/components/dashboard/dashboard-filter-card.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DashboardFilterCardContent",
    ()=>DashboardFilterCardContent,
    "DashboardFilterPopover",
    ()=>DashboardFilterPopover
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sliders-horizontal.js [app-ssr] (ecmascript) <export default as SlidersHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-ssr] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-ssr] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-ssr] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rotate-ccw.js [app-ssr] (ecmascript) <export default as RotateCcw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/database.js [app-ssr] (ecmascript) <export default as Database>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-ssr] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/popover.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function DashboardFilterCardContent({ canQueryAnswerState, answersFilter, setAnswersFilter, genderFilter, setGenderFilter, ageRange, setAgeRange, customAgeMin, setCustomAgeMin, customAgeMax, setCustomAgeMax, dobFilter, setDobFilter, searchAllHistorical, setSearchAllHistorical, showDatabaseSearch, activeFilterCount, handleResetFilters, loadingHistoricalSearch, matchCount, onClose }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between pb-2 border-b border-border/40",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__["SlidersHorizontal"], {
                                className: "w-4 h-4 text-primary"
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                                lineNumber: 78,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm font-semibold text-foreground",
                                children: "Filter Visits"
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                                lineNumber: 79,
                                columnNumber: 11
                            }, this),
                            activeFilterCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "px-1.5 py-0.5 rounded-full bg-primary/15 text-primary text-[11px] font-bold",
                                children: [
                                    activeFilterCount,
                                    " active"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                                lineNumber: 81,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                        lineNumber: 77,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            activeFilterCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: handleResetFilters,
                                className: "text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors cursor-pointer",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__["RotateCcw"], {
                                        className: "w-3 h-3"
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                                        lineNumber: 93,
                                        columnNumber: 15
                                    }, this),
                                    "Reset"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                                lineNumber: 88,
                                columnNumber: 13
                            }, this),
                            onClose && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: onClose,
                                className: "text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors cursor-pointer",
                                "aria-label": "Close filters",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    className: "w-3.5 h-3.5"
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                                    lineNumber: 104,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                                lineNumber: 98,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                        lineNumber: 86,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                lineNumber: 76,
                columnNumber: 7
            }, this),
            canQueryAnswerState && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-1.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "text-xs font-semibold text-muted-foreground flex items-center gap-1.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                className: "w-3.5 h-3.5 text-primary"
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                                lineNumber: 114,
                                columnNumber: 13
                            }, this),
                            "Consultation Answers"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                        lineNumber: 113,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-3 gap-1 p-1 rounded-xl bg-muted/60 dark:bg-slate-800/60 border border-border/40",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setAnswersFilter("all"),
                                className: `py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${answersFilter === "all" ? "bg-background text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"}`,
                                children: "All"
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                                lineNumber: 118,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setAnswersFilter("finalised"),
                                className: `py-1.5 px-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 ${answersFilter === "finalised" ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-semibold" : "text-muted-foreground hover:text-foreground"}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                        className: "w-3 h-3 text-emerald-600 dark:text-emerald-400 stroke-[2.5]"
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                                        lineNumber: 138,
                                        columnNumber: 15
                                    }, this),
                                    "Finalised"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                                lineNumber: 129,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setAnswersFilter("pending"),
                                className: `py-1.5 px-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 ${answersFilter === "pending" ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-semibold" : "text-muted-foreground hover:text-foreground"}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "w-1.5 h-1.5 rounded-full bg-amber-400"
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                                        lineNumber: 150,
                                        columnNumber: 15
                                    }, this),
                                    "Pending"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                                lineNumber: 141,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                        lineNumber: 117,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                lineNumber: 112,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-1.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "text-xs font-semibold text-muted-foreground flex items-center gap-1.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                className: "w-3.5 h-3.5 text-primary"
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                                lineNumber: 160,
                                columnNumber: 11
                            }, this),
                            "Patient Gender"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                        lineNumber: 159,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-4 gap-1 p-1 rounded-xl bg-muted/60 dark:bg-slate-800/60 border border-border/40",
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
                        ].map((g)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setGenderFilter(g.id),
                                className: `py-1.5 px-2 rounded-lg text-xs font-medium text-center transition-all ${genderFilter === g.id ? "bg-background text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"}`,
                                children: g.label
                            }, g.id, false, {
                                fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                                lineNumber: 172,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                        lineNumber: 163,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                lineNumber: 158,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-1.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "text-xs font-semibold text-muted-foreground flex items-center gap-1.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                className: "w-3.5 h-3.5 text-primary"
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                                lineNumber: 191,
                                columnNumber: 11
                            }, this),
                            "Patient Age / Date of Birth (DOB)"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                        lineNumber: 190,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-3 gap-1 p-1 rounded-xl bg-muted/60 dark:bg-slate-800/60 border border-border/40 text-xs",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>{
                                    setAgeRange("all");
                                    setDobFilter("");
                                },
                                className: `py-1 px-2 rounded-lg font-medium transition-all ${ageRange === "all" && !dobFilter ? "bg-background text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"}`,
                                children: "All ages"
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                                lineNumber: 195,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>{
                                    setAgeRange("pediatric");
                                    setDobFilter("");
                                },
                                className: `py-1 px-2 rounded-lg font-medium transition-all ${ageRange === "pediatric" ? "bg-background text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"}`,
                                children: "0-17 yrs"
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                                lineNumber: 209,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>{
                                    setAgeRange("adult");
                                    setDobFilter("");
                                },
                                className: `py-1 px-2 rounded-lg font-medium transition-all ${ageRange === "adult" ? "bg-background text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"}`,
                                children: "18-64 yrs"
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                                lineNumber: 223,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>{
                                    setAgeRange("senior");
                                    setDobFilter("");
                                },
                                className: `py-1 px-2 rounded-lg font-medium transition-all ${ageRange === "senior" ? "bg-background text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"}`,
                                children: "65+ yrs"
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                                lineNumber: 237,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>{
                                    setAgeRange("custom");
                                    setDobFilter("");
                                },
                                className: `py-1 px-2 rounded-lg font-medium transition-all text-center ${ageRange === "custom" ? "bg-background text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"}`,
                                children: "Custom Age"
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                                lineNumber: 251,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>{
                                    setAgeRange("dob");
                                },
                                className: `py-1 px-2 rounded-lg font-medium transition-all text-center ${ageRange === "dob" || dobFilter.trim() !== "" ? "bg-background text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"}`,
                                children: "Exact DOB"
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                                lineNumber: 265,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                        lineNumber: 194,
                        columnNumber: 9
                    }, this),
                    ageRange === "custom" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 pt-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "number",
                                    min: "0",
                                    max: "150",
                                    placeholder: "Min age",
                                    value: customAgeMin,
                                    onChange: (e)=>setCustomAgeMin(e.target.value),
                                    className: "w-full px-3 py-1.5 text-xs bg-background border border-border/60 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                                    lineNumber: 283,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                                lineNumber: 282,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-muted-foreground",
                                children: "to"
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                                lineNumber: 293,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "number",
                                    min: "0",
                                    max: "150",
                                    placeholder: "Max age",
                                    value: customAgeMax,
                                    onChange: (e)=>setCustomAgeMax(e.target.value),
                                    className: "w-full px-3 py-1.5 text-xs bg-background border border-border/60 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                                    lineNumber: 295,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                                lineNumber: 294,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                        lineNumber: 281,
                        columnNumber: 11
                    }, this),
                    (ageRange === "dob" || dobFilter) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 pt-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative flex-1",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "date",
                                    value: dobFilter,
                                    onChange: (e)=>setDobFilter(e.target.value),
                                    className: "w-full px-3 py-1.5 text-xs bg-background border border-border/60 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                                    lineNumber: 311,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                                lineNumber: 310,
                                columnNumber: 13
                            }, this),
                            dobFilter && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setDobFilter(""),
                                className: "px-2 py-1.5 text-[12px] text-muted-foreground hover:text-foreground border border-border/60 rounded-lg transition-colors cursor-pointer",
                                children: "Clear"
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                                lineNumber: 319,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                        lineNumber: 309,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                lineNumber: 189,
                columnNumber: 7
            }, this),
            showDatabaseSearch && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pt-2 border-t border-border/40",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                    className: "flex items-start gap-2.5 p-2 rounded-xl bg-muted/40 dark:bg-slate-800/40 border border-border/40 hover:bg-muted/60 transition-colors cursor-pointer select-none",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "checkbox",
                            checked: searchAllHistorical,
                            onChange: (e)=>setSearchAllHistorical(e.target.checked),
                            className: "mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary"
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                            lineNumber: 335,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 text-xs",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "font-semibold text-foreground flex items-center gap-1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__["Database"], {
                                            className: "w-3.5 h-3.5 text-primary"
                                        }, void 0, false, {
                                            fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                                            lineNumber: 343,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Search all visits in database"
                                        }, void 0, false, {
                                            fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                                            lineNumber: 344,
                                            columnNumber: 17
                                        }, this),
                                        loadingHistoricalSearch && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                            className: "w-3 h-3 animate-spin text-primary ml-auto"
                                        }, void 0, false, {
                                            fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                                            lineNumber: 346,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                                    lineNumber: 342,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[12px] text-muted-foreground mt-0.5 leading-snug",
                                    children: "Query complete historical backend records beyond the 7-day operational window."
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                                    lineNumber: 349,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                            lineNumber: 341,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                    lineNumber: 334,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                lineNumber: 333,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between pt-2 border-t border-border/40",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[12px] text-muted-foreground",
                        children: typeof matchCount === "number" ? `${matchCount} visits match` : ""
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                        lineNumber: 359,
                        columnNumber: 9
                    }, this),
                    onClose && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        type: "button",
                        size: "sm",
                        onClick: onClose,
                        className: "rounded-full px-4 h-7 text-xs font-semibold cursor-pointer",
                        children: "Done"
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                        lineNumber: 363,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                lineNumber: 358,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
        lineNumber: 74,
        columnNumber: 5
    }, this);
}
function DashboardFilterPopover(props) {
    const [open, setOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useState(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Popover"], {
        open: open,
        onOpenChange: setOpen,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PopoverTrigger"], {
                asChild: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    className: `relative inline-flex items-center justify-center h-9 w-9 rounded-full border transition-all duration-150 cursor-pointer shadow-2xs ${props.activeFilterCount > 0 ? "bg-primary/10 border-primary/40 text-primary hover:bg-primary/20" : "bg-card/80 dark:bg-slate-900/70 border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted/60"}`,
                    title: "Filter visits (Answers, Gender, Age, DOB, Deep Search)",
                    "aria-label": "Filter visits",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__["SlidersHorizontal"], {
                            className: "w-4 h-4"
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                            lineNumber: 393,
                            columnNumber: 11
                        }, this),
                        props.activeFilterCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold shadow-xs ring-2 ring-background",
                            children: props.activeFilterCount
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                            lineNumber: 395,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                    lineNumber: 383,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                lineNumber: 382,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PopoverContent"], {
                align: "end",
                sideOffset: 8,
                className: "w-80 sm:w-96 p-4 bg-card/95 dark:bg-slate-900/95 backdrop-blur-xl border border-border/60 dark:border-slate-800 shadow-2xl rounded-2xl space-y-4 z-[150] animate-in fade-in-0 zoom-in-95 duration-150",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DashboardFilterCardContent, {
                    ...props,
                    onClose: ()=>setOpen(false)
                }, void 0, false, {
                    fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                    lineNumber: 406,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
                lineNumber: 401,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/dashboard/dashboard-filter-card.tsx",
        lineNumber: 381,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/dashboard-page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$auth$2d$hooks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hooks/auth-hooks.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$queries$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/visits/queries.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$department$2d$mutations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/visits/department-mutations.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$billing$2f$hooks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/billing/hooks.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visit$2d$billing$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/visit-billing-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visit$2d$product$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/visit-product-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useLazyQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/react/hooks/useLazyQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/react/hooks/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hooks/queries/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$billing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/queries/billing.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/queries/visits.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/mutations/visits.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/gql-mappers.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$vital$2d$signs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/visits/vital-signs.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$floating$2d$header$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/floating-header.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$confirm$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/confirm-dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$dashboard$2d$header$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/dashboard/dashboard-header.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$dashboard$2d$stats$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/dashboard/dashboard-stats.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$dashboard$2d$mobile$2d$ui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/dashboard/dashboard-mobile-ui.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$visit$2d$mutations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/visits/visit-mutations.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/skeleton.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$inline$2d$try$2d$again$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/inline-try-again.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/tooltip.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/popover.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-ssr] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-ssr] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-ssr] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-ssr] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$stethoscope$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Stethoscope$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/stethoscope.js [app-ssr] (ecmascript) <export default as Stethoscope>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-ssr] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$pen$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UserPen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user-pen.js [app-ssr] (ecmascript) <export default as UserPen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$receipt$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ReceiptText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/receipt-text.js [app-ssr] (ecmascript) <export default as ReceiptText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/list.js [app-ssr] (ecmascript) <export default as List>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutGrid$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-grid.js [app-ssr] (ecmascript) <export default as LayoutGrid>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$pen$2d$line$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FilePenLine$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-pen-line.js [app-ssr] (ecmascript) <export default as FilePenLine>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/activity.js [app-ssr] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-ssr] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/history.js [app-ssr] (ecmascript) <export default as History>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-ssr] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sliders-horizontal.js [app-ssr] (ecmascript) <export default as SlidersHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/info.js [app-ssr] (ecmascript) <export default as Info>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-ssr] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ban$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Ban$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ban.js [app-ssr] (ecmascript) <export default as Ban>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package.js [app-ssr] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield.js [app-ssr] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-toastify/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$role$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/role-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoice$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/invoice-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$patient$2d$display$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/patient-display-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$dashboard$2d$filter$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/dashboard/dashboard-filter-card.tsx [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
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
const ConsultationPreviewSheet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(async ()=>{}, {
    loadableGenerated: {
        modules: [
            "[project]/components/dashboard/consultation-preview-sheet.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
const PatientHistorySidePane = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(async ()=>{}, {
    loadableGenerated: {
        modules: [
            "[project]/components/patient-history-side-pane.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
const PatientRegistrationModal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(async ()=>{}, {
    loadableGenerated: {
        modules: [
            "[project]/components/patient-registration-modal.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
const VisitCreationModal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(async ()=>{}, {
    loadableGenerated: {
        modules: [
            "[project]/components/visit-creation-modal.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
const AddDepartmentModal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(async ()=>{}, {
    loadableGenerated: {
        modules: [
            "[project]/components/add-department-modal.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
const PatientEditModal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(async ()=>{}, {
    loadableGenerated: {
        modules: [
            "[project]/components/patient-edit-modal.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
const ProfileSelectDialog = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(async ()=>{}, {
    loadableGenerated: {
        modules: [
            "[project]/components/profile-select-dialog.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
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
const BillingPreviewSheet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(async ()=>{}, {
    loadableGenerated: {
        modules: [
            "[project]/components/billing/billing-preview-sheet.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
const VisitSettingsPanel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(async ()=>{}, {
    loadableGenerated: {
        modules: [
            "[project]/components/manager/visit-settings-panel.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
;
;
;
function DashboardPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { doctor } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const { visits, loading, error, refetch: refetchVisits } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$queries$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useVisits"])();
    const [isMounted, setIsMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [viewMode, setViewMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("grid");
    const [showMetrics] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const { stats: dashboardStats, loading: dashboardStatsLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$queries$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDashboardStats"])(1, {
        skip: true
    });
    const { updateDepartmentStatus } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$department$2d$mutations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUpdateVisitDepartmentStatus"])();
    const { changeVisitDepartmentProfile } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$department$2d$mutations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useChangeVisitDepartmentProfile"])();
    const { consultVisit } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$department$2d$mutations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useConsultVisit"])();
    const { completeVisit } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$visit$2d$mutations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCompleteVisit"])();
    const { cancelVisit } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$visit$2d$mutations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCancelVisit"])();
    const { generateInvoice } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$billing$2f$hooks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGenerateInvoice"])();
    const [getVisitBillings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useLazyQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLazyQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$billing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GET_BILL_BY_VISIT_QUERY"]);
    const [finaliseVisitMutation, { loading: finalisingVisit }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FINALISE_VISIT_MUTATION"], {
        onCompleted: (data)=>{
            if (data?.finaliseVisit?.status === "SUCCESS") {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success("Visit finalised successfully");
                void refetchVisits();
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(data?.finaliseVisit?.message || "Failed to finalise visit");
            }
        },
        onError: (error)=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(error.message || "Failed to finalise visit");
        }
    });
    const [previewOpen, setPreviewOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [previewVisitBilling, setPreviewVisitBilling] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [previewDepartmentId, setPreviewDepartmentId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [previewVisit, setPreviewVisit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [previewStartedAt, setPreviewStartedAt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [statusFilter, setStatusFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("all");
    const [answersFilter, setAnswersFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("all");
    const [genderFilter, setGenderFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("all");
    const [ageRange, setAgeRange] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("all");
    const [customAgeMin, setCustomAgeMin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [customAgeMax, setCustomAgeMax] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [dobFilter, setDobFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [searchAllHistorical, setSearchAllHistorical] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [backendHistoricalVisits, setBackendHistoricalVisits] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const activeFilterCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        let count = 0;
        if (answersFilter !== "all") count++;
        if (genderFilter !== "all") count++;
        if (ageRange !== "all" || dobFilter.trim() !== "") count++;
        if (searchAllHistorical) count++;
        return count;
    }, [
        answersFilter,
        genderFilter,
        ageRange,
        dobFilter,
        searchAllHistorical
    ]);
    const handleResetFilters = ()=>{
        setAnswersFilter("all");
        setGenderFilter("all");
        setAgeRange("all");
        setCustomAgeMin("");
        setCustomAgeMax("");
        setDobFilter("");
        setSearchAllHistorical(false);
    };
    const [mobileSearchActive, setMobileSearchActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showMobileActionSheet, setShowMobileActionSheet] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }, [
        viewMode,
        isMounted
    ]);
    const [printingVisitId, setPrintingVisitId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [downloadingInvoiceId, setDownloadingInvoiceId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [navigatingVisitId, setNavigatingVisitId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editPatientModalOpen, setEditPatientModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedPatientForEdit, setSelectedPatientForEdit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Safety guard: auto-clear navigating state after 3.5s or on window focus
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!navigatingVisitId) return;
        const timer = setTimeout(()=>{
            setNavigatingVisitId(null);
        }, 3500);
        const handleFocus = ()=>setNavigatingVisitId(null);
        window.addEventListener("focus", handleFocus);
        return ()=>{
            clearTimeout(timer);
            window.removeEventListener("focus", handleFocus);
        };
    }, [
        navigatingVisitId
    ]);
    const roles = doctor?.roles || [];
    const userDepartments = doctor?.departments || [];
    const legacyUserDepartment = doctor?.department;
    const userDepartmentIds = userDepartments.length > 0 ? userDepartments.map((dept)=>String(dept.id || "")).filter(Boolean) : legacyUserDepartment?.id ? [
        String(legacyUserDepartment.id)
    ] : [];
    const hasReceptionistRole = roles.includes("RECEPTIONIST") || roles.includes("RECEPTION");
    const hasFinanceRole = roles.includes("FINANCE");
    const hasManagerRole = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$role$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasRole"])(roles, "MANAGER");
    const hasAdminRole = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$role$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasRole"])(roles, "ADMIN");
    const isReceptionistOnly = hasReceptionistRole && roles.length === 1;
    const hasNurseRole = roles.includes("NURSE") || roles.includes("NURSING");
    const hasConsultationRole = roles.some((role)=>[
            "DOCTOR",
            "OPHTHALMOLOGIST",
            "SPECIALIST",
            "ADMIN"
        ].includes(role));
    const hasClinicianOrDoctorRole = roles.some((role)=>[
            "CLINICIAN",
            "DOCTOR"
        ].includes(role));
    const canViewPatientHistory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$role$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasRole"])(roles, "CLINICIAN");
    // Billables visibility: detailed product names, counts, and items to bill are only visible to FINANCE, ADMIN, and MANAGER
    const canSeeBillables = hasFinanceRole || hasManagerRole || hasAdminRole;
    // Products visibility: Receptionists cannot see products. Visible to CLINICIAN, DOCTOR, NURSE, FINANCE, ADMIN, MANAGER
    const canSeeProducts = !isReceptionistOnly && (!hasReceptionistRole || hasFinanceRole || hasManagerRole || hasAdminRole || hasClinicianOrDoctorRole || hasNurseRole);
    // All departments can see that a patient is in billing
    const canSeeBillingInfo = true;
    const canSeeConsultButton = !isReceptionistOnly;
    // Bill button: Finance role always sees billing, regardless of other roles
    const canSeeBillButton = hasFinanceRole;
    // Add Department: only Receptionists can route a patient to a new department
    const canSeeAddDepartment = hasReceptionistRole;
    const canSeeEditPatient = hasReceptionistRole || hasAdminRole || hasManagerRole;
    const canSeeRegisterAndCreate = hasReceptionistRole;
    const canSeeVisitActionButtons = !isReceptionistOnly;
    // Discharge button: visible to FINANCE, MANAGER, and ADMIN when all departments are completed/finalised
    const canSeeDischargeButton = hasFinanceRole || hasManagerRole || hasAdminRole;
    // Duration & Department times visibility: Manager, Admin, and Receptionist can see all department times,
    // while other users can only see time spent in their own assigned department.
    const canViewAllDeptTimes = hasManagerRole || hasAdminRole || hasReceptionistRole;
    const isUserDept = (deptId)=>{
        if (!deptId) return false;
        return userDepartmentIds.includes(String(deptId));
    };
    const hasNonClinicianNonFinanceRoles = roles.some((r)=>[
            "RECEPTION",
            "RECEPTIONIST",
            "NURSE",
            "NURSING",
            "MANAGER",
            "ADMIN",
            "CLINIC_ADMIN",
            "STAFF"
        ].includes(r));
    const isSingleRoleClinician = hasClinicianOrDoctorRole && !hasFinanceRole && !hasNonClinicianNonFinanceRoles;
    const isSingleRoleFinance = hasFinanceRole && !hasClinicianOrDoctorRole && !hasNonClinicianNonFinanceRoles;
    const isSingleRoleNurse = hasNurseRole && !hasClinicianOrDoctorRole && !hasFinanceRole && !hasReceptionistRole && !hasManagerRole && !hasAdminRole;
    const isMultiRoleWithFinance = hasFinanceRole && (hasClinicianOrDoctorRole || hasNonClinicianNonFinanceRoles);
    const isMultiRoleWithClinician = hasClinicianOrDoctorRole && (hasFinanceRole || hasNonClinicianNonFinanceRoles);
    const canQueryAnswerState = (hasClinicianOrDoctorRole || hasManagerRole || hasAdminRole) && !isReceptionistOnly && !isSingleRoleFinance;
    const isClinicianProcessorForDept = (dept)=>{
        if (!dept) return false;
        const processors = dept.processors || [];
        const isAssignedProcessor = processors.some((p)=>String(p?.id || "") === String(doctor?.id || ""));
        const isDeptMember = userDepartmentIds.includes(String(dept.department?.id || dept.id || ""));
        return isAssignedProcessor || isDeptMember;
    };
    const canUserSeeDeptAnswerStatus = (dept)=>{
        if (isReceptionistOnly || isSingleRoleFinance) return false;
        if (hasManagerRole || hasAdminRole) return true;
        if (hasClinicianOrDoctorRole) {
            return isClinicianProcessorForDept(dept);
        }
        return false;
    };
    const getVisitClinicianDepartment = (visit)=>{
        return (visit.departments || []).find((dept)=>{
            return isClinicianProcessorForDept(dept);
        }) || null;
    };
    const getVisitAnswerState = (visit)=>{
        if (!hasManagerRole && !hasAdminRole && hasClinicianOrDoctorRole) {
            const clinDept = getVisitClinicianDepartment(visit);
            if (clinDept) {
                const isFinalised = Boolean(clinDept.hasFinalizedConsultationAnswers);
                const hasDraft = Boolean(clinDept.answerId && !clinDept.hasFinalizedConsultationAnswers);
                return {
                    isFinalised,
                    hasDraft,
                    isPending: !isFinalised
                };
            }
            return {
                isFinalised: false,
                hasDraft: false,
                isPending: true
            };
        }
        const nonCancelledDepts = (visit.departments || []).filter((d)=>d.status !== "CANCELLED");
        if (nonCancelledDepts.length === 0) {
            return {
                isFinalised: false,
                hasDraft: false,
                isPending: true
            };
        }
        const anyFinalised = nonCancelledDepts.some((d)=>Boolean(d.hasFinalizedConsultationAnswers));
        const anyDraft = nonCancelledDepts.some((d)=>Boolean(d.answerId && !d.hasFinalizedConsultationAnswers));
        return {
            isFinalised: anyFinalised,
            hasDraft: anyDraft,
            isPending: !anyFinalised
        };
    };
    const isClinicianNew = (visit)=>{
        if (visit.status === "COMPLETED" || visit.status === "CANCELLED") return false;
        return visit.departments?.some((dept)=>{
            const deptId = String(dept?.department?.id || dept?.id || "");
            if (!deptId || !userDepartmentIds.includes(deptId)) return false;
            if (dept.status === "FINALISED" || dept.status === "CANCELLED" || dept.status === "COMPLETED") return false;
            if (dept.status === "PENDING") return true;
            const processors = dept.processors || [];
            const isAssignedToMe = processors.some((p)=>String(p?.id || "") === String(doctor?.id || ""));
            return !isAssignedToMe;
        });
    };
    const isClinicianInProgress = (visit)=>{
        if (visit.status === "COMPLETED" || visit.status === "CANCELLED") return false;
        return visit.departments?.some((dept)=>{
            const deptId = String(dept?.department?.id || dept?.id || "");
            if (!deptId || !userDepartmentIds.includes(deptId)) return false;
            if (dept.status === "FINALISED" || dept.status === "CANCELLED" || dept.status === "COMPLETED") return false;
            if (dept.status === "PENDING") return false;
            const processors = dept.processors || [];
            return processors.some((p)=>String(p?.id || "") === String(doctor?.id || ""));
        });
    };
    const isFinanceNew = (visit)=>{
        if (visit.status === "COMPLETED" || visit.status === "CANCELLED") return false;
        return visit.departments?.some((d)=>d.status === "BILLING") || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visit$2d$product$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["visitHasUnbilledProducts"])(visit);
    };
    const isFinanceInProgress = (visit)=>{
        if (visit.status === "COMPLETED" || visit.status === "CANCELLED") return false;
        return !isFinanceNew(visit) && (visit.status === "IN_PROGRESS" || visit.status === "CREATED");
    };
    const isVisitBilling = (visit)=>{
        return isFinanceNew(visit);
    };
    const isVisitConsultation = (visit)=>{
        return isClinicianNew(visit);
    };
    const isNurseNew = (visit)=>{
        if (visit.status === "COMPLETED" || visit.status === "CANCELLED" || visit.status === "FINALISED") return false;
        const activeDepts = (visit.departments || []).filter((d)=>d.status !== "CANCELLED");
        return activeDepts.length === 0;
    };
    const isNurseInProgress = (visit)=>{
        if (visit.status === "COMPLETED" || visit.status === "CANCELLED" || visit.status === "FINALISED") return false;
        const activeDepts = (visit.departments || []).filter((d)=>d.status !== "CANCELLED");
        return activeDepts.length > 0;
    };
    const isVisitCompleted = (visit)=>{
        return visit.status === "COMPLETED" || visit.status === "FINALISED";
    };
    const isVisitInProgress = (visit)=>{
        if (visit.status === "COMPLETED" || visit.status === "CANCELLED" || visit.status === "FINALISED") return false;
        const activeDepts = (visit.departments || []).filter((d)=>d.status !== "CANCELLED");
        if (activeDepts.length === 0) return false;
        return visit.status === "CREATED" || visit.status === "IN_PROGRESS" || visit.status === "BILLING" || hasUnbilledItems(visit);
    };
    const availableTabs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (isSingleRoleClinician) {
            return [
                {
                    id: "NEW",
                    label: "New"
                },
                {
                    id: "IN_PROGRESS",
                    label: "In Progress"
                },
                {
                    id: "COMPLETED",
                    label: "Discharged"
                }
            ];
        }
        if (isSingleRoleFinance) {
            return [
                {
                    id: "NEW",
                    label: "New"
                },
                {
                    id: "IN_PROGRESS",
                    label: "In Progress"
                },
                {
                    id: "COMPLETED",
                    label: "Discharged"
                }
            ];
        }
        if (isSingleRoleNurse) {
            return [
                {
                    id: "NEW",
                    label: "New"
                },
                {
                    id: "IN_PROGRESS",
                    label: "In Progress"
                },
                {
                    id: "COMPLETED",
                    label: "Discharged"
                }
            ];
        }
        const tabs = [
            {
                id: "all",
                label: "All Visits"
            }
        ];
        if (isMultiRoleWithFinance) {
            tabs.push({
                id: "BILLING",
                label: "Billing"
            });
        }
        if (isMultiRoleWithClinician) {
            tabs.push({
                id: "CONSULTATION",
                label: "Consultation"
            });
        }
        tabs.push({
            id: "IN_PROGRESS",
            label: "In Progress"
        }, {
            id: "COMPLETED",
            label: "Discharged"
        });
        return tabs;
    }, [
        isSingleRoleClinician,
        isSingleRoleFinance,
        isSingleRoleNurse,
        isMultiRoleWithFinance,
        isMultiRoleWithClinician
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (availableTabs.length > 0 && !availableTabs.some((t)=>t.id === statusFilter)) {
            setStatusFilter(availableTabs[0].id);
        }
    }, [
        availableTabs,
        statusFilter
    ]);
    // Historical Discharged / Completed Visits Infinite Continuous Loading
    const [getOlderCompletedVisits, { loading: loadingOlderCompleted }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useLazyQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLazyQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VISITS_QUERY"], {
        fetchPolicy: "network-only"
    });
    const [completedPage, setCompletedPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [hasMoreCompleted, setHasMoreCompleted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [extraCompletedVisits, setExtraCompletedVisits] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const isFetchingCompletedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const fetchNextCompletedPage = async (pageToFetch)=>{
        if (isFetchingCompletedRef.current) return;
        if (!hasMoreCompleted && pageToFetch > 0) return;
        isFetchingCompletedRef.current = true;
        try {
            const res = await getOlderCompletedVisits({
                variables: {
                    input: {
                        status: "COMPLETED",
                        page: pageToFetch,
                        size: 20
                    }
                }
            });
            const fetchedRaw = res.data?.visits?.data || [];
            const totalPages = res.data?.visits?.pagination?.totalPages || 0;
            if (pageToFetch >= totalPages - 1 || fetchedRaw.length === 0) {
                setHasMoreCompleted(false);
            }
            const mapped = fetchedRaw.map((v)=>{
                const m = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGqlVisitListItem"])(v);
                m.vitalSigns = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$vital$2d$signs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeVisitVitalSigns"])(v.vitalSigns || []);
                return m;
            });
            setExtraCompletedVisits((prev)=>{
                const existingIds = new Set(prev.map((v)=>v.id));
                const combined = [
                    ...prev
                ];
                for (const item of mapped){
                    if (!existingIds.has(item.id)) {
                        combined.push(item);
                        existingIds.add(item.id);
                    }
                }
                return combined;
            });
            setCompletedPage(pageToFetch);
        } catch (err) {
            console.error("Failed to fetch older completed visits:", err);
        } finally{
            isFetchingCompletedRef.current = false;
        }
    };
    // When switching to COMPLETED tab, ensure initial page of completed visits is loaded
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (statusFilter === "COMPLETED" && extraCompletedVisits.length === 0) {
            void fetchNextCompletedPage(0);
        }
    }, [
        statusFilter
    ]);
    // Sentinel ref for automatic continuous scroll loading via IntersectionObserver
    const completedSentinelRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // IntersectionObserver for seamless auto-fetching as user scrolls near the bottom of Discharged visits
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (statusFilter !== "COMPLETED" || !hasMoreCompleted) return;
        const sentinel = completedSentinelRef.current;
        if (!sentinel) return;
        const observer = new IntersectionObserver((entries)=>{
            const [entry] = entries;
            if (entry.isIntersecting && !isFetchingCompletedRef.current && hasMoreCompleted) {
                void fetchNextCompletedPage(completedPage + 1);
            }
        }, {
            root: null,
            rootMargin: "350px",
            threshold: 0.05
        });
        observer.observe(sentinel);
        return ()=>observer.disconnect();
    }, [
        statusFilter,
        completedPage,
        hasMoreCompleted
    ]);
    const handleVisitsContainerScroll = (e)=>{
        if (statusFilter !== "COMPLETED" || !hasMoreCompleted || isFetchingCompletedRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollHeight - scrollTop - clientHeight < 300) {
            void fetchNextCompletedPage(completedPage + 1);
        }
    };
    // Deep Historical Backend Search Query
    const [fetchHistoricalVisits, { loading: loadingHistoricalSearch }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useLazyQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLazyQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$visits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VISITS_QUERY"], {
        fetchPolicy: "network-only"
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const shouldFetch = searchAllHistorical || statusFilter === "COMPLETED" && Boolean(searchQuery.trim());
        if (!shouldFetch) {
            if (!searchAllHistorical) {
                setBackendHistoricalVisits([]);
            }
            return;
        }
        let isMounted = true;
        const doFetch = async ()=>{
            try {
                const res = await fetchHistoricalVisits({
                    variables: {
                        input: {
                            patientName: searchQuery.trim() || undefined,
                            status: statusFilter !== "all" && statusFilter !== "NEW" && statusFilter !== "BILLING" && statusFilter !== "CONSULTATION" ? statusFilter : undefined,
                            recentDays: 0,
                            page: 0,
                            size: 50
                        }
                    }
                });
                if (!isMounted) return;
                const raw = res.data?.visits?.data || [];
                const mapped = raw.map((v)=>{
                    const m = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gql$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGqlVisitListItem"])(v);
                    m.vitalSigns = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$vital$2d$signs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeVisitVitalSigns"])(v.vitalSigns || []);
                    return m;
                });
                setBackendHistoricalVisits(mapped);
            } catch (err) {
                console.error("Historical visits query error:", err);
            }
        };
        // Immediate execution when toggling filter or tab, minimal debounce for typing
        const delay = searchQuery.trim() ? 150 : 0;
        if (delay === 0) {
            void doFetch();
            return ()=>{
                isMounted = false;
            };
        }
        const timer = setTimeout(doFetch, delay);
        return ()=>{
            isMounted = false;
            clearTimeout(timer);
        };
    }, [
        searchAllHistorical,
        searchQuery,
        statusFilter,
        fetchHistoricalVisits
    ]);
    // Modal states
    const [showPatientRegistrationModal, setShowPatientRegistrationModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showVisitCreationModal, setShowVisitCreationModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [registeredPatientId, setRegisteredPatientId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [locallyCreatedVisits, setLocallyCreatedVisits] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [addDepartmentModalOpen, setAddDepartmentModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedVisitForDepartment, setSelectedVisitForDepartment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [profileDialogOpen, setProfileDialogOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [profileDialogVisit, setProfileDialogVisit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [profileDialogLoading, setProfileDialogLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [profileDialogProfiles, setProfileDialogProfiles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [previewConsultationOpen, setPreviewConsultationOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [previewConsultationContext, setPreviewConsultationContext] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [patientHistoryOpen, setPatientHistoryOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [patientHistoryVisit, setPatientHistoryVisit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [settingsVisit, setSettingsVisit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [settingsPanelOpen, setSettingsPanelOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [departmentToCancel, setDepartmentToCancel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [cancelingDept, setCancelingDept] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [departmentToUncancel, setDepartmentToUncancel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [uncancelingDept, setUncancelingDept] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [visitToCancel, setVisitToCancel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [cancelingVisit, setCancelingVisit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const canUserCancelDepartment = (dept)=>{
        if (!dept || !dept.id) return false;
        const status = String(dept.status || "").toUpperCase();
        if (status === "COMPLETED" || status === "FINALISED" || status === "CANCELLED") return false;
        const canRoleCancel = hasReceptionistRole || hasFinanceRole || hasManagerRole || hasAdminRole;
        if (!canRoleCancel) return false;
        if (!hasManagerRole && !hasAdminRole) {
            const deptProducts = dept.products || [];
            if (deptProducts.length > 0) return false;
            if (dept.billingSnapshot && dept.billingSnapshot.status === "BILLED") return false;
        }
        return true;
    };
    const canUserUncancelDepartment = (visit, dept)=>{
        if (!dept || !dept.id || !visit || !visit.id) return false;
        const visitStatus = String(visit.status || "").toUpperCase();
        if (visitStatus === "COMPLETED" || visitStatus === "FINALISED" || visitStatus === "CANCELLED") {
            return false;
        }
        const deptStatus = String(dept.status || "").toUpperCase();
        if (deptStatus !== "CANCELLED") return false;
        const canRoleUncancel = hasReceptionistRole || hasFinanceRole || hasManagerRole || hasAdminRole || hasNurseRole || hasClinicianOrDoctorRole;
        return canRoleUncancel;
    };
    const canUserCancelWholeVisit = (visit)=>{
        if (!visit || !visit.id) return false;
        if (visit.status === "COMPLETED" || visit.status === "FINALISED" || visit.status === "CANCELLED") {
            return false;
        }
        const canRoleCancel = hasReceptionistRole || hasFinanceRole || hasManagerRole || hasAdminRole;
        if (!canRoleCancel) return false;
        if (countBilledProducts(visit) > 0 || countUnbilledProducts(visit) > 0) {
            return false;
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visit$2d$product$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["visitHasBillableProducts"])(visit)) {
            return false;
        }
        const allDepts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visit$2d$product$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["flattenVisitDepartments"])(visit.departments || []);
        const hasCompletedDept = allDepts.some((d)=>d.status === "COMPLETED" || d.status === "FINALISED");
        if (hasCompletedDept) return false;
        return true;
    };
    const handleConfirmCancelDepartment = async ()=>{
        if (!departmentToCancel || cancelingDept) return;
        setCancelingDept(true);
        try {
            const res = await updateDepartmentStatus(departmentToCancel.dept.id, "CANCELLED");
            if (res?.status === "SUCCESS") {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`${departmentToCancel.dept.department?.name || "Department"} cancelled successfully`);
                await refetchVisits();
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(res?.message || "Failed to cancel department");
            }
        } catch (err) {
            console.error("Cancel department error:", err);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(err?.message || "Failed to cancel department");
        } finally{
            setCancelingDept(false);
            setDepartmentToCancel(null);
        }
    };
    const handleConfirmUncancelDepartment = async ()=>{
        if (!departmentToUncancel || uncancelingDept) return;
        setUncancelingDept(true);
        try {
            const res = await updateDepartmentStatus(departmentToUncancel.dept.id, "PENDING");
            if (res?.status === "SUCCESS") {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`${departmentToUncancel.dept.department?.name || "Department"} re-enabled successfully`);
                await refetchVisits();
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(res?.message || "Failed to re-enable department");
            }
        } catch (err) {
            console.error("Re-enable department error:", err);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(err?.message || "Failed to re-enable department");
        } finally{
            setUncancelingDept(false);
            setDepartmentToUncancel(null);
        }
    };
    const handleConfirmCancelVisit = async ()=>{
        if (!visitToCancel || cancelingVisit) return;
        setCancelingVisit(true);
        try {
            const res = await cancelVisit(visitToCancel.id);
            if (res?.status === "SUCCESS") {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success("Visit cancelled successfully");
                await refetchVisits();
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(res?.message || "Failed to cancel visit");
            }
        } catch (err) {
            console.error("Cancel visit error:", err);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(err?.message || "Failed to cancel visit");
        } finally{
            setCancelingVisit(false);
            setVisitToCancel(null);
        }
    };
    const openVisitCreationModal = ()=>{
        setRegisteredPatientId(null);
        setShowVisitCreationModal(true);
    };
    const closeVisitCreationModal = ()=>{
        setShowVisitCreationModal(false);
        setRegisteredPatientId(null);
    };
    const hasUnbilledItems = (visit)=>{
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visit$2d$product$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["visitProductsFullySettled"])(visit)) return false;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visit$2d$product$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["visitHasUnbilledProducts"])(visit);
    };
    const hasNoBillables = (visit)=>!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visit$2d$product$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["visitHasBillableProducts"])(visit);
    const countUnbilledProducts = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visit$2d$product$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["countUnbilledVisitProducts"];
    const countBilledProducts = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visit$2d$product$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["countBilledVisitProducts"];
    const getUnbilledProductNames = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visit$2d$product$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getUnbilledVisitProductNames"];
    const getBilledProductNames = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visit$2d$product$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getBilledVisitProductNames"];
    const hasDepartmentReadyForBilling = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visit$2d$product$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["visitHasDepartmentReadyForBilling"];
    const formatProductsToBillLabel = (count)=>{
        if (count === 0) return "No products to bill";
        return count === 1 ? "1 product to bill" : `${count} products to bill`;
    };
    const formatProductsBilledLabel = (count)=>{
        if (count === 0) return "No products billed";
        return count === 1 ? "1 product billed" : `${count} products billed`;
    };
    const canPreviewVisitInvoice = (visit)=>{
        const isTerminal = visit.status === "COMPLETED" || visit.status === "FINALISED";
        if (isTerminal) return true;
        const hasDeptEditing = (visit.departments || []).some((d)=>d.status === "DEPARTMENT_EDITING");
        if (hasDeptEditing) return false;
        if (hasNoBillables(visit)) return false;
        return countUnbilledProducts(visit) === 0 && (countBilledProducts(visit) > 0 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visit$2d$product$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["visitProductsFullySettled"])(visit));
    };
    const getBillingDisplayStatus = (visit)=>{
        const hasDeptEditing = (visit.departments || []).some((d)=>d.status === "DEPARTMENT_EDITING");
        // If user does not have Finance, Admin, or Manager role, show clean status without billable item details/counts
        if (!canSeeBillables) {
            if (hasDeptEditing) return "In billing (Editing)";
            if (hasDepartmentReadyForBilling(visit)) return "In billing";
            const unbilledCount = countUnbilledProducts(visit);
            const billedCount = countBilledProducts(visit);
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visit$2d$product$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["visitProductsFullySettled"])(visit) || unbilledCount === 0 && billedCount > 0) {
                return "Billed";
            }
            if (hasNoBillables(visit) || unbilledCount === 0 && billedCount === 0) {
                return "No billing required";
            }
            return "In billing";
        }
        if (hasDeptEditing) return "Editing billing";
        if (hasDepartmentReadyForBilling(visit)) return "Ready for billing";
        const unbilledCount = countUnbilledProducts(visit);
        const billedCount = countBilledProducts(visit);
        const pendingConfirmations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visit$2d$product$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["countPendingOperatorConfirmations"])(visit);
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visit$2d$product$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["visitProductsFullySettled"])(visit) || unbilledCount === 0 && billedCount > 0) {
            if (pendingConfirmations > 0) {
                return `All products billed (${pendingConfirmations} pending confirmation)`;
            }
            return "All products billed";
        }
        if (hasNoBillables(visit)) return formatProductsToBillLabel(0);
        if (unbilledCount > 0 && billedCount > 0) {
            const base = `${formatProductsToBillLabel(unbilledCount)} · ${billedCount} billed`;
            return pendingConfirmations > 0 ? `${base} (${pendingConfirmations} pending)` : base;
        }
        const base = formatProductsToBillLabel(unbilledCount);
        return pendingConfirmations > 0 ? `${base} (${pendingConfirmations} pending)` : base;
    };
    const renderBillingTooltipContent = (visit, unbilledCount, unbilledNames, billedCount, billedNames, departmentsReady)=>{
        if (!canSeeBillables) {
            const hasDeptEditing = (visit.departments || []).some((d)=>d.status === "DEPARTMENT_EDITING");
            const isReady = departmentsReady.length > 0 || hasDepartmentReadyForBilling(visit);
            const isBilled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visit$2d$product$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["visitProductsFullySettled"])(visit) || unbilledCount === 0 && billedCount > 0;
            const isPending = unbilledCount > 0 || isReady || hasDeptEditing;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-1.5 text-xs py-0.5",
                children: isPending ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "font-semibold text-blue-600 dark:text-blue-400",
                            children: "Patient is in billing"
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard-page.tsx",
                            lineNumber: 900,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-muted-foreground text-[12px] mt-0.5",
                            children: hasDeptEditing ? "Finance is currently editing invoice." : isReady ? "Orders sent to billing." : "Pending billing processing."
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard-page.tsx",
                            lineNumber: 903,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/dashboard-page.tsx",
                    lineNumber: 899,
                    columnNumber: 13
                }, this) : isBilled ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "font-semibold text-emerald-600 dark:text-emerald-400",
                            children: "Billing completed"
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard-page.tsx",
                            lineNumber: 913,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-muted-foreground text-[12px] mt-0.5",
                            children: "All services have been billed."
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard-page.tsx",
                            lineNumber: 916,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/dashboard-page.tsx",
                    lineNumber: 912,
                    columnNumber: 13
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-muted-foreground",
                    children: "No active billing required."
                }, void 0, false, {
                    fileName: "[project]/components/dashboard-page.tsx",
                    lineNumber: 921,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/dashboard-page.tsx",
                lineNumber: 897,
                columnNumber: 9
            }, this);
        }
        const showAllBilledSummary = unbilledCount === 0 && billedCount > 0 && departmentsReady.length === 0;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-2 text-xs",
            children: [
                departmentsReady.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "font-medium text-emerald-600 dark:text-emerald-400",
                            children: "Ready for billing"
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard-page.tsx",
                            lineNumber: 933,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "list-disc pl-4 text-muted-foreground mt-0.5",
                            children: departmentsReady.map((name)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: name
                                }, name, false, {
                                    fileName: "[project]/components/dashboard-page.tsx",
                                    lineNumber: 938,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard-page.tsx",
                            lineNumber: 936,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/dashboard-page.tsx",
                    lineNumber: 932,
                    columnNumber: 11
                }, this),
                unbilledCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "font-medium",
                            children: formatProductsToBillLabel(unbilledCount)
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard-page.tsx",
                            lineNumber: 946,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "list-disc pl-4 text-muted-foreground mt-0.5",
                            children: unbilledNames.map((name, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: name
                                }, `unbilled-${name}-${index}`, false, {
                                    fileName: "[project]/components/dashboard-page.tsx",
                                    lineNumber: 951,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard-page.tsx",
                            lineNumber: 949,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/dashboard-page.tsx",
                    lineNumber: 945,
                    columnNumber: 11
                }, this),
                billedCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "font-medium text-muted-foreground",
                            children: showAllBilledSummary ? "All products billed" : formatProductsBilledLabel(billedCount)
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard-page.tsx",
                            lineNumber: 959,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "list-disc pl-4 text-muted-foreground mt-0.5",
                            children: billedNames.map((name, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: name
                                }, `billed-${name}-${index}`, false, {
                                    fileName: "[project]/components/dashboard-page.tsx",
                                    lineNumber: 966,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard-page.tsx",
                            lineNumber: 964,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/dashboard-page.tsx",
                    lineNumber: 958,
                    columnNumber: 11
                }, this),
                unbilledCount === 0 && billedCount === 0 && !hasNoBillables(visit) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-muted-foreground",
                    children: "No billable products"
                }, void 0, false, {
                    fileName: "[project]/components/dashboard-page.tsx",
                    lineNumber: 973,
                    columnNumber: 11
                }, this),
                hasNoBillables(visit) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-muted-foreground",
                    children: formatProductsToBillLabel(0)
                }, void 0, false, {
                    fileName: "[project]/components/dashboard-page.tsx",
                    lineNumber: 977,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/dashboard-page.tsx",
            lineNumber: 930,
            columnNumber: 7
        }, this);
    };
    const renderDepartmentProductsHover = (dept)=>{
        if (!canSeeProducts || !dept) return null;
        const deptProducts = dept.products || [];
        const childProducts = (dept.childVisitDepartments || []).flatMap((c)=>c.products || []);
        const allProducts = [
            ...deptProducts,
            ...childProducts
        ];
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-2 text-xs max-w-xs min-w-[210px]",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between gap-2 border-b border-border/60 pb-1.5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "font-semibold text-foreground text-xs truncate",
                            children: [
                                dept.department?.name || "Department",
                                " Products"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/dashboard-page.tsx",
                            lineNumber: 994,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-[11px] text-muted-foreground font-mono bg-muted/60 px-1.5 py-0.5 rounded border border-border/40",
                            children: [
                                allProducts.length,
                                " ",
                                allProducts.length === 1 ? "item" : "items"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/dashboard-page.tsx",
                            lineNumber: 997,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/dashboard-page.tsx",
                    lineNumber: 993,
                    columnNumber: 9
                }, this),
                allProducts.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-muted-foreground text-[12px] italic py-0.5",
                    children: "No products added"
                }, void 0, false, {
                    fileName: "[project]/components/dashboard-page.tsx",
                    lineNumber: 1002,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-h-48 overflow-y-auto space-y-1.5 pr-0.5",
                    children: allProducts.map((p, idx)=>{
                        const statusStr = String(p.status || "PENDING").toUpperCase();
                        const isBilled = statusStr === "BILLED" || statusStr === "EXEMPTED" || statusStr === "PATIENT_SHARE_EXEMPTED";
                        const isUnpaid = statusStr === "UNPAID" || statusStr === "PENDING";
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between gap-2 text-[12px] py-1 px-1.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-foreground font-medium truncate flex-1",
                                    title: p.product?.name,
                                    children: p.product?.name || p.product?.code || "Product"
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard-page.tsx",
                                    lineNumber: 1017,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-1.5 flex-shrink-0",
                                    children: [
                                        p.quantity && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-muted-foreground font-mono text-[11px]",
                                            children: [
                                                "x",
                                                p.quantity
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/dashboard-page.tsx",
                                            lineNumber: 1025,
                                            columnNumber: 23
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `text-[10px] px-1.5 py-0.5 rounded font-semibold ${isBilled ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20" : isUnpaid ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/20" : "bg-muted text-muted-foreground border border-border/50"}`,
                                            children: statusStr
                                        }, void 0, false, {
                                            fileName: "[project]/components/dashboard-page.tsx",
                                            lineNumber: 1029,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/dashboard-page.tsx",
                                    lineNumber: 1023,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, p.id || idx, true, {
                            fileName: "[project]/components/dashboard-page.tsx",
                            lineNumber: 1013,
                            columnNumber: 17
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/components/dashboard-page.tsx",
                    lineNumber: 1004,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/dashboard-page.tsx",
            lineNumber: 992,
            columnNumber: 7
        }, this);
    };
    const renderPatientDemographicsHover = (visit)=>{
        const patient = visit.patient;
        if (!patient) return null;
        const fullName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$patient$2d$display$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPatientDisplayName"])(patient);
        const age = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$patient$2d$display$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPatientAge"])(patient);
        const formattedDob = patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : null;
        const genderLabel = patient.gender ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$patient$2d$display$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatPatientGender"])(patient.gender) : null;
        const phone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$patient$2d$display$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPatientPhone"])(patient);
        const linkedInsurances = visit.linkedInsurances || [];
        const locationParts = [
            patient.district,
            patient.cell,
            patient.village
        ].filter(Boolean);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-2.5 text-xs max-w-sm min-w-[250px] p-0.5",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "border-b border-border/60 pb-2",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "font-bold text-sm text-foreground truncate",
                                children: fullName
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard-page.tsx",
                                lineNumber: 1067,
                                columnNumber: 13
                            }, this),
                            patient.patientIdentifier && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-mono text-[11px] bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-md border border-primary/20 shrink-0",
                                children: patient.patientIdentifier
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard-page.tsx",
                                lineNumber: 1071,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/dashboard-page.tsx",
                        lineNumber: 1066,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/dashboard-page.tsx",
                    lineNumber: 1065,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-1.5 bg-muted/30 rounded-xl p-2.5 border border-border/40",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[11px] uppercase font-bold text-muted-foreground tracking-wider mb-1",
                            children: "Demographics"
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard-page.tsx",
                            lineNumber: 1080,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 gap-x-3 gap-y-1.5 text-[12px]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-muted-foreground",
                                            children: "Age / DOB:"
                                        }, void 0, false, {
                                            fileName: "[project]/components/dashboard-page.tsx",
                                            lineNumber: 1085,
                                            columnNumber: 15
                                        }, this),
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-medium text-foreground",
                                            children: [
                                                age !== null ? `${age} yrs` : "—",
                                                " ",
                                                formattedDob ? `(${formattedDob})` : ""
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/dashboard-page.tsx",
                                            lineNumber: 1086,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/dashboard-page.tsx",
                                    lineNumber: 1084,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-muted-foreground",
                                            children: "Gender:"
                                        }, void 0, false, {
                                            fileName: "[project]/components/dashboard-page.tsx",
                                            lineNumber: 1091,
                                            columnNumber: 15
                                        }, this),
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-medium text-foreground",
                                            children: genderLabel || "—"
                                        }, void 0, false, {
                                            fileName: "[project]/components/dashboard-page.tsx",
                                            lineNumber: 1092,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/dashboard-page.tsx",
                                    lineNumber: 1090,
                                    columnNumber: 13
                                }, this),
                                phone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "col-span-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-muted-foreground",
                                            children: "Phone:"
                                        }, void 0, false, {
                                            fileName: "[project]/components/dashboard-page.tsx",
                                            lineNumber: 1098,
                                            columnNumber: 17
                                        }, this),
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-mono font-medium text-foreground",
                                            children: phone
                                        }, void 0, false, {
                                            fileName: "[project]/components/dashboard-page.tsx",
                                            lineNumber: 1099,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/dashboard-page.tsx",
                                    lineNumber: 1097,
                                    columnNumber: 15
                                }, this),
                                patient.nationalIdNumber && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "col-span-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-muted-foreground",
                                            children: "National ID:"
                                        }, void 0, false, {
                                            fileName: "[project]/components/dashboard-page.tsx",
                                            lineNumber: 1106,
                                            columnNumber: 17
                                        }, this),
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-mono font-medium text-foreground",
                                            children: patient.nationalIdNumber
                                        }, void 0, false, {
                                            fileName: "[project]/components/dashboard-page.tsx",
                                            lineNumber: 1107,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/dashboard-page.tsx",
                                    lineNumber: 1105,
                                    columnNumber: 15
                                }, this),
                                locationParts.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "col-span-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-muted-foreground",
                                            children: "Location:"
                                        }, void 0, false, {
                                            fileName: "[project]/components/dashboard-page.tsx",
                                            lineNumber: 1114,
                                            columnNumber: 17
                                        }, this),
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-medium text-foreground",
                                            children: locationParts.join(", ")
                                        }, void 0, false, {
                                            fileName: "[project]/components/dashboard-page.tsx",
                                            lineNumber: 1115,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/dashboard-page.tsx",
                                    lineNumber: 1113,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/dashboard-page.tsx",
                            lineNumber: 1083,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/dashboard-page.tsx",
                    lineNumber: 1079,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-1.5 bg-muted/30 rounded-xl p-2.5 border border-border/40",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between gap-1 mb-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-1.5 text-[11px] uppercase font-bold text-muted-foreground tracking-wider",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                            className: "w-3.5 h-3.5 text-primary"
                                        }, void 0, false, {
                                            fileName: "[project]/components/dashboard-page.tsx",
                                            lineNumber: 1127,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Applied Insurance"
                                        }, void 0, false, {
                                            fileName: "[project]/components/dashboard-page.tsx",
                                            lineNumber: 1128,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/dashboard-page.tsx",
                                    lineNumber: 1126,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[11px] font-medium text-muted-foreground",
                                    children: linkedInsurances.length > 0 ? `${linkedInsurances.length} linked` : "Self-pay"
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard-page.tsx",
                                    lineNumber: 1130,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/dashboard-page.tsx",
                            lineNumber: 1125,
                            columnNumber: 11
                        }, this),
                        linkedInsurances.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-1.5 pt-0.5",
                            children: linkedInsurances.map((ins, idx)=>{
                                const providerName = ins.insuranceProvider?.insuranceName || "Insurance Provider";
                                const acronym = ins.insuranceProvider?.acronym;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-2 rounded-lg bg-card/80 border border-border/60 shadow-2xs space-y-1 text-[12px]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-bold text-foreground",
                                                    children: [
                                                        providerName,
                                                        " ",
                                                        acronym ? `(${acronym})` : ""
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                    lineNumber: 1146,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20",
                                                    children: ins.principalMember ? "Principal" : "Beneficiary"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                    lineNumber: 1149,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/dashboard-page.tsx",
                                            lineNumber: 1145,
                                            columnNumber: 21
                                        }, this),
                                        ins.insuranceCardNumber && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[11px] text-muted-foreground",
                                            children: [
                                                "Card No: ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono font-medium text-foreground",
                                                    children: ins.insuranceCardNumber
                                                }, void 0, false, {
                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                    lineNumber: 1155,
                                                    columnNumber: 34
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/dashboard-page.tsx",
                                            lineNumber: 1154,
                                            columnNumber: 23
                                        }, this),
                                        ins.providingCompanyOrEmployer && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[11px] text-muted-foreground",
                                            children: [
                                                "Employer: ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-medium text-foreground",
                                                    children: ins.providingCompanyOrEmployer
                                                }, void 0, false, {
                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                    lineNumber: 1160,
                                                    columnNumber: 35
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/dashboard-page.tsx",
                                            lineNumber: 1159,
                                            columnNumber: 23
                                        }, this)
                                    ]
                                }, ins.id || idx, true, {
                                    fileName: "[project]/components/dashboard-page.tsx",
                                    lineNumber: 1141,
                                    columnNumber: 19
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard-page.tsx",
                            lineNumber: 1136,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-2 rounded-lg bg-card/60 border border-border/40 text-[12px] text-muted-foreground space-y-0.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-semibold text-foreground",
                                    children: "Private / Self-paying"
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard-page.tsx",
                                    lineNumber: 1169,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[11px]",
                                    children: "No insurance applied to this visit (Patient settles directly)."
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard-page.tsx",
                                    lineNumber: 1172,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/dashboard-page.tsx",
                            lineNumber: 1168,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/dashboard-page.tsx",
                    lineNumber: 1124,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/dashboard-page.tsx",
            lineNumber: 1063,
            columnNumber: 7
        }, this);
    };
    const hasIncompleteDepartments = (visit)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visit$2d$product$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["flattenVisitDepartments"])(visit.departments || []).some((dept)=>dept.status !== "COMPLETED");
    };
    const canDischargeVisit = (visit)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visit$2d$product$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canDischargeVisit"])(visit);
    };
    const isDischarged = (visit)=>(visit.status === "COMPLETED" || visit.status === "FINALISED") && !hasUnbilledItems(visit);
    const canFinaliseVisit = (visit)=>{
        return getFinaliseBlockers(visit).length === 0;
    };
    /** Returns a list of human-readable reasons why a visit cannot be finalised. */ const getFinaliseBlockers = (visit)=>{
        const blockers = [];
        if (visit.status !== "COMPLETED") return [
            "Visit is not completed yet"
        ];
        if (!visit.departments || visit.departments.length === 0) {
            blockers.push("No departments assigned");
            return blockers;
        }
        const nonCancelledDepts = (visit.departments || []).filter((d)=>d.status !== "CANCELLED");
        if (nonCancelledDepts.length === 0) {
            blockers.push("No active departments");
            return blockers;
        }
        const hasAnyAnswer = nonCancelledDepts.some((d)=>Boolean(d.answerId || d.hasFinalizedConsultationAnswers));
        if (!hasAnyAnswer) {
            blockers.push("Visit has no recorded consultation answers yet");
        }
        // Check each department
        for (const dept of nonCancelledDepts){
            if (dept.status !== "COMPLETED") {
                blockers.push(`${dept.department.name} is not completed (${dept.status})`);
            }
            if (dept.hasBillableProducts) {
                blockers.push(`${dept.department.name} has unbilled products`);
            }
            if (dept.answerId && !dept.hasFinalizedConsultationAnswers) {
                blockers.push(`${dept.department.name} has draft consultation answers`);
            }
        }
        return blockers;
    };
    const handleFinaliseVisit = async (visit)=>{
        await finaliseVisitMutation({
            variables: {
                visitId: visit.id
            }
        });
    };
    const isVisitDepartmentBillingOrCompleted = (visit, departmentStatus)=>{
        const normalizedDepartmentStatus = String(departmentStatus || "").toUpperCase();
        return normalizedDepartmentStatus === "FINALISED";
    };
    const getMatchingUserDepartment = (visit, options)=>{
        const mustBeClosed = Boolean(options?.mustBeClosed);
        const matchingDepartments = (visit.departments || []).filter((dept)=>userDepartmentIds.includes(String(dept.department?.id || dept.id || "")));
        if (matchingDepartments.length === 0) return null;
        if (mustBeClosed) {
            return matchingDepartments.find((dept)=>isVisitDepartmentBillingOrCompleted(visit, dept.status)) || null;
        }
        return matchingDepartments.find((dept)=>{
            const normalizedDepartmentStatus = String(dept.status || "").toUpperCase();
            if (normalizedDepartmentStatus === "FINALISED" || normalizedDepartmentStatus === "CANCELLED") {
                return false;
            }
            return true;
        }) || null;
    };
    const canConsultVisit = (visit)=>{
        // Check if user has CLINICIAN or DOCTOR role
        if (!hasClinicianOrDoctorRole) return false;
        // Check if user has at least one department assigned
        if (userDepartmentIds.length === 0) return false;
        // Check if visit has departments
        if (!visit.departments || visit.departments.length === 0) return false;
        // Eligible when any visit department matches a user's department and is not completed/cancelled.
        const matchingDepartment = getMatchingUserDepartment(visit, {
            mustBeClosed: false
        });
        const match = Boolean(matchingDepartment);
        return match;
    };
    const handlePreviewConsultation = (visit)=>{
        const previewStartedAt = Date.now();
        const matchedClosedDepartment = (visit.departments || []).find((dept)=>{
            const normalizedStatus = String(dept.status || "").toUpperCase();
            return Boolean(dept.answerId) && (normalizedStatus === "COMPLETED" || normalizedStatus === "BILLING");
        }) || getMatchingUserDepartment(visit, {
            mustBeClosed: true
        });
        const answerId = matchedClosedDepartment?.answerId ? String(matchedClosedDepartment.answerId) : null;
        const departmentName = matchedClosedDepartment?.department?.name || "Department";
        setPreviewConsultationContext({
            answerId,
            departmentName,
            patientName: `${visit.patient.firstName} ${visit.patient.lastName}`.trim(),
            visitId: String(visit.id),
            visitDepartmentId: matchedClosedDepartment?.id ? String(matchedClosedDepartment.id) : null,
            visitDepartment: matchedClosedDepartment || null,
            previewStartedAt
        });
        setPreviewConsultationOpen(true);
    };
    const parseTimestamp = (time)=>{
        if (!time) return null;
        if (typeof time === "number") {
            return isNaN(time) ? null : time;
        }
        const str = String(time).trim();
        if (!str) return null;
        if (/^\d+$/.test(str)) {
            const num = Number(str);
            return isNaN(num) ? null : num;
        }
        const parsed = new Date(str).getTime();
        return isNaN(parsed) ? null : parsed;
    };
    const formatDepartmentTime = (time, fallbackTime)=>{
        const ts = parseTimestamp(time) || parseTimestamp(fallbackTime);
        if (!ts) return "-";
        return new Date(ts).toLocaleString();
    };
    const getTriageDuration = (visit)=>{
        const startedAt = parseTimestamp(visit.visitDate);
        if (!startedAt) return "Triage";
        const elapsedMs = Math.max(Date.now() - startedAt, 0);
        const totalMinutes = Math.floor(elapsedMs / 60000);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        if (hours <= 0) {
            return `Triage • ${minutes}m`;
        }
        return `Triage • ${hours}h ${minutes}m`;
    };
    const formatDepartmentDuration = (startTime, endTime, fallbackStartTime)=>{
        const start = parseTimestamp(startTime) || parseTimestamp(fallbackStartTime);
        if (!start) return "-";
        const end = parseTimestamp(endTime) || Date.now();
        const diffMs = Math.max(end - start, 0);
        const totalMinutes = Math.floor(diffMs / 60000);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        if (hours <= 0) {
            return `${minutes}m`;
        }
        return `${hours}h ${minutes}m`;
    };
    const getVisitActiveDepartmentInfo = (visit)=>{
        const allDepts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visit$2d$product$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["flattenVisitDepartments"])(visit.departments || []);
        if (allDepts.length === 0) {
            return {
                activeDept: null,
                displayName: "Triage / Check-in",
                status: "IN_PROGRESS",
                isTriage: true,
                duration: formatDepartmentDuration(visit.visitDate),
                allDepts: []
            };
        }
        // 1. First look for active / in-progress / editing / billing / on-hold department
        const activeDept = allDepts.find((dept)=>{
            const s = String(dept.status || "").toUpperCase();
            return s === "ACTIVE" || s === "IN_PROGRESS" || s === "DEPARTMENT_EDITING" || s === "BILLING" || s === "ON_HOLD";
        });
        if (activeDept) {
            return {
                activeDept,
                displayName: activeDept.department?.name || "Active Department",
                status: activeDept.status || "ACTIVE",
                isTriage: false,
                duration: formatDepartmentDuration(activeDept.createdAt, null, visit.visitDate),
                allDepts
            };
        }
        // 2. Look for first pending department
        const pendingDept = allDepts.find((dept)=>{
            const s = String(dept.status || "").toUpperCase();
            return s === "PENDING";
        });
        if (pendingDept) {
            return {
                activeDept: pendingDept,
                displayName: pendingDept.department?.name || "Pending Department",
                status: "PENDING",
                isTriage: false,
                duration: null,
                allDepts
            };
        }
        // 3. If all completed / finalised / cancelled
        const lastDept = allDepts[allDepts.length - 1];
        const allCompleted = allDepts.every((dept)=>{
            const s = String(dept.status || "").toUpperCase();
            return s === "COMPLETED" || s === "FINALISED";
        });
        return {
            activeDept: lastDept,
            displayName: lastDept?.department?.name || "Completed",
            status: allCompleted ? "COMPLETED" : lastDept?.status || "COMPLETED",
            isTriage: false,
            duration: lastDept ? formatDepartmentDuration(lastDept.createdAt, lastDept.completedAt, visit.visitDate) : null,
            allDepts
        };
    };
    const combinedVisitsList = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const serverVisitIds = new Set();
        const baseList = [];
        const sources = [
            ...visits,
            ...locallyCreatedVisits,
            ...extraCompletedVisits,
            ...backendHistoricalVisits
        ];
        for (const visit of sources){
            if (visit && visit.id && !serverVisitIds.has(visit.id)) {
                serverVisitIds.add(visit.id);
                baseList.push(visit);
            }
        }
        return baseList;
    }, [
        visits,
        locallyCreatedVisits,
        extraCompletedVisits,
        backendHistoricalVisits
    ]);
    const applyGeneralFilters = (list)=>{
        let result = list;
        // 1. Search Query
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            result = result.filter((visit)=>{
                const name = `${visit.patient?.firstName || ""} ${visit.patient?.lastName || ""}`.toLowerCase();
                const idStr = String(visit.patient?.patientIdentifier || "").toLowerCase();
                return name.includes(q) || idStr.includes(q);
            });
        }
        // 2. Consultation Answers Filter
        if (canQueryAnswerState && answersFilter !== "all") {
            if (answersFilter === "finalised") {
                result = result.filter((visit)=>getVisitAnswerState(visit).isFinalised);
            } else if (answersFilter === "pending") {
                result = result.filter((visit)=>getVisitAnswerState(visit).isPending);
            }
        }
        // 3. Gender Filter
        if (genderFilter !== "all") {
            result = result.filter((visit)=>{
                const g = String(visit.patient?.gender || "").toUpperCase();
                if (genderFilter === "OTHER") {
                    return g !== "MALE" && g !== "FEMALE";
                }
                return g === genderFilter;
            });
        }
        // 4. Age & Date of Birth Filter
        if (dobFilter.trim()) {
            const q = dobFilter.trim().toLowerCase();
            result = result.filter((visit)=>{
                const patientDob = String(visit.patient?.dateOfBirth || "").trim().toLowerCase();
                if (!patientDob) return false;
                if (patientDob.includes(q)) return true;
                const parsed = new Date(patientDob);
                if (!isNaN(parsed.getTime()) && parsed.getFullYear().toString() === q) {
                    return true;
                }
                return false;
            });
        } else if (ageRange !== "all") {
            result = result.filter((visit)=>{
                const patientAge = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$patient$2d$display$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPatientAge"])(visit.patient) ?? (typeof visit.patient?.age === "number" ? visit.patient.age : null);
                if (patientAge === null || patientAge === undefined) return false;
                if (ageRange === "pediatric") {
                    return patientAge >= 0 && patientAge <= 17;
                }
                if (ageRange === "adult") {
                    return patientAge >= 18 && patientAge <= 64;
                }
                if (ageRange === "senior") {
                    return patientAge >= 65;
                }
                if (ageRange === "custom") {
                    const min = customAgeMin.trim() !== "" ? Number(customAgeMin) : null;
                    const max = customAgeMax.trim() !== "" ? Number(customAgeMax) : null;
                    if (min !== null && !isNaN(min) && patientAge < min) return false;
                    if (max !== null && !isNaN(max) && patientAge > max) return false;
                    return true;
                }
                return true;
            });
        }
        return result;
    };
    const filterCounts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const searchedList = applyGeneralFilters(combinedVisitsList);
        const counts = {
            all: searchedList.filter((visit)=>visit.status !== "CANCELLED").length,
            IN_PROGRESS: isSingleRoleClinician ? searchedList.filter(isClinicianInProgress).length : isSingleRoleFinance ? searchedList.filter(isFinanceInProgress).length : isSingleRoleNurse ? searchedList.filter(isNurseInProgress).length : searchedList.filter(isVisitInProgress).length,
            COMPLETED: searchedList.filter(isVisitCompleted).length,
            NEW: isSingleRoleClinician ? searchedList.filter(isClinicianNew).length : isSingleRoleFinance ? searchedList.filter(isFinanceNew).length : isSingleRoleNurse ? searchedList.filter(isNurseNew).length : 0,
            BILLING: searchedList.filter(isVisitBilling).length,
            CONSULTATION: searchedList.filter(isVisitConsultation).length
        };
        return counts;
    }, [
        combinedVisitsList,
        searchQuery,
        answersFilter,
        genderFilter,
        ageRange,
        customAgeMin,
        customAgeMax,
        dobFilter,
        canQueryAnswerState,
        isSingleRoleClinician,
        isSingleRoleFinance,
        isSingleRoleNurse,
        userDepartmentIds,
        doctor?.id
    ]);
    const allVisits = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const filtered = applyGeneralFilters(combinedVisitsList);
        if (isSingleRoleClinician) {
            if (statusFilter === "NEW") {
                return filtered.filter(isClinicianNew);
            } else if (statusFilter === "IN_PROGRESS") {
                return filtered.filter(isClinicianInProgress);
            } else if (statusFilter === "COMPLETED") {
                return filtered.filter(isVisitCompleted);
            }
        } else if (isSingleRoleFinance) {
            if (statusFilter === "NEW") {
                return filtered.filter(isFinanceNew);
            } else if (statusFilter === "IN_PROGRESS") {
                return filtered.filter(isFinanceInProgress);
            } else if (statusFilter === "COMPLETED") {
                return filtered.filter(isVisitCompleted);
            }
        } else if (isSingleRoleNurse) {
            if (statusFilter === "NEW") {
                return filtered.filter(isNurseNew);
            } else if (statusFilter === "IN_PROGRESS") {
                return filtered.filter(isNurseInProgress);
            } else if (statusFilter === "COMPLETED") {
                return filtered.filter(isVisitCompleted);
            }
        } else {
            if (statusFilter === "BILLING") {
                return filtered.filter(isVisitBilling);
            } else if (statusFilter === "CONSULTATION") {
                return filtered.filter(isVisitConsultation);
            } else if (statusFilter === "IN_PROGRESS") {
                return filtered.filter(isVisitInProgress);
            } else if (statusFilter === "COMPLETED") {
                return filtered.filter(isVisitCompleted);
            } else if (statusFilter !== "all") {
                return filtered.filter((visit)=>visit.status === statusFilter);
            }
        }
        return filtered.filter((visit)=>visit.status !== "CANCELLED");
    }, [
        combinedVisitsList,
        searchQuery,
        answersFilter,
        genderFilter,
        ageRange,
        customAgeMin,
        customAgeMax,
        dobFilter,
        statusFilter,
        canQueryAnswerState,
        isSingleRoleClinician,
        isSingleRoleFinance,
        isSingleRoleNurse,
        userDepartmentIds,
        doctor?.id
    ]);
    const handleConsultVisit = async (visit)=>{
        // Check if the matching department has profiles
        const matchingDept = visit.departments?.find((d)=>{
            const deptId = String(d?.department?.id || d?.id || "");
            const isDepartmentOpen = d?.status !== "FINALISED" && d?.status !== "CANCELLED";
            return deptId && userDepartmentIds.includes(deptId) && isDepartmentOpen;
        }) || visit.departments?.find((d)=>{
            const deptId = String(d?.department?.id || d?.id || "");
            return deptId && userDepartmentIds.includes(deptId);
        });
        const profiles = matchingDept?.department?.profiles || [];
        // Only show profile selection when the department has profiles available
        // AND the department does not already have a profile assigned or an answer.
        // If a profile is already set, skip straight to consultation.
        const alreadyHasProfile = Boolean(matchingDept?.profile?.id || matchingDept?.answerId || matchingDept?.status === "COMPLETED");
        if (profiles.length > 0 && !alreadyHasProfile) {
            // Show profile selection dialog
            setNavigatingVisitId(null);
            setProfileDialogVisit(visit);
            setProfileDialogProfiles(profiles);
            setProfileDialogOpen(true);
        } else {
            // Direct consultation or continue: call consultVisit mutation to mark ACTIVE & add processor
            if (matchingDept?.id) {
                try {
                    const res = await consultVisit(matchingDept.id);
                    if (res?.status !== "SUCCESS") {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(res?.message || "Failed to start consultation");
                        setNavigatingVisitId(null);
                        return;
                    }
                } catch (err) {
                    console.error("Failed to start consultation:", err);
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(err?.message || "Failed to start consultation");
                    setNavigatingVisitId(null);
                    return;
                }
            }
            router.push(`/consultation?visitId=${visit.id}${matchingDept?.id ? `&visitDepartmentId=${matchingDept.id}` : ""}`);
        }
    };
    const handleProfileSelected = async (profile)=>{
        const visit = profileDialogVisit;
        if (!visit) return;
        setProfileDialogLoading(true);
        let matchingDeptId;
        try {
            const matchingDept = visit.departments?.find((d)=>{
                const deptId = String(d?.department?.id || d?.id || "");
                const isDepartmentOpen = d?.status !== "FINALISED" && d?.status !== "CANCELLED";
                return deptId && userDepartmentIds.includes(deptId) && isDepartmentOpen;
            });
            matchingDeptId = matchingDept?.id;
            if (matchingDept) {
                // Single unified consultVisit mutation: applies profile, sets ACTIVE on 1st time, adds processor
                const res = await consultVisit(matchingDept.id, profile.id);
                if (res?.status !== "SUCCESS") {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(res?.message || "Failed to start consultation");
                    setProfileDialogLoading(false);
                    return;
                }
            }
            refetchVisits();
        } catch (err) {
            console.error("Failed to apply profile and start consultation:", err);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(err?.message || "Failed to apply profile and start consultation");
            setProfileDialogLoading(false);
            return;
        }
        setProfileDialogLoading(false);
        setProfileDialogOpen(false);
        setProfileDialogVisit(null);
        setProfileDialogProfiles([]);
        router.push(`/consultation?visitId=${visit.id}${matchingDeptId ? `&visitDepartmentId=${matchingDeptId}` : ""}`);
    };
    const handleTriageVisit = (visit)=>{
        router.push(`/triage?visitId=${visit.id}`);
    };
    const canAddDepartment = (visit)=>{
        return visit.status !== "COMPLETED" && visit.status !== "CANCELLED";
    };
    const handleAddDepartment = (visit)=>{
        setSelectedVisitForDepartment(visit);
        setAddDepartmentModalOpen(true);
    };
    const handleAddDepartmentSuccess = ()=>{
        // Refresh visits data after successful department addition
        const visitId = selectedVisitForDepartment?.id;
        if (visitId) {
            setLocallyCreatedVisits((current)=>current.filter((v)=>v.id !== visitId));
        }
        void refetchVisits();
    };
    const handleGoToBilling = (visit)=>{
        router.push(`/billing?visitId=${visit.id}&patientId=${visit.patient.id}`);
    };
    const handleDownloadInvoice = async (departmentInsuranceBillingId, copyType)=>{
        setDownloadingInvoiceId(departmentInsuranceBillingId);
        try {
            const invoiceUrl = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoice$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolveInvoiceUrl"])(departmentInsuranceBillingId, generateInvoice, copyType);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoice$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["openInvoicePreview"])(invoiceUrl);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to generate invoice";
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(message);
        } finally{
            setDownloadingInvoiceId(null);
        }
    };
    const handlePreviewInvoice = async (visit)=>{
        try {
            setPrintingVisitId(visit.id);
            const billRes = await getVisitBillings({
                variables: {
                    visitId: visit.id
                }
            });
            const gqlVisitBilling = billRes.data?.visitBilling?.data;
            if (!gqlVisitBilling) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error("No bill found for this visit.");
                return;
            }
            setPreviewVisitBilling((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visit$2d$billing$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapGqlVisitBilling"])(gqlVisitBilling));
            setPreviewVisit(visit);
            setPreviewStartedAt(Date.now());
            setPreviewOpen(true);
        } catch (err) {
            console.error("Preview invoice error:", err);
            const message = err instanceof Error ? err.message : "Failed to load bill for preview";
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(message);
        } finally{
            setPrintingVisitId(null);
        }
    };
    const handleEditConsultation = (visit)=>{
        const matchingDept = (visit.departments || []).find((d)=>{
            const deptId = String(d?.department?.id || d?.id || "");
            return deptId && userDepartmentIds.includes(deptId);
        }) || visit.departments?.[0];
        router.push(`/consultation?visitId=${visit.id}${matchingDept?.id ? `&visitDepartmentId=${matchingDept.id}` : ""}`);
    };
    const handleOpenSettings = (visit)=>{
        setSettingsVisit(visit);
        setSettingsPanelOpen(true);
    };
    const handleManagerPreviewConsultation = (visit)=>{
        // Find any completed department with an answerId for preview
        const completedDept = (visit.departments || []).find((dept)=>{
            const normalizedStatus = String(dept.status || "").toUpperCase();
            return Boolean(dept.answerId) && (normalizedStatus === "COMPLETED" || normalizedStatus === "FINALISED");
        });
        const answerId = completedDept?.answerId ? String(completedDept.answerId) : null;
        const departmentName = completedDept?.department?.name || "Department";
        setPreviewConsultationContext({
            answerId,
            departmentName,
            patientName: `${visit.patient.firstName} ${visit.patient.lastName}`.trim(),
            visitId: String(visit.id),
            visitDepartmentId: completedDept?.id ? String(completedDept.id) : null,
            visitDepartment: completedDept || null,
            previewStartedAt: Date.now()
        });
        setPreviewConsultationOpen(true);
    };
    const handleViewPatientHistory = (visit)=>{
        setPatientHistoryVisit(visit);
        setPatientHistoryOpen(true);
    };
    const [dischargeConfirmVisit, setDischargeConfirmVisit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // In-flight discharge — keeps the confirm dialog open with a spinner so the
    // department-status completion loop can't be triggered twice.
    const [discharging, setDischarging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleDischargeVisit = async (visit)=>{
        if (discharging) return;
        setDischarging(true);
        try {
            const res = await completeVisit(visit.id);
            if (res?.status === "SUCCESS") {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success("Patient discharged successfully");
                await refetchVisits();
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(res?.message || "Failed to discharge patient");
            }
        } catch (err) {
            console.error("Discharge visit error:", err);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(err?.message || "Failed to discharge patient");
        } finally{
            setDischarging(false);
            setDischargeConfirmVisit(null);
        }
    };
    const handlePatientRegistered = (patientId, _insurances, proceedToVisit, createdVisit)=>{
        setShowPatientRegistrationModal(false);
        if (createdVisit) {
            setRegisteredPatientId(null);
            setShowVisitCreationModal(false);
            setLocallyCreatedVisits((current)=>[
                    createdVisit,
                    ...current.filter((visit)=>visit.id !== createdVisit.id)
                ]);
            refetchVisits();
            return;
        }
        if (proceedToVisit) {
            setRegisteredPatientId(patientId);
            setShowVisitCreationModal(true);
        }
    };
    const handleVisitCreated = ()=>{
        // Refetch visits data without full page reload
        refetchVisits();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-screen bg-background overflow-hidden flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$floating$2d$header$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                doctor: doctor
            }, void 0, false, {
                fileName: "[project]/components/dashboard-page.tsx",
                lineNumber: 1880,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 flex flex-col min-h-0 py-3.5 sm:py-4 px-3 sm:px-4 md:px-6 overflow-hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-[94%] 2xl:w-[92%] max-w-[96rem] mx-auto flex-1 flex flex-col min-h-0",
                    children: [
                        canSeeRegisterAndCreate || showMetrics ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "shrink-0 mb-3 space-y-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$dashboard$2d$header$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DashboardHeader"], {
                                    canSeeRegisterAndCreate: canSeeRegisterAndCreate,
                                    onRegisterNewPatient: ()=>setShowPatientRegistrationModal(true),
                                    onCreateVisit: openVisitCreationModal
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard-page.tsx",
                                    lineNumber: 1886,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$dashboard$2d$stats$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DashboardStats"], {
                                    showMetrics: showMetrics,
                                    loading: dashboardStatsLoading,
                                    totalOpen: dashboardStats?.totalOpen ?? 0,
                                    totalCompleted: dashboardStats?.totalCompleted ?? 0,
                                    totalWaitingForBilling: dashboardStats?.totalWaitingForBilling ?? 0
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard-page.tsx",
                                    lineNumber: 1892,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/dashboard-page.tsx",
                            lineNumber: 1885,
                            columnNumber: 13
                        }, this) : null,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 min-h-0 bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl shadow-lg flex flex-col overflow-hidden",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-4 md:px-6 md:py-3.5 border-b border-border/30 shrink-0 bg-card/40 backdrop-blur-md",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "hidden md:flex gap-2 flex-wrap justify-center items-center",
                                            children: availableTabs.map((tab)=>{
                                                const isActive = statusFilter === tab.id;
                                                const count = filterCounts[tab.id] ?? 0;
                                                const isCompletedTab = tab.id === "COMPLETED";
                                                const isBillingTab = tab.id === "BILLING";
                                                const isConsultationTab = tab.id === "CONSULTATION";
                                                const isNewTab = tab.id === "NEW";
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setStatusFilter(tab.id),
                                                    className: `inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive ? isCompletedTab ? "bg-emerald-600 text-white shadow-md scale-105" : isBillingTab ? "bg-amber-600 text-white shadow-md scale-105" : isConsultationTab ? "bg-sky-600 text-white shadow-md scale-105" : isNewTab ? "bg-indigo-600 text-white shadow-md scale-105" : "bg-primary text-primary-foreground shadow-md scale-105" : "bg-muted/50 backdrop-blur-sm text-foreground hover:bg-muted/70 hover:scale-105"}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: tab.label
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                            lineNumber: 1935,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `text-xs px-2 py-0.5 rounded-full font-semibold ${isActive ? "bg-white/25 text-white" : isCompletedTab ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : isBillingTab ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" : isConsultationTab ? "bg-sky-500/15 text-sky-600 dark:text-sky-400" : isNewTab ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400" : "bg-muted-foreground/15 text-muted-foreground"}`,
                                                            children: count
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                            lineNumber: 1936,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, tab.id, true, {
                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                    lineNumber: 1918,
                                                    columnNumber: 23
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/components/dashboard-page.tsx",
                                            lineNumber: 1908,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "md:hidden px-11 sm:px-14 md:px-0",
                                            children: !mobileSearchActive ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-2",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "relative flex-1",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                value: statusFilter,
                                                                onChange: (e)=>setStatusFilter(e.target.value),
                                                                className: "w-full px-3 py-2 rounded-full bg-primary text-primary-foreground border-none shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium appearance-none cursor-pointer text-sm",
                                                                style: {
                                                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='white' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                                                                    backgroundRepeat: "no-repeat",
                                                                    backgroundPosition: "right 0.75rem center",
                                                                    paddingRight: "2rem"
                                                                },
                                                                children: availableTabs.map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: tab.id,
                                                                        children: [
                                                                            tab.label,
                                                                            " (",
                                                                            filterCounts[tab.id] ?? 0,
                                                                            ")"
                                                                        ]
                                                                    }, tab.id, true, {
                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                        lineNumber: 1975,
                                                                        columnNumber: 31
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                lineNumber: 1963,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                            lineNumber: 1962,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                            type: "button",
                                                            size: "icon",
                                                            variant: "outline",
                                                            className: "rounded-full h-10 w-10 flex-shrink-0",
                                                            onClick: ()=>setViewMode((prev)=>prev === "list" ? "grid" : "list"),
                                                            title: viewMode === "list" ? "Switch to grid view" : "Switch to list view",
                                                            "aria-label": viewMode === "list" ? "Switch to grid view" : "Switch to list view",
                                                            children: viewMode === "list" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutGrid$3e$__["LayoutGrid"], {
                                                                className: "w-4 h-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                lineNumber: 2003,
                                                                columnNumber: 29
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__["List"], {
                                                                className: "w-4 h-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                lineNumber: 2005,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                            lineNumber: 1981,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                            type: "button",
                                                            size: "icon",
                                                            variant: "outline",
                                                            className: "rounded-full h-10 w-10 flex-shrink-0",
                                                            onClick: ()=>setMobileSearchActive(true),
                                                            title: "Search",
                                                            "aria-label": "Search",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                                className: "w-4 h-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                lineNumber: 2017,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                            lineNumber: 2008,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$dashboard$2d$filter$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DashboardFilterPopover"], {
                                                            canQueryAnswerState: canQueryAnswerState,
                                                            answersFilter: answersFilter,
                                                            setAnswersFilter: setAnswersFilter,
                                                            genderFilter: genderFilter,
                                                            setGenderFilter: setGenderFilter,
                                                            ageRange: ageRange,
                                                            setAgeRange: setAgeRange,
                                                            customAgeMin: customAgeMin,
                                                            setCustomAgeMin: setCustomAgeMin,
                                                            customAgeMax: customAgeMax,
                                                            setCustomAgeMax: setCustomAgeMax,
                                                            dobFilter: dobFilter,
                                                            setDobFilter: setDobFilter,
                                                            searchAllHistorical: searchAllHistorical,
                                                            setSearchAllHistorical: setSearchAllHistorical,
                                                            showDatabaseSearch: statusFilter === "COMPLETED",
                                                            activeFilterCount: activeFilterCount,
                                                            handleResetFilters: handleResetFilters,
                                                            loadingHistoricalSearch: loadingHistoricalSearch,
                                                            matchCount: filterCounts.all
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                            lineNumber: 2019,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                    lineNumber: 1961,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/dashboard-page.tsx",
                                                lineNumber: 1960,
                                                columnNumber: 21
                                            }, this) : null
                                        }, void 0, false, {
                                            fileName: "[project]/components/dashboard-page.tsx",
                                            lineNumber: 1958,
                                            columnNumber: 17
                                        }, this),
                                        !mobileSearchActive ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "hidden md:flex mt-3 gap-3 items-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative flex-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                            className: "absolute left-4 top-2.5 w-4 h-4 text-muted-foreground"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                            lineNumber: 2050,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            placeholder: "Search by patient name...",
                                                            value: searchQuery,
                                                            onChange: (e)=>setSearchQuery(e.target.value),
                                                            className: "w-full pl-11 pr-4 py-2 bg-card/80 dark:bg-slate-900/70 backdrop-blur-sm border border-border/50 dark:border-slate-800 rounded-full text-foreground dark:text-slate-100 placeholder-muted-foreground dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 shadow-sm text-sm"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                            lineNumber: 2051,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                    lineNumber: 2049,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$dashboard$2d$filter$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DashboardFilterPopover"], {
                                                    canQueryAnswerState: canQueryAnswerState,
                                                    answersFilter: answersFilter,
                                                    setAnswersFilter: setAnswersFilter,
                                                    genderFilter: genderFilter,
                                                    setGenderFilter: setGenderFilter,
                                                    ageRange: ageRange,
                                                    setAgeRange: setAgeRange,
                                                    customAgeMin: customAgeMin,
                                                    setCustomAgeMin: setCustomAgeMin,
                                                    customAgeMax: customAgeMax,
                                                    setCustomAgeMax: setCustomAgeMax,
                                                    dobFilter: dobFilter,
                                                    setDobFilter: setDobFilter,
                                                    searchAllHistorical: searchAllHistorical,
                                                    setSearchAllHistorical: setSearchAllHistorical,
                                                    showDatabaseSearch: statusFilter === "COMPLETED",
                                                    activeFilterCount: activeFilterCount,
                                                    handleResetFilters: handleResetFilters,
                                                    loadingHistoricalSearch: loadingHistoricalSearch,
                                                    matchCount: filterCounts.all
                                                }, void 0, false, {
                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                    lineNumber: 2059,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                    type: "button",
                                                    size: "icon",
                                                    variant: "outline",
                                                    className: "rounded-full h-9 w-9 flex-shrink-0",
                                                    onClick: ()=>setViewMode((prev)=>prev === "list" ? "grid" : "list"),
                                                    title: viewMode === "list" ? "Switch to grid view" : "Switch to list view",
                                                    "aria-label": viewMode === "list" ? "Switch to grid view" : "Switch to list view",
                                                    children: viewMode === "list" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutGrid$3e$__["LayoutGrid"], {
                                                        className: "w-4 h-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                        lineNumber: 2103,
                                                        columnNumber: 25
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__["List"], {
                                                        className: "w-4 h-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                        lineNumber: 2105,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                    lineNumber: 2081,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/dashboard-page.tsx",
                                            lineNumber: 2048,
                                            columnNumber: 19
                                        }, this) : null
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/dashboard-page.tsx",
                                    lineNumber: 1906,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    onScroll: handleVisitsContainerScroll,
                                    className: `flex-1 min-h-0 overflow-y-auto p-4 md:p-6 ${mobileSearchActive ? "hidden md:block" : ""}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3" : "space-y-2",
                                            children: loading ? viewMode === "grid" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "col-span-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3",
                                                children: [
                                                    ...Array(6)
                                                ].map((_, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "p-4 bg-card/80 dark:bg-slate-900/70 backdrop-blur-sm border border-border/50 dark:border-slate-800 rounded-2xl h-full",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "h-full flex flex-col justify-between gap-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "space-y-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-3",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                                                    className: "h-10 w-10 rounded-full shrink-0"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                    lineNumber: 2136,
                                                                                    columnNumber: 37
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "min-w-0 flex-1 space-y-2",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                                                            className: "h-4 w-3/5 max-w-40"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                            lineNumber: 2138,
                                                                                            columnNumber: 39
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                                                            className: "h-3 w-1/2 max-w-28"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                            lineNumber: 2139,
                                                                                            columnNumber: 39
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                    lineNumber: 2137,
                                                                                    columnNumber: 37
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                            lineNumber: 2135,
                                                                            columnNumber: 35
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "space-y-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                                                    className: "h-3 w-full max-w-52"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                    lineNumber: 2143,
                                                                                    columnNumber: 37
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                                                    className: "h-3 w-2/3 max-w-40"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                    lineNumber: 2144,
                                                                                    columnNumber: 37
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                            lineNumber: 2142,
                                                                            columnNumber: 35
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                    lineNumber: 2134,
                                                                    columnNumber: 33
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center justify-between gap-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                                            className: "h-8 w-24 rounded-full"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                            lineNumber: 2148,
                                                                            columnNumber: 35
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                                            className: "h-8 w-20 rounded-full"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                            lineNumber: 2149,
                                                                            columnNumber: 35
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                    lineNumber: 2147,
                                                                    columnNumber: 33
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                            lineNumber: 2133,
                                                            columnNumber: 31
                                                        }, this)
                                                    }, idx, false, {
                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                        lineNumber: 2129,
                                                        columnNumber: 29
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/components/dashboard-page.tsx",
                                                lineNumber: 2127,
                                                columnNumber: 25
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-2",
                                                children: [
                                                    ...Array(5)
                                                ].map((_, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "p-4 bg-card/80 dark:bg-slate-900/70 backdrop-blur-sm border border-border/50 dark:border-slate-800 rounded-2xl",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-3 min-w-0 flex-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                                            className: "h-10 w-10 rounded-full shrink-0"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                            lineNumber: 2164,
                                                                            columnNumber: 35
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "min-w-0 flex-1 space-y-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                                                    className: "h-4 w-3/5 max-w-64"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                    lineNumber: 2166,
                                                                                    columnNumber: 37
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                                                    className: "h-3 w-2/5 max-w-40"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                    lineNumber: 2167,
                                                                                    columnNumber: 37
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                            lineNumber: 2165,
                                                                            columnNumber: 35
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                    lineNumber: 2163,
                                                                    columnNumber: 33
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-2 flex-wrap",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                                            className: "h-8 w-24 rounded-full"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                            lineNumber: 2171,
                                                                            columnNumber: 35
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                                            className: "h-8 w-24 rounded-full"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                            lineNumber: 2172,
                                                                            columnNumber: 35
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                    lineNumber: 2170,
                                                                    columnNumber: 33
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                            lineNumber: 2162,
                                                            columnNumber: 31
                                                        }, this)
                                                    }, idx, false, {
                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                        lineNumber: 2158,
                                                        columnNumber: 29
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/components/dashboard-page.tsx",
                                                lineNumber: 2156,
                                                columnNumber: 25
                                            }, this) : error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-center py-8",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                                        className: "w-8 h-8 text-destructive mx-auto mb-2"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                        lineNumber: 2181,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$inline$2d$try$2d$again$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        onTryAgain: ()=>{
                                                            void refetchVisits();
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                        lineNumber: 2182,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/dashboard-page.tsx",
                                                lineNumber: 2180,
                                                columnNumber: 23
                                            }, this) : allVisits.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `text-center py-8 ${viewMode === "grid" ? "col-span-full" : ""}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                        className: "w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                        lineNumber: 2192,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-muted-foreground",
                                                        children: "No visits found"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                        lineNumber: 2193,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/dashboard-page.tsx",
                                                lineNumber: 2189,
                                                columnNumber: 23
                                            }, this) : allVisits.map((visit)=>{
                                                const unbilledProductCount = countUnbilledProducts(visit);
                                                const unbilledProductNames = getUnbilledProductNames(visit);
                                                const billedProductCount = countBilledProducts(visit);
                                                const billedProductNames = getBilledProductNames(visit);
                                                const departmentsReadyForBilling = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visit$2d$product$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDepartmentsReadyForBilling"])(visit);
                                                const totalNewNotes = (visit.departments || []).reduce((sum, dept)=>sum + (dept.notes?.newNotes || 0), 0);
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `p-4 bg-card/80 dark:bg-slate-900/70 backdrop-blur-sm border border-border/50 dark:border-slate-800 rounded-2xl hover:bg-card/90 dark:hover:bg-slate-900/90 hover:shadow-md transition-all duration-200 ${viewMode === "grid" ? "h-full" : ""}`,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: viewMode === "grid" ? "h-full flex flex-col justify-between gap-4" : "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: viewMode === "grid" ? "space-y-2" : "flex items-center gap-3 flex-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: viewMode === "grid" ? "flex items-center gap-2" : "contents",
                                                                        children: [
                                                                            hasClinicianOrDoctorRole ? (()=>{
                                                                                const ansState = getVisitAnswerState(visit);
                                                                                if (ansState.isFinalised) {
                                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                                                                                                asChild: true,
                                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "inline-flex items-center justify-center flex-shrink-0 cursor-help",
                                                                                                    "aria-label": "Consultation answers finalised",
                                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                                                        className: "w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[2.5]"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                                                        lineNumber: 2246,
                                                                                                        columnNumber: 49
                                                                                                    }, this)
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                    lineNumber: 2242,
                                                                                                    columnNumber: 47
                                                                                                }, this)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                                                lineNumber: 2241,
                                                                                                columnNumber: 45
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipContent"], {
                                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                    className: "text-xs",
                                                                                                    children: "Consultation answers finalised"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                    lineNumber: 2250,
                                                                                                    columnNumber: 47
                                                                                                }, this)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                                                lineNumber: 2249,
                                                                                                columnNumber: 45
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                                        lineNumber: 2240,
                                                                                        columnNumber: 43
                                                                                    }, this);
                                                                                }
                                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                                                                                            asChild: true,
                                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                className: "inline-flex items-center justify-center flex-shrink-0 cursor-help",
                                                                                                "aria-label": "Consultation answers draft or pending",
                                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "w-2.5 h-2.5 rounded-full bg-amber-400 dark:bg-amber-300 ring-2 ring-amber-400/20"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                    lineNumber: 2262,
                                                                                                    columnNumber: 47
                                                                                                }, this)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                                                lineNumber: 2258,
                                                                                                columnNumber: 45
                                                                                            }, this)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                            lineNumber: 2257,
                                                                                            columnNumber: 43
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipContent"], {
                                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                className: "text-xs",
                                                                                                children: ansState.hasDraft ? "Consultation answers in draft" : "Consultation answers pending"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                                                lineNumber: 2266,
                                                                                                columnNumber: 45
                                                                                            }, this)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                            lineNumber: 2265,
                                                                                            columnNumber: 43
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                    lineNumber: 2256,
                                                                                    columnNumber: 41
                                                                                }, this);
                                                                            })() : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                                children: [
                                                                                    visit.status === "CREATED" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                                                                        className: "w-4 h-4 text-secondary flex-shrink-0"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                                        lineNumber: 2278,
                                                                                        columnNumber: 41
                                                                                    }, this),
                                                                                    visit.status === "IN_PROGRESS" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                                                        className: "w-4 h-4 text-accent flex-shrink-0"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                                        lineNumber: 2281,
                                                                                        columnNumber: 41
                                                                                    }, this),
                                                                                    visit.status === "COMPLETED" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                                                        className: "w-4 h-4 text-primary flex-shrink-0"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                                        lineNumber: 2284,
                                                                                        columnNumber: 41
                                                                                    }, this),
                                                                                    visit.status === "FINALISED" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                                                        className: "w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                                        lineNumber: 2287,
                                                                                        columnNumber: 41
                                                                                    }, this),
                                                                                    visit.status === "CANCELLED" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                                                                        className: "w-4 h-4 text-muted-foreground flex-shrink-0"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                                        lineNumber: 2290,
                                                                                        columnNumber: 41
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true),
                                                                            totalNewNotes > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 bg-red-500 text-white text-[11px] font-bold rounded-full",
                                                                                children: totalNewNotes
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                                lineNumber: 2295,
                                                                                columnNumber: 37
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex items-center gap-1.5 min-w-0",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                                                                                                asChild: true,
                                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                                                    className: "font-medium text-foreground truncate cursor-help",
                                                                                                    children: [
                                                                                                        visit.patient.firstName,
                                                                                                        " ",
                                                                                                        visit.patient.lastName
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                    lineNumber: 2302,
                                                                                                    columnNumber: 41
                                                                                                }, this)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                                                lineNumber: 2301,
                                                                                                columnNumber: 39
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipContent"], {
                                                                                                className: "max-w-sm p-3 z-[150]",
                                                                                                children: renderPatientDemographicsHover(visit)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                                                lineNumber: 2307,
                                                                                                columnNumber: 39
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                                        lineNumber: 2300,
                                                                                        columnNumber: 37
                                                                                    }, this),
                                                                                    canSeeEditPatient && !isDischarged(visit) && visit.status !== "CANCELLED" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                        type: "button",
                                                                                        onClick: (e)=>{
                                                                                            e.stopPropagation();
                                                                                            setSelectedPatientForEdit(visit.patient);
                                                                                            setEditPatientModalOpen(true);
                                                                                        },
                                                                                        className: "text-muted-foreground hover:text-primary transition-colors p-0.5 rounded-md hover:bg-muted/60 shrink-0",
                                                                                        title: `Edit ${visit.patient.firstName} ${visit.patient.lastName}'s information`,
                                                                                        "aria-label": "Edit Patient Details",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$pen$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UserPen$3e$__["UserPen"], {
                                                                                            className: "w-3.5 h-3.5"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                            lineNumber: 2323,
                                                                                            columnNumber: 41
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                                        lineNumber: 2312,
                                                                                        columnNumber: 39
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                                lineNumber: 2299,
                                                                                columnNumber: 35
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                        lineNumber: 2228,
                                                                        columnNumber: 33
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "min-w-0",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-sm text-muted-foreground truncate",
                                                                                children: new Date(visit.visitDate).toLocaleDateString()
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                                lineNumber: 2329,
                                                                                columnNumber: 35
                                                                            }, this),
                                                                            (()=>{
                                                                                const activeDeptInfo = getVisitActiveDepartmentInfo(visit);
                                                                                const isPillActive = activeDeptInfo.status === "ACTIVE" || activeDeptInfo.status === "IN_PROGRESS" || activeDeptInfo.status === "DEPARTMENT_EDITING" || activeDeptInfo.status === "BILLING";
                                                                                const isPillPending = activeDeptInfo.status === "PENDING";
                                                                                const isPillCompleted = activeDeptInfo.status === "COMPLETED" || activeDeptInfo.status === "FINALISED";
                                                                                const isPillCancelled = activeDeptInfo.status === "CANCELLED";
                                                                                const isUserActiveDept = activeDeptInfo.activeDept && (isUserDept(activeDeptInfo.activeDept.department?.id) || isUserDept(activeDeptInfo.activeDept.id));
                                                                                const canSeeActivePillDuration = canViewAllDeptTimes || Boolean(isUserActiveDept);
                                                                                const canSeeTriageTimes = canViewAllDeptTimes || hasNurseRole || hasReceptionistRole;
                                                                                const canUncancelActivePill = Boolean(activeDeptInfo.activeDept && canUserUncancelDepartment(visit, activeDeptInfo.activeDept));
                                                                                const pillButton = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                    type: "button",
                                                                                    onClick: (e)=>e.stopPropagation(),
                                                                                    onDoubleClick: (e)=>{
                                                                                        if (canUncancelActivePill && activeDeptInfo.activeDept) {
                                                                                            e.stopPropagation();
                                                                                            setDepartmentToUncancel({
                                                                                                visit,
                                                                                                dept: activeDeptInfo.activeDept
                                                                                            });
                                                                                        }
                                                                                    },
                                                                                    className: `group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-secondary/15 hover:bg-secondary/25 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-foreground border border-border/60 hover:border-border transition-all shadow-2xs cursor-pointer select-none ${canUncancelActivePill ? "hover:border-rose-400" : ""}`,
                                                                                    title: canUncancelActivePill ? "Double-click to re-enable this cancelled department, or click to view details" : "Click to view department timeline & details",
                                                                                    "aria-label": `View department timeline for ${visit.patient.firstName} ${visit.patient.lastName}`,
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "relative flex h-2 w-2 flex-shrink-0",
                                                                                            children: isPillActive ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                        className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                                                        lineNumber: 2397,
                                                                                                        columnNumber: 47
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                        className: "relative inline-flex rounded-full h-2 w-2 bg-emerald-500"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                                                        lineNumber: 2398,
                                                                                                        columnNumber: 47
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true) : isPillPending ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                className: "relative inline-flex rounded-full h-2 w-2 bg-amber-500"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                                                lineNumber: 2401,
                                                                                                columnNumber: 45
                                                                                            }, this) : isPillCancelled ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                className: "relative inline-flex rounded-full h-2 w-2 bg-rose-500"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                                                lineNumber: 2403,
                                                                                                columnNumber: 45
                                                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                className: "relative inline-flex rounded-full h-2 w-2 bg-teal-500"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                                                lineNumber: 2405,
                                                                                                columnNumber: 45
                                                                                            }, this)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                            lineNumber: 2394,
                                                                                            columnNumber: 41
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "font-semibold truncate max-w-[130px] sm:max-w-[170px]",
                                                                                            children: activeDeptInfo.displayName
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                            lineNumber: 2408,
                                                                                            columnNumber: 41
                                                                                        }, this),
                                                                                        activeDeptInfo.activeDept && canUserSeeDeptAnswerStatus(activeDeptInfo.activeDept) && (activeDeptInfo.activeDept.hasFinalizedConsultationAnswers ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                                            className: "w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.5] flex-shrink-0"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                            lineNumber: 2417,
                                                                                            columnNumber: 47
                                                                                        }, this) : activeDeptInfo.activeDept.answerId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0",
                                                                                            title: "Draft consultation answers"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                            lineNumber: 2420,
                                                                                            columnNumber: 47
                                                                                        }, this) : null),
                                                                                        isPillActive && activeDeptInfo.duration && canSeeActivePillDuration && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-[11px] text-muted-foreground font-normal",
                                                                                            children: [
                                                                                                "• ",
                                                                                                activeDeptInfo.duration
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                            lineNumber: 2429,
                                                                                            columnNumber: 45
                                                                                        }, this),
                                                                                        isPillPending && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-[11px] text-amber-600 dark:text-amber-400 font-medium",
                                                                                            children: "(Pending)"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                            lineNumber: 2434,
                                                                                            columnNumber: 43
                                                                                        }, this),
                                                                                        activeDeptInfo.allDepts.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-[11px] bg-primary/10 text-primary font-bold px-1.5 py-0.2 rounded-full",
                                                                                            children: activeDeptInfo.allDepts.length
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                            lineNumber: 2440,
                                                                                            columnNumber: 43
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                                                            className: "w-3 h-3 text-muted-foreground group-hover:text-foreground transition-colors ml-0.5 flex-shrink-0"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                            lineNumber: 2447,
                                                                                            columnNumber: 41
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                    lineNumber: 2373,
                                                                                    columnNumber: 39
                                                                                }, this);
                                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "mt-1.5 flex items-center",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Popover"], {
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PopoverTrigger"], {
                                                                                                asChild: true,
                                                                                                children: pillButton
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                                                lineNumber: 2454,
                                                                                                columnNumber: 43
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PopoverContent"], {
                                                                                                align: "start",
                                                                                                sideOffset: 6,
                                                                                                className: "w-80 sm:w-96 p-4 shadow-xl z-[150] bg-popover/95 backdrop-blur-xl border border-border/80",
                                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                    className: "space-y-3",
                                                                                                    children: [
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                            className: "flex items-center justify-between pb-2 border-b border-border/40",
                                                                                                            children: [
                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                                                                    className: "font-semibold text-xs text-foreground",
                                                                                                                    children: "Visit Departments"
                                                                                                                }, void 0, false, {
                                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                    lineNumber: 2464,
                                                                                                                    columnNumber: 49
                                                                                                                }, this),
                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                    className: "text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground",
                                                                                                                    children: [
                                                                                                                        activeDeptInfo.allDepts.length,
                                                                                                                        " ",
                                                                                                                        "department",
                                                                                                                        activeDeptInfo.allDepts.length === 1 ? "" : "s"
                                                                                                                    ]
                                                                                                                }, void 0, true, {
                                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                    lineNumber: 2467,
                                                                                                                    columnNumber: 49
                                                                                                                }, this)
                                                                                                            ]
                                                                                                        }, void 0, true, {
                                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                                            lineNumber: 2463,
                                                                                                            columnNumber: 47
                                                                                                        }, this),
                                                                                                        activeDeptInfo.allDepts.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                            className: "flex items-start gap-3 p-3 rounded-xl bg-muted/40 border border-border/40",
                                                                                                            children: [
                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                                    className: "mt-0.5 h-7 w-7 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0",
                                                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                                                                                        className: "w-3.5 h-3.5"
                                                                                                                    }, void 0, false, {
                                                                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                        lineNumber: 2484,
                                                                                                                        columnNumber: 53
                                                                                                                    }, this)
                                                                                                                }, void 0, false, {
                                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                    lineNumber: 2483,
                                                                                                                    columnNumber: 51
                                                                                                                }, this),
                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                                    className: "flex-1 min-w-0 space-y-1",
                                                                                                                    children: [
                                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                                            className: "flex items-center justify-between gap-2",
                                                                                                                            children: [
                                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                                    className: "font-semibold text-xs text-foreground",
                                                                                                                                    children: "Triage / Check-in"
                                                                                                                                }, void 0, false, {
                                                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                                    lineNumber: 2488,
                                                                                                                                    columnNumber: 55
                                                                                                                                }, this),
                                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                                    className: "text-[11px] px-2 py-0.5 rounded-full font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
                                                                                                                                    children: "In Progress"
                                                                                                                                }, void 0, false, {
                                                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                                    lineNumber: 2491,
                                                                                                                                    columnNumber: 55
                                                                                                                                }, this)
                                                                                                                            ]
                                                                                                                        }, void 0, true, {
                                                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                            lineNumber: 2487,
                                                                                                                            columnNumber: 53
                                                                                                                        }, this),
                                                                                                                        canSeeTriageTimes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                                                                            children: [
                                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                                                    className: "text-[12px] text-muted-foreground",
                                                                                                                                    children: [
                                                                                                                                        "Checked in:",
                                                                                                                                        " ",
                                                                                                                                        formatDepartmentTime(visit.visitDate)
                                                                                                                                    ]
                                                                                                                                }, void 0, true, {
                                                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                                    lineNumber: 2497,
                                                                                                                                    columnNumber: 57
                                                                                                                                }, this),
                                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                                                    className: "text-[12px] font-medium text-blue-600 dark:text-blue-400",
                                                                                                                                    children: [
                                                                                                                                        "Time in triage:",
                                                                                                                                        " ",
                                                                                                                                        formatDepartmentDuration(visit.visitDate)
                                                                                                                                    ]
                                                                                                                                }, void 0, true, {
                                                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                                    lineNumber: 2503,
                                                                                                                                    columnNumber: 57
                                                                                                                                }, this)
                                                                                                                            ]
                                                                                                                        }, void 0, true)
                                                                                                                    ]
                                                                                                                }, void 0, true, {
                                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                    lineNumber: 2486,
                                                                                                                    columnNumber: 51
                                                                                                                }, this)
                                                                                                            ]
                                                                                                        }, void 0, true, {
                                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                                            lineNumber: 2482,
                                                                                                            columnNumber: 49
                                                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                            className: "relative pl-4 space-y-3 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/60",
                                                                                                            children: activeDeptInfo.allDepts.map((dept, idx)=>{
                                                                                                                const status = String(dept.status || "").toUpperCase();
                                                                                                                const isPending = status === "PENDING";
                                                                                                                const isCompleted = status === "COMPLETED" || status === "FINALISED";
                                                                                                                const isCancelled = status === "CANCELLED";
                                                                                                                const isActive = !isPending && !isCompleted && !isCancelled;
                                                                                                                const isThisUserDept = isUserDept(dept.department?.id) || isUserDept(dept.id);
                                                                                                                const canSeeThisDeptTimes = canViewAllDeptTimes || Boolean(isThisUserDept);
                                                                                                                const canUncancelThisDept = canUserUncancelDepartment(visit, dept);
                                                                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                                    className: "relative group",
                                                                                                                    children: [
                                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                                            className: `absolute -left-4 top-2 h-3 w-3 rounded-full border-2 border-background ${isActive ? "bg-blue-500 ring-2 ring-blue-500/30" : isCompleted ? "bg-emerald-500" : isCancelled ? "bg-rose-500" : "bg-amber-400"}`
                                                                                                                        }, void 0, false, {
                                                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                            lineNumber: 2549,
                                                                                                                            columnNumber: 59
                                                                                                                        }, this),
                                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                                            onDoubleClick: (e)=>{
                                                                                                                                e.stopPropagation();
                                                                                                                                if (canUncancelThisDept) {
                                                                                                                                    setDepartmentToUncancel({
                                                                                                                                        visit,
                                                                                                                                        dept
                                                                                                                                    });
                                                                                                                                }
                                                                                                                            },
                                                                                                                            className: `p-3 rounded-xl border transition-colors ${canUncancelThisDept ? "cursor-pointer hover:border-rose-400/80 dark:hover:border-rose-500/80 hover:ring-1 hover:ring-rose-400/50" : ""} ${isActive ? "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/60 dark:border-blue-800/40" : isCompleted ? "bg-emerald-50/30 dark:bg-emerald-950/10 border-border/40" : isCancelled ? "bg-rose-50/30 dark:bg-rose-950/10 border-border/40" : "bg-muted/30 border-border/40"}`,
                                                                                                                            children: [
                                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                                                    className: "flex items-center justify-between gap-2",
                                                                                                                                    children: [
                                                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                                            className: "font-semibold text-xs text-foreground truncate",
                                                                                                                                            children: dept.department?.name || "Unknown Department"
                                                                                                                                        }, void 0, false, {
                                                                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                                            lineNumber: 2582,
                                                                                                                                            columnNumber: 63
                                                                                                                                        }, this),
                                                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                                                            className: "flex items-center gap-1.5 flex-shrink-0",
                                                                                                                                            children: [
                                                                                                                                                canUserSeeDeptAnswerStatus(dept) && (dept.hasFinalizedConsultationAnswers ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                                                    className: "inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
                                                                                                                                                    title: "Consultation answers finalised",
                                                                                                                                                    children: [
                                                                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                                                                                                            className: "w-3 h-3 text-emerald-600 dark:text-emerald-400 stroke-[2.5]"
                                                                                                                                                        }, void 0, false, {
                                                                                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                                                            lineNumber: 2594,
                                                                                                                                                            columnNumber: 71
                                                                                                                                                        }, this),
                                                                                                                                                        "Finalised"
                                                                                                                                                    ]
                                                                                                                                                }, void 0, true, {
                                                                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                                                    lineNumber: 2590,
                                                                                                                                                    columnNumber: 69
                                                                                                                                                }, this) : dept.answerId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                                                    className: "inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded-full font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
                                                                                                                                                    title: "Consultation answers in draft",
                                                                                                                                                    children: [
                                                                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                                                            className: "w-1.5 h-1.5 rounded-full bg-amber-400"
                                                                                                                                                        }, void 0, false, {
                                                                                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                                                            lineNumber: 2602,
                                                                                                                                                            columnNumber: 71
                                                                                                                                                        }, this),
                                                                                                                                                        "Draft"
                                                                                                                                                    ]
                                                                                                                                                }, void 0, true, {
                                                                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                                                    lineNumber: 2598,
                                                                                                                                                    columnNumber: 69
                                                                                                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                                                    className: "inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded-full text-muted-foreground bg-muted/40 border border-border/40",
                                                                                                                                                    title: "No consultation answers recorded",
                                                                                                                                                    children: [
                                                                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                                                            className: "w-1.5 h-1.5 rounded-full bg-muted-foreground/40"
                                                                                                                                                        }, void 0, false, {
                                                                                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                                                            lineNumber: 2610,
                                                                                                                                                            columnNumber: 71
                                                                                                                                                        }, this),
                                                                                                                                                        "Pending"
                                                                                                                                                    ]
                                                                                                                                                }, void 0, true, {
                                                                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                                                    lineNumber: 2606,
                                                                                                                                                    columnNumber: 69
                                                                                                                                                }, this)),
                                                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                                                    className: `text-[11px] px-2 py-0.5 rounded-full font-medium ${isActive ? "bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/20" : isCompleted ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20" : isCancelled ? "bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/20" : "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/20"}`,
                                                                                                                                                    children: isPending ? "Pending / Not started" : isCompleted ? "Completed" : isCancelled ? canUncancelThisDept ? "Cancelled (Double-click to restore)" : "Cancelled" : "In Progress"
                                                                                                                                                }, void 0, false, {
                                                                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                                                    lineNumber: 2615,
                                                                                                                                                    columnNumber: 65
                                                                                                                                                }, this),
                                                                                                                                                canUserCancelDepartment(dept) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                                                                                    type: "button",
                                                                                                                                                    onClick: (e)=>{
                                                                                                                                                        e.stopPropagation();
                                                                                                                                                        setDepartmentToCancel({
                                                                                                                                                            visit,
                                                                                                                                                            dept
                                                                                                                                                        });
                                                                                                                                                    },
                                                                                                                                                    title: `Cancel ${dept.department?.name || "department"}`,
                                                                                                                                                    "aria-label": `Cancel ${dept.department?.name || "department"}`,
                                                                                                                                                    className: "p-1 rounded-full text-muted-foreground hover:text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950/50 transition-colors cursor-pointer",
                                                                                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                                                                                                                        className: "w-3.5 h-3.5"
                                                                                                                                                    }, void 0, false, {
                                                                                                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                                                        lineNumber: 2647,
                                                                                                                                                        columnNumber: 69
                                                                                                                                                    }, this)
                                                                                                                                                }, void 0, false, {
                                                                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                                                    lineNumber: 2637,
                                                                                                                                                    columnNumber: 67
                                                                                                                                                }, this)
                                                                                                                                            ]
                                                                                                                                        }, void 0, true, {
                                                                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                                            lineNumber: 2587,
                                                                                                                                            columnNumber: 63
                                                                                                                                        }, this)
                                                                                                                                    ]
                                                                                                                                }, void 0, true, {
                                                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                                    lineNumber: 2581,
                                                                                                                                    columnNumber: 61
                                                                                                                                }, this),
                                                                                                                                canSeeThisDeptTimes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                                                    className: "mt-1.5 space-y-0.5 text-[12px] text-muted-foreground",
                                                                                                                                    children: [
                                                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                                                            className: "flex items-center justify-between",
                                                                                                                                            children: [
                                                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                                                    children: "Created:"
                                                                                                                                                }, void 0, false, {
                                                                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                                                    lineNumber: 2656,
                                                                                                                                                    columnNumber: 67
                                                                                                                                                }, this),
                                                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                                                    className: "font-mono text-[11px]",
                                                                                                                                                    children: formatDepartmentTime(dept.createdAt, visit.visitDate)
                                                                                                                                                }, void 0, false, {
                                                                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                                                    lineNumber: 2659,
                                                                                                                                                    columnNumber: 67
                                                                                                                                                }, this)
                                                                                                                                            ]
                                                                                                                                        }, void 0, true, {
                                                                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                                            lineNumber: 2655,
                                                                                                                                            columnNumber: 65
                                                                                                                                        }, this),
                                                                                                                                        isCompleted && dept.completedAt && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                                                            className: "flex items-center justify-between",
                                                                                                                                            children: [
                                                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                                                    children: "Completed:"
                                                                                                                                                }, void 0, false, {
                                                                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                                                    lineNumber: 2670,
                                                                                                                                                    columnNumber: 71
                                                                                                                                                }, this),
                                                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                                                    className: "font-mono text-[11px]",
                                                                                                                                                    children: formatDepartmentTime(dept.completedAt)
                                                                                                                                                }, void 0, false, {
                                                                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                                                    lineNumber: 2673,
                                                                                                                                                    columnNumber: 71
                                                                                                                                                }, this)
                                                                                                                                            ]
                                                                                                                                        }, void 0, true, {
                                                                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                                            lineNumber: 2669,
                                                                                                                                            columnNumber: 69
                                                                                                                                        }, this),
                                                                                                                                        isActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                                                            className: "flex items-center justify-between font-medium text-blue-600 dark:text-blue-400",
                                                                                                                                            children: [
                                                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                                                    children: "Time in department:"
                                                                                                                                                }, void 0, false, {
                                                                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                                                    lineNumber: 2683,
                                                                                                                                                    columnNumber: 69
                                                                                                                                                }, this),
                                                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                                                    children: formatDepartmentDuration(dept.createdAt, null, visit.visitDate)
                                                                                                                                                }, void 0, false, {
                                                                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                                                    lineNumber: 2687,
                                                                                                                                                    columnNumber: 69
                                                                                                                                                }, this)
                                                                                                                                            ]
                                                                                                                                        }, void 0, true, {
                                                                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                                            lineNumber: 2682,
                                                                                                                                            columnNumber: 67
                                                                                                                                        }, this),
                                                                                                                                        isCompleted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                                                            className: "flex items-center justify-between font-medium text-emerald-600 dark:text-emerald-400",
                                                                                                                                            children: [
                                                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                                                    children: "Total duration:"
                                                                                                                                                }, void 0, false, {
                                                                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                                                    lineNumber: 2699,
                                                                                                                                                    columnNumber: 69
                                                                                                                                                }, this),
                                                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                                                    children: formatDepartmentDuration(dept.createdAt, dept.completedAt, visit.visitDate)
                                                                                                                                                }, void 0, false, {
                                                                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                                                    lineNumber: 2703,
                                                                                                                                                    columnNumber: 69
                                                                                                                                                }, this)
                                                                                                                                            ]
                                                                                                                                        }, void 0, true, {
                                                                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                                            lineNumber: 2698,
                                                                                                                                            columnNumber: 67
                                                                                                                                        }, this),
                                                                                                                                        isPending && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                                                            className: "text-amber-600 dark:text-amber-400 font-medium pt-0.5",
                                                                                                                                            children: "Status: Pending (Not yet started)"
                                                                                                                                        }, void 0, false, {
                                                                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                                            lineNumber: 2714,
                                                                                                                                            columnNumber: 67
                                                                                                                                        }, this)
                                                                                                                                    ]
                                                                                                                                }, void 0, true, {
                                                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                                    lineNumber: 2654,
                                                                                                                                    columnNumber: 63
                                                                                                                                }, this),
                                                                                                                                !canSeeThisDeptTimes && isPending && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                                                    className: "mt-1.5 text-[12px] text-amber-600 dark:text-amber-400 font-medium",
                                                                                                                                    children: "Status: Pending (Not yet started)"
                                                                                                                                }, void 0, false, {
                                                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                                    lineNumber: 2725,
                                                                                                                                    columnNumber: 65
                                                                                                                                }, this),
                                                                                                                                dept.notes && dept.notes.newNotes > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                                                    className: "mt-1.5 pt-1.5 border-t border-border/30 text-[11px] text-rose-600 dark:text-rose-400 font-medium",
                                                                                                                                    children: [
                                                                                                                                        dept.notes.newNotes,
                                                                                                                                        " ",
                                                                                                                                        "new note(s)"
                                                                                                                                    ]
                                                                                                                                }, void 0, true, {
                                                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                                    lineNumber: 2736,
                                                                                                                                    columnNumber: 65
                                                                                                                                }, this),
                                                                                                                                canSeeProducts && (()=>{
                                                                                                                                    const deptProducts = dept.products || [];
                                                                                                                                    const childProducts = (dept.childVisitDepartments || []).flatMap((c)=>c.products || []);
                                                                                                                                    const allDeptProducts = [
                                                                                                                                        ...deptProducts,
                                                                                                                                        ...childProducts
                                                                                                                                    ];
                                                                                                                                    if (allDeptProducts.length === 0) return null;
                                                                                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                                                        className: "mt-2 pt-2 border-t border-border/40 flex items-center justify-between",
                                                                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
                                                                                                                                            children: [
                                                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                                                                                                                                                    asChild: true,
                                                                                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                                                                        className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary/15 hover:bg-secondary/30 text-[12px] text-foreground font-medium cursor-help transition-all border border-border/50 shadow-2xs hover:border-border",
                                                                                                                                                        children: [
                                                                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                                                                                                                                                className: "w-3.5 h-3.5 text-primary flex-shrink-0"
                                                                                                                                                            }, void 0, false, {
                                                                                                                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                                                                lineNumber: 2757,
                                                                                                                                                                columnNumber: 73
                                                                                                                                                            }, this),
                                                                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                                                                children: [
                                                                                                                                                                    allDeptProducts.length,
                                                                                                                                                                    " product",
                                                                                                                                                                    allDeptProducts.length === 1 ? "" : "s"
                                                                                                                                                                ]
                                                                                                                                                            }, void 0, true, {
                                                                                                                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                                                                lineNumber: 2758,
                                                                                                                                                                columnNumber: 73
                                                                                                                                                            }, this)
                                                                                                                                                        ]
                                                                                                                                                    }, void 0, true, {
                                                                                                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                                                        lineNumber: 2756,
                                                                                                                                                        columnNumber: 71
                                                                                                                                                    }, this)
                                                                                                                                                }, void 0, false, {
                                                                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                                                    lineNumber: 2755,
                                                                                                                                                    columnNumber: 69
                                                                                                                                                }, this),
                                                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipContent"], {
                                                                                                                                                    side: "right",
                                                                                                                                                    align: "start",
                                                                                                                                                    className: "max-w-xs p-2.5 z-[150]",
                                                                                                                                                    children: renderDepartmentProductsHover(dept)
                                                                                                                                                }, void 0, false, {
                                                                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                                                    lineNumber: 2763,
                                                                                                                                                    columnNumber: 69
                                                                                                                                                }, this)
                                                                                                                                            ]
                                                                                                                                        }, void 0, true, {
                                                                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                                            lineNumber: 2754,
                                                                                                                                            columnNumber: 67
                                                                                                                                        }, this)
                                                                                                                                    }, void 0, false, {
                                                                                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                                        lineNumber: 2753,
                                                                                                                                        columnNumber: 65
                                                                                                                                    }, this);
                                                                                                                                })()
                                                                                                                            ]
                                                                                                                        }, void 0, true, {
                                                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                            lineNumber: 2560,
                                                                                                                            columnNumber: 59
                                                                                                                        }, this)
                                                                                                                    ]
                                                                                                                }, dept.id || idx, true, {
                                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                                    lineNumber: 2544,
                                                                                                                    columnNumber: 57
                                                                                                                }, this);
                                                                                                            })
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                                            lineNumber: 2514,
                                                                                                            columnNumber: 49
                                                                                                        }, this)
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                    lineNumber: 2462,
                                                                                                    columnNumber: 45
                                                                                                }, this)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                                                lineNumber: 2457,
                                                                                                columnNumber: 43
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                                        lineNumber: 2453,
                                                                                        columnNumber: 41
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                    lineNumber: 2452,
                                                                                    columnNumber: 39
                                                                                }, this);
                                                                            })()
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                        lineNumber: 2328,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                lineNumber: 2221,
                                                                columnNumber: 31
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: `flex items-center gap-2 flex-wrap ${viewMode === "grid" ? "justify-start" : "justify-end lg:justify-start lg:flex-nowrap"}`,
                                                                children: [
                                                                    (()=>{
                                                                        const matchedClosedDepartment = getMatchingUserDepartment(visit, {
                                                                            mustBeClosed: true
                                                                        });
                                                                        const showClosedConsultationActions = Boolean(canSeeVisitActionButtons && canSeeConsultButton && hasClinicianOrDoctorRole && matchedClosedDepartment);
                                                                        const matchingActiveDept = getMatchingUserDepartment(visit, {
                                                                            mustBeClosed: false
                                                                        }) || (visit.departments || []).find((d)=>{
                                                                            const deptId = String(d?.department?.id || d?.id || "");
                                                                            return deptId && userDepartmentIds.includes(deptId);
                                                                        });
                                                                        const hasExistingAnswer = Boolean(matchingActiveDept?.answerId || matchingActiveDept?.hasFinalizedConsultationAnswers);
                                                                        const isEligibleForContinue = Boolean(matchingActiveDept && matchingActiveDept.status !== "FINALISED" && matchingActiveDept.status !== "CANCELLED");
                                                                        const consultButtonLabel = hasExistingAnswer && isEligibleForContinue ? "Continue" : "Start Consult";
                                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                            children: [
                                                                                canViewPatientHistory && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                                                                                            asChild: true,
                                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                                onClick: (e)=>{
                                                                                                    e.stopPropagation();
                                                                                                    handleViewPatientHistory(visit);
                                                                                                },
                                                                                                title: "View Patient History",
                                                                                                "aria-label": "View Patient History",
                                                                                                className: "h-9 w-9 sm:h-10 sm:w-10 bg-amber-600 hover:bg-amber-700 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center",
                                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__["History"], {
                                                                                                    className: "w-4 h-4 flex-shrink-0"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                    lineNumber: 2840,
                                                                                                    columnNumber: 47
                                                                                                }, this)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                                                lineNumber: 2831,
                                                                                                columnNumber: 45
                                                                                            }, this)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                            lineNumber: 2830,
                                                                                            columnNumber: 43
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipContent"], {
                                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                children: "View Patient History"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                                                lineNumber: 2844,
                                                                                                columnNumber: 45
                                                                                            }, this)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                            lineNumber: 2843,
                                                                                            columnNumber: 43
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                    lineNumber: 2829,
                                                                                    columnNumber: 41
                                                                                }, this),
                                                                                !showClosedConsultationActions && canSeeVisitActionButtons && canSeeConsultButton && canConsultVisit(visit) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                                                                                            asChild: true,
                                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                                onClick: (e)=>{
                                                                                                    e.stopPropagation();
                                                                                                    setNavigatingVisitId(visit.id);
                                                                                                    handleConsultVisit(visit);
                                                                                                },
                                                                                                title: consultButtonLabel,
                                                                                                "aria-label": consultButtonLabel,
                                                                                                disabled: navigatingVisitId === visit.id,
                                                                                                className: "h-9 w-9 sm:h-10 sm:w-10 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center",
                                                                                                children: navigatingVisitId === visit.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                                                                    className: "w-4 h-4 flex-shrink-0 animate-spin"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                    lineNumber: 2867,
                                                                                                    columnNumber: 51
                                                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$stethoscope$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Stethoscope$3e$__["Stethoscope"], {
                                                                                                    className: "w-4 h-4 flex-shrink-0"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                    lineNumber: 2869,
                                                                                                    columnNumber: 51
                                                                                                }, this)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                                                lineNumber: 2855,
                                                                                                columnNumber: 47
                                                                                            }, this)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                            lineNumber: 2854,
                                                                                            columnNumber: 45
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipContent"], {
                                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                children: consultButtonLabel
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                                                lineNumber: 2874,
                                                                                                columnNumber: 47
                                                                                            }, this)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                            lineNumber: 2873,
                                                                                            columnNumber: 45
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                    lineNumber: 2853,
                                                                                    columnNumber: 43
                                                                                }, this),
                                                                                showClosedConsultationActions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                                                                                                    asChild: true,
                                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                                        onClick: (e)=>{
                                                                                                            e.stopPropagation();
                                                                                                            handleEditConsultation(visit);
                                                                                                        },
                                                                                                        title: "Edit Consultation",
                                                                                                        "aria-label": "Edit Consultation",
                                                                                                        className: "h-9 w-9 sm:h-10 sm:w-10 bg-slate-700 hover:bg-slate-800 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center",
                                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$pen$2d$line$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FilePenLine$3e$__["FilePenLine"], {
                                                                                                            className: "w-4 h-4 flex-shrink-0"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                                            lineNumber: 2892,
                                                                                                            columnNumber: 49
                                                                                                        }, this)
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                                                        lineNumber: 2883,
                                                                                                        columnNumber: 47
                                                                                                    }, this)
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                    lineNumber: 2882,
                                                                                                    columnNumber: 45
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipContent"], {
                                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                        children: "Edit Consultation"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                                                        lineNumber: 2896,
                                                                                                        columnNumber: 47
                                                                                                    }, this)
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                    lineNumber: 2895,
                                                                                                    columnNumber: 45
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                            lineNumber: 2881,
                                                                                            columnNumber: 43
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                                                                                                    asChild: true,
                                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                                        onClick: (e)=>{
                                                                                                            e.stopPropagation();
                                                                                                            handlePreviewConsultation(visit);
                                                                                                        },
                                                                                                        title: "Preview Consultation",
                                                                                                        "aria-label": "Preview Consultation",
                                                                                                        className: "h-9 w-9 sm:h-10 sm:w-10 bg-slate-500 hover:bg-slate-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center",
                                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                                                                            className: "w-4 h-4 flex-shrink-0"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                                            lineNumber: 2913,
                                                                                                            columnNumber: 49
                                                                                                        }, this)
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                                                        lineNumber: 2902,
                                                                                                        columnNumber: 47
                                                                                                    }, this)
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                    lineNumber: 2901,
                                                                                                    columnNumber: 45
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipContent"], {
                                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                        children: "Preview Consultation"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                                                        lineNumber: 2917,
                                                                                                        columnNumber: 47
                                                                                                    }, this)
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                    lineNumber: 2916,
                                                                                                    columnNumber: 45
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                            lineNumber: 2900,
                                                                                            columnNumber: 43
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true)
                                                                            ]
                                                                        }, void 0, true);
                                                                    })(),
                                                                    canSeeVisitActionButtons && hasNurseRole && (visit.status === "CREATED" || visit.status === "IN_PROGRESS") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                                                                                asChild: true,
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                    onClick: (e)=>{
                                                                                        e.stopPropagation();
                                                                                        setNavigatingVisitId(visit.id);
                                                                                        handleTriageVisit(visit);
                                                                                    },
                                                                                    title: "Open Triage",
                                                                                    "aria-label": "Open Triage",
                                                                                    disabled: navigatingVisitId === visit.id,
                                                                                    className: "h-9 w-9 sm:h-10 sm:w-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center",
                                                                                    children: navigatingVisitId === visit.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                                                        className: "w-4 h-4 flex-shrink-0 animate-spin"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                                        lineNumber: 2944,
                                                                                        columnNumber: 45
                                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"], {
                                                                                        className: "w-4 h-4 flex-shrink-0"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                                        lineNumber: 2946,
                                                                                        columnNumber: 45
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                    lineNumber: 2932,
                                                                                    columnNumber: 41
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                                lineNumber: 2931,
                                                                                columnNumber: 39
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipContent"], {
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    children: "Triage"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                    lineNumber: 2951,
                                                                                    columnNumber: 41
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                                lineNumber: 2950,
                                                                                columnNumber: 39
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                        lineNumber: 2930,
                                                                        columnNumber: 37
                                                                    }, this),
                                                                    canSeeVisitActionButtons && hasConsultationRole && (visit.status === "COMPLETED" || visit.status === "CANCELLED") && !Boolean(getMatchingUserDepartment(visit, {
                                                                        mustBeClosed: true
                                                                    })) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                                                                                    asChild: true,
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                        onClick: (e)=>{
                                                                                            e.stopPropagation();
                                                                                            handleEditConsultation(visit);
                                                                                        },
                                                                                        title: "Edit Consultation",
                                                                                        "aria-label": "Edit Consultation",
                                                                                        className: "h-9 w-9 sm:h-10 sm:w-10 bg-slate-700 hover:bg-slate-800 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$pen$2d$line$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FilePenLine$3e$__["FilePenLine"], {
                                                                                            className: "w-4 h-4 flex-shrink-0"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                            lineNumber: 2976,
                                                                                            columnNumber: 45
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                                        lineNumber: 2967,
                                                                                        columnNumber: 43
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                    lineNumber: 2966,
                                                                                    columnNumber: 41
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipContent"], {
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        children: "Edit Consultation"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                                        lineNumber: 2980,
                                                                                        columnNumber: 43
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                    lineNumber: 2979,
                                                                                    columnNumber: 41
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                            lineNumber: 2965,
                                                                            columnNumber: 39
                                                                        }, this)
                                                                    }, void 0, false),
                                                                    canSeeAddDepartment && canAddDepartment(visit) && !isDischarged(visit) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                                                                                asChild: true,
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                    onClick: (e)=>{
                                                                                        e.stopPropagation();
                                                                                        handleAddDepartment(visit);
                                                                                    },
                                                                                    title: "Add Department",
                                                                                    "aria-label": "Add Department",
                                                                                    className: "h-9 w-9 sm:h-10 sm:w-10 bg-purple-500 hover:bg-purple-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                                                        className: "w-4 h-4 flex-shrink-0"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                                        lineNumber: 2999,
                                                                                        columnNumber: 43
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                    lineNumber: 2990,
                                                                                    columnNumber: 41
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                                lineNumber: 2989,
                                                                                columnNumber: 39
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipContent"], {
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    children: "Add Department"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                    lineNumber: 3003,
                                                                                    columnNumber: 41
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                                lineNumber: 3002,
                                                                                columnNumber: 39
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                        lineNumber: 2988,
                                                                        columnNumber: 37
                                                                    }, this),
                                                                    canSeeDischargeButton && canDischargeVisit(visit) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                                                                                asChild: true,
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                    onClick: (e)=>{
                                                                                        e.stopPropagation();
                                                                                        setDischargeConfirmVisit(visit);
                                                                                    },
                                                                                    title: "Discharge Patient",
                                                                                    "aria-label": "Discharge Patient",
                                                                                    disabled: discharging,
                                                                                    className: "px-2 sm:px-4 py-1.5 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1 sm:gap-2 whitespace-nowrap",
                                                                                    children: [
                                                                                        discharging && dischargeConfirmVisit?.id === visit.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                                                            className: "w-4 h-4 flex-shrink-0 animate-spin"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                            lineNumber: 3022,
                                                                                            columnNumber: 45
                                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                                                            className: "w-4 h-4 flex-shrink-0"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                            lineNumber: 3024,
                                                                                            columnNumber: 45
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "hidden sm:inline lg:hidden",
                                                                                            children: "Discharge"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                            lineNumber: 3026,
                                                                                            columnNumber: 43
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "hidden lg:inline",
                                                                                            children: "Discharge"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                            lineNumber: 3029,
                                                                                            columnNumber: 43
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                    lineNumber: 3011,
                                                                                    columnNumber: 41
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                                lineNumber: 3010,
                                                                                columnNumber: 39
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipContent"], {
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    children: "Discharge Patient (set visit to completed)"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                    lineNumber: 3035,
                                                                                    columnNumber: 41
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                                lineNumber: 3034,
                                                                                columnNumber: 39
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                        lineNumber: 3009,
                                                                        columnNumber: 37
                                                                    }, this),
                                                                    canSeeBillButton && hasUnbilledItems(visit) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                                                                                asChild: true,
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                    onClick: (e)=>{
                                                                                        e.stopPropagation();
                                                                                        setNavigatingVisitId(visit.id);
                                                                                        handleGoToBilling(visit);
                                                                                    },
                                                                                    title: "Bill Visit",
                                                                                    disabled: navigatingVisitId === visit.id,
                                                                                    className: "h-9 w-9 sm:h-10 sm:w-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center",
                                                                                    children: navigatingVisitId === visit.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                                                        className: "w-4 h-4 flex-shrink-0 animate-spin"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                                        lineNumber: 3054,
                                                                                        columnNumber: 45
                                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$receipt$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ReceiptText$3e$__["ReceiptText"], {
                                                                                        className: "w-4 h-4 flex-shrink-0"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                                        lineNumber: 3056,
                                                                                        columnNumber: 45
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                    lineNumber: 3043,
                                                                                    columnNumber: 41
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                                lineNumber: 3042,
                                                                                columnNumber: 39
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipContent"], {
                                                                                children: renderBillingTooltipContent(visit, unbilledProductCount, unbilledProductNames, billedProductCount, billedProductNames, departmentsReadyForBilling)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                                lineNumber: 3060,
                                                                                columnNumber: 39
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                        lineNumber: 3041,
                                                                        columnNumber: 37
                                                                    }, this),
                                                                    canSeeBillButton && (visit.departments || []).some((d)=>d.status === "DEPARTMENT_EDITING") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                                                                                asChild: true,
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                    onClick: (e)=>{
                                                                                        e.stopPropagation();
                                                                                        handleGoToBilling(visit);
                                                                                    },
                                                                                    title: "Continue billing",
                                                                                    className: "h-9 w-9 sm:h-10 sm:w-10 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center relative",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$receipt$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ReceiptText$3e$__["ReceiptText"], {
                                                                                            className: "w-4 h-4 flex-shrink-0"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                            lineNumber: 3084,
                                                                                            columnNumber: 43
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-amber-500 text-white text-[11px] font-bold flex items-center justify-center border border-white",
                                                                                            children: "✎"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                            lineNumber: 3085,
                                                                                            columnNumber: 43
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                    lineNumber: 3076,
                                                                                    columnNumber: 41
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                                lineNumber: 3075,
                                                                                columnNumber: 39
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipContent"], {
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    children: "Continue billing"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                    lineNumber: 3091,
                                                                                    columnNumber: 41
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                                lineNumber: 3090,
                                                                                columnNumber: 39
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                        lineNumber: 3074,
                                                                        columnNumber: 37
                                                                    }, this),
                                                                    canSeeBillButton && canPreviewVisitInvoice(visit) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                                                                                asChild: true,
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                    onClick: (e)=>{
                                                                                        e.stopPropagation();
                                                                                        void handlePreviewInvoice(visit);
                                                                                    },
                                                                                    title: "Preview Invoice",
                                                                                    disabled: printingVisitId === visit.id,
                                                                                    className: "h-9 w-9 sm:h-10 sm:w-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center relative",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$receipt$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ReceiptText$3e$__["ReceiptText"], {
                                                                                            className: `w-4 h-4 flex-shrink-0 ${printingVisitId === visit.id ? "animate-spin" : ""}`
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                            lineNumber: 3110,
                                                                                            columnNumber: 43
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-emerald-500 text-white text-[11px] font-bold flex items-center justify-center border border-white",
                                                                                            children: "✓"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                            lineNumber: 3113,
                                                                                            columnNumber: 43
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                    lineNumber: 3099,
                                                                                    columnNumber: 41
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                                lineNumber: 3098,
                                                                                columnNumber: 39
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipContent"], {
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    children: "Preview Invoice"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                    lineNumber: 3119,
                                                                                    columnNumber: 41
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                                lineNumber: 3118,
                                                                                columnNumber: 39
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                        lineNumber: 3097,
                                                                        columnNumber: 37
                                                                    }, this),
                                                                    (hasManagerRole || hasAdminRole) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                        children: [
                                                                            (visit.status === "COMPLETED" || visit.status === "IN_PROGRESS" || visit.status === "CREATED") && (visit.departments || []).some((d)=>d.answerId) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                                                                                        asChild: true,
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                            onClick: (e)=>{
                                                                                                e.stopPropagation();
                                                                                                handleManagerPreviewConsultation(visit);
                                                                                            },
                                                                                            title: "Preview Consultation",
                                                                                            "aria-label": "Preview Consultation",
                                                                                            className: "h-9 w-9 sm:h-10 sm:w-10 bg-slate-500 hover:bg-slate-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center",
                                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                                                                className: "w-4 h-4 flex-shrink-0"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                                                lineNumber: 3145,
                                                                                                columnNumber: 45
                                                                                            }, this)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                            lineNumber: 3136,
                                                                                            columnNumber: 43
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                                        lineNumber: 3135,
                                                                                        columnNumber: 41
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipContent"], {
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            children: "Preview Consultation"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                            lineNumber: 3149,
                                                                                            columnNumber: 43
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                                        lineNumber: 3148,
                                                                                        columnNumber: 41
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                                lineNumber: 3134,
                                                                                columnNumber: 39
                                                                            }, this),
                                                                            (visit.status === "COMPLETED" || visit.status === "FINALISED") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                                                                                        asChild: true,
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                            onClick: (e)=>{
                                                                                                e.stopPropagation();
                                                                                                if (canFinaliseVisit(visit)) {
                                                                                                    void handleFinaliseVisit(visit);
                                                                                                }
                                                                                            },
                                                                                            title: "Finalise Visit",
                                                                                            "aria-label": "Finalise Visit",
                                                                                            disabled: finalisingVisit || !canFinaliseVisit(visit),
                                                                                            className: `px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full shadow-md transition-all duration-200 whitespace-nowrap flex items-center gap-1 sm:gap-2 ${canFinaliseVisit(visit) ? "bg-teal-600 hover:bg-teal-700 text-white hover:shadow-lg" : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"}`,
                                                                                            children: [
                                                                                                finalisingVisit ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                                                                    className: "w-4 h-4 flex-shrink-0 animate-spin"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                    lineNumber: 3175,
                                                                                                    columnNumber: 47
                                                                                                }, this) : canFinaliseVisit(visit) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                                                                    className: "w-4 h-4 flex-shrink-0"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                    lineNumber: 3177,
                                                                                                    columnNumber: 47
                                                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                                                                                                    className: "w-4 h-4 flex-shrink-0"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                    lineNumber: 3179,
                                                                                                    columnNumber: 47
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "hidden sm:inline lg:hidden",
                                                                                                    children: "Finalise"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                    lineNumber: 3181,
                                                                                                    columnNumber: 45
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "hidden lg:inline",
                                                                                                    children: finalisingVisit ? "Finalising…" : canFinaliseVisit(visit) ? "Finalise Visit" : "Not Ready"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                    lineNumber: 3184,
                                                                                                    columnNumber: 45
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                            lineNumber: 3158,
                                                                                            columnNumber: 43
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                                        lineNumber: 3157,
                                                                                        columnNumber: 41
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipContent"], {
                                                                                        side: "bottom",
                                                                                        className: "max-w-xs",
                                                                                        children: canFinaliseVisit(visit) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            children: "Finalise Visit — locks all departments, no more edits"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                            lineNumber: 3191,
                                                                                            columnNumber: 45
                                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                    className: "font-medium mb-1",
                                                                                                    children: "Cannot finalise yet:"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                    lineNumber: 3194,
                                                                                                    columnNumber: 47
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                                                                    className: "list-disc list-inside space-y-0.5",
                                                                                                    children: getFinaliseBlockers(visit).map((reason, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                                            className: "text-xs",
                                                                                                            children: [
                                                                                                                "• ",
                                                                                                                reason
                                                                                                            ]
                                                                                                        }, i, true, {
                                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                                            lineNumber: 3197,
                                                                                                            columnNumber: 51
                                                                                                        }, this))
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                                    lineNumber: 3195,
                                                                                                    columnNumber: 47
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                            lineNumber: 3193,
                                                                                            columnNumber: 45
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                                        lineNumber: 3189,
                                                                                        columnNumber: 41
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                                lineNumber: 3156,
                                                                                columnNumber: 39
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                                                                                        asChild: true,
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                            onClick: (e)=>{
                                                                                                e.stopPropagation();
                                                                                                router.push(`/visits/manage?visitId=${visit.id}`);
                                                                                            },
                                                                                            title: "Manage & Audit Visit",
                                                                                            "aria-label": "Manage & Audit Visit",
                                                                                            className: "h-9 w-9 sm:h-10 sm:w-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center",
                                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__["SlidersHorizontal"], {
                                                                                                className: "w-4 h-4 flex-shrink-0"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                                                lineNumber: 3218,
                                                                                                columnNumber: 43
                                                                                            }, this)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                            lineNumber: 3209,
                                                                                            columnNumber: 41
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                                        lineNumber: 3208,
                                                                                        columnNumber: 39
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipContent"], {
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            children: "Manage & Audit Visit"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                            lineNumber: 3222,
                                                                                            columnNumber: 41
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                                        lineNumber: 3221,
                                                                                        columnNumber: 39
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                                lineNumber: 3207,
                                                                                columnNumber: 37
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                                                                                        asChild: true,
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                            onClick: (e)=>{
                                                                                                e.stopPropagation();
                                                                                                handleOpenSettings(visit);
                                                                                            },
                                                                                            title: "Visit Settings",
                                                                                            "aria-label": "Visit Settings",
                                                                                            className: "h-9 w-9 sm:h-10 sm:w-10 bg-slate-700 hover:bg-slate-800 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center",
                                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                                                                                className: "w-4 h-4 flex-shrink-0"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                                                lineNumber: 3238,
                                                                                                columnNumber: 43
                                                                                            }, this)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                            lineNumber: 3229,
                                                                                            columnNumber: 41
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                                        lineNumber: 3228,
                                                                                        columnNumber: 39
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipContent"], {
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            children: "Visit Settings"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                            lineNumber: 3242,
                                                                                            columnNumber: 41
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                                        lineNumber: 3241,
                                                                                        columnNumber: 39
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                                lineNumber: 3227,
                                                                                columnNumber: 37
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true),
                                                                    canUserCancelWholeVisit(visit) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                                                                                asChild: true,
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                    onClick: (e)=>{
                                                                                        e.stopPropagation();
                                                                                        setVisitToCancel(visit);
                                                                                    },
                                                                                    title: "Cancel Visit",
                                                                                    "aria-label": "Cancel Visit",
                                                                                    className: "h-9 w-9 sm:h-10 sm:w-10 bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-950/40 dark:hover:bg-rose-950/80 dark:text-rose-400 rounded-full border border-rose-300 dark:border-rose-900/60 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center cursor-pointer",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ban$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Ban$3e$__["Ban"], {
                                                                                        className: "w-4 h-4 flex-shrink-0 text-rose-600 dark:text-rose-400"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                                        lineNumber: 3261,
                                                                                        columnNumber: 41
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                    lineNumber: 3252,
                                                                                    columnNumber: 39
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                                lineNumber: 3251,
                                                                                columnNumber: 37
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipContent"], {
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    children: "Cancel Visit — No products or services billed"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                    lineNumber: 3265,
                                                                                    columnNumber: 39
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                                lineNumber: 3264,
                                                                                columnNumber: 37
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                                        lineNumber: 3250,
                                                                        columnNumber: 35
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/dashboard-page.tsx",
                                                                lineNumber: 2785,
                                                                columnNumber: 31
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                        lineNumber: 2214,
                                                        columnNumber: 29
                                                    }, this)
                                                }, visit.id, false, {
                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                    lineNumber: 2210,
                                                    columnNumber: 27
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/components/dashboard-page.tsx",
                                            lineNumber: 2118,
                                            columnNumber: 17
                                        }, this),
                                        statusFilter === "COMPLETED" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            ref: completedSentinelRef,
                                            className: "w-full py-2",
                                            children: loadingOlderCompleted ? viewMode === "grid" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
                                                children: [
                                                    1,
                                                    2,
                                                    3
                                                ].map((idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "p-4 bg-card/80 dark:bg-slate-900/70 backdrop-blur-sm border border-border/50 dark:border-slate-800 rounded-2xl animate-pulse h-full",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "space-y-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-3",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                                                    className: "h-10 w-10 rounded-full shrink-0"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                    lineNumber: 3294,
                                                                                    columnNumber: 39
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "min-w-0 flex-1 space-y-2",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                                                            className: "h-4 w-3/5 max-w-40"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                            lineNumber: 3296,
                                                                                            columnNumber: 41
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                                                            className: "h-3 w-1/2 max-w-28"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                                            lineNumber: 3297,
                                                                                            columnNumber: 41
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                    lineNumber: 3295,
                                                                                    columnNumber: 39
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                            lineNumber: 3293,
                                                                            columnNumber: 37
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "space-y-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                                                    className: "h-3 w-full max-w-52"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                    lineNumber: 3301,
                                                                                    columnNumber: 39
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                                                    className: "h-3 w-2/3 max-w-40"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                    lineNumber: 3302,
                                                                                    columnNumber: 39
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                            lineNumber: 3300,
                                                                            columnNumber: 37
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                    lineNumber: 3292,
                                                                    columnNumber: 35
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center justify-between gap-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                                            className: "h-8 w-24 rounded-full"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                            lineNumber: 3306,
                                                                            columnNumber: 37
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                                            className: "h-8 w-20 rounded-full"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                            lineNumber: 3307,
                                                                            columnNumber: 37
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                    lineNumber: 3305,
                                                                    columnNumber: 35
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                            lineNumber: 3291,
                                                            columnNumber: 33
                                                        }, this)
                                                    }, `completed-skeleton-grid-${idx}`, false, {
                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                        lineNumber: 3287,
                                                        columnNumber: 31
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/components/dashboard-page.tsx",
                                                lineNumber: 3285,
                                                columnNumber: 27
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-2",
                                                children: [
                                                    1,
                                                    2,
                                                    3
                                                ].map((idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "p-4 bg-card/80 dark:bg-slate-900/70 backdrop-blur-sm border border-border/50 dark:border-slate-800 rounded-2xl animate-pulse",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-3 min-w-0 flex-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                                            className: "h-10 w-10 rounded-full shrink-0"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                            lineNumber: 3322,
                                                                            columnNumber: 37
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "min-w-0 flex-1 space-y-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                                                    className: "h-4 w-3/5 max-w-64"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                    lineNumber: 3324,
                                                                                    columnNumber: 39
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                                                    className: "h-3 w-2/5 max-w-40"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                                    lineNumber: 3325,
                                                                                    columnNumber: 39
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                            lineNumber: 3323,
                                                                            columnNumber: 37
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                    lineNumber: 3321,
                                                                    columnNumber: 35
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-2 flex-wrap",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                                            className: "h-8 w-24 rounded-full"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                            lineNumber: 3329,
                                                                            columnNumber: 37
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                                            className: "h-8 w-24 rounded-full"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                                            lineNumber: 3330,
                                                                            columnNumber: 37
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/dashboard-page.tsx",
                                                                    lineNumber: 3328,
                                                                    columnNumber: 35
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/dashboard-page.tsx",
                                                            lineNumber: 3320,
                                                            columnNumber: 33
                                                        }, this)
                                                    }, `completed-skeleton-list-${idx}`, false, {
                                                        fileName: "[project]/components/dashboard-page.tsx",
                                                        lineNumber: 3316,
                                                        columnNumber: 31
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/components/dashboard-page.tsx",
                                                lineNumber: 3314,
                                                columnNumber: 27
                                            }, this) : null
                                        }, void 0, false, {
                                            fileName: "[project]/components/dashboard-page.tsx",
                                            lineNumber: 3279,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/dashboard-page.tsx",
                                    lineNumber: 2113,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/dashboard-page.tsx",
                            lineNumber: 1904,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/dashboard-page.tsx",
                    lineNumber: 1883,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/dashboard-page.tsx",
                lineNumber: 1882,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$dashboard$2d$mobile$2d$ui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DashboardMobileUi"], {
                canSeeRegisterAndCreate: canSeeRegisterAndCreate,
                allVisits: allVisits,
                searchQuery: searchQuery,
                setSearchQuery: setSearchQuery,
                mobileSearchActive: mobileSearchActive,
                setMobileSearchActive: setMobileSearchActive,
                showMobileActionSheet: showMobileActionSheet,
                setShowMobileActionSheet: setShowMobileActionSheet,
                setShowPatientRegistrationModal: setShowPatientRegistrationModal,
                openVisitCreationModal: openVisitCreationModal
            }, void 0, false, {
                fileName: "[project]/components/dashboard-page.tsx",
                lineNumber: 3345,
                columnNumber: 7
            }, this),
            patientHistoryOpen && patientHistoryVisit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PatientHistorySidePane, {
                patientId: String(patientHistoryVisit.patient.id),
                currentVisitId: String(patientHistoryVisit.id),
                onPreviewDepartmentAnswers: ({ answerId, departmentName, patientName, visitId, visitDepartmentId, visitDepartment })=>{
                    setPreviewConsultationContext({
                        answerId,
                        departmentName,
                        patientName,
                        visitId: visitId || null,
                        visitDepartmentId: visitDepartmentId || null,
                        visitDepartment: visitDepartment || null,
                        previewStartedAt: Date.now()
                    });
                    setPreviewConsultationOpen(true);
                },
                onClose: ()=>setPatientHistoryOpen(false)
            }, void 0, false, {
                fileName: "[project]/components/dashboard-page.tsx",
                lineNumber: 3359,
                columnNumber: 9
            }, this),
            showPatientRegistrationModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PatientRegistrationModal, {
                isOpen: showPatientRegistrationModal,
                onClose: ()=>setShowPatientRegistrationModal(false),
                onPatientRegistered: handlePatientRegistered,
                hideSearchPanel: ("TURBOPACK compile-time value", "undefined") !== "undefined" && window.innerWidth < 768
            }, void 0, false, {
                fileName: "[project]/components/dashboard-page.tsx",
                lineNumber: 3387,
                columnNumber: 9
            }, this),
            showVisitCreationModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(VisitCreationModal, {
                isOpen: showVisitCreationModal,
                onClose: closeVisitCreationModal,
                onVisitCreated: handleVisitCreated,
                preSelectedPatientId: registeredPatientId ?? undefined
            }, void 0, false, {
                fileName: "[project]/components/dashboard-page.tsx",
                lineNumber: 3398,
                columnNumber: 9
            }, this),
            selectedVisitForDepartment && addDepartmentModalOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AddDepartmentModal, {
                visit: selectedVisitForDepartment,
                isOpen: addDepartmentModalOpen,
                onClose: ()=>{
                    setAddDepartmentModalOpen(false);
                    setSelectedVisitForDepartment(null);
                },
                onSuccess: handleAddDepartmentSuccess
            }, void 0, false, {
                fileName: "[project]/components/dashboard-page.tsx",
                lineNumber: 3407,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ConsultationPreviewSheet, {
                open: previewConsultationOpen,
                onOpenChange: (open)=>{
                    setPreviewConsultationOpen(open);
                    if (!open) {
                        setPreviewConsultationContext(null);
                    }
                },
                answerId: previewConsultationContext?.answerId || null,
                departmentName: previewConsultationContext?.departmentName,
                patientName: previewConsultationContext?.patientName,
                visitId: previewConsultationContext?.visitId,
                visitDepartmentId: previewConsultationContext?.visitDepartmentId,
                visitDepartment: previewConsultationContext?.visitDepartment || null,
                previewStartedAt: previewConsultationContext?.previewStartedAt || null
            }, void 0, false, {
                fileName: "[project]/components/dashboard-page.tsx",
                lineNumber: 3418,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(BillingPreviewSheet, {
                open: previewOpen,
                onOpenChange: (open)=>{
                    setPreviewOpen(open);
                    if (!open) {
                        setPreviewVisitBilling(null);
                        setPreviewDepartmentId(null);
                        setPreviewVisit(null);
                        setPreviewStartedAt(null);
                    }
                },
                visit: previewVisit,
                billingData: null,
                visitBilling: previewVisitBilling,
                selectedDepartmentId: previewDepartmentId,
                onDepartmentSelect: setPreviewDepartmentId,
                previewStartedAt: previewStartedAt,
                onPrintInvoice: handleDownloadInvoice,
                onDownloadInvoice: handleDownloadInvoice,
                canViewMore: hasFinanceRole,
                printingInvoice: Boolean(downloadingInvoiceId),
                onViewMore: ()=>{
                    if (previewVisit) {
                        router.push(`/billing?visitId=${previewVisit.id}`);
                    }
                }
            }, void 0, false, {
                fileName: "[project]/components/dashboard-page.tsx",
                lineNumber: 3434,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$confirm$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ConfirmDialog"], {
                open: Boolean(dischargeConfirmVisit),
                onOpenChange: (open)=>{
                    if (!open) setDischargeConfirmVisit(null);
                },
                title: "Discharge this patient?",
                description: "Discharging will set the visit status to COMPLETED.",
                confirmLabel: "Discharge",
                busy: discharging,
                onConfirm: ()=>{
                    if (!dischargeConfirmVisit || discharging) return;
                    void handleDischargeVisit(dischargeConfirmVisit);
                }
            }, void 0, false, {
                fileName: "[project]/components/dashboard-page.tsx",
                lineNumber: 3462,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$confirm$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ConfirmDialog"], {
                open: !!departmentToUncancel,
                onOpenChange: (open)=>!open && setDepartmentToUncancel(null),
                title: "Re-enable Department",
                description: departmentToUncancel ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: [
                        "Are you sure you want to re-enable",
                        " ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                            className: "text-foreground",
                            children: departmentToUncancel.dept?.department?.name || "this department"
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard-page.tsx",
                            lineNumber: 3485,
                            columnNumber: 15
                        }, void 0),
                        " ",
                        "for patient",
                        " ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                            className: "text-foreground",
                            children: [
                                departmentToUncancel.visit.patient.firstName,
                                " ",
                                departmentToUncancel.visit.patient.lastName
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/dashboard-page.tsx",
                            lineNumber: 3489,
                            columnNumber: 15
                        }, void 0),
                        "? This department will be restored to active status on this visit."
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/dashboard-page.tsx",
                    lineNumber: 3483,
                    columnNumber: 13
                }, void 0) : null,
                confirmLabel: "Re-enable Department",
                cancelLabel: "Cancel",
                busy: uncancelingDept,
                onConfirm: ()=>{
                    void handleConfirmUncancelDepartment();
                }
            }, void 0, false, {
                fileName: "[project]/components/dashboard-page.tsx",
                lineNumber: 3477,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$confirm$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ConfirmDialog"], {
                open: !!departmentToCancel,
                onOpenChange: (open)=>!open && setDepartmentToCancel(null),
                title: "Cancel Department",
                description: departmentToCancel ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: [
                        "Are you sure you want to cancel",
                        " ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                            className: "text-foreground",
                            children: departmentToCancel.dept?.department?.name || "this department"
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard-page.tsx",
                            lineNumber: 3511,
                            columnNumber: 15
                        }, void 0),
                        " ",
                        "for patient",
                        " ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                            className: "text-foreground",
                            children: [
                                departmentToCancel.visit.patient.firstName,
                                " ",
                                departmentToCancel.visit.patient.lastName
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/dashboard-page.tsx",
                            lineNumber: 3515,
                            columnNumber: 15
                        }, void 0),
                        "? This department will be marked as cancelled."
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/dashboard-page.tsx",
                    lineNumber: 3509,
                    columnNumber: 13
                }, void 0) : null,
                confirmLabel: "Cancel Department",
                cancelLabel: "Keep Department",
                destructive: true,
                busy: cancelingDept,
                onConfirm: ()=>{
                    void handleConfirmCancelDepartment();
                }
            }, void 0, false, {
                fileName: "[project]/components/dashboard-page.tsx",
                lineNumber: 3503,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$confirm$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ConfirmDialog"], {
                open: !!visitToCancel,
                onOpenChange: (open)=>!open && setVisitToCancel(null),
                title: "Cancel Visit",
                description: visitToCancel ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: [
                        "Are you sure you want to cancel the entire visit for",
                        " ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                            className: "text-foreground",
                            children: [
                                visitToCancel.patient.firstName,
                                " ",
                                visitToCancel.patient.lastName
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/dashboard-page.tsx",
                            lineNumber: 3538,
                            columnNumber: 15
                        }, void 0),
                        "? Since no products or services have been billed, the visit and its departments will be marked as cancelled."
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/dashboard-page.tsx",
                    lineNumber: 3536,
                    columnNumber: 13
                }, void 0) : null,
                confirmLabel: "Cancel Visit",
                cancelLabel: "Keep Visit",
                destructive: true,
                busy: cancelingVisit,
                onConfirm: ()=>{
                    void handleConfirmCancelVisit();
                }
            }, void 0, false, {
                fileName: "[project]/components/dashboard-page.tsx",
                lineNumber: 3530,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ProfileSelectDialog, {
                open: profileDialogOpen,
                onClose: ()=>{
                    if (!profileDialogLoading) {
                        setProfileDialogOpen(false);
                        setProfileDialogVisit(null);
                        setProfileDialogProfiles([]);
                    }
                },
                onSelect: handleProfileSelected,
                patientName: profileDialogVisit ? `${profileDialogVisit.patient.firstName} ${profileDialogVisit.patient.lastName}` : "",
                profiles: profileDialogProfiles,
                loading: profileDialogLoading
            }, void 0, false, {
                fileName: "[project]/components/dashboard-page.tsx",
                lineNumber: 3553,
                columnNumber: 7
            }, this),
            settingsVisit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(VisitSettingsPanel, {
                open: settingsPanelOpen,
                onOpenChange: (open)=>{
                    setSettingsPanelOpen(open);
                    if (!open) setSettingsVisit(null);
                },
                visit: settingsVisit,
                onVisitUpdated: ()=>{
                    void refetchVisits();
                }
            }, void 0, false, {
                fileName: "[project]/components/dashboard-page.tsx",
                lineNumber: 3569,
                columnNumber: 9
            }, this),
            editPatientModalOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PatientEditModal, {
                isOpen: editPatientModalOpen,
                onClose: ()=>{
                    setEditPatientModalOpen(false);
                    setSelectedPatientForEdit(null);
                },
                patient: selectedPatientForEdit,
                onPatientUpdated: (updatedPatient)=>{
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`Patient updated: ${updatedPatient.firstName} ${updatedPatient.lastName}`);
                    setEditPatientModalOpen(false);
                    setSelectedPatientForEdit(null);
                    void refetchVisits();
                    if (searchAllHistorical || statusFilter === "COMPLETED") {
                        void fetchHistoricalVisits();
                    }
                }
            }, void 0, false, {
                fileName: "[project]/components/dashboard-page.tsx",
                lineNumber: 3583,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/dashboard-page.tsx",
        lineNumber: 1879,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2d$page$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/dashboard-page.tsx [app-ssr] (ecmascript)");
"use client";
;
;
function Home() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2d$page$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 5,
        columnNumber: 10
    }, this);
}
}),
];

//# sourceMappingURL=_10c61c80._.js.map