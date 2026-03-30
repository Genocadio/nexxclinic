'use client';

import { useState, useEffect, Suspense } from 'react';
import { gql, useMutation } from '@apollo/client';
import { BillingItemsList } from '@/components/BillingItemsList';
import { BillingExemptions } from '@/components/BillingExemptions';
import { Button } from '@/components/ui/button';
import { BillingData, BillingItem, getEffectiveCoveragePercentage } from '@/lib/billing-utils';
import Header from '@/components/header';
import { useAuth } from '@/lib/auth-context';
import { useSearchParams } from 'next/navigation';
import { useVisit, type Visit, useUpdatePatient, useInsurances, useCreateBill, useGetBillByVisit } from '@/hooks/auth-hooks';
import { useAddActionToVisitDepartment, useAddConsumableToVisitDepartment } from '@/hooks/auth-hooks';
import { useUpdateVisitDepartmentStatus } from '@/hooks/auth-hooks';
import { useAddVisitNote } from '@/hooks/auth-hooks';
import { Spinner } from '@/components/ui/spinner';
import { Skeleton } from '@/components/ui/skeleton';
import AddActionConsumableModal from '@/components/add-action-consumable-modal';
import VisitNotesFloating from '@/components/visit-notes-floating';
import { Plus, Layers, List, Receipt, Pencil, Printer } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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

const ADD_INSURANCE_TO_VISIT = gql`
  mutation AddInsuranceToVisit($visitId: ID!, $insuranceId: ID!) {
    addInsuranceToVisit(visitId: $visitId, insuranceId: $insuranceId) {
      status
      data {
        id
        insurances {
          id
          name
          acronym
          coveragePercentage
        }
      }
      messages {
        text
        type
      }
    }
  }
`;

