'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Printer, MessageSquare, X, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  calculateSubtotal,
  calculateDiscount,
  convertDiscountAmountToPercentage,
  calculatePaymentStatus,
  calculateRemainingBalance,
  isFullyPaid,
  isHalfPaid,
  BillingItem,
} from '@/lib/billing-utils';

interface BillingPaymentSummaryProps {
  items: BillingItem[];
  discountPercentage: number;
  onDiscountChange: (discount: number) => void;
  subtotal: number;
  insuranceCoverage: number;
  patientResponsibility: number;
  totalAmount: number;
  availableInsurances?: { id: string; name: string; acronym: string; coveragePercentage: number }[];
  onPaymentMethodChange: (method: 'cash' | 'momo' | 'airtel-money' | 'pending') => void;
  paymentMethod?: 'cash' | 'momo' | 'airtel-money' | 'pending';
  onAmountPaidChange?: (amount: number) => void;
  amountPaid?: number;
  notes?: string;
  onNotesChange?: (notes: string) => void;
  onPrint: () => void;
}

export function BillingPaymentSummary({
  items,
  discountPercentage,
  onDiscountChange,
  subtotal,
  insuranceCoverage,
  patientResponsibility,
  totalAmount,
  availableInsurances = [],
  onPaymentMethodChange,
  paymentMethod = 'pending',
  onAmountPaidChange,
  amountPaid = 0,
  notes = '',
  onNotesChange,
  onPrint,
}: BillingPaymentSummaryProps) {
  const [showDiscount, setShowDiscount] = useState(false);
  const [discountType, setDiscountType] = useState<'percentage' | 'amount'>('percentage');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [localNotes, setLocalNotes] = useState(notes);
  const [localAmountPaid, setLocalAmountPaid] = useState<number | string>(amountPaid > 0 ? amountPaid : totalAmount);

  useEffect(() => {
    setLocalAmountPaid(amountPaid);
  }, [amountPaid]);

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

  const privateItemsCount = items.filter(item => {
    const exemption = item.exemptionType || (item.exempted ? 'full' : 'none');
    return exemption !== 'full' && !item.selectedInsuranceId;
  }).length;

  let finalDiscountAmount = 0;
  let finalDiscountPercentage = discountPercentage;

  if (discountType === 'amount') {
    finalDiscountAmount = discountAmount;
    finalDiscountPercentage = convertDiscountAmountToPercentage(discountAmount, patientResponsibility);
  } else {
    finalDiscountAmount = calculateDiscount(patientResponsibility, discountPercentage);
    finalDiscountPercentage = discountPercentage;
  }

  const totalAfterDiscount = Math.max(0, patientResponsibility - finalDiscountAmount);
  const paymentStatus = calculatePaymentStatus(totalAmount, localAmountPaid);
  const remainingBalance = calculateRemainingBalance(totalAmount, localAmountPaid);
  const isHalfAmount = isHalfPaid(totalAmount, localAmountPaid);
  const isFullAmount = isFullyPaid(totalAmount, localAmountPaid);

  const paymentMethods = [
    { id: 'cash', name: 'Cash', icon: 'cash', color: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200' },
    { id: 'momo', name: 'MoMo', icon: 'mtn', color: 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-200' },
    { id: 'airtel-money', name: 'Airtel Money', icon: 'airtel', color: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200' },
  ];

  const getSelectedMethod = () => paymentMethods.find((m) => m.id === paymentMethod);
  const selectedMethod = getSelectedMethod();

  return (
    <>
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
        <CardHeader className="py-4">
          <CardTitle className="text-base">Billing Summary & Payment</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Billing Summary Section */}
          <div className="space-y-2 pb-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-xs text-slate-700 dark:text-slate-300">Summary</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between text-slate-700 dark:text-slate-300 text-xs">
                <span>Subtotal:</span>
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
                      <span>{insurance.acronym} Coverage:</span>
                      <span className="font-semibold">-{Math.round(insurance.coverage).toLocaleString()} RWF</span>
                    </div>
                  ))}
                </>
              )}

              {(insuranceCoverage > 0 || privateItemsCount > 0) && (
                <div className="flex justify-between text-blue-700 dark:text-blue-400 font-semibold text-sm">
                  <span>Patient Responsibility:</span>
                  <span>{Math.round(patientResponsibility).toLocaleString()} RWF</span>
                </div>
              )}
            </div>

            {/* Discount Section */}
            {!showDiscount && finalDiscountAmount === 0 && (
              <Button
                onClick={() => setShowDiscount(true)}
                variant="outline"
                size="sm"
                className="w-full text-xs mt-2"
              >
                + Add Discount
              </Button>
            )}

            {(showDiscount || finalDiscountAmount > 0) && (
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <div className="flex gap-2">
                  <Button
                    onClick={() => setDiscountType('percentage')}
                    variant={discountType === 'percentage' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1 text-xs"
                  >
                    % (Percentage)
                  </Button>
                  <Button
                    onClick={() => setDiscountType('amount')}
                    variant={discountType === 'amount' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1 text-xs"
                  >
                    RWF (Amount)
                  </Button>
                  <Button
                    onClick={() => {
                      setShowDiscount(false);
                      onDiscountChange(0);
                      setDiscountAmount(0);
                    }}
                    variant="outline"
                    size="sm"
                    className="px-2"
                  >
                    ✕
                  </Button>
                </div>

                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Input
                      type="number"
                      min="0"
                      max={discountType === 'percentage' ? '100' : patientResponsibility}
                      value={discountType === 'percentage' ? discountPercentage : discountAmount}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        if (discountType === 'percentage') {
                          onDiscountChange(value);
                        } else {
                          setDiscountAmount(Math.min(value, patientResponsibility));
                        }
                      }}
                      className="h-8 text-xs"
                    />
                  </div>
                  <span className="text-xs font-medium">{discountType === 'percentage' ? '%' : 'RWF'}</span>
                </div>

                {finalDiscountAmount > 0 && (
                  <div className="text-right">
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Discount ({finalDiscountPercentage.toFixed(1)}%):
                    </p>
                    <p className="text-sm font-bold text-red-600 dark:text-red-400">
                      -{finalDiscountAmount.toLocaleString()} RWF
                    </p>
                  </div>
                )}
              </div>
            )}

            {finalDiscountAmount > 0 && (
              <div className="bg-white dark:bg-slate-800 p-2 rounded border border-blue-200 dark:border-blue-700">
                <p className="text-[10px] text-slate-600 dark:text-slate-400">Total Due</p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {totalAfterDiscount.toLocaleString()} RWF
                </p>
              </div>
            )}

            {totalAfterDiscount === 0 && exemptedTotal > 0 && (
              <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-700 p-2 rounded">
                <p className="text-xs font-semibold text-green-700 dark:text-green-400">
                  ✓ All items exempted. Patient owes nothing.
                </p>
              </div>
            )}
          </div>

          {/* Payment Section */}
          <div className="space-y-3 pb-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-xs text-slate-700 dark:text-slate-300">Payment</h3>

            {/* Payment Method */}
            <div className="space-y-1">
              {!showPaymentOptions && selectedMethod ? (
                <div className="flex gap-2 items-center">
                  <Image
                    src={
                      selectedMethod.icon === 'mtn' ? '/mtn-icon.svg' : 
                      selectedMethod.icon === 'airtel' ? '/airtel-icon.png' : 
                      '/cash-icon.svg'
                    }
                    alt={selectedMethod.name}
                    width={28}
                    height={28}
                    className="rounded"
                  />
                  <span className="text-xs font-medium text-slate-900 dark:text-white">{selectedMethod.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPaymentOptions(true)}
                    className="text-xs h-6 ml-auto p-0"
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => {
                        onPaymentMethodChange(method.id as any);
                        setShowPaymentOptions(false);
                      }}
                      className="transition-all"
                    >
                      <Image
                        src={
                          method.icon === 'mtn' ? '/mtn-icon.svg' : 
                          method.icon === 'airtel' ? '/airtel-icon.png' : 
                          '/cash-icon.svg'
                        }
                        alt={method.name}
                        width={36}
                        height={36}
                        className="rounded hover:scale-110 transition-transform"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Amount Section */}
            <div className="grid grid-cols-2 gap-2">
              <div
                onClick={() => {
                  setLocalAmountPaid(totalAmount);
                  onAmountPaidChange?.(totalAmount);
                }}
                className="bg-slate-50 dark:bg-slate-700 p-2 rounded border border-slate-200 dark:border-slate-600 cursor-pointer hover:border-blue-400 transition-colors"
              >
                <p className="text-[10px] text-slate-600 dark:text-slate-400">Total</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {totalAmount.toLocaleString()}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 p-2 rounded border border-blue-300 dark:border-blue-600">
                <p className="text-[10px] text-slate-600 dark:text-slate-400">Paid</p>
                <Input
                  type="number"
                  min="0"
                  max={totalAmount}
                  value={localAmountPaid}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue === '') {
                      setLocalAmountPaid('');
                      onAmountPaidChange?.(0);
                    } else {
                      const value = parseFloat(inputValue) || 0;
                      const finalValue = Math.min(value, totalAmount);
                      setLocalAmountPaid(finalValue);
                      onAmountPaidChange?.(finalValue);
                    }
                  }}
                  className="text-sm font-bold bg-transparent border-0 p-0 focus:ring-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>

            {/* Payment Status */}
            <div className="space-y-2">
              <h4 className="font-semibold text-xs text-slate-700 dark:text-slate-300">Status</h4>

              {totalAmount === 0 ? (
                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-700 p-2 rounded">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">No payment required</p>
                      <p className="text-[10px] text-blue-600 dark:text-blue-300">
                        Total covered by insurance/exemptions
                      </p>
                    </div>
                  </div>
                </div>
              ) : paymentStatus === 'full' ? (
                <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-700 p-2 rounded">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-xs font-semibold text-green-700 dark:text-green-400">Payment Complete</p>
                      <p className="text-[10px] text-green-600 dark:text-green-300">
                        {localAmountPaid.toLocaleString()} RWF
                      </p>
                    </div>
                  </div>
                </div>
              ) : paymentStatus === 'partial' ? (
                <div className="space-y-2">
                  <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-700 p-2 rounded">
                    <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-400">
                      {isHalfAmount ? '⚠ Half Payment' : '⚠ Partial Payment'}
                    </p>
                    <p className="text-[10px] text-yellow-600 dark:text-yellow-300">
                      Paid: {localAmountPaid.toLocaleString()} RWF
                    </p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-700 p-2 rounded">
                    <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                      Balance: {remainingBalance.toLocaleString()} RWF
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-700 p-2 rounded">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-red-600 dark:text-red-400 font-medium">No payment yet</p>
                    <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 text-[10px]">
                      UNPAID
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button
              onClick={onPrint}
              className="w-full h-8 bg-blue-600 hover:bg-blue-700 text-white text-xs"
            >
              <Printer className="h-3 w-3 mr-1" />
              Print Invoice
            </Button>

            <Button variant="secondary" className="w-full h-8 text-xs">
              <Check className="h-3 w-3 mr-1" />
              Mark as Paid
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Floating Notes Button */}
      <button
        onClick={() => setShowNotesModal(true)}
        className="fixed bottom-6 left-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all hover:shadow-xl"
        title="Add Notes"
      >
        <MessageSquare className="h-6 w-6" />
      </button>

      {/* Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-xl shadow-2xl p-6 pointer-events-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Billing Notes</h3>
              <button
                onClick={() => {
                  setShowNotesModal(false);
                  setLocalNotes(notes);
                }}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
              >
                <X className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>

            <textarea
              value={localNotes}
              onChange={(e) => setLocalNotes(e.target.value)}
              placeholder="Add any notes related to this billing..."
              className="w-full h-40 p-3 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:border-blue-500 dark:focus:border-blue-500 focus:ring-0 bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowNotesModal(false);
                  setLocalNotes(notes);
                }}
                className="flex-1 px-4 py-2 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onNotesChange?.(localNotes);
                  setShowNotesModal(false);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
