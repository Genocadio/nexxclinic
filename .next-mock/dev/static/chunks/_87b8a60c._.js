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
"[project]/lib/formbuilder-conditional.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Conditional rendering utilities for the new form builder.
// Pure functions — no React, no side effects.
__turbopack_context__.s([
    "canBlockBeParent",
    ()=>canBlockBeParent,
    "getAvailableConditions",
    ()=>getAvailableConditions,
    "getBlockDisplayLabel",
    ()=>getBlockDisplayLabel,
    "getConditionSummary",
    ()=>getConditionSummary,
    "shouldShowBlock",
    ()=>shouldShowBlock
]);
// ─── Which block types can act as parents (they produce answer state) ────────
const PARENT_CAPABLE = new Set([
    'text_input',
    'textarea_input',
    'number_input',
    'date_input',
    'checkbox_single',
    'checkbox_group',
    'radio_group',
    'select_input',
    'signature',
    'diagnostic_record',
    'medication_full',
    'medication_mini',
    'lab_record',
    'product_listener'
]);
function canBlockBeParent(type) {
    return PARENT_CAPABLE.has(type);
}
// ─── Short display labels per block type ─────────────────────────────────────
const TYPE_SHORT = {
    text_input: 'text',
    textarea_input: 'textarea',
    number_input: 'number',
    date_input: 'date',
    checkbox_single: 'checkbox',
    checkbox_group: 'checkboxes',
    radio_group: 'radio',
    select_input: 'dropdown',
    signature: 'signature',
    diagnostic_record: 'diagnosis',
    medication_full: 'medication',
    medication_mini: 'medication',
    lab_record: 'lab',
    product_listener: 'products'
};
function getBlockDisplayLabel(block) {
    if (block.label) {
        const short = TYPE_SHORT[block.type];
        const trunc = block.label.length > 28 ? block.label.slice(0, 28) + '…' : block.label;
        return short ? `"${trunc}" (${short})` : `"${trunc}"`;
    }
    if (block.content) {
        const clean = block.content.replace(/\{\{[^}]+\}\}/g, '[…]');
        const trunc = clean.length > 32 ? clean.slice(0, 32) + '…' : clean;
        return `"${trunc}"`;
    }
    return `[${TYPE_SHORT[block.type] ?? block.type}]`;
}
function getAvailableConditions(parentType) {
    switch(parentType){
        case 'text_input':
        case 'textarea_input':
        case 'number_input':
        case 'date_input':
            return [
                {
                    condition: 'notEmpty',
                    label: 'is filled in',
                    needsValue: false,
                    needsItemControls: false
                },
                {
                    condition: 'equals',
                    label: 'equals value',
                    needsValue: true,
                    needsItemControls: false
                }
            ];
        case 'checkbox_single':
            return [
                {
                    condition: 'checked',
                    label: 'is checked',
                    needsValue: false,
                    needsItemControls: false
                }
            ];
        case 'checkbox_group':
            return [
                {
                    condition: 'notEmpty',
                    label: 'has any selection',
                    needsValue: false,
                    needsItemControls: false
                },
                {
                    condition: 'includes',
                    label: 'includes option',
                    needsValue: true,
                    needsItemControls: false
                }
            ];
        case 'radio_group':
        case 'select_input':
            return [
                {
                    condition: 'notEmpty',
                    label: 'has any selection',
                    needsValue: false,
                    needsItemControls: false
                },
                {
                    condition: 'equals',
                    label: 'equals option',
                    needsValue: true,
                    needsItemControls: false
                }
            ];
        case 'signature':
            return [
                {
                    condition: 'notEmpty',
                    label: 'is signed',
                    needsValue: false,
                    needsItemControls: false
                }
            ];
        case 'diagnostic_record':
            return [
                {
                    condition: 'notEmpty',
                    label: 'has any diagnosis',
                    needsValue: false,
                    needsItemControls: false
                }
            ];
        case 'medication_full':
        case 'medication_mini':
            return [
                {
                    condition: 'notEmpty',
                    label: 'has any medication',
                    needsValue: false,
                    needsItemControls: false
                }
            ];
        case 'lab_record':
            return [
                {
                    condition: 'notEmpty',
                    label: 'has any result',
                    needsValue: false,
                    needsItemControls: false
                }
            ];
        case 'product_listener':
            return [
                {
                    condition: 'hasItem',
                    label: 'has product / action added',
                    needsValue: false,
                    needsItemControls: true
                }
            ];
        default:
            return [
                {
                    condition: 'notEmpty',
                    label: 'is filled in',
                    needsValue: false,
                    needsItemControls: false
                }
            ];
    }
}
function getConditionSummary(cond, allBlocks) {
    const parent = allBlocks.find((b)=>b.id === cond.dependsOn);
    const pName = parent ? getBlockDisplayLabel(parent) : '(deleted block)';
    switch(cond.condition){
        case 'notEmpty':
            {
                const verb = parent?.type === 'signature' ? 'is signed' : parent?.type === 'diagnostic_record' ? 'has a diagnosis' : parent?.type === 'medication_full' || parent?.type === 'medication_mini' ? 'has a medication' : parent?.type === 'lab_record' ? 'has a result' : parent?.type === 'checkbox_single' ? 'is checked' : 'is filled in';
                return `${pName} ${verb}`;
            }
        case 'equals':
            return `${pName} = "${cond.value ?? ''}"`;
        case 'checked':
            return `${pName} is checked`;
        case 'includes':
            return `${pName} includes "${cond.value ?? ''}"`;
        case 'hasItem':
            if (cond.itemLabel) return `${pName} has "${cond.itemLabel}"`;
            if (cond.value) return `${pName} has "${cond.value}"`;
            if (cond.itemType) return `${pName} has a ${cond.itemType}`;
            return `${pName} has any product`;
        default:
            return `${pName} has a value`;
    }
}
function shouldShowBlock(block, formAnswers, fieldActions = {}) {
    const cr = block.conditionalRendering;
    if (!cr) return true;
    const { dependsOn, condition, value, itemType } = cr;
    const parentVal = formAnswers[dependsOn];
    switch(condition){
        case 'notEmpty':
            {
                if (Array.isArray(parentVal)) return parentVal.length > 0;
                const obj = parentVal;
                // Diagnostic / medication lists store entries as arrays
                if (obj && typeof obj === 'object' && Array.isArray(obj['items'])) return obj['items'].length > 0;
                return parentVal !== undefined && parentVal !== null && parentVal !== '';
            }
        case 'equals':
            return String(parentVal ?? '') === String(value ?? '');
        case 'checked':
            return Boolean(parentVal);
        case 'includes':
            if (Array.isArray(parentVal)) return parentVal.includes(value);
            return String(parentVal ?? '').includes(String(value ?? ''));
        case 'hasItem':
            {
                // Items can come from the live field-actions state OR from saved answers
                const stateItems = fieldActions[dependsOn] ?? [];
                const rawItems = Array.isArray(parentVal?.['items']) ? parentVal['items'] : Array.isArray(parentVal) ? parentVal : [];
                const pool = stateItems.length > 0 ? stateItems : rawItems;
                const typed = itemType ? pool.filter((item)=>{
                    const t = String(item.type ?? item.product?.type ?? '').toLowerCase();
                    return t === itemType || itemType === 'consumable' && t.includes('consumable') || itemType === 'action' && !t.includes('consumable');
                }) : pool;
                if (!value && !cr.itemLabel) return typed.length > 0;
                const expectedVal = (value || '').trim().toLowerCase();
                const expectedLabel = (cr.itemLabel || '').trim().toLowerCase();
                return typed.some((item)=>{
                    const n = String(item.name ?? item.product?.name ?? '').toLowerCase();
                    const ids = [
                        item.id,
                        item.catalogProductId,
                        item.backendId,
                        item.rawData?.id,
                        item.rawData?.product?.id,
                        item.product?.id
                    ].filter(Boolean).map((id)=>String(id).toLowerCase());
                    const matchesId = expectedVal ? ids.includes(expectedVal) : false;
                    const matchesName = expectedVal ? n === expectedVal || n.includes(expectedVal) : false;
                    const matchesLabel = expectedLabel ? n === expectedLabel || n.includes(expectedLabel) : false;
                    return matchesId || matchesName || matchesLabel;
                });
            }
        default:
            return true;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/formbuilder/renderer/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "INLINE_WIDTH",
    ()=>INLINE_WIDTH,
    "collectAnswerableBlocks",
    ()=>collectAnswerableBlocks,
    "getBlockErrorMessage",
    ()=>getBlockErrorMessage,
    "isBlockViolating",
    ()=>isBlockViolating,
    "replacePlaceholders",
    ()=>replacePlaceholders,
    "shouldRenderBlock",
    ()=>shouldRenderBlock,
    "splitInitialAnswers",
    ()=>splitInitialAnswers,
    "uid",
    ()=>uid
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$formbuilder$2d$conditional$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/formbuilder-conditional.ts [app-client] (ecmascript)");
;
const INLINE_WIDTH = {
    xs: "w-14",
    sm: "w-24",
    md: "w-40",
    lg: "w-56",
    full: "w-full"
};
function uid() {
    return `_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}
function splitInitialAnswers(initialAnswers = {}) {
    const blockAnswers = {};
    const inlineAnswers = {};
    Object.entries(initialAnswers).forEach(([key, value])=>{
        if (key.includes("__")) {
            inlineAnswers[key] = typeof value === "string" ? value : String(value ?? "");
            return;
        }
        blockAnswers[key] = value;
    });
    return {
        blockAnswers,
        inlineAnswers
    };
}
function isBlockViolating(block, answers) {
    const minChars = block.minChars ?? block.minLength;
    const hasMinChars = typeof minChars === "number" && minChars > 0;
    if (!block.required && !hasMinChars) return false;
    const v = answers[block.id];
    if (v === undefined || v === null) return true;
    switch(block.type){
        case "text_input":
        case "textarea_input":
        case "number_input":
            {
                const strVal = String(v).trim();
                if (!strVal) return !!block.required;
                if (hasMinChars && strVal.length < minChars) return true;
                return false;
            }
        case "date_input":
            return !v || String(v).trim() === "";
        case "checkbox_single":
            return !v;
        case "checkbox_group":
        case "radio_group":
            return !Array.isArray(v) ? !v : v.length === 0;
        case "select_input":
            return !v || String(v) === "";
        case "signature":
            return !v || String(v) === "";
        case "diagnostic_record":
        case "medication_full":
        case "medication_mini":
        case "product_listener":
        case "file_upload":
            return !Array.isArray(v) || v.length === 0;
        case "lab_record":
            {
                const typed = v;
                if (!typed) return true;
                return !Object.values(typed).some((rv)=>rv.value || rv.result);
            }
        default:
            return false;
    }
}
function getBlockErrorMessage(block, answers) {
    if (!isBlockViolating(block, answers)) return undefined;
    const v = answers[block.id];
    const minChars = block.minChars ?? block.minLength;
    if (typeof minChars === "number" && minChars > 0) {
        const strVal = v !== undefined && v !== null ? String(v).trim() : "";
        if (!strVal) {
            return block.type === "number_input" ? `This field is required (minimum ${minChars} digits).` : `This field is required (minimum ${minChars} characters).`;
        }
        if (strVal.length < minChars) {
            return block.type === "number_input" ? `Minimum ${minChars} digits required (currently ${strVal.length}).` : `Minimum ${minChars} characters required (currently ${strVal.length}).`;
        }
    }
    if (block.type === "signature") {
        return "Signature is required.";
    }
    if (block.type === "file_upload") {
        return "At least one file is required.";
    }
    return "This field is required.";
}
function collectAnswerableBlocks(blocks) {
    const result = [];
    for (const b of blocks){
        if (b.type === "layout") {
            for (const col of b.layoutColumns ?? []){
                result.push(...collectAnswerableBlocks(col.blocks));
            }
        } else {
            result.push(b);
        }
    }
    return result;
}
function shouldRenderBlock(block, answers, getBlockHandlers, allBlocks) {
    const cr = block.conditionalRendering;
    if (!cr) return true;
    const fieldActions = {};
    const effectiveAnswers = {
        ...answers
    };
    if (getBlockHandlers && cr.dependsOn) {
        const parentBlock = allBlocks?.find((b)=>b.id === cr.dependsOn) ?? {
            id: cr.dependsOn,
            type: "product_listener"
        };
        const handlers = getBlockHandlers(parentBlock);
        if (handlers?.productActions) {
            fieldActions[cr.dependsOn] = handlers.productActions.map((a)=>({
                    id: a.id,
                    catalogProductId: a.rawData?.product?.id || a.rawData?.id || a.catalogProductId,
                    backendId: a.backendId,
                    name: a.name || a.rawData?.product?.name,
                    type: a.type,
                    rawData: a.rawData,
                    product: a.rawData?.product
                }));
        }
        if (handlers?.diagnostics && handlers.diagnostics.length > 0) {
            effectiveAnswers[cr.dependsOn] = handlers.diagnostics;
        }
        if (handlers?.medicationsFull && handlers.medicationsFull.length > 0) {
            effectiveAnswers[cr.dependsOn] = handlers.medicationsFull;
        }
        if (handlers?.medicationsMini && handlers.medicationsMini.length > 0) {
            effectiveAnswers[cr.dependsOn] = handlers.medicationsMini;
        }
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$formbuilder$2d$conditional$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shouldShowBlock"])(block, effectiveAnswers, fieldActions);
}
function replacePlaceholders(text, context) {
    if (!text) return "";
    let result = text;
    const mapping = {
        "{{doctor_name}}": context.doctor?.fullName || "",
        "{{doctor_title}}": context.doctor?.title || "",
        "{{clinic_name}}": context.clinicProfile?.name || "",
        "{{clinic_address}}": context.clinicProfile?.address || "",
        "{{clinic_phone}}": context.clinicProfile?.phone || "",
        "{{date_today}}": new Date().toLocaleDateString()
    };
    Object.entries(mapping).forEach(([key, val])=>{
        result = result.split(key).join(val);
    });
    return result;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/formbuilder/renderer/field-renderers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AnswerInlineField",
    ()=>AnswerInlineField,
    "ChoiceGroup",
    ()=>ChoiceGroup,
    "FieldShell",
    ()=>FieldShell,
    "SignatureCanvas",
    ()=>SignatureCanvas
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/formbuilder/renderer/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function ReadonlyValue({ value, emptyLabel = "—" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "inline-flex items-center min-h-7 px-2.5 py-0.5 text-sm rounded-md border border-slate-200 dark:border-slate-700/80 bg-slate-100/90 dark:bg-slate-800/80 text-foreground font-medium shadow-xs",
        children: value || emptyLabel
    }, void 0, false, {
        fileName: "[project]/components/formbuilder/renderer/field-renderers.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
_c = ReadonlyValue;
function SignatureCanvas({ value, onChange, isError, edit }) {
    _s();
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const drawing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const lastPos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SignatureCanvas.useEffect": ()=>{
            if (!value || !canvasRef.current || edit) return;
            const ctx = canvasRef.current.getContext("2d");
            if (!ctx) return;
            const img = new Image();
            img.onload = ({
                "SignatureCanvas.useEffect": ()=>ctx.drawImage(img, 0, 0)
            })["SignatureCanvas.useEffect"];
            img.src = value;
        }
    }["SignatureCanvas.useEffect"], [
        value,
        edit
    ]);
    if (!edit) {
        return value ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-1",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                src: value,
                alt: "Signature",
                className: "max-w-full h-20 object-contain border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg bg-slate-100/80 dark:bg-slate-900/70 shadow-xs"
            }, void 0, false, {
                fileName: "[project]/components/formbuilder/renderer/field-renderers.tsx",
                lineNumber: 49,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/formbuilder/renderer/field-renderers.tsx",
            lineNumber: 48,
            columnNumber: 7
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-20 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-100/80 dark:bg-slate-900/70 flex items-center justify-center text-xs text-muted-foreground shadow-xs",
            children: "No signature"
        }, void 0, false, {
            fileName: "[project]/components/formbuilder/renderer/field-renderers.tsx",
            lineNumber: 56,
            columnNumber: 7
        }, this);
    }
    const getPos = (e, canvas)=>{
        const rect = canvas.getBoundingClientRect();
        if ("touches" in e) {
            const t = e.touches[0];
            return {
                x: t.clientX - rect.left,
                y: t.clientY - rect.top
            };
        }
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };
    const startDraw = (e)=>{
        if (!canvasRef.current) return;
        drawing.current = true;
        lastPos.current = getPos(e, canvasRef.current);
    };
    const draw = (e)=>{
        if (!drawing.current || !canvasRef.current) return;
        e.preventDefault();
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;
        const pos = getPos(e, canvasRef.current);
        ctx.beginPath();
        ctx.moveTo(lastPos.current.x, lastPos.current.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = "#1e293b";
        ctx.lineWidth = 1.8;
        ctx.lineCap = "round";
        ctx.stroke();
        lastPos.current = pos;
    };
    const endDraw = ()=>{
        if (!drawing.current || !canvasRef.current) return;
        drawing.current = false;
        onChange(canvasRef.current.toDataURL());
    };
    const clear = ()=>{
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext("2d");
        ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        onChange("");
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-1",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative group",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                        ref: canvasRef,
                        width: 400,
                        height: 80,
                        className: `w-full border-2 border-dashed rounded-lg cursor-crosshair touch-none transition-colors shadow-xs ${value ? "border-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20" : isError ? "border-red-400 bg-red-50/50 dark:bg-red-950/30" : "border-slate-300 dark:border-slate-700 bg-slate-100/80 dark:bg-slate-900/70 hover:bg-slate-100 dark:hover:bg-slate-900"}`,
                        onMouseDown: startDraw,
                        onMouseMove: draw,
                        onMouseUp: endDraw,
                        onMouseLeave: endDraw,
                        onTouchStart: startDraw,
                        onTouchMove: draw,
                        onTouchEnd: endDraw
                    }, void 0, false, {
                        fileName: "[project]/components/formbuilder/renderer/field-renderers.tsx",
                        lineNumber: 115,
                        columnNumber: 9
                    }, this),
                    value && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-2 right-2 pointer-events-none animate-in zoom-in duration-300",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                            className: "h-4 w-4 text-emerald-500"
                        }, void 0, false, {
                            fileName: "[project]/components/formbuilder/renderer/field-renderers.tsx",
                            lineNumber: 136,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/formbuilder/renderer/field-renderers.tsx",
                        lineNumber: 135,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/formbuilder/renderer/field-renderers.tsx",
                lineNumber: 114,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[11px] text-muted-foreground/60",
                        children: "Sign above"
                    }, void 0, false, {
                        fileName: "[project]/components/formbuilder/renderer/field-renderers.tsx",
                        lineNumber: 141,
                        columnNumber: 9
                    }, this),
                    value && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: clear,
                        className: "text-[11px] text-muted-foreground hover:text-destructive transition-colors font-medium",
                        children: "Clear"
                    }, void 0, false, {
                        fileName: "[project]/components/formbuilder/renderer/field-renderers.tsx",
                        lineNumber: 143,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/formbuilder/renderer/field-renderers.tsx",
                lineNumber: 140,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/formbuilder/renderer/field-renderers.tsx",
        lineNumber: 113,
        columnNumber: 5
    }, this);
}
_s(SignatureCanvas, "9wRPfplEZnfgA8YrK4HeQgV2lCs=");
_c1 = SignatureCanvas;
function AnswerInlineField({ field, value, onChange, isError, edit }) {
    const w = __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INLINE_WIDTH"][field.width ?? "sm"];
    const errorClass = isError ? "border-red-400 ring-2 ring-red-400/25 bg-red-50/70 dark:bg-red-950/40 text-foreground" : "border-teal-300/80 dark:border-teal-600/70 bg-teal-50/80 dark:bg-teal-950/60 hover:bg-teal-100/60 dark:hover:bg-teal-950/80 focus:bg-background dark:focus:bg-slate-950 text-foreground shadow-xs";
    const base = `${w} h-7 px-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400/30 transition-colors ${errorClass}`;
    if (!edit) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ReadonlyValue, {
            value: value,
            emptyLabel: "—"
        }, void 0, false, {
            fileName: "[project]/components/formbuilder/renderer/field-renderers.tsx",
            lineNumber: 176,
            columnNumber: 12
        }, this);
    }
    if (field.fieldType === "number") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            type: "number",
            placeholder: field.placeholder || "",
            className: `${base} inline-block`,
            value: value,
            onChange: (e)=>onChange(e.target.value)
        }, void 0, false, {
            fileName: "[project]/components/formbuilder/renderer/field-renderers.tsx",
            lineNumber: 181,
            columnNumber: 7
        }, this);
    }
    if (field.fieldType === "date") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            type: "date",
            className: `${base} inline-block`,
            value: value,
            onChange: (e)=>onChange(e.target.value)
        }, void 0, false, {
            fileName: "[project]/components/formbuilder/renderer/field-renderers.tsx",
            lineNumber: 193,
            columnNumber: 7
        }, this);
    }
    if (field.fieldType === "select") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
            className: `${base} inline-block`,
            value: value,
            onChange: (e)=>onChange(e.target.value),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                    value: "",
                    children: "Select…"
                }, void 0, false, {
                    fileName: "[project]/components/formbuilder/renderer/field-renderers.tsx",
                    lineNumber: 209,
                    columnNumber: 9
                }, this),
                (field.options ?? []).map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: opt,
                        children: opt
                    }, opt, false, {
                        fileName: "[project]/components/formbuilder/renderer/field-renderers.tsx",
                        lineNumber: 211,
                        columnNumber: 11
                    }, this))
            ]
        }, void 0, true, {
            fileName: "[project]/components/formbuilder/renderer/field-renderers.tsx",
            lineNumber: 204,
            columnNumber: 7
        }, this);
    }
    if (field.fieldType === "textarea") {
        return edit ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
            placeholder: field.placeholder || "",
            rows: 2,
            className: `w-full px-2.5 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400/30 resize-none mt-1 transition-colors ${errorClass}`,
            value: value,
            onChange: (e)=>onChange(e.target.value)
        }, void 0, false, {
            fileName: "[project]/components/formbuilder/renderer/field-renderers.tsx",
            lineNumber: 221,
            columnNumber: 7
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "inline-block min-w-32 px-2.5 py-1 text-sm rounded-md border border-slate-200 dark:border-slate-700/80 bg-slate-100/80 dark:bg-slate-800/80 whitespace-pre-wrap shadow-xs",
            children: value || "—"
        }, void 0, false, {
            fileName: "[project]/components/formbuilder/renderer/field-renderers.tsx",
            lineNumber: 229,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: "text",
        placeholder: field.placeholder || "",
        className: `${base} inline-block`,
        value: value,
        onChange: (e)=>onChange(e.target.value)
    }, void 0, false, {
        fileName: "[project]/components/formbuilder/renderer/field-renderers.tsx",
        lineNumber: 236,
        columnNumber: 5
    }, this);
}
_c2 = AnswerInlineField;
function FieldShell({ label, required, children, error }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "my-3",
        children: [
            label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "text-sm leading-5 font-medium block mb-1.5",
                children: [
                    label,
                    required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-red-500 ml-1",
                        children: "*"
                    }, void 0, false, {
                        fileName: "[project]/components/formbuilder/renderer/field-renderers.tsx",
                        lineNumber: 262,
                        columnNumber: 24
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/formbuilder/renderer/field-renderers.tsx",
                lineNumber: 260,
                columnNumber: 9
            }, this),
            children,
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs text-red-500 mt-1",
                children: error
            }, void 0, false, {
                fileName: "[project]/components/formbuilder/renderer/field-renderers.tsx",
                lineNumber: 266,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/formbuilder/renderer/field-renderers.tsx",
        lineNumber: 258,
        columnNumber: 5
    }, this);
}
_c3 = FieldShell;
function ChoiceGroup({ type, block, value, isError, edit, onChange }) {
    const selected = value;
    const toggle = (opt)=>{
        if (type === "checkbox") {
            const current = Array.isArray(selected) ? selected : [];
            onChange(current.includes(opt) ? current.filter((o)=>o !== opt) : [
                ...current,
                opt
            ]);
            return;
        }
        onChange(opt);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "my-3",
        children: [
            block.label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "text-sm leading-5 font-medium block mb-1.5 text-foreground",
                children: [
                    block.label,
                    block.required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-red-500 ml-1",
                        children: "*"
                    }, void 0, false, {
                        fileName: "[project]/components/formbuilder/renderer/field-renderers.tsx",
                        lineNumber: 309,
                        columnNumber: 30
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/formbuilder/renderer/field-renderers.tsx",
                lineNumber: 307,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `space-y-1.5 ${isError ? "rounded-lg p-2 -m-2 ring-2 ring-red-400/30 bg-red-50/40 dark:bg-red-950/20" : ""}`,
                children: (block.options ?? []).map((opt)=>{
                    const isChecked = type === "checkbox" ? Array.isArray(selected) && selected.includes(opt) : selected === opt;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: `flex items-center gap-2.5 text-sm px-3 py-2 rounded-lg border transition-all ${isChecked ? "border-primary/50 bg-primary/5 dark:bg-primary/10 text-foreground font-medium shadow-xs" : "border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 text-foreground hover:bg-slate-100/80 dark:hover:bg-slate-900"} ${!edit ? "cursor-default opacity-85" : "cursor-pointer"}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: type,
                                name: type === "radio" ? `radio_${block.id}` : undefined,
                                checked: isChecked,
                                onChange: ()=>toggle(opt),
                                className: "h-4 w-4 rounded border-2 border-slate-300 dark:border-slate-600 accent-primary cursor-pointer disabled:cursor-default",
                                disabled: !edit
                            }, void 0, false, {
                                fileName: "[project]/components/formbuilder/renderer/field-renderers.tsx",
                                lineNumber: 329,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex-1",
                                children: opt
                            }, void 0, false, {
                                fileName: "[project]/components/formbuilder/renderer/field-renderers.tsx",
                                lineNumber: 337,
                                columnNumber: 15
                            }, this)
                        ]
                    }, opt, true, {
                        fileName: "[project]/components/formbuilder/renderer/field-renderers.tsx",
                        lineNumber: 321,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/components/formbuilder/renderer/field-renderers.tsx",
                lineNumber: 312,
                columnNumber: 7
            }, this),
            isError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs text-red-500 mt-1.5",
                children: type === "checkbox" ? "Please select at least one option." : "Please select an option."
            }, void 0, false, {
                fileName: "[project]/components/formbuilder/renderer/field-renderers.tsx",
                lineNumber: 343,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/formbuilder/renderer/field-renderers.tsx",
        lineNumber: 305,
        columnNumber: 5
    }, this);
}
_c4 = ChoiceGroup;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "ReadonlyValue");
__turbopack_context__.k.register(_c1, "SignatureCanvas");
__turbopack_context__.k.register(_c2, "AnswerInlineField");
__turbopack_context__.k.register(_c3, "FieldShell");
__turbopack_context__.k.register(_c4, "ChoiceGroup");
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
"[project]/components/ui/textarea.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Textarea",
    ()=>Textarea
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
function Textarea({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
        "data-slot": "textarea",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-20 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/textarea.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Textarea;
;
var _c;
__turbopack_context__.k.register(_c, "Textarea");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardAction",
    ()=>CardAction,
    "CardContent",
    ()=>CardContent,
    "CardDescription",
    ()=>CardDescription,
    "CardFooter",
    ()=>CardFooter,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
function Card({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Card;
function CardHeader({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
_c1 = CardHeader;
function CardTitle({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-title",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('leading-none font-semibold', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
_c2 = CardTitle;
function CardDescription({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-description",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-muted-foreground text-sm', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
_c3 = CardDescription;
function CardAction({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-action",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
_c4 = CardAction;
function CardContent({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-content",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('px-6', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
_c5 = CardContent;
function CardFooter({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-footer",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex items-center px-6 [.border-t]:pt-6', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
_c6 = CardFooter;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6;
__turbopack_context__.k.register(_c, "Card");
__turbopack_context__.k.register(_c1, "CardHeader");
__turbopack_context__.k.register(_c2, "CardTitle");
__turbopack_context__.k.register(_c3, "CardDescription");
__turbopack_context__.k.register(_c4, "CardAction");
__turbopack_context__.k.register(_c5, "CardContent");
__turbopack_context__.k.register(_c6, "CardFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/form-actions-display.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FormActionsDisplay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pill$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pill$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pill.js [app-client] (ecmascript) <export default as Pill>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/minus.js [app-client] (ecmascript) <export default as Minus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-toastify/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hooks/visits/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$department$2d$mutations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/visits/department-mutations.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$billing$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/billing/hooks.ts [app-client] (ecmascript)");
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
function FormActionsDisplay({ items, label = "Products", hideLabel = false, bold = false, center = false, italic = false, underline = false, visitId, departmentId, onRemove, onRestore, onUpdateQuantity, readOnly = false }) {
    _s();
    const { updateQuantity } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$department$2d$mutations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUpdateProductQuantity"])();
    const { removeProduct } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$department$2d$mutations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRemoveProductFromVisitDepartment"])();
    const { confirmVisitDepartmentProduct } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$billing$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useConfirmVisitDepartmentProduct"])();
    const [confirmedIds, setConfirmedIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    // Track which item's qty is being directly edited, and the draft string value
    const [editingId, setEditingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [draftQty, setDraftQty] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // Track which item has an in-flight backend request so its controls disable
    const [busyId, setBusyId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const canUseServer = Boolean(visitId && departmentId);
    const updateServerQuantity = async (item, nextQty)=>{
        if (!canUseServer) {
            onUpdateQuantity && onUpdateQuantity(item.id, nextQty);
            return;
        }
        setBusyId(item.id);
        try {
            if (!item.backendId) {
                throw new Error(`No backendId found for item: ${item.name}. This item may not have been properly added to the visit.`);
            }
            await updateQuantity(item.backendId, nextQty);
            onUpdateQuantity && onUpdateQuantity(item.id, nextQty);
        } catch (e) {
            console.error('update quantity error', e);
        } finally{
            setBusyId(null);
        }
    };
    const removeServerItem = async (item)=>{
        if (!canUseServer) {
            onRemove && onRemove(item.id);
            return;
        }
        setBusyId(item.id);
        try {
            if (!item.backendId) {
                throw new Error(`No backendId found for item: ${item.name}`);
            }
            const response = await removeProduct(item.backendId);
            if (response?.status !== 'SUCCESS') {
                throw new Error(response?.message || 'Failed to remove visit department product');
            }
            onRemove && onRemove(item.id);
        } catch (e) {
            console.error('remove item error', e);
        } finally{
            setBusyId(null);
        }
    };
    const renderItem = (item)=>{
        const isRemoved = item.removedFromVisit === true;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `group rounded-lg border transition-all duration-200 overflow-hidden ${isRemoved ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-300 dark:border-amber-500/40' : 'bg-white dark:bg-slate-900 border-orange-100 dark:border-orange-900/30 hover:border-orange-300 dark:hover:border-orange-700/50 hover:shadow-sm'}`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between gap-2 px-3 py-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2 min-w-0 flex-1",
                            children: [
                                isRemoved && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                    className: "h-3 w-3 shrink-0 text-amber-500"
                                }, void 0, false, {
                                    fileName: "[project]/components/form-actions-display.tsx",
                                    lineNumber: 129,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: `text-sm font-medium truncate leading-tight ${isRemoved ? 'line-through text-muted-foreground' : ''}`,
                                    children: item.name
                                }, void 0, false, {
                                    fileName: "[project]/components/form-actions-display.tsx",
                                    lineNumber: 131,
                                    columnNumber: 13
                                }, this),
                                item.billingConfirmationStatus === "PENDING_OPERATOR_CONFIRMATION" && !confirmedIds.has(item.id) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "shrink-0 text-[11px] bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 px-1.5 py-0.5 rounded-full font-medium",
                                    children: "Added in Billing"
                                }, void 0, false, {
                                    fileName: "[project]/components/form-actions-display.tsx",
                                    lineNumber: 136,
                                    columnNumber: 17
                                }, this),
                                (confirmedIds.has(item.id) || item.billingConfirmationStatus === "CONFIRMED" || item.confirmedByName) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "shrink-0 text-[11px] bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 px-1.5 py-0.5 rounded-full font-medium",
                                    children: item.confirmedByName ? `Confirmed by ${item.confirmedByName}` : "Confirmed"
                                }, void 0, false, {
                                    fileName: "[project]/components/form-actions-display.tsx",
                                    lineNumber: 143,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/form-actions-display.tsx",
                            lineNumber: 127,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-1.5 shrink-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs font-semibold tabular-nums text-muted-foreground bg-muted/60 rounded-full px-2 py-0.5 leading-none",
                                    children: [
                                        "×",
                                        item.quantity
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/form-actions-display.tsx",
                                    lineNumber: 152,
                                    columnNumber: 13
                                }, this),
                                item.billingConfirmationStatus === "PENDING_OPERATOR_CONFIRMATION" && !confirmedIds.has(item.id) && item.backendId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    type: "button",
                                    size: "sm",
                                    variant: "outline",
                                    className: "h-6 text-[12px] px-2 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 gap-1 font-medium",
                                    disabled: busyId === item.id,
                                    onClick: async (e)=>{
                                        e.stopPropagation();
                                        if (!item.backendId) return;
                                        setBusyId(item.id);
                                        try {
                                            const res = await confirmVisitDepartmentProduct(item.backendId);
                                            if (res.status === "SUCCESS") {
                                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("Product accepted");
                                                setConfirmedIds((prev)=>new Set([
                                                        ...prev,
                                                        item.id
                                                    ]));
                                            } else {
                                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(res.message || "Failed to accept product");
                                            }
                                        } catch (err) {
                                            console.error("Error accepting product:", err);
                                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Failed to accept product");
                                        } finally{
                                            setBusyId(null);
                                        }
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                            className: "h-3 w-3"
                                        }, void 0, false, {
                                            fileName: "[project]/components/form-actions-display.tsx",
                                            lineNumber: 184,
                                            columnNumber: 19
                                        }, this),
                                        "Accept"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/form-actions-display.tsx",
                                    lineNumber: 158,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/form-actions-display.tsx",
                            lineNumber: 150,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/form-actions-display.tsx",
                    lineNumber: 126,
                    columnNumber: 9
                }, this),
                readOnly ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-3 pb-2 pt-0",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {}, void 0, false, {
                                fileName: "[project]/components/form-actions-display.tsx",
                                lineNumber: 195,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-muted-foreground",
                                children: isRemoved ? 'Removed' : 'Saved'
                            }, void 0, false, {
                                fileName: "[project]/components/form-actions-display.tsx",
                                lineNumber: 196,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/form-actions-display.tsx",
                        lineNumber: 194,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/form-actions-display.tsx",
                    lineNumber: 193,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-200",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "overflow-hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `flex items-center justify-between gap-2 px-3 pb-2 pt-0 ${isRemoved ? 'opacity-60' : ''}`,
                            children: [
                                item.isQuantifiable !== false ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "outline",
                                            size: "sm",
                                            className: "h-6 w-6 p-0 rounded-full",
                                            disabled: isRemoved || busyId === item.id,
                                            onClick: ()=>{
                                                if (isRemoved || busyId === item.id) return;
                                                const next = Math.max(1, item.quantity - 1);
                                                canUseServer && item.backendId ? updateServerQuantity(item, next) : onUpdateQuantity?.(item.id, next);
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__["Minus"], {
                                                className: "h-3 w-3"
                                            }, void 0, false, {
                                                fileName: "[project]/components/form-actions-display.tsx",
                                                lineNumber: 219,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/form-actions-display.tsx",
                                            lineNumber: 206,
                                            columnNumber: 19
                                        }, this),
                                        editingId === item.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            ref: inputRef,
                                            type: "number",
                                            min: 1,
                                            value: draftQty,
                                            disabled: busyId === item.id,
                                            onChange: (e)=>setDraftQty(e.target.value),
                                            onFocus: (e)=>e.target.select(),
                                            onBlur: ()=>{
                                                const parsed = parseInt(draftQty, 10);
                                                const next = Number.isFinite(parsed) && parsed >= 1 ? parsed : item.quantity;
                                                if (next !== item.quantity) {
                                                    canUseServer && item.backendId ? updateServerQuantity(item, next) : onUpdateQuantity?.(item.id, next);
                                                }
                                                setEditingId(null);
                                            },
                                            onKeyDown: (e)=>{
                                                if (e.key === 'Enter') {
                                                    ;
                                                    e.target.blur();
                                                }
                                                if (e.key === 'Escape') {
                                                    setEditingId(null);
                                                }
                                            },
                                            className: "w-8 text-center text-xs font-medium tabular-nums bg-transparent border-b border-primary/60 outline-none focus:border-primary [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                        }, void 0, false, {
                                            fileName: "[project]/components/form-actions-display.tsx",
                                            lineNumber: 224,
                                            columnNumber: 21
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs tabular-nums font-medium w-8 text-center cursor-text hover:text-primary transition-colors select-none",
                                            title: "Click to edit quantity",
                                            onClick: ()=>{
                                                if (isRemoved || busyId === item.id) return;
                                                setDraftQty(String(item.quantity));
                                                setEditingId(item.id);
                                                // focus after render
                                                setTimeout(()=>inputRef.current?.focus(), 0);
                                            },
                                            children: item.quantity
                                        }, void 0, false, {
                                            fileName: "[project]/components/form-actions-display.tsx",
                                            lineNumber: 253,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "outline",
                                            size: "sm",
                                            className: "h-6 w-6 p-0 rounded-full",
                                            disabled: isRemoved || busyId === item.id,
                                            onClick: ()=>{
                                                if (isRemoved || busyId === item.id) return;
                                                const next = item.quantity + 1;
                                                canUseServer && item.backendId ? updateServerQuantity(item, next) : onUpdateQuantity?.(item.id, next);
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                className: "h-3 w-3"
                                            }, void 0, false, {
                                                fileName: "[project]/components/form-actions-display.tsx",
                                                lineNumber: 281,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/form-actions-display.tsx",
                                            lineNumber: 268,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/form-actions-display.tsx",
                                    lineNumber: 205,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {}, void 0, false, {
                                    fileName: "[project]/components/form-actions-display.tsx",
                                    lineNumber: 285,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-1",
                                    children: [
                                        isRemoved && onRestore ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "secondary",
                                            size: "sm",
                                            className: "h-6 px-2 text-[12px]",
                                            onClick: ()=>onRestore(item.id),
                                            children: "Restore"
                                        }, void 0, false, {
                                            fileName: "[project]/components/form-actions-display.tsx",
                                            lineNumber: 291,
                                            columnNumber: 19
                                        }, this) : null,
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "ghost",
                                            size: "sm",
                                            className: "h-6 w-6 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive",
                                            disabled: busyId === item.id,
                                            onClick: ()=>{
                                                if (isRemoved) {
                                                    onRemove?.(item.id);
                                                    return;
                                                }
                                                canUseServer && item.backendId ? removeServerItem(item) : onRemove?.(item.id);
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                className: "h-3.5 w-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/components/form-actions-display.tsx",
                                                lineNumber: 315,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/form-actions-display.tsx",
                                            lineNumber: 300,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/form-actions-display.tsx",
                                    lineNumber: 289,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/form-actions-display.tsx",
                            lineNumber: 202,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/form-actions-display.tsx",
                        lineNumber: 201,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/form-actions-display.tsx",
                    lineNumber: 200,
                    columnNumber: 11
                }, this)
            ]
        }, item.id, true, {
            fileName: "[project]/components/form-actions-display.tsx",
            lineNumber: 117,
            columnNumber: 7
        }, this);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-3",
        children: [
            !hideLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: `text-sm font-medium flex items-center gap-2 ${bold ? 'font-bold' : ''} ${center ? 'justify-center' : ''} ${italic ? 'italic' : ''} ${underline ? 'underline' : ''}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pill$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pill$3e$__["Pill"], {
                        className: "h-4 w-4 text-orange-500"
                    }, void 0, false, {
                        fileName: "[project]/components/form-actions-display.tsx",
                        lineNumber: 332,
                        columnNumber: 11
                    }, this),
                    label
                ]
            }, void 0, true, {
                fileName: "[project]/components/form-actions-display.tsx",
                lineNumber: 329,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                className: "p-3 bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/30",
                children: items.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 gap-2",
                    children: items.map(renderItem)
                }, void 0, false, {
                    fileName: "[project]/components/form-actions-display.tsx",
                    lineNumber: 338,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center py-5",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-muted-foreground",
                        children: "No products added yet"
                    }, void 0, false, {
                        fileName: "[project]/components/form-actions-display.tsx",
                        lineNumber: 343,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/form-actions-display.tsx",
                    lineNumber: 342,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/form-actions-display.tsx",
                lineNumber: 336,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/form-actions-display.tsx",
        lineNumber: 327,
        columnNumber: 5
    }, this);
}
_s(FormActionsDisplay, "7cU9YMhkg0jCJwmXcH9givccle0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$department$2d$mutations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUpdateProductQuantity"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$department$2d$mutations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRemoveProductFromVisitDepartment"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$billing$2f$hooks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useConfirmVisitDepartmentProduct"]
    ];
});
_c = FormActionsDisplay;
var _c;
__turbopack_context__.k.register(_c, "FormActionsDisplay");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/visit-product-lock.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "VISIT_PRODUCT_CHANGES_LOCKED_MESSAGE",
    ()=>VISIT_PRODUCT_CHANGES_LOCKED_MESSAGE,
    "isVisitOrDepartmentClosedForProducts",
    ()=>isVisitOrDepartmentClosedForProducts
]);
const VISIT_PRODUCT_CHANGES_LOCKED_MESSAGE = 'This visit or department is completed. You can still edit form answers; products are view-only.';
function isVisitOrDepartmentClosedForProducts(visitStatus, visitDepartmentStatus) {
    const normalizedVisitStatus = String(visitStatus || '').toUpperCase();
    const normalizedDepartmentStatus = String(visitDepartmentStatus || '').toUpperCase();
    return normalizedVisitStatus === 'CANCELLED' || normalizedDepartmentStatus === 'COMPLETED' || normalizedDepartmentStatus === 'CANCELLED' || normalizedDepartmentStatus === 'FINALISED';
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/consultation/product-locked-tooltip.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProductLockedTooltip",
    ()=>ProductLockedTooltip
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/tooltip.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visit$2d$product$2d$lock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/visit-product-lock.ts [app-client] (ecmascript)");
'use client';
;
;
;
function ProductLockedTooltip({ locked, message = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visit$2d$product$2d$lock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VISIT_PRODUCT_CHANGES_LOCKED_MESSAGE"], children, className }) {
    if (!locked) {
        return children;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                asChild: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: className || 'inline-flex',
                    children: children
                }, void 0, false, {
                    fileName: "[project]/components/consultation/product-locked-tooltip.tsx",
                    lineNumber: 27,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/consultation/product-locked-tooltip.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipContent"], {
                side: "top",
                className: "max-w-xs",
                children: message
            }, void 0, false, {
                fileName: "[project]/components/consultation/product-locked-tooltip.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/consultation/product-locked-tooltip.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
_c = ProductLockedTooltip;
var _c;
__turbopack_context__.k.register(_c, "ProductLockedTooltip");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/formbuilder/renderer/medical-shared.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EntryList",
    ()=>EntryList,
    "PTYPE_COLOR",
    ()=>PTYPE_COLOR,
    "PTYPE_LABEL",
    ()=>PTYPE_LABEL
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
;
;
const PTYPE_LABEL = {
    DRUG: "Drug",
    MEDICAL_ACT: "Procedure",
    BIOLOGICAL_ACT: "Biological",
    CONSUMABLE_DEVICE: "Consumable"
};
const PTYPE_COLOR = {
    DRUG: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    MEDICAL_ACT: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    BIOLOGICAL_ACT: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    CONSUMABLE_DEVICE: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
};
function EntryList({ items, render, onRemove, emptyLabel }) {
    if (items.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-xs text-muted-foreground italic",
            children: emptyLabel
        }, void 0, false, {
            fileName: "[project]/components/formbuilder/renderer/medical-shared.tsx",
            lineNumber: 33,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-1.5 pt-2 border-t border-border/60",
        children: items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start gap-2 px-3 py-2 rounded-lg border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 text-sm shadow-xs transition-colors",
                children: [
                    render(item),
                    onRemove && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>onRemove(item.id),
                        className: "mt-0.5 p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 transition-colors",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                            className: "h-3.5 w-3.5"
                        }, void 0, false, {
                            fileName: "[project]/components/formbuilder/renderer/medical-shared.tsx",
                            lineNumber: 49,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/formbuilder/renderer/medical-shared.tsx",
                        lineNumber: 44,
                        columnNumber: 13
                    }, this)
                ]
            }, item.id, true, {
                fileName: "[project]/components/formbuilder/renderer/medical-shared.tsx",
                lineNumber: 38,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/components/formbuilder/renderer/medical-shared.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
_c = EntryList;
var _c;
__turbopack_context__.k.register(_c, "EntryList");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/formbuilder/renderer/product-listener-sync.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProductListenerWithVisitSync",
    ()=>ProductListenerWithVisitSync
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$form$2d$actions$2d$display$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/form-actions-display.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$consultation$2f$product$2d$locked$2d$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/consultation/product-locked-tooltip.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$medical$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/formbuilder/renderer/medical-shared.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
"use client";
;
;
;
;
;
;
;
function ProductListenerWithVisitSync({ block, value, onChange, isError, edit, handlers, visitId, departmentId }) {
    const locked = handlers.productsLocked ?? false;
    const actions = handlers.productActions ?? [];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "my-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "text-sm leading-5 font-medium flex items-center gap-1.5 mb-1.5 text-foreground",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                        className: "h-3.5 w-3.5 text-orange-600"
                    }, void 0, false, {
                        fileName: "[project]/components/formbuilder/renderer/product-listener-sync.tsx",
                        lineNumber: 38,
                        columnNumber: 9
                    }, this),
                    block.label || "Products / Procedures",
                    block.required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-red-500",
                        children: "*"
                    }, void 0, false, {
                        fileName: "[project]/components/formbuilder/renderer/product-listener-sync.tsx",
                        lineNumber: 40,
                        columnNumber: 28
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/formbuilder/renderer/product-listener-sync.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `space-y-3 p-3.5 rounded-xl border transition-colors shadow-xs ${isError ? "border-red-400 bg-red-50/40 dark:bg-red-950/20" : "border-orange-200/80 dark:border-orange-800/70 bg-orange-50/50 dark:bg-orange-950/30"}`,
                children: [
                    edit && !handlers.hideProductAddButton && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: block.productListenerCenter ? "flex justify-center" : "flex",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$consultation$2f$product$2d$locked$2d$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProductLockedTooltip"], {
                            locked: locked,
                            className: "inline-flex",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                type: "button",
                                variant: "outline",
                                disabled: locked,
                                onClick: ()=>handlers.onOpenProductPicker?.(),
                                className: "inline-flex h-9 px-4 rounded-xl gap-2 border-orange-200/80 dark:border-orange-800/60 bg-white dark:bg-slate-900 hover:bg-orange-50 dark:hover:bg-slate-850 text-foreground text-sm font-medium shadow-xs transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                        className: "h-4 w-4 text-orange-600"
                                    }, void 0, false, {
                                        fileName: "[project]/components/formbuilder/renderer/product-listener-sync.tsx",
                                        lineNumber: 63,
                                        columnNumber: 17
                                    }, this),
                                    block.label || "Add Product"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/formbuilder/renderer/product-listener-sync.tsx",
                                lineNumber: 56,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/formbuilder/renderer/product-listener-sync.tsx",
                            lineNumber: 55,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/formbuilder/renderer/product-listener-sync.tsx",
                        lineNumber: 50,
                        columnNumber: 11
                    }, this),
                    actions.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$form$2d$actions$2d$display$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        items: actions,
                        hideLabel: true,
                        visitId: visitId,
                        departmentId: departmentId,
                        readOnly: locked,
                        onUpdateQuantity: locked ? undefined : handlers.onUpdateProductQuantity ? (id, qty)=>handlers.onUpdateProductQuantity?.(id, qty) : undefined,
                        onRemove: locked ? undefined : handlers.onRemoveProduct ? (id)=>handlers.onRemoveProduct?.(id) : undefined,
                        onRestore: locked ? undefined : handlers.onRestoreProduct ? (id)=>handlers.onRestoreProduct?.(id) : undefined
                    }, void 0, false, {
                        fileName: "[project]/components/formbuilder/renderer/product-listener-sync.tsx",
                        lineNumber: 71,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$medical$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EntryList"], {
                        emptyLabel: "No products selected",
                        items: value,
                        render: (item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 flex-1 min-w-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                        className: "h-3 w-3 text-orange-500 shrink-0"
                                    }, void 0, false, {
                                        fileName: "[project]/components/formbuilder/renderer/product-listener-sync.tsx",
                                        lineNumber: 105,
                                        columnNumber: 17
                                    }, void 0),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex-1 font-medium truncate",
                                        children: item.name
                                    }, void 0, false, {
                                        fileName: "[project]/components/formbuilder/renderer/product-listener-sync.tsx",
                                        lineNumber: 106,
                                        columnNumber: 17
                                    }, void 0),
                                    item.type && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `text-[11px] px-1.5 py-0.5 rounded font-medium shrink-0 ${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$medical$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PTYPE_COLOR"][item.type] ?? "bg-muted text-muted-foreground"}`,
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$medical$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PTYPE_LABEL"][item.type] ?? item.type
                                    }, void 0, false, {
                                        fileName: "[project]/components/formbuilder/renderer/product-listener-sync.tsx",
                                        lineNumber: 108,
                                        columnNumber: 19
                                    }, void 0),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-semibold tabular-nums text-muted-foreground bg-muted/60 rounded-full px-2 py-0.5 leading-none shrink-0",
                                        children: [
                                            "×",
                                            item.qty ?? 1
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/formbuilder/renderer/product-listener-sync.tsx",
                                        lineNumber: 114,
                                        columnNumber: 17
                                    }, void 0)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/formbuilder/renderer/product-listener-sync.tsx",
                                lineNumber: 104,
                                columnNumber: 15
                            }, void 0),
                        onRemove: edit ? (id)=>onChange(value.filter((item)=>item.id !== id)) : undefined
                    }, void 0, false, {
                        fileName: "[project]/components/formbuilder/renderer/product-listener-sync.tsx",
                        lineNumber: 100,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/formbuilder/renderer/product-listener-sync.tsx",
                lineNumber: 42,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/formbuilder/renderer/product-listener-sync.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
_c = ProductListenerWithVisitSync;
var _c;
__turbopack_context__.k.register(_c, "ProductListenerWithVisitSync");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/formbuilder/renderer/medical-answer-blocks.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DiagnosticAnswerBlock",
    ()=>DiagnosticAnswerBlock,
    "LabAnswerBlock",
    ()=>LabAnswerBlock,
    "MedFullAnswerBlock",
    ()=>MedFullAnswerBlock,
    "MedMiniAnswerBlock",
    ()=>MedMiniAnswerBlock,
    "ProductListenerAnswerBlock",
    ()=>ProductListenerAnswerBlock
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/textarea.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flask$2d$conical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FlaskConical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/flask-conical.js [app-client] (ecmascript) <export default as FlaskConical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pill$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pill$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pill.js [app-client] (ecmascript) <export default as Pill>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$stethoscope$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Stethoscope$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/stethoscope.js [app-client] (ecmascript) <export default as Stethoscope>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$product$2d$listener$2d$sync$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/formbuilder/renderer/product-listener-sync.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$medical$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/formbuilder/renderer/medical-shared.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/formbuilder/renderer/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
function DiagnosticAnswerBlock({ block, value, onChange, isError, edit, handlers }) {
    const items = handlers?.diagnostics ?? value ?? [];
    const add = async (diagnosis, description)=>{
        const name = diagnosis.trim();
        if (!name) return;
        if (handlers?.onAddDiagnosis) {
            await handlers.onAddDiagnosis(name, description);
            return;
        }
        onChange([
            ...value,
            {
                id: `d${(0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["uid"])()}`,
                diagnosis: name,
                description: description?.trim() || undefined
            }
        ]);
    };
    const remove = async (id)=>{
        if (handlers?.onRemoveDiagnosis) {
            await handlers.onRemoveDiagnosis(id);
            return;
        }
        onChange(value.filter((e)=>e.id !== id));
    };
    const canAdd = handlers ? Boolean(handlers.onAddDiagnosis) : edit;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "my-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "text-sm leading-5 font-medium flex items-center gap-1.5 mb-1.5 text-foreground",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$stethoscope$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Stethoscope$3e$__["Stethoscope"], {
                        className: "h-3.5 w-3.5 text-emerald-600"
                    }, void 0, false, {
                        fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                        lineNumber: 72,
                        columnNumber: 9
                    }, this),
                    block.label || "Diagnoses",
                    block.required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-red-500",
                        children: "*"
                    }, void 0, false, {
                        fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                        lineNumber: 74,
                        columnNumber: 28
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                lineNumber: 71,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `space-y-3 p-3.5 rounded-xl border transition-colors shadow-xs ${isError ? "border-red-400 bg-red-50/40 dark:bg-red-950/20" : "border-emerald-200/80 dark:border-emerald-800/70 bg-emerald-50/50 dark:bg-emerald-950/30"}`,
                children: [
                    canAdd && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DiagnosticDraft, {
                        onAdd: add,
                        placeholder: block.placeholder || "Enter diagnosis name…"
                    }, void 0, false, {
                        fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                        lineNumber: 84,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$medical$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EntryList"], {
                        emptyLabel: "No diagnoses",
                        items: items,
                        render: (e)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 min-w-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-medium leading-snug break-words",
                                        children: e.diagnosis
                                    }, void 0, false, {
                                        fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                                        lineNumber: 94,
                                        columnNumber: 15
                                    }, void 0),
                                    e.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-muted-foreground mt-0.5",
                                        children: e.description
                                    }, void 0, false, {
                                        fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                                        lineNumber: 98,
                                        columnNumber: 17
                                    }, void 0)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                                lineNumber: 93,
                                columnNumber: 13
                            }, void 0),
                        onRemove: edit ? remove : undefined
                    }, void 0, false, {
                        fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                        lineNumber: 89,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                lineNumber: 76,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
        lineNumber: 70,
        columnNumber: 5
    }, this);
}
_c = DiagnosticAnswerBlock;
function DiagnosticDraft({ onAdd, placeholder }) {
    _s();
    const [draftDiag, setDraftDiag] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState("");
    const [draftDesc, setDraftDesc] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState("");
    const [submitting, setSubmitting] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(false);
    const submit = async ()=>{
        if (!draftDiag.trim() || submitting) return;
        setSubmitting(true);
        try {
            await onAdd(draftDiag, draftDesc);
            setDraftDiag("");
            setDraftDesc("");
        } finally{
            setSubmitting(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                value: draftDiag,
                onChange: (e)=>setDraftDiag(e.target.value),
                onKeyDown: (e)=>e.key === "Enter" && submit(),
                placeholder: placeholder,
                className: "h-8 text-sm bg-white dark:bg-slate-900 border-emerald-300/70 dark:border-emerald-700/70 shadow-xs focus:bg-white dark:focus:bg-slate-950"
            }, void 0, false, {
                fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                lineNumber: 134,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Textarea"], {
                value: draftDesc,
                onChange: (e)=>setDraftDesc(e.target.value),
                placeholder: "Notes / description (optional)",
                className: "text-sm min-h-[52px] resize-none bg-white dark:bg-slate-900 border-emerald-300/70 dark:border-emerald-700/70 shadow-xs focus:bg-white dark:focus:bg-slate-950",
                rows: 2
            }, void 0, false, {
                fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                lineNumber: 141,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-end",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    type: "button",
                    size: "sm",
                    onClick: submit,
                    disabled: !draftDiag.trim() || submitting,
                    className: "h-7 rounded-full gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                            className: "h-3 w-3"
                        }, void 0, false, {
                            fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                            lineNumber: 156,
                            columnNumber: 11
                        }, this),
                        " Add Diagnosis"
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                    lineNumber: 149,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                lineNumber: 148,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(DiagnosticDraft, "K6iO9DhLA4b2HYe7fEtWZRpJpUU=");
_c1 = DiagnosticDraft;
function MedFullAnswerBlock({ block, value, onChange, isError, edit, handlers }) {
    const items = handlers?.medicationsFull ?? value ?? [];
    const remove = async (id)=>{
        if (handlers?.onRemoveMedication) {
            await handlers.onRemoveMedication(id);
            return;
        }
        onChange(value.filter((e)=>e.id !== id));
    };
    const addEntry = async (draft)=>{
        if (handlers?.onAddMedicationFull) {
            await handlers.onAddMedicationFull(draft);
            return;
        }
        onChange([
            ...value,
            {
                id: `mf${(0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["uid"])()}`,
                ...draft,
                notes: draft.notes?.trim() || undefined
            }
        ]);
    };
    const canAdd = handlers ? Boolean(handlers.onAddMedicationFull) : edit;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "my-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "text-sm leading-5 font-medium flex items-center gap-1.5 mb-1.5 text-foreground",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pill$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pill$3e$__["Pill"], {
                        className: "h-3.5 w-3.5 text-blue-600"
                    }, void 0, false, {
                        fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                        lineNumber: 205,
                        columnNumber: 9
                    }, this),
                    block.label || "Medications",
                    block.required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-red-500",
                        children: "*"
                    }, void 0, false, {
                        fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                        lineNumber: 207,
                        columnNumber: 28
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                lineNumber: 204,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `space-y-3 p-3.5 rounded-xl border transition-colors shadow-xs ${isError ? "border-red-400 bg-red-50/40 dark:bg-red-950/20" : "border-blue-200/80 dark:border-blue-800/70 bg-blue-50/50 dark:bg-blue-950/30"}`,
                children: [
                    canAdd && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MedFullDraft, {
                        onAdd: addEntry,
                        placeholder: block.placeholder || "Medication name…"
                    }, void 0, false, {
                        fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                        lineNumber: 217,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$medical$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EntryList"], {
                        emptyLabel: "No medications",
                        items: items,
                        render: (e)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 min-w-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-medium break-words",
                                        children: e.name
                                    }, void 0, false, {
                                        fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                                        lineNumber: 227,
                                        columnNumber: 15
                                    }, void 0),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-muted-foreground",
                                        children: [
                                            "Frequency: ",
                                            e.frequency,
                                            " · Amount: ",
                                            e.amount,
                                            " · Days: ",
                                            e.days
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                                        lineNumber: 228,
                                        columnNumber: 15
                                    }, void 0),
                                    e.notes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-muted-foreground",
                                        children: e.notes
                                    }, void 0, false, {
                                        fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                                        lineNumber: 232,
                                        columnNumber: 17
                                    }, void 0)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                                lineNumber: 226,
                                columnNumber: 13
                            }, void 0),
                        onRemove: edit ? remove : undefined
                    }, void 0, false, {
                        fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                        lineNumber: 222,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                lineNumber: 209,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
        lineNumber: 203,
        columnNumber: 5
    }, this);
}
_c2 = MedFullAnswerBlock;
function MedFullDraft({ onAdd, placeholder }) {
    _s1();
    const [draft, setDraft] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState({
        name: "",
        frequency: "",
        amount: "",
        days: "",
        notes: ""
    });
    const [submitting, setSubmitting] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(false);
    const upd = (k)=>(e)=>setDraft((d)=>({
                    ...d,
                    [k]: e.target.value
                }));
    const canAdd = draft.name.trim() && draft.frequency.trim() && draft.amount.trim() && draft.days.trim();
    const submit = async ()=>{
        if (!canAdd || submitting) return;
        setSubmitting(true);
        try {
            await onAdd(draft);
            setDraft({
                name: "",
                frequency: "",
                amount: "",
                days: "",
                notes: ""
            });
        } finally{
            setSubmitting(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                value: draft.name,
                onChange: upd("name"),
                placeholder: placeholder,
                className: "h-8 text-sm bg-white dark:bg-slate-900 border-blue-300/70 dark:border-blue-700/70 shadow-xs focus:bg-white dark:focus:bg-slate-950"
            }, void 0, false, {
                fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                lineNumber: 279,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-3 gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                        value: draft.frequency,
                        onChange: upd("frequency"),
                        placeholder: "Frequency",
                        className: "h-8 text-sm bg-white dark:bg-slate-900 border-blue-300/70 dark:border-blue-700/70 shadow-xs focus:bg-white dark:focus:bg-slate-950"
                    }, void 0, false, {
                        fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                        lineNumber: 286,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                        value: draft.amount,
                        onChange: upd("amount"),
                        placeholder: "Amount",
                        className: "h-8 text-sm bg-white dark:bg-slate-900 border-blue-300/70 dark:border-blue-700/70 shadow-xs focus:bg-white dark:focus:bg-slate-950"
                    }, void 0, false, {
                        fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                        lineNumber: 292,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                        value: draft.days,
                        onChange: upd("days"),
                        placeholder: "Days",
                        className: "h-8 text-sm bg-white dark:bg-slate-900 border-blue-300/70 dark:border-blue-700/70 shadow-xs focus:bg-white dark:focus:bg-slate-950"
                    }, void 0, false, {
                        fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                        lineNumber: 298,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                lineNumber: 285,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Textarea"], {
                value: draft.notes,
                onChange: upd("notes"),
                placeholder: "Extra notes (optional)",
                className: "text-sm min-h-[48px] resize-none bg-white dark:bg-slate-900 border-blue-300/70 dark:border-blue-700/70 shadow-xs focus:bg-white dark:focus:bg-slate-950",
                rows: 2
            }, void 0, false, {
                fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                lineNumber: 305,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-end",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    type: "button",
                    size: "sm",
                    onClick: submit,
                    disabled: !canAdd || submitting,
                    className: "h-7 rounded-full gap-1 text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-xs",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                            className: "h-3 w-3"
                        }, void 0, false, {
                            fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                            lineNumber: 320,
                            columnNumber: 11
                        }, this),
                        " Add Medication"
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                    lineNumber: 313,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                lineNumber: 312,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s1(MedFullDraft, "PCYcbd3b4OusOxdiV+JVN6PqE9g=");
_c3 = MedFullDraft;
function MedMiniAnswerBlock({ block, value, onChange, isError, edit, handlers }) {
    const items = handlers?.medicationsMini ?? value ?? [];
    const remove = async (id)=>{
        if (handlers?.onRemoveMedication) {
            await handlers.onRemoveMedication(id);
            return;
        }
        onChange(value.filter((e)=>e.id !== id));
    };
    const addEntry = async (name, notes)=>{
        if (handlers?.onAddMedicationMini) {
            await handlers.onAddMedicationMini(name, notes);
            return;
        }
        onChange([
            ...value,
            {
                id: `mm${(0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["uid"])()}`,
                name: name.trim(),
                notes: notes?.trim() || undefined
            }
        ]);
    };
    const canAdd = handlers ? Boolean(handlers.onAddMedicationMini) : edit;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "my-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "text-sm leading-5 font-medium flex items-center gap-1.5 mb-1.5 text-foreground",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pill$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pill$3e$__["Pill"], {
                        className: "h-3.5 w-3.5 text-indigo-600"
                    }, void 0, false, {
                        fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                        lineNumber: 369,
                        columnNumber: 9
                    }, this),
                    block.label || "Medications",
                    block.required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-red-500",
                        children: "*"
                    }, void 0, false, {
                        fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                        lineNumber: 371,
                        columnNumber: 28
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                lineNumber: 368,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `space-y-3 p-3.5 rounded-xl border transition-colors shadow-xs ${isError ? "border-red-400 bg-red-50/40 dark:bg-red-950/20" : "border-indigo-200/80 dark:border-indigo-800/70 bg-indigo-50/50 dark:bg-indigo-950/30"}`,
                children: [
                    canAdd && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MedMiniDraft, {
                        onAdd: addEntry,
                        placeholder: block.placeholder || "Medication name…"
                    }, void 0, false, {
                        fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                        lineNumber: 381,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$medical$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EntryList"], {
                        emptyLabel: "No medications",
                        items: items,
                        render: (e)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 min-w-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-medium break-words",
                                        children: e.name
                                    }, void 0, false, {
                                        fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                                        lineNumber: 391,
                                        columnNumber: 15
                                    }, void 0),
                                    e.notes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-muted-foreground",
                                        children: e.notes
                                    }, void 0, false, {
                                        fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                                        lineNumber: 393,
                                        columnNumber: 17
                                    }, void 0)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                                lineNumber: 390,
                                columnNumber: 13
                            }, void 0),
                        onRemove: edit ? remove : undefined
                    }, void 0, false, {
                        fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                        lineNumber: 386,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                lineNumber: 373,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
        lineNumber: 367,
        columnNumber: 5
    }, this);
}
_c4 = MedMiniAnswerBlock;
function MedMiniDraft({ onAdd, placeholder }) {
    _s2();
    const [draftName, setDraftName] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState("");
    const [draftNotes, setDraftNotes] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState("");
    const [submitting, setSubmitting] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(false);
    const submit = async ()=>{
        if (!draftName.trim() || submitting) return;
        setSubmitting(true);
        try {
            await onAdd(draftName, draftNotes);
            setDraftName("");
            setDraftNotes("");
        } finally{
            setSubmitting(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                value: draftName,
                onChange: (e)=>setDraftName(e.target.value),
                onKeyDown: (e)=>e.key === "Enter" && submit(),
                placeholder: placeholder,
                className: "h-8 text-sm bg-white dark:bg-slate-900 border-indigo-300/70 dark:border-indigo-700/70 shadow-xs focus:bg-white dark:focus:bg-slate-950"
            }, void 0, false, {
                fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                lineNumber: 427,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Textarea"], {
                value: draftNotes,
                onChange: (e)=>setDraftNotes(e.target.value),
                placeholder: "Notes (optional)",
                className: "text-sm min-h-[48px] resize-none bg-white dark:bg-slate-900 border-indigo-300/70 dark:border-indigo-700/70 shadow-xs focus:bg-white dark:focus:bg-slate-950",
                rows: 2
            }, void 0, false, {
                fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                lineNumber: 434,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-end",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    type: "button",
                    size: "sm",
                    onClick: submit,
                    disabled: !draftName.trim() || submitting,
                    className: "h-7 rounded-full gap-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                            className: "h-3 w-3"
                        }, void 0, false, {
                            fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                            lineNumber: 449,
                            columnNumber: 11
                        }, this),
                        " Add Medication"
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                    lineNumber: 442,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                lineNumber: 441,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s2(MedMiniDraft, "4mTW93G9Pfo8rAieCCKhEBP2A50=");
_c5 = MedMiniDraft;
function LabAnswerBlock({ block, value, onChange, isError, edit }) {
    const layout = block.labLayout ?? "valueUnit";
    const rows = block.labRows?.length ? block.labRows : [
        {
            id: "r1",
            name: "Result 1",
            unitMode: "dropdown",
            unitOptions: [
                "mg/dL",
                "mmol/L"
            ],
            defaultUnit: "mg/dL",
            resultOptions: [
                "+ve",
                "-ve"
            ]
        },
        {
            id: "r2",
            name: "Result 2",
            unitMode: "dropdown",
            unitOptions: [
                "mg/dL",
                "mmol/L"
            ],
            defaultUnit: "mg/dL",
            resultOptions: [
                "+ve",
                "-ve"
            ]
        },
        {
            id: "r3",
            name: "Result 3",
            unitMode: "dropdown",
            unitOptions: [
                "mg/dL",
                "mmol/L"
            ],
            defaultUnit: "mg/dL",
            resultOptions: [
                "+ve",
                "-ve"
            ]
        }
    ];
    const set = (rowId, key, val)=>onChange({
            ...value,
            [rowId]: {
                ...value[rowId],
                [key]: val
            }
        });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "my-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "text-sm leading-5 font-medium flex items-center gap-1.5 mb-1.5 text-foreground",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flask$2d$conical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FlaskConical$3e$__["FlaskConical"], {
                        className: "h-3.5 w-3.5 text-purple-600"
                    }, void 0, false, {
                        fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                        lineNumber: 503,
                        columnNumber: 9
                    }, this),
                    block.label || "Lab Results",
                    block.required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-red-500",
                        children: "*"
                    }, void 0, false, {
                        fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                        lineNumber: 505,
                        columnNumber: 28
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                lineNumber: 502,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `overflow-x-auto border rounded-xl shadow-xs ${isError ? "border-red-400 bg-red-50/40 dark:bg-red-950/20" : "border-purple-200/80 dark:border-purple-800/70 bg-purple-50/50 dark:bg-purple-950/30"}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    className: "w-full border-collapse text-sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "border-b border-purple-200/60 dark:border-purple-800/60 bg-purple-100/60 dark:bg-purple-900/40 px-3 py-2 text-left text-xs font-semibold text-foreground",
                                        children: "Name"
                                    }, void 0, false, {
                                        fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                                        lineNumber: 517,
                                        columnNumber: 15
                                    }, this),
                                    layout === "valueUnit" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "border-b border-purple-200/60 dark:border-purple-800/60 bg-purple-100/60 dark:bg-purple-900/40 px-3 py-2 text-left text-xs font-semibold text-foreground",
                                                children: "Value"
                                            }, void 0, false, {
                                                fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                                                lineNumber: 522,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "border-b border-purple-200/60 dark:border-purple-800/60 bg-purple-100/60 dark:bg-purple-900/40 px-3 py-2 text-left text-xs font-semibold text-foreground",
                                                children: "Unit"
                                            }, void 0, false, {
                                                fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                                                lineNumber: 525,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "border-b border-purple-200/60 dark:border-purple-800/60 bg-purple-100/60 dark:bg-purple-900/40 px-3 py-2 text-left text-xs font-semibold text-foreground",
                                        children: "Result"
                                    }, void 0, false, {
                                        fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                                        lineNumber: 530,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                                lineNumber: 516,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                            lineNumber: 515,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            children: rows.map((row)=>{
                                const rv = value[row.id] ?? {};
                                const units = row.unitOptions.length ? row.unitOptions : [
                                    "mg/dL",
                                    "mmol/L"
                                ];
                                const results = row.resultOptions.length ? row.resultOptions : [
                                    "+ve",
                                    "-ve"
                                ];
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "border-b border-purple-200/40 dark:border-purple-800/40 px-3 py-2 font-medium text-sm whitespace-nowrap text-foreground",
                                            children: row.name
                                        }, void 0, false, {
                                            fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                                            lineNumber: 547,
                                            columnNumber: 19
                                        }, this),
                                        layout === "valueUnit" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-b border-purple-200/40 dark:border-purple-800/40 px-1.5 py-1.5 min-w-[80px]",
                                                    children: edit ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        className: "w-full h-7 px-2 text-xs border rounded-md bg-white dark:bg-slate-900 border-purple-200 dark:border-purple-800/80 text-foreground shadow-xs focus:outline-none focus:ring-1 focus:ring-purple-400 focus:bg-white dark:focus:bg-slate-950",
                                                        value: rv.value ?? "",
                                                        onChange: (e)=>set(row.id, "value", e.target.value),
                                                        placeholder: "Value"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                                                        lineNumber: 554,
                                                        columnNumber: 27
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs text-foreground",
                                                        children: rv.value || "—"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                                                        lineNumber: 563,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                                                    lineNumber: 552,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-b border-purple-200/40 dark:border-purple-800/40 px-1.5 py-1.5 min-w-[90px]",
                                                    children: edit ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        className: "w-full h-7 px-1.5 text-xs border rounded-md bg-white dark:bg-slate-900 border-purple-200 dark:border-purple-800/80 text-foreground shadow-xs focus:outline-none focus:ring-1 focus:ring-purple-400",
                                                        value: rv.unit ?? row.defaultUnit ?? units[0],
                                                        onChange: (e)=>set(row.id, "unit", e.target.value),
                                                        children: units.map((u)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: u,
                                                                children: u
                                                            }, u, false, {
                                                                fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                                                                lineNumber: 576,
                                                                columnNumber: 31
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                                                        lineNumber: 568,
                                                        columnNumber: 27
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs text-foreground",
                                                        children: rv.unit ?? row.defaultUnit ?? "—"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                                                        lineNumber: 582,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                                                    lineNumber: 566,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "border-b border-purple-200/40 dark:border-purple-800/40 px-1.5 py-1.5 min-w-[100px]",
                                            children: edit ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                className: "w-full h-7 px-1.5 text-xs border rounded-md bg-white dark:bg-slate-900 border-purple-200 dark:border-purple-800/80 text-foreground shadow-xs focus:outline-none focus:ring-1 focus:ring-purple-400",
                                                value: rv.result ?? "",
                                                onChange: (e)=>set(row.id, "result", e.target.value),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "",
                                                        children: "Select…"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                                                        lineNumber: 598,
                                                        columnNumber: 27
                                                    }, this),
                                                    results.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: r,
                                                            children: r
                                                        }, r, false, {
                                                            fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                                                            lineNumber: 600,
                                                            columnNumber: 29
                                                        }, this))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                                                lineNumber: 591,
                                                columnNumber: 25
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs text-foreground",
                                                children: rv.result || "—"
                                            }, void 0, false, {
                                                fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                                                lineNumber: 606,
                                                columnNumber: 25
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                                            lineNumber: 589,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, row.id, true, {
                                    fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                                    lineNumber: 546,
                                    columnNumber: 17
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                            lineNumber: 536,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                    lineNumber: 514,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                lineNumber: 507,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
        lineNumber: 501,
        columnNumber: 5
    }, this);
}
_c6 = LabAnswerBlock;
function ProductListenerAnswerBlock({ block, value, onChange, isError, edit, handlers }) {
    // Any consultation/visit context (handlers present) must use the visit-synced
    // listener — even when the picker is unavailable (locked / read-only) — so we
    // never fall back to the local manual-entry draft which doesn't hit the visit.
    if (handlers && (handlers.onOpenProductPicker || handlers.productActions)) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$product$2d$listener$2d$sync$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProductListenerWithVisitSync"], {
            block: block,
            value: value,
            onChange: onChange,
            isError: isError,
            edit: edit,
            handlers: handlers,
            visitId: handlers.visitId,
            departmentId: handlers.departmentId
        }, void 0, false, {
            fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
            lineNumber: 640,
            columnNumber: 7
        }, this);
    }
    const remove = (id)=>onChange(value.filter((item)=>item.id !== id));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "my-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "text-sm leading-5 font-medium flex items-center gap-1.5 mb-1.5 text-foreground",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                        className: "h-3.5 w-3.5 text-orange-600"
                    }, void 0, false, {
                        fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                        lineNumber: 658,
                        columnNumber: 9
                    }, this),
                    block.label || "Products / Procedures",
                    block.required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-red-500",
                        children: "*"
                    }, void 0, false, {
                        fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                        lineNumber: 660,
                        columnNumber: 28
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                lineNumber: 657,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `space-y-3 p-3.5 rounded-xl border transition-colors shadow-xs ${isError ? "border-red-400 bg-red-50/40 dark:bg-red-950/20" : "border-orange-200/80 dark:border-orange-800/70 bg-orange-50/50 dark:bg-orange-950/30"}`,
                children: [
                    edit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: block.productListenerCenter ? "flex justify-center" : "flex",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            type: "button",
                            variant: "outline",
                            disabled: true,
                            title: "Products are picked from the catalog during a consultation",
                            className: "inline-flex h-9 px-4 rounded-xl gap-2 border-orange-200/80 dark:border-orange-800/60 bg-white dark:bg-slate-900 text-foreground text-sm font-medium shadow-xs",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                    className: "h-4 w-4 text-orange-600"
                                }, void 0, false, {
                                    fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                                    lineNumber: 682,
                                    columnNumber: 15
                                }, this),
                                block.label || "Add Product"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                            lineNumber: 675,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                        lineNumber: 670,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$medical$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EntryList"], {
                        emptyLabel: "No products selected",
                        items: value,
                        render: (item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 flex-1 min-w-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                        className: "h-3 w-3 text-orange-500 shrink-0"
                                    }, void 0, false, {
                                        fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                                        lineNumber: 692,
                                        columnNumber: 15
                                    }, void 0),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex-1 font-medium truncate",
                                        children: item.name
                                    }, void 0, false, {
                                        fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                                        lineNumber: 693,
                                        columnNumber: 15
                                    }, void 0),
                                    item.type && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `text-[11px] px-1.5 py-0.5 rounded font-medium shrink-0 ${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$medical$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PTYPE_COLOR"][item.type] ?? "bg-muted text-muted-foreground"}`,
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$medical$2d$shared$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PTYPE_LABEL"][item.type] ?? item.type
                                    }, void 0, false, {
                                        fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                                        lineNumber: 695,
                                        columnNumber: 17
                                    }, void 0),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-semibold tabular-nums text-muted-foreground bg-muted/60 rounded-full px-2 py-0.5 leading-none shrink-0",
                                        children: [
                                            "×",
                                            item.qty ?? 1
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                                        lineNumber: 701,
                                        columnNumber: 15
                                    }, void 0)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                                lineNumber: 691,
                                columnNumber: 13
                            }, void 0),
                        onRemove: edit ? remove : undefined
                    }, void 0, false, {
                        fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                        lineNumber: 687,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
                lineNumber: 662,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/formbuilder/renderer/medical-answer-blocks.tsx",
        lineNumber: 656,
        columnNumber: 5
    }, this);
}
_c7 = ProductListenerAnswerBlock;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7;
__turbopack_context__.k.register(_c, "DiagnosticAnswerBlock");
__turbopack_context__.k.register(_c1, "DiagnosticDraft");
__turbopack_context__.k.register(_c2, "MedFullAnswerBlock");
__turbopack_context__.k.register(_c3, "MedFullDraft");
__turbopack_context__.k.register(_c4, "MedMiniAnswerBlock");
__turbopack_context__.k.register(_c5, "MedMiniDraft");
__turbopack_context__.k.register(_c6, "LabAnswerBlock");
__turbopack_context__.k.register(_c7, "ProductListenerAnswerBlock");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/storage-service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "uploadFile",
    ()=>uploadFile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$media$2d$url$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/media-url.ts [app-client] (ecmascript)");
