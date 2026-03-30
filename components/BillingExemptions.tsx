'use client';

import { useState } from 'react';
import { BillingItem, EXEMPTION_PRESETS } from '@/lib/billing-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2 } from 'lucide-react';

interface BillingExemptionsProps {
  items: BillingItem[];
  onExemptionChange: (itemId: string, reason: string) => void;
}

export function BillingExemptions({
  items,
  onExemptionChange,
}: BillingExemptionsProps) {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  const exemptedItems = items.filter((item) => (item.exemptionType || (item.exempted ? 'full' : 'none')) !== 'none');

  const handleAddExemption = () => {
    if (!selectedReason && !customReason) return;

    const reason = isCustom ? customReason : selectedReason;
    exemptedItems.forEach((item) => {
      if (!item.exemptionReason) {
        onExemptionChange(item.id, reason);
      }
    });

    setSelectedReason('');
    setCustomReason('');
    setIsCustom(false);
  };

  return (
    <Card className="border-0 shadow-lg bg-purple-50 dark:bg-purple-950">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-900 dark:text-purple-200">
          Item Exemptions
          <Badge variant="secondary" className="ml-auto">
            {exemptedItems.length} exempted
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {exemptedItems.length > 0 && (
          <div className="space-y-3">
            {exemptedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-purple-200 dark:border-purple-700"
              >
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white">
                    {item.name}
                  </p>
                  {item.exemptionReason && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      Reason: {item.exemptionReason}
                    </p>
                  )}
                  <p className="text-xs text-purple-700 dark:text-purple-200 mt-1">
                    {item.exemptionType === 'patient-share' ? 'Patient share waived (insurance pays)' : 'Full exemption'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {exemptedItems.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-purple-200 dark:border-purple-700">
            <p className="text-sm font-semibold text-purple-900 dark:text-purple-200">
              Add exemption reason for {exemptedItems.filter((i) => !i.exemptionReason).length} items:
            </p>

            <div className="space-y-2">
              <Select
                value={isCustom ? 'custom' : selectedReason}
                onValueChange={(value) => {
                  if (value === 'custom') {
                    setIsCustom(true);
                  } else {
                    setIsCustom(false);
                    setSelectedReason(value);
                  }
                }}
              >
                <SelectTrigger className="bg-white dark:bg-slate-800">
                  <SelectValue placeholder="Select exemption reason" />
                </SelectTrigger>
                <SelectContent>
                  {EXEMPTION_PRESETS.map((preset) => (
                    <SelectItem key={preset} value={preset}>
                      {preset}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Custom Reason</SelectItem>
                </SelectContent>
              </Select>

              {isCustom && (
                <Input
                  placeholder="Enter custom exemption reason"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="bg-white dark:bg-slate-800"
                />
              )}
            </div>

            <Button
              onClick={handleAddExemption}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              disabled={!selectedReason && !customReason}
            >
              <Plus className="h-4 w-4 mr-2" />
              Apply Exemption Reason
            </Button>
          </div>
        )}

        {exemptedItems.length === 0 && (
          <p className="text-sm text-slate-600 dark:text-slate-400 text-center py-4">
            No exemptions yet. Choose an exemption from the items table to manage reasons here.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
