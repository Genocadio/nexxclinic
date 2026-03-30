'use client';

import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { BillingData } from '@/lib/billing-utils';
import Image from 'next/image';

interface PaymentSummaryModalProps {
  billingData: BillingData;
  totals: {
    subtotal: number;
    insuranceCoverage: number;
    patientResponsibility: number;
    discount: number;
    totalAmount: number;
  };
  onDiscountChange: (discount: number) => void;
  onPaymentMethodChange: (method: 'cash' | 'momo' | 'airtel-money' | 'pending') => void;
  onAmountPaidChange: (amount: number) => void;
  onNotesChange: (notes: string) => void;
  onClose: () => void;
}

export default function PaymentSummaryModal({
  billingData,
  totals,
  onDiscountChange,
  onPaymentMethodChange,
  onAmountPaidChange,
  onNotesChange,
  onClose,
}: PaymentSummaryModalProps) {
  const [discountType, setDiscountType] = useState<'percentage' | 'amount'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(billingData.discountPercentage);
  const [localAmountPaid, setLocalAmountPaid] = useState<number>(billingData.amountPaid || totals.totalAmount);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'momo' | 'airtel-money' | 'pending'>(
    (billingData.paymentMethod as any) || 'pending'
  );
  const [notes, setNotes] = useState(billingData.notes || '');
  const [showDiscountSection, setShowDiscountSection] = useState(billingData.discountPercentage > 0);

  const paymentMethods = [
    { id: 'cash', name: 'Cash', icon: 'cash' },
    { id: 'momo', name: 'MoMo', icon: 'mtn' },
    { id: 'airtel-money', name: 'Airtel Money', icon: 'airtel' },
  ];

  const calculateFinalDiscount = () => {
    if (discountType === 'percentage') {
      return (totals.patientResponsibility * discountValue) / 100;
    }
    return Math.min(discountValue, totals.patientResponsibility);
  };

  const finalDiscount = calculateFinalDiscount();
  const finalTotal = Math.max(0, totals.totalAmount - finalDiscount);
  const remainingBalance = Math.max(0, finalTotal - localAmountPaid);

  const handleSave = () => {
    onDiscountChange(discountType === 'percentage' ? discountValue : (finalDiscount / totals.patientResponsibility) * 100);
    onPaymentMethodChange(paymentMethod);
    onAmountPaidChange(localAmountPaid);
    onNotesChange(notes);
    onClose();
  };

  const getPaymentStatus = () => {
    if (finalTotal === 0) return 'full';
    if (localAmountPaid >= finalTotal) return 'full';
    if (localAmountPaid > 0) return 'partial';
    return 'pending';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Payment Summary</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-slate-900 dark:text-slate-100" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Billing Summary */}
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 space-y-3 border border-slate-200 dark:border-slate-600">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Billing Breakdown</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Subtotal:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{totals.subtotal.toLocaleString()} RWF</span>
              </div>
              {totals.insuranceCoverage > 0 && (
                <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
                  <span>Insurance Coverage:</span>
                  <span className="font-semibold">-{totals.insuranceCoverage.toLocaleString()} RWF</span>
                </div>
              )}
              <div className="border-t border-slate-200 dark:border-slate-600 pt-2 flex justify-between font-bold">
                <span className="text-slate-900 dark:text-white">Patient Responsibility:</span>
                <span className="text-primary">{totals.patientResponsibility.toLocaleString()} RWF</span>
              </div>
            </div>
          </div>

          {/* Discount Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-bold text-slate-900 dark:text-white">Apply Discount</Label>
              <button
                onClick={() => {
                  setShowDiscountSection(!showDiscountSection);
                  if (!showDiscountSection) {
                    setDiscountValue(0);
                  }
                }}
                className="text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                {showDiscountSection ? 'Hide' : 'Add'}
              </button>
            </div>

            {showDiscountSection && (
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 space-y-3 border border-slate-200 dark:border-slate-600">
                <div className="flex gap-2">
                  <Button
                    onClick={() => setDiscountType('percentage')}
                    variant={discountType === 'percentage' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1 rounded-full text-xs"
                  >
                    Percentage
                  </Button>
                  <Button
                    onClick={() => setDiscountType('amount')}
                    variant={discountType === 'amount' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1 rounded-full text-xs"
                  >
                    Amount
                  </Button>
                </div>

                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label className="text-xs text-slate-600 dark:text-slate-400">Value</Label>
                    <Input
                      type="number"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(Math.max(0, parseFloat(e.target.value) || 0))}
                      min="0"
                      max={discountType === 'percentage' ? 100 : totals.patientResponsibility}
                      className="rounded-lg text-sm"
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white pb-2">
                    {discountType === 'percentage' ? '%' : 'RWF'}
                  </span>
                </div>

                {finalDiscount > 0 && (
                  <div className="bg-white dark:bg-slate-700 rounded-lg p-3 border border-red-200 dark:border-red-800">
                    <p className="text-xs text-slate-600 dark:text-slate-400">Discount Amount</p>
                    <p className="text-lg font-bold text-red-600 dark:text-red-400">-{finalDiscount.toLocaleString()} RWF</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="space-y-3">
            <Label className="text-sm font-bold text-slate-900 dark:text-white">Payment Method</Label>
            <div className="grid grid-cols-3 gap-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                    paymentMethod === method.id
                      ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/30'
                      : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'
                  }`}
                >
                  <div className="w-8 h-8">
                    <Image
                      src={
                        method.icon === 'mtn'
                          ? '/mtn-icon.svg'
                          : method.icon === 'airtel'
                            ? '/airtel-icon.png'
                            : '/cash-icon.svg'
                      }
                      alt={method.name}
                      width={32}
                      height={32}
                      className="rounded"
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">{method.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Amount Paid */}
          <div className="space-y-3">
            <Label className="text-sm font-bold text-slate-900 dark:text-white">Amount to Collect</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-100 dark:bg-slate-700 rounded-xl p-4 border border-slate-200 dark:border-slate-600">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total Due</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{finalTotal.toLocaleString()} RWF</p>
              </div>
              <div>
                <Label className="text-xs text-slate-600 dark:text-slate-400">Amount Paid</Label>
                <Input
                  type="number"
                  value={localAmountPaid}
                  onChange={(e) => setLocalAmountPaid(Math.max(0, parseFloat(e.target.value) || 0))}
                  min="0"
                  max={finalTotal}
                  className="rounded-xl text-lg font-bold mt-1"
                />
              </div>
            </div>

            {/* Payment Status */}
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-200 dark:border-slate-600">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white">Payment Status</span>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    getPaymentStatus() === 'full'
                      ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200'
                      : getPaymentStatus() === 'partial'
                        ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200'
                        : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200'
                  }`}
                >
                  {getPaymentStatus() === 'full'
                    ? 'Fully Paid'
                    : getPaymentStatus() === 'partial'
                      ? 'Partially Paid'
                      : 'Not Paid'}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Paid: <span className="font-bold text-slate-900 dark:text-white">{localAmountPaid.toLocaleString()} RWF</span>
              </p>
              {remainingBalance > 0 && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Balance Due: <span className="font-bold text-red-600 dark:text-red-400">{remainingBalance.toLocaleString()} RWF</span>
                </p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-3">
            <Label className="text-sm font-bold text-slate-900 dark:text-white">Additional Notes</Label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any special notes about this billing..."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 rounded-full py-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 rounded-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Save & Complete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