function BillingPageContent() {
  const searchParams = useSearchParams();
  const visitId = searchParams.get('visitId');
  const autoPrint = searchParams.get('autoprint') === '1';
  const { visit, loading, error, refetch: refetchVisit } = useVisit(visitId);
  const { insurances: availableInsurances } = useInsurances();
  const [addInsuranceToVisit, { loading: addingVisitInsurance }] = useMutation(
    ADD_INSURANCE_TO_VISIT,
  );
  const { createBill, loading: creatingBill } = useCreateBill();
  const { bill: existingBill, loading: loadingBill, refetch: refetchBill } = useGetBillByVisit(visitId);
  const { updatePatient } = useUpdatePatient();
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [billJustCreated, setBillJustCreated] = useState(false);
  const [showCompleteBillConfirm, setShowCompleteBillConfirm] = useState(false);
  const [didAutoPrint, setDidAutoPrint] = useState(false);
  const [viewMode, setViewMode] = useState<'all' | 'service'>('service');
  const [activeService, setActiveService] = useState<string>('');
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [showAddInsuranceModal, setShowAddInsuranceModal] = useState(false);
  const [selectedInsuranceId, setSelectedInsuranceId] = useState<string>('');
  const [insuranceCardNumber, setInsuranceCardNumber] = useState('');
  const [dominantFirstName, setDominantFirstName] = useState('');
  const [dominantLastName, setDominantLastName] = useState('');
  const [dominantPhone, setDominantPhone] = useState('');
  const [showDiscountControls, setShowDiscountControls] = useState(false);
  const [discountInputType, setDiscountInputType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [discountInputValue, setDiscountInputValue] = useState(0);
  const { doctor } = useAuth();
    const [showAddActionConsumableModal, setShowAddActionConsumableModal] = useState(false);
  const [addingBillingItem, setAddingBillingItem] = useState(false);
  const [showExemptionsWindow, setShowExemptionsWindow] = useState(false);
  const { addAction } = useAddActionToVisitDepartment();
  const { addConsumable } = useAddConsumableToVisitDepartment();
  const { updateDepartmentStatus } = useUpdateVisitDepartmentStatus();
  const { addVisitNote } = useAddVisitNote();

  const mapPaymentStatus = (status?: string, itemId?: string): BillingItem['paymentStatus'] => {
    if (status === 'BILLED') return 'paid';
    // Check if item is in existing bill
    if (existingBill && itemId) {
      const isBilled = existingBill.billingItems?.some((billingItem: any) => 
        billingItem.items.some((item: any) => item.itemId === itemId)
      );
      if (isBilled) return 'paid';
    }
    return 'pending';
  };

  const mapVisitToBilling = (visitData: Visit): BillingData => {
    const patient = visitData.patient;
    const insurances = visitData.insurances || [];
    const defaultInsuranceId = insurances[0]?.id ? String(insurances[0].id) : undefined;

    const items: BillingItem[] = [];

    visitData.departments?.forEach((dept) => {
      const deptName = dept.department?.name || 'Department';
      const deptId = dept.department?.id;
      const deptCompletedTime = dept.completedTime;
      const deptStatus = dept.status;

      dept.actions?.forEach((act) => {
        items.push({
          id: act.id,
          name: act.action?.name || 'Action',
          quantity: act.quantity || 1,
          price: act.action?.privatePrice || 0,
          type: 'action',
          departmentId: deptId,
          departmentName: deptName,
          departmentCompletedTime: deptCompletedTime,
          departmentStatus: deptStatus,
          paymentStatus: mapPaymentStatus(act.paymentStatus, act.id),
          exempted: false,
          exemptionType: 'none',
          selectedInsuranceId: defaultInsuranceId,
          doneBy: {
            name: act.doneBy?.name || 'Staff',
            title: act.doneBy?.title || '',
          },
        });
      });

      dept.consumables?.forEach((cons) => {
        items.push({
          id: cons.id,
          name: cons.consumable?.name || 'Consumable',
          quantity: cons.quantity || 1,
          price: cons.consumable?.privatePrice || 0,
          type: 'consumable',
          departmentId: deptId,
          departmentName: deptName,
          departmentCompletedTime: deptCompletedTime,
          departmentStatus: deptStatus,
          paymentStatus: mapPaymentStatus(cons.paymentStatus, cons.id),
          exempted: false,
          exemptionType: 'none',
          selectedInsuranceId: defaultInsuranceId,
          doneBy: {
            name: cons.doneBy?.name || 'Staff',
            title: cons.doneBy?.title || '',
          },
        });
      });
    });

    const age = patient?.dateOfBirth ? (new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()) : 0;

    const nationalId = (patient as any)?.nationalId || ''
    const discountPercentage =
      existingBill?.globalDiscount?.type === 'PERCENTAGE'
        ? Number(existingBill?.globalDiscount?.value || 0)
        : 0

    // Default amount paid to patient's contribution (after insurance and discount) when no bill exists yet.
    const patientContribution = items.reduce((total, item) => {
      const itemTotal = item.quantity * item.price
      const selectedInsurance = insurances.find((ins) => String(ins.id) === item.selectedInsuranceId)
      const coveragePct = selectedInsurance?.coveragePercentage || 0
      const coverageAmount = (itemTotal * coveragePct) / 100
      return total + (itemTotal - coverageAmount)
    }, 0)

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
      paymentMethod:
        existingBill?.payments?.[existingBill.payments.length - 1]?.method?.toLowerCase() === 'cash'
          ? 'cash'
          : existingBill?.payments?.[existingBill.payments.length - 1]?.method?.toLowerCase() === 'momo'
            ? 'momo'
            : existingBill?.payments?.[existingBill.payments.length - 1]?.method?.toLowerCase() === 'airtel-money'
              ? 'airtel-money'
              : 'momo',
      amountPaid: Number(existingBill?.totals?.patientTotalPaid ?? patientContributionAfterDiscount),
      notes: existingBill?.note || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  useEffect(() => {
    if (visit) {
      const mapped = mapVisitToBilling(visit);
      setBillingData(mapped);
      // Select only unbilled items by default
      const unbilledItems = mapped.items.filter(item => item.paymentStatus !== 'paid');
      setSelectedItemIds(unbilledItems.map(item => item.id));
    }
  }, [visit, existingBill]);

  useEffect(() => {
    if (billingData?.items?.length) {
      const firstDept = billingData.items[0].departmentName || 'General';
      setActiveService((prev) => prev || firstDept);
    }
  }, [billingData]);

  // When view mode changes to service or active service changes, update selection
  useEffect(() => {
    if (viewMode === 'service' && activeService && billingData) {
      // In service mode, only select unbilled items from the active service
      const serviceItems = billingData.items.filter(
        item => (item.departmentName || 'General') === activeService && item.paymentStatus !== 'paid'
      );
      setSelectedItemIds(serviceItems.map(item => item.id));
    } else if (viewMode === 'all' && billingData) {
      // In all mode, select all unbilled items
      const unbilledItems = billingData.items.filter(item => item.paymentStatus !== 'paid');
      setSelectedItemIds(unbilledItems.map(item => item.id));
    }
  }, [viewMode, activeService, billingData?.items.length]);

  // Calculate totals for a given items subset
  const calculateTotalsForItems = (items: BillingItem[]) => {
    let subtotal = 0;
    let insuranceCoverage = 0;
    let patientResponsibility = 0;

    items.forEach(item => {
      const itemTotal = item.quantity * item.price;
      const selectedInsurance = billingData?.insurances?.find(
        ins => (ins.id || ins.acronym) === item.selectedInsuranceId
      );
      const coveragePct = selectedInsurance?.coveragePercentage || 0;
      const coverageAmount = (itemTotal * coveragePct) / 100;
      const patientPortion = itemTotal - coverageAmount;
      const exemption = item.exemptionType || (item.exempted ? 'full' : 'none');

      if (exemption === 'full') {
        // Fully waived: neither patient nor insurance pays
        return;
      }

      // Always count toward subtotal unless fully waived
      subtotal += itemTotal;

      if (exemption === 'patient-share') {
        // Patient share waived; insurance still pays its portion
        insuranceCoverage += coverageAmount;
        return;
      }

      // No exemption
      insuranceCoverage += coverageAmount;
      patientResponsibility += patientPortion;
    });
    
    const discount = (patientResponsibility * (billingData?.discountPercentage || 0)) / 100;
    const totalAmount = patientResponsibility - discount;
    
    return { subtotal, insuranceCoverage, patientResponsibility, discount, totalAmount };
  };
  const totals = billingData ? calculateTotalsForItems(billingData.items) : { subtotal: 0, insuranceCoverage: 0, patientResponsibility: 0, discount: 0, totalAmount: 0 };
  const effectiveCoverage = getEffectiveCoveragePercentage(billingData?.insurances);
  const patientInsurances = visit?.patient.insurances || [];
  const visitInsuranceIds = new Set(visit?.insurances?.map((ins) => ins.id));

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
    method: 'cash' | 'momo' | 'airtel-money' | 'pending'
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

  const itemsByService = (serviceName: string) => {
    if (!billingData) return [] as BillingItem[];
    return billingData.items.filter((item) => (item.departmentName || 'General') === serviceName);
  };

  const itemsToDisplay: BillingItem[] = (() => {
    if (!billingData) return [] as BillingItem[];
    if (viewMode === 'service' && activeService) {
      return itemsByService(activeService);
    }
    return billingData.items;
  })();

  const selectedItems = billingData ? billingData.items.filter((it) => selectedItemIds.includes(it.id)) : [];
  const hasRemainingToBill = Boolean(billingData?.items.some((item) => item.paymentStatus !== 'paid'));
  const canEditBilling = Boolean(existingBill) || billJustCreated;
  const showBillingDock = canEditBilling || (!existingBill && hasRemainingToBill);
  
  // Compute service-specific totals when in service view
  const displayTotals = viewMode === 'service' ? calculateTotalsForItems(itemsToDisplay) : totals;

  useEffect(() => {
    if (!billingData) return
    setDiscountInputType('PERCENTAGE')
    setDiscountInputValue(Number(billingData.discountPercentage || 0))
    setShowDiscountControls(Boolean((billingData.discountPercentage || 0) > 0))
  }, [billingData?.discountPercentage])

  // Get all service names from visit departments (not just those with items)
  const allServiceNames = visit?.departments
    ?.filter(dept => dept.status !== 'CANCELLED')
    .map(dept => dept.department?.name || 'General') || [];
  
  // Calculate exemption count
  const exemptionCount = billingData
    ? billingData.items.filter(item => (item.exemptionType || (item.exempted ? 'full' : 'none')) !== 'none').length
    : 0;

  const unbilledServiceNames = billingData
    ? Array.from(
        new Set(
          billingData.items
            .filter((item) => item.paymentStatus !== 'paid')
            .map((item) => item.departmentName || 'General')
        )
      )
    : [];
  const hasMultipleUnbilledServices = unbilledServiceNames.length > 1;

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

    return (visitData.departments || []).some((dept) =>
      (dept.actions || []).some((action) => action.paymentStatus === 'PENDING') ||
      (dept.consumables || []).some((consumable) => consumable.paymentStatus === 'PENDING')
    );
  };

  const hasNoBillables = (visitData: Visit | undefined) => {
    if (!visitData) return true;
    return !(visitData.departments || []).some((dept) =>
      (dept.actions && dept.actions.length > 0) || (dept.consumables && dept.consumables.length > 0),
    );
  };

  const hasIncompleteDepartments = (visitData: Visit | undefined) => {
    if (!visitData) return false;
    return (visitData.departments || []).some((dept) => dept.status !== 'COMPLETED' && dept.status !== 'CANCELLED');
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
      const allDepartments = visit.departments || [];
      const notCompleted = allDepartments.filter((dept) => dept.status !== 'COMPLETED' && dept.status !== 'CANCELLED');

      if (notCompleted.length > 0) {
        for (const dept of notCompleted) {
          const deptId = String(dept.department?.id || dept.id || '');
          if (!deptId) continue;

          const res = await updateDepartmentStatus(String(visit.id), deptId, 'COMPLETED');
          if (res?.status !== 'SUCCESS') {
            toast.error(res?.messages?.[0]?.text || 'Failed to complete department during discharge');
            return;
          }
        }
      } else {
        // Re-apply completed status to last department to trigger backend visit completion aggregation.
        const fallbackDepartment = allDepartments[allDepartments.length - 1];
        const fallbackId = String(fallbackDepartment?.department?.id || fallbackDepartment?.id || '');
        if (fallbackId) {
          await updateDepartmentStatus(String(visit.id), fallbackId, 'COMPLETED');
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
    
    // In service mode, only bill items from the active service
    let items = selectedItems.length ? selectedItems : [];
    if (items.length === 0) {
      if (viewMode === 'service' && activeService) {
        items = billingData.items.filter(item => (item.departmentName || 'General') === activeService);
      } else {
        items = billingData.items;
      }
    }
    
    const unbilledItems = items.filter(item => item.paymentStatus !== 'paid');
    
    if (unbilledItems.length === 0) {
      if (canDischargeVisit) {
        await handleDischargeVisit();
        return;
      }
      toast.warning('All items are already billed');
      return;
    }
    
    try {
      // Group items by department
      const itemsByDept = unbilledItems.reduce<Record<string, typeof unbilledItems>>((acc, item) => {
        const deptId = item.departmentId || 'general';
        if (!acc[deptId]) acc[deptId] = [];
        acc[deptId].push(item);
        return acc;
      }, {});
      
      const billingItems = Object.entries(itemsByDept).map(([deptId, deptItems]) => ({
        departmentId: deptId,
        items: deptItems.map(item => ({
          itemType: item.type === 'action' ? 'ACTION' : 'CONSUMABLE',
          itemId: item.id,
          quantity: item.quantity,
          insuranceId: item.selectedInsuranceId,
        }))
      }));
      
      const input = {
        visitId: billingData.visitId,
        note: billingData.notes || undefined,
        globalDiscount: billingData.discountPercentage ? {
          type: 'PERCENTAGE' as const,
          value: billingData.discountPercentage
        } : undefined,
        billingItems
      };
      
      const response = await createBill(input);
      
      if (response.status === 'SUCCESS') {
        setBillJustCreated(true)
        // Refetch visit and bill data
        await refetchVisit();
        await refetchBill();
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
    if (!hasMultipleUnbilledServices && viewMode !== 'service') {
      setViewMode('service');
    }
  }, [billingData, activeService, unbilledServiceNames, allServiceNames, hasMultipleUnbilledServices, viewMode]);

  useEffect(() => {
    setBillJustCreated(false)
  }, [visitId])

  useEffect(() => {
    if (!autoPrint || didAutoPrint || !existingBill || !billingData) return
    setDidAutoPrint(true)
    // Small delay ensures print window content is ready after query hydration.
    const timer = setTimeout(() => {
      handlePrintBillingInvoice()
    }, 150)

    return () => clearTimeout(timer)
  }, [autoPrint, didAutoPrint, existingBill, billingData])

  const handlePrintBillingInvoice = () => {
    if (!billingData) return

    const escapeHtml = (value: string) =>
      value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')

    const invoiceItems = existingBill?.billingItems?.flatMap((billingItem) =>
      (billingItem.items || []).map((item) => ({
        description: item.name,
        quantity: item.quantity,
        unitPrice: item.basePriceAtBilling,
        lineTotal: item.finalAmountCharged,
      })),
    ) || billingData.items.map((item) => ({
      description: item.name,
      quantity: item.quantity,
      unitPrice: item.price,
      lineTotal: item.price * item.quantity,
    }))

    const totals = {
      subtotal: existingBill?.totals?.beforeDiscount ?? displayTotals.subtotal,
      discount: existingBill?.totals?.discount ?? displayTotals.discount,
      totalDue: existingBill?.totals?.patientTotalDue ?? displayTotals.totalAmount,
      paid: existingBill?.totals?.patientTotalPaid ?? (billingData.amountPaid || 0),
      balance: existingBill?.totals?.patientBalance ?? Math.max(0, displayTotals.totalAmount - (billingData.amountPaid || 0)),
    }

    const invoiceHtml = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Invoice ${escapeHtml(existingBill?.billingDisplayId || billingData.visitId || 'N/A')}</title>
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
          <p class="muted"><strong>Invoice #:</strong> ${escapeHtml(existingBill?.billingDisplayId || billingData.visitId || 'N/A')}</p>
          <p class="muted"><strong>Date:</strong> ${new Date(existingBill?.billedAt || billingData.updatedAt || new Date().toISOString()).toLocaleString()}</p>
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
          <p class="muted">Method: ${escapeHtml((billingData.paymentMethod || 'momo').toUpperCase())}</p>
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
    setDominantFirstName('');
    setDominantLastName('');
    setDominantPhone('');
  };

  const handleAddInsurance = async () => {
    if (!selectedInsuranceId || !visit) return;

    try {
      const dominantMember =
        dominantFirstName || dominantLastName || dominantPhone
          ? {
              firstName: dominantFirstName,
              lastName: dominantLastName,
              phone: dominantPhone,
            }
          : undefined;

      const patientInsurancePayload = [
        ...((visit.patient.insurances || []).map((ins) => ({
          insuranceId: Number(ins.insurance.id),
          insuranceCardNumber: ins.insuranceCardNumber || '',
        })) ?? []),
        {
          insuranceId: Number(selectedInsuranceId),
          insuranceCardNumber: insuranceCardNumber || '',
          dominantMember,
        },
      ];

      await updatePatient(visit.patient.id, {
        firstName: visit.patient.firstName,
        lastName: visit.patient.lastName,
        dateOfBirth: visit.patient.dateOfBirth,
        gender: visit.patient.gender,
        nationalId: (visit.patient as any)?.nationalId,
        notes: visit.patient.notes,
        insurances: patientInsurancePayload,
      });

      await refetchVisit();
      setShowAddInsuranceModal(false);
      resetAddInsuranceForm();
    } catch (err) {
      console.error('Failed to add insurance:', err);
    }
  };

  const handleAddInsuranceToVisit = async (insuranceId: string) => {
    if (!visitId) return;

    try {
      await addInsuranceToVisit({
        variables: {
          visitId,
          insuranceId,
        },
      });
      await refetchVisit();
    } catch (err) {
      console.error('Failed to add insurance to visit:', err);
    }
  };

  const handleAddActionConsumable = async (
    type: 'action' | 'consumable',
    item: { id: string; name: string; privatePrice: number },
    quantity: number,
    departmentId: string
  ) => {
    if (!visitId) return;
    try {
      setAddingBillingItem(true);
      if (type === 'action') {
        await addAction(visitId, departmentId, item.id, quantity);
      } else {
        await addConsumable(visitId, departmentId, item.id, quantity);
      }

      // Refetch the visit data - this will trigger the useEffect to update billingData and selection
      await refetchVisit();

      setShowAddActionConsumableModal(false);
      toast.success(`${type === 'action' ? 'Action' : 'Consumable'} added successfully`);
    } catch (err) {
      console.error('Failed to add billing item:', err);
      toast.error(`Failed to add ${type === 'action' ? 'action' : 'consumable'}`);
    } finally {
      setAddingBillingItem(false);
    }
  };

  if (!visitId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">No visit selected for billing.</p>
      </div>
    );
  }

  if (loading || loadingBill || !billingData) {
    return (
      <div className="min-h-screen bg-background">
        <Header doctor={doctor} />
        <div className="h-[calc(100vh-64px)] flex px-4 sm:px-6 lg:px-8 pt-6 gap-6 pb-24 overflow-hidden">
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl shadow-lg overflow-hidden flex flex-col p-4 space-y-4">
              <Skeleton className="h-10 w-40 rounded-full" />
              {[...Array(4)].map((_, idx) => (
                <div key={idx} className="bg-card/70 dark:bg-slate-900/60 border border-border/50 dark:border-slate-800 rounded-2xl p-4 space-y-3">
                  <Skeleton className="h-4 w-56" />
                  <div className="grid grid-cols-2 gap-3">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-80 hidden lg:flex flex-col gap-4 flex-shrink-0">
            <div className="bg-card/70 dark:bg-slate-900/70 border border-border/50 dark:border-slate-800 rounded-3xl p-5 shadow-lg space-y-3">
              <Skeleton className="h-4 w-32" />
              {[...Array(3)].map((_, idx) => (
                <Skeleton key={idx} className="h-3 w-full" />
              ))}
              <Skeleton className="h-10 w-full rounded-full" />
            </div>
            <div className="bg-card/70 dark:bg-slate-900/70 border border-border/50 dark:border-slate-800 rounded-3xl p-5 shadow-lg space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-background">
      <Header doctor={doctor} />
      <div className="h-[calc(100vh-64px)] flex px-4 sm:px-6 lg:px-8 pt-6 gap-6 pb-24 overflow-hidden">
        {/* Left Section: Billing Items Table - Scrollable */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* View Switch + Billing Items */}
          <div className="flex-1 bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl shadow-lg overflow-hidden flex flex-col">
            {viewMode === 'service' && (
              <div className="px-4 pt-3 pb-1 flex-shrink-0">
                <Tabs value={activeService} onValueChange={setActiveService}>
                  <TabsList>
                    {allServiceNames.map((dept) => (
                      <TabsTrigger key={dept} value={dept} className="rounded-full px-3">
                        {dept}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            )}

            <div className="p-4 flex-1 overflow-y-auto">
              <BillingItemsList
                items={itemsToDisplay}
                onItemChange={handleItemChange}
                onItemRemove={handleItemRemove}
                insuranceCoveragePercentage={effectiveCoverage}
                availableInsurances={billingData.insurances?.map(ins => ({
                  id: ins.id || ins.acronym,
                  name: ins.name,
                  acronym: ins.acronym,
                  coveragePercentage: ins.coveragePercentage
                }))}
                selectable={true}
                selectedItemIds={selectedItemIds}
                onSelectionToggle={handleSelectionToggle}
                hideDepartmentHeaders={viewMode === 'service'}
                allDepartments={viewMode === 'all' ? allServiceNames : []}
              />
            </div>
          </div>
        </div>

        {/* Right Section: Patient Info & Summary - Fixed */}
        <div className="w-80 flex flex-col gap-6 overflow-y-auto flex-shrink-0">
          {/* Patient Info Card */}
          <div className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-lg flex-shrink-0">
            <div className="space-y-2">
              <div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Name</p>
                <p className="text-base font-bold text-slate-900 dark:text-white">{billingData.patientName}</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Age</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{billingData.patientAge}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Gender</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{billingData.gender}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Visit Date</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{new Date(billingData.visitDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              {/* Insurance Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Patient Insurances</p>
                  <Button
                    onClick={() => setShowAddInsuranceModal(true)}
                    variant="ghost"
                    size="sm"
                    className="h-5 px-2 text-[10px] rounded-full"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </div>

                {patientInsurances.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {patientInsurances.map((pIns) => {
                      const inVisit = visitInsuranceIds.has(pIns.insurance.id);
                      return (
                        <label
                          key={pIns.id}
                          className="flex items-center gap-3 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1.5 w-full"
                        >
                          <input
                            type="checkbox"
                            checked={inVisit}
                            disabled={inVisit || addingVisitInsurance}
                            onChange={() => handleAddInsuranceToVisit(pIns.insurance.id)}
                            className="h-3.5 w-3.5 accent-slate-800"
                          />
                          <div className="grid grid-cols-2 items-center gap-2 w-full">
                            <span className="font-semibold text-primary">{pIns.insurance.acronym}</span>
                            <span className="text-slate-700 dark:text-slate-200 text-right">{pIns.insurance.coveragePercentage}%</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400">No insurances on patient record</p>
                )}
              </div>
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-lg flex-shrink-0">
            <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {viewMode === 'service' ? `${activeService} Summary` : 'Billing Summary'}
            </h3>
            
            {/* Billing Status Badge */}
            {existingBill && (
              <div className="mb-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 dark:text-slate-400">Bill Status:</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
                    Billed ({existingBill.billingDisplayId})
                  </span>
                </div>
              </div>
            )}
            
            <div className="space-y-1.5">
              {/* Already Billed Section */}
              {existingBill?.totals && (
                <>
                  <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-3 space-y-1 mb-2">
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">Previously Billed:</div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-600 dark:text-slate-400">Subtotal:</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{existingBill.totals.beforeDiscount.toLocaleString()} RWF</span>
                    </div>
                    {existingBill.totals.discount > 0 && (
                      <div className="flex justify-between text-red-600 dark:text-red-400">
                        <span className="text-xs">Discount:</span>
                        <span className="text-xs font-bold">-{existingBill.totals.discount.toLocaleString()} RWF</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-700">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Patient Due:</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{existingBill.totals.patientTotalDue.toLocaleString()} RWF</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Paid:</span>
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{existingBill.totals.patientTotalPaid.toLocaleString()} RWF</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Balance:</span>
                      <span className="text-xs font-bold text-orange-600 dark:text-orange-400">{existingBill.totals.patientBalance.toLocaleString()} RWF</span>
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">New Items to Bill:</div>
                </>
              )}

              <div className="flex justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">Subtotal:</span>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{displayTotals.subtotal.toLocaleString()} RWF</span>
              </div>
              {displayTotals.insuranceCoverage > 0 && (
                <div className="flex justify-between">
                  <span className="text-xs text-emerald-700 dark:text-emerald-400">Insurance Coverage:</span>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">-{displayTotals.insuranceCoverage.toLocaleString()} RWF</span>
                </div>
              )}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-1.5 flex justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Patient Responsibility:</span>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{displayTotals.patientResponsibility.toLocaleString()} RWF</span>
              </div>
              {displayTotals.discount > 0 && (
                <div className="flex justify-between text-red-600 dark:text-red-400">
                  <span className="text-xs">Discount:</span>
                  <span className="text-xs font-bold">-{displayTotals.discount.toLocaleString()} RWF</span>
                </div>
              )}

              {/* Total with Previous Bill */}
              {existingBill?.totals && (
                <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-3 space-y-1 mt-2 border-t-2 border-slate-300 dark:border-slate-600">
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">Total After This Bill:</div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-600 dark:text-slate-400">Combined Due:</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {(
                        (existingBill.totals.beforeDiscount + displayTotals.subtotal) -
                        (existingBill.totals.discount + displayTotals.discount)
                      ).toLocaleString()} RWF
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-600 dark:text-slate-400">Current Balance:</span>
                    <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                      {(
                        existingBill.totals.patientBalance + displayTotals.patientResponsibility - displayTotals.discount
                      ).toLocaleString()} RWF
                    </span>
                  </div>
                </div>
              )}

              {!existingBill && (
                <div className="mt-3 space-y-2 border-t border-slate-200 dark:border-slate-700 pt-3">
                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-600 dark:text-slate-400">Discount</span>
                        {!showDiscountControls ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-7 rounded-full text-xs"
                            onClick={() => {
                              setShowDiscountControls(true)
                              setDiscountInputType('PERCENTAGE')
                              setDiscountInputValue(Number(billingData.discountPercentage || 0))
                            }}
                          >
                            Apply Discount
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 rounded-full text-xs"
                            onClick={() => {
                              setShowDiscountControls(false)
                              setDiscountInputType('PERCENTAGE')
                              setDiscountInputValue(0)
                              handleDiscountChange(0)
                            }}
                          >
                            Remove
                          </Button>
                        )}
                      </div>

                      {showDiscountControls && (
                        <div className="mt-1 grid grid-cols-[140px_1fr] gap-2">
                          <Select
                            value={discountInputType}
                            onValueChange={(value) => {
                              const nextType = value as 'PERCENTAGE' | 'FIXED'
                              setDiscountInputType(nextType)

                              if (nextType === 'FIXED') {
                                const fixed = (displayTotals.patientResponsibility * (billingData.discountPercentage || 0)) / 100
                                setDiscountInputValue(Math.max(0, fixed))
                              } else {
                                setDiscountInputValue(Number(billingData.discountPercentage || 0))
                              }
                            }}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                              <SelectItem value="FIXED">Fixed (RWF)</SelectItem>
                            </SelectContent>
                          </Select>

                          <Input
                            type="number"
                            min={0}
                            max={discountInputType === 'PERCENTAGE' ? 100 : Math.max(0, displayTotals.patientResponsibility)}
                            value={discountInputValue}
                            onChange={(e) => {
                              const rawValue = Math.max(0, Number(e.target.value || 0))
                              setDiscountInputValue(rawValue)

                              if (discountInputType === 'PERCENTAGE') {
                                handleDiscountChange(Math.min(100, rawValue))
                              } else {
                                const cappedAmount = Math.min(rawValue, Math.max(0, displayTotals.patientResponsibility))
                                const percent = displayTotals.patientResponsibility > 0
                                  ? (cappedAmount / displayTotals.patientResponsibility) * 100
                                  : 0
                                handleDiscountChange(percent)
                              }
                            }}
                            className="h-9"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <span className="text-xs text-slate-600 dark:text-slate-400">Payment Method</span>
                      <Select
                        value={billingData.paymentMethod && billingData.paymentMethod !== 'pending' ? billingData.paymentMethod : 'momo'}
                        onValueChange={(value) =>
                          handlePaymentMethodChange(value as 'cash' | 'momo' | 'airtel-money')
                        }
                      >
                        <SelectTrigger className="mt-1 h-9">
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="momo">MoMo</SelectItem>
                          <SelectItem value="airtel-money">Airtel Money</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <span className="text-xs text-slate-600 dark:text-slate-400">Amount Paid</span>
                      <Input
                        type="number"
                        min={0}
                        value={billingData.amountPaid || 0}
                        onChange={(e) => handleAmountPaidChange(Math.max(0, Number(e.target.value || 0)))}
                        className="mt-1 h-9"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-xs text-slate-600 dark:text-slate-400">Amount entered as paid:</span>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      {(billingData.amountPaid || 0).toLocaleString()} RWF
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-600 dark:text-slate-400">Estimated remaining:</span>
                    <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                      {Math.max(0, displayTotals.totalAmount - (billingData.amountPaid || 0)).toLocaleString()} RWF
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
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
            <DialogTitle className="text-base">Add insurance to patient</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Select an insurance, optionally add the card number and dominant member details.
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
              <p className="text-[11px] text-muted-foreground">Insurance Card Number (optional)</p>
              <Input
                value={insuranceCardNumber}
                onChange={(e) => setInsuranceCardNumber(e.target.value)}
                placeholder="Card number"
              />
            </div>

            <div className="space-y-1">
              <p className="text-[11px] text-muted-foreground">Dominant Member (optional)</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input
                  value={dominantFirstName}
                  onChange={(e) => setDominantFirstName(e.target.value)}
                  placeholder="First name"
                />
                <Input
                  value={dominantLastName}
                  onChange={(e) => setDominantLastName(e.target.value)}
                  placeholder="Last name"
                />
              </div>
              <Input
                value={dominantPhone}
                onChange={(e) => setDominantPhone(e.target.value)}
                placeholder="Phone"
              />
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
            <Button onClick={handleAddInsurance} disabled={!selectedInsuranceId}>
              Add to Patient
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

          {/* Floating Dock at Bottom (glassy pill) */}
      {showBillingDock && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
              <div className="glass-gray rounded-full shadow-xl px-2 py-2 flex items-center justify-center gap-2">
                <TooltipProvider>
                  <div className="flex items-center gap-2">
                    {/* Add Action/Consumable */}
                    {!canEditBilling && hasRemainingToBill && (
                      <>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={() => setShowAddActionConsumableModal(true)}
                              size="icon"
                              className="rounded-full h-12 w-12 border-2 border-white/30 bg-transparent text-white/90 hover:bg-blue-600 hover:text-white shadow-lg"
                              aria-label="Add Action or Consumable"
                            >
                              <Plus className="h-5 w-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Add Action or Consumable</p>
                          </TooltipContent>
                        </Tooltip>
                        <div className="w-px h-6 bg-white/20" />
                      </>
                    )}

                    {/* View Toggle (only if multiple unbilled services) */}
                    {!canEditBilling && hasRemainingToBill && hasMultipleUnbilledServices && (
                      <>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              className="rounded-full h-12 w-12 border-2 border-white/30 bg-transparent text-white/90 hover:bg-blue-600 hover:text-white shadow-lg"
                              onClick={() => setViewMode(viewMode === 'service' ? 'all' : 'service')}
                              aria-label={viewMode === 'service' ? 'Switch to All Items' : 'Switch to Service View'}
                            >
                              {viewMode === 'service' ? (
                                <List className="h-5 w-5" />
                              ) : (
                                <Layers className="h-5 w-5" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{viewMode === 'service' ? 'Switch to All Items' : 'Switch to Service View'}</p>
                          </TooltipContent>
                        </Tooltip>
                        <div className="w-px h-6 bg-white/20" />
                      </>
                    )}

                    {/* Exemptions Button - only visible if there are exemptions */}
                    {!canEditBilling && hasRemainingToBill && exemptionCount > 0 && (
                      <>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="relative">
                              <Button
                                onClick={() => setShowExemptionsWindow(true)}
                                size="icon"
                                className="rounded-full h-12 w-12 border-2 border-white/30 bg-transparent text-white/90 hover:bg-purple-600 hover:text-white shadow-lg"
                                aria-label="Manage Exemptions"
                              >
                                <span className="text-xl leading-none">⊖</span>
                              </Button>
                              <span className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold border-2 border-[#4A4A4A]">
                                {exemptionCount}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Manage Exemptions ({exemptionCount})</p>
                          </TooltipContent>
                        </Tooltip>
                        <div className="w-px h-6 bg-white/20" />
                      </>
                    )}

                    {!canEditBilling && hasRemainingToBill && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => setShowCompleteBillConfirm(true)}
                            size="icon"
                            disabled={creatingBill}
                            className="rounded-full h-12 w-12 bg-[#FF6900] hover:bg-[#e05f00] text-white shadow-lg disabled:opacity-50"
                            aria-label="Complete Bill"
                          >
                            <Receipt className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{creatingBill ? 'Creating bill...' : 'Complete Bill'}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}

                    {canEditBilling && (
                      <>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={() => {
                                setShowDiscountControls(true)
                              }}
                              size="icon"
                              className="rounded-full h-12 w-12 bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                              aria-label="Edit Billing"
                            >
                              <Pencil className="h-5 w-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit Billing</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={handlePrintBillingInvoice}
                              size="icon"
                              className="rounded-full h-12 w-12 bg-slate-700 hover:bg-slate-800 text-white shadow-lg"
                              aria-label="Print Billing"
                            >
                              <Printer className="h-5 w-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Print Billing (PDF)</p>
                          </TooltipContent>
                        </Tooltip>
                      </>
                    )}
                  </div>
                </TooltipProvider>
        </div>
      </div>
      )}

          {/* Removed separate bottom-left buttons; consolidated into center pill */}

      {/* Complete Bill Confirmation */}
      <Dialog open={showCompleteBillConfirm} onOpenChange={setShowCompleteBillConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Bill Completion</DialogTitle>
            <DialogDescription>
              Review billing summary before completing this bill.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Patient Responsibility:</span>
              <span className="font-semibold">{displayTotals.patientResponsibility.toLocaleString()} RWF</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Discount:</span>
              <span className="font-semibold">{(displayTotals.discount || 0).toLocaleString()} RWF</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Due:</span>
              <span className="font-semibold">{displayTotals.totalAmount.toLocaleString()} RWF</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount Paid:</span>
              <span className="font-semibold">{(billingData?.amountPaid || 0).toLocaleString()} RWF</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method:</span>
              <span className="font-semibold uppercase">{billingData?.paymentMethod || 'pending'}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-muted-foreground">Remaining:</span>
              <span className="font-semibold text-orange-600 dark:text-orange-400">
                {Math.max(0, displayTotals.totalAmount - (billingData?.amountPaid || 0)).toLocaleString()} RWF
              </span>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setShowCompleteBillConfirm(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              disabled={creatingBill}
              onClick={async () => {
                setShowCompleteBillConfirm(false)
                await handleGenerateBill()
              }}
            >
              {creatingBill ? 'Completing...' : 'Confirm Complete Bill'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

        {/* Add Action/Consumable Modal */}
        <AddActionConsumableModal
          isOpen={showAddActionConsumableModal}
          onClose={() => setShowAddActionConsumableModal(false)}
          departments={allServiceNames.map((deptName) => {
            const deptId = visit?.departments?.find(d => (d.department?.name || 'General') === deptName)?.department?.id;
            return { id: deptId || deptName, name: deptName };
          })}
          currentDepartmentId={
            viewMode === 'service'
              ? visit?.departments?.find((dept) => (dept.department?.name || 'General') === activeService)?.department?.id
              : undefined
          }
          viewMode={viewMode}
          onAdd={handleAddActionConsumable}
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
