"use client";

import { useRouter, useSearchParams } from "@/lib/navigation";
import { useVisit } from "@/hooks/auth-hooks";
import {
    useVisitDepartmentNotes,
    useConsultVisit,
} from "@/hooks/visits/hooks";
import { useAuth } from "@/lib/auth-context";
import { hasRole } from "@/lib/role-utils";
import { StandaloneConsultationView } from "@/components/consultation/standalone-consultation-view";
import Header from "@/components/header";
import type { FormAction } from "@/lib/form-storage";
import { useEffect, useRef, useState } from "react";
import { PageLoading } from "@/components/ui/page-loading";
import InlineTryAgain from "@/components/inline-try-again";

import { visitProductToFormAction } from "@/components/formbuilder/extensions/consultation-visit/utils";

export default function ConsultationPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const visitId = searchParams.get("visitId");
    const autoPrint = searchParams.get("autoprint") === "1";

    const { doctor } = useAuth();
    const { visit, loading, error, refetch } = useVisit(visitId || "");
    const { consultVisit } = useConsultVisit();

    const visitDepartmentIdParam = searchParams.get("visitDepartmentId");
    const departmentIdParam = searchParams.get("departmentId");

    const activeDepartment =
        (visit?.departments || []).find((d) =>
            (visitDepartmentIdParam && d.id === visitDepartmentIdParam) ||
            (departmentIdParam && d.department?.id === departmentIdParam)
        ) ||
        (visit?.departments || []).find((d) =>
            doctor?.departments?.some((docDept) => docDept.id === d.department?.id)
        ) ||
        (visit?.departments || []).find((d) =>
            d.products && d.products.length > 0
        ) ||
        (visit?.departments || []).find((d) =>
            d.department?.name?.toLowerCase() !== "triage" &&
            d.department?.name?.toLowerCase() !== "nursing"
        ) ||
        visit?.departments?.[0];

    const activeVisitDepartmentId = activeDepartment?.id;
    const { notes: departmentNotes, refetch: refetchNotes } =
        useVisitDepartmentNotes(visitId || "", activeVisitDepartmentId || null);

    const autoConsultedDeptIdRef = useRef<string | null>(null);

    useEffect(() => {
        if (!visit || !activeDepartment || !doctor?.id) return;
        // CRITICAL: Only run auto-consult ONCE when the consultation page first loads for this department.
        // Never re-run when activeDepartment.status transitions to BILLING during "Save & Edit Later" or "Finalise",
        // otherwise consultVisit would immediately revert the department from BILLING back to ACTIVE!
        if (autoConsultedDeptIdRef.current === activeDepartment.id) return;
        autoConsultedDeptIdRef.current = activeDepartment.id;

        if (
            visit.status !== "FINALISED" &&
            visit.status !== "CANCELLED" &&
            hasRole(doctor.roles || [], "CLINICIAN") &&
            activeDepartment.status !== "COMPLETED" &&
            activeDepartment.status !== "FINALISED" &&
            activeDepartment.status !== "CANCELLED" &&
            !activeDepartment.hasFinalizedConsultationAnswers
        ) {
            const isAlreadyProcessor = (activeDepartment.processors || []).some(
                (p) => p.id === doctor.id
            );
            const isPendingOrBilling =
                activeDepartment.status === "PENDING" ||
                activeDepartment.status === "BILLING";
            if (isPendingOrBilling || !isAlreadyProcessor) {
                const profiles = activeDepartment.department?.profiles || [];
                const profileId =
                    !activeDepartment.profile?.id && profiles.length === 1
                        ? profiles[0].id
                        : undefined;
                consultVisit(activeDepartment.id, profileId).catch((err) => {
                    console.error("Auto consultVisit sync failed:", err);
                });
            }
        }
    }, [
        visit?.id,
        activeDepartment?.id,
        doctor?.id,
    ]);

    useEffect(() => {
        if (!loading && !visit && !error) {
            router.push("/");
        }
    }, [loading, visit, error, router]);

    useEffect(() => {
        if (autoPrint && visit) {
            // Your print logic here
        }
    }, [autoPrint, visit]);

    // While loading (or before visit has arrived), always show skeleton.
    // This prevents the transient "Visit not found" flash on refresh.
    if (loading || (!visit && !error)) {
        return <PageLoading />;
    }

    if (error) {
        return (
            <div className="h-screen overflow-hidden bg-background flex flex-col">
                <Header doctor={doctor} />
                <div className="max-w-5xl mx-auto px-6 py-8 flex-1 min-h-0 min-w-0 overflow-y-auto">
                    <InlineTryAgain onTryAgain={() => void refetch()} />
                </div>
            </div>
        );
    }

    if (!visit || !activeDepartment) {
        return <PageLoading />;
    }

    const existingProducts: FormAction[] = (activeDepartment.products || []).map(
        (line) => visitProductToFormAction(line as any),
    );

    return (
        <div className="h-screen overflow-hidden bg-background flex flex-col">
            <Header doctor={doctor} />

            <div className="flex-1 min-h-0 min-w-0 overflow-y-auto">
                <StandaloneConsultationView
                    visit={visit}
                    visitDepartment={activeDepartment}
                    patient={visit.patient}
                    existingProducts={existingProducts}
                    onVisitRefetch={() => {
                        void refetch();
                        void refetchNotes();
                    }}
                    onBack={() => router.back()}
                />
            </div>
        </div>
    );
}