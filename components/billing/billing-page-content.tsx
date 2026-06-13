'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { BillingData, BillingItem, buildProductCoverageMaps, getItemInsuranceSplit, applyInsuranceSelectionToItem, resolveBillingUnitPrice } from '@/lib/billing-utils';
import {
  flattenVisitDepartmentsForBilling,
  getCoveragePercentageForBillingItem,
  mapPatientInsurancesForBilling,
  mapVisitToBillingData,
} from '@/lib/visit-billing-mapper';
import {
  visitHasBillableProducts,
  visitHasUnbilledProducts,
  visitProductsFullySettled,
} from '@/lib/visit-product-utils';
import Header from '@/components/header';
import { useAuth } from '@/lib/auth-context';
import { useSearchParams } from 'next/navigation';
import { useVisit, useCreateBill, useGetVisitBilling, useGenerateInvoice, useCompleteVisit } from '@/hooks/auth-hooks';
import type { Visit } from '@/lib/api-types';
import {
  flattenVisitBillingItems,
  getLatestDepartmentInsuranceBillingId,
  getVisitBillingTotals,
  isVisitDepartmentProductBilled,
  visitBillingLineTotal,
} from '@/lib/visit-billing-utils';
import { useUpdateVisitDepartmentStatus } from '@/hooks/auth-hooks';
import { useAddProductToVisitDepartment, useLinkVisitInsurances, useUnlinkVisitInsurances, useUpdateProductQuantity, useVisitDepartmentNotes, useAddVisitDepartmentNote, useMarkVisitDepartmentNotesViewed } from '@/hooks/visits/hooks';
import { Spinner } from '@/components/ui/spinner';
import VisitNotesFloating from '@/components/visit-notes-floating';
import { BillingPatientBar } from '@/components/billing/billing-patient-bar';
import { BillingStickySummary } from '@/components/billing/billing-sticky-summary';
import { BillingConfirmSheet } from '@/components/billing/billing-confirm-sheet';
import { BillingPreviewSheet } from '@/components/billing/billing-preview-sheet';
import { BillingItemsWorkspace } from '@/components/billing/billing-items-workspace';
import { BillingExemptionsPanel } from '@/components/billing/billing-exemptions-panel';
import { AddPatientInsuranceModal } from '@/components/patient/add-patient-insurance-modal';
import { AddVisitDepartmentProductModal } from '@/components/visit/add-visit-department-product-modal';
import { toast } from 'react-toastify';
import { openInvoicePreview, resolveInvoiceUrl } from '@/lib/invoice-utils';

