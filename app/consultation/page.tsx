"use client";

import { useRouter, useSearchParams } from "@/lib/navigation";
import { useVisit } from "@/hooks/auth-hooks";
import {
    useVisitDepartmentNotes,
    useAddVisitDepartmentNote,
    useMarkVisitDepartmentNotesViewed,
    useConsultVisit,
} from "@/hooks/visits/hooks";
import { useAuth } from "@/lib/auth-context";
import { hasRole } from "@/lib/role-utils";
import { StandaloneConsultationView } from "@/components/consultation/standalone-consultation-view";
import VisitNotesFloating from "@/components/visit-notes-floating";
import Header from "@/components/header";
import type { FormAction } from "@/lib/form-storage";
import { useEffect, useState } from "react";
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
    const { addVisitDepartmentNote } = useAddVisitDepartmentNote();
    const { markNotesViewed } = useMarkVisitDepartmentNotesViewed();
    const { consultVisit } = useConsultVisit();
    const [notesOpen, setNotesOpen] = useState(false);

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

    useEffect(() => {
        if (
            visit &&
            activeDepartment &&
            doctor?.id &&
            hasRole(doctor.roles || [], "CLINICIAN") &&
            activeDepartment.status !== "COMPLETED" &&
            activeDepartment.status !== "FINALISED" &&
            activeDepartment.status !== "CANCELLED"
        ) {
            const isAlreadyProcessor = (activeDepartment.processors || []).some(
                (p) => p.id === doctor.id
            );
            const isPending = activeDepartment.status === "PENDING";
            if (isPending || !isAlreadyProcessor) {
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
        activeDepartment?.status,
        activeDepartment?.profile?.id,
        activeDepartment?.department?.profiles?.length,
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
                    }}
                    onBack={() => router.back()}
                />
            </div>

            <VisitNotesFloating
                title="Consultation Notes"
                notes={departmentNotes}
                noteTypes={["BILLING", "FORMS", "CONSULTATION", "ADMIN", "PUBLIC"]}
                open={notesOpen}
                onOpenChange={setNotesOpen}
                hideToggleButton
                onAddNote={async (noteType, content) => {
                    const visitDepartmentId = String(activeVisitDepartmentId || "");
                    if (!visitDepartmentId)
                        throw new Error("No department selected for consultation note");
                    const result = await addVisitDepartmentNote(
                        visitDepartmentId,
                        content,
                        noteType,
                    );
                    if (result?.status !== "SUCCESS") {
                        throw new Error(result?.message || "Failed to add note");
                    }
                    await refetchNotes();
                    await refetch();
                }}
                onMarkAsViewed={async () => {
                    await markNotesViewed(String(activeVisitDepartmentId || ""));
                    await refetchNotes();
                    await refetch();
                }}
            />
        </div>
    );
}