'use client';

import { Suspense } from 'react';
import { useEffect } from 'react';
import { useRouter } from '@/lib/navigation';
import { useAuth } from '@/lib/auth-context';
import { canAccessBilling } from '@/lib/role-utils';
import { AppLoadingState } from '@/components/ui/app-loading-state';
import { BillingPageContent } from '@/components/billing/billing-page-content';

function BillingPageGuard() {
  const { doctor, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!doctor) {
      router.push('/auth');
      return;
    }

    const userRoles = (doctor.roles as string[]) || [];
    if (!canAccessBilling(userRoles)) {
      router.push('/');
      return;
    }
  }, [doctor, isLoading, router]);

  if (isLoading) {
    return <AppLoadingState message="Checking billing access…" />;
  }

  if (!doctor) {
    return null;
  }

  const userRoles = (doctor.roles as string[]) || [];
  if (!canAccessBilling(userRoles)) {
    return null;
  }

  return (
    <Suspense fallback={<AppLoadingState message="Opening billing…" />}>
      <BillingPageContent />
    </Suspense>
  );
}

export default function BillingPage() {
  return <BillingPageGuard />;
}
