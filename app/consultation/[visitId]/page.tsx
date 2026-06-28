"use client";

import { useParams, useRouter } from "next/navigation";
import { useVisit } from "@/hooks/auth-hooks";
import {
  useVisitDepartmentNotes,
  useAddVisitDepartmentNote,
  useMarkVisitDepartmentNotesViewed,
} from "@/hooks/visits/hooks";
import { useAuth } from "@/lib/auth-context";
import { StandaloneConsultationView } from "@/components/consultation/standalone-consultation-view";
import VisitNotesFloating from "@/components/visit-notes-floating";
import Header from "@/components/header";
import type { FormAction } from "@/lib/form-storage";
import { Button } from "@/components/ui/button";
import { FlaskConical, StickyNote } from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import InlineTryAgain from "@/components/inline-try-again";

export default function ConsultationPage() {
  const router = useRouter();
  const params = useParams();
  const visitId = params.visitId as string;
  const { doctor } = useAuth();
  const { visit, loading, error, refetch } = useVisit(visitId);
  const { addVisitDepartmentNote } = useAddVisitDepartmentNote();
  const { markNotesViewed } = useMarkVisitDepartmentNotesViewed();
  const [notesOpen, setNotesOpen] = useState(false);

  const firstDepartment = visit?.departments?.[0];
  const firstVisitDepartmentId = firstDepartment?.id;
  const { notes: departmentNotes, refetch: refetchNotes } =
    useVisitDepartmentNotes(visitId, firstVisitDepartmentId || null);
  const unreadNotesCount = (departmentNotes || []).filter(
    (note: any) => !note?.viewed,
  ).length;

  useEffect(() => {
    if (!loading && !visit && !error) {
      router.push("/");
    }
  }, [loading, visit, error, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header doctor={doctor} />
        <div className="max-w-5xl mx-auto px-6 py-8 space-y-4">
          <Skeleton className="h-10 w-64 rounded-lg" />
          {[...Array(3)].map((_, idx) => (
            <div
              key={idx}
              className="bg-card/70 border rounded-2xl p-4 space-y-3"
            >
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header doctor={doctor} />
        <div className="max-w-5xl mx-auto px-6 py-8">
          <InlineTryAgain
            onTryAgain={() => {
              void refetch();
            }}
          />
        </div>
      </div>
    );
  }

  if (!visit || !firstDepartment) {
    return (
      <div className="min-h-screen bg-background">
        <Header doctor={doctor} />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <p className="text-muted-foreground">Visit not found, redirecting…</p>
        </div>
      </div>
    );
  }

  const existingProducts: FormAction[] = (firstDepartment.products || []).map(
    (line) => ({
      id: line.id,
      name: line.product.name,
      type: line.product.type === "CONSUMABLE_DEVICE" ? "consumable" : "action",
      quantity: line.quantity || 0,
      price: Number(
        line.price ??
          line.product.clinicPrice ??
          line.product.privateRhicPrice ??
          0,
      ),
      privatePrice: Number(
        line.price ??
          line.product.clinicPrice ??
          line.product.privateRhicPrice ??
          0,
      ),
      isQuantifiable: true,
      backendId: String(line.id),
    }),
  );

  return (
    <div className="min-h-screen bg-background">
      <Header doctor={doctor} />

      <StandaloneConsultationView
        visit={visit}
        visitDepartment={firstDepartment}
        patient={visit.patient}
        existingProducts={existingProducts}
        onVisitRefetch={() => {
          void refetch();
        }}
        onBack={() => router.back()}
      />

      <VisitNotesFloating
        title="Consultation Notes"
        notes={departmentNotes}
        noteTypes={["BILLING", "FORMS", "CONSULTATION", "ADMIN", "PUBLIC"]}
        open={notesOpen}
        onOpenChange={setNotesOpen}
        hideToggleButton
        onAddNote={async (noteType, content) => {
          const visitDepartmentId = String(firstVisitDepartmentId || "");
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
          await markNotesViewed(String(firstVisitDepartmentId || ""));
          await refetchNotes();
          await refetch();
        }}
      />
    </div>
  );
}
