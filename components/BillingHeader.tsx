'use client';

import { BillingData } from '@/lib/billing-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BillingHeaderProps {
  billing: BillingData;
}

export function BillingHeader({ billing }: BillingHeaderProps) {
  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  return (
    <Card className="border-0 shadow-sm bg-white dark:bg-slate-800">
      <CardContent className="p-3">
        <div className="space-y-2">
          {/* Top Row: Patient Name on left */}
          <div className="flex items-baseline gap-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {billing.patientName}
            </h2>
          </div>

          {/* Bottom Row: Visit Date, Age, Gender on left | Insurance on right */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400">
                <Badge variant="outline" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5">
                  {new Date(billing.visitDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  })}
                </Badge>
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                Age: {billing.patientAge} years
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                {billing.gender}
              </span>
            </div>

            {billing.insurances && billing.insurances.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 justify-end">
                {billing.insurances.map((insurance, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-200 text-xs px-1.5 py-0.5"
                  >
                    {insurance.acronym}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
