'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Printer, MessageSquare, X } from 'lucide-react';
import {
  calculatePaymentStatus,
  calculateRemainingBalance,
  isFullyPaid,
  isHalfPaid,
} from '@/lib/billing-utils';

interface BillingPaymentProps {
  totalAmount: number;
  onPaymentMethodChange: (method: 'cash' | 'momo' | 'airtel-money' | 'pending') => void;
  paymentMethod?: 'cash' | 'momo' | 'airtel-money' | 'pending';
  onAmountPaidChange?: (amount: number) => void;
  amountPaid?: number;
  notes?: string;
  onNotesChange?: (notes: string) => void;
  onPrint: () => void;
}

export function BillingPayment({
  totalAmount,
  onPaymentMethodChange,
  paymentMethod = 'pending',
  onAmountPaidChange,
  amountPaid = 0,
  notes = '',
  onNotesChange,
  onPrint,
}: BillingPaymentProps) {
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [localNotes, setLocalNotes] = useState(notes);
  const [localAmountPaid, setLocalAmountPaid] = useState<number | string>(amountPaid > 0 ? amountPaid : totalAmount);

  useEffect(() => {
    setLocalAmountPaid(amountPaid);
  }, [amountPaid]);

  const paymentStatus = calculatePaymentStatus(totalAmount, localAmountPaid);
  const remainingBalance = calculateRemainingBalance(totalAmount, localAmountPaid);
  const isHalfAmount = isHalfPaid(totalAmount, localAmountPaid);
  const isFullAmount = isFullyPaid(totalAmount, localAmountPaid);

  const paymentMethods = [
    {
      id: 'cash',
      name: 'Cash',
      icon: 'cash',
      showText: false,
      color: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200',
    },
    {
      id: 'momo',
      name: 'MoMo',
      icon: 'mtn',
      showText: false,
      color: 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-200',
    },
    {
      id: 'airtel-money',
      name: 'Airtel Money',
      icon: 'airtel',
      showText: false,
      color: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200',
    },
  ];

  const getSelectedMethod = () => {
    return paymentMethods.find((m) => m.id === paymentMethod);
  };

  const selectedMethod = getSelectedMethod();

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="space-y-2">
        {/* Payment Method Selection */}
        <div className="space-y-1">
          {!showPaymentOptions && selectedMethod ? (
            <div className="flex gap-2">
              {typeof selectedMethod.icon === 'string' ? (
                <Image
                  src={
                    selectedMethod.icon === 'mtn' ? '/mtn-icon.svg' : 
                    selectedMethod.icon === 'airtel' ? '/airtel-icon.png' : 
                    '/cash-icon.svg'
                  }
                  alt={selectedMethod.name}
                  width={32}
                  height={32}
                  className="rounded"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <selectedMethod.icon className="h-8 w-8 mb-1" />
                  {selectedMethod.showText && (
                    <span className="text-xs font-semibold">{selectedMethod.name}</span>
                  )}
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPaymentOptions(true)}
                className="text-xs h-6 ml-auto"
              >
                Change
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {paymentMethods.map((method) => {
                return (
                  <button
                    key={method.id}
                    onClick={() => {
                      onPaymentMethodChange(method.id as any);
                      setShowPaymentOptions(false);
                    }}
                    className="transition-all flex items-center justify-center"
                  >
                    {typeof method.icon === 'string' ? (
                      <Image
                        src={
                          method.icon === 'mtn' ? '/mtn-icon.svg' : 
                          method.icon === 'airtel' ? '/airtel-icon.png' : 
                          '/cash-icon.svg'
                        }
                        alt={method.name}
                        width={40}
                        height={40}
                        className="rounded hover:scale-110 transition-transform"
                      />
                    ) : (
                      <method.icon className="h-10 w-10 hover:scale-110 transition-transform" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Payment Amount - Before and After */}
        <div className="space-y-2 border-t border-slate-200 dark:border-slate-700 pt-2">
          <div className="grid grid-cols-2 gap-2">
            {/* Total Amount Before */}
            <div
              onClick={() => {
                setLocalAmountPaid(totalAmount);
                onAmountPaidChange?.(totalAmount);
              }}
              className="bg-slate-50 dark:bg-slate-700 p-2 rounded-lg border border-slate-200 dark:border-slate-600 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
            >
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-1">Total</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {totalAmount.toLocaleString()}
              </p>
            </div>

            {/* Amount Paid After */}
            <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-blue-300 dark:border-blue-600">
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-1">Paid</p>
              <Input
                type="number"
                min="0"
                max={totalAmount}
                value={localAmountPaid}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  
                  // Allow empty input
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
                className="text-lg font-bold bg-transparent border-0 p-0 focus:ring-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>
        </div>

        {/* Payment Status */}
        <div className="space-y-2 border-t border-slate-200 dark:border-slate-700 pt-3">
          <h3 className="font-semibold text-slate-900 dark:text-white text-xs">
            Payment Status
          </h3>

          {paymentStatus === 'full' ? (
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-700 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                    ✓ Payment Complete
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-300">
                    Patient paid full amount: {localAmountPaid.toLocaleString()} RWF
                  </p>
                </div>
              </div>
            </div>
          ) : paymentStatus === 'partial' ? (
            <div>
              <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-700 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                      {isHalfAmount ? '⚠ Half Payment Received' : '⚠ Partial Payment Received'}
                    </p>
                    <p className="text-xs text-yellow-600 dark:text-yellow-300 mt-1">
                      Paid: {localAmountPaid.toLocaleString()} RWF
                    </p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200">
                    {isHalfAmount ? 'HALF PAID' : 'PARTIAL'}
                  </Badge>
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-700 p-3 rounded-lg mt-2">
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                  Outstanding Balance: {remainingBalance.toLocaleString()} RWF
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-700 p-2 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                  No payment received yet
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-red-700 dark:text-red-300">
                    {totalAmount.toLocaleString()} RWF
                  </span>
                  <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 text-[10px]">
                    UNPAID
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="border-t border-slate-200 dark:border-slate-700 pt-3 space-y-2">
          <Button
            onClick={onPrint}
            className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white text-xs"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print Invoice
          </Button>

          <Button variant="secondary" className="w-full h-9 text-xs">
            <Check className="h-4 w-4 mr-2" />
            Mark as Paid
          </Button>
        </div>

        {/* Payment Info */}
        <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-lg text-[11px] text-slate-600 dark:text-slate-400 space-y-1 border-t border-slate-200 dark:border-slate-700 pt-3">
          <p>
            <span className="font-semibold">Note:</span> Record the payment method for reconciliation.
          </p>
          <p>
            Invoice includes services, consumables, insurance coverage, and discounts.
          </p>
        </div>
      </CardContent>

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
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Billing Notes
              </h3>
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
              placeholder="Add any notes related to this billing (e.g., special instructions, follow-up notes, etc.)"
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
    </Card>
  );
}
