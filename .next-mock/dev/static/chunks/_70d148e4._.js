(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/ui/label.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Label",
    ()=>Label
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-label/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
'use client';
;
;
;
function Label({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "label",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/label.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_c = Label;
;
var _c;
__turbopack_context__.k.register(_c, "Label");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/add-action-consumable-modal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AddActionConsumableModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/select.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/label.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pill$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pill$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pill.js [app-client] (ecmascript) <export default as Pill>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/filter.js [app-client] (ecmascript) <export default as Filter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$products$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hooks/products/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$products$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/products/hooks.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$insurance$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/insurance-utils.ts [app-client] (ecmascript)");
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
function AddActionConsumableModal({ isOpen, onClose, departments, currentDepartmentId, visitDepartmentId, viewMode, onAdd, existingProductReferenceIds = [], isSubmitting = false, linkedInsurances = [], processors = [] }) {
    _s();
    const filterOptions = [
        'ALL',
        'DRUG',
        'MEDICAL_ACT',
        'BIOLOGICAL_ACT',
        'CONSUMABLE_DEVICE'
    ];
    const [productType, setProductType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('ALL');
    const [showFilterOptions, setShowFilterOptions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [suggestions, setSuggestions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loadingMore, setLoadingMore] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [hoveredItemId, setHoveredItemId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedItem, setSelectedItem] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [quantity, setQuantity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('1');
    const [selectedDepartmentId, setSelectedDepartmentId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(currentDepartmentId || '');
    const [selectedProcessorId, setSelectedProcessorId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const isFetchingMoreRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const existingProductIdSet = new Set((existingProductReferenceIds || []).map(String));
    const selectedAlreadyAdded = selectedItem ? existingProductIdSet.has(selectedItem.id) : false;
    // Resolve active visit department id for backend product filtering
    const activeVisitDepartmentId = departments.find((d)=>d.id === selectedDepartmentId)?.visitDepartmentId || visitDepartmentId;
    // Helper to get insurance-aware pricing
    const resolveItemPricing = (item)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$insurance$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getInsuranceAwarePricing"])(item, linkedInsurances);
    };
    const { products: searchedProducts, loading, hasMore, loadMore } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$products$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductSearch"])(debouncedSearchQuery, {
        type: productType,
        size: 10,
        visitDepartmentId: activeVisitDepartmentId
    });
    // Keep department selection in sync with the view's current department
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AddActionConsumableModal.useEffect": ()=>{
            if (currentDepartmentId && currentDepartmentId !== selectedDepartmentId) {
                setSelectedDepartmentId(currentDepartmentId);
            }
        }
    }["AddActionConsumableModal.useEffect"], [
        currentDepartmentId,
        selectedDepartmentId
    ]);
    // Auto-select processor when there's exactly one, clear selection when processors change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AddActionConsumableModal.useEffect": ()=>{
            if (processors.length === 1) {
                setSelectedProcessorId(processors[0].id);
            } else if (processors.length === 0) {
                setSelectedProcessorId('');
            } else {
                setSelectedProcessorId('');
            }
        }
    }["AddActionConsumableModal.useEffect"], [
        processors
    ]);
    // Debounce the search input before querying the shared products hook.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AddActionConsumableModal.useEffect": ()=>{
            const timer = setTimeout({
                "AddActionConsumableModal.useEffect.timer": ()=>{
                    setDebouncedSearchQuery(searchQuery.trim().length >= 2 ? searchQuery.trim() : '');
                }
            }["AddActionConsumableModal.useEffect.timer"], 300);
            return ({
                "AddActionConsumableModal.useEffect": ()=>clearTimeout(timer)
            })["AddActionConsumableModal.useEffect"];
        }
    }["AddActionConsumableModal.useEffect"], [
        searchQuery
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AddActionConsumableModal.useEffect": ()=>{
            if (!debouncedSearchQuery) {
                setSuggestions({
                    "AddActionConsumableModal.useEffect": (prev)=>prev && prev.length ? [] : prev
                }["AddActionConsumableModal.useEffect"]);
                return;
            }
            const results = (searchedProducts || []).map({
                "AddActionConsumableModal.useEffect.results": (item)=>({
                        id: String(item.id),
                        name: item.name,
                        privatePrice: Number(item.privateRhicPrice ?? item.clinicPrice ?? 0),
                        isQuantifiable: item.quantifiable !== false,
                        type: item.type,
                        description: item.description,
                        ...item
                    })
            }["AddActionConsumableModal.useEffect.results"]);
            // Only update suggestions if results changed (avoid repeated identical setState)
            setSuggestions({
                "AddActionConsumableModal.useEffect": (prev)=>{
                    const prevIds = (prev || []).map({
                        "AddActionConsumableModal.useEffect.prevIds": (p)=>p.id
                    }["AddActionConsumableModal.useEffect.prevIds"]).join(',');
                    const nextIds = (results || []).map({
                        "AddActionConsumableModal.useEffect.nextIds": (r)=>r.id
                    }["AddActionConsumableModal.useEffect.nextIds"]).join(',');
                    if (prevIds === nextIds) return prev;
                    return results;
                }
            }["AddActionConsumableModal.useEffect"]);
        }
    }["AddActionConsumableModal.useEffect"], [
        debouncedSearchQuery,
        searchedProducts,
        productType
    ]);
    const handleSelectItem = (item)=>{
        setSelectedItem(item);
    };
    const handleAddItem = ()=>{
        if (!selectedItem || !selectedDepartmentId) return;
        const qty = selectedItem.isQuantifiable === false ? 1 : parseInt(quantity, 10) || 1;
        const itemType = selectedItem.type === 'CONSUMABLE_DEVICE' ? 'consumable' : 'action';
        const processorId = selectedProcessorId || undefined;
        onAdd(itemType, selectedItem, qty, selectedDepartmentId, processorId);
        // Reset form
        setSelectedItem(null);
        setQuantity('1');
        setSearchQuery('');
        setSuggestions([]);
        setSelectedProcessorId(processors.length === 1 ? processors[0].id : '');
        onClose();
    };
    const handleClose = ()=>{
        setSelectedItem(null);
        setQuantity('1');
        setSearchQuery('');
        setSuggestions([]);
        setShowFilterOptions(false);
        setSelectedProcessorId(processors.length === 1 ? processors[0].id : '');
        onClose();
    };
    const handleSuggestionsScroll = async (e)=>{
        const element = e.currentTarget;
        const nearBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - 24;
        if (!nearBottom) return;
        if (!hasMore) return;
        if (loading || loadingMore || isFetchingMoreRef.current) return;
        try {
            isFetchingMoreRef.current = true;
            setLoadingMore(true);
            await loadMore();
        } finally{
            setLoadingMore(false);
            isFetchingMoreRef.current = false;
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
        open: isOpen,
        onOpenChange: (open)=>{
            if (!open) handleClose();
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
            showCloseButton: false,
            className: "sm:max-w-[600px] backdrop-blur-2xl bg-card/95 dark:bg-card/95 text-card-foreground rounded-3xl border border-border/80 shadow-2xl",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                    className: "text-center space-y-2",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                        className: "text-center",
                        children: "Add Product"
                    }, void 0, false, {
                        fileName: "[project]/components/add-action-consumable-modal.tsx",
                        lineNumber: 226,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/add-action-consumable-modal.tsx",
                    lineNumber: 225,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        !selectedItem && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative bg-white dark:bg-gray-900 rounded-2xl border border-border shadow-md overflow-hidden",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "px-4 py-3 flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative flex-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                    className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                    lineNumber: 236,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                    type: "text",
                                                    placeholder: "Search...",
                                                    value: searchQuery,
                                                    onChange: (e)=>setSearchQuery(e.target.value),
                                                    onFocus: ()=>setShowFilterOptions(false),
                                                    className: "pl-10 pr-10 h-12 text-base bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg focus-visible:ring-0 focus-visible:ring-offset-0"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                    lineNumber: 237,
                                                    columnNumber: 17
                                                }, this),
                                                searchQuery && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>setSearchQuery(''),
                                                    className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                        className: "w-5 h-5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                        lineNumber: 251,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                    lineNumber: 246,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/add-action-consumable-modal.tsx",
                                            lineNumber: 235,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            type: "button",
                                            variant: productType === 'ALL' ? 'outline' : 'default',
                                            size: "icon",
                                            className: "h-12 w-12",
                                            onClick: ()=>setShowFilterOptions((prev)=>!prev),
                                            "aria-label": "Toggle filters",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__["Filter"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                lineNumber: 264,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/add-action-consumable-modal.tsx",
                                            lineNumber: 256,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/add-action-consumable-modal.tsx",
                                    lineNumber: 234,
                                    columnNumber: 13
                                }, this),
                                (showFilterOptions || productType !== 'ALL') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "px-4 pb-3 space-y-2 border-t border-border/30",
                                    children: [
                                        showFilterOptions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap gap-2 pt-2",
                                            children: filterOptions.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                    type: "button",
                                                    size: "sm",
                                                    variant: productType === option ? 'default' : 'outline',
                                                    className: "h-7 px-2 text-xs",
                                                    onClick: ()=>{
                                                        setProductType(option);
                                                        if (option !== 'ALL') {
                                                            setShowFilterOptions(false);
                                                        }
                                                    },
                                                    children: option
                                                }, option, false, {
                                                    fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                    lineNumber: 273,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/components/add-action-consumable-modal.tsx",
                                            lineNumber: 271,
                                            columnNumber: 19
                                        }, this),
                                        productType !== 'ALL' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "pt-1",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>setProductType('ALL'),
                                                className: "inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-2 py-1 text-xs text-primary hover:bg-primary/20",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__["Filter"], {
                                                        className: "h-3 w-3"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                        lineNumber: 299,
                                                        columnNumber: 23
                                                    }, this),
                                                    productType,
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                        className: "h-3 w-3"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                        lineNumber: 301,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                lineNumber: 294,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/add-action-consumable-modal.tsx",
                                            lineNumber: 293,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/add-action-consumable-modal.tsx",
                                    lineNumber: 269,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/add-action-consumable-modal.tsx",
                            lineNumber: 232,
                            columnNumber: 11
                        }, this),
                        !selectedItem && (loading || suggestions.length > 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-border shadow-sm p-4 min-h-[100px]",
                            children: [
                                loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-center gap-0.5 text-sm text-muted-foreground",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex gap-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "w-2 h-2 rounded-full bg-primary animate-bounce",
                                                style: {
                                                    animationDelay: "0ms"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                lineNumber: 317,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "w-2 h-2 rounded-full bg-primary animate-bounce",
                                                style: {
                                                    animationDelay: "150ms"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                lineNumber: 318,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "w-2 h-2 rounded-full bg-primary animate-bounce",
                                                style: {
                                                    animationDelay: "300ms"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                lineNumber: 319,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "w-2 h-2 rounded-full bg-primary animate-bounce",
                                                style: {
                                                    animationDelay: "450ms"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                lineNumber: 320,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/add-action-consumable-modal.tsx",
                                        lineNumber: 316,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/add-action-consumable-modal.tsx",
                                    lineNumber: 315,
                                    columnNumber: 17
                                }, this),
                                !loading && suggestions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2 max-h-[320px] overflow-y-auto pr-1",
                                    onScroll: handleSuggestionsScroll,
                                    children: [
                                        suggestions.map((item)=>{
                                            const alreadyAdded = existingProductIdSet.has(item.id);
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                onClick: ()=>handleSelectItem(item),
                                                onMouseEnter: ()=>setHoveredItemId(item.id),
                                                onMouseLeave: ()=>setHoveredItemId((prev)=>prev === item.id ? null : prev),
                                                className: `p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 bg-background border-border/40 hover:border-primary/50 hover:shadow-sm hover:scale-[1.01] ${alreadyAdded ? 'opacity-90 border-amber-300 bg-amber-50/50' : ''}`,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "font-medium",
                                                                    children: item.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                                    lineNumber: 344,
                                                                    columnNumber: 29
                                                                }, this),
                                                                (()=>{
                                                                    const pricing = resolveItemPricing(item);
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "text-sm mt-1 space-y-1",
                                                                        children: pricing.coverageDetails.length > 0 ? pricing.coverageDetails.map((coverage, idx)=>{
                                                                            const isZeroPaying = Number(coverage.cost) <= 0 || coverage.covered === false;
                                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex items-center gap-2",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: `font-semibold ${isZeroPaying ? "text-muted-foreground line-through" : "text-primary"}`,
                                                                                        children: [
                                                                                            Number(coverage.cost).toLocaleString(),
                                                                                            " RWF"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                                                        lineNumber: 354,
                                                                                        columnNumber: 43
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "text-xs text-muted-foreground",
                                                                                        children: coverage.insuranceProvider.acronym || coverage.insuranceProvider.insuranceName
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                                                        lineNumber: 357,
                                                                                        columnNumber: 43
                                                                                    }, this),
                                                                                    isZeroPaying && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "text-[11px] bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-1.5 py-0.5 rounded font-medium",
                                                                                        children: Number(coverage.cost) === 0 ? "Pays 0 RWF (Not Covered)" : "Not Covered"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                                                        lineNumber: 361,
                                                                                        columnNumber: 45
                                                                                    }, this)
                                                                                ]
                                                                            }, idx, true, {
                                                                                fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                                                lineNumber: 353,
                                                                                columnNumber: 41
                                                                            }, this);
                                                                        }) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-muted-foreground flex items-center gap-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatRWF"])(pricing.price)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                                                    lineNumber: 370,
                                                                                    columnNumber: 39
                                                                                }, this),
                                                                                linkedInsurances.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[11px] bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded font-medium",
                                                                                    children: "Private (No Insurance Coverage)"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                                                    lineNumber: 372,
                                                                                    columnNumber: 41
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                                            lineNumber: 369,
                                                                            columnNumber: 37
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                                        lineNumber: 348,
                                                                        columnNumber: 33
                                                                    }, this);
                                                                })(),
                                                                hoveredItemId === item.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mt-2 rounded-md border border-border/50 bg-muted/30 p-2 text-xs text-muted-foreground",
                                                                    children: item.description?.trim() || 'No description available'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                                    lineNumber: 382,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                            lineNumber: 343,
                                                            columnNumber: 27
                                                        }, this),
                                                        alreadyAdded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "rounded-full bg-amber-100 text-amber-800 px-2 py-1 text-[12px] font-semibold uppercase tracking-[0.08em]",
                                                            children: "Already added"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                            lineNumber: 388,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                    lineNumber: 342,
                                                    columnNumber: 25
                                                }, this)
                                            }, item.id, false, {
                                                fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                lineNumber: 331,
                                                columnNumber: 23
                                            }, this);
                                        }),
                                        loadingMore && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-center text-xs text-muted-foreground py-1",
                                            children: "Loading more..."
                                        }, void 0, false, {
                                            fileName: "[project]/components/add-action-consumable-modal.tsx",
                                            lineNumber: 396,
                                            columnNumber: 35
                                        }, this),
                                        !loadingMore && hasMore && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-center text-xs text-muted-foreground py-1",
                                            children: "Scroll to load more"
                                        }, void 0, false, {
                                            fileName: "[project]/components/add-action-consumable-modal.tsx",
                                            lineNumber: 397,
                                            columnNumber: 47
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/add-action-consumable-modal.tsx",
                                    lineNumber: 327,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/add-action-consumable-modal.tsx",
                            lineNumber: 312,
                            columnNumber: 13
                        }, this),
                        selectedItem && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-border shadow-sm p-4 space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-primary/5 border border-primary/20 rounded-xl p-3 space-y-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2 mb-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pill$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pill$3e$__["Pill"], {
                                                            className: "w-4 h-4 text-primary"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                            lineNumber: 410,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sm font-medium",
                                                            children: "Selected Product"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                            lineNumber: 411,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                    lineNumber: 409,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2 mb-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-sm text-muted-foreground",
                                                            children: selectedItem.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                            lineNumber: 414,
                                                            columnNumber: 21
                                                        }, this),
                                                        processors.length > 1 && selectedProcessorId && (()=>{
                                                            const proc = processors.find((p)=>p.id === selectedProcessorId);
                                                            if (!proc) return null;
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 rounded-full",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "w-1.5 h-1.5 rounded-full bg-emerald-500"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                                        lineNumber: 420,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    proc.firstName,
                                                                    " ",
                                                                    proc.lastName || ''
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                                lineNumber: 419,
                                                                columnNumber: 25
                                                            }, this);
                                                        })()
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                    lineNumber: 413,
                                                    columnNumber: 19
                                                }, this),
                                                (()=>{
                                                    const pricing = resolveItemPricing(selectedItem);
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-1.5",
                                                        children: [
                                                            pricing.coverageDetails.length > 0 ? pricing.coverageDetails.map((coverage, idx)=>{
                                                                const isZeroPaying = Number(coverage.cost) <= 0 || coverage.covered === false;
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex justify-between text-xs",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-muted-foreground",
                                                                                    children: [
                                                                                        "Unit Price (",
                                                                                        coverage.insuranceProvider.acronym || coverage.insuranceProvider.insuranceName,
                                                                                        "):"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                                                    lineNumber: 436,
                                                                                    columnNumber: 35
                                                                                }, this),
                                                                                isZeroPaying && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[11px] bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-1.5 py-0.5 rounded font-medium",
                                                                                    children: Number(coverage.cost) === 0 ? "Pays 0 RWF (Not Covered)" : "Not Covered"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                                                    lineNumber: 440,
                                                                                    columnNumber: 37
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                                            lineNumber: 435,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: `font-semibold ${isZeroPaying ? "text-muted-foreground line-through" : "text-foreground"}`,
                                                                            children: [
                                                                                Number(coverage.cost).toLocaleString(),
                                                                                " RWF"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                                            lineNumber: 445,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    ]
                                                                }, idx, true, {
                                                                    fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                                    lineNumber: 434,
                                                                    columnNumber: 31
                                                                }, this);
                                                            }) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex justify-between text-xs",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-muted-foreground",
                                                                                children: "Private Price:"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                                                lineNumber: 454,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            linkedInsurances.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-[11px] bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded font-medium",
                                                                                children: "Not Covered by Insurance"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                                                lineNumber: 456,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                                        lineNumber: 453,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "font-semibold",
                                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatRWF"])(pricing.price)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                                        lineNumber: 461,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                                lineNumber: 452,
                                                                columnNumber: 27
                                                            }, this),
                                                            pricing.allCoveragesZeroOrNotCovered && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "mt-2 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30 p-2 text-xs text-amber-900 dark:text-amber-200",
                                                                children: [
                                                                    "⚠️ This product pays 0 RWF / is not covered by the patient's insurance. It will bill under Private pricing (",
                                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatRWF"])(Number(selectedItem.clinicPrice ?? selectedItem.privateRhicPrice ?? 0)),
                                                                    ")."
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                                lineNumber: 465,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                        lineNumber: 429,
                                                        columnNumber: 23
                                                    }, this);
                                                })()
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/add-action-consumable-modal.tsx",
                                            lineNumber: 408,
                                            columnNumber: 17
                                        }, this),
                                        selectedAlreadyAdded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900",
                                            children: "This product is already added to the consultation. Adding it again will update the quantity."
                                        }, void 0, false, {
                                            fileName: "[project]/components/add-action-consumable-modal.tsx",
                                            lineNumber: 474,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/add-action-consumable-modal.tsx",
                                    lineNumber: 407,
                                    columnNumber: 15
                                }, this),
                                selectedItem.isQuantifiable !== false && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                            className: "text-sm font-medium",
                                            children: "Quantity"
                                        }, void 0, false, {
                                            fileName: "[project]/components/add-action-consumable-modal.tsx",
                                            lineNumber: 483,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                            type: "number",
                                            min: "1",
                                            value: quantity,
                                            onChange: (e)=>setQuantity(e.target.value),
                                            placeholder: "Enter quantity",
                                            className: "h-10"
                                        }, void 0, false, {
                                            fileName: "[project]/components/add-action-consumable-modal.tsx",
                                            lineNumber: 484,
                                            columnNumber: 19
                                        }, this),
                                        (()=>{
                                            const pricing = resolveItemPricing(selectedItem);
                                            const qtyNum = parseInt(quantity, 10) || 1;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between text-xs text-muted-foreground",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Total:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                        lineNumber: 497,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-semibold text-foreground",
                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatRWF"])(pricing.price * qtyNum)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                        lineNumber: 498,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                lineNumber: 496,
                                                columnNumber: 23
                                            }, this);
                                        })()
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/add-action-consumable-modal.tsx",
                                    lineNumber: 482,
                                    columnNumber: 17
                                }, this),
                                processors.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                            className: "text-sm font-medium",
                                            children: "Processor"
                                        }, void 0, false, {
                                            fileName: "[project]/components/add-action-consumable-modal.tsx",
                                            lineNumber: 510,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                                            value: selectedProcessorId,
                                            onValueChange: setSelectedProcessorId,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                    className: "h-10",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {
                                                        placeholder: "Choose processor..."
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                        lineNumber: 516,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                    lineNumber: 515,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                    children: processors.map((proc)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                            value: proc.id,
                                                            children: [
                                                                proc.firstName,
                                                                " ",
                                                                proc.lastName || ''
                                                            ]
                                                        }, proc.id, true, {
                                                            fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                            lineNumber: 520,
                                                            columnNumber: 25
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                    lineNumber: 518,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/add-action-consumable-modal.tsx",
                                            lineNumber: 511,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/add-action-consumable-modal.tsx",
                                    lineNumber: 509,
                                    columnNumber: 17
                                }, this),
                                (viewMode === 'all' || !currentDepartmentId) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                            className: "text-sm font-medium",
                                            children: "Target Department"
                                        }, void 0, false, {
                                            fileName: "[project]/components/add-action-consumable-modal.tsx",
                                            lineNumber: 532,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                                            value: selectedDepartmentId,
                                            onValueChange: setSelectedDepartmentId,
                                            disabled: Boolean(currentDepartmentId),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                    className: "h-10",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {
                                                        placeholder: "Choose department..."
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                        lineNumber: 539,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                    lineNumber: 538,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                    children: departments.map((dept)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                            value: dept.id,
                                                            children: dept.name
                                                        }, dept.id, false, {
                                                            fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                            lineNumber: 543,
                                                            columnNumber: 25
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/components/add-action-consumable-modal.tsx",
                                                    lineNumber: 541,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/add-action-consumable-modal.tsx",
                                            lineNumber: 533,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/add-action-consumable-modal.tsx",
                                    lineNumber: 531,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/add-action-consumable-modal.tsx",
                            lineNumber: 405,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/add-action-consumable-modal.tsx",
                    lineNumber: 229,
                    columnNumber: 9
                }, this),
                selectedItem && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogFooter"], {
                    className: "gap-2 mt-4 justify-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            onClick: handleClose,
                            className: "rounded-full",
                            children: "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/components/add-action-consumable-modal.tsx",
                            lineNumber: 557,
                            columnNumber: 11
                        }, this),
                        "              ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            onClick: handleAddItem,
                            disabled: !selectedItem || !selectedDepartmentId || loading || isSubmitting,
                            className: "bg-primary hover:bg-primary/90 text-primary-foreground rounded-full",
                            children: "Add Product"
                        }, void 0, false, {
                            fileName: "[project]/components/add-action-consumable-modal.tsx",
                            lineNumber: 559,
                            columnNumber: 34
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/add-action-consumable-modal.tsx",
                    lineNumber: 556,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/add-action-consumable-modal.tsx",
            lineNumber: 224,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/add-action-consumable-modal.tsx",
        lineNumber: 221,
        columnNumber: 5
    }, this);
}
_s(AddActionConsumableModal, "BFQGQdE4eVdkvQJvtrveUkEBwx0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$products$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductSearch"]
    ];
});
_c = AddActionConsumableModal;
var _c;
__turbopack_context__.k.register(_c, "AddActionConsumableModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/visit-department-product-utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildVisitDepartmentProductOptions",
    ()=>buildVisitDepartmentProductOptions,
    "collectExistingProductReferenceIds",
    ()=>collectExistingProductReferenceIds,
    "resolveCatalogDepartmentIdForService",
    ()=>resolveCatalogDepartmentIdForService,
    "resolveVisitDepartmentIdForService",
    ()=>resolveVisitDepartmentIdForService
]);
function buildVisitDepartmentProductOptions(visitDepartments = []) {
    return visitDepartments.map((dept)=>({
            id: String(dept.department?.id || dept.id),
            name: dept.department?.name || 'General',
            visitDepartmentId: String(dept.id)
        }));
}
function resolveCatalogDepartmentIdForService(visitDepartments = [], serviceName) {
    if (!serviceName) return undefined;
    const match = visitDepartments.find((dept)=>(dept.department?.name || 'General') === serviceName);
    return match?.department?.id ? String(match.department.id) : undefined;
}
function resolveVisitDepartmentIdForService(visitDepartments = [], serviceName) {
    if (!serviceName) return undefined;
    const match = visitDepartments.find((dept)=>(dept.department?.name || 'General') === serviceName);
    return match?.id ? String(match.id) : undefined;
}
function collectExistingProductReferenceIds(visitDepartments = []) {
    const ids = new Set();
    const walk = (departments)=>{
        for (const dept of departments){
            for (const line of dept.products || []){
                if (line.product?.id) ids.add(String(line.product.id));
            }
            walk(dept.childVisitDepartments || []);
        }
    };
    walk(visitDepartments);
    return Array.from(ids);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/visit/add-visit-department-product-modal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AddVisitDepartmentProductModal",
    ()=>AddVisitDepartmentProductModal,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$add$2d$action$2d$consumable$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/add-action-consumable-modal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visit$2d$department$2d$product$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/visit-department-product-utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function AddVisitDepartmentProductModal({ open, onClose, visitDepartments = [], visitDepartmentId, activeServiceName, currentCatalogDepartmentId, viewMode = 'service', onAdd, existingProductReferenceIds, isSubmitting = false, linkedInsurances = [] }) {
    _s();
    const departmentOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AddVisitDepartmentProductModal.useMemo[departmentOptions]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visit$2d$department$2d$product$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildVisitDepartmentProductOptions"])(visitDepartments)
    }["AddVisitDepartmentProductModal.useMemo[departmentOptions]"], [
        visitDepartments
    ]);
    const resolvedCurrentDepartmentId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AddVisitDepartmentProductModal.useMemo[resolvedCurrentDepartmentId]": ()=>{
            if (currentCatalogDepartmentId) return currentCatalogDepartmentId;
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visit$2d$department$2d$product$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveCatalogDepartmentIdForService"])(visitDepartments, activeServiceName);
        }
    }["AddVisitDepartmentProductModal.useMemo[resolvedCurrentDepartmentId]"], [
        currentCatalogDepartmentId,
        visitDepartments,
        activeServiceName
    ]);
    const resolvedVisitDepartmentId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AddVisitDepartmentProductModal.useMemo[resolvedVisitDepartmentId]": ()=>{
            if (visitDepartmentId) return visitDepartmentId;
            if (activeServiceName) {
                const fromService = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visit$2d$department$2d$product$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveVisitDepartmentIdForService"])(visitDepartments, activeServiceName);
                if (fromService) return fromService;
            }
            const activeDept = visitDepartments.find({
                "AddVisitDepartmentProductModal.useMemo[resolvedVisitDepartmentId].activeDept": (dept)=>String(dept.department?.id) === String(resolvedCurrentDepartmentId) || String(dept.id) === String(resolvedCurrentDepartmentId)
            }["AddVisitDepartmentProductModal.useMemo[resolvedVisitDepartmentId].activeDept"]);
            return activeDept ? String(activeDept.id) : undefined;
        }
    }["AddVisitDepartmentProductModal.useMemo[resolvedVisitDepartmentId]"], [
        visitDepartmentId,
        activeServiceName,
        visitDepartments,
        resolvedCurrentDepartmentId
    ]);
    // Resolve processors from the active visit department
    const activeProcessors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AddVisitDepartmentProductModal.useMemo[activeProcessors]": ()=>{
            const activeDept = visitDepartments.find({
                "AddVisitDepartmentProductModal.useMemo[activeProcessors].activeDept": (dept)=>String(dept.department?.id) === String(resolvedCurrentDepartmentId)
            }["AddVisitDepartmentProductModal.useMemo[activeProcessors].activeDept"]);
            return activeDept?.processors || [];
        }
    }["AddVisitDepartmentProductModal.useMemo[activeProcessors]"], [
        visitDepartments,
        resolvedCurrentDepartmentId
    ]);
    const resolvedExistingIds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AddVisitDepartmentProductModal.useMemo[resolvedExistingIds]": ()=>existingProductReferenceIds ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visit$2d$department$2d$product$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collectExistingProductReferenceIds"])(visitDepartments)
    }["AddVisitDepartmentProductModal.useMemo[resolvedExistingIds]"], [
        existingProductReferenceIds,
        visitDepartments
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$add$2d$action$2d$consumable$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        isOpen: open,
        onClose: onClose,
        departments: departmentOptions.map(({ id, name, visitDepartmentId })=>({
                id,
                name,
                visitDepartmentId
            })),
        currentDepartmentId: resolvedCurrentDepartmentId,
        visitDepartmentId: resolvedVisitDepartmentId,
        viewMode: viewMode,
        onAdd: onAdd,
        existingProductReferenceIds: resolvedExistingIds,
        isSubmitting: isSubmitting,
        linkedInsurances: linkedInsurances,
        processors: activeProcessors
    }, void 0, false, {
        fileName: "[project]/components/visit/add-visit-department-product-modal.tsx",
        lineNumber: 114,
        columnNumber: 5
    }, this);
}
_s(AddVisitDepartmentProductModal, "/5qPd6f3pkU/zsqg4yUIo29V+ek=");
_c = AddVisitDepartmentProductModal;
const __TURBOPACK__default__export__ = AddVisitDepartmentProductModal;
var _c;
__turbopack_context__.k.register(_c, "AddVisitDepartmentProductModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/visit/add-visit-department-product-modal.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/components/visit/add-visit-department-product-modal.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=_70d148e4._.js.map