export function BillingPageContent() {
  const searchParams = useSearchParams();
  const visitId = searchParams.get('visitId');
  const autoPrint = searchParams.get('autoprint') === '1';
  const { visit, loading, error, refetch: refetchVisit } = useVisit(visitId);
  const { createBill, loading: creatingBill } = useCreateBill();
  const { generateInvoice, loading: generatingInvoice } = useGenerateInvoice();
  const { visitBilling: existingVisitBilling, loading: loadingBill, refetch: refetchBill } = useGetVisitBilling(visitId);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewDepartmentId, setPreviewDepartmentId] = useState<string | null>(null);
  const [previewStartedAt, setPreviewStartedAt] = useState<number | null>(null);
  const { linkVisitInsurances, loading: linkingVisitInsurances } = useLinkVisitInsurances();
  const { unlinkVisitInsurances, loading: unlinkingVisitInsurances } = useUnlinkVisitInsurances();
  const { updateQuantity: updateProductQuantity } = useUpdateProductQuantity();
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [activeVisitInsuranceIds, setActiveVisitInsuranceIds] = useState<string[]>([]);
  const [billJustCreated, setBillJustCreated] = useState(false);
  const [showCompleteBillConfirm, setShowCompleteBillConfirm] = useState(false);
  const [confirmSheetMode, setConfirmSheetMode] = useState<'complete' | 'edit'>('complete');
  const [didAutoPrint, setDidAutoPrint] = useState(false);
  const [activeService, setActiveService] = useState<string>('');
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [showAddInsuranceModal, setShowAddInsuranceModal] = useState(false);
  const [showDiscountControls, setShowDiscountControls] = useState(false);
  const [isEditingBill, setIsEditingBill] = useState(false);
  const [invoicePdfBase64, setInvoicePdfBase64] = useState<string | null>(null);
  const [discountInputType, setDiscountInputType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [discountInputValue, setDiscountInputValue] = useState(0);
  const addingVisitInsurance = linkingVisitInsurances || unlinkingVisitInsurances;
  const { doctor } = useAuth();
  // Feature toggle to disable Discharge actions in the UI and auto-discharge
  const ENABLE_DISCHARGE = false;
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [addingBillingItem, setAddingBillingItem] = useState(false);
  const [showExemptionsWindow, setShowExemptionsWindow] = useState(false);
  const { addProduct } = useAddProductToVisitDepartment();
  const { updateDepartmentStatus } = useUpdateVisitDepartmentStatus();
  const { addVisitDepartmentNote } = useAddVisitDepartmentNote();
  const { markNotesViewed } = useMarkVisitDepartmentNotesViewed();
  const { completeVisit } = useCompleteVisit();

  const existingBillingTotals = useMemo(
    () => (existingVisitBilling ? getVisitBillingTotals(existingVisitBilling) : null),
    [existingVisitBilling],
  );

  // Determine if user can edit billing items based on role
  // Only FINANCE role can edit items. CASHIER users cannot delete or adjust quantities
  const canEditBillingItems = useMemo(() => {
    if (!doctor?.roles) return true; // Default to true if no roles defined
    const roles = (doctor.roles as string[]) || [];
    const hasFinanceRole = roles.includes('FINANCE');
    
    // Only FINANCE role can edit items, CASHIER cannot
    return hasFinanceRole;
  }, [doctor?.roles]);

  const mapPaymentStatus = (status?: string, itemId?: string): BillingItem['paymentStatus'] => {
    if (status === 'BILLED') return 'paid';
    if (existingVisitBilling && itemId && isVisitDepartmentProductBilled(existingVisitBilling, itemId)) {
      return 'paid';
    }
    if (status === 'EXEMPTED') return 'exempted';
    return 'pending';
  };

  useEffect(() => {
    if (!visit?.id) return;
    const newIds = (visit.linkedInsurances || []).map((insurance) => String(insurance.id));
    if (
      newIds.length !== activeVisitInsuranceIds.length ||
      newIds.some((id, index) => id !== activeVisitInsuranceIds[index])
    ) {
      setActiveVisitInsuranceIds(newIds);
    }
  }, [visit?.id, visit?.linkedInsurances, activeVisitInsuranceIds]);

  const activeVisitInsurances = useMemo(() => {
    const activeIds = new Set(activeVisitInsuranceIds);
    return (visit?.linkedInsurances || []).filter((insurance) => activeIds.has(String(insurance.id)));
  }, [visit?.linkedInsurances, activeVisitInsuranceIds]);

  useEffect(() => {
    if (!visit) return;
    const mapped = mapVisitToBillingData(visit, { existingVisitBilling });
    const shouldUpdateBillingData =
      !billingData ||
      billingData.visitId !== mapped.visitId ||
      billingData.amountPaid !== mapped.amountPaid ||
      billingData.items.length !== mapped.items.length ||
      billingData.items.some((item, index) => item.id !== mapped.items[index]?.id || item.paymentStatus !== mapped.items[index]?.paymentStatus);

    if (shouldUpdateBillingData) {
      setBillingData(mapped);
      const unbilledItems = mapped.items.filter(item => item.paymentStatus !== 'paid');
      const newSelectedIds = unbilledItems.map(item => item.id);
      if (
        newSelectedIds.length !== selectedItemIds.length ||
        newSelectedIds.some((id, index) => id !== selectedItemIds[index])
      ) {
        setSelectedItemIds(newSelectedIds);
      }
    }
  }, [
    visit?.id,
    existingVisitBilling?.id,
    existingBillingTotals?.paidAmount,
    existingBillingTotals?.totalAmount,
    existingBillingTotals?.outstandingAmount,
  ]);

  useEffect(() => {
    if (billingData?.items?.length) {
      const firstDept = billingData.items[0].departmentName || 'General';
      setActiveService((prev) => prev || firstDept);
    }
  }, [billingData]);

  // When view mode changes to service or active service changes, update selection
  useEffect(() => {
    if (!activeService || !billingData) return;
    const serviceItems = billingData.items.filter(
      item => (item.departmentName || 'General') === activeService && item.paymentStatus !== 'paid'
    );
    const newSelectedIds = serviceItems.map(item => item.id);
    if (
      newSelectedIds.length !== selectedItemIds.length ||
      newSelectedIds.some((id, index) => id !== selectedItemIds[index])
    ) {
      setSelectedItemIds(newSelectedIds);
    }
  }, [activeService, billingData?.items.length, selectedItemIds]);

  // Calculate totals for a given items subset (selected, unbilled lines only)
  const calculateTotalsForItems = useCallback((items: BillingItem[]) => {
    let subtotal = 0;
    let insuranceCoverage = 0;
    let patientResponsibility = 0;

    items.forEach((item) => {
      const coveragePct = getCoveragePercentageForBillingItem(item, activeVisitInsurances);
      const { itemTotal, insuranceAmount, patientAmount, skip } = getItemInsuranceSplit(item, coveragePct);

      if (skip) return;
      subtotal += itemTotal;
      insuranceCoverage += insuranceAmount;
      patientResponsibility += patientAmount;
    });

    const discount = (patientResponsibility * (billingData?.discountPercentage || 0)) / 100;
    const totalAmount = patientResponsibility - discount;

    return { subtotal, insuranceCoverage, patientResponsibility, discount, totalAmount };
  }, [activeVisitInsurances, billingData?.discountPercentage]);

  const emptyTotals = { subtotal: 0, insuranceCoverage: 0, patientResponsibility: 0, discount: 0, totalAmount: 0 };

  const visitInsuranceOptions = useMemo(
    () => mapPatientInsurancesForBilling(activeVisitInsurances),
    [activeVisitInsurances],
  );

  const patientInsurances = useMemo(() => visit?.patient.patientInsurances || [], [visit?.patient.patientInsurances]);
  const visitInsuranceIds = useMemo(() => new Set(activeVisitInsuranceIds), [activeVisitInsuranceIds]);

  const handleItemChange = (updatedItem: BillingItem) => {
    setBillingData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.map((item) =>
          item.id === updatedItem.id ? updatedItem : item
        ),
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const handleQuantityChange = async (item: BillingItem, nextQty: number) => {
    if (nextQty < 1) return;

    try {
      const response = await updateProductQuantity(item.id, nextQty);
      if (response.status !== 'SUCCESS') {
        toast.error(response.message || 'Failed to update quantity');
        return;
      }
      handleItemChange({ ...item, quantity: nextQty });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update quantity';
      toast.error(message);
    }
  };

  const handleItemRemove = (itemId: string) => {
    setBillingData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.filter((item) => item.id !== itemId),
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const handleDiscountChange = (discount: number) => {
    setBillingData((prev) => prev ? ({
      ...prev,
      discountPercentage: discount,
      updatedAt: new Date().toISOString(),
    }) : prev);
  };

  const handleExemptionChange = (itemId: string, reason: string) => {
    setBillingData((prev) => prev ? ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId ? { ...item, exemptionReason: reason } : item
      ),
      updatedAt: new Date().toISOString(),
    }) : prev);
  };

  const handlePaymentMethodChange = (
    method: 'CASH' | 'MOBILE_MONEY' | 'CARD' | 'BANK_TRANSFER' | 'CHEQUE' | 'MIXED'
  ) => {
    setBillingData((prev) => prev ? ({
      ...prev,
      paymentMethod: method,
      updatedAt: new Date().toISOString(),
    }) : prev);
  };

  const handleAmountPaidChange = (amount: number) => {
    setBillingData((prev) => prev ? ({
      ...prev,
      amountPaid: amount,
      updatedAt: new Date().toISOString(),
    }) : prev);
  };

  const handleNotesChange = (notes: string) => {
    setBillingData((prev) => prev ? ({
      ...prev,
      notes,
      updatedAt: new Date().toISOString(),
    }) : prev);
  };

  const handleSelectionToggle = (itemId: string, checked: boolean) => {
    setSelectedItemIds((prev) => {
      const set = new Set(prev);
      if (checked) set.add(itemId); else set.delete(itemId);
      return Array.from(set);
    });
  };

  const handleSelectAll = (itemIds: string[], checked: boolean) => {
    setSelectedItemIds((prev) => {
      const set = new Set(prev);
      itemIds.forEach(id => {
        if (checked) set.add(id); else set.delete(id);
      });
      return Array.from(set);
    });
  };

  const itemsByService = (serviceName: string) => {
    if (!billingData) return [] as BillingItem[];
    return billingData.items.filter((item) => (item.departmentName || 'General') === serviceName);
  };

  const itemsToDisplay = useMemo((): BillingItem[] => {
    if (!billingData || !activeService) return [];
    return billingData.items.filter((item) => (item.departmentName || 'General') === activeService);
  }, [billingData, activeService]);

  const selectedItems = billingData ? billingData.items.filter((it) => selectedItemIds.includes(it.id)) : [];
  const hasRemainingToBill = Boolean(billingData?.items.some((item) => item.paymentStatus !== 'paid'));
  const canEditBilling = Boolean(existingVisitBilling) || billJustCreated;
  const showBillingDock = canEditBilling || (!existingVisitBilling && hasRemainingToBill);

  const refreshInvoicePdf = async (departmentInsuranceBillingId?: string, options?: { openPreview?: boolean }) => {
    const targetDepartmentInsuranceBillingId =
      departmentInsuranceBillingId || getLatestDepartmentInsuranceBillingId(existingVisitBilling);
    if (!targetDepartmentInsuranceBillingId) return null;

    const invoiceUrl = await resolveInvoiceUrl(targetDepartmentInsuranceBillingId, generateInvoice);
    setInvoicePdfBase64(invoiceUrl);

    if (options?.openPreview) {
      openInvoicePreview(invoiceUrl);
    }

    return invoiceUrl;
  };
  
  // Sticky summary reflects only selected, unbilled items in the current view
  const displayTotals = useMemo(() => {
    if (!billingData) return emptyTotals;

    const itemsForTotals = itemsToDisplay.filter(
      (item) => selectedItemIds.includes(item.id) && item.paymentStatus !== 'paid',
    );

    return calculateTotalsForItems(itemsForTotals);
  }, [billingData, itemsToDisplay, selectedItemIds, calculateTotalsForItems]);

  useEffect(() => {
    if (!billingData) return
    setDiscountInputType('PERCENTAGE')
    setDiscountInputValue(Number(billingData.discountPercentage || 0))
    setShowDiscountControls(Boolean((billingData.discountPercentage || 0) > 0))
  }, [billingData?.discountPercentage])

  // Get all service names from visit departments (not just those with items)
  const allServiceNames = useMemo(() => visit?.departments
    ?.filter(dept => dept.status !== 'CANCELLED')
    .map(dept => dept.department?.name || 'General') || [], [visit?.departments]);

  const topLevelBillingDepartments = useMemo(
    () => visit?.departments?.filter((dept) => dept.status !== 'CANCELLED') || [],
    [visit?.departments],
  );
  
  // Calculate exemption count
  const exemptionCount = billingData
    ? billingData.items.filter(item => (item.exemptionType || (item.exempted ? 'full' : 'none')) !== 'none').length
    : 0;

  const unbilledServiceNames = useMemo(
    () => billingData
      ? Array.from(
          new Set(
            billingData.items
              .filter((item) => item.paymentStatus !== 'paid')
              .map((item) => item.departmentName || 'General')
          )
        )
      : [],
    [billingData?.items]
  );

  const firstBillingDepartment = topLevelBillingDepartments[0]
  const firstBillingDepartmentId = firstBillingDepartment?.id
  const { notes: billingDepartmentNotes, loading: notesLoading, refetch: refetchNotes } = useVisitDepartmentNotes(
    visitId,
    firstBillingDepartmentId || null
  )

  const hasUnbilledItems = (visitData: Visit | undefined) => {
    if (!visitData) return false;
    if (visitProductsFullySettled(visitData)) return false;
    return visitHasUnbilledProducts(visitData);
  };

  const hasNoBillables = (visitData: Visit | undefined) => {
    if (!visitData) return true;
    return !visitHasBillableProducts(visitData);
  };

  const hasIncompleteDepartments = (visitData: Visit | undefined) => {
    if (!visitData) return false;
    return flattenVisitDepartmentsForBilling(visitData.departments || []).some(
      (dept) => dept.status !== 'COMPLETED' && dept.status !== 'CANCELLED',
    );
  };

  const canDischargeVisit = Boolean(
    visit &&
    visit.status !== 'COMPLETED' &&
    visit.status !== 'CANCELLED' &&
    !hasIncompleteDepartments(visit) &&
    (!hasUnbilledItems(visit) || hasNoBillables(visit))
  );

  const handleDischargeVisit = async () => {
    if (!visit) return;

    const confirmed = window.confirm('All billable items are settled. Discharge this patient and complete visit?');
    if (!confirmed) return;

    try {
      const allDepartments = flattenVisitDepartmentsForBilling(visit.departments || []);
      const notCompleted = allDepartments.filter((dept) => dept.status !== 'COMPLETED' && dept.status !== 'CANCELLED');

      if (notCompleted.length > 0) {
        for (const dept of notCompleted) {
          const visitDeptId = String(dept.id || '');
          if (!visitDeptId) continue;

          const res = await updateDepartmentStatus(visitDeptId, 'COMPLETED');
          if (res?.status !== 'SUCCESS') {
            toast.error(res?.messages?.[0]?.text || 'Failed to complete department during discharge');
            return;
          }
        }
      } else {
        // Re-apply completed status to last department to trigger backend visit completion aggregation.
        const fallbackDepartment = allDepartments[allDepartments.length - 1];
        const fallbackId = String(fallbackDepartment?.id || '');
        if (fallbackId) {
          await updateDepartmentStatus(fallbackId, 'COMPLETED');
        }
      }

      await refetchVisit();
      await refetchBill();
      toast.success('Patient discharged successfully');
    } catch (err) {
      console.error('Discharge error:', err);
      toast.error('Failed to discharge patient');
    }
  };

  const handleGenerateBill = async () => {
    if (!billingData || creatingBill) return;

    const unbilledItems = selectedItems.filter((item) => item.paymentStatus !== 'paid');

    if (unbilledItems.length === 0) {
      if (canDischargeVisit && ENABLE_DISCHARGE) {
        await handleDischargeVisit();
        return;
      }
      toast.warning(selectedItems.length === 0 ? 'Select at least one item to bill' : 'All selected items are already billed');
      return;
    }
    
    try {
      const billableByDepartment = new Map<string, {
        visitDepartmentId: string
        products: {
          visitDepartmentProductId: string
          parentVisitDepartmentId: string
          patientInsuranceId?: string
          quantity?: number
          unitPrice?: number
          isExempted?: boolean
        }[]
      }>()

      unbilledItems.forEach((item) => {
        const productOwnerVisitDepartmentId = String(item.visitDepartmentId || '')
        const rootVisitDepartmentId = String(item.rootVisitDepartmentId || productOwnerVisitDepartmentId)
        if (!rootVisitDepartmentId || !productOwnerVisitDepartmentId) return
        if (!billableByDepartment.has(rootVisitDepartmentId)) {
          billableByDepartment.set(rootVisitDepartmentId, {
            visitDepartmentId: rootVisitDepartmentId,
            products: [],
          })
        }
        billableByDepartment.get(rootVisitDepartmentId)!.products.push({
          visitDepartmentProductId: item.id,
          parentVisitDepartmentId: productOwnerVisitDepartmentId,
          patientInsuranceId: item.selectedInsuranceId,
          quantity: item.quantity,
          unitPrice: item.price,
          isExempted: item.exempted || item.exemptionType === 'full' || item.exemptionType === 'patient-share',
        })
      })

      const payments =
        (billingData.amountPaid || 0) > 0
          ? [{
              amount: Number(billingData.amountPaid || 0),
              paymentMethod: billingData.paymentMethod || 'MOBILE_MONEY',
            }]
          : undefined

      const input = {
        visitId: billingData.visitId,
        departments: Array.from(billableByDepartment.values()).map((department) => ({
          visitDepartmentId: department.visitDepartmentId,
          products: department.products,
          payments,
        })),
      };
      
      const response = await createBill(input);
      
      if (response.status === 'SUCCESS') {
        setBillJustCreated(true)
        
        // Check if all items in billingData are now billed
        const allRemainingBilled = unbilledItems.length === billingData.items.filter(item => item.paymentStatus !== 'paid').length;
        
        if (allRemainingBilled) {
          try {
            // First, complete all incomplete departments
            const allDepartments = flattenVisitDepartmentsForBilling(visit?.departments || []);
            const notCompleted = allDepartments.filter((dept) => dept.status !== 'COMPLETED' && dept.status !== 'CANCELLED');
            for (const dept of notCompleted) {
              const visitDeptId = String(dept.id || '');
              if (visitDeptId) {
                const deptResult = await updateDepartmentStatus(visitDeptId, 'COMPLETED');
                if (deptResult?.status !== 'SUCCESS') {
                  console.warn('Failed to complete department:', deptResult?.message);
                }
              }
            }
            
            // Now, complete the visit
            const completeResult = await completeVisit(billingData.visitId);
            if (completeResult?.status !== 'SUCCESS') {
              console.warn('Failed to complete visit:', completeResult?.message);
            }
          } catch (compErr) {
            console.error('Error completing departments/visit:', compErr);
          }
        }

        // Refetch visit and bill data
        await refetchVisit();
        await refetchBill();
        try {
          await refreshInvoicePdf(undefined, { openPreview: true });
        } catch (invoiceErr: unknown) {
          console.error('Invoice generation after billing failed:', invoiceErr);
          const message = invoiceErr instanceof Error ? invoiceErr.message : 'Bill created but invoice PDF could not be generated yet.';
          toast.warning(message);
        }
        toast.success('Bill created successfully!');
      } else {
        const errorMsg = response.messages?.map(m => m.text).join(', ') || 'Failed to create bill';
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error('Error creating bill:', err);
      toast.error('Failed to create bill. Please try again.');
    }
  };

  useEffect(() => {
    if (!billingData) return;
    if (!activeService) {
      setActiveService(unbilledServiceNames[0] || allServiceNames[0] || 'General');
    }
  }, [billingData, activeService, unbilledServiceNames, allServiceNames]);

  useEffect(() => {
    setBillJustCreated(false)
  }, [visitId])

  useEffect(() => {
    if (!autoPrint || didAutoPrint || !existingVisitBilling || !billingData) return
    setDidAutoPrint(true)
    // Small delay ensures print window content is ready after query hydration.
    const timer = setTimeout(() => {
      void handlePrintBillingInvoice()
    }, 150)

    return () => clearTimeout(timer)
  }, [autoPrint, didAutoPrint, existingVisitBilling, billingData])

  const handlePreviewBilling = async () => {
    if (!billingData) return;

    try {
      await refetchBill();
    } catch (err) {
      console.error('Failed to refresh bill before preview:', err);
      toast.warning('Unable to refresh bill data before preview. Showing latest available bill.');
    }

    const availableDepartments = topLevelBillingDepartments;
    const initialDepartment = availableDepartments.length === 1
      ? availableDepartments[0]
      : availableDepartments.find((dept) => dept.id === previewDepartmentId) || availableDepartments[0];

    if (initialDepartment) {
      setPreviewDepartmentId(initialDepartment.id);
    }

    setPreviewStartedAt(Date.now());
    setPreviewOpen(true);
  };

  const handlePrintBillingInvoice = async () => {
    if (!billingData) return

    if (existingVisitBilling) {
      try {
        const pdf = invoicePdfBase64 || await refreshInvoicePdf();
        if (pdf) {
          openInvoicePreview(pdf);
          return;
        }
      } catch (err: unknown) {
        console.error('Backend invoice preview failed, falling back to HTML print:', err);
        const message = err instanceof Error ? err.message : 'Using local print preview because backend invoice is unavailable.';
        toast.warning(message);
      }
    }

    const escapeHtml = (value: string) =>
      value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')

    const billedItems = existingVisitBilling ? flattenVisitBillingItems(existingVisitBilling) : []
    const invoiceItems = billedItems.length > 0
      ? billedItems.map((item) => ({
          description: item.productName,
          quantity: item.quantitySnapshot,
          unitPrice: item.unitPriceSnapshot,
          lineTotal: visitBillingLineTotal(item),
        }))
      : billingData.items.map((item) => ({
          description: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          lineTotal: item.price * item.quantity,
        }))

    const totals = {
      subtotal: existingBillingTotals?.totalAmount ?? displayTotals.subtotal,
      discount: displayTotals.discount,
      totalDue: existingBillingTotals?.totalAmount ?? displayTotals.totalAmount,
      paid: existingBillingTotals?.paidAmount ?? (billingData.amountPaid || 0),
      balance: existingBillingTotals?.outstandingAmount ?? Math.max(0, displayTotals.totalAmount - (billingData.amountPaid || 0)),
    }

    const invoiceHtml = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Invoice ${escapeHtml(existingVisitBilling?.id || billingData.visitId || 'N/A')}</title>
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
          <p class="muted"><strong>Invoice #:</strong> ${escapeHtml(existingVisitBilling?.id || billingData.visitId || 'N/A')}</p>
          <p class="muted"><strong>Date:</strong> ${new Date(existingVisitBilling?.updatedAt || billingData.updatedAt || new Date().toISOString()).toLocaleString()}</p>
        </div>
      </div>

      <div class="section grid">
        <div class="box">
          <p class="muted"><strong>Patient</strong></p>
          <p>${escapeHtml(billingData.patientName || 'N/A')}</p>
          <p class="muted">Patient ID: ${escapeHtml(billingData.patientId || 'N/A')}</p>
        </div>
        <div class="box">
          <p class="muted"><strong>Payment</strong></p>
          <p class="muted">Method: ${escapeHtml((billingData.paymentMethod || 'MOBILE_MONEY').toUpperCase())}</p>
          <p class="muted">Visit Date: ${new Date(billingData.visitDate).toLocaleDateString()}</p>
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
            ${invoiceItems
              .map(
                (item) => `<tr>
                  <td>${escapeHtml(item.description || 'Item')}</td>
                  <td class="right">${item.quantity}</td>
                  <td class="right">${Number(item.unitPrice || 0).toLocaleString()} RWF</td>
                  <td class="right">${Number(item.lineTotal || 0).toLocaleString()} RWF</td>
                </tr>`,
              )
              .join('')}
          </tbody>
        </table>
      </div>

      <table class="totals">
        <tr><td>Subtotal</td><td class="right">${Number(totals.subtotal || 0).toLocaleString()} RWF</td></tr>
        <tr><td>Discount</td><td class="right">-${Number(totals.discount || 0).toLocaleString()} RWF</td></tr>
        <tr class="grand"><td>Total Due</td><td class="right">${Number(totals.totalDue || 0).toLocaleString()} RWF</td></tr>
        <tr><td>Paid</td><td class="right">${Number(totals.paid || 0).toLocaleString()} RWF</td></tr>
        <tr><td>Balance</td><td class="right">${Number(totals.balance || 0).toLocaleString()} RWF</td></tr>
      </table>

      <div class="footer">
        Generated by med Billing Module.
      </div>
    </div>
  </body>
</html>`

    const printWindow = window.open('', '_blank', 'width=900,height=1100')
    if (!printWindow) {
      toast.error('Unable to open print window. Please allow pop-ups and try again.')
      return
    }

    printWindow.document.open()
    printWindow.document.write(invoiceHtml)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  const handleAddInsuranceToVisit = async (insuranceId: string) => {
    if (!visitId) return;

    try {
      const response = await linkVisitInsurances(visitId, [insuranceId]);
      if (response?.status === 'SUCCESS') {
        setActiveVisitInsuranceIds((current) => (current.includes(insuranceId) ? current : [...current, insuranceId]));
        await refetchVisit();
        toast.success('Insurance enabled for this visit');
      } else {
        const errorMsg = response?.messages?.[0]?.text || 'Failed to enable insurance on visit';
        toast.error(errorMsg);
        await refetchVisit();
      }
    } catch (err) {
      console.error('Failed to link insurance to visit:', err);
      toast.error('Failed to enable insurance on visit. Please try again.');
      await refetchVisit();
    }
  };

  const handleRemoveInsuranceFromVisit = async (insuranceId: string) => {
    if (!visitId) return;

    try {
      const response = await unlinkVisitInsurances(visitId, [insuranceId]);
      if (response?.status === 'SUCCESS') {
        setActiveVisitInsuranceIds((current) => current.filter((id) => id !== insuranceId));
        setBillingData((current) => {
          if (!current) return current;
          return {
            ...current,
            items: current.items.map((item) => {
              if (item.selectedInsuranceId !== insuranceId) return item;
              return applyInsuranceSelectionToItem(item, undefined, undefined);
            }),
          };
        });
        await refetchVisit();
        toast.success('Insurance removed from this visit');
      } else {
        const errorMsg = response?.messages?.[0]?.text || 'Failed to remove insurance from visit';
        toast.error(errorMsg);
        await refetchVisit();
      }
    } catch (err) {
      console.error('Failed to unlink insurance from visit:', err);
      toast.error('Failed to remove insurance from visit. Please try again.');
      await refetchVisit();
    }
  };

  const handleAddProduct = async (_type: 'action' | 'consumable', item: { id: string; name: string }, quantity: number, catalogDepartmentId: string) => {
    if (!visit?.id) return;

    try {
      setAddingBillingItem(true);
      const response = await addProduct(visit.id, catalogDepartmentId, item.id, quantity);
      if (response?.status === 'SUCCESS') {
        // Add the new product to billing data state directly instead of refetching
        if (billingData && response.data) {
          const newProduct = response.data;
          const departmentInfo = visit.departments?.find(d => 
            d.id === catalogDepartmentId || d.id === newProduct.rootVisitDepartmentId
          );
          
          const newBillingItem: BillingItem = {
            id: newProduct.id || '',
            name: newProduct.productName || item.name,
            quantity: newProduct.quantity || quantity,
            price: newProduct.unitPrice || 0,
            type: 'product',
            visitDepartmentId: newProduct.visitDepartmentId || catalogDepartmentId,
            rootVisitDepartmentId: newProduct.rootVisitDepartmentId || catalogDepartmentId,
            departmentId: departmentInfo?.department?.id,
            departmentName: departmentInfo?.department?.name || 'General',
            departmentStatus: departmentInfo?.status,
            paymentStatus: 'pending',
            exempted: false,
            exemptionType: 'none',
            selectedInsuranceId: undefined,
            doneBy: {
              name: doctor?.firstName || 'Doctor',
              title: '',
            },
          };
          
          setBillingData((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              items: [...prev.items, newBillingItem],
              updatedAt: new Date().toISOString(),
            };
          });
        } else {
          // Fallback to refetch if response data is incomplete
          await refetchVisit();
        }
        setShowAddProductModal(false);
        toast.success('Product added successfully');
      } else {
        const errorMsg = response?.messages?.[0]?.text || 'Failed to add product';
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error('Failed to add product to visit:', err);
      toast.error('Failed to add product. Please try again.');
    } finally {
      setAddingBillingItem(false);
    }
  };

  if (!visit) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-2">
        <p className="text-muted-foreground">Visit not found.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-2">
        <p className="text-destructive">Failed to load visit billing data.</p>
        <p className="text-sm text-muted-foreground">
          {typeof error === 'string' ? error : 'An unexpected error occurred'}
        </p>
      </div>
    );
  }

  if (loading || !billingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <Header doctor={doctor} />

      <BillingPatientBar
        patientName={billingData.patientName}
        patientAge={billingData.patientAge}
        gender={billingData.gender}
        visitDate={billingData.visitDate}
        patientIdNumber={billingData.patientId_Number}
        patientInsurances={patientInsurances}
        activeInsuranceIds={visitInsuranceIds}
        addingVisitInsurance={addingVisitInsurance}
        onToggleInsurance={(id, active) =>
          active ? handleAddInsuranceToVisit(id) : handleRemoveInsuranceFromVisit(id)
        }
        onAddInsurance={() => setShowAddInsuranceModal(true)}
      />

      <div className="flex-1 flex flex-col min-h-0">
        <BillingItemsWorkspace
          activeService={activeService}
          allServiceNames={allServiceNames}
          items={itemsToDisplay}
          selectedItemIds={selectedItemIds}
          selectedCountLabel={`${selectedItemIds.length}/${itemsToDisplay.filter((i) => i.paymentStatus !== 'paid').length} selected`}
          canAddItems={!canEditBilling && hasRemainingToBill}
          canEdit={canEditBillingItems}
          visitInsuranceOptions={visitInsuranceOptions}
          onServiceChange={setActiveService}
          onAddItem={() => setShowAddProductModal(true)}
          onItemChange={handleItemChange}
          onItemRemove={handleItemRemove}
          onQuantityChange={handleQuantityChange}
          onSelectionToggle={handleSelectionToggle}
          onSelectAll={handleSelectAll}
        />

        {showBillingDock && (
          <BillingStickySummary
            totals={displayTotals}
            amountPaid={billingData.amountPaid || 0}
            activeService={activeService}
            selectedCount={itemsToDisplay.filter(
              (item) => selectedItemIds.includes(item.id) && item.paymentStatus !== 'paid',
            ).length}
            existingVisitBilling={existingVisitBilling}
            canEditBilling={canEditBilling}
            hasRemainingToBill={hasRemainingToBill}
            creatingBill={creatingBill}
            generatingInvoice={generatingInvoice}
            isEditingBill={isEditingBill}
            exemptionCount={exemptionCount}
            onCompleteBill={() => {
              setConfirmSheetMode('complete');
              handleAmountPaidChange(displayTotals.totalAmount);
              setShowCompleteBillConfirm(true);
            }}
            onPreview={() => void handlePreviewBilling()}
            onPrint={() => void handlePrintBillingInvoice()}
            onEditBilling={() => {
              setIsEditingBill(true);
              setShowDiscountControls(true);
              setConfirmSheetMode('edit');
              setShowCompleteBillConfirm(true);
            }}
            onDoneEditing={async () => {
              setShowDiscountControls(false);
              setIsEditingBill(false);
              try {
                await refreshInvoicePdf();
                toast.success('Invoice preview refreshed from backend');
              } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Invoice PDF refresh failed.';
                toast.warning(message);
              }
            }}
            onManageExemptions={() => setShowExemptionsWindow(true)}
          />
        )}
      </div>

      <AddPatientInsuranceModal
        open={showAddInsuranceModal}
        onOpenChange={setShowAddInsuranceModal}
        patientId={visit.patient.id}
        patientDateOfBirth={visit.patient.dateOfBirth}
        patientInsurances={patientInsurances}
        onSuccess={() => void refetchVisit()}
        context="billing"
        disabled={addingVisitInsurance}
      />

      <VisitNotesFloating
        title="Billing Notes & Report"
        notes={billingDepartmentNotes}
        allowedDisplayTypes={['BILLING']}
        noteTypes={[
          'BILLING',
          'FORMS',
          'CONSULTATION',
          'ADMIN',
          'PUBLIC',
        ]}
        onAddNote={async (noteType, content) => {
          const visitDepartmentId = String(firstBillingDepartmentId || '')
          if (!visitDepartmentId) {
            throw new Error('No department selected for billing note')
          }

          const result = await addVisitDepartmentNote(visitDepartmentId, content, noteType)
          if (result?.status !== 'SUCCESS') {
            throw new Error(result?.message || 'Failed to add note')
          }
          await refetchNotes()
          await refetchVisit()
        }}
        onMarkAsViewed={async (noteId) => {
          await markNotesViewed(String(firstBillingDepartmentId || ''))
          await refetchNotes()
          await refetchVisit()
        }}
      />

      <BillingConfirmSheet
        open={showCompleteBillConfirm}
        onOpenChange={setShowCompleteBillConfirm}
        items={billingData.items}
        selectedItemIds={selectedItemIds}
        totals={displayTotals}
        amountPaid={billingData.amountPaid || 0}
        paymentMethod={billingData.paymentMethod || 'MOBILE_MONEY'}
        creatingBill={creatingBill}
        showItemsReview={confirmSheetMode === 'complete'}
        showDiscountControls={showDiscountControls}
        discountInputType={discountInputType}
        discountInputValue={discountInputValue}
        onPaymentMethodChange={handlePaymentMethodChange}
        onAmountPaidChange={handleAmountPaidChange}
        onShowDiscountControls={setShowDiscountControls}
        onDiscountInputTypeChange={(type) => {
          setDiscountInputType(type);
          if (type === 'FIXED') {
            const fixed =
              (displayTotals.patientResponsibility * (billingData.discountPercentage || 0)) / 100;
            setDiscountInputValue(Math.max(0, fixed));
          } else {
            setDiscountInputValue(Number(billingData.discountPercentage || 0));
          }
        }}
        onDiscountInputValueChange={setDiscountInputValue}
        onDiscountChange={handleDiscountChange}
        onConfirm={async () => {
          if (confirmSheetMode === 'complete') {
            setShowCompleteBillConfirm(false);
            await handleGenerateBill();
          } else {
            setShowCompleteBillConfirm(false);
            setShowDiscountControls(false);
            setIsEditingBill(false);
            try {
              await refreshInvoicePdf();
              toast.success('Payment details updated');
            } catch (err: unknown) {
              const message = err instanceof Error ? err.message : 'Invoice PDF refresh failed.';
              toast.warning(message);
            }
          }
        }}
      />

      <AddVisitDepartmentProductModal
        open={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
        visitDepartments={visit?.departments || []}
        activeServiceName={activeService}
        viewMode="service"
        onAdd={handleAddProduct}
        isSubmitting={addingBillingItem}
      />

      <BillingExemptionsPanel
        open={showExemptionsWindow}
        exemptionCount={exemptionCount}
        items={billingData?.items || []}
        onClose={() => setShowExemptionsWindow(false)}
        onExemptionChange={handleExemptionChange}
      />

      <BillingPreviewSheet
        open={previewOpen}
        onOpenChange={(open) => {
          setPreviewOpen(open);
          if (!open) {
            setPreviewDepartmentId(null);
            setPreviewStartedAt(null);
          }
        }}
        visit={visit}
        billingData={billingData}
        visitBilling={existingVisitBilling}
        selectedDepartmentId={previewDepartmentId}
        onDepartmentSelect={setPreviewDepartmentId}
        previewStartedAt={previewStartedAt}
      />
    </div>
  );
}
