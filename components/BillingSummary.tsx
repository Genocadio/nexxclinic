'use client';

import { SelectItem } from "@/components/ui/select"

import { SelectContent } from "@/components/ui/select"

import { SelectValue } from "@/components/ui/select"

import { SelectTrigger } from "@/components/ui/select"

import { Select } from "@/components/ui/select"

import { useState } from 'react';
import {
  calculateSubtotal,
  calculateInsuranceCoverage,
  calculatePatientResponsibility,
  calculateDiscount,
  calculateTotalAfterDiscount,
  convertDiscountAmountToPercentage,
  BillingItem,
} from '@/lib/billing-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface BillingSummaryProps {
  items: BillingItem[];
  discountPercentage: number;
  onDiscountChange: (discount: number) => void;
  subtotal: number;
  insuranceCoverage: number;
  patientResponsibility: number;
  availableInsurances?: { id: string; name: string; acronym: string; coveragePercentage: number }[];
}

export function BillingSummary({
  items,
  discountPercentage,
  onDiscountChange,
  subtotal,
  insuranceCoverage,
  patientResponsibility,
  availableInsurances = [],
}: BillingSummaryProps) {
  const [showDiscount, setShowDiscount] = useState(false);
  const [discountType, setDiscountType] = useState<'percentage' | 'amount'>('percentage');
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  const exemptedTotal = items.reduce((total, item) => {
    const exemption = item.exemptionType || (item.exempted ? 'full' : 'none');
    if (exemption === 'none') return total;

    const itemTotal = item.quantity * item.price;
    const selectedInsurance = availableInsurances.find(ins => ins.id === item.selectedInsuranceId);
    const coveragePct = selectedInsurance?.coveragePercentage || 0;
    const coverageAmount = (itemTotal * coveragePct) / 100;
    const patientPortion = itemTotal - coverageAmount;

    if (exemption === 'full') return total + itemTotal;
    return total + patientPortion;
  }, 0);
  
  // Calculate insurance breakdown by type
  const insuranceBreakdown = availableInsurances.map(insurance => {
    let coverage = 0;
    items.forEach(item => {
      const exemption = item.exemptionType || (item.exempted ? 'full' : 'none');
      if (exemption === 'full') return;
      if (item.selectedInsuranceId === insurance.id) {
        const itemTotal = item.quantity * item.price;
        coverage += (itemTotal * insurance.coveragePercentage) / 100;
      }
    });
    return { ...insurance, coverage };
  }).filter(ins => ins.coverage > 0);
  
  // Count items with no insurance
  const privateItemsCount = items.filter(item => {
    const exemption = item.exemptionType || (item.exempted ? 'full' : 'none');
    return exemption !== 'full' && !item.selectedInsuranceId;
  }).length;

  // Determine which discount to use
  let finalDiscountAmount = 0;
  let finalDiscountPercentage = discountPercentage;

  if (discountType === 'amount') {
    finalDiscountAmount = discountAmount;
    finalDiscountPercentage = convertDiscountAmountToPercentage(
      discountAmount,
      patientResponsibility
    );
  } else {
    finalDiscountAmount = calculateDiscount(patientResponsibility, discountPercentage);
    finalDiscountPercentage = discountPercentage;
  }

  const totalAfterDiscount = Math.max(
    0,
    patientResponsibility - finalDiscountAmount
  );
  const discount = finalDiscountAmount; // Declare the discount variable

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
      <CardHeader className="py-2">
        <CardTitle className="text-sm">Billing Summary</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="space-y-2 pb-3 border-b border-slate-200 dark:border-slate-700">
          <div className="flex justify-between text-slate-700 dark:text-slate-300 text-xs">
            <span>Subtotal (Non-Exempted):</span>
            <span className="font-semibold">{subtotal.toLocaleString()} RWF</span>
          </div>

          {exemptedTotal > 0 && (
            <div className="flex justify-between text-purple-700 dark:text-purple-400 text-xs">
              <span>Exempted Items:</span>
              <span className="font-semibold">{exemptedTotal.toLocaleString()} RWF</span>
            </div>
          )}

          {insuranceBreakdown.length > 0 && (
            <>
              {insuranceBreakdown.map(insurance => (
                <div key={insurance.id} className="flex justify-between text-green-700 dark:text-green-400 text-xs">
                  <span>{insurance.acronym} Coverage ({insurance.coveragePercentage}%):</span>
                  <span className="font-semibold">
                    -{Math.round(insurance.coverage).toLocaleString()} RWF
                  </span>
                </div>
              ))}
              
              <div className="flex justify-between text-green-700 dark:text-green-400 font-semibold text-xs">
                <span>Total Insurance Coverage:</span>
                <span>
                  -{Math.round(insuranceCoverage).toLocaleString()} RWF
                </span>
              </div>
            </>
          )}
          
          {privateItemsCount > 0 && (
            <div className="flex justify-between text-slate-600 dark:text-slate-400 text-xs">
              <span>Private Items (No Insurance):</span>
              <span className="font-semibold">{privateItemsCount} item{privateItemsCount !== 1 ? 's' : ''}</span>
            </div>
          )}

          {(insuranceCoverage > 0 || privateItemsCount > 0) && (
            <div className="flex justify-between text-blue-700 dark:text-blue-400 font-semibold text-sm">
              <span>Patient Responsibility:</span>
              <span>{Math.round(patientResponsibility).toLocaleString()} RWF</span>
            </div>
          )}
        </div>

        {/* Add Discount Button */}
        {!showDiscount && finalDiscountAmount === 0 && (
          <div className="pb-4 border-b border-slate-200 dark:border-slate-700">
            <Button
              onClick={() => setShowDiscount(true)}
              variant="outline"
              className="w-full"
            >
              + Add Discount
            </Button>
          </div>
        )}

        {/* Discount Section - Only shown when active */}
        {(showDiscount || finalDiscountAmount > 0) && (
          <div className="space-y-2 pb-3 border-b border-slate-200 dark:border-slate-700">
            <div className="flex gap-2">
              <Button
                onClick={() => setDiscountType('percentage')}
                variant={discountType === 'percentage' ? 'default' : 'outline'}
                className={`flex-1 transition-all text-xs ${
                  discountType === 'percentage'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : ''
                }`}
              >
                Percentage (%)
              </Button>
              <Button
                onClick={() => setDiscountType('amount')}
                variant={discountType === 'amount' ? 'default' : 'outline'}
                className={`flex-1 transition-all text-xs ${
                  discountType === 'amount'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : ''
                }`}
              >
                Amount (RWF)
              </Button>
              <Button
                onClick={() => {
                  setShowDiscount(false);
                  onDiscountChange(0);
                  setDiscountAmount(0);
                }}
                variant="outline"
                className="px-3"
              >
                ✕
              </Button>
            </div>

            <div className="flex items-end gap-4">
              <div className="flex-1">
                <Label htmlFor="discount" className="text-xs font-semibold">
                  {discountType === 'percentage' ? 'Discount %' : 'Discount Amount (RWF)'}
                </Label>
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    max={discountType === 'percentage' ? '100' : patientResponsibility}
                    value={
                      discountType === 'percentage'
                        ? discountPercentage
                        : discountAmount
                    }
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      if (discountType === 'percentage') {
                        onDiscountChange(value);
                      } else {
                        setDiscountAmount(Math.min(value, patientResponsibility));
                      }
                    }}
                    className="bg-white dark:bg-slate-800 h-8 text-sm"
                  />
                  <span className="text-sm font-medium">
                    {discountType === 'percentage' ? '%' : 'RWF'}
                  </span>
                </div>
              </div>
              {finalDiscountAmount > 0 && (
                <div className="text-right pb-1">
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Discount ({finalDiscountPercentage.toFixed(1)}%):
                  </p>
                  <p className="text-base font-bold text-red-600 dark:text-red-400">
                    -{finalDiscountAmount.toLocaleString()} RWF
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {finalDiscountAmount > 0 && (
          <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-blue-200 dark:border-blue-700">
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
              Total Amount Due
            </p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {totalAfterDiscount.toLocaleString()} RWF
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Subtotal: {patientResponsibility.toLocaleString()} RWF - Discount: {finalDiscountAmount.toLocaleString()} RWF ({finalDiscountPercentage.toFixed(1)}%)
            </p>
          </div>
        )}

        {totalAfterDiscount === 0 && exemptedTotal > 0 && (
          <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-700 p-3 rounded-lg">
            <p className="text-sm font-semibold text-green-700 dark:text-green-400">
              ✓ All items exempted. Patient owes nothing.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
