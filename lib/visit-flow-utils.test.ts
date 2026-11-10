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
  hasOtherActiveOrUnbilledDepartments,
  resolveNextDestination,
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

  describe("discharge suppression & next destination routing", () => {
    it("suppresses discharge if other active departments exist", () => {
      const visitWithLab: Visit = {
        ...baseVisit,
        departments: [
          { id: "vd-consult", status: "COMPLETED", products: [] } as any,
          { id: "vd-lab", status: "PENDING", products: [] } as any,
        ],
      };
      // Currently billing consult -> lab is still pending -> cannot discharge
      expect(hasOtherActiveOrUnbilledDepartments(visitWithLab, "vd-consult")).toBe(true);

      // Both completed -> can discharge
      const visitFinished: Visit = {
        ...baseVisit,
        departments: [
          { id: "vd-consult", status: "COMPLETED", products: [] } as any,
          { id: "vd-lab", status: "COMPLETED", products: [{ billingState: "BILLED" }] } as any,
        ],
      };
      expect(hasOtherActiveOrUnbilledDepartments(visitFinished, "vd-consult")).toBe(false);
    });

    it("suppresses discharge if child department is active", () => {
      const visitWithChildLab: Visit = {
        ...baseVisit,
        departments: [
          {
            id: "vd-consult",
            status: "BILLING",
            products: [],
            childVisitDepartments: [
              { id: "vd-child-lab", status: "PENDING", products: [] } as any,
            ],
          } as any,
        ],
      };
      expect(hasOtherActiveOrUnbilledDepartments(visitWithChildLab, "vd-consult")).toBe(true);
    });

    it("resolves child department destination first", () => {
      const visitWithChild: Visit = {
        ...baseVisit,
        departments: [
          {
            id: "vd-consult",
            status: "BILLING",
            products: [],
            childVisitDepartments: [
              {
                id: "vd-child-lab",
                status: "PENDING",
                department: { id: "dept-lab", name: "Laboratory" },
              } as any,
            ],
          } as any,
        ],
      };
      const dest = resolveNextDestination(visitWithChild, "vd-consult");
      expect(dest.type).toBe("CHILD_DEPT");
      expect(dest.label).toBe("Bill & Continue");
      expect(dest.hasUncompletedChild).toBe(true);
    });

    it("resolves next department when no child department exists", () => {
      const visitWithNext: Visit = {
        ...baseVisit,
        departments: [
          { id: "vd-consult", status: "BILLING", products: [] } as any,
          {
            id: "vd-pharmacy",
            status: "PENDING",
            department: { id: "dept-pharm", name: "Pharmacy" },
          } as any,
        ],
      };
      const dest = resolveNextDestination(visitWithNext, "vd-consult");
      expect(dest.type).toBe("NEXT_DEPT");
      expect(dest.label).toBe("Bill & Continue");
      expect(dest.hasUncompletedChild).toBe(false);
    });

    it("falls back to referring doctor when no child or next department exists", () => {
      const singleDeptVisit: Visit = {
        ...baseVisit,
        departments: [
          { id: "vd-consult", status: "BILLING", products: [] } as any,
        ],
      };
      const dest = resolveNextDestination(singleDeptVisit, "vd-consult");
      expect(dest.type).toBe("REFERRING_DOCTOR");
      expect(dest.label).toBe("Bill & Return to Service");
    });
  });
});
