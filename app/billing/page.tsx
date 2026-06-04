'use client';

import { Suspense } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { BillingPageContent } from '@/components/billing/billing-page-content';

export default function BillingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Spinner /></div>}>
      <BillingPageContent />
    </Suspense>
  );
}
