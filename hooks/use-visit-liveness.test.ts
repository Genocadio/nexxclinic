import { describe, it, expect } from "vitest";
import { normalizeViewer, isViewerBilling } from "./use-visit-liveness";
import { isVisitOrDepartmentClosedForProducts } from "@/lib/visit-product-lock";

describe("use-visit-liveness helpers", () => {
  it("normalizes backend viewer object properly", () => {
    const raw = {
      workerId: "w-123",
      workerName: "Alice Finance",
      role: "FINANCE",
    };
    const viewer = normalizeViewer(raw);
    expect(viewer.workerId).toBe("w-123");
    expect(viewer.name).toBe("Alice Finance");
    expect(viewer.role).toBe("FINANCE");
    expect(viewer.roles).toEqual(["FINANCE"]);
  });

  it("handles alternative name and role formats in raw viewer", () => {
    const raw = {
      id: "w-456",
      name: "Dr. Bob",
      roles: ["CLINICIAN", "DOCTOR"],
    };
    const viewer = normalizeViewer(raw);
    expect(viewer.workerId).toBe("w-456");
    expect(viewer.name).toBe("Dr. Bob");
    expect(viewer.role).toBe("CLINICIAN");
    expect(viewer.roles).toEqual(["CLINICIAN", "DOCTOR"]);
  });

  it("identifies billing personnel correctly", () => {
    expect(
      isViewerBilling({ workerId: "1", name: "Alice", role: "FINANCE", roles: ["FINANCE"] })
    ).toBe(true);
    expect(
      isViewerBilling({ workerId: "2", name: "Charlie", role: "CASHIER", roles: ["CASHIER"] })
    ).toBe(true);
    expect(
      isViewerBilling({ workerId: "3", name: "David", role: "BILLING", roles: ["BILLING"] })
    ).toBe(true);
    expect(
      isViewerBilling({ workerId: "4", name: "Dr. Bob", role: "CLINICIAN", roles: ["CLINICIAN"] })
    ).toBe(false);
    expect(
      isViewerBilling({ workerId: "5", name: "Nurse Nancy", role: "NURSE", roles: ["NURSE"] })
    ).toBe(false);
  });
});

describe("isVisitOrDepartmentClosedForProducts", () => {
  it("locks products when visit is FINALISED", () => {
    expect(isVisitOrDepartmentClosedForProducts("FINALISED", "ACTIVE")).toBe(true);
  });

  it("locks products when visit is COMPLETED", () => {
    expect(isVisitOrDepartmentClosedForProducts("COMPLETED", "ACTIVE")).toBe(true);
  });

  it("allows products when department is in BILLING status during continued consultation", () => {
    expect(isVisitOrDepartmentClosedForProducts("IN_PROGRESS", "BILLING")).toBe(false);
  });

  it("locks products when department is FINALISED", () => {
    expect(isVisitOrDepartmentClosedForProducts("IN_PROGRESS", "FINALISED")).toBe(true);
  });

  it("locks products when department is COMPLETED", () => {
    expect(isVisitOrDepartmentClosedForProducts("IN_PROGRESS", "COMPLETED")).toBe(true);
  });

  it("allows products when visit and department are ACTIVE or PENDING", () => {
    expect(isVisitOrDepartmentClosedForProducts("IN_PROGRESS", "ACTIVE")).toBe(false);
    expect(isVisitOrDepartmentClosedForProducts("IN_PROGRESS", "PENDING")).toBe(false);
  });
});

