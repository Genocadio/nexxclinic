"use client"

import { useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, ChevronRight } from "lucide-react"
import type { Visit } from "@/hooks/types"
import type { BillingData } from "@/lib/billing-utils"
import type { Bill } from "@/hooks/types"

interface BillingPreviewSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  visit?: Visit | null
  billingData?: BillingData | null
  existingBill?: Bill | null
  visitBillingRaw?: any | null
  selectedDepartmentId?: string | null
  onDepartmentSelect?: (departmentId: string) => void
  previewStartedAt?: number | null
}

export function BillingPreviewSheet({
  open,
  onOpenChange,
  visit,
  billingData,
  existingBill,
  visitBillingRaw,
  selectedDepartmentId,
  onDepartmentSelect,
  previewStartedAt,
}: BillingPreviewSheetProps) {
  const [isRendered, setIsRendered] = useState(open)
  const [selectedDepartmentIdState, setSelectedDepartmentIdState] = useState<string | null>(selectedDepartmentId ?? null)

  useEffect(() => {
    if (open) {
      setIsRendered(true)
      return
    }

    const timeout = window.setTimeout(() => {
      setIsRendered(false)
    }, 220)

    return () => window.clearTimeout(timeout)
  }, [open])

  useEffect(() => {
    if (!open) {
      setSelectedDepartmentIdState(selectedDepartmentId ?? null)
      return
    }
  }, [open, selectedDepartmentId])

  const topLevelDepartments = useMemo(
    () => visit?.departments?.filter((dept) => dept.status !== 'CANCELLED') || [],
    [visit?.departments],
  )

  useEffect(() => {
    if (!open || !topLevelDepartments.length) return
    if (selectedDepartmentIdState) return

    setSelectedDepartmentIdState(topLevelDepartments[0].id)
    onDepartmentSelect?.(topLevelDepartments[0].id)
  }, [open, topLevelDepartments, selectedDepartmentIdState, onDepartmentSelect])

  const activeDepartmentId = selectedDepartmentId ?? selectedDepartmentIdState
  const activeDepartment = useMemo(
    () => topLevelDepartments.find((dept) => dept.id === activeDepartmentId) || topLevelDepartments[0] || null,
    [topLevelDepartments, activeDepartmentId],
  )

  const invoiceGroups = useMemo(() => {
    if (!activeDepartment) return []

    const collectDeptIds = (dept: any) => {
      const ids: string[] = []
      const stack = [dept]
      while (stack.length) {
        const cur = stack.shift()
        if (!cur) continue
        ids.push(String(cur.id))
        if (cur.childVisitDepartments && Array.isArray(cur.childVisitDepartments)) {
          stack.push(...cur.childVisitDepartments)
        }
      }
      return ids
    }

    const deptIds = collectDeptIds(activeDepartment)

    if (billingData) {
      const items = billingData.items.filter((item) => {
        const itemRootId = String(item.rootVisitDepartmentId || item.visitDepartmentId || '')
        return deptIds.includes(itemRootId)
      }).map((it) => ({
        id: it.id,
        name: it.name,
        quantity: it.quantity,
        price: it.price,
        departmentName: activeDepartment.department?.name || '' as string,
        groupLabel: 'Invoice'
      }))
      return items.length > 0 ? [{
        groupLabel: 'Invoice',
        status: '',
        totalAmount: billingData.totalAmount || 0,
        insuranceCoveredAmount: billingData.insuranceCoveredAmount || 0,
        patientPayableAmount: billingData.patientPayableAmount || 0,
        paidAmount: billingData.paidAmount || 0,
        outstandingAmount: billingData.outstandingAmount || 0,
        items,
      }] : []
    }

    if (!visitBillingRaw) return []

    let depts = (visitBillingRaw.departments || []).filter((d: any) => deptIds.includes(String(d.id)))
    if (!depts.length) {
      depts = visitBillingRaw.departments || []
    }

    const groups: any[] = []
    for (const d of depts) {
      const insuranceBillings = d.insuranceBillings || []
      for (const ib of insuranceBillings) {
        groups.push({
          id: ib.id,
          status: ib.status,
          label: ib.status ? `${ib.status}` : 'Invoice',
          insuranceLabel: ib.patientInsurance?.insuranceProvider?.insuranceName || ib.patientInsurance?.insuranceProvider?.name || 'Private',
          totalAmount: Number(ib.totalAmount || 0),
          insuranceCoveredAmount: Number(ib.insuranceCoveredAmount || 0),
          patientPayableAmount: Number(ib.patientPayableAmount || 0),
          paidAmount: Number(ib.paidAmount || 0),
          outstandingAmount: Number(ib.outstandingAmount || 0),
          items: (ib.items || []).map((it: any, idx: number) => ({
            id: it.id || `item-${d.id}-${idx}`,
            name: it.productName || it.product?.name || 'Item',
            quantity: it.quantitySnapshot || it.quantity || 1,
            price: it.unitPriceSnapshot || it.unitPrice || 0,
            departmentName: d.department?.name || activeDepartment?.department?.name || 'Department'
          })),
        })
      }
    }
    return groups
  }, [billingData, activeDepartment, visitBillingRaw])

  const departmentSubtotal = invoiceGroups.reduce((sum, group) => sum + group.items.reduce((inner, item) => inner + item.price * item.quantity, 0), 0)
  const departmentTotal = invoiceGroups.reduce((sum, group) => sum + group.totalAmount, 0)
  const departmentPaid = invoiceGroups.reduce((sum, group) => sum + group.paidAmount, 0)
  const departmentOutstanding = invoiceGroups.reduce((sum, group) => sum + group.outstandingAmount, 0)
  const showOverallDepartmentTotals = invoiceGroups.length > 1
  const showExistingBillSummary = Boolean(existingBill && invoiceGroups.length === 0)
  const allItemsCount = invoiceGroups.reduce((sum, group) => sum + group.items.length, 0)

  const patientName = visit ? `${visit.patient?.firstName || ''} ${visit.patient?.lastName || ''}`.trim() : 'Patient'

  const canShowList = topLevelDepartments.length > 1
  const invoiceDate = existingBill?.updatedAt || billingData?.updatedAt || visit?.visitDate || new Date().toISOString()

  if (!isRendered || typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed inset-0 z-[88]">
      <div
        className={`absolute inset-0 bg-slate-950/40 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Billing Invoice Preview"
        className={`absolute right-0 top-16 h-[calc(100vh-4rem)] w-[min(92vw,72rem)] border-l border-border bg-background dark:bg-slate-900 shadow-2xl transition-transform duration-200 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-border/70 px-4 py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Invoice</h2>
                    <span className="text-sm text-muted-foreground">{activeDepartment?.department?.name || 'Department'}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {patientName} • {new Date(invoiceDate).toLocaleDateString()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Close preview"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            <style>{`@media print { .invoice-container { background: #fff !important; color: #000 !important; -webkit-print-color-adjust: exact; } .no-print { display: none !important; } .invoice-container { box-shadow: none !important; border: none !important; } }`}</style>

            <div className="invoice-container w-full">
              {canShowList && (
                <div className="w-72 min-w-[18rem] border-r border-border/70 bg-slate-50/80 dark:bg-slate-800/60">
                  <div className="border-b border-border/70 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Departments</p>
                  </div>
                  <ScrollArea className="h-full px-2 py-2">
                    <div className="space-y-2">
                      {topLevelDepartments.map((department) => {
                        const isActive = department.id === activeDepartment?.id
                        return (
                          <button
                            key={department.id}
                            type="button"
                            onClick={() => {
                              setSelectedDepartmentIdState(department.id)
                              onDepartmentSelect?.(department.id)
                            }}
                            className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left transition ${isActive ? 'border-[#FF6900] bg-[#fff7ed]' : 'border-transparent bg-white hover:border-border hover:bg-slate-50'}`}
                          >
                            <div>
                              <p className="font-medium text-foreground">{department.department?.name || 'Department'}</p>
                              <p className="text-xs text-muted-foreground">{department.status || 'Status unknown'}</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </button>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </div>
              )}

              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full px-4 py-4">
                  <div className="space-y-6 pr-4">
                    <div className="flex items-center justify-end gap-2 no-print">
                      <button type="button" onClick={() => window.print()} className="px-3 py-1 rounded-md bg-muted text-foreground">Print</button>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="py-1 border-b border-border"><strong>Patient:</strong> {patientName || 'N/A'}</div>
                      <div className="py-1 border-b border-border"><strong>Department:</strong> {activeDepartment?.department?.name || 'General'}</div>
                      <div className="py-1 border-b border-border"><strong>Insurance:</strong> {invoiceGroups.length === 1 ? invoiceGroups[0].insuranceLabel : 'Multiple'}</div>
                      <div className="py-1 border-b border-border"><strong>Invoice Date:</strong> {new Date(invoiceDate).toLocaleDateString()}</div>
                    </div>

                    <div className="border-b border-border pb-2">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-semibold text-foreground">Invoice items</h3>
                          <p className="text-xs text-muted-foreground">{allItemsCount} item{allItemsCount !== 1 ? 's' : ''}</p>
                        </div>
                      </div>

                      {invoiceGroups.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No billable items found for this department.</p>
                      ) : (
                        <div className="space-y-6">
                          {invoiceGroups.map((group, groupIndex) => (
                            <div key={group.id || groupIndex} className="border border-border">
                              <div className="border-b border-border bg-slate-50 px-3 py-2 text-sm font-semibold text-foreground dark:bg-slate-800">
                                {invoiceGroups.length > 1 ? `Invoice option ${groupIndex + 1}` : 'Invoice'}
                                {group.status ? ` • ${group.status}` : ''}
                                {group.insuranceLabel ? ` • ${group.insuranceLabel}` : ''}
                              </div>
                              <table className="w-full border-collapse text-sm">
                                <thead className="bg-transparent">
                                  <tr>
                                    <th className="border-b border-border px-3 py-2 text-left font-semibold text-xs uppercase tracking-[0.2em] text-muted-foreground">Description</th>
                                    <th className="border-b border-border px-3 py-2 text-right font-semibold text-xs uppercase tracking-[0.2em] text-muted-foreground">Qty</th>
                                    <th className="border-b border-border px-3 py-2 text-right font-semibold text-xs uppercase tracking-[0.2em] text-muted-foreground">Unit</th>
                                    <th className="border-b border-border px-3 py-2 text-right font-semibold text-xs uppercase tracking-[0.2em] text-muted-foreground">Amount</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {group.items.map((item: any) => (
                                    <tr key={item.id} className="even:bg-slate-50 dark:even:bg-slate-900/50">
                                      <td className="border-b border-border px-3 py-2 text-sm text-foreground">{item.name}</td>
                                      <td className="border-b border-border px-3 py-2 text-right text-sm text-foreground">{item.quantity}</td>
                                      <td className="border-b border-border px-3 py-2 text-right text-sm text-foreground">{item.price.toLocaleString()} RWF</td>
                                      <td className="border-b border-border px-3 py-2 text-right text-sm font-semibold text-foreground">{(item.price * item.quantity).toLocaleString()} RWF</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              <div className="grid gap-2 sm:grid-cols-2 p-3">
                                <div className="py-1"><strong>Total billed:</strong> {group.totalAmount.toLocaleString()} RWF</div>
                                <div className="py-1"><strong>Paid:</strong> {group.paidAmount.toLocaleString()} RWF</div>
                                <div className="py-1"><strong>Outstanding:</strong> {group.outstandingAmount.toLocaleString()} RWF</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {showOverallDepartmentTotals && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        <p className="font-semibold text-foreground">Department overall summary</p>
                        <div className="mt-1">
                          <div className="py-1 border-b border-border"><strong>Total billed:</strong> <span className="float-right">{departmentTotal.toLocaleString()} RWF</span></div>
                          <div className="py-1 border-b border-border"><strong>Paid:</strong> <span className="float-right">{departmentPaid.toLocaleString()} RWF</span></div>
                          <div className="py-1 border-b border-border"><strong>Outstanding:</strong> <span className="float-right">{departmentOutstanding.toLocaleString()} RWF</span></div>
                        </div>
                      </div>
                    )}

{showExistingBillSummary && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      <div className="py-1 border-b border-border"><strong>Total billed:</strong> <span className="float-right">{existingBill!.totalAmount.toLocaleString()} RWF</span></div>
                      <div className="py-1 border-b border-border"><strong>Paid:</strong> <span className="float-right">{existingBill!.paidAmount.toLocaleString()} RWF</span></div>
                      <div className="py-1 border-b border-border"><strong>Outstanding:</strong> <span className="float-right">{existingBill!.outstandingAmount.toLocaleString()} RWF</span></div>
                      </div>
                    )}

                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>,
    document.body,
  )
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm font-medium text-foreground">{value || 'N/A'}</p>
    </div>
  )
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm font-semibold text-foreground">{value}</p>
    </div>
  )
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  )
}