;
async function uploadFile(file, onProgress) {
    onProgress?.(20);
    const formData = new FormData();
    formData.append('file', file); // visibility defaults to PUBLIC on the backend
    const uri = ("TURBOPACK compile-time truthy", 1) ? '/api/uploads' : "TURBOPACK unreachable";
    const token = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem('authToken') : "TURBOPACK unreachable";
    const headers = {};
    if (token) headers['authorization'] = `Bearer ${token}`;
    const response = await fetch(uri, {
        method: 'POST',
        headers,
        body: formData
    });
    const result = await response.json();
    if (result.status !== 'SUCCESS') {
        throw new Error(result.message || 'Upload failed');
    }
    onProgress?.(100);
    return {
        path: result.data?.id || file.name,
        url: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$media$2d$url$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMediaUrl"])(result.data?.url) || '',
        name: file.name
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/media-uploader.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MediaUploader",
    ()=>MediaUploader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/storage-service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/upload.js [app-client] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ImageIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/image.js [app-client] (ecmascript) <export default as ImageIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$film$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Film$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/film.js [app-client] (ecmascript) <export default as Film>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/folder-open.js [app-client] (ecmascript) <export default as FolderOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$media$2d$url$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/media-url.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
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
function matchesAccept(file, accept) {
    if (!accept) return true;
    return accept.split(',').some((token)=>{
        const t = token.trim();
        if (t.endsWith('/*')) return file.type.startsWith(t.replace('/*', '/'));
        if (t.startsWith('.')) return file.name.toLowerCase().endsWith(t.toLowerCase());
        return file.type === t;
    });
}
function DropzoneIcon({ accept }) {
    const cls = 'size-10 text-muted-foreground/40';
    if (!accept) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderOpen$3e$__["FolderOpen"], {
        className: cls
    }, void 0, false, {
        fileName: "[project]/components/ui/media-uploader.tsx",
        lineNumber: 41,
        columnNumber: 23
    }, this);
    if (accept.includes('video')) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$film$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Film$3e$__["Film"], {
        className: cls
    }, void 0, false, {
        fileName: "[project]/components/ui/media-uploader.tsx",
        lineNumber: 42,
        columnNumber: 40
    }, this);
    if (accept.includes('image')) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ImageIcon$3e$__["ImageIcon"], {
        className: cls
    }, void 0, false, {
        fileName: "[project]/components/ui/media-uploader.tsx",
        lineNumber: 43,
        columnNumber: 40
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
        className: cls
    }, void 0, false, {
        fileName: "[project]/components/ui/media-uploader.tsx",
        lineNumber: 44,
        columnNumber: 10
    }, this);
}
_c = DropzoneIcon;
function MediaUploader({ accept, multiple = false, maxFiles, label, hint, disabled = false, onUploaded, onError, currentUrl, className }) {
    _s();
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [isDragOver, setIsDragOver] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [progress, setProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [uploaded, setUploaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [uploading, setUploading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const isUploading = uploading || Object.values(progress).some((pct)=>pct < 100);
    const handleFiles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MediaUploader.useCallback[handleFiles]": async (rawFiles)=>{
            if (disabled) return;
            setError(null);
            const valid = rawFiles.filter({
                "MediaUploader.useCallback[handleFiles].valid": (f)=>matchesAccept(f, accept)
            }["MediaUploader.useCallback[handleFiles].valid"]);
            if (valid.length === 0) {
                const msg = accept ? `No valid files — expected ${accept}` : 'No files selected.';
                setError(msg);
                onError?.(msg);
                return;
            }
            const batch = maxFiles ? valid.slice(0, maxFiles) : valid;
            if (!multiple) batch.splice(1);
            setUploading(true);
            const results = [];
            for (const file of batch){
                const key = file.name;
                setProgress({
                    "MediaUploader.useCallback[handleFiles]": (p)=>({
                            ...p,
                            [key]: 0
                        })
                }["MediaUploader.useCallback[handleFiles]"]);
                try {
                    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["uploadFile"])(file, {
                        "MediaUploader.useCallback[handleFiles]": (pct)=>setProgress({
                                "MediaUploader.useCallback[handleFiles]": (p)=>({
                                        ...p,
                                        [key]: pct
                                    })
                            }["MediaUploader.useCallback[handleFiles]"])
                    }["MediaUploader.useCallback[handleFiles]"]);
                    results.push(result);
                } catch (err) {
                    const msg = err instanceof Error ? err.message : 'Upload failed.';
                    setError(msg);
                    onError?.(msg);
                    setProgress({
                        "MediaUploader.useCallback[handleFiles]": (p)=>{
                            const next = {
                                ...p
                            };
                            delete next[key];
                            return next;
                        }
                    }["MediaUploader.useCallback[handleFiles]"]);
                }
            }
            setUploading(false);
            if (results.length > 0) {
                setUploaded({
                    "MediaUploader.useCallback[handleFiles]": (prev)=>[
                            ...prev,
                            ...results
                        ]
                }["MediaUploader.useCallback[handleFiles]"]);
                onUploaded(results);
            }
        }
    }["MediaUploader.useCallback[handleFiles]"], [
        accept,
        multiple,
        maxFiles,
        disabled,
        onUploaded,
        onError
    ]);
    const onDragOver = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MediaUploader.useCallback[onDragOver]": (e)=>{
            e.preventDefault();
            if (!disabled) setIsDragOver(true);
        }
    }["MediaUploader.useCallback[onDragOver]"], [
        disabled
    ]);
    const onDragLeave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MediaUploader.useCallback[onDragLeave]": ()=>setIsDragOver(false)
    }["MediaUploader.useCallback[onDragLeave]"], []);
    const onDrop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MediaUploader.useCallback[onDrop]": (e)=>{
            e.preventDefault();
            setIsDragOver(false);
            void handleFiles(Array.from(e.dataTransfer.files));
        }
    }["MediaUploader.useCallback[onDrop]"], [
        handleFiles
    ]);
    const onInputChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MediaUploader.useCallback[onInputChange]": (e)=>{
            void handleFiles(Array.from(e.target.files ?? []));
            e.target.value = '';
        }
    }["MediaUploader.useCallback[onInputChange]"], [
        handleFiles
    ]);
    const removeUploaded = (path)=>setUploaded((prev)=>prev.filter((f)=>f.path !== path));
    const browse = ()=>!disabled && inputRef.current?.click();
    if (currentUrl) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex items-center gap-3', className),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$media$2d$url$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMediaUrl"])(currentUrl),
                    alt: "Current media",
                    className: "size-16 rounded-md object-cover border border-border shrink-0"
                }, void 0, false, {
                    fileName: "[project]/components/ui/media-uploader.tsx",
                    lineNumber: 157,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-1.5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            type: "button",
                            variant: "outline",
                            size: "sm",
                            disabled: disabled || isUploading,
                            onClick: browse,
                            children: isUploading ? 'Uploading…' : 'Change'
                        }, void 0, false, {
                            fileName: "[project]/components/ui/media-uploader.tsx",
                            lineNumber: 163,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            ref: inputRef,
                            type: "file",
                            accept: accept,
                            multiple: multiple,
                            className: "hidden",
                            onChange: onInputChange
                        }, void 0, false, {
                            fileName: "[project]/components/ui/media-uploader.tsx",
                            lineNumber: 172,
                            columnNumber: 11
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-destructive",
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/components/ui/media-uploader.tsx",
                            lineNumber: 180,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ui/media-uploader.tsx",
                    lineNumber: 162,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/ui/media-uploader.tsx",
            lineNumber: 156,
            columnNumber: 7
        }, this);
    }
    const activeUploads = Object.entries(progress).filter(([, pct])=>pct < 100);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex flex-col gap-2', className),
        children: [
            label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm font-medium leading-none",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/components/ui/media-uploader.tsx",
                        lineNumber: 192,
                        columnNumber: 11
                    }, this),
                    hint && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-xs text-muted-foreground",
                        children: hint
                    }, void 0, false, {
                        fileName: "[project]/components/ui/media-uploader.tsx",
                        lineNumber: 194,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/media-uploader.tsx",
                lineNumber: 191,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                role: "button",
                tabIndex: disabled ? -1 : 0,
                "aria-label": "Upload files",
                onDragOver: onDragOver,
                onDragLeave: onDragLeave,
                onDrop: onDrop,
                onClick: browse,
                onKeyDown: (e)=>e.key === 'Enter' && browse(),
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('relative flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 text-center transition-colors select-none', disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer', isDragOver && !disabled ? 'border-primary bg-primary/5' : 'border-border bg-muted/20 hover:bg-muted/40'),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DropzoneIcon, {
                        accept: accept
                    }, void 0, false, {
                        fileName: "[project]/components/ui/media-uploader.tsx",
                        lineNumber: 218,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-0.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm font-medium",
                                children: [
                                    "Drop ",
                                    multiple ? 'files' : 'a file',
                                    " here"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ui/media-uploader.tsx",
                                lineNumber: 221,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-muted-foreground",
                                children: "or browse your device"
                            }, void 0, false, {
                                fileName: "[project]/components/ui/media-uploader.tsx",
                                lineNumber: 224,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ui/media-uploader.tsx",
                        lineNumber: 220,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        type: "button",
                        variant: "outline",
                        size: "sm",
                        disabled: disabled || isUploading,
                        onClick: (e)=>{
                            e.stopPropagation();
                            browse();
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {}, void 0, false, {
                                fileName: "[project]/components/ui/media-uploader.tsx",
                                lineNumber: 237,
                                columnNumber: 11
                            }, this),
                            "Browse"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ui/media-uploader.tsx",
                        lineNumber: 227,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        ref: inputRef,
                        type: "file",
                        accept: accept,
                        multiple: multiple,
                        className: "hidden",
                        onChange: onInputChange
                    }, void 0, false, {
                        fileName: "[project]/components/ui/media-uploader.tsx",
                        lineNumber: 241,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/media-uploader.tsx",
                lineNumber: 199,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs text-destructive",
                children: error
            }, void 0, false, {
                fileName: "[project]/components/ui/media-uploader.tsx",
                lineNumber: 251,
                columnNumber: 17
            }, this),
            activeUploads.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: "flex flex-col gap-2",
                children: activeUploads.map(([name, pct])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        className: "flex flex-col gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between text-xs",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "max-w-[80%] truncate text-muted-foreground",
                                        children: name
                                    }, void 0, false, {
                                        fileName: "[project]/components/ui/media-uploader.tsx",
                                        lineNumber: 258,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "tabular-nums",
                                        children: [
                                            pct,
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ui/media-uploader.tsx",
                                        lineNumber: 261,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ui/media-uploader.tsx",
                                lineNumber: 257,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-1.5 w-full overflow-hidden rounded-full bg-muted",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-full bg-primary transition-all duration-300",
                                    style: {
                                        width: `${pct}%`
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/components/ui/media-uploader.tsx",
                                    lineNumber: 264,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/ui/media-uploader.tsx",
                                lineNumber: 263,
                                columnNumber: 15
                            }, this)
                        ]
                    }, name, true, {
                        fileName: "[project]/components/ui/media-uploader.tsx",
                        lineNumber: 256,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/ui/media-uploader.tsx",
                lineNumber: 254,
                columnNumber: 9
            }, this),
            uploaded.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: "flex flex-col gap-1",
                children: uploaded.map((file)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        className: "flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                className: "size-3.5 shrink-0 text-green-600"
                            }, void 0, false, {
                                fileName: "[project]/components/ui/media-uploader.tsx",
                                lineNumber: 281,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex-1 truncate text-xs",
                                children: file.name
                            }, void 0, false, {
                                fileName: "[project]/components/ui/media-uploader.tsx",
                                lineNumber: 282,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                "aria-label": `Remove ${file.name}`,
                                onClick: ()=>removeUploaded(file.path),
                                className: "shrink-0 text-muted-foreground transition-colors hover:text-destructive",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    className: "size-3.5"
                                }, void 0, false, {
                                    fileName: "[project]/components/ui/media-uploader.tsx",
                                    lineNumber: 289,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/ui/media-uploader.tsx",
                                lineNumber: 283,
                                columnNumber: 15
                            }, this)
                        ]
                    }, file.path, true, {
                        fileName: "[project]/components/ui/media-uploader.tsx",
                        lineNumber: 277,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/ui/media-uploader.tsx",
                lineNumber: 275,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/media-uploader.tsx",
        lineNumber: 189,
        columnNumber: 5
    }, this);
}
_s(MediaUploader, "4r7EXrYObJETNM8isHYKJrXS5Y0=");
_c1 = MediaUploader;
var _c, _c1;
__turbopack_context__.k.register(_c, "DropzoneIcon");
__turbopack_context__.k.register(_c1, "MediaUploader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/formbuilder/renderer/file-upload-block.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FileUploadAnswerBlock",
    ()=>FileUploadAnswerBlock
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$media$2d$uploader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/media-uploader.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$media$2d$url$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/media-url.ts [app-client] (ecmascript)");
"use client";
;
;
;
function FileUploadAnswerBlock({ block, value, onChange, isError, edit }) {
    const accept = block.uploadMode === "images" ? "image/*" : block.uploadMode === "images_videos" ? "image/*,video/*" : block.uploadMode === "documents" ? ".pdf,.doc,.docx,.txt,.xlsx,.csv,.xls" : "*";
    const hint = block.uploadMode === "images" ? "Images only" : block.uploadMode === "images_videos" ? "Images and videos" : block.uploadMode === "documents" ? "PDF, Word, Excel, CSV, and text files" : "Any file type";
    const removeFile = (index)=>{
        onChange(value.filter((_, i)=>i !== index));
    };
    const isImage = (file)=>file.mimeType.startsWith("image/") || /\.(png|jpe?g|gif|webp|svg)$/i.test(file.name);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `my-3 ${isError ? "rounded-md p-2 -m-2 ring-1 ring-red-400/50 bg-red-50/20 dark:bg-red-950/10" : ""}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "text-sm font-medium block mb-1",
                children: [
                    block.label || "Upload Files",
                    block.required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-red-500 ml-1",
                        children: "*"
                    }, void 0, false, {
                        fileName: "[project]/components/formbuilder/renderer/file-upload-block.tsx",
                        lineNumber: 61,
                        columnNumber: 28
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/formbuilder/renderer/file-upload-block.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this),
            edit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$media$2d$uploader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MediaUploader"], {
                accept: accept,
                multiple: block.uploadMultiple ?? false,
                maxFiles: block.uploadMaxFiles,
                label: block.label || "Upload Files",
                hint: hint,
                onUploaded: (results)=>{
                    const files = results.map((r)=>({
                            name: r.name,
                            path: r.path,
                            url: r.url,
                            mimeType: "",
                            size: 0
                        }));
                    onChange([
                        ...value,
                        ...files
                    ]);
                }
            }, void 0, false, {
                fileName: "[project]/components/formbuilder/renderer/file-upload-block.tsx",
                lineNumber: 65,
                columnNumber: 9
            }, this),
            value.length === 0 && !edit ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-muted-foreground italic",
                children: "No files uploaded"
            }, void 0, false, {
                fileName: "[project]/components/formbuilder/renderer/file-upload-block.tsx",
                lineNumber: 85,
                columnNumber: 9
            }, this) : value.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: "mt-2 space-y-1.5",
                children: value.map((file, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        className: "flex items-center gap-2.5 text-sm p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 text-foreground shadow-xs",
                        children: [
                            isImage(file) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$media$2d$url$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMediaUrl"])(file.url),
                                alt: file.name,
                                className: "h-10 w-10 rounded-md object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                            }, void 0, false, {
                                fileName: "[project]/components/formbuilder/renderer/file-upload-block.tsx",
                                lineNumber: 96,
                                columnNumber: 17
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-10 w-10 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "h-5 w-5 text-muted-foreground",
                                    fill: "none",
                                    viewBox: "0 0 24 24",
                                    stroke: "currentColor",
                                    strokeWidth: 1.5,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        d: "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                                    }, void 0, false, {
                                        fileName: "[project]/components/formbuilder/renderer/file-upload-block.tsx",
                                        lineNumber: 110,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/formbuilder/renderer/file-upload-block.tsx",
                                    lineNumber: 103,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/formbuilder/renderer/file-upload-block.tsx",
                                lineNumber: 102,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "truncate flex-1 font-medium",
                                children: file.name
                            }, void 0, false, {
                                fileName: "[project]/components/formbuilder/renderer/file-upload-block.tsx",
                                lineNumber: 118,
                                columnNumber: 15
                            }, this),
                            edit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>removeFile(index),
                                className: "p-1 rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex-shrink-0",
                                "aria-label": `Remove ${file.name}`,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "h-4 w-4",
                                    fill: "none",
                                    viewBox: "0 0 24 24",
                                    stroke: "currentColor",
                                    strokeWidth: 2,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        d: "M6 18 18 6M6 6l12 12"
                                    }, void 0, false, {
                                        fileName: "[project]/components/formbuilder/renderer/file-upload-block.tsx",
                                        lineNumber: 133,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/formbuilder/renderer/file-upload-block.tsx",
                                    lineNumber: 126,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/formbuilder/renderer/file-upload-block.tsx",
                                lineNumber: 120,
                                columnNumber: 17
                            }, this)
                        ]
                    }, index, true, {
                        fileName: "[project]/components/formbuilder/renderer/file-upload-block.tsx",
                        lineNumber: 91,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/formbuilder/renderer/file-upload-block.tsx",
                lineNumber: 89,
                columnNumber: 9
            }, this) : null,
            isError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs text-red-500 mt-1",
                children: "At least one file is required."
            }, void 0, false, {
                fileName: "[project]/components/formbuilder/renderer/file-upload-block.tsx",
                lineNumber: 147,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/formbuilder/renderer/file-upload-block.tsx",
        lineNumber: 56,
        columnNumber: 5
    }, this);
}
_c = FileUploadAnswerBlock;
var _c;
__turbopack_context__.k.register(_c, "FileUploadAnswerBlock");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/formbuilder/renderer/layout-answer-blocks.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LayoutAnswerBlock",
    ()=>LayoutAnswerBlock,
    "ParagraphAnswerBlock",
    ()=>ParagraphAnswerBlock,
    "TableAnswerBlock",
    ()=>TableAnswerBlock
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$field$2d$renderers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/formbuilder/renderer/field-renderers.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$answer$2d$block$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/formbuilder/renderer/answer-block.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/formbuilder/renderer/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
function ParagraphAnswerBlock({ block, inlineAnswers, onInlineChange, showErrors, alignClass, styleClass, edit }) {
    const content = block.content || "";
    const hasInline = content.includes("[[");
    if (!hasInline) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        className: `text-sm leading-relaxed my-1.5 ${alignClass} ${styleClass}`,
        children: content
    }, void 0, false, {
        fileName: "[project]/components/formbuilder/renderer/layout-answer-blocks.tsx",
        lineNumber: 31,
        columnNumber: 7
    }, this);
    const parts = content.split(/(\[\[[^\]]+\]\])/g);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `text-sm leading-relaxed my-1.5 ${alignClass} ${styleClass} flex flex-wrap items-baseline gap-x-0.5`,
        children: parts.filter((p)=>p.length > 0).map((part, idx)=>{
            const fi = part.match(/^\[\[([^\]]+)\]\]$/);
            if (!fi) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: part
            }, idx, false, {
                fileName: "[project]/components/formbuilder/renderer/layout-answer-blocks.tsx",
                lineNumber: 46,
                columnNumber: 27
            }, this);
            const field = (block.inlineFields ?? []).find((f)=>f.id === fi[1]);
            if (!field) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "inline-block w-16 h-6 border-b border-dashed border-border mx-0.5"
            }, idx, false, {
                fileName: "[project]/components/formbuilder/renderer/layout-answer-blocks.tsx",
                lineNumber: 50,
                columnNumber: 15
            }, this);
            const key = `${block.id}__${field.id}`;
            const val = (inlineAnswers[key] ?? "").trim();
            const minC = field.minChars ?? field.minLength;
            const hasMin = typeof minC === "number" && minC > 0;
            const fError = showErrors && (field.required || hasMin) && (!val || hasMin && val.length < minC);
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$field$2d$renderers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnswerInlineField"], {
                field: field,
                value: inlineAnswers[key] ?? "",
                onChange: (v)=>onInlineChange(key, v),
                isError: fError,
                edit: edit
            }, idx, false, {
                fileName: "[project]/components/formbuilder/renderer/layout-answer-blocks.tsx",
                lineNumber: 64,
                columnNumber: 13
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/components/formbuilder/renderer/layout-answer-blocks.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
}
_c = ParagraphAnswerBlock;
function TableAnswerBlock({ block, showErrors, inlineAnswers, onInlineChange, edit, context }) {
    const rows = Math.max(1, block.tableRows ?? 3);
    const cols = Math.max(1, block.tableCols ?? 3);
    const getCell = (ri, ci)=>block.tableCells?.[ri]?.[ci] ?? {};
    const ctx = context ?? {
        doctor: null,
        clinicProfile: null
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "my-4 overflow-x-auto rounded-lg border border-border shadow-xs",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
            className: "w-full border-collapse text-sm",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                children: Array.from({
                    length: rows
                }).map((_, ri)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                        className: "border-b border-border/80 last:border-b-0",
                        children: Array.from({
                            length: cols
                        }).map((_, ci)=>{
                            const cell = getCell(ri, ci);
                            const cellContent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["replacePlaceholders"])(cell.content ?? "", ctx);
                            const hasAnswer = cellContent.includes("[[") && (cell.inlineFields ?? []).length > 0;
                            const cAlign = cell.align === "center" ? "text-center" : cell.align === "right" ? "text-right" : "text-left";
                            const cStyle = [
                                cell.bold ? "font-bold" : "",
                                cell.italic ? "italic" : "",
                                cell.underline ? "underline" : ""
                            ].filter(Boolean).join(" ");
                            if (!hasAnswer) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                className: `border-r border-border/80 last:border-r-0 px-3 py-2 text-sm min-w-[80px] select-none bg-slate-50/50 dark:bg-slate-900/30 text-foreground ${cAlign} ${cStyle}`,
                                children: cellContent
                            }, ci, false, {
                                fileName: "[project]/components/formbuilder/renderer/layout-answer-blocks.tsx",
                                lineNumber: 130,
                                columnNumber: 21
                            }, this);
                            const parts = cellContent.split(/\[\[([^\]]+)\]\]/g);
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                className: `border-r border-border/80 last:border-r-0 px-2.5 py-2 min-w-[80px] bg-teal-50/60 dark:bg-teal-950/30 ${cAlign} ${cStyle}`,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap items-baseline gap-1",
                                    children: parts.filter((p)=>p.length > 0).map((part, pi)=>{
                                        const field = (cell.inlineFields ?? []).find((f)=>f.id === part);
                                        if (!field) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: part
                                        }, pi, false, {
                                            fileName: "[project]/components/formbuilder/renderer/layout-answer-blocks.tsx",
                                            lineNumber: 150,
                                            columnNumber: 46
                                        }, this);
                                        const key = `${block.id}__${ri}__${ci}__${field.id}`;
                                        const val = (inlineAnswers[key] ?? "").trim();
                                        const minC = field.minChars ?? field.minLength;
                                        const hasMin = typeof minC === "number" && minC > 0;
                                        const fError = showErrors && (field.required || hasMin) && (!val || hasMin && val.length < minC);
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$field$2d$renderers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnswerInlineField"], {
                                            field: field,
                                            value: inlineAnswers[key] ?? "",
                                            onChange: (v)=>onInlineChange(key, v),
                                            isError: fError,
                                            edit: edit
                                        }, pi, false, {
                                            fileName: "[project]/components/formbuilder/renderer/layout-answer-blocks.tsx",
                                            lineNumber: 160,
                                            columnNumber: 29
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/components/formbuilder/renderer/layout-answer-blocks.tsx",
                                    lineNumber: 143,
                                    columnNumber: 21
                                }, this)
                            }, ci, false, {
                                fileName: "[project]/components/formbuilder/renderer/layout-answer-blocks.tsx",
                                lineNumber: 139,
                                columnNumber: 19
                            }, this);
                        })
                    }, ri, false, {
                        fileName: "[project]/components/formbuilder/renderer/layout-answer-blocks.tsx",
                        lineNumber: 105,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/formbuilder/renderer/layout-answer-blocks.tsx",
                lineNumber: 103,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/formbuilder/renderer/layout-answer-blocks.tsx",
            lineNumber: 102,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/formbuilder/renderer/layout-answer-blocks.tsx",
        lineNumber: 101,
        columnNumber: 5
    }, this);
}
_c1 = TableAnswerBlock;
function LayoutAnswerBlock({ block, answers, onAnswerChange, showErrors, inlineAnswers, onInlineChange, edit, context, getBlockHandlers, allBlocks }) {
    const columns = block.layoutColumns ?? [];
    const numCols = Math.max(1, columns.length || 1);
    const desktopColumns = Math.min(numCols, 4);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "my-3 grid gap-4 items-start",
        style: {
            gridTemplateColumns: numCols <= 1 ? "minmax(0, 1fr)" : `repeat(${desktopColumns}, minmax(0, 1fr))`
        },
        children: columns.map((col)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-w-0 overflow-x-auto rounded-lg",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "min-w-0 flex flex-col gap-3 [&>*]:my-0!",
                    children: col.blocks.map((b)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$answer$2d$block$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnswerBlock"], {
                            block: b,
                            answers: answers,
                            onAnswerChange: onAnswerChange,
                            showErrors: showErrors,
                            inlineAnswers: inlineAnswers,
                            onInlineChange: onInlineChange,
                            edit: edit,
                            context: context,
                            blockHandlers: getBlockHandlers?.(b),
                            getBlockHandlers: getBlockHandlers,
                            allBlocks: allBlocks
                        }, b.id, false, {
                            fileName: "[project]/components/formbuilder/renderer/layout-answer-blocks.tsx",
                            lineNumber: 216,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/components/formbuilder/renderer/layout-answer-blocks.tsx",
                    lineNumber: 214,
                    columnNumber: 11
                }, this)
            }, col.id, false, {
                fileName: "[project]/components/formbuilder/renderer/layout-answer-blocks.tsx",
                lineNumber: 209,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/components/formbuilder/renderer/layout-answer-blocks.tsx",
        lineNumber: 199,
        columnNumber: 5
    }, this);
}
_c2 = LayoutAnswerBlock;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "ParagraphAnswerBlock");
__turbopack_context__.k.register(_c1, "TableAnswerBlock");
__turbopack_context__.k.register(_c2, "LayoutAnswerBlock");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/formbuilder/renderer/answer-block.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AnswerBlock",
    ()=>AnswerBlock
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$field$2d$renderers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/formbuilder/renderer/field-renderers.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$medical$2d$answer$2d$blocks$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/formbuilder/renderer/medical-answer-blocks.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/formbuilder/renderer/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$file$2d$upload$2d$block$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/formbuilder/renderer/file-upload-block.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$media$2d$url$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/media-url.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$layout$2d$answer$2d$blocks$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/formbuilder/renderer/layout-answer-blocks.tsx [app-client] (ecmascript)");
"use client";
;
;
;
;
;
;
;
function AnswerBlock({ block, answers, onAnswerChange, showErrors, inlineAnswers, onInlineChange, edit, context, blockHandlers, getBlockHandlers, allBlocks }) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shouldRenderBlock"])(block, answers, getBlockHandlers, allBlocks)) return null;
    const ctx = context ?? {
        doctor: null,
        clinicProfile: null
    };
    const content = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["replacePlaceholders"])(block.content ?? "", ctx);
    const val = answers[block.id] ?? (block.type === "checkbox_group" ? [] : "");
    const isError = showErrors && (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isBlockViolating"])(block, answers);
    const errorMessage = isError ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getBlockErrorMessage"])(block, answers) : undefined;
    const alignClass = block.align === "center" ? "text-center" : block.align === "right" ? "text-right" : "text-left";
    const styleClass = [
        block.bold ? "font-bold" : "",
        block.italic ? "italic" : "",
        block.underline ? "underline" : ""
    ].filter(Boolean).join(" ");
    const inputBase = `w-full rounded-md px-3 py-2 text-sm transition-all duration-150 shadow-xs placeholder:text-muted-foreground/60 ${isError ? "border border-red-400 ring-2 ring-red-400/20 bg-red-50/50 dark:bg-red-950/30 text-foreground" : edit ? "border border-slate-300 dark:border-slate-700/80 bg-slate-50/90 dark:bg-slate-900/80 text-foreground hover:bg-slate-100/70 dark:hover:bg-slate-900 focus:bg-background dark:focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary" : "border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/50 text-foreground"}`;
    switch(block.type){
        case "heading1":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: `text-3xl font-bold leading-tight my-4 ${alignClass} ${styleClass}`,
                children: content
            }, void 0, false, {
                fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                lineNumber: 66,
                columnNumber: 9
            }, this);
        case "heading2":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: `text-xl font-semibold leading-snug mt-6 mb-2 ${alignClass} ${styleClass}`,
                children: content
            }, void 0, false, {
                fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                lineNumber: 74,
                columnNumber: 9
            }, this);
        case "heading3":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: `text-base font-semibold leading-snug mt-4 mb-1.5 ${alignClass} ${styleClass}`,
                children: content
            }, void 0, false, {
                fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                lineNumber: 82,
                columnNumber: 9
            }, this);
        case "divider":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
                className: "border-t-2 border-border my-4"
            }, void 0, false, {
                fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                lineNumber: 89,
                columnNumber: 14
            }, this);
        case "spacer":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    height: block.height ?? 32
                }
            }, void 0, false, {
                fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                lineNumber: 91,
                columnNumber: 14
            }, this);
        case "paragraph":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$layout$2d$answer$2d$blocks$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ParagraphAnswerBlock"], {
                block: {
                    ...block,
                    content
                },
                inlineAnswers,
                onInlineChange,
                showErrors,
                alignClass,
                styleClass,
                edit
            }, void 0, false, {
                fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                lineNumber: 94,
                columnNumber: 9
            }, this);
        case "text_input":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$field$2d$renderers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FieldShell"], {
                label: block.label,
                required: block.required,
                error: errorMessage,
                children: edit ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "text",
                    className: inputBase,
                    placeholder: block.placeholder || "",
                    value: val ?? "",
                    onChange: (e)=>onAnswerChange(block.id, e.target.value)
                }, void 0, false, {
                    fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                    lineNumber: 114,
                    columnNumber: 13
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `${inputBase} min-h-9 flex items-center`,
                    children: val || "—"
                }, void 0, false, {
                    fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                    lineNumber: 122,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                lineNumber: 108,
                columnNumber: 9
            }, this);
        case "textarea_input":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$field$2d$renderers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FieldShell"], {
                label: block.label,
                required: block.required,
                error: errorMessage,
                children: edit ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                    rows: 4,
                    className: `${inputBase} resize-y min-h-[4.5rem]`,
                    placeholder: block.placeholder || "",
                    value: val ?? "",
                    onChange: (e)=>onAnswerChange(block.id, e.target.value)
                }, void 0, false, {
                    fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                    lineNumber: 136,
                    columnNumber: 13
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `${inputBase} min-h-[4.5rem] whitespace-pre-wrap`,
                    children: val || "—"
                }, void 0, false, {
                    fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                    lineNumber: 144,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                lineNumber: 130,
                columnNumber: 9
            }, this);
        case "number_input":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$field$2d$renderers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FieldShell"], {
                label: block.label,
                required: block.required,
                error: errorMessage,
                children: edit ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "number",
                    className: `${inputBase} w-36`,
                    placeholder: block.placeholder || "0",
                    value: val ?? "",
                    onChange: (e)=>onAnswerChange(block.id, e.target.value)
                }, void 0, false, {
                    fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                    lineNumber: 158,
                    columnNumber: 13
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `${inputBase} w-36`,
                    children: val || "—"
                }, void 0, false, {
                    fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                    lineNumber: 166,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                lineNumber: 152,
                columnNumber: 9
            }, this);
        case "date_input":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$field$2d$renderers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FieldShell"], {
                label: block.label,
                required: block.required,
                error: errorMessage,
                children: edit ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "date",
                    className: `${inputBase} w-44`,
                    value: val ?? "",
                    onChange: (e)=>onAnswerChange(block.id, e.target.value)
                }, void 0, false, {
                    fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                    lineNumber: 180,
                    columnNumber: 13
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `${inputBase} w-44`,
                    children: val || "—"
                }, void 0, false, {
                    fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                    lineNumber: 187,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                lineNumber: 174,
                columnNumber: 9
            }, this);
        case "checkbox_single":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `my-2 flex items-start gap-2.5 p-2.5 rounded-lg border transition-all ${isError ? "border-red-400 ring-2 ring-red-400/20 bg-red-50/50 dark:bg-red-950/30" : Boolean(val) ? "border-primary/40 bg-primary/5 dark:bg-primary/10 shadow-xs" : "border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 hover:bg-slate-100/70 dark:hover:bg-slate-900"}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "checkbox",
                        id: `chk_${block.id}`,
                        checked: Boolean(val),
                        onChange: (e)=>onAnswerChange(block.id, e.target.checked),
                        className: "mt-0.5 h-4 w-4 rounded border-2 border-slate-300 dark:border-slate-600 accent-primary cursor-pointer disabled:cursor-default",
                        disabled: !edit
                    }, void 0, false, {
                        fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                        lineNumber: 202,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        htmlFor: `chk_${block.id}`,
                        className: "text-sm font-medium text-foreground cursor-pointer flex-1",
                        children: [
                            block.label,
                            block.required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-red-500 ml-1",
                                children: "*"
                            }, void 0, false, {
                                fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                                lineNumber: 215,
                                columnNumber: 32
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                        lineNumber: 210,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                lineNumber: 193,
                columnNumber: 9
            }, this);
        case "checkbox_group":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$field$2d$renderers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChoiceGroup"], {
                type: "checkbox",
                block: block,
                value: Array.isArray(val) ? val : [],
                isError: isError,
                edit: edit,
                onChange: (next)=>onAnswerChange(block.id, next)
            }, void 0, false, {
                fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                lineNumber: 221,
                columnNumber: 9
            }, this);
        case "radio_group":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$field$2d$renderers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChoiceGroup"], {
                type: "radio",
                block: block,
                value: val ?? "",
                isError: isError,
                edit: edit,
                onChange: (next)=>onAnswerChange(block.id, next)
            }, void 0, false, {
                fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                lineNumber: 232,
                columnNumber: 9
            }, this);
        case "select_input":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$field$2d$renderers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FieldShell"], {
                label: block.label,
                required: block.required,
                error: isError ? "Please select an option." : undefined,
                children: edit ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                    className: `${inputBase} max-w-xs`,
                    value: val ?? "",
                    onChange: (e)=>onAnswerChange(block.id, e.target.value),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: "",
                            children: "Select an option…"
                        }, void 0, false, {
                            fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                            lineNumber: 254,
                            columnNumber: 15
                        }, this),
                        (block.options ?? []).map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: opt,
                                children: opt
                            }, opt, false, {
                                fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                                lineNumber: 256,
                                columnNumber: 17
                            }, this))
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                    lineNumber: 249,
                    columnNumber: 13
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `${inputBase} max-w-xs`,
                    children: val || "—"
                }, void 0, false, {
                    fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                    lineNumber: 262,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                lineNumber: 243,
                columnNumber: 9
            }, this);
        case "signature":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "my-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm leading-5 font-medium mb-1.5",
                        children: [
                            block.label ?? "Signature",
                            block.required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-red-500 ml-1",
                                children: "*"
                            }, void 0, false, {
                                fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                                lineNumber: 273,
                                columnNumber: 32
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                        lineNumber: 271,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "max-w-xs",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$field$2d$renderers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SignatureCanvas"], {
                            value: val ?? "",
                            onChange: (v)=>onAnswerChange(block.id, v),
                            isError: isError,
                            edit: edit
                        }, void 0, false, {
                            fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                            lineNumber: 276,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                        lineNumber: 275,
                        columnNumber: 11
                    }, this),
                    isError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-red-500 mt-1",
                        children: "Signature is required."
                    }, void 0, false, {
                        fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                        lineNumber: 284,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                lineNumber: 270,
                columnNumber: 9
            }, this);
        case "table":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$layout$2d$answer$2d$blocks$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableAnswerBlock"], {
                block,
                showErrors,
                inlineAnswers,
                onInlineChange,
                edit,
                context: ctx
            }, void 0, false, {
                fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                lineNumber: 290,
                columnNumber: 9
            }, this);
        case "diagnostic_record":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$medical$2d$answer$2d$blocks$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DiagnosticAnswerBlock"], {
                block: block,
                value: val ?? [],
                onChange: (v)=>onAnswerChange(block.id, v),
                isError: isError,
                edit: edit,
                handlers: blockHandlers
            }, void 0, false, {
                fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                lineNumber: 303,
                columnNumber: 9
            }, this);
        case "medication_full":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$medical$2d$answer$2d$blocks$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MedFullAnswerBlock"], {
                block: block,
                value: val ?? [],
                onChange: (v)=>onAnswerChange(block.id, v),
                isError: isError,
                edit: edit,
                handlers: blockHandlers
            }, void 0, false, {
                fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                lineNumber: 314,
                columnNumber: 9
            }, this);
        case "medication_mini":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$medical$2d$answer$2d$blocks$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MedMiniAnswerBlock"], {
                block: block,
                value: val ?? [],
                onChange: (v)=>onAnswerChange(block.id, v),
                isError: isError,
                edit: edit,
                handlers: blockHandlers
            }, void 0, false, {
                fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                lineNumber: 325,
                columnNumber: 9
            }, this);
        case "lab_record":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$medical$2d$answer$2d$blocks$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LabAnswerBlock"], {
                block: block,
                value: val ?? {},
                onChange: (v)=>onAnswerChange(block.id, v),
                isError: isError,
                edit: edit
            }, void 0, false, {
                fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                lineNumber: 336,
                columnNumber: 9
            }, this);
        case "product_listener":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$medical$2d$answer$2d$blocks$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProductListenerAnswerBlock"], {
                block: block,
                value: val ?? [],
                onChange: (v)=>onAnswerChange(block.id, v),
                isError: isError,
                edit: edit,
                handlers: blockHandlers
            }, void 0, false, {
                fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                lineNumber: 346,
                columnNumber: 9
            }, this);
        case "media_embed":
            {
                const widthClass = block.mediaWidth === "sm" ? "max-w-xs" : block.mediaWidth === "lg" ? "max-w-lg" : block.mediaWidth === "full" ? "w-full" : "max-w-sm";
                const mediaAlignClass = block.align === "center" ? "mx-auto" : block.align === "right" ? "ml-auto" : "";
                if (!block.mediaUrl) return null;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("figure", {
                    className: `my-4 ${block.align === "center" ? "text-center" : block.align === "right" ? "text-right" : "text-left"}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$media$2d$url$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMediaUrl"])(block.mediaUrl),
                            alt: block.mediaCaption || "",
                            className: `${widthClass} ${mediaAlignClass} rounded-md`
                        }, void 0, false, {
                            fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                            lineNumber: 375,
                            columnNumber: 11
                        }, this),
                        block.mediaCaption && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("figcaption", {
                            className: "text-xs text-muted-foreground mt-1.5",
                            children: block.mediaCaption
                        }, void 0, false, {
                            fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                            lineNumber: 381,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                    lineNumber: 372,
                    columnNumber: 9
                }, this);
            }
        case "file_upload":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$file$2d$upload$2d$block$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FileUploadAnswerBlock"], {
                block: block,
                value: val ?? [],
                onChange: (v)=>onAnswerChange(block.id, v),
                isError: isError,
                edit: edit
            }, void 0, false, {
                fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                lineNumber: 390,
                columnNumber: 9
            }, this);
        case "layout":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$layout$2d$answer$2d$blocks$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LayoutAnswerBlock"], {
                block: block,
                answers: answers,
                onAnswerChange: onAnswerChange,
                showErrors: showErrors,
                inlineAnswers: inlineAnswers,
                onInlineChange: onInlineChange,
                edit: edit,
                context: ctx,
                getBlockHandlers: getBlockHandlers,
                allBlocks: allBlocks
            }, void 0, false, {
                fileName: "[project]/components/formbuilder/renderer/answer-block.tsx",
                lineNumber: 400,
                columnNumber: 9
            }, this);
        default:
            return null;
    }
}
_c = AnswerBlock;
var _c;
__turbopack_context__.k.register(_c, "AnswerBlock");
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
"[project]/components/formbuilder/extensions/consultation-visit/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CLINICAL_BLOCK_TYPES",
    ()=>CLINICAL_BLOCK_TYPES,
    "SYNC_BLOCK_TYPES",
    ()=>SYNC_BLOCK_TYPES,
    "addedProductToFormAction",
    ()=>addedProductToFormAction,
    "buildLongMedicationInstructions",
    ()=>buildLongMedicationInstructions,
    "extractProductIdentifiers",
    ()=>extractProductIdentifiers,
    "findClinicalBlocks",
    ()=>findClinicalBlocks,
    "findSyncBlocks",
    ()=>findSyncBlocks,
    "formActionToAddedProduct",
    ()=>formActionToAddedProduct,
    "parseMedicationInstructions",
    ()=>parseMedicationInstructions,
    "stripClinicalAnswers",
    ()=>stripClinicalAnswers,
    "visitProductToFormAction",
    ()=>visitProductToFormAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/formbuilder/renderer/utils.ts [app-client] (ecmascript)");
;
const CLINICAL_BLOCK_TYPES = new Set([
    "product_listener",
    "diagnostic_record",
    "medication_full",
    "medication_mini"
]);
const SYNC_BLOCK_TYPES = CLINICAL_BLOCK_TYPES;
function findClinicalBlocks(blocks) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collectAnswerableBlocks"])(blocks).filter((b)=>CLINICAL_BLOCK_TYPES.has(b.type));
}
const findSyncBlocks = findClinicalBlocks;
function parseMedicationInstructions(instructions) {
    const raw = String(instructions || "");
    return {
        frequency: (raw.match(/Frequency:\s*([^,]+)/i)?.[1] || "").trim(),
        amount: (raw.match(/Amount:\s*([^,]+)/i)?.[1] || "").trim(),
        days: (raw.match(/Days:\s*([^,]+)/i)?.[1] || "").trim(),
        notes: (raw.match(/Extra notes:\s*(.+)$/i)?.[1] || "").trim()
    };
}
function buildLongMedicationInstructions(entry) {
    const { frequency, amount, days, notes } = entry;
    return `Frequency: ${frequency}, Amount: ${amount}, Days: ${days}${notes ? `, Extra notes: ${notes}` : ""}`;
}
function extractProductIdentifiers(action) {
    const ids = new Set();
    const add = (value)=>{
        if (value !== null && value !== undefined) ids.add(String(value));
    };
    add(action.backendId);
    add(action.id);
    add(action.rawData?.id);
    add(action.rawData?.product?.id);
    add(action.catalogProductId);
    add(action.backendId);
    return Array.from(ids);
}
function visitProductToFormAction(line) {
    const isConsumable = line.product.type === "CONSUMABLE_DEVICE";
    const price = Number(line.price ?? line.product.clinicPrice ?? line.product.privateRhicPrice ?? 0);
    const confirmedByName = line.confirmedBy ? [
        line.confirmedBy.firstName,
        line.confirmedBy.lastName
    ].filter(Boolean).join(" ") : null;
    return {
        id: `visit-prod-${line.id}`,
        name: line.product.name,
        type: isConsumable ? "consumable" : "action",
        quantity: line.quantity || 1,
        privatePrice: price,
        isQuantifiable: true,
        backendId: String(line.id),
        rawData: {
            id: line.product.id,
            product: line.product
        },
        source: "saved",
        billingConfirmationStatus: line.billingConfirmationStatus || null,
        confirmedByName
    };
}
function formActionToAddedProduct(action) {
    const productType = action.type === "consumable" ? "CONSUMABLE_DEVICE" : String(action.rawData?.product?.type || "MEDICAL_ACT");
    return {
        id: action.id,
        name: action.name,
        type: productType,
        qty: action.quantity,
        price: action.privatePrice ?? 0,
        backendId: action.backendId,
        catalogProductId: String(action.rawData?.id || action.rawData?.product?.id || ""),
        removedFromVisit: action.removedFromVisit,
        billingConfirmationStatus: action.billingConfirmationStatus ?? undefined,
        confirmedByName: action.confirmedByName ?? undefined
    };
}
function addedProductToFormAction(product) {
    return {
        id: product.id,
        name: product.name,
        type: product.type === "CONSUMABLE_DEVICE" ? "consumable" : "action",
        quantity: product.qty,
        privatePrice: product.price,
        isQuantifiable: true,
        backendId: product.backendId,
        rawData: product.catalogProductId ? {
            id: product.catalogProductId,
            product: {
                id: product.catalogProductId,
                name: product.name,
                type: product.type
            }
        } : undefined,
        source: product.backendId ? "saved" : "local",
        removedFromVisit: product.removedFromVisit,
        billingConfirmationStatus: product.billingConfirmationStatus ?? null,
        confirmedByName: product.confirmedByName ?? null
    };
}
function stripClinicalAnswers(answers, blocks) {
    if (!answers) return {};
    if (!blocks || blocks.length === 0) return answers;
    const clinicalBlockIds = new Set(findClinicalBlocks(blocks).map((b)=>b.id));
    const cleaned = {};
    Object.entries(answers).forEach(([key, val])=>{
        if (!clinicalBlockIds.has(key)) {
            cleaned[key] = val;
        }
    });
    return cleaned;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/formbuilder/extensions/consultation-visit/use-consultation-visit-extension.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useConsultationVisitExtension",
    ()=>useConsultationVisitExtension
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-toastify/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visit$2d$product$2d$lock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/visit-product-lock.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hooks/visits/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$department$2d$mutations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/visits/department-mutations.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$visit$2d$mutations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/visits/visit-mutations.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$visit$2f$add$2d$visit$2d$department$2d$product$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/visit/add-visit-department-product-modal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$extensions$2f$consultation$2d$visit$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/formbuilder/extensions/consultation-visit/utils.ts [app-client] (ecmascript)");
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
function resolveVisitDepartment(visitDepartments, visitDepartmentId) {
    return visitDepartments?.find((dept)=>String(dept.id) === String(visitDepartmentId)) ?? null;
}
function mapDepartmentProducts(dept) {
    if (!dept?.products?.length) return [];
    return dept.products.map((line)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$extensions$2f$consultation$2d$visit$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["visitProductToFormAction"])({
            id: String(line.id),
            quantity: line.quantity,
            billingConfirmationStatus: line.billingConfirmationStatus,
            confirmedBy: line.confirmedBy,
            product: {
                id: String(line.product.id),
                name: line.product.name,
                type: line.product.type,
                clinicPrice: line.product.clinicPrice,
                privateRhicPrice: line.product.privateRhicPrice
            }
        }));
}
function useConsultationVisitExtension(options) {
    _s();
    const { visitId, visitDepartmentId, departmentId, visitDepartments = [], visitStatus, visitDepartmentStatus, existingProducts = [], edit = true, onVisitRefetch, linkedInsurances = [] } = options;
    const { doctor } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const { addDiagnosis } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$visit$2d$mutations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAddDiagnosisToVisitDepartment"])();
    const { addMedication } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$visit$2d$mutations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAddMedicationToVisitDepartment"])();
    const { addAction } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$department$2d$mutations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAddActionToVisitDepartment"])();
    const { addConsumable } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$department$2d$mutations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAddConsumableToVisitDepartment"])();
    const { removeProduct } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$department$2d$mutations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRemoveProductFromVisitDepartment"])();
    const { updateQuantity } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$department$2d$mutations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUpdateProductQuantity"])();
    const [productModalOpen, setProductModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [, setActiveProductBlockId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const activeDepartment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useConsultationVisitExtension.useMemo[activeDepartment]": ()=>resolveVisitDepartment(visitDepartments, visitDepartmentId)
    }["useConsultationVisitExtension.useMemo[activeDepartment]"], [
        visitDepartments,
        visitDepartmentId
    ]);
    // Live products viewport — derived directly from visit department
    const visitProducts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useConsultationVisitExtension.useMemo[visitProducts]": ()=>{
            const fromDept = mapDepartmentProducts(activeDepartment);
            if (fromDept.length > 0) return fromDept;
            return existingProducts;
        }
    }["useConsultationVisitExtension.useMemo[visitProducts]"], [
        activeDepartment,
        existingProducts
    ]);
    // Live diagnoses viewport — derived directly from visit department
    const visitDiagnostics = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useConsultationVisitExtension.useMemo[visitDiagnostics]": ()=>{
            if (!activeDepartment?.diagnostics?.length) return [];
            return activeDepartment.diagnostics.map({
                "useConsultationVisitExtension.useMemo[visitDiagnostics]": (d)=>({
                        id: String(d.id),
                        diagnosis: String(d.diagnosisName || ""),
                        description: d.icd11Code || undefined
                    })
            }["useConsultationVisitExtension.useMemo[visitDiagnostics]"]);
        }
    }["useConsultationVisitExtension.useMemo[visitDiagnostics]"], [
        activeDepartment?.diagnostics
    ]);
    // Live medications viewport — derived directly from visit department
    const visitMedicationsFull = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useConsultationVisitExtension.useMemo[visitMedicationsFull]": ()=>{
            if (!activeDepartment?.medications?.length) return [];
            return activeDepartment.medications.map({
                "useConsultationVisitExtension.useMemo[visitMedicationsFull]": (m)=>{
                    const parsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$extensions$2f$consultation$2d$visit$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseMedicationInstructions"])(m.instructions || "");
                    return {
                        id: String(m.id),
                        name: String(m.medicationName || ""),
                        frequency: parsed.frequency,
                        amount: parsed.amount,
                        days: parsed.days,
                        notes: parsed.notes || undefined
                    };
                }
            }["useConsultationVisitExtension.useMemo[visitMedicationsFull]"]);
        }
    }["useConsultationVisitExtension.useMemo[visitMedicationsFull]"], [
        activeDepartment?.medications
    ]);
    const visitMedicationsMini = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useConsultationVisitExtension.useMemo[visitMedicationsMini]": ()=>{
            if (!activeDepartment?.medications?.length) return [];
            return activeDepartment.medications.map({
                "useConsultationVisitExtension.useMemo[visitMedicationsMini]": (m)=>({
                        id: String(m.id),
                        name: String(m.medicationName || ""),
                        notes: m.instructions || undefined
                    })
            }["useConsultationVisitExtension.useMemo[visitMedicationsMini]"]);
        }
    }["useConsultationVisitExtension.useMemo[visitMedicationsMini]"], [
        activeDepartment?.medications
    ]);
    const productsLocked = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useConsultationVisitExtension.useMemo[productsLocked]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$visit$2d$product$2d$lock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isVisitOrDepartmentClosedForProducts"])(visitStatus, visitDepartmentStatus)
    }["useConsultationVisitExtension.useMemo[productsLocked]"], [
        visitStatus,
        visitDepartmentStatus
    ]);
    const handleAddProduct = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useConsultationVisitExtension.useCallback[handleAddProduct]": async (type, item, quantity)=>{
            if (productsLocked) return;
            const catalogId = String(item.id);
            const existingProduct = visitProducts.find({
                "useConsultationVisitExtension.useCallback[handleAddProduct].existingProduct": (a)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$extensions$2f$consultation$2d$visit$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extractProductIdentifiers"])(a).includes(catalogId)
            }["useConsultationVisitExtension.useCallback[handleAddProduct].existingProduct"]);
            if (existingProduct) {
                const newQty = (existingProduct.quantity || 0) + quantity;
                if (existingProduct.backendId) {
                    try {
                        await updateQuantity(existingProduct.backendId, newQty);
                        onVisitRefetch?.();
                    } catch (err) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(err instanceof Error ? err.message : "Failed to update quantity");
                    }
                }
                return;
            }
            try {
                const result = type === "action" ? await addAction(visitId, departmentId, catalogId, quantity, doctor?.id) : await addConsumable(visitId, departmentId, catalogId, quantity, doctor?.id);
                if (result?.status !== "SUCCESS") {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(result?.message || "Failed to add product");
                    return;
                }
                onVisitRefetch?.();
            } catch (err) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(err instanceof Error ? err.message : "Failed to add product");
            }
        }
    }["useConsultationVisitExtension.useCallback[handleAddProduct]"], [
        productsLocked,
        visitProducts,
        visitId,
        departmentId,
        doctor?.id,
        addAction,
        addConsumable,
        updateQuantity,
        onVisitRefetch
    ]);
    const handleRemoveProduct = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useConsultationVisitExtension.useCallback[handleRemoveProduct]": async (actionId)=>{
            const action = visitProducts.find({
                "useConsultationVisitExtension.useCallback[handleRemoveProduct].action": (a)=>a.id === actionId
            }["useConsultationVisitExtension.useCallback[handleRemoveProduct].action"]);
            if (!action?.backendId) return;
            try {
                const result = await removeProduct(action.backendId);
                const ok = result?.status === "SUCCESS" || typeof result?.message === "string" && /not found/i.test(result.message);
                if (!ok) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(result?.message || "Failed to remove product");
                    return;
                }
                onVisitRefetch?.();
            } catch (err) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(err instanceof Error ? err.message : "Failed to remove product");
            }
        }
    }["useConsultationVisitExtension.useCallback[handleRemoveProduct]"], [
        visitProducts,
        removeProduct,
        onVisitRefetch
    ]);
    const handleUpdateProductQuantity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useConsultationVisitExtension.useCallback[handleUpdateProductQuantity]": async (actionId, quantity)=>{
            const action = visitProducts.find({
                "useConsultationVisitExtension.useCallback[handleUpdateProductQuantity].action": (a)=>a.id === actionId
            }["useConsultationVisitExtension.useCallback[handleUpdateProductQuantity].action"]);
            if (!action?.backendId) return;
            try {
                await updateQuantity(action.backendId, quantity);
                onVisitRefetch?.();
            } catch (err) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(err instanceof Error ? err.message : "Failed to update quantity");
            }
        }
    }["useConsultationVisitExtension.useCallback[handleUpdateProductQuantity]"], [
        visitProducts,
        updateQuantity,
        onVisitRefetch
    ]);
    const handleAddDiagnosis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useConsultationVisitExtension.useCallback[handleAddDiagnosis]": async (diagnosis, description)=>{
            if (!visitDepartmentId) return false;
            try {
                const result = await addDiagnosis(visitDepartmentId, diagnosis.trim(), description?.trim());
                if (result?.status !== "SUCCESS") {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(result?.message || "Failed to add diagnosis");
                    return false;
                }
                onVisitRefetch?.();
                return true;
            } catch (err) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(err instanceof Error ? err.message : "Failed to add diagnosis");
                return false;
            }
        }
    }["useConsultationVisitExtension.useCallback[handleAddDiagnosis]"], [
        visitDepartmentId,
        addDiagnosis,
        onVisitRefetch
    ]);
    const handleAddMedicationFull = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useConsultationVisitExtension.useCallback[handleAddMedicationFull]": async (entry)=>{
            if (!visitDepartmentId) return false;
            const instructions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$extensions$2f$consultation$2d$visit$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildLongMedicationInstructions"])(entry);
            try {
                const result = await addMedication(visitDepartmentId, entry.name.trim(), instructions);
                if (result?.status !== "SUCCESS") {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(result?.message || "Failed to add medication");
                    return false;
                }
                onVisitRefetch?.();
                return true;
            } catch (err) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(err instanceof Error ? err.message : "Failed to add medication");
                return false;
            }
        }
    }["useConsultationVisitExtension.useCallback[handleAddMedicationFull]"], [
        visitDepartmentId,
        addMedication,
        onVisitRefetch
    ]);
    const handleAddMedicationMini = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useConsultationVisitExtension.useCallback[handleAddMedicationMini]": async (name, notes)=>{
            if (!visitDepartmentId) return false;
            const instructions = notes?.trim() || "No additional notes";
            try {
                const result = await addMedication(visitDepartmentId, name.trim(), instructions);
                if (result?.status !== "SUCCESS") {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(result?.message || "Failed to add medication");
                    return false;
                }
                onVisitRefetch?.();
                return true;
            } catch (err) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(err instanceof Error ? err.message : "Failed to add medication");
                return false;
            }
        }
    }["useConsultationVisitExtension.useCallback[handleAddMedicationMini]"], [
        visitDepartmentId,
        addMedication,
        onVisitRefetch
    ]);
    const existingProductReferenceIds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useConsultationVisitExtension.useMemo[existingProductReferenceIds]": ()=>Array.from(new Set(visitProducts.flatMap(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$extensions$2f$consultation$2d$visit$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extractProductIdentifiers"])))
    }["useConsultationVisitExtension.useMemo[existingProductReferenceIds]"], [
        visitProducts
    ]);
    const isVisitOrDeptFinalised = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useConsultationVisitExtension.useMemo[isVisitOrDeptFinalised]": ()=>{
            const vStatus = String(visitStatus || "").toUpperCase();
            const dStatus = String(visitDepartmentStatus || "").toUpperCase();
            return vStatus === "FINALISED" || vStatus === "CANCELLED" || dStatus === "FINALISED" || dStatus === "CANCELLED";
        }
    }["useConsultationVisitExtension.useMemo[isVisitOrDeptFinalised]"], [
        visitStatus,
        visitDepartmentStatus
    ]);
    const getBlockHandlers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useConsultationVisitExtension.useCallback[getBlockHandlers]": (block)=>{
            const canEditClinical = !isVisitOrDeptFinalised;
            switch(block.type){
                case "product_listener":
                    return {
                        productActions: visitProducts,
                        onOpenProductPicker: !productsLocked && edit ? ({
                            "useConsultationVisitExtension.useCallback[getBlockHandlers]": ()=>{
                                setActiveProductBlockId(block.id);
                                setProductModalOpen(true);
                            }
                        })["useConsultationVisitExtension.useCallback[getBlockHandlers]"] : undefined,
                        onRemoveProduct: !productsLocked && edit ? ({
                            "useConsultationVisitExtension.useCallback[getBlockHandlers]": (actionId)=>{
                                void handleRemoveProduct(actionId);
                            }
                        })["useConsultationVisitExtension.useCallback[getBlockHandlers]"] : undefined,
                        onUpdateProductQuantity: !productsLocked && edit ? ({
                            "useConsultationVisitExtension.useCallback[getBlockHandlers]": (actionId, qty)=>{
                                void handleUpdateProductQuantity(actionId, qty);
                            }
                        })["useConsultationVisitExtension.useCallback[getBlockHandlers]"] : undefined,
                        productsLocked,
                        visitId,
                        departmentId
                    };
                case "diagnostic_record":
                    return {
                        diagnostics: visitDiagnostics,
                        onAddDiagnosis: canEditClinical ? ({
                            "useConsultationVisitExtension.useCallback[getBlockHandlers]": (diagnosis, description)=>handleAddDiagnosis(diagnosis, description)
                        })["useConsultationVisitExtension.useCallback[getBlockHandlers]"] : undefined
                    };
                case "medication_full":
                    return {
                        medicationsFull: visitMedicationsFull,
                        onAddMedicationFull: canEditClinical ? ({
                            "useConsultationVisitExtension.useCallback[getBlockHandlers]": (entry)=>handleAddMedicationFull(entry)
                        })["useConsultationVisitExtension.useCallback[getBlockHandlers]"] : undefined
                    };
                case "medication_mini":
                    return {
                        medicationsMini: visitMedicationsMini,
                        onAddMedicationMini: canEditClinical ? ({
                            "useConsultationVisitExtension.useCallback[getBlockHandlers]": (name, notes)=>handleAddMedicationMini(name, notes)
                        })["useConsultationVisitExtension.useCallback[getBlockHandlers]"] : undefined
                    };
                default:
                    return null;
            }
        }
    }["useConsultationVisitExtension.useCallback[getBlockHandlers]"], [
        edit,
        isVisitOrDeptFinalised,
        productsLocked,
        visitProducts,
        visitDiagnostics,
        visitMedicationsFull,
        visitMedicationsMini,
        visitId,
        departmentId,
        handleRemoveProduct,
        handleUpdateProductQuantity,
        handleAddDiagnosis,
        handleAddMedicationFull,
        handleAddMedicationMini
    ]);
    const renderOverlay = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useConsultationVisitExtension.useCallback[renderOverlay]": ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$visit$2f$add$2d$visit$2d$department$2d$product$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                open: productModalOpen,
                onClose: {
                    "useConsultationVisitExtension.useCallback[renderOverlay]": ()=>{
                        setProductModalOpen(false);
                        setActiveProductBlockId(null);
                    }
                }["useConsultationVisitExtension.useCallback[renderOverlay]"],
                visitDepartments: visitDepartments,
                visitDepartmentId: visitDepartmentId,
                currentCatalogDepartmentId: departmentId,
                viewMode: "service",
                onAdd: handleAddProduct,
                existingProductReferenceIds: existingProductReferenceIds,
                linkedInsurances: linkedInsurances
            }, void 0, false, {
                fileName: "[project]/components/formbuilder/extensions/consultation-visit/use-consultation-visit-extension.tsx",
                lineNumber: 423,
                columnNumber: 7
            }, this)
    }["useConsultationVisitExtension.useCallback[renderOverlay]"], [
        productModalOpen,
        visitDepartments,
        visitDepartmentId,
        departmentId,
        handleAddProduct,
        existingProductReferenceIds,
        linkedInsurances
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useConsultationVisitExtension.useMemo": ()=>({
                id: "consultation-visit",
                getBlockHandlers,
                renderOverlay
            })
    }["useConsultationVisitExtension.useMemo"], [
        getBlockHandlers,
        renderOverlay
    ]);
}
_s(useConsultationVisitExtension, "drbOi19CPtwW9/A5+aLeJmaqyN8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$visit$2d$mutations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAddDiagnosisToVisitDepartment"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$visit$2d$mutations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAddMedicationToVisitDepartment"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$department$2d$mutations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAddActionToVisitDepartment"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$department$2d$mutations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAddConsumableToVisitDepartment"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$department$2d$mutations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRemoveProductFromVisitDepartment"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$visits$2f$department$2d$mutations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUpdateProductQuantity"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/formbuilder/extensions/consultation-visit/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$extensions$2f$consultation$2d$visit$2f$use$2d$consultation$2d$visit$2d$extension$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/formbuilder/extensions/consultation-visit/use-consultation-visit-extension.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$extensions$2f$consultation$2d$visit$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/formbuilder/extensions/consultation-visit/utils.ts [app-client] (ecmascript)");
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/formbuilder/extensions/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createExtensionBlockHandlersResolver",
    ()=>createExtensionBlockHandlersResolver,
    "mergeBlockHandlers",
    ()=>mergeBlockHandlers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$extensions$2f$consultation$2d$visit$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/formbuilder/extensions/consultation-visit/index.ts [app-client] (ecmascript) <locals>");
;
function mergeBlockHandlers(extensions, block) {
    if (!extensions?.length) return undefined;
    let merged;
    for (const ext of extensions){
        const handlers = ext.getBlockHandlers?.(block);
        if (handlers) {
            merged = {
                ...merged,
                ...handlers
            };
        }
    }
    return merged;
}
function createExtensionBlockHandlersResolver(extensions) {
    return (block)=>mergeBlockHandlers(extensions, block);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/formbuilder/form-renderer.tsx [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FormRenderer",
    ()=>FormRenderer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * FormRenderer — reusable answer-mode/view-mode form component.
 *
 * `initialAnswers` may contain both block answers and inline answers.
 * Inline answer keys use:
 * - paragraph inline fields → `blockId__fieldId`
 * - table inline fields → `blockId__ri__ci__fieldId`
 *
 * When `edit` is `false`, the component renders provided answers read-only.
 * When `edit` is `true` (default), the component allows editing them.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$answer$2d$block$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/formbuilder/renderer/answer-block.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/formbuilder/renderer/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$extensions$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/formbuilder/extensions/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$media$2d$url$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/media-url.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$extensions$2f$consultation$2d$visit$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/formbuilder/extensions/consultation-visit/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$consultation$2d$form$2d$renderer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/formbuilder/consultation-form-renderer.tsx [app-client] (ecmascript)");
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
const FormRenderer = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = _s(function FormRenderer({ form, showTitle = false, validate = true, onSubmit, onChange, submitLabel = "Submit", hideSubmit = false, className = "", initialAnswers = {}, edit = true, mode = "full", extensions, controlledAnswers, onControlledAnswersChange }, ref) {
    _s();
    const initial = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "FormRenderer.FormRenderer.useMemo[initial]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["splitInitialAnswers"])(initialAnswers)
    }["FormRenderer.FormRenderer.useMemo[initial]"], [
        initialAnswers
    ]);
    const isControlled = controlledAnswers !== undefined;
    const [internalAnswers, setInternalAnswers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initial.blockAnswers);
    const answers = isControlled ? controlledAnswers : internalAnswers;
    const setAnswers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FormRenderer.FormRenderer.useCallback[setAnswers]": (updater)=>{
            const resolve = {
                "FormRenderer.FormRenderer.useCallback[setAnswers].resolve": (prev)=>typeof updater === "function" ? updater(prev) : updater
            }["FormRenderer.FormRenderer.useCallback[setAnswers].resolve"];
            if (isControlled) {
                onControlledAnswersChange?.(resolve(controlledAnswers));
            } else {
                setInternalAnswers(resolve);
            }
        }
    }["FormRenderer.FormRenderer.useCallback[setAnswers]"], [
        isControlled,
        controlledAnswers,
        onControlledAnswersChange
    ]);
    const [inlineAnswers, setInlineAnswers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initial.inlineAnswers);
    const [showErrors, setShowErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [currentStep, setCurrentStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    // Inline answers render from local state seeded once at mount. When the
    // caller swaps in a different answer set without remounting (consultation
    // preview switching answers) that state goes stale, so re-seed it. Gated on
    // a content signature so live edits are never clobbered and a fresh
    // `initialAnswers` object literal on every render is a no-op.
    const incomingInlineSignature = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "FormRenderer.FormRenderer.useMemo[incomingInlineSignature]": ()=>JSON.stringify(initial.inlineAnswers)
    }["FormRenderer.FormRenderer.useMemo[incomingInlineSignature]"], [
        initial.inlineAnswers
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FormRenderer.FormRenderer.useEffect": ()=>{
            setInlineAnswers({
                "FormRenderer.FormRenderer.useEffect": (prev)=>JSON.stringify(prev) === incomingInlineSignature ? prev : initial.inlineAnswers
            }["FormRenderer.FormRenderer.useEffect"]);
        }
    }["FormRenderer.FormRenderer.useEffect"], [
        incomingInlineSignature,
        initial.inlineAnswers
    ]);
    const { doctor, clinicProfile } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "FormRenderer.FormRenderer.useMemo[context]": ()=>({
                doctor,
                clinicProfile
            })
    }["FormRenderer.FormRenderer.useMemo[context]"], [
        doctor,
        clinicProfile
    ]);
    const scrollRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const getBlockHandlers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "FormRenderer.FormRenderer.useMemo[getBlockHandlers]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$extensions$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createExtensionBlockHandlersResolver"])(extensions)
    }["FormRenderer.FormRenderer.useMemo[getBlockHandlers]"], [
        extensions
    ]);
    const notifyChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FormRenderer.FormRenderer.useCallback[notifyChange]": (ans, inline)=>{
            onChange?.({
                ...ans,
                ...inline
            });
        }
    }["FormRenderer.FormRenderer.useCallback[notifyChange]"], [
        onChange
    ]);
    const handleAnswerChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FormRenderer.FormRenderer.useCallback[handleAnswerChange]": (blockId, value)=>{
            if (!edit) return;
            setAnswers({
                "FormRenderer.FormRenderer.useCallback[handleAnswerChange]": (prev)=>{
                    const next = {
                        ...prev,
                        [blockId]: value
                    };
                    notifyChange(next, inlineAnswers);
                    return next;
                }
            }["FormRenderer.FormRenderer.useCallback[handleAnswerChange]"]);
        }
    }["FormRenderer.FormRenderer.useCallback[handleAnswerChange]"], [
        edit,
        inlineAnswers,
        notifyChange,
        setAnswers
    ]);
    const handleInlineChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FormRenderer.FormRenderer.useCallback[handleInlineChange]": (key, value)=>{
            if (!edit) return;
            setInlineAnswers({
                "FormRenderer.FormRenderer.useCallback[handleInlineChange]": (prev)=>{
                    const next = {
                        ...prev,
                        [key]: value
                    };
                    notifyChange(answers, next);
                    return next;
                }
            }["FormRenderer.FormRenderer.useCallback[handleInlineChange]"]);
            // Table/paragraph inline answers live in `inlineAnswers`, outside the
            // answer map. Controlled consumers (consultation auto-save) only watch
            // `answers`, so mirror the value there as well — otherwise the edit
            // never triggers a save and is lost on reload. Hydration splits these
            // `__` keys back out into `inlineAnswers`, so rendering is unaffected.
            setAnswers({
                "FormRenderer.FormRenderer.useCallback[handleInlineChange]": (prev)=>prev[key] === value ? prev : {
                        ...prev,
                        [key]: value
                    }
            }["FormRenderer.FormRenderer.useCallback[handleInlineChange]"]);
        }
    }["FormRenderer.FormRenderer.useCallback[handleInlineChange]"], [
        answers,
        edit,
        notifyChange,
        setAnswers
    ]);
    const sections = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "FormRenderer.FormRenderer.useMemo[sections]": ()=>{
            if (mode === "full") return [
                {
                    title: "Form",
                    blocks: form?.blocks ?? []
                }
            ];
            const res = [];
            let currentSection = {
                title: "Start",
                blocks: []
            };
            (form?.blocks ?? []).forEach({
                "FormRenderer.FormRenderer.useMemo[sections]": (block)=>{
                    if (block.type === "heading1" || block.type === "heading2") {
                        if (currentSection.blocks.length > 0) {
                            res.push(currentSection);
                        }
                        currentSection = {
                            title: block.content ?? "Section",
                            blocks: [
                                block
                            ]
                        };
                    } else {
                        currentSection.blocks.push(block);
                    }
                }
            }["FormRenderer.FormRenderer.useMemo[sections]"]);
            if (currentSection.blocks.length > 0) res.push(currentSection);
            return res.length > 0 ? res : [
                {
                    title: "Form",
                    blocks: []
                }
            ];
        }
    }["FormRenderer.FormRenderer.useMemo[sections]"], [
        form?.blocks,
        mode
    ]);
    const allBlocks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "FormRenderer.FormRenderer.useMemo[allBlocks]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collectAnswerableBlocks"])(form?.blocks ?? [])
    }["FormRenderer.FormRenderer.useMemo[allBlocks]"], [
        form?.blocks
    ]);
    const violations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "FormRenderer.FormRenderer.useMemo[violations]": ()=>allBlocks.filter({
                "FormRenderer.FormRenderer.useMemo[violations]": (b)=>{
                    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shouldRenderBlock"])(b, answers, getBlockHandlers, form?.blocks)) {
                        return false;
                    }
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isBlockViolating"])(b, answers);
                }
            }["FormRenderer.FormRenderer.useMemo[violations]"])
    }["FormRenderer.FormRenderer.useMemo[violations]"], [
        allBlocks,
        answers,
        getBlockHandlers,
        form?.blocks
    ]);
    const hasViolations = violations.length > 0;
    const validateAndShowErrors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FormRenderer.FormRenderer.useCallback[validateAndShowErrors]": ()=>{
            if (!validate) return true;
            if (hasViolations) {
                setShowErrors(true);
                // focus first invalid block to make it obvious what to fix
                const first = violations[0];
                if (first?.id) {
                    scrollToBlock(String(first.id));
                }
                return false;
            }
            return true;
        }
    }["FormRenderer.FormRenderer.useCallback[validateAndShowErrors]"], [
        validate,
        hasViolations,
        violations
    ]);
    const clearErrors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FormRenderer.FormRenderer.useCallback[clearErrors]": ()=>{
            setShowErrors(false);
        }
    }["FormRenderer.FormRenderer.useCallback[clearErrors]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useImperativeHandle"])(ref, {
        "FormRenderer.FormRenderer.useImperativeHandle": ()=>({
                validateAndShowErrors,
                clearErrors
            })
    }["FormRenderer.FormRenderer.useImperativeHandle"], [
        validateAndShowErrors,
        clearErrors
    ]);
    const handleSubmit = (e)=>{
        e.preventDefault();
        if (!edit) return;
        if (!validateAndShowErrors()) {
            return;
        }
        onSubmit?.({
            ...answers,
            ...inlineAnswers
        });
    };
    const scrollToBlock = (blockId)=>{
        const el = document.getElementById(`block-${blockId}`);
        if (el) {
            el.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
            el.classList.add("ring-2", "ring-red-500", "ring-offset-2");
            setTimeout(()=>el.classList.remove("ring-2", "ring-red-500", "ring-offset-2"), 2000);
        }
    };
    if (!form) return null;
    const primaryColor = form.theme?.primaryColor || "#FF6900";
    const logoPlacement = form.theme?.logoPlacement || "left";
    const showLogo = logoPlacement !== "none" && Boolean(clinicProfile?.logoUrl);
    const currentBlocks = mode === "wizard" ? sections[currentStep].blocks : form.blocks;
    const isLastStep = mode === "wizard" ? currentStep === sections.length - 1 : true;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex flex-col min-h-full", className),
        style: {
            "--primary": primaryColor
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit,
                noValidate: true,
                className: "flex-1",
                children: [
                    (showTitle || showLogo) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mb-8 flex flex-col", logoPlacement === "center" ? "items-center text-center" : logoPlacement === "right" ? "items-end text-right" : "items-start text-left"),
                        children: [
                            showLogo && clinicProfile?.logoUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$media$2d$url$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMediaUrl"])(clinicProfile.logoUrl),
                                alt: "Clinic Logo",
                                className: "h-12 w-auto mb-4"
                            }, void 0, false, {
                                fileName: "[project]/components/formbuilder/form-renderer.tsx",
                                lineNumber: 301,
                                columnNumber: 17
                            }, this),
                            showTitle && form.name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "text-2xl font-bold text-foreground",
                                        children: form.name
                                    }, void 0, false, {
                                        fileName: "[project]/components/formbuilder/form-renderer.tsx",
                                        lineNumber: 309,
                                        columnNumber: 19
                                    }, this),
                                    form.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-muted-foreground mt-1 max-w-2xl",
                                        children: form.description
                                    }, void 0, false, {
                                        fileName: "[project]/components/formbuilder/form-renderer.tsx",
                                        lineNumber: 313,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/formbuilder/form-renderer.tsx",
                                lineNumber: 308,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/formbuilder/form-renderer.tsx",
                        lineNumber: 290,
                        columnNumber: 13
                    }, this),
                    mode === "wizard" && sections.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between mb-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-bold uppercase tracking-widest",
                                        style: {
                                            color: primaryColor
                                        },
                                        children: [
                                            "Step ",
                                            currentStep + 1,
                                            " of ",
                                            sections.length,
                                            ":",
                                            " ",
                                            sections[currentStep].title
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/formbuilder/form-renderer.tsx",
                                        lineNumber: 325,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-medium text-muted-foreground",
                                        children: [
                                            Math.round((currentStep + 1) / sections.length * 100),
                                            "% Complete"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/formbuilder/form-renderer.tsx",
                                        lineNumber: 332,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/formbuilder/form-renderer.tsx",
                                lineNumber: 324,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-1.5 w-full bg-muted rounded-full overflow-hidden",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-full transition-all duration-500",
                                    style: {
                                        width: `${(currentStep + 1) / sections.length * 100}%`,
                                        backgroundColor: primaryColor
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/components/formbuilder/form-renderer.tsx",
                                    lineNumber: 338,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/formbuilder/form-renderer.tsx",
                                lineNumber: 337,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/formbuilder/form-renderer.tsx",
                        lineNumber: 323,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-6",
                        ref: scrollRef,
                        children: form.blocks.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center text-muted-foreground py-20",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-2xl mb-2",
                                    children: "📄"
                                }, void 0, false, {
                                    fileName: "[project]/components/formbuilder/form-renderer.tsx",
                                    lineNumber: 352,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "No blocks in this form yet."
                                }, void 0, false, {
                                    fileName: "[project]/components/formbuilder/form-renderer.tsx",
                                    lineNumber: 353,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/formbuilder/form-renderer.tsx",
                            lineNumber: 351,
                            columnNumber: 15
                        }, this) : currentBlocks.map((block)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                id: `block-${block.id}`,
                                className: "transition-all duration-300 rounded-lg",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$renderer$2f$answer$2d$block$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnswerBlock"], {
                                    block: block,
                                    answers: answers,
                                    onAnswerChange: handleAnswerChange,
                                    showErrors: showErrors,
                                    inlineAnswers: inlineAnswers,
                                    onInlineChange: handleInlineChange,
                                    edit: edit,
                                    context: context,
                                    blockHandlers: getBlockHandlers(block),
                                    getBlockHandlers: getBlockHandlers,
                                    allBlocks: form.blocks
                                }, void 0, false, {
                                    fileName: "[project]/components/formbuilder/form-renderer.tsx",
                                    lineNumber: 362,
                                    columnNumber: 19
                                }, this)
                            }, block.id, false, {
                                fileName: "[project]/components/formbuilder/form-renderer.tsx",
                                lineNumber: 357,
                                columnNumber: 17
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/formbuilder/form-renderer.tsx",
                        lineNumber: 349,
                        columnNumber: 11
                    }, this),
                    edit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-12 flex items-center gap-3",
                        children: [
                            mode === "wizard" && currentStep > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                type: "button",
                                variant: "outline",
                                onClick: ()=>{
                                    setCurrentStep((s)=>s - 1);
                                    window.scrollTo({
                                        top: 0,
                                        behavior: "smooth"
                                    });
                                },
                                className: "gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/formbuilder/form-renderer.tsx",
                                        lineNumber: 392,
                                        columnNumber: 19
                                    }, this),
                                    "Back"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/formbuilder/form-renderer.tsx",
                                lineNumber: 383,
                                columnNumber: 17
                            }, this),
                            !isLastStep ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                type: "button",
                                onClick: ()=>{
                                    setCurrentStep((s)=>s + 1);
                                    window.scrollTo({
                                        top: 0,
                                        behavior: "smooth"
                                    });
                                },
                                className: "gap-2 px-8",
                                style: {
                                    backgroundColor: primaryColor
                                },
                                children: [
                                    "Next",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/formbuilder/form-renderer.tsx",
                                        lineNumber: 408,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/formbuilder/form-renderer.tsx",
                                lineNumber: 398,
                                columnNumber: 17
                            }, this) : !hideSubmit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                type: "submit",
                                className: "text-white px-8 gap-2",
                                style: {
                                    backgroundColor: primaryColor
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/formbuilder/form-renderer.tsx",
                                        lineNumber: 417,
                                        columnNumber: 21
                                    }, this),
                                    submitLabel
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/formbuilder/form-renderer.tsx",
                                lineNumber: 412,
                                columnNumber: 19
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/formbuilder/form-renderer.tsx",
                        lineNumber: 381,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/formbuilder/form-renderer.tsx",
                lineNumber: 287,
                columnNumber: 9
            }, this),
            edit && showErrors && hasViolations && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md z-50 animate-in fade-in slide-in-from-bottom-4 duration-300",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-destructive text-destructive-foreground shadow-2xl rounded-2xl p-4 border border-destructive/20 backdrop-blur-sm",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                className: "h-5 w-5 shrink-0 mt-0.5"
                            }, void 0, false, {
                                fileName: "[project]/components/formbuilder/form-renderer.tsx",
                                lineNumber: 431,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 min-w-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm font-bold",
                                        children: "Please complete required fields"
                                    }, void 0, false, {
                                        fileName: "[project]/components/formbuilder/form-renderer.tsx",
                                        lineNumber: 433,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-2 flex flex-wrap gap-1.5",
                                        children: [
                                            violations.slice(0, 5).map((v)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>scrollToBlock(v.id),
                                                    className: "text-[11px] px-2 py-0.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors truncate max-w-30",
                                                    children: v.label || "Required Field"
                                                }, v.id, false, {
                                                    fileName: "[project]/components/formbuilder/form-renderer.tsx",
                                                    lineNumber: 438,
                                                    columnNumber: 23
                                                }, this)),
                                            violations.length > 5 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[11px] opacity-70",
                                                children: [
                                                    "+",
                                                    violations.length - 5,
                                                    " more"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/formbuilder/form-renderer.tsx",
                                                lineNumber: 447,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/formbuilder/form-renderer.tsx",
                                        lineNumber: 436,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/formbuilder/form-renderer.tsx",
                                lineNumber: 432,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/formbuilder/form-renderer.tsx",
                        lineNumber: 430,
                        columnNumber: 15
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/formbuilder/form-renderer.tsx",
                    lineNumber: 429,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/formbuilder/form-renderer.tsx",
                lineNumber: 428,
                columnNumber: 11
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/formbuilder/form-renderer.tsx",
        lineNumber: 283,
        columnNumber: 7
    }, this);
}, "AfTZz7cX0CUzyzzG9y28275ctCk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
})), "AfTZz7cX0CUzyzzG9y28275ctCk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c1 = FormRenderer;
var _c, _c1;
__turbopack_context__.k.register(_c, "FormRenderer$forwardRef");
__turbopack_context__.k.register(_c1, "FormRenderer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/formbuilder/consultation-form-renderer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ConsultationFormRenderer",
    ()=>ConsultationFormRenderer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$form$2d$renderer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/formbuilder/form-renderer.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$extensions$2f$consultation$2d$visit$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/formbuilder/extensions/consultation-visit/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$extensions$2f$consultation$2d$visit$2f$use$2d$consultation$2d$visit$2d$extension$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/formbuilder/extensions/consultation-visit/use-consultation-visit-extension.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const ConsultationFormRenderer = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = _s(function ConsultationFormRenderer({ visitId, visitDepartmentId, departmentId, visitDepartments, visitStatus, visitDepartmentStatus, existingProducts, onVisitRefetch, linkedInsurances, visitInsurances, initialAnswers = {}, onChange, form, controlledAnswers: controlledAnswersProp, onControlledAnswersChange, ...rest }, ref) {
    _s();
    const [internalAnswers, setInternalAnswers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "ConsultationFormRenderer.ConsultationFormRenderer.useState": ()=>({
                ...initialAnswers
            })
    }["ConsultationFormRenderer.ConsultationFormRenderer.useState"]);
    const isControlled = controlledAnswersProp !== undefined;
    const answers = isControlled ? controlledAnswersProp : internalAnswers;
    const setAnswers = isControlled ? (next)=>{
        const resolved = typeof next === "function" ? next(controlledAnswersProp) : next;
        onControlledAnswersChange?.(resolved);
    } : setInternalAnswers;
    const resolvedLinkedInsurances = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ConsultationFormRenderer.ConsultationFormRenderer.useMemo[resolvedLinkedInsurances]": ()=>linkedInsurances || visitInsurances || []
    }["ConsultationFormRenderer.ConsultationFormRenderer.useMemo[resolvedLinkedInsurances]"], [
        linkedInsurances,
        visitInsurances
    ]);
    const extensionOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ConsultationFormRenderer.ConsultationFormRenderer.useMemo[extensionOptions]": ()=>({
                visitId,
                visitDepartmentId,
                departmentId,
                visitDepartments,
                visitStatus,
                visitDepartmentStatus,
                existingProducts,
                onVisitRefetch,
                linkedInsurances: resolvedLinkedInsurances
            })
    }["ConsultationFormRenderer.ConsultationFormRenderer.useMemo[extensionOptions]"], [
        visitId,
        visitDepartmentId,
        departmentId,
        visitDepartments,
        visitStatus,
        visitDepartmentStatus,
        existingProducts,
        onVisitRefetch,
        resolvedLinkedInsurances
    ]);
    const consultationExtension = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$extensions$2f$consultation$2d$visit$2f$use$2d$consultation$2d$visit$2d$extension$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useConsultationVisitExtension"])({
        ...extensionOptions,
        form,
        answers,
        setAnswers,
        edit: rest.edit ?? true
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$form$2d$renderer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["FormRenderer"], {
                ref: ref,
                form: form,
                initialAnswers: initialAnswers,
                controlledAnswers: answers,
                onControlledAnswersChange: (next)=>{
                    if (!isControlled) setInternalAnswers(next);
                    else onControlledAnswersChange?.(next);
                    onChange?.(next);
                },
                onChange: onChange,
                extensions: [
                    consultationExtension
                ],
                ...rest
            }, void 0, false, {
                fileName: "[project]/components/formbuilder/consultation-form-renderer.tsx",
                lineNumber: 119,
                columnNumber: 7
            }, this),
            consultationExtension.renderOverlay?.()
        ]
    }, void 0, true);
}, "Syvfd27P4DDqmPCNVb87trOpkUc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$extensions$2f$consultation$2d$visit$2f$use$2d$consultation$2d$visit$2d$extension$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useConsultationVisitExtension"]
    ];
})), "Syvfd27P4DDqmPCNVb87trOpkUc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$extensions$2f$consultation$2d$visit$2f$use$2d$consultation$2d$visit$2d$extension$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useConsultationVisitExtension"]
    ];
});
_c1 = ConsultationFormRenderer;
var _c, _c1;
__turbopack_context__.k.register(_c, "ConsultationFormRenderer$forwardRef");
__turbopack_context__.k.register(_c1, "ConsultationFormRenderer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/standalone-forms/visit-answers.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useConsultationFormLoader",
    ()=>useConsultationFormLoader,
    "useSaveVisitStandaloneAnswer",
    ()=>useSaveVisitStandaloneAnswer,
    "useStandaloneAnswer",
    ()=>useStandaloneAnswer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/react/hooks/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/react/hooks/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$standalone$2d$forms$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/queries/standalone-forms.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$standalone$2d$forms$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/mutations/standalone-forms.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature();
;
;
;
;
function useStandaloneAnswer(answerId, options) {
    _s();
    const { data, loading, error, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$standalone$2d$forms$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GET_STANDALONE_ANSWER_QUERY"], {
        variables: {
            id: answerId
        },
        skip: !answerId || options?.skip,
        fetchPolicy: "network-only"
    });
    const answer = data?.getStandaloneAnswer?.data ?? null;
    return {
        answer,
        loading,
        error: error?.message ?? null,
        refetch
    };
}
_s(useStandaloneAnswer, "Jp+fcJk/QxZ1Qx0OR1h5O02cnEU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useSaveVisitStandaloneAnswer() {
    _s1();
    const [saveVisitMutate, { loading: savingVisit, error: saveVisitError }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$standalone$2d$forms$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SAVE_VISIT_STANDALONE_ANSWER_MUTATION"]);
    const [updateAnswerMutate, { loading: updatingAnswer, error: updateAnswerError }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$mutations$2f$standalone$2d$forms$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UPDATE_STANDALONE_ANSWER_MUTATION"]);
    const saveVisitAnswer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSaveVisitStandaloneAnswer.useCallback[saveVisitAnswer]": async (input)=>{
            if (input.answerId) {
                const { data } = await updateAnswerMutate({
                    variables: {
                        answerId: input.answerId,
                        answers: input.answers,
                        status: input.status,
                        score: input.score
                    }
                });
                if (data?.updateStandaloneAnswer?.status === "ERROR") {
                    throw new Error(data.updateStandaloneAnswer.message ?? "Failed to update answer");
                }
                return {
                    answer: data?.updateStandaloneAnswer?.data,
                    visitDepartment: {
                        id: input.visitDepartmentId,
                        answerId: input.answerId
                    }
                };
            }
            const { data } = await saveVisitMutate({
                variables: {
                    visitId: input.visitId,
                    visitDepartmentId: input.visitDepartmentId,
                    formVersionId: input.formVersionId,
                    answers: input.answers,
                    status: input.status,
                    score: input.score
                },
                update (cache, { data: mutationData }) {
                    const savedAnswerId = mutationData?.saveVisitStandaloneAnswer?.data?.answer?.id || mutationData?.saveVisitStandaloneAnswer?.data?.visitDepartment?.answerId;
                    if (savedAnswerId) {
                        cache.modify({
                            id: cache.identify({
                                __typename: "VisitDepartment",
                                id: input.visitDepartmentId
                            }),
                            fields: {
                                answerId () {
                                    return savedAnswerId;
                                }
                            }
                        });
                    }
                }
            });
            if (data?.saveVisitStandaloneAnswer?.status === "ERROR") {
                throw new Error(data.saveVisitStandaloneAnswer.message ?? "Failed to save answer");
            }
            return data?.saveVisitStandaloneAnswer?.data;
        }
    }["useSaveVisitStandaloneAnswer.useCallback[saveVisitAnswer]"], [
        saveVisitMutate,
        updateAnswerMutate
    ]);
    return {
        saveVisitAnswer,
        loading: savingVisit || updatingAnswer,
        error: saveVisitError?.message ?? updateAnswerError?.message ?? null
    };
}
_s1(useSaveVisitStandaloneAnswer, "M/9zQ6Jfo1i1Z5748vfIC10J39M=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useConsultationFormLoader(options) {
    _s2();
    const hasAnswer = Boolean(options.answerId);
    const { answer, loading: answerLoading, error: answerError, refetch: refetchAnswer } = useStandaloneAnswer(options.answerId ?? null, {
        skip: !hasAnswer
    });
    // Always fetch the department's default form as well: it is the primary
    // source on a first-ever consultation (no answer yet) and the fallback when a
    // saved answer cannot be loaded or mapped — preventing the
    // "Could not load the saved consultation answer." dead-end.
    const { defaultForm, loading: deptFormsLoading, error: deptFormsError, refetch: refetchDeptForms } = useDepartmentFormsForConsultation(options.departmentId, {
        skip: !options.departmentId
    });
    const answerReady = hasAnswer && Boolean(answer);
    // With an answerId, keep loading until the answer is ready (or, if it fails,
    // until the default-form fallback is ready). Without an answerId, load the
    // default form as usual.
    const loading = hasAnswer ? answerLoading || !answerReady && deptFormsLoading : deptFormsLoading;
    // Surface an error only when there is nothing left to fall back to AND the
    // fallback query has settled (so we never flash an error while the default
    // form is still loading).
    const error = hasAnswer ? answerError && !answerReady && !defaultForm && !deptFormsLoading ? answerError : null : deptFormsError;
    return {
        answer,
        defaultForm,
        loading,
        error,
        refetch: hasAnswer ? refetchAnswer : refetchDeptForms,
        source: hasAnswer ? "answer" : "department"
    };
}
_s2(useConsultationFormLoader, "fj5AuJx0CBREXCJH8sqj3hQONVs=", false, function() {
    return [
        useStandaloneAnswer,
        useDepartmentFormsForConsultation
    ];
});
function useDepartmentFormsForConsultation(departmentId, options) {
    _s3();
    const { data, loading, error, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$standalone$2d$forms$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GET_DEPARTMENT_FORMS_QUERY"], {
        variables: {
            departmentId
        },
        skip: !departmentId || options?.skip,
        fetchPolicy: "network-only"
    });
    const defaultForm = data?.getDepartmentForms?.data?.defaultForm ?? null;
    return {
        defaultForm,
        loading,
        error: error?.message ?? null,
        refetch
    };
}
_s3(useDepartmentFormsForConsultation, "Jp+fcJk/QxZ1Qx0OR1h5O02cnEU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/standalone-form-mapper.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mapStandaloneAnswerToSavedForm",
    ()=>mapStandaloneAnswerToSavedForm,
    "mapStandaloneFormToSavedForm",
    ()=>mapStandaloneFormToSavedForm,
    "mapStandaloneVersionToSavedForm",
    ()=>mapStandaloneVersionToSavedForm,
    "parseStandaloneAnswers",
    ()=>parseStandaloneAnswers
]);
function mapStandaloneVersionToSavedForm(form, version) {
    return {
        id: form.id || version.formId || "",
        name: form.name || "Consultation Form",
        type: form.type || "CONSULTATION",
        category: undefined,
        version: version.majorVersion ?? 1,
        description: form.description || "",
        blocks: version.blocks ?? [],
        theme: version.theme ?? undefined,
        createdAt: form.createdAt || version.createdAt || "",
        updatedAt: form.updatedAt || version.createdAt || ""
    };
}
function mapStandaloneFormToSavedForm(form) {
    if (!form.activeVersion) return null;
    return mapStandaloneVersionToSavedForm(form, form.activeVersion);
}
function mapStandaloneAnswerToSavedForm(answer, fallbackForm) {
    const form = answer.form || fallbackForm || (answer.formVersion ? {
        id: answer.formVersion.formId || "",
        name: "Consultation Form",
        type: "CONSULTATION",
        description: "",
        createdAt: answer.createdAt,
        updatedAt: answer.updatedAt
    } : null);
    const version = answer.formVersion || form && "activeVersion" in form ? form.activeVersion : null;
    const targetVersion = version || answer.formVersion;
    if (!form || !targetVersion) return null;
    return mapStandaloneVersionToSavedForm(form, targetVersion);
}
function parseStandaloneAnswers(raw) {
    if (!raw) return {};
    let current = raw;
    if (typeof current === "string") {
        try {
            current = JSON.parse(current);
        } catch  {
            return {};
        }
    }
    if (typeof current === "string") {
        try {
            current = JSON.parse(current);
        } catch  {
        // ignore
        }
    }
    if (typeof current === "object" && current !== null && !Array.isArray(current)) {
        return current;
    }
    return {};
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/dashboard/consultation-preview-sheet.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ConsultationPreviewSheet",
    ()=>ConsultationPreviewSheet
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@apollo/client/react/hooks/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/scroll-area.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$consultation$2d$form$2d$renderer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/formbuilder/consultation-form-renderer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/skeleton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$standalone$2d$forms$2f$visit$2d$answers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/standalone-forms/visit-answers.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$visits$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/queries/visits.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$standalone$2d$form$2d$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/standalone-form-mapper.ts [app-client] (ecmascript)");
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
function ConsultationPreviewSheet({ open, onOpenChange, answerId, departmentName, patientName, visitDepartment, visitId, visitDepartmentId }) {
    _s();
    const [previewReadyLogged, setPreviewReadyLogged] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isRendered, setIsRendered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(open);
    const { answer, loading, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$standalone$2d$forms$2f$visit$2d$answers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStandaloneAnswer"])(answerId, {
        skip: !open || !answerId
    });
    // The answer form's product / diagnosis / medication blocks are rendered from
    // live visit-department data through the consultation extension, never from
    // the stored answer payload (those keys are stripped on save). So the visit
    // has to be in scope here, otherwise the blocks come up empty.
    const needsVisitFetch = open && Boolean(visitId) && !visitDepartment && Boolean(visitDepartmentId);
    const { data: visitData, loading: visitLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$queries$2f$visits$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GET_VISIT_QUERY"], {
        variables: {
            id: visitId
        },
        skip: !needsVisitFetch
    });
    const visitDepartments = visitData?.data?.departments || [];
    const resolvedVisitDepartment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ConsultationPreviewSheet.useMemo[resolvedVisitDepartment]": ()=>{
            if (visitDepartment) return visitDepartment;
            const targetId = String(visitDepartmentId || "");
            if (!targetId) return null;
            return visitDepartments.find({
                "ConsultationPreviewSheet.useMemo[resolvedVisitDepartment]": (dept)=>String(dept.id) === targetId
            }["ConsultationPreviewSheet.useMemo[resolvedVisitDepartment]"]) || null;
        }
    }["ConsultationPreviewSheet.useMemo[resolvedVisitDepartment]"], [
        visitDepartment,
        visitDepartmentId,
        visitDepartments
    ]);
    const previewForm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ConsultationPreviewSheet.useMemo[previewForm]": ()=>answer ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$standalone$2d$form$2d$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapStandaloneAnswerToSavedForm"])(answer) : null
    }["ConsultationPreviewSheet.useMemo[previewForm]"], [
        answer
    ]);
    const previewAnswers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ConsultationPreviewSheet.useMemo[previewAnswers]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$standalone$2d$form$2d$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseStandaloneAnswers"])(answer?.answers)
    }["ConsultationPreviewSheet.useMemo[previewAnswers]"], [
        answer?.answers
    ]);
    const answerStatus = answer?.status || null;
    const clinicalLoading = needsVisitFetch && visitLoading && !visitData;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ConsultationPreviewSheet.useEffect": ()=>{
            if (open) {
                setIsRendered(true);
                return;
            }
            const timeout = window.setTimeout({
                "ConsultationPreviewSheet.useEffect.timeout": ()=>{
                    setIsRendered(false);
                }
            }["ConsultationPreviewSheet.useEffect.timeout"], 220);
            return ({
                "ConsultationPreviewSheet.useEffect": ()=>window.clearTimeout(timeout)
            })["ConsultationPreviewSheet.useEffect"];
        }
    }["ConsultationPreviewSheet.useEffect"], [
        open
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ConsultationPreviewSheet.useEffect": ()=>{
            if (!open) {
                setPreviewReadyLogged(false);
                return;
            }
            if (!previewForm || loading || previewReadyLogged) return;
            setPreviewReadyLogged(true);
        }
    }["ConsultationPreviewSheet.useEffect"], [
        answer?.answers,
        answerId,
        loading,
        open,
        previewForm,
        previewReadyLogged
    ]);
    if (!isRendered || typeof document === "undefined") {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-[88] pointer-events-none",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `absolute top-0 bottom-0 left-0 md:left-[420px] right-0 bg-transparent transition-opacity duration-200 pointer-events-auto ${open ? "opacity-100" : "opacity-0"}`,
                onClick: ()=>onOpenChange(false),
                "aria-hidden": "true"
            }, void 0, false, {
                fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                lineNumber: 111,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                role: "dialog",
                "aria-modal": "true",
                "aria-label": "Consultation Preview",
                className: `absolute right-0 top-0 h-full w-[min(92vw,56rem)] border-l border-border bg-background shadow-2xl transition-transform duration-200 ease-out pointer-events-auto ${open ? "translate-x-0" : "translate-x-full"}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex h-full flex-col",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "border-b border-border/70 px-4 py-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start justify-between gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2 flex-wrap",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                        className: "text-lg font-semibold text-foreground",
                                                        children: "Consultation Preview"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                                        lineNumber: 128,
                                                        columnNumber: 19
                                                    }, this),
                                                    answerStatus && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase ${answerStatus === "FINAL" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`,
                                                        children: answerStatus.toLowerCase()
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                                        lineNumber: 132,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                                lineNumber: 127,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-muted-foreground",
                                                children: [
                                                    patientName ? `${patientName} • ` : "",
                                                    departmentName || "Department"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                                lineNumber: 139,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                        lineNumber: 126,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>onOpenChange(false),
                                        className: "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground",
                                        "aria-label": "Close preview",
                                        children: "×"
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                        lineNumber: 144,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                lineNumber: 125,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                            lineNumber: 124,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollArea"], {
                            className: "h-[calc(100vh-88px)] px-4 py-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: [
                                    loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mx-auto w-full max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4 animate-pulse",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                className: "h-7 w-56 rounded-lg"
                                            }, void 0, false, {
                                                fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                                lineNumber: 159,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                className: "h-4 w-80 max-w-full rounded-md"
                                            }, void 0, false, {
                                                fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                                lineNumber: 160,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-3 pt-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                        className: "h-5 w-36 rounded-md"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                                        lineNumber: 162,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                        className: "h-12 w-full rounded-lg"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                                        lineNumber: 163,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                                lineNumber: 161,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-3 pt-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                        className: "h-5 w-44 rounded-md"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                                        lineNumber: 166,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                        className: "h-24 w-full rounded-lg"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                                        lineNumber: 167,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                                lineNumber: 165,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-2 gap-3 pt-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                        className: "h-10 w-full rounded-lg"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                                        lineNumber: 170,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                        className: "h-10 w-full rounded-lg"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                                        lineNumber: 171,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                                lineNumber: 169,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                        lineNumber: 158,
                                        columnNumber: 17
                                    }, this),
                                    !loading && !answerId && resolvedVisitDepartment && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mx-auto w-full max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-base font-semibold text-foreground",
                                                        children: "Department summary"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                                        lineNumber: 179,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-muted-foreground",
                                                        children: "No saved form answer exists yet for this department, so this preview shows recorded department data."
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                                        lineNumber: 182,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                                lineNumber: 178,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2",
                                                                children: "Diagnoses"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                                                lineNumber: 190,
                                                                columnNumber: 23
                                                            }, this),
                                                            resolvedVisitDepartment.diagnostics?.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                                className: "space-y-1 text-sm text-foreground list-disc pl-5",
                                                                children: resolvedVisitDepartment.diagnostics.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                        children: item.diagnosisName
                                                                    }, item.id, false, {
                                                                        fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                                                        lineNumber: 196,
                                                                        columnNumber: 29
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                                                lineNumber: 194,
                                                                columnNumber: 25
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-muted-foreground",
                                                                children: "No diagnoses recorded."
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                                                lineNumber: 200,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                                        lineNumber: 189,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2",
                                                                children: "Medications"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                                                lineNumber: 207,
                                                                columnNumber: 23
                                                            }, this),
                                                            resolvedVisitDepartment.medications?.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                                className: "space-y-1 text-sm text-foreground list-disc pl-5",
                                                                children: resolvedVisitDepartment.medications.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                        children: item.medicationName
                                                                    }, item.id, false, {
                                                                        fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                                                        lineNumber: 213,
                                                                        columnNumber: 29
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                                                lineNumber: 211,
                                                                columnNumber: 25
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-muted-foreground",
                                                                children: "No medications recorded."
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                                                lineNumber: 217,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                                        lineNumber: 206,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2",
                                                                children: "Products"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                                                lineNumber: 224,
                                                                columnNumber: 23
                                                            }, this),
                                                            resolvedVisitDepartment.products?.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                                className: "space-y-1 text-sm text-foreground list-disc pl-5",
                                                                children: resolvedVisitDepartment.products.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                        className: "flex items-center justify-between py-0.5",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                children: [
                                                                                    item.product?.name || "Product",
                                                                                    item.quantity && item.quantity > 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "text-muted-foreground ml-1 font-medium",
                                                                                        children: [
                                                                                            "× ",
                                                                                            item.quantity
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                                                                        lineNumber: 234,
                                                                                        columnNumber: 35
                                                                                    }, this) : null
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                                                                lineNumber: 231,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            item.billingConfirmationStatus === "PENDING_OPERATOR_CONFIRMATION" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-[11px] bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 px-1.5 py-0.5 rounded-full font-medium ml-2",
                                                                                children: "Pending Doctor Confirmation"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                                                                lineNumber: 241,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, item.id, true, {
                                                                        fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                                                        lineNumber: 230,
                                                                        columnNumber: 29
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                                                lineNumber: 228,
                                                                columnNumber: 25
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-muted-foreground",
                                                                children: "No products recorded."
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                                                lineNumber: 249,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                                        lineNumber: 223,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                                lineNumber: 188,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                        lineNumber: 177,
                                        columnNumber: 17
                                    }, this),
                                    !loading && !answerId && !resolvedVisitDepartment && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-muted-foreground",
                                        children: "No saved consultation answer is available for this department."
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                        lineNumber: 259,
                                        columnNumber: 17
                                    }, this),
                                    !loading && answerId && error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-destructive",
                                        children: [
                                            "Failed to load consultation answers: ",
                                            error
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                        lineNumber: 265,
                                        columnNumber: 17
                                    }, this),
                                    !loading && answerId && !error && !previewForm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-muted-foreground",
                                        children: "The saved consultation answer was found, but the form could not be loaded."
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                        lineNumber: 271,
                                        columnNumber: 17
                                    }, this),
                                    !loading && !clinicalLoading && previewForm && !error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mx-auto w-full max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-sm",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$formbuilder$2f$consultation$2d$form$2d$renderer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ConsultationFormRenderer"], {
                                            form: previewForm,
                                            showTitle: true,
                                            edit: false,
                                            validate: false,
                                            hideSubmit: true,
                                            initialAnswers: previewAnswers,
                                            className: "mx-auto",
                                            visitId: String(visitId || ""),
                                            visitDepartmentId: String(resolvedVisitDepartment?.id || visitDepartmentId || ""),
                                            departmentId: String(resolvedVisitDepartment?.department?.id || ""),
                                            visitDepartments: resolvedVisitDepartment ? [
                                                resolvedVisitDepartment
                                            ] : visitDepartments,
                                            visitStatus: visitData?.data?.status,
                                            visitDepartmentStatus: resolvedVisitDepartment?.status
                                        }, `${answerId || "none"}:${resolvedVisitDepartment?.id || visitDepartmentId || ""}`, false, {
                                            fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                            lineNumber: 279,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                        lineNumber: 278,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                                lineNumber: 156,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                            lineNumber: 155,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                    lineNumber: 123,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
                lineNumber: 117,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/dashboard/consultation-preview-sheet.tsx",
        lineNumber: 110,
        columnNumber: 5
    }, this), document.body);
}
_s(ConsultationPreviewSheet, "ic/kT6E69DgtIl17XKuy7llXzdE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$standalone$2d$forms$2f$visit$2d$answers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStandaloneAnswer"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$apollo$2f$client$2f$react$2f$hooks$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
_c = ConsultationPreviewSheet;
var _c;
__turbopack_context__.k.register(_c, "ConsultationPreviewSheet");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/dashboard/consultation-preview-sheet.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/components/dashboard/consultation-preview-sheet.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=_87b8a60c._.js.map