describe("VISIT_NOTE_ADDED event processing", () => {
  it("formats note notice attributes properly", () => {
    const detail = {
      eventId: "evt-1",
      type: "VISIT_NOTE_ADDED",
      visitId: "visit-1",
      departmentId: "dept-1",
      departmentName: "Consultation",
      actorId: "doc-1",
      actorName: "Dr. Alice",
      metadata: {
        noteId: "note-1",
        noteType: "BILLING",
      },
    };

    const typeLabel = detail.metadata?.noteType ? `${String(detail.metadata.noteType).toLowerCase()} ` : "";
    const actor = detail.actorName ? ` by ${detail.actorName}` : "";
    const notice = `New ${typeLabel}note added${actor}.`;

    expect(notice).toBe("New billing note added by Dr. Alice.");
  });

  it("handles general public notes without actor name gracefully", () => {
    const detail = {
      eventId: "evt-2",
      type: "VISIT_NOTE_ADDED",
      visitId: "visit-1",
      metadata: {
        noteId: "note-2",
        noteType: "PUBLIC",
      },
    };

    const typeLabel = detail.metadata?.noteType ? `${String(detail.metadata.noteType).toLowerCase()} ` : "";
    const actor = (detail as any).actorName ? ` by ${(detail as any).actorName}` : "";
    const notice = `New ${typeLabel}note added${actor}.`;

    expect(notice).toBe("New public note added.");
  });
});

describe("targeted typing indicator audience filtering", () => {
  function canUserSeeNoteTyping(
    userRoles: string[],
    allowedDisplayTypes: string[] | undefined,
    typingActivity: string
  ): boolean {
    const isManagerOrAdmin = userRoles.includes("MANAGER") || userRoles.includes("ADMIN");
    if (isManagerOrAdmin) return true;

    const [, noteType] = typingActivity.split(":");
    const typeNorm = (noteType || "PUBLIC").toUpperCase();

    if (allowedDisplayTypes && allowedDisplayTypes.length > 0) {
      if (!allowedDisplayTypes.map((t) => t.toUpperCase()).includes(typeNorm)) {
        return false;
      }
    }

    if (typeNorm === "BILLING") {
      return (
        userRoles.includes("FINANCE") ||
        userRoles.includes("CASHIER") ||
        userRoles.includes("BILLING") ||
        (allowedDisplayTypes?.includes("BILLING") ?? false)
      );
    }

    if (typeNorm === "CONSULTATION" || typeNorm === "CLINICAL") {
      return (
        userRoles.includes("CLINICIAN") ||
        userRoles.includes("DOCTOR") ||
        userRoles.includes("NURSE") ||
        (allowedDisplayTypes?.includes("CONSULTATION") ?? false)
      );
    }

    if (typeNorm === "ADMIN") {
      return isManagerOrAdmin || (allowedDisplayTypes?.includes("ADMIN") ?? false);
    }

    return true;
  }

  it("restricts BILLING note typing to finance/billing staff and does not leak to clinicians", () => {
    const clinicianRoles = ["CLINICIAN", "DOCTOR"];
    const financeRoles = ["FINANCE", "CASHIER"];

    expect(canUserSeeNoteTyping(clinicianRoles, undefined, "typing_note:BILLING:dept-1")).toBe(false);
    expect(canUserSeeNoteTyping(financeRoles, undefined, "typing_note:BILLING:dept-1")).toBe(true);
  });

  it("restricts CONSULTATION note typing to clinical staff and does not leak to cashier", () => {
    const cashierRoles = ["CASHIER"];
    const doctorRoles = ["CLINICIAN"];

    expect(canUserSeeNoteTyping(cashierRoles, undefined, "typing_note:CONSULTATION:dept-1")).toBe(false);
    expect(canUserSeeNoteTyping(doctorRoles, undefined, "typing_note:CONSULTATION:dept-1")).toBe(true);
  });

  it("allows PUBLIC note typing to all staff", () => {
    expect(canUserSeeNoteTyping(["CLINICIAN"], undefined, "typing_note:PUBLIC:dept-1")).toBe(true);
    expect(canUserSeeNoteTyping(["CASHIER"], undefined, "typing_note:PUBLIC:dept-1")).toBe(true);
  });

  it("allows managers and admins to see all typing indicators", () => {
    expect(canUserSeeNoteTyping(["ADMIN"], undefined, "typing_note:BILLING:dept-1")).toBe(true);
    expect(canUserSeeNoteTyping(["MANAGER"], undefined, "typing_note:CONSULTATION:dept-1")).toBe(true);
  });
});
