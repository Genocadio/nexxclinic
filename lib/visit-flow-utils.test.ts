import { describe, it, expect } from "vitest";
import {
  parseCurrentLocations,
  isVisitDischarged,
  isVisitReturnedFromBilling,
  isVisitResultsReady,
  isClinicianNeedsMe,
  isClinicianInCare,
  isClinicianOnHold,
  getVisitFlowBadges,
} from "./visit-flow-utils";
import { type Visit, VisitStatus, DepartmentKind } from "@/lib/api-types";

describe("visit-flow-utils", () => {
  const baseVisit: Visit = {
    id: "v-1",
    status: VisitStatus.IN_PROGRESS,
    visitDate: "2026-11-10",
    patient: {
      id: "p-1",
      firstName: "John",
      lastName: "Doe",
    } as any,
    departments: [],
    linkedInsurances: [],
    vitalSigns: [],
  };

  it("parses JSON currentLocations safely", () => {
    expect(parseCurrentLocations(null)).toEqual([]);
    expect(parseCurrentLocations("")).toEqual([]);
    expect(parseCurrentLocations("invalid-json")).toEqual([]);

    const raw = JSON.stringify([
      { id: "vd-1", name: "Laboratory", kind: "LABORATORY", status: "PENDING" },
    ]);
    const parsed = parseCurrentLocations(raw);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].name).toBe("Laboratory");
    expect(parsed[0].kind).toBe("LABORATORY");
  });

  it("identifies discharged visits accurately", () => {
    expect(isVisitDischarged({ ...baseVisit, isDischarged: true })).toBe(true);
    expect(isVisitDischarged({ ...baseVisit, status: VisitStatus.COMPLETED })).toBe(true);
    expect(isVisitDischarged({ ...baseVisit, status: VisitStatus.FINALISED })).toBe(true);
    expect(isVisitDischarged({ ...baseVisit, status: VisitStatus.IN_PROGRESS, isDischarged: false })).toBe(false);
  });

  it("detects visits returned from billing", () => {
    // Via top-level summary flag
    expect(isVisitReturnedFromBilling({ ...baseVisit, hasReturnedFromBilling: true })).toBe(true);

    // Via department lastRoutingAction
    const deptWithSentBack = {
      id: "vd-1",
      status: "ACTIVE",
      lastRoutingAction: "SENT_BACK",
    } as any;
    expect(isVisitReturnedFromBilling({ ...baseVisit, departments: [deptWithSentBack] })).toBe(true);

    // Normal visit is false
    expect(isVisitReturnedFromBilling(baseVisit)).toBe(false);
  });

  it("detects when diagnostic results are ready", () => {
    const labDept = {
      id: "vd-lab",
      status: "COMPLETED",
      department: { id: "d-lab", name: "Main Laboratory", kind: DepartmentKind.LABORATORY },
    } as any;
    expect(isVisitResultsReady({ ...baseVisit, departments: [labDept], hasPendingResults: false })).toBe(true);
  });

  it("clinician dashboard partition: exactly one primary bucket", () => {
    const doctorId = "doc-1";
    const userDeptIds = ["dept-consult"];

    // Case 1: Returned from billing -> Needs Me
    const returnedVisit: Visit = {
      ...baseVisit,
      hasReturnedFromBilling: true,
      departments: [
        {
          id: "vd-consult",
          status: "ACTIVE",
          department: { id: "dept-consult", name: "General Consultation", kind: DepartmentKind.CONSULTATION } as any,
          processors: [{ id: doctorId }],
        } as any,
      ],
    };
    expect(isClinicianNeedsMe(returnedVisit, doctorId, userDeptIds)).toBe(true);
    expect(isClinicianInCare(returnedVisit, doctorId, userDeptIds)).toBe(false);

    // Case 2: In Laboratory -> In Care
    const inLabVisit: Visit = {
      ...baseVisit,
      currentLocations: JSON.stringify([
        { id: "vd-lab", name: "Laboratory", kind: "LABORATORY", status: "PENDING" },
      ]),
      departments: [
        {
          id: "vd-lab",
          status: "PENDING",
          department: { id: "dept-lab", name: "Laboratory", kind: DepartmentKind.LABORATORY } as any,
        } as any,
      ],
    };
    expect(isClinicianNeedsMe(inLabVisit, doctorId, userDeptIds)).toBe(false);
    expect(isClinicianInCare(inLabVisit, doctorId, userDeptIds)).toBe(true);

    // Case 3: Discharged -> Neither Needs Me nor In Care
    const dischargedVisit: Visit = {
      ...baseVisit,
      isDischarged: true,
      status: VisitStatus.COMPLETED,
    };
    expect(isClinicianNeedsMe(dischargedVisit, doctorId, userDeptIds)).toBe(false);
    expect(isClinicianInCare(dischargedVisit, doctorId, userDeptIds)).toBe(false);
    expect(isVisitDischarged(dischargedVisit)).toBe(true);
  });

  it("generates correct flow badges", () => {
    const visit: Visit = {
      ...baseVisit,
      hasReturnedFromBilling: true,
      currentLocations: JSON.stringify([
        { id: "vd-lab", name: "Laboratory", kind: "LABORATORY", status: "PENDING" },
      ]),
    };

    const badges = getVisitFlowBadges(visit);
    expect(badges.some((b) => b.id === "returned_from_billing")).toBe(true);
    expect(badges.some((b) => b.label === "At Laboratory")).toBe(true);
  });
});
