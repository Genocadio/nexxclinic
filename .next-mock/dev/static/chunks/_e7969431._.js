(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/ui/scroll-area.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ScrollArea",
    ()=>ScrollArea,
    "ScrollBar",
    ()=>ScrollBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$scroll$2d$area$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-scroll-area/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
'use client';
;
;
;
function ScrollArea({ className, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$scroll$2d$area$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "scroll-area",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('relative overflow-hidden', className),
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$scroll$2d$area$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Viewport"], {
                "data-slot": "scroll-area-viewport",
                className: "focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1",
                children: children
            }, void 0, false, {
                fileName: "[project]/components/ui/scroll-area.tsx",
                lineNumber: 19,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ScrollBar, {}, void 0, false, {
                fileName: "[project]/components/ui/scroll-area.tsx",
                lineNumber: 25,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$scroll$2d$area$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Corner"], {}, void 0, false, {
                fileName: "[project]/components/ui/scroll-area.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/scroll-area.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
_c = ScrollArea;
function ScrollBar({ className, orientation = 'vertical', ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$scroll$2d$area$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollAreaScrollbar"], {
        "data-slot": "scroll-area-scrollbar",
        orientation: orientation,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex touch-none p-px transition-colors select-none', orientation === 'vertical' && 'h-full w-2.5 border-l border-l-transparent', orientation === 'horizontal' && 'h-2.5 flex-col border-t border-t-transparent', className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$scroll$2d$area$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollAreaThumb"], {
            "data-slot": "scroll-area-thumb",
            className: "bg-border relative flex-1 rounded-full"
        }, void 0, false, {
            fileName: "[project]/components/ui/scroll-area.tsx",
            lineNumber: 50,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/scroll-area.tsx",
        lineNumber: 37,
        columnNumber: 5
    }, this);
}
_c1 = ScrollBar;
;
var _c, _c1;
__turbopack_context__.k.register(_c, "ScrollArea");
__turbopack_context__.k.register(_c1, "ScrollBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/dropdown-menu.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DropdownMenu",
    ()=>DropdownMenu,
    "DropdownMenuCheckboxItem",
    ()=>DropdownMenuCheckboxItem,
    "DropdownMenuContent",
    ()=>DropdownMenuContent,
    "DropdownMenuGroup",
    ()=>DropdownMenuGroup,
    "DropdownMenuItem",
    ()=>DropdownMenuItem,
    "DropdownMenuLabel",
    ()=>DropdownMenuLabel,
    "DropdownMenuPortal",
    ()=>DropdownMenuPortal,
    "DropdownMenuRadioGroup",
    ()=>DropdownMenuRadioGroup,
    "DropdownMenuRadioItem",
    ()=>DropdownMenuRadioItem,
    "DropdownMenuSeparator",
    ()=>DropdownMenuSeparator,
    "DropdownMenuShortcut",
    ()=>DropdownMenuShortcut,
    "DropdownMenuSub",
    ()=>DropdownMenuSub,
    "DropdownMenuSubContent",
    ()=>DropdownMenuSubContent,
    "DropdownMenuSubTrigger",
    ()=>DropdownMenuSubTrigger,
    "DropdownMenuTrigger",
    ()=>DropdownMenuTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-dropdown-menu/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as CheckIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRightIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRightIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle.js [app-client] (ecmascript) <export default as CircleIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
'use client';
;
;
;
;
function DropdownMenu({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "dropdown-menu",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dropdown-menu.tsx",
        lineNumber: 12,
        columnNumber: 10
    }, this);
}
_c = DropdownMenu;
function DropdownMenuPortal({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
        "data-slot": "dropdown-menu-portal",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dropdown-menu.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, this);
}
_c1 = DropdownMenuPortal;
function DropdownMenuTrigger({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
        "data-slot": "dropdown-menu-trigger",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dropdown-menu.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
_c2 = DropdownMenuTrigger;
function DropdownMenuContent({ className, sideOffset = 4, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
            "data-slot": "dropdown-menu-content",
            sideOffset: sideOffset,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-[150] max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md', className),
            ...props
        }, void 0, false, {
            fileName: "[project]/components/ui/dropdown-menu.tsx",
            lineNumber: 41,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/dropdown-menu.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, this);
}
_c3 = DropdownMenuContent;
function DropdownMenuGroup({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"], {
        "data-slot": "dropdown-menu-group",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dropdown-menu.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
_c4 = DropdownMenuGroup;
function DropdownMenuItem({ className, inset, variant = 'default', ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"], {
        "data-slot": "dropdown-menu-item",
        "data-inset": inset,
        "data-variant": variant,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dropdown-menu.tsx",
        lineNumber: 72,
        columnNumber: 5
    }, this);
}
_c5 = DropdownMenuItem;
function DropdownMenuCheckboxItem({ className, children, checked, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CheckboxItem"], {
        "data-slot": "dropdown-menu-checkbox-item",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className),
        checked: checked,
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemIndicator"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckIcon$3e$__["CheckIcon"], {
                        className: "size-4"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/dropdown-menu.tsx",
                        lineNumber: 103,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/ui/dropdown-menu.tsx",
                    lineNumber: 102,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ui/dropdown-menu.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/dropdown-menu.tsx",
        lineNumber: 92,
        columnNumber: 5
    }, this);
}
_c6 = DropdownMenuCheckboxItem;
function DropdownMenuRadioGroup({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RadioGroup"], {
        "data-slot": "dropdown-menu-radio-group",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dropdown-menu.tsx",
        lineNumber: 115,
        columnNumber: 5
    }, this);
}
_c7 = DropdownMenuRadioGroup;
function DropdownMenuRadioItem({ className, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RadioItem"], {
        "data-slot": "dropdown-menu-radio-item",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className),
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemIndicator"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleIcon$3e$__["CircleIcon"], {
                        className: "size-2 fill-current"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/dropdown-menu.tsx",
                        lineNumber: 138,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/ui/dropdown-menu.tsx",
                    lineNumber: 137,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ui/dropdown-menu.tsx",
                lineNumber: 136,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/dropdown-menu.tsx",
        lineNumber: 128,
        columnNumber: 5
    }, this);
}
_c8 = DropdownMenuRadioItem;
function DropdownMenuLabel({ className, inset, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
        "data-slot": "dropdown-menu-label",
        "data-inset": inset,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('px-2 py-1.5 text-sm font-medium data-[inset]:pl-8', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dropdown-menu.tsx",
        lineNumber: 154,
        columnNumber: 5
    }, this);
}
_c9 = DropdownMenuLabel;
function DropdownMenuSeparator({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
        "data-slot": "dropdown-menu-separator",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('bg-border -mx-1 my-1 h-px', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dropdown-menu.tsx",
        lineNumber: 171,
        columnNumber: 5
    }, this);
}
_c10 = DropdownMenuSeparator;
function DropdownMenuShortcut({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        "data-slot": "dropdown-menu-shortcut",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-muted-foreground ml-auto text-xs tracking-widest', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dropdown-menu.tsx",
        lineNumber: 184,
        columnNumber: 5
    }, this);
}
_c11 = DropdownMenuShortcut;
function DropdownMenuSub({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sub"], {
        "data-slot": "dropdown-menu-sub",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dropdown-menu.tsx",
        lineNumber: 198,
        columnNumber: 10
    }, this);
}
_c12 = DropdownMenuSub;
function DropdownMenuSubTrigger({ className, inset, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SubTrigger"], {
        "data-slot": "dropdown-menu-sub-trigger",
        "data-inset": inset,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className),
        ...props,
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRightIcon$3e$__["ChevronRightIcon"], {
                className: "ml-auto size-4"
            }, void 0, false, {
                fileName: "[project]/components/ui/dropdown-menu.tsx",
                lineNumber: 220,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/dropdown-menu.tsx",
        lineNumber: 210,
        columnNumber: 5
    }, this);
}
_c13 = DropdownMenuSubTrigger;
function DropdownMenuSubContent({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SubContent"], {
        "data-slot": "dropdown-menu-sub-content",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-[150] min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dropdown-menu.tsx",
        lineNumber: 230,
        columnNumber: 5
    }, this);
}
_c14 = DropdownMenuSubContent;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12, _c13, _c14;
__turbopack_context__.k.register(_c, "DropdownMenu");
__turbopack_context__.k.register(_c1, "DropdownMenuPortal");
__turbopack_context__.k.register(_c2, "DropdownMenuTrigger");
__turbopack_context__.k.register(_c3, "DropdownMenuContent");
__turbopack_context__.k.register(_c4, "DropdownMenuGroup");
__turbopack_context__.k.register(_c5, "DropdownMenuItem");
__turbopack_context__.k.register(_c6, "DropdownMenuCheckboxItem");
__turbopack_context__.k.register(_c7, "DropdownMenuRadioGroup");
__turbopack_context__.k.register(_c8, "DropdownMenuRadioItem");
__turbopack_context__.k.register(_c9, "DropdownMenuLabel");
__turbopack_context__.k.register(_c10, "DropdownMenuSeparator");
__turbopack_context__.k.register(_c11, "DropdownMenuShortcut");
__turbopack_context__.k.register(_c12, "DropdownMenuSub");
__turbopack_context__.k.register(_c13, "DropdownMenuSubTrigger");
__turbopack_context__.k.register(_c14, "DropdownMenuSubContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/money.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Money arithmetic helpers.
 *
 * Financial values in the billing flow always carry exactly 2 decimal places
 * (HALF_UP), matching the backend's `MoneyUtils`. To avoid floating-point
 * drift, every computation is done in integer cents and only converted back to
 * a (2 dp) money number for display and for the GraphQL payloads.
 *
 * The per-line insurance split mirrors `BillingPricingCalculator` /
 * `VisitBillingService` on the backend:
 *   - lineTotal  = round2(unitPrice × quantity)
 *   - covered    = min(lineTotal, round2(lineTotal × (100 − pct) / 100))
 *   - patientPay = lineTotal − covered
 * where `pct` is the insurer's `defaultPatientSharePercentage` (the patient's
 * co-pay share). For an insured line the unit price IS the coverage cost, so
 * the coverage-cost total equals the line total.
 */ __turbopack_context__.s([
    "fromCents",
    ()=>fromCents,
    "insuranceShareCents",
    ()=>insuranceShareCents,
    "lineTotalToCents",
    ()=>lineTotalToCents,
    "roundMoney",
    ()=>roundMoney,
    "subMoney",
    ()=>subMoney,
    "sumMoney",
    ()=>sumMoney,
    "toCents",
    ()=>toCents,
    "toQuantity",
    ()=>toQuantity
]);
const CENT_FACTOR = 100;
function toCents(value) {
    if (!Number.isFinite(value)) return 0;
    const twoDp = Number(value.toFixed(2));
    return Math.round(twoDp * CENT_FACTOR);
}
function fromCents(cents) {
    return Math.round(cents) / CENT_FACTOR;
}
function roundMoney(value) {
    return fromCents(toCents(value));
}
function sumMoney(values) {
    let cents = 0;
    for (const value of values)cents += toCents(value);
    return fromCents(cents);
}
function subMoney(a, b) {
    return fromCents(toCents(a) - toCents(b));
}
function toQuantity(value) {
    if (!Number.isFinite(value) || value <= 0) return 1;
    return Math.round(value * 10000) / 10000;
}
function lineTotalToCents(unitPrice, quantity) {
    const priceCents = toCents(unitPrice);
    const qty = toQuantity(quantity);
    return Math.round(priceCents * qty);
}
function insuranceShareCents(totalCents, patientSharePct) {
    const pct = Number(patientSharePct) || 0;
    if (pct <= 0) return totalCents;
    return Math.round(totalCents * (100 - pct) / 100);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/billing-utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Billing Data Structure and Utilities
__turbopack_context__.s([
    "EXEMPTION_PRESETS",
    ()=>EXEMPTION_PRESETS,
    "applyInsuranceSelectionToItem",
    ()=>applyInsuranceSelectionToItem,
    "buildProductCoverageMaps",
    ()=>buildProductCoverageMaps,
    "calculateExemptedTotal",
    ()=>calculateExemptedTotal,
    "calculateInsuranceCoverage",
    ()=>calculateInsuranceCoverage,
    "calculateItemTotal",
    ()=>calculateItemTotal,
    "calculatePatientResponsibility",
    ()=>calculatePatientResponsibility,
    "calculatePaymentStatus",
    ()=>calculatePaymentStatus,
    "calculateRemainingBalance",
    ()=>calculateRemainingBalance,
    "calculateSubtotal",
    ()=>calculateSubtotal,
    "calculateTotalInsuranceCoverage",
    ()=>calculateTotalInsuranceCoverage,
    "computeBillingTotals",
    ()=>computeBillingTotals,
    "computeDepartmentBillAllocations",
    ()=>computeDepartmentBillAllocations,
    "filterMatchingCoverages",
    ()=>filterMatchingCoverages,
    "findBestMatchingCoverage",
    ()=>findBestMatchingCoverage,
    "getEffectiveCoveragePercentage",
    ()=>getEffectiveCoveragePercentage,
    "getItemInsuranceSplit",
    ()=>getItemInsuranceSplit,
    "isFullyPaid",
    ()=>isFullyPaid,
    "isHalfPaid",
    ()=>isHalfPaid,
    "resolveBillingUnitPrice",
    ()=>resolveBillingUnitPrice,
    "resolvePatientSharePercentage",
    ()=>resolvePatientSharePercentage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/money.ts [app-client] (ecmascript)");
;
function findBestMatchingCoverage(coverages, departmentId, encounterType) {
    if (!coverages || coverages.length === 0) return undefined;
    const applicable = filterMatchingCoverages(coverages, departmentId, encounterType);
    if (applicable.length === 0) return undefined;
    // Split into contextual rules (have at least one condition) and base (no conditions).
    const rules = applicable.filter((c)=>c.departmentId || c.encounterType);
    const bases = applicable.filter((c)=>!c.departmentId && !c.encounterType);
    // Prefer the matching rule with the lowest %; fall back to the base with the lowest %.
    const lowestOf = (tiers)=>tiers.reduce((best, t)=>best === undefined || t.patientSharePercentage < best.patientSharePercentage ? t : best, undefined);
    return lowestOf(rules) ?? lowestOf(bases);
}
function clampPct(value) {
    return Math.max(0, Math.min(100, Math.round(value)));
}
/**
 * Checks whether a specific selected tier (identified by coverageId) is valid
 * for the current billing context.
 *
 * A tier is contextually valid when its own conditions are satisfied:
 *   - base tier (no conditions) → always valid
 *   - dept-only → valid when the billing dept matches
 *   - encounterType-only → valid when the visit encounterType matches
 *   - dept + encounterType → valid only when BOTH match
 *
 * An override that doesn't satisfy the tier's own requirements is silently
 * dropped and the normal auto-resolution chain applies instead.
 */ function isOverrideAllowed(coverages, selectedCoverageId, departmentId, encounterType) {
    const tier = coverages.find((c)=>c.coverageId === selectedCoverageId);
    if (!tier) return false; // unknown tier
    // Base tier — no conditions, always applicable
    if (!tier.departmentId && !tier.encounterType) return true;
    // Has a dept condition — must match
    if (tier.departmentId && tier.departmentId !== departmentId) return false;
    // Has an encounterType condition — must match
    if (tier.encounterType && tier.encounterType !== encounterType) return false;
    return true;
}
function resolvePatientSharePercentage(input) {
    const { departmentId, encounterType, selectedCoverageId, patientSharePercentage } = input;
    const coverages = input.coverages || [];
    // Layer 1: per-line override (selected tier) — only when the tier's own
    // conditions are satisfied by the current billing context (dept + encounterType).
    // A base tier (no conditions) is always accepted. A dept/encounterType-specific
    // tier is only accepted when the current context matches its requirements.
    if (selectedCoverageId != null && selectedCoverageId !== "") {
        const override = coverages.find((c)=>c.coverageId === selectedCoverageId);
        if (override && isOverrideAllowed(coverages, selectedCoverageId, departmentId, encounterType)) {
            return clampPct(override.patientSharePercentage);
        }
    }
    // Layer 2: patient-specific default — a per-patient negotiated rate takes
    // priority over generic provider coverage rules. Without this ordering a
    // dept-level rule (e.g. Dental/OUTPATIENT → 20%) silently overrides the
    // patient's personal rate (e.g. 10%), mismatching the displayed vs billed %.
    // Mirrors the updated BillingPricingCalculator layer ordering.
    if (patientSharePercentage != null && patientSharePercentage > 0) {
        return clampPct(patientSharePercentage);
    }
    // Layer 3: auto-resolved applicable tier — lowest % among tiers that match
    // the current context. Contextual rules beat base; within each group lowest %.
    const best = findBestMatchingCoverage(coverages, departmentId ?? undefined, encounterType ?? undefined);
    if (best !== undefined) {
        return clampPct(best.patientSharePercentage);
    }
    // Layer 4: 0 (insurance covers everything).
    return 0;
}
function filterMatchingCoverages(coverages, departmentId, encounterType) {
    if (!coverages) return [];
    return coverages.filter((c)=>{
        // Base tier: no conditions → always show
        if (!c.departmentId && !c.encounterType) return true;
        // Tier has department condition
        if (c.departmentId && !c.encounterType) {
            return departmentId ? c.departmentId === departmentId : false;
        }
        // Tier has encounterType condition only
        if (!c.departmentId && c.encounterType) {
            return encounterType ? c.encounterType === encounterType : false;
        }
        // Tier has both conditions — both must match
        return departmentId !== undefined && encounterType !== undefined && c.departmentId === departmentId && c.encounterType === encounterType;
    });
}
function buildProductCoverageMaps(coverages) {
    const costs = {};
    const meta = {};
    (coverages || []).forEach((coverage)=>{
        const providerId = coverage?.insuranceProvider?.id ?? coverage?.insurance?.id;
        if (providerId === undefined || providerId === null) return;
        const key = String(providerId);
        const numericCost = Number(coverage?.cost ?? coverage?.price ?? 0);
        costs[key] = numericCost;
        meta[key] = {
            cost: numericCost,
            covered: coverage?.covered !== false && numericCost > 0
        };
    });
    return {
        costs,
        meta
    };
}
function resolveBillingUnitPrice(basePrice, coverageCosts, coverageMeta, providerId) {
    if (!providerId) {
        return {
            price: basePrice,
            notCovered: false
        };
    }
    const meta = coverageMeta[providerId];
    const cost = coverageCosts[providerId];
    if (meta?.covered && Number.isFinite(cost) && cost > 0) {
        return {
            price: cost,
            notCovered: false
        };
    }
    return {
        price: basePrice,
        notCovered: true
    };
}
function applyInsuranceSelectionToItem(item, visitInsuranceId, providerId) {
    const basePrice = item.basePrice ?? item.price;
    const { price, notCovered } = resolveBillingUnitPrice(basePrice, item.insuranceCoverageCosts || {}, item.insuranceCoverageMeta || {}, providerId);
    return {
        ...item,
        selectedInsuranceId: visitInsuranceId,
        price,
        insuranceNotCovered: visitInsuranceId ? notCovered : false
    };
}
function getItemInsuranceSplit(item, coveragePercentage) {
    const exemptionType = item.exemptionType || (item.exempted ? "full" : "none");
    // Exact line total in integer cents — mirrors backend toMoney(unitPrice × quantity).
    const unitPrice = item.price ?? item.basePrice ?? 0;
    const lineTotalCents = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lineTotalToCents"])(unitPrice, item.quantity ?? 1);
    const rawItemTotal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fromCents"])(lineTotalCents);
    if (exemptionType === "full") {
        const coveredCents = !item.selectedInsuranceId || item.insuranceNotCovered ? 0 : Math.min((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["insuranceShareCents"])(lineTotalCents, coveragePercentage), lineTotalCents);
        return {
            itemTotal: 0,
            insuranceAmount: 0,
            patientAmount: 0,
            rawItemTotal,
            rawInsuranceAmount: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fromCents"])(coveredCents),
            rawPatientAmount: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fromCents"])(lineTotalCents - coveredCents),
            waivedAmount: rawItemTotal,
            skip: true
        };
    }
    // PATIENT_SHARE exemption: the patient's share is waived; insurance still
    // covers its normal amount. This must be checked before the no-insurance
    // early return because the exemption zeros patientAmount regardless.
    if (exemptionType === "patient-share") {
        const coveredCents = Math.min((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["insuranceShareCents"])(lineTotalCents, coveragePercentage), lineTotalCents);
        const insuranceAmount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fromCents"])(coveredCents);
        const rawPatientAmount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fromCents"])(lineTotalCents - coveredCents);
        return {
            itemTotal: rawItemTotal,
            insuranceAmount,
            patientAmount: 0,
            rawItemTotal,
            rawInsuranceAmount: insuranceAmount,
            rawPatientAmount,
            waivedAmount: rawPatientAmount,
            skip: false
        };
    }
    if (!item.selectedInsuranceId || item.insuranceNotCovered) {
        return {
            itemTotal: rawItemTotal,
            insuranceAmount: 0,
            patientAmount: rawItemTotal,
            rawItemTotal,
            rawInsuranceAmount: 0,
            rawPatientAmount: rawItemTotal,
            waivedAmount: 0,
            skip: false
        };
    }
    // Mirrors the backend: the insurer covers (100 − pct)% of the coverage cost
    // (for an insured line the unit price IS the coverage cost), capped at the
    // line total; the patient pays the remainder. Rounding happens once, HALF_UP
    // to 2 dp — never to whole RWF.
    const coveredCents = Math.min((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["insuranceShareCents"])(lineTotalCents, coveragePercentage), lineTotalCents);
    const patientCents = lineTotalCents - coveredCents;
    return {
        itemTotal: rawItemTotal,
        insuranceAmount: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fromCents"])(coveredCents),
        patientAmount: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fromCents"])(patientCents),
        rawItemTotal,
        rawInsuranceAmount: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fromCents"])(coveredCents),
        rawPatientAmount: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fromCents"])(patientCents),
        waivedAmount: 0,
        skip: false
    };
}
function computeDepartmentBillAllocations(items, totalPayment, getCoveragePercentage, originalTotalCents) {
    const map = new Map();
    for (const item of items){
        const rootId = String(item.rootVisitDepartmentId || item.visitDepartmentId || "");
        if (!rootId) continue;
        let entry = map.get(rootId);
        if (!entry) {
            entry = {
                visitDepartmentId: rootId,
                patientPayable: 0,
                patientPayableCents: 0,
                allocatedPayment: 0,
                hasExemptions: false,
                noteRequired: false
            };
            map.set(rootId, entry);
        }
        const exemptionType = item.exemptionType || (item.exempted ? "full" : "none");
        if (exemptionType !== "none") {
            entry.hasExemptions = true;
        }
        if (exemptionType === "full" || exemptionType === "patient-share") {
            continue; // zero patient payable
        }
        const { patientAmount } = getItemInsuranceSplit(item, getCoveragePercentage(item));
        entry.patientPayableCents += (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toCents"])(patientAmount);
    }
    let remainingCents = Math.max(0, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toCents"])(totalPayment));
    const allocations = Array.from(map.values());
    for (const entry of allocations){
        entry.patientPayable = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fromCents"])(entry.patientPayableCents);
        const amountCents = Math.min(entry.patientPayableCents, remainingCents);
        entry.allocatedPayment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fromCents"])(amountCents);
        remainingCents -= amountCents;
    }
    // Determine note-required per department. In edit mode (originalTotalCents
    // provided), use the PREVIOUS paid amount as the distribution cap so that
    // automatic capping of amountPaid to the new total does not falsely trigger
    // a note requirement when the user has not intentionally reduced payment.
    const noteRefCents = originalTotalCents ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toCents"])(totalPayment);
    let refRemainingCents = Math.max(0, noteRefCents);
    const refAllocs = [];
    for (const entry of allocations){
        const refAmt = Math.min(entry.patientPayableCents, refRemainingCents);
        refAllocs.push(refAmt);
        refRemainingCents -= refAmt;
    }
    for(let i = 0; i < allocations.length; i++){
        const entry = allocations[i];
        const hasOutstanding = refAllocs[i] < entry.patientPayableCents;
        // Note is required only when there's an actual unpaid balance (patient owes
        // money). Exemptions alone with zero patient payable don't require a note.
        entry.noteRequired = hasOutstanding;
    }
    return allocations.map(({ patientPayableCents: _cents, ...entry })=>entry);
}
const EXEMPTION_PRESETS = [
    "Waived by Doctor",
    "Financial Hardship",
    "Insurance Covers Full",
    "Free Treatment Program",
    "Referral Case",
    "Emergency Relief",
    "Staff/Family",
    "Charity Case",
    "Other"
];
const calculateItemTotal = (item)=>{
    const unitPrice = item.price ?? item.basePrice ?? 0;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fromCents"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lineTotalToCents"])(unitPrice, item.quantity ?? 1));
};
const calculateSubtotal = (items)=>{
    return items.filter((item)=>(item.exemptionType || (item.exempted ? "full" : "none")) !== "full").reduce((total, item)=>total + calculateItemTotal(item), 0);
};
const calculateInsuranceCoverage = (subtotal, coveragePercentage)=>{
    return subtotal * coveragePercentage / 100;
};
const calculateTotalInsuranceCoverage = (subtotal, insurances)=>{
    if (!insurances || insurances.length === 0) return 0;
    const maxCoverage = Math.max(...insurances.map((ins)=>ins.coveragePercentage));
    return calculateInsuranceCoverage(subtotal, maxCoverage);
};
const getEffectiveCoveragePercentage = (insurances)=>{
    if (!insurances || insurances.length === 0) return 0;
    return Math.max(...insurances.map((ins)=>ins.coveragePercentage));
};
const calculatePatientResponsibility = (subtotal, coveragePercentage)=>{
    return subtotal - calculateInsuranceCoverage(subtotal, coveragePercentage);
};
const calculateExemptedTotal = (items)=>{
    return items.reduce((total, item)=>{
        const exemption = item.exemptionType || (item.exempted ? "full" : "none");
        if (exemption === "none") return total;
        return total + calculateItemTotal(item);
    }, 0);
};
const calculatePaymentStatus = (totalAmount, amountPaid)=>{
    if (amountPaid <= 0) return "unpaid";
    if (amountPaid >= totalAmount) return "full";
    return "partial";
};
const calculateRemainingBalance = (totalAmount, amountPaid)=>{
    const remaining = totalAmount - amountPaid;
    return remaining > 0 ? remaining : 0;
};
const isFullyPaid = (totalAmount, amountPaid)=>{
    return amountPaid >= totalAmount;
};
const isHalfPaid = (totalAmount, amountPaid)=>{
    const halfAmount = totalAmount / 2;
    return amountPaid >= halfAmount && amountPaid < totalAmount;
};
function computeBillingTotals(items, getCoveragePercentage) {
    let subtotalCents = 0;
    let insuranceCoverageCents = 0;
    let patientResponsibilityCents = 0;
    let waivedTotalCents = 0;
    items.forEach((item)=>{
        const coveragePct = getCoveragePercentage(item);
        const { itemTotal, insuranceAmount, patientAmount, waivedAmount, skip } = getItemInsuranceSplit(item, coveragePct);
        waivedTotalCents += (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toCents"])(waivedAmount);
        if (skip) return;
        subtotalCents += (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toCents"])(itemTotal);
        insuranceCoverageCents += (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toCents"])(insuranceAmount);
        patientResponsibilityCents += (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toCents"])(patientAmount);
    });
    return {
        subtotal: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fromCents"])(subtotalCents),
        insuranceCoverage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fromCents"])(insuranceCoverageCents),
        patientResponsibility: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fromCents"])(patientResponsibilityCents),
        totalAmount: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fromCents"])(patientResponsibilityCents),
        waivedTotal: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fromCents"])(waivedTotalCents)
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/billing/billing-preview-sheet.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BillingPreviewSheet",
    ()=>BillingPreviewSheet
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/scroll-area.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/printer.js [app-client] (ecmascript) <export default as Printer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dropdown-menu.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-toastify/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$billing$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/billing-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visit$2d$billing$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/visit-billing-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/money.ts [app-client] (ecmascript)");
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
// Small color-coded dot per visit-department status (kept as an icon badge
// instead of the old full status text line, which made the list huge).
const STATUS_DOT_CLASS = {
    COMPLETED: "bg-emerald-500",
    DISCHARGED: "bg-emerald-500",
    ACTIVE: "bg-sky-500",
    BILLING: "bg-[#FF6900]",
    PENDING: "bg-amber-500",
    ON_HOLD: "bg-violet-500",
    CANCELLED: "bg-rose-500",
    CANCELED: "bg-rose-500"
};
function BillingPreviewSheet({ open, onOpenChange, visit, billingData, visitBilling, selectedDepartmentId, getCoveragePercentage, onDepartmentSelect, onPrintInvoice, onDownloadInvoice, onViewMore, canViewMore = false, printingInvoice = false, isEditMode = false, scopeToSelectedDepartment = false }) {
    _s();
    const [isRendered, setIsRendered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(open);
    const [selectedDepartmentIdState, setSelectedDepartmentIdState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(selectedDepartmentId ?? null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BillingPreviewSheet.useEffect": ()=>{
            if (open) {
                setIsRendered(true);
                return;
            }
            const timeout = window.setTimeout({
                "BillingPreviewSheet.useEffect.timeout": ()=>{
                    setIsRendered(false);
                }
            }["BillingPreviewSheet.useEffect.timeout"], 220);
            return ({
                "BillingPreviewSheet.useEffect": ()=>window.clearTimeout(timeout)
            })["BillingPreviewSheet.useEffect"];
        }
    }["BillingPreviewSheet.useEffect"], [
        open
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BillingPreviewSheet.useEffect": ()=>{
            if (!open) {
                setSelectedDepartmentIdState(selectedDepartmentId ?? null);
                return;
            }
        }
    }["BillingPreviewSheet.useEffect"], [
        open,
        selectedDepartmentId
    ]);
    const topLevelDepartments = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "BillingPreviewSheet.useMemo[topLevelDepartments]": ()=>{
            const depts = visit?.departments || [];
            if (scopeToSelectedDepartment) {
                const targetId = selectedDepartmentId ?? selectedDepartmentIdState;
                if (targetId) {
                    const match = depts.find({
                        "BillingPreviewSheet.useMemo[topLevelDepartments].match": (d)=>d.id === targetId || d.childVisitDepartments && d.childVisitDepartments.some({
                                "BillingPreviewSheet.useMemo[topLevelDepartments].match": (c)=>c.id === targetId
                            }["BillingPreviewSheet.useMemo[topLevelDepartments].match"])
                    }["BillingPreviewSheet.useMemo[topLevelDepartments].match"]);
                    if (match) return [
                        match
                    ];
                }
            }
            return depts;
        }
    }["BillingPreviewSheet.useMemo[topLevelDepartments]"], [
        visit?.departments,
        scopeToSelectedDepartment,
        selectedDepartmentId,
        selectedDepartmentIdState
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BillingPreviewSheet.useEffect": ()=>{
            if (!open || !topLevelDepartments.length) return;
            if (selectedDepartmentIdState) return;
            setSelectedDepartmentIdState(topLevelDepartments[0].id);
            onDepartmentSelect?.(topLevelDepartments[0].id);
        }
    }["BillingPreviewSheet.useEffect"], [
        open,
        topLevelDepartments,
        selectedDepartmentIdState,
        onDepartmentSelect
    ]);
    const activeDepartmentId = selectedDepartmentId ?? selectedDepartmentIdState;
    const activeDepartment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "BillingPreviewSheet.useMemo[activeDepartment]": ()=>topLevelDepartments.find({
                "BillingPreviewSheet.useMemo[activeDepartment]": (dept)=>dept.id === activeDepartmentId
            }["BillingPreviewSheet.useMemo[activeDepartment]"]) || topLevelDepartments[0] || null
    }["BillingPreviewSheet.useMemo[activeDepartment]"], [
        topLevelDepartments,
        activeDepartmentId
    ]);
    const invoiceGroups = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "BillingPreviewSheet.useMemo[invoiceGroups]": ()=>{
            if (!activeDepartment) return [];
            const collectDeptIds = {
                "BillingPreviewSheet.useMemo[invoiceGroups].collectDeptIds": (dept)=>{
                    const ids = [];
                    const stack = [
                        dept
                    ];
                    while(stack.length){
                        const cur = stack.shift();
                        if (!cur) continue;
                        ids.push(String(cur.id));
                        if (cur.childVisitDepartments && Array.isArray(cur.childVisitDepartments)) {
                            stack.push(...cur.childVisitDepartments);
                        }
                    }
                    return ids;
                }
            }["BillingPreviewSheet.useMemo[invoiceGroups].collectDeptIds"];
            const deptIds = collectDeptIds(activeDepartment);
            // A billed visit previews the actual invoice. The draft path is only used
            // before any bill exists, or while editing (the page passes visitBilling
            // as null in edit mode so the pending edits are previewed instead).
            if (visitBilling) {
                let depts = (visitBilling.departments || []).filter({
                    "BillingPreviewSheet.useMemo[invoiceGroups].depts": (d)=>deptIds.includes(String(d.visitDepartment?.id || d.id))
                }["BillingPreviewSheet.useMemo[invoiceGroups].depts"]);
                if (!depts.length && !scopeToSelectedDepartment && !selectedDepartmentId) {
                    depts = visitBilling.departments || [];
                }
                const groups = [];
                for (const d of depts){
                    const insuranceBillings = d.insuranceBillings || [];
                    for (const ib of insuranceBillings){
                        let groupWaivedAmount = 0;
                        const mappedItems = (ib.items || []).map({
                            "BillingPreviewSheet.useMemo[invoiceGroups].mappedItems": (it, idx)=>{
                                const isExempted = it.patientShareSource === "EXEMPTED";
                                const unitPrice = Number(it.unitPriceSnapshot || 0);
                                const qty = Number(it.quantitySnapshot || 1);
                                const rawTotal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["roundMoney"])(unitPrice * qty);
                                const insCovered = Number(it.insuranceCoveredAmount || 0);
                                const lineWaived = isExempted ? Math.max(0, rawTotal - insCovered) : 0;
                                groupWaivedAmount += lineWaived;
                                return {
                                    id: it.id || `item-${d.id}-${idx}`,
                                    name: it.productName || "Item",
                                    quantity: qty,
                                    price: unitPrice,
                                    rawAmount: rawTotal,
                                    isExempted,
                                    waivedAmount: lineWaived,
                                    departmentName: d.visitDepartment.department?.name || activeDepartment?.department?.name || "Department"
                                };
                            }
                        }["BillingPreviewSheet.useMemo[invoiceGroups].mappedItems"]);
                        const insName = ib.patientInsurance?.insuranceProvider?.insuranceName || ib.patientInsurance?.insuranceProvider?.name || ib.patientInsurance?.insuranceProvider?.acronym || "";
                        const hasIns = Boolean(ib.patientInsurance != null);
                        groups.push({
                            id: ib.id,
                            status: ib.status,
                            label: ib.status ? `${ib.status}` : "Invoice",
                            insuranceLabel: insName || (hasIns ? "Insurance" : "Private"),
                            hasInsurance: hasIns,
                            totalAmount: Number(ib.totalAmount || 0),
                            insuranceCoveredAmount: Number(ib.insuranceCoveredAmount || 0),
                            patientPayableAmount: Number(ib.patientPayableAmount || 0),
                            paidAmount: Number(ib.paidAmount || 0),
                            outstandingAmount: Number(ib.outstandingAmount || 0),
                            waivedAmount: groupWaivedAmount,
                            items: mappedItems
                        });
                    }
                }
                return groups;
            }
            if (!billingData) return [];
            let draftWaivedTotal = 0;
            let draftInsuranceCoveredTotal = 0;
            let draftPatientPayableTotal = 0;
            let detectedInsuranceName = null;
            let hasDraftInsurance = false;
            const items = billingData.items.filter({
                "BillingPreviewSheet.useMemo[invoiceGroups].items": (item)=>{
                    const itemRootId = String(item.rootVisitDepartmentId || item.visitDepartmentId || "");
                    return deptIds.includes(itemRootId);
                }
            }["BillingPreviewSheet.useMemo[invoiceGroups].items"]).map({
                "BillingPreviewSheet.useMemo[invoiceGroups].items": (it)=>{
                    const exemptionType = it.exemptionType || (it.exempted ? "full" : "none");
                    const isExempted = exemptionType !== "none";
                    const unitPrice = it.price ?? it.basePrice ?? 0;
                    const qty = it.quantity ?? 1;
                    const rawTotal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["roundMoney"])(unitPrice * qty);
                    const coveragePct = getCoveragePercentage ? getCoveragePercentage(it) : 0;
                    const split = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$billing$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getItemInsuranceSplit"])(it, coveragePct);
                    const lineWaived = isExempted ? split.waivedAmount : 0;
                    draftWaivedTotal += lineWaived;
                    if (!isExempted || exemptionType === "patient-share") {
                        draftInsuranceCoveredTotal += split.insuranceAmount;
                    }
                    if (!isExempted) {
                        draftPatientPayableTotal += split.patientAmount;
                    }
                    if (it.selectedInsuranceId) {
                        hasDraftInsurance = true;
                        if (!detectedInsuranceName && visit?.patient?.patientInsurances) {
                            const pi = visit.patient.patientInsurances.find({
                                "BillingPreviewSheet.useMemo[invoiceGroups].items.pi": (p)=>String(p.id) === String(it.selectedInsuranceId)
                            }["BillingPreviewSheet.useMemo[invoiceGroups].items.pi"]);
                            if (pi?.insuranceProvider) {
                                detectedInsuranceName = pi.insuranceProvider.insuranceName || pi.insuranceProvider.name || pi.insuranceProvider.acronym || null;
                            }
                        }
                    }
                    return {
                        id: it.id,
                        name: it.name,
                        quantity: qty,
                        price: unitPrice,
                        rawAmount: rawTotal,
                        isExempted,
                        exemptionType,
                        waivedAmount: lineWaived,
                        departmentName: activeDepartment.department?.name || "",
                        groupLabel: "Invoice"
                    };
                }
            }["BillingPreviewSheet.useMemo[invoiceGroups].items"]);
            const computedTotal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sumMoney"])(items.filter({
                "BillingPreviewSheet.useMemo[invoiceGroups].computedTotal": (it)=>!it.isExempted
            }["BillingPreviewSheet.useMemo[invoiceGroups].computedTotal"]).map({
                "BillingPreviewSheet.useMemo[invoiceGroups].computedTotal": (it)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["roundMoney"])(it.price * it.quantity)
            }["BillingPreviewSheet.useMemo[invoiceGroups].computedTotal"]));
            const draftGroups = items.length > 0 ? [
                {
                    id: "draft-invoice",
                    label: "Invoice",
                    insuranceLabel: detectedInsuranceName || (hasDraftInsurance ? "Insurance" : "Private"),
                    hasInsurance: hasDraftInsurance,
                    status: "",
                    totalAmount: computedTotal,
                    insuranceCoveredAmount: draftInsuranceCoveredTotal,
                    patientPayableAmount: draftPatientPayableTotal,
                    paidAmount: 0,
                    outstandingAmount: draftPatientPayableTotal,
                    waivedAmount: draftWaivedTotal,
                    items: items.map({
                        "BillingPreviewSheet.useMemo[invoiceGroups]": ({ groupLabel: _groupLabel, ...item })=>item
                    }["BillingPreviewSheet.useMemo[invoiceGroups]"])
                }
            ] : [];
            return draftGroups;
        }
    }["BillingPreviewSheet.useMemo[invoiceGroups]"], [
        billingData,
        activeDepartment,
        visitBilling,
        getCoveragePercentage,
        visit
    ]);
    const departmentTotal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sumMoney"])(invoiceGroups.map((g)=>g.totalAmount));
    const departmentPaid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sumMoney"])(invoiceGroups.map((g)=>g.paidAmount));
    const departmentOutstanding = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sumMoney"])(invoiceGroups.map((g)=>g.outstandingAmount));
    const showOverallDepartmentTotals = invoiceGroups.length > 1;
    const visitBillingTotals = visitBilling ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visit$2d$billing$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getVisitBillingTotals"])(visitBilling) : null;
    const showExistingBillSummary = Boolean(visitBilling && visitBillingTotals && invoiceGroups.length === 0 && !scopeToSelectedDepartment);
    const allItemsCount = invoiceGroups.reduce((sum, group)=>sum + group.items.length, 0);
    const patientName = visit ? `${visit.patient?.firstName || ""} ${visit.patient?.lastName || ""}`.trim() : "Patient";
    const canShowList = !scopeToSelectedDepartment && topLevelDepartments.length > 1;
    const invoiceDate = visitBilling?.updatedAt || billingData?.updatedAt || visit?.visitDate || new Date().toISOString();
    // All invoice groups that have a real backend id — a department can carry
    // several insurance billings (e.g. private + insurer), each its own invoice.
    const printableInvoiceGroups = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "BillingPreviewSheet.useMemo[printableInvoiceGroups]": ()=>invoiceGroups.filter({
                "BillingPreviewSheet.useMemo[printableInvoiceGroups]": (group)=>Boolean(group.id)
            }["BillingPreviewSheet.useMemo[printableInvoiceGroups]"])
    }["BillingPreviewSheet.useMemo[printableInvoiceGroups]"], [
        invoiceGroups
    ]);
    const handlePrintInvoice = async (groupId, copyType)=>{
        const target = groupId ? printableInvoiceGroups.find((group)=>group.id === groupId) : printableInvoiceGroups[0];
        if (!target?.id) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].warn("No generated invoice is available for this department yet.");
            return;
        }
        try {
            if (onPrintInvoice) {
                await onPrintInvoice(target.id, copyType);
                return;
            } else if (onDownloadInvoice) {
                await onDownloadInvoice(target.id, copyType);
                return;
            }
            throw new Error("Invoice printing is not configured for this preview.");
        } catch (err) {
            console.error("Print invoice error:", err);
            const message = err instanceof Error ? err.message : "Failed to print invoice";
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(message);
        }
    };
    if (!isRendered || typeof document === "undefined") return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-[88] pointer-events-none",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `absolute inset-0 bg-slate-950/40 transition-opacity duration-200 pointer-events-auto ${open ? "opacity-100" : "opacity-0"}`,
                onClick: ()=>onOpenChange(false),
                "aria-hidden": "true"
            }, void 0, false, {
                fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                lineNumber: 413,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                role: "dialog",
                "aria-modal": "true",
                "aria-label": "Billing Invoice Preview",
                className: `absolute right-0 top-0 h-full w-[min(92vw,72rem)] border-l border-border bg-background dark:bg-slate-900 shadow-2xl transition-transform duration-200 ease-out pointer-events-auto ${open ? "translate-x-0" : "translate-x-full"}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative flex h-full flex-col",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>onOpenChange(false),
                            className: "absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground",
                            "aria-label": "Close preview",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                lineNumber: 434,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                            lineNumber: 428,
                            columnNumber: 11
                        }, this),
                        canShowList && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "no-print flex shrink-0 items-center gap-2 overflow-x-auto border-b border-border/70 px-3 py-2",
                            children: topLevelDepartments.map((department)=>{
                                const isActive = department.id === activeDepartment?.id;
                                const dot = STATUS_DOT_CLASS[String(department.status || "").toUpperCase()] || "bg-slate-400";
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    title: department.status || undefined,
                                    onClick: ()=>{
                                        setSelectedDepartmentIdState(department.id);
                                        onDepartmentSelect?.(department.id);
                                    },
                                    className: `flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition ${isActive ? "bg-[#FF6900] text-white shadow-sm" : "border border-border bg-card text-foreground hover:bg-muted"}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `h-1.5 w-1.5 shrink-0 rounded-full ${isActive ? "bg-white" : dot}`,
                                            "aria-hidden": "true"
                                        }, void 0, false, {
                                            fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                            lineNumber: 462,
                                            columnNumber: 21
                                        }, this),
                                        department.department?.name || "Department"
                                    ]
                                }, department.id, true, {
                                    fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                    lineNumber: 448,
                                    columnNumber: 19
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                            lineNumber: 440,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-1 overflow-hidden",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                                    children: `@media print { .invoice-container { background: #fff !important; color: #000 !important; -webkit-print-color-adjust: exact; } .no-print { display: none !important; } .invoice-container { box-shadow: none !important; border: none !important; } }`
                                }, void 0, false, {
                                    fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                    lineNumber: 474,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "invoice-container flex w-full",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 overflow-hidden",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollArea"], {
                                            className: "h-full px-4 py-4",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-6 pr-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-end gap-2 pr-12 no-print",
                                                        children: [
                                                            canViewMore && onViewMore && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: onViewMore,
                                                                className: "px-3 py-1 rounded-md border border-border bg-background text-foreground hover:bg-muted",
                                                                children: "View more"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                lineNumber: 482,
                                                                columnNumber: 25
                                                            }, this),
                                                            visitBilling && printableInvoiceGroups.length > 0 && !isEditMode && (printableInvoiceGroups.length === 1 && !printableInvoiceGroups[0].hasInsurance ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>void handlePrintInvoice(printableInvoiceGroups[0].id, "PATIENT"),
                                                                disabled: printingInvoice,
                                                                className: "inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary hover:bg-primary-hover text-primary-foreground disabled:opacity-60 disabled:cursor-not-allowed",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                                                                        className: "h-4 w-4"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                        lineNumber: 498,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    printingInvoice ? "Preparing invoice…" : "Print invoice"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                lineNumber: 492,
                                                                columnNumber: 27
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                                                        asChild: true,
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            type: "button",
                                                                            disabled: printingInvoice,
                                                                            className: "inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary hover:bg-primary-hover text-primary-foreground disabled:opacity-60 disabled:cursor-not-allowed",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                                                                                    className: "h-4 w-4"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                    lineNumber: 511,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                printingInvoice ? "Preparing invoice…" : "Print invoice",
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                                                    className: "h-3.5 w-3.5"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                    lineNumber: 515,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                            lineNumber: 506,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                        lineNumber: 505,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                                                        align: "end",
                                                                        className: "w-80 z-[100]",
                                                                        children: printableInvoiceGroups.map((group)=>{
                                                                            const hasIns = Boolean(group.hasInsurance);
                                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "p-1 border-b last:border-b-0 border-border/50",
                                                                                children: hasIns ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "px-2 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider",
                                                                                            children: group.insuranceLabel || "Insurance"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                            lineNumber: 531,
                                                                                            columnNumber: 41
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                                                            disabled: printingInvoice,
                                                                                            onSelect: ()=>void handlePrintInvoice(group.id, "INSURANCE"),
                                                                                            className: "cursor-pointer",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "truncate",
                                                                                                    children: "📄 Insurer Copy (Claim)"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                                    lineNumber: 541,
                                                                                                    columnNumber: 43
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "ml-auto pl-3 text-xs text-muted-foreground tabular-nums",
                                                                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatRWF"])(group.insuranceCoveredAmount)
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                                    lineNumber: 542,
                                                                                                    columnNumber: 43
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                            lineNumber: 534,
                                                                                            columnNumber: 41
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                                                            disabled: printingInvoice,
                                                                                            onSelect: ()=>void handlePrintInvoice(group.id, "PATIENT"),
                                                                                            className: "cursor-pointer",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "truncate",
                                                                                                    children: "🧾 Patient Receipt & Statement"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                                    lineNumber: 553,
                                                                                                    columnNumber: 43
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "ml-auto pl-3 text-xs text-muted-foreground tabular-nums",
                                                                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatRWF"])(group.patientPayableAmount)
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                                    lineNumber: 554,
                                                                                                    columnNumber: 43
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                            lineNumber: 546,
                                                                                            columnNumber: 41
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                                                    disabled: printingInvoice,
                                                                                    onSelect: ()=>void handlePrintInvoice(group.id, "PATIENT"),
                                                                                    className: "cursor-pointer",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "truncate",
                                                                                            children: [
                                                                                                "🧾 ",
                                                                                                group.label || "Invoice"
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                            lineNumber: 567,
                                                                                            columnNumber: 41
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "ml-auto pl-3 text-xs text-muted-foreground tabular-nums",
                                                                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatRWF"])(group.totalAmount)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                            lineNumber: 568,
                                                                                            columnNumber: 41
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                    lineNumber: 560,
                                                                                    columnNumber: 39
                                                                                }, this)
                                                                            }, group.id, false, {
                                                                                fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                lineNumber: 528,
                                                                                columnNumber: 35
                                                                            }, this);
                                                                        })
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                        lineNumber: 521,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                lineNumber: 504,
                                                                columnNumber: 27
                                                            }, this))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                        lineNumber: 480,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "grid gap-2 sm:grid-cols-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "py-1 border-b border-border",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Patient:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                        lineNumber: 583,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    " ",
                                                                    patientName || "N/A"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                lineNumber: 582,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "py-1 border-b border-border",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Department:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                        lineNumber: 586,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    " ",
                                                                    activeDepartment?.department?.name || "General"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                lineNumber: 585,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "py-1 border-b border-border",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Insurance:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                        lineNumber: 590,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    " ",
                                                                    invoiceGroups.length === 1 ? invoiceGroups[0].insuranceLabel : "Multiple"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                lineNumber: 589,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "py-1 border-b border-border",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Invoice Date:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                        lineNumber: 596,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    " ",
                                                                    new Date(invoiceDate).toLocaleDateString()
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                lineNumber: 595,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                        lineNumber: 581,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "border-b border-border pb-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "mb-3 flex items-center justify-between gap-3",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                            className: "text-sm font-semibold text-foreground",
                                                                            children: "Invoice items"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                            lineNumber: 604,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-xs text-muted-foreground",
                                                                            children: [
                                                                                allItemsCount,
                                                                                " item",
                                                                                allItemsCount !== 1 ? "s" : ""
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                            lineNumber: 607,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                    lineNumber: 603,
                                                                    columnNumber: 25
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                lineNumber: 602,
                                                                columnNumber: 23
                                                            }, this),
                                                            invoiceGroups.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-muted-foreground",
                                                                children: "No billable items found for this department."
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                lineNumber: 614,
                                                                columnNumber: 25
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "space-y-6",
                                                                children: invoiceGroups.map((group, groupIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "border border-border",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "border-b border-border bg-slate-50 px-3 py-2 text-sm font-semibold text-foreground dark:bg-slate-800",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "flex items-center justify-between gap-3",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            children: [
                                                                                                invoiceGroups.length > 1 ? `Invoice option ${groupIndex + 1}` : "Invoice",
                                                                                                group.status ? ` • ${group.status}` : "",
                                                                                                group.insuranceLabel ? ` • ${group.insuranceLabel}` : ""
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                            lineNumber: 626,
                                                                                            columnNumber: 35
                                                                                        }, this),
                                                                                        group.id && !isEditMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "flex items-center gap-1.5 shrink-0",
                                                                                            children: Boolean(group.insuranceCoveredAmount > 0 || group.insuranceLabel) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                                        type: "button",
                                                                                                        onClick: ()=>void (onDownloadInvoice || onPrintInvoice)?.(group.id, "INSURANCE"),
                                                                                                        disabled: printingInvoice,
                                                                                                        className: "rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted disabled:opacity-50",
                                                                                                        title: "Download contracted insurer claim copy",
                                                                                                        children: "Insurer Claim"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                                        lineNumber: 642,
                                                                                                        columnNumber: 43
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                                        type: "button",
                                                                                                        onClick: ()=>void (onDownloadInvoice || onPrintInvoice)?.(group.id, "PATIENT"),
                                                                                                        disabled: printingInvoice,
                                                                                                        className: "rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted disabled:opacity-50",
                                                                                                        title: "Download patient receipt and billing statement",
                                                                                                        children: "Patient Receipt"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                                        lineNumber: 656,
                                                                                                        columnNumber: 43
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                                type: "button",
                                                                                                onClick: ()=>void (onDownloadInvoice || onPrintInvoice)?.(group.id, "PATIENT"),
                                                                                                disabled: printingInvoice,
                                                                                                className: "rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted disabled:opacity-50",
                                                                                                children: "Download invoice"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                                lineNumber: 672,
                                                                                                columnNumber: 41
                                                                                            }, this)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                            lineNumber: 636,
                                                                                            columnNumber: 37
                                                                                        }, this) : null
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                    lineNumber: 625,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                lineNumber: 624,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                                                                className: "w-full border-collapse text-sm",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                                                        className: "bg-transparent",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                                                    className: "border-b border-border px-3 py-2 text-left font-semibold text-xs uppercase tracking-[0.2em] text-muted-foreground",
                                                                                                    children: "Description"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                                    lineNumber: 693,
                                                                                                    columnNumber: 37
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                                                    className: "border-b border-border px-3 py-2 text-right font-semibold text-xs uppercase tracking-[0.2em] text-muted-foreground",
                                                                                                    children: "Qty"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                                    lineNumber: 696,
                                                                                                    columnNumber: 37
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                                                    className: "border-b border-border px-3 py-2 text-right font-semibold text-xs uppercase tracking-[0.2em] text-muted-foreground",
                                                                                                    children: "Unit"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                                    lineNumber: 699,
                                                                                                    columnNumber: 37
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                                                    className: "border-b border-border px-3 py-2 text-right font-semibold text-xs uppercase tracking-[0.2em] text-muted-foreground",
                                                                                                    children: "Amount"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                                    lineNumber: 702,
                                                                                                    columnNumber: 37
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                            lineNumber: 692,
                                                                                            columnNumber: 35
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                        lineNumber: 691,
                                                                                        columnNumber: 33
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                                                        children: group.items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                                                className: `even:bg-slate-50 dark:even:bg-slate-900/50 ${item.isExempted ? "bg-purple-50/40 dark:bg-purple-950/20" : ""}`,
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                                        className: "border-b border-border px-3 py-2 text-sm text-foreground",
                                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                            className: "flex items-center gap-1.5 flex-wrap",
                                                                                                            children: [
                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                    children: item.name
                                                                                                                }, void 0, false, {
                                                                                                                    fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                                                    lineNumber: 715,
                                                                                                                    columnNumber: 43
                                                                                                                }, this),
                                                                                                                item.isExempted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                    className: "text-[10px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/50 px-1.5 py-0.2 rounded border border-purple-200 dark:border-purple-800",
                                                                                                                    children: "Waived"
                                                                                                                }, void 0, false, {
                                                                                                                    fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                                                    lineNumber: 717,
                                                                                                                    columnNumber: 45
                                                                                                                }, this)
                                                                                                            ]
                                                                                                        }, void 0, true, {
                                                                                                            fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                                            lineNumber: 714,
                                                                                                            columnNumber: 41
                                                                                                        }, this)
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                                        lineNumber: 713,
                                                                                                        columnNumber: 39
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                                        className: "border-b border-border px-3 py-2 text-right text-sm text-foreground",
                                                                                                        children: item.quantity
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                                        lineNumber: 723,
                                                                                                        columnNumber: 39
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                                        className: "border-b border-border px-3 py-2 text-right text-sm text-foreground",
                                                                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatRWF"])(item.price)
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                                        lineNumber: 726,
                                                                                                        columnNumber: 39
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                                        className: "border-b border-border px-3 py-2 text-right text-sm font-semibold text-foreground",
                                                                                                        children: item.isExempted ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                            children: [
                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                    className: "line-through text-muted-foreground text-xs block",
                                                                                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatRWF"])(item.waivedAmount !== undefined && item.waivedAmount > 0 ? item.waivedAmount : item.rawAmount || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["roundMoney"])(item.price * item.quantity))
                                                                                                                }, void 0, false, {
                                                                                                                    fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                                                    lineNumber: 732,
                                                                                                                    columnNumber: 45
                                                                                                                }, this),
                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                    className: "text-purple-700 dark:text-purple-400 text-xs font-semibold",
                                                                                                                    children: "0 RWF (Waived)"
                                                                                                                }, void 0, false, {
                                                                                                                    fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                                                    lineNumber: 739,
                                                                                                                    columnNumber: 45
                                                                                                                }, this)
                                                                                                            ]
                                                                                                        }, void 0, true, {
                                                                                                            fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                                            lineNumber: 731,
                                                                                                            columnNumber: 43
                                                                                                        }, this) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatRWF"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["roundMoney"])(item.price * item.quantity))
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                                        lineNumber: 729,
                                                                                                        columnNumber: 39
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, item.id, true, {
                                                                                                fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                                lineNumber: 709,
                                                                                                columnNumber: 37
                                                                                            }, this))
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                        lineNumber: 707,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                lineNumber: 690,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "grid gap-2 sm:grid-cols-2 p-3 text-sm",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "py-1",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                                children: "Total billed:"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                                lineNumber: 757,
                                                                                                columnNumber: 35
                                                                                            }, this),
                                                                                            " ",
                                                                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatRWF"])(group.totalAmount)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                        lineNumber: 756,
                                                                                        columnNumber: 33
                                                                                    }, this),
                                                                                    group.insuranceCoveredAmount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "py-1 text-emerald-700 dark:text-emerald-400",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                                children: "Insurance:"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                                lineNumber: 762,
                                                                                                columnNumber: 37
                                                                                            }, this),
                                                                                            " ",
                                                                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatRWF"])(group.insuranceCoveredAmount)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                        lineNumber: 761,
                                                                                        columnNumber: 35
                                                                                    }, this),
                                                                                    Boolean(group.waivedAmount && group.waivedAmount > 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "py-1 text-purple-700 dark:text-purple-400",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                                children: "Waived:"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                                lineNumber: 768,
                                                                                                columnNumber: 37
                                                                                            }, this),
                                                                                            " ",
                                                                                            "−",
                                                                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatRWF"])(group.waivedAmount)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                        lineNumber: 767,
                                                                                        columnNumber: 35
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "py-1",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                                children: "Patient payable:"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                                lineNumber: 773,
                                                                                                columnNumber: 35
                                                                                            }, this),
                                                                                            " ",
                                                                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatRWF"])(group.patientPayableAmount)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                        lineNumber: 772,
                                                                                        columnNumber: 33
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "py-1",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                                children: "Paid:"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                                lineNumber: 777,
                                                                                                columnNumber: 35
                                                                                            }, this),
                                                                                            " ",
                                                                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatRWF"])(group.paidAmount)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                        lineNumber: 776,
                                                                                        columnNumber: 33
                                                                                    }, this),
                                                                                    group.outstandingAmount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "py-1 text-orange-600 dark:text-orange-400",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                                children: "Outstanding:"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                                lineNumber: 782,
                                                                                                columnNumber: 37
                                                                                            }, this),
                                                                                            " ",
                                                                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatRWF"])(group.outstandingAmount)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                        lineNumber: 781,
                                                                                        columnNumber: 35
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                lineNumber: 755,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, group.id || groupIndex, true, {
                                                                        fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                        lineNumber: 620,
                                                                        columnNumber: 29
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                lineNumber: 618,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                        lineNumber: 601,
                                                        columnNumber: 21
                                                    }, this),
                                                    showOverallDepartmentTotals && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-2 text-sm text-muted-foreground",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-semibold text-foreground",
                                                                children: "Department overall summary"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                lineNumber: 795,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "mt-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "py-1 border-b border-border",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                children: "Total billed:"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                lineNumber: 800,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            " ",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "float-right",
                                                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatRWF"])(departmentTotal)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                lineNumber: 801,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                        lineNumber: 799,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "py-1 border-b border-border",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                children: "Paid:"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                lineNumber: 806,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            " ",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "float-right",
                                                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatRWF"])(departmentPaid)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                lineNumber: 807,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                        lineNumber: 805,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "py-1 border-b border-border",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                children: "Outstanding:"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                lineNumber: 812,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            " ",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "float-right",
                                                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatRWF"])(departmentOutstanding)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                                lineNumber: 813,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                        lineNumber: 811,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                lineNumber: 798,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                        lineNumber: 794,
                                                        columnNumber: 23
                                                    }, this),
                                                    showExistingBillSummary && visitBillingTotals && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-2 text-sm text-muted-foreground",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "py-1 border-b border-border",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Total billed:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                        lineNumber: 824,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    " ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "float-right",
                                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatRWF"])(visitBillingTotals.totalAmount)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                        lineNumber: 825,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                lineNumber: 823,
                                                                columnNumber: 25
                                                            }, this),
                                                            visitBillingTotals.insuranceCoveredAmount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "py-1 border-b border-border text-emerald-600 dark:text-emerald-400",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Insurance:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                        lineNumber: 831,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    " ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "float-right",
                                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatRWF"])(visitBillingTotals.insuranceCoveredAmount)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                        lineNumber: 832,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                lineNumber: 830,
                                                                columnNumber: 27
                                                            }, this),
                                                            Boolean(visitBillingTotals.waivedAmount && visitBillingTotals.waivedAmount > 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "py-1 border-b border-border text-purple-600 dark:text-purple-400 font-medium",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Waived:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                        lineNumber: 839,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    " ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "float-right",
                                                                        children: [
                                                                            "−",
                                                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatRWF"])(visitBillingTotals.waivedAmount)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                        lineNumber: 840,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                lineNumber: 838,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "py-1 border-b border-border",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Patient payable:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                        lineNumber: 846,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    " ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "float-right",
                                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatRWF"])(visitBillingTotals.patientPayableAmount)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                        lineNumber: 847,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                lineNumber: 845,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "py-1 border-b border-border",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Paid:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                        lineNumber: 852,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    " ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "float-right",
                                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatRWF"])(visitBillingTotals.paidAmount)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                        lineNumber: 853,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                lineNumber: 851,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "py-1 border-b border-border",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Outstanding:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                        lineNumber: 858,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    " ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "float-right",
                                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatRWF"])(visitBillingTotals.outstandingAmount)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                        lineNumber: 859,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                                lineNumber: 857,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                        lineNumber: 822,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                                lineNumber: 479,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                            lineNumber: 478,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                        lineNumber: 477,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                                    lineNumber: 476,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                            lineNumber: 473,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                    lineNumber: 425,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/billing/billing-preview-sheet.tsx",
                lineNumber: 419,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/billing/billing-preview-sheet.tsx",
        lineNumber: 412,
        columnNumber: 5
    }, this), document.body);
}
_s(BillingPreviewSheet, "LJts0D5Sogel+bIKpSdla3QB8hM=");
_c = BillingPreviewSheet;
var _c;
__turbopack_context__.k.register(_c, "BillingPreviewSheet");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/billing/billing-preview-sheet.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/components/billing/billing-preview-sheet.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=_e7969431._.js.map