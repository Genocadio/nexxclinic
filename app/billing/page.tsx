'use client';

import { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { BillingItemsList } from '@/components/BillingItemsList';
import { BillingExemptions } from '@/components/BillingExemptions';
import { Button } from '@/components/ui/button';
import { BillingData, BillingItem, buildProductCoverageMaps, getItemInsuranceSplit, applyInsuranceSelectionToItem, resolveBillingUnitPrice } from '@/lib/billing-utils';
import Header from '@/components/header';
import { useAuth } from '@/lib/auth-context';
import { useSearchParams } from 'next/navigation';
import { useVisit, type Visit, useInsurances, useCreateBill, useGetBillByVisit, useGenerateInvoice, useCompleteVisit } from '@/hooks/auth-hooks';
import { useUpdateVisitDepartmentStatus } from '@/hooks/auth-hooks';
import { useAddVisitNote } from '@/hooks/auth-hooks';
import { useAddProductToVisitDepartment, useLinkVisitInsurances, useUnlinkVisitInsurances, useUpdateProductQuantity } from '@/hooks/visits/hooks';
import { useCreatePatientInsurance, useUpdatePatientInsurance } from '@/hooks/patients';
import { Spinner } from '@/components/ui/spinner';
import AddProductModal from '@/components/add-action-consumable-modal';
import VisitNotesFloating from '@/components/visit-notes-floating';
import { Plus } from 'lucide-react';
import { BillingPatientBar } from '@/components/billing/billing-patient-bar';
import { BillingStickySummary } from '@/components/billing/billing-sticky-summary';
import { BillingConfirmSheet } from '@/components/billing/billing-confirm-sheet';
import { BillingPreviewSheet } from '@/components/billing/billing-preview-sheet';
import { toast } from 'react-toastify';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { isDominantMemberRequired } from '@/lib/validation-utils';
import { openInvoicePreview, resolveInvoiceUrl } from '@/lib/invoice-utils';

function BillingPageContent() {
  const searchParams = useSearchParams();
  const visitId = searchParams.get('visitId');
  const autoPrint = searchParams.get('autoprint') === '1';
  const { visit, loading, error, refetch: refetchVisit } = useVisit(visitId);
  const { insurances: availableInsurances } = useInsurances();
  const { createBill, loading: creatingBill } = useCreateBill();
  const { generateInvoice, loading: generatingInvoice } = useGenerateInvoice();
  const { bill: existingBill, loading: loadingBill, refetch: refetchBill } = useGetBillByVisit(visitId);
  const { createPatientInsurance } = useCreatePatientInsurance();
  const { updatePatientInsurance } = useUpdatePatientInsurance();
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
  const [selectedInsuranceId, setSelectedInsuranceId] = useState<string>('');
  const [insuranceCardNumber, setInsuranceCardNumber] = useState('');
  const [providingCompanyOrEmployer, setProvidingCompanyOrEmployer] = useState('');
  const [dominantFirstName, setDominantFirstName] = useState('');
  const [dominantLastName, setDominantLastName] = useState('');
  const [dominantPhone, setDominantPhone] = useState('');
  const [formErrors, setFormErrors] = useState<{ card?: string; employer?: string; dominant?: string }>({});
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
  const { addVisitNote } = useAddVisitNote();
  const { completeVisit } = useCompleteVisit();

  const mapPaymentStatus = (status?: string, itemId?: string): BillingItem['paymentStatus'] => {
    if (status === 'BILLED') return 'paid';
    // Check if item is in existing bill
    if (existingBill && itemId) {
      const isBilled = existingBill.items?.some((item: any) => item.visitDepartmentProductId === itemId);
      if (isBilled) return 'paid';
    }
    return 'pending';
  };

  const flattenVisitDepartments = (
    departments: NonNullable<Visit['departments']>,
  ): NonNullable<Visit['departments']> => {
    const flattened: NonNullable<Visit['departments']> = [];
    const stack = [...departments];
    while (stack.length > 0) {
      const current = stack.shift();
      if (!current) continue;
      flattened.push(current);
      if (current.childVisitDepartments?.length) {
        stack.push(...current.childVisitDepartments);
      }
    }
    return flattened;
  };

  const mapVisitToBilling = (visitData: Visit): BillingData => {
    const patient = visitData.patient;
    const insurances = visitData.insurances || [];
    const defaultVisitInsuranceId = insurances[0]?.id ? String(insurances[0].id) : undefined;
    const defaultProviderId = insurances[0]?.insurance?.id ? String(insurances[0].insurance.id) : undefined;

    const mapProductCoverages = (
      coverages?: Array<{ insurance?: { id?: string | number }; cost?: number; price?: number; covered?: boolean }>,
    ) => buildProductCoverageMaps(coverages);

    const items: BillingItem[] = [];

    const mapDepartmentTreeItems = (
      department: NonNullable<Visit['departments']>[number],
      parentContext?: {
        visitDepartmentId?: string;
        departmentId?: string;
        name: string;
        completedTime?: string;
        status?: string;
      },
      childHierarchy: string[] = [],
    ) => {
      const currentContext = parentContext || {
        visitDepartmentId: department.id,
        departmentId: department.department?.id,
        name: department.department?.name || 'Department',
        completedTime: department.completedTime,
        status: department.status,
      };

      const childDepartmentName = childHierarchy.length > 0
        ? childHierarchy.join(' > ')
        : undefined;

      department.actions?.forEach((act) => {
        const basePrice = Number(act.action?.privatePrice ?? 0);
        const { costs, meta } = mapProductCoverages(act.action?.insuranceCoverages);
        const { price, notCovered } = resolveBillingUnitPrice(
          basePrice,
          costs,
          meta,
          defaultProviderId,
        );
        items.push({
          id: act.id,
          name: act.action?.name || 'Action',
          quantity: act.quantity || 1,
          price,
          basePrice,
          insuranceCoverageCosts: costs,
          insuranceCoverageMeta: meta,
          insuranceNotCovered: defaultVisitInsuranceId ? notCovered : false,
          type: 'action',
          visitDepartmentId: department.id,
          rootVisitDepartmentId: parentContext ? parentContext.visitDepartmentId : department.id,
          departmentId: currentContext.departmentId,
          departmentName: currentContext.name,
          childDepartmentName,
          departmentCompletedTime: currentContext.completedTime,
          departmentStatus: currentContext.status,
          paymentStatus: mapPaymentStatus(act.paymentStatus, act.id),
          exempted: false,
          exemptionType: 'none',
          selectedInsuranceId: defaultVisitInsuranceId,
          doneBy: {
            name: act.doneBy?.name || 'Staff',
            title: act.doneBy?.title || '',
          },
        });
      });

      department.consumables?.forEach((cons) => {
        const basePrice = Number(cons.consumable?.privatePrice ?? 0);
        const { costs, meta } = mapProductCoverages(cons.consumable?.insuranceCoverages);
        const { price, notCovered } = resolveBillingUnitPrice(
          basePrice,
          costs,
          meta,
          defaultProviderId,
        );
        items.push({
          id: cons.id,
          name: cons.consumable?.name || 'Consumable',
          quantity: cons.quantity || 1,
          price,
          basePrice,
          insuranceCoverageCosts: costs,
          insuranceCoverageMeta: meta,
          insuranceNotCovered: defaultVisitInsuranceId ? notCovered : false,
          type: 'consumable',
          visitDepartmentId: department.id,
          rootVisitDepartmentId: parentContext ? parentContext.visitDepartmentId : department.id,
          departmentId: currentContext.departmentId,
          departmentName: currentContext.name,
          childDepartmentName,
          departmentCompletedTime: currentContext.completedTime,
          departmentStatus: currentContext.status,
          paymentStatus: mapPaymentStatus(cons.paymentStatus, cons.id),
          exempted: false,
          exemptionType: 'none',
          selectedInsuranceId: defaultVisitInsuranceId,
          doneBy: {
            name: cons.doneBy?.name || 'Staff',
            title: cons.doneBy?.title || '',
          },
        });
      });

      department.childVisitDepartments?.forEach((childDepartment) => {
        mapDepartmentTreeItems(
          childDepartment,
          currentContext,
          [...childHierarchy, childDepartment.department?.name || 'Department'],
        );
      });
    };

    visitData.departments?.forEach((dept) => {
      mapDepartmentTreeItems(dept);
    });

    const age = patient?.dateOfBirth ? (new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()) : 0;

    const nationalId = (patient as any)?.nationalId || ''
    const discountPercentage = 0; // globalDiscount is no longer supported directly on VisitBilling

    // Default amount paid to patient's contribution (after insurance and discount) when no bill exists yet.
    const patientContribution = items.reduce((total, item) => {
      const selectedInsurance = insurances.find((ins) => String(ins.id) === item.selectedInsuranceId);
      const coveragePct =
        selectedInsurance?.insurance?.coveragePercentage ??
        (selectedInsurance as { coveragePercentage?: number })?.coveragePercentage ??
        0;
      const { patientAmount, skip } = getItemInsuranceSplit(item, coveragePct);
      if (skip) return total;
      return total + patientAmount;
    }, 0);

    const patientContributionAfterDiscount = Math.max(
      0,
      patientContribution - (patientContribution * discountPercentage) / 100,
    )

    return {
      visitId: visitData.id,
      patientId: patient?.id || '',
      patientName: `${patient?.firstName || ''} ${patient?.lastName || ''}`.trim(),
      patientAge: age,
      patientId_Number: nationalId,
      gender: patient?.gender || '',
      visitDate: visitData.visitDate,
      currency: 'RWF',
      insurances: insurances.map((ins) => ({
        id: ins.id ? String(ins.id) : undefined,
        name: ins.name,
        acronym: ins.acronym,
        coveragePercentage: ins.coveragePercentage,
      })),
      items,
      discountPercentage,
      paymentMethod: 'MOBILE_MONEY',
      amountPaid: Number(existingBill?.paidAmount ?? patientContributionAfterDiscount),
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  useEffect(() => {
    if (!visit?.id) return;
    const newIds = (visit.insurances || []).map((insurance) => String(insurance.id));
    if (
      newIds.length !== activeVisitInsuranceIds.length ||
      newIds.some((id, index) => id !== activeVisitInsuranceIds[index])
    ) {
      setActiveVisitInsuranceIds(newIds);
    }
  }, [visit?.id, visit?.insurances, activeVisitInsuranceIds]);

  const activeVisitInsurances = useMemo(() => {
    const activeIds = new Set(activeVisitInsuranceIds);
    return (visit?.insurances || []).filter((insurance) => activeIds.has(String(insurance.id)));
  }, [visit?.insurances, activeVisitInsuranceIds]);

  useEffect(() => {
    if (!visit) return;
    const mapped = mapVisitToBilling(visit);
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
  }, [visit?.id, existingBill?.id, existingBill?.paidAmount, existingBill?.totalAmount, existingBill?.outstandingAmount]);

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
      const selectedInsurance = activeVisitInsurances.find(
        (ins) => String(ins.id) === item.selectedInsuranceId,
      );
      const coveragePct =
        selectedInsurance?.insurance?.coveragePercentage ??
        selectedInsurance?.coveragePercentage ??
        0;
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
    () =>
      activeVisitInsurances.map((ins) => ({
        id: String(ins.id),
        providerId: String(ins.insurance?.id || ''),
        name: ins.insurance?.name || ins.name || '',
        acronym: ins.insurance?.acronym || ins.acronym || '',
        coveragePercentage: ins.insurance?.coveragePercentage ?? ins.coveragePercentage ?? 0,
      })),
    [activeVisitInsurances],
  );

  const patientInsurances = useMemo(() => visit?.patient.insurances || [], [visit?.patient.insurances]);
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
  const canEditBilling = Boolean(existingBill) || billJustCreated;
  const showBillingDock = canEditBilling || (!existingBill && hasRemainingToBill);

  const refreshInvoicePdf = async (insuranceBillingId?: string, options?: { openPreview?: boolean }) => {
    const targetInsuranceBillingId = insuranceBillingId || existingBill?.insuranceBillingId;
    if (!targetInsuranceBillingId) return null;

    const invoiceUrl = await resolveInvoiceUrl(targetInsuranceBillingId, generateInvoice);
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

  const billingScopedNotes = [
    ...((visit?.visitNotes || [])
      .filter((note) => note?.type === 'BILLING')
      .map((note) => ({
        ...note,
        scope: 'visit' as const,
      }))),
    ...((visit?.departments || []).flatMap((dept) =>
      (dept.notes || [])
        .filter((note) => note?.type === 'BILLING')
        .map((note) => ({
          ...note,
          scope: 'department' as const,
          departmentName: dept.department?.name,
        }))
    )),
  ];

  const hasUnbilledItems = (visitData: Visit | undefined) => {
    if (!visitData) return false;
    if (visitData.billingStatus === 'BILLED') return false;

    const isUnbilledStatus = (status?: string) => {
      const normalized = String(status || '').toUpperCase();
      return normalized === 'PENDING' || normalized === 'UNPAID';
    };

    return flattenVisitDepartments(visitData.departments || []).some((dept) =>
      (dept.actions || []).some((action) => isUnbilledStatus(action.paymentStatus)) ||
      (dept.consumables || []).some((consumable) => isUnbilledStatus(consumable.paymentStatus))
    );
  };

  const hasNoBillables = (visitData: Visit | undefined) => {
    if (!visitData) return true;
    return !flattenVisitDepartments(visitData.departments || []).some((dept) =>
      (dept.actions && dept.actions.length > 0) || (dept.consumables && dept.consumables.length > 0),
    );
  };

  const hasIncompleteDepartments = (visitData: Visit | undefined) => {
    if (!visitData) return false;
    return flattenVisitDepartments(visitData.departments || []).some(
      (dept) => dept.status !== 'COMPLETED' && dept.status !== 'CANCELLED',
    );
  };

  const canDischargeVisit = Boolean(
    visit &&
    visit.visitStatus !== 'COMPLETED' &&
    visit.visitStatus !== 'CANCELLED' &&
    !hasIncompleteDepartments(visit) &&
    (!hasUnbilledItems(visit) || hasNoBillables(visit))
  );

  const handleDischargeVisit = async () => {
    if (!visit) return;

    const confirmed = window.confirm('All billable items are settled. Discharge this patient and complete visit?');
    if (!confirmed) return;

    try {
      const allDepartments = flattenVisitDepartments(visit.departments || []);
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
            const allDepartments = flattenVisitDepartments(visit?.departments || []);
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
    if (!autoPrint || didAutoPrint || !existingBill || !billingData) return
    setDidAutoPrint(true)
    // Small delay ensures print window content is ready after query hydration.
    const timer = setTimeout(() => {
      void handlePrintBillingInvoice()
    }, 150)

    return () => clearTimeout(timer)
  }, [autoPrint, didAutoPrint, existingBill, billingData])

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

    if (existingBill) {
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

    const invoiceItems = existingBill?.items?.map((item) => ({
      description: item.productName,
      quantity: item.quantitySnapshot,
      unitPrice: item.unitPriceSnapshot,
      lineTotal: item.lineTotal,
    })) || billingData.items.map((item) => ({
      description: item.name,
      quantity: item.quantity,
      unitPrice: item.price,
      lineTotal: item.price * item.quantity,
    }))

    const totals = {
      subtotal: existingBill?.totalAmount ?? displayTotals.subtotal,
      discount: displayTotals.discount,
      totalDue: existingBill?.totalAmount ?? displayTotals.totalAmount,
      paid: existingBill?.paidAmount ?? (billingData.amountPaid || 0),
      balance: existingBill?.outstandingAmount ?? Math.max(0, displayTotals.totalAmount - (billingData.amountPaid || 0)),
    }

    const invoiceHtml = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Invoice ${escapeHtml(existingBill?.id || billingData.visitId || 'N/A')}</title>
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
          <h1 class="title">NexxMed Invoice</h1>
          <p class="muted">Formal Billing Statement</p>
        </div>
        <div>
          <p class="muted"><strong>Invoice #:</strong> ${escapeHtml(existingBill?.id || billingData.visitId || 'N/A')}</p>
          <p class="muted"><strong>Date:</strong> ${new Date(existingBill?.updatedAt || billingData.updatedAt || new Date().toISOString()).toLocaleString()}</p>
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
        Generated by NexxMed Billing Module.
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

  const resetAddInsuranceForm = () => {
    setSelectedInsuranceId('');
    setInsuranceCardNumber('');
    setProvidingCompanyOrEmployer('');
    setDominantFirstName('');
    setDominantLastName('');
    setDominantPhone('');
    setFormErrors({});
  };



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

  const handleAddProduct = async (_type: 'action' | 'consumable', item: { id: string; name: string }, quantity: number, departmentId: string) => {
    if (!visit?.id) return;

    try {
      const response = await addProduct(visit.id, departmentId, item.id, quantity);
      if (response?.status === 'SUCCESS') {
        await refetchVisit();
        setShowAddProductModal(false);
      } else {
        const errorMsg = response?.messages?.[0]?.text || 'Failed to add product';
        toast.error(errorMsg);
        await refetchVisit();
      }
    } catch (err) {
      console.error('Failed to add product to visit:', err);
      toast.error('Failed to add product. Please try again.');
      await refetchVisit();
    }
  };

  const handleAddInsurance = async () => {
    if (!selectedInsuranceId || !visit) return;

    // Validate fields and show errors inside the modal rather than using toasts
    const errors: { card?: string; employer?: string; dominant?: string } = {};
    const dominantRequired = isDominantMemberRequired(visit.patient.dateOfBirth, true);

    if (!insuranceCardNumber.trim()) {
      errors.card = 'Insurance card number is required.';
    }
    if (!providingCompanyOrEmployer.trim()) {
      errors.employer = 'Providing company or employer is required.';
    }
    if (dominantRequired && (!dominantFirstName.trim() || !dominantLastName.trim() || !dominantPhone.trim())) {
      errors.dominant = 'Dominant member first name, last name and phone are required for patients 18 years or younger.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const dominantMember =
        dominantFirstName || dominantLastName || dominantPhone
          ? {
              firstName: dominantFirstName,
              lastName: dominantLastName,
              phone: dominantPhone,
            }
          : undefined;

      const existingInsurance = patientInsurances.find((ins) => String(ins.insurance.id) === selectedInsuranceId);
      const commonPayload = {
        patientId: visit.patient.id,
        insuranceProviderId: selectedInsuranceId,
        insuranceCardNumber,
        providingCompanyOrEmployer: providingCompanyOrEmployer || null,
        dominantMember,
        validFrom: new Date().toISOString().slice(0, 10),
        validUntil: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()).toISOString().slice(0, 10),
      };

      let response;
      if (existingInsurance) {
        response = await updatePatientInsurance(existingInsurance.id, commonPayload);
      } else {
        response = await createPatientInsurance(commonPayload);
      }

      if (response?.status === 'SUCCESS') {
        await refetchVisit();
        setShowAddInsuranceModal(false);
        resetAddInsuranceForm();
        toast.success('Insurance saved on patient record. Check it under Patient insurances to use on this visit.');
      } else {
        const errorMsg = response?.messages?.[0]?.text || 'Failed to add insurance';
        toast.error(errorMsg);
        await refetchVisit();
      }
    } catch (err) {
      console.error('Failed to add insurance:', err);
      toast.error('Failed to add insurance. Please try again.');
      await refetchVisit();
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
        {/* Primary workspace: items to bill */}
        <div className="flex-1 flex flex-col min-h-0 p-6">
          <div className="flex-1 flex flex-col min-h-0 w-full min-w-0 mx-auto px-2 sm:px-4 md:px-[1cm] lg:px-[2cm]">
          <div className="flex items-center justify-between gap-3 mb-2 flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <h2 className="text-sm font-semibold text-foreground">Items to Bill</h2>
              <span className="text-xs text-muted-foreground tabular-nums">
                {selectedItemIds.length}/{itemsToDisplay.filter((i) => i.paymentStatus !== 'paid').length} selected
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {!canEditBilling && hasRemainingToBill && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-full text-xs"
                  onClick={() => setShowAddProductModal(true)}
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Add item
                </Button>
              )}
            </div>
          </div>

          <div className="mb-2 flex-shrink-0">
            <Tabs value={activeService} onValueChange={setActiveService}>
              <TabsList className="h-8">
                {allServiceNames.map((dept) => (
                  <TabsTrigger key={dept} value={dept} className="rounded-full px-3 text-xs h-7">
                    {dept}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div className="flex-1 min-h-0 bg-card/60 backdrop-blur-xl border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto py-2">
              <BillingItemsList
                items={itemsToDisplay}
                onItemChange={handleItemChange}
                onItemRemove={handleItemRemove}
                onQuantityChange={handleQuantityChange}
                availableInsurances={visitInsuranceOptions}
                selectable={true}
                selectedItemIds={selectedItemIds}
                onSelectionToggle={handleSelectionToggle}
                onSelectAll={handleSelectAll}
                hideDepartmentHeaders={true}
                allDepartments={[]}
                hideTypeColumn={true}
              />
            </div>
          </div>
          </div>
        </div>

        {showBillingDock && (
          <BillingStickySummary
            totals={displayTotals}
            amountPaid={billingData.amountPaid || 0}
            activeService={activeService}
            selectedCount={itemsToDisplay.filter(
              (item) => selectedItemIds.includes(item.id) && item.paymentStatus !== 'paid',
            ).length}
            existingBill={existingBill}
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

      {/* Add Insurance Modal */}
      <Dialog open={showAddInsuranceModal} onOpenChange={(open) => {
        setShowAddInsuranceModal(open);
        if (!open) {
          resetAddInsuranceForm();
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Add insurance to patient record</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              This saves insurance on the patient&apos;s profile, not directly on the visit. After saving,
              open <span className="font-medium text-foreground">Patient insurances</span> in the billing
              header and check it to use for billing on this visit.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-[11px] text-muted-foreground">Insurance</p>
              <Select value={selectedInsuranceId} onValueChange={setSelectedInsuranceId}>
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue placeholder="Select Insurance" />
                </SelectTrigger>
                <SelectContent>
                  {availableInsurances?.filter(
                    (ins) => !patientInsurances.some((pIns) => String(pIns.insurance.id) === String(ins.id)),
                  ).map((insurance) => (
                    <SelectItem key={insurance.id} value={String(insurance.id)}>
                      {insurance.acronym} - {insurance.name} ({insurance.coveragePercentage}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] text-muted-foreground">Insurance Card Number (required)</p>
              <Input
                value={insuranceCardNumber}
                onChange={(e) => {
                  setInsuranceCardNumber(e.target.value);
                  if (formErrors.card) setFormErrors((prev) => ({ ...prev, card: undefined }));
                }}
                placeholder="Card number"
              />
              {formErrors.card && <p className="text-xs text-destructive mt-1">{formErrors.card}</p>}
            </div>

            <div className="space-y-1">
              <p className="text-[11px] text-muted-foreground">Providing Company / Employer (required)</p>
              <Input
                value={providingCompanyOrEmployer}
                onChange={(e) => {
                  setProvidingCompanyOrEmployer(e.target.value);
                  if (formErrors.employer) setFormErrors((prev) => ({ ...prev, employer: undefined }));
                }}
                placeholder="Employer or company name"
              />
              {formErrors.employer && <p className="text-xs text-destructive mt-1">{formErrors.employer}</p>}
            </div>

            <div className="space-y-1">
              <p className="text-[11px] text-muted-foreground">
                Dominant Member {isDominantMemberRequired(visit.patient.dateOfBirth, true) ? '(required for patients 18 years or younger)' : '(optional)'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input
                  value={dominantFirstName}
                  onChange={(e) => {
                    setDominantFirstName(e.target.value);
                    if (formErrors.dominant) setFormErrors((prev) => ({ ...prev, dominant: undefined }));
                  }}
                  placeholder="First name"
                />
                <Input
                  value={dominantLastName}
                  onChange={(e) => {
                    setDominantLastName(e.target.value);
                    if (formErrors.dominant) setFormErrors((prev) => ({ ...prev, dominant: undefined }));
                  }}
                  placeholder="Last name"
                />
              </div>
              <Input
                value={dominantPhone}
                onChange={(e) => {
                  setDominantPhone(e.target.value);
                  if (formErrors.dominant) setFormErrors((prev) => ({ ...prev, dominant: undefined }));
                }}
                placeholder="Phone"
              />
              {formErrors.dominant && <p className="text-xs text-destructive mt-1">{formErrors.dominant}</p>}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              onClick={() => {
                setShowAddInsuranceModal(false);
                resetAddInsuranceForm();
              }}
              variant="outline"
            >
              Cancel
            </Button>
            <Button onClick={handleAddInsurance} disabled={!selectedInsuranceId || addingVisitInsurance}>
              Save to patient record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <VisitNotesFloating
        title="Billing Notes & Report"
        notes={billingScopedNotes}
        allowedDisplayTypes={['BILLING']}
        noteTypes={['REPORT']}
        onAddNote={async (_type, text) => {
          if (!visit?.id) {
            throw new Error('Visit not found')
          }
          const result = await addVisitNote(String(visit.id), 'REPORT', text)
          if (result?.status !== 'SUCCESS') {
            throw new Error(result?.messages?.[0]?.text || 'Failed to add billing note')
          }
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

        {/* Add Product Modal */}
        <AddProductModal
          isOpen={showAddProductModal}
          onClose={() => setShowAddProductModal(false)}
          departments={allServiceNames.map((deptName) => {
            const deptId = visit?.departments?.find(d => (d.department?.name || 'General') === deptName)?.department?.id;
            return { id: deptId || deptName, name: deptName };
          })}
          currentDepartmentId={
            visit?.departments?.find((dept) => (dept.department?.name || 'General') === activeService)?.department?.id
          }
          viewMode="service"
          onAdd={handleAddProduct}
          isSubmitting={addingBillingItem}
        />

      {/* Floating Exemptions Window */}
      {showExemptionsWindow && (
        <div className="fixed inset-0 z-50 flex items-end justify-center pb-32">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowExemptionsWindow(false)}
          />
          
          {/* Chat-like Floating Window */}
          <div className="relative z-10 w-full max-w-md mx-4 bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl flex flex-col max-h-[60vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
              <h2 className="text-lg font-semibold text-foreground">Exemptions ({exemptionCount})</h2>
              <button
                onClick={() => setShowExemptionsWindow(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>
            
            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              <BillingExemptions
                items={billingData?.items || []}
                onExemptionChange={handleExemptionChange}
              />
            </div>
          </div>
        </div>
      )}

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
        existingBill={existingBill}
        selectedDepartmentId={previewDepartmentId}
        onDepartmentSelect={setPreviewDepartmentId}
        previewStartedAt={previewStartedAt}
      />
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Spinner /></div>}>
      <BillingPageContent />
    </Suspense>
  );
}
