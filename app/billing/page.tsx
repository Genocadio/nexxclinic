'use client';

import { Suspense } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { canAccessBilling } from '@/lib/role-utils';
import { Spinner } from '@/components/ui/spinner';
import { BillingPageContent } from '@/components/billing/billing-page-content';

function BillingPageGuard() {
  const { doctor, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!doctor) {
      router.push('/login');
      return;
    }

    const userRoles = (doctor.roles as string[]) || [];
    if (!canAccessBilling(userRoles)) {
      router.push('/');
      return;
    }
  }, [doctor, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!doctor) {
    return null;
  }

  const userRoles = (doctor.roles as string[]) || [];
  if (!canAccessBilling(userRoles)) {
    return null;
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Spinner /></div>}>
      <BillingPageContent />
    </Suspense>
  );
}

export default function BillingPage() {
  return <BillingPageGuard />;
}
