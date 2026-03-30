'use client';

import { Fragment, useMemo, useState } from 'react';
import { AlertCircle, Check, Edit2, Trash2, X } from 'lucide-react';
import { BillingItem, calculateItemTotal } from '@/lib/billing-utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

type InsuranceOption = {
  id?: string;
  name: string;
  acronym: string;
  coveragePercentage: number;
};

type BillingItemsListProps = {
  items: BillingItem[];
  onItemChange: (item: BillingItem) => void;
  onItemRemove: (itemId: string) => void;
  insuranceCoveragePercentage?: number;
  availableInsurances?: InsuranceOption[];
  selectable?: boolean;
  selectedItemIds?: string[];
  onSelectionToggle?: (itemId: string, checked: boolean) => void;
  hideDepartmentHeaders?: boolean;
  allDepartments?: string[]; // All departments to show, even if they have 0 items
};

const getPaymentStatusColor = (status: BillingItem['paymentStatus'] | 'exempted') => {
  switch (status) {
    case 'paid':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:border-emerald-800';
    case 'partial':
      return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-800';
    case 'exempted':
      return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-800';
    case 'pending':
    default:
      return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-800';
  }
};

export function BillingItemsList({
  items,
  onItemChange,
  onItemRemove,
  insuranceCoveragePercentage,
  availableInsurances = [],
  selectable = false,
  selectedItemIds = [],
  onSelectionToggle,
  hideDepartmentHeaders = false,
  allDepartments = [],
}: BillingItemsListProps) {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>('');

  const groupedItems = useMemo(() => {
    const grouped = items.reduce<Record<string, BillingItem[]>>((acc, item) => {
      const deptName = item.departmentName || 'General';
      if (!acc[deptName]) acc[deptName] = [];
      acc[deptName].push(item);
      return acc;
    }, {});
    
    // Add empty departments if allDepartments is provided
    if (allDepartments.length > 0) {
      allDepartments.forEach(dept => {
        if (!grouped[dept]) {
          grouped[dept] = [];
        }
      });
    }
    
    return grouped;
  }, [items, allDepartments]);

  const totalAmount = useMemo(
    () => items.reduce((sum, item) => sum + calculateItemTotal(item), 0),
    [items]
  );

  const handleEditPrice = (item: BillingItem) => {
    setEditingItemId(item.id);
    setEditPrice(String(item.price));
  };

  const handleSavePrice = (item: BillingItem) => {
    const parsedPrice = parseInt(editPrice, 10);
    if (Number.isNaN(parsedPrice)) {
      setEditingItemId(null);
      return;
    }
    onItemChange({ ...item, price: parsedPrice });
    setEditingItemId(null);
  };

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-300 uppercase text-xs font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                {selectable && (
                  <th className="py-3 px-4 text-center w-12">
                    <Checkbox
                      checked={items.length > 0 && items.every(item => selectedItemIds?.includes(item.id))}
                      onCheckedChange={(checked) => {
                        items.forEach(item => onSelectionToggle && onSelectionToggle(item.id, Boolean(checked)));
                      }}
                      aria-label="Select all items"
                    />
                  </th>
                )}
                <th className="py-3 px-4 text-left">Item</th>
                <th className="py-3 px-4 text-center">Type</th>
                <th className="py-3 px-4 text-center">Qty</th>
                <th className="py-3 px-4 text-left">Unit Price</th>
                <th className="py-3 px-4 text-left">Insurance</th>
                <th className="py-3 px-4 text-right">Patient Share</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody suppressHydrationWarning>
              {items.length === 0 && allDepartments.length === 0 ? (
                <tr>
                  <td colSpan={selectable ? 10 : 9} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                      <AlertCircle className="h-10 w-10 mb-2 opacity-50" />
                      <p>No items added yet</p>
                    </div>
                  </td>
                </tr>
              ) : (
                Object.entries(groupedItems).map(([deptName, deptItems], index) => {
                const meta = deptItems[0];
                const completedTime = meta?.departmentCompletedTime;
                const statusLabel = completedTime ? 'Completed' : 'In progress';
                const completedDisplay = completedTime
                  ? new Date(completedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : null;

                return (
                  <Fragment key={`${deptName}-${index}`}>
                    {!hideDepartmentHeaders && (
                      <tr className="bg-blue-50/50 dark:bg-blue-900/20 border-b border-slate-200 dark:border-slate-700">
                        <td colSpan={selectable ? 10 : 9} className="py-3 px-4 text-sm font-bold text-slate-800 dark:text-slate-200">
                          <div className="flex items-center justify-between gap-3">
                            <span>{deptName}</span>
                            <span className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                              <Badge variant="outline" className="text-[10px] px-2 py-0.5 rounded-full">
                                {statusLabel}
                              </Badge>
                              {completedDisplay && <span className="text-xs">Completed at {completedDisplay}</span>}
                            </span>
                          </div>
                        </td>
                      </tr>
                    )}
                    {deptItems.length === 0 ? (
                      <tr>
                        <td colSpan={selectable ? 10 : 9} className="py-6 text-center text-sm text-slate-500 dark:text-slate-400 italic">
                          No items in this department
                        </td>
                      </tr>
                    ) : (
                      deptItems.map((item) => {
                    const itemTotal = calculateItemTotal(item);
                    const exemptionType = item.exemptionType || (item.exempted ? 'full' : 'none');
                    const isExempted = exemptionType !== 'none';

                    const selectedInsurance = availableInsurances.find(
                      (ins) => (ins.id || ins.acronym) === item.selectedInsuranceId
                    );
                    const itemCoverage = selectedInsurance?.coveragePercentage || 0;
                    const patientShare = Math.round(itemTotal * ((100 - itemCoverage) / 100));
                    const displayedPatientShare =
                      exemptionType === 'full'
                        ? 0
                        : exemptionType === 'patient-share'
                          ? 0
                          : patientShare;
                    const statusLabel =
                      exemptionType === 'full'
                        ? 'Exempted'
                        : exemptionType === 'patient-share'
                          ? 'Patient Share Waived'
                          : item.paymentStatus;

                    return (
                      <tr
                        key={item.id}
                        suppressHydrationWarning
                        className={`border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                          isExempted ? 'bg-purple-50/30 dark:bg-purple-900/10' : ''
                        }`}
                      >
                        {selectable && (
                          <td className="py-3 px-4 text-center">
                            <Checkbox
                              checked={selectedItemIds.includes(item.id)}
                              onCheckedChange={(checked) => onSelectionToggle && onSelectionToggle(item.id, Boolean(checked))}
                              disabled={item.paymentStatus === 'paid'}
                              aria-label="Select item to bill"
                              className="size-5 border-2 border-slate-400 dark:border-slate-500"
                            />
                          </td>
                        )}
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-900 dark:text-white text-sm">{item.name}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {item.doneBy.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge 
                            variant="outline" 
                            className={`text-[10px] px-2 py-0.5 rounded-full ${
                              item.type === 'action' 
                                ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-200' 
                                : 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200'
                            }`}
                          >
                            {item.type === 'action' ? 'Action' : 'Consumable'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center text-slate-900 dark:text-white font-medium">
                          {item.quantity}
                        </td>
                        <td className="py-3 px-4">
                            {editingItemId === item.id ? (
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  value={editPrice}
                                  onChange={(e) => setEditPrice(e.target.value)}
                                  className="w-24 h-8 text-right rounded-lg"
                                  autoFocus
                                />
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleSavePrice(item)}
                                  className="h-8 w-8 p-0 rounded-lg"
                                >
                                  <Check className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setEditingItemId(null)}
                                  className="h-8 w-8 p-0 rounded-lg"
                                >
                                  <X className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-right text-slate-900 dark:text-white font-medium text-sm">
                                  {item.price.toLocaleString()} RWF
                                </span>
                                {item.paymentStatus !== 'paid' && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleEditPrice(item)}
                                    className="h-6 w-6 p-0 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900"
                                  >
                                    <Edit2 className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                  </Button>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4" suppressHydrationWarning>
                            <Select
                              value={item.selectedInsuranceId || 'none'}
                              onValueChange={(value) => {
                                onItemChange({
                                  ...item,
                                  selectedInsuranceId: value === 'none' ? undefined : value,
                                });
                              }}
                              disabled={availableInsurances.length === 0 || item.paymentStatus === 'paid'}
                            >
                              <SelectTrigger className="h-8 text-xs rounded-lg" suppressHydrationWarning disabled={availableInsurances.length === 0 || item.paymentStatus === 'paid'}>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No Insurance</SelectItem>
                              {availableInsurances.map((insurance) => (
                                <SelectItem key={insurance.id || insurance.acronym} value={insurance.id || insurance.acronym}>
                                  {insurance.acronym} ({insurance.coveragePercentage}%)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="py-3 px-4 text-right text-slate-900 dark:text-white font-semibold">
                          <span className={itemCoverage > 0 ? 'text-green-600 dark:text-green-400' : ''}>
                            {displayedPatientShare.toLocaleString()} RWF
                          </span>
                          {itemCoverage > 0 && (
                            <span className="block text-xs text-slate-500 dark:text-slate-400">
                              {exemptionType === 'patient-share'
                                ? '(Patient share waived)'
                                : `(Coverage: ${itemCoverage}%)`}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right text-slate-900 dark:text-white font-bold text-sm">
                          {itemTotal.toLocaleString()} RWF
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <Badge
                              variant="outline"
                              className={`${getPaymentStatusColor(isExempted ? 'exempted' : item.paymentStatus)} rounded-full text-xs`}
                            >
                              {statusLabel}
                            </Badge>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <Select
                              value={exemptionType}
                              onValueChange={(value) => {
                                const updated = { ...item, exemptionType: value as typeof item.exemptionType };
                                updated.exempted = value !== 'none';
                                if (value === 'none') {
                                  updated.exemptionReason = undefined;
                                  updated.paymentStatus =
                                    item.paymentStatus === 'exempted' ? 'pending' : item.paymentStatus;
                                } else {
                                  updated.paymentStatus = 'exempted';
                                }
                                onItemChange(updated);
                              }}
                              disabled={item.paymentStatus === 'paid'}
                            >
                              <SelectTrigger className="h-8 text-xs w-44 rounded-lg">
                                <SelectValue placeholder="Exemption" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">No exemption</SelectItem>
                                {availableInsurances.length > 0 && (
                                  <SelectItem value="patient-share">Waive patient share (insurance pays)</SelectItem>
                                )}
                                <SelectItem value="full">Full exemption</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onItemRemove(item.id)}
                              disabled={item.paymentStatus === 'paid'}
                              className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg disabled:opacity-30"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                  )}
                  </Fragment>
                );
              })
              )}
            </tbody>
          </table>
        </div>
    </>
  );
}
