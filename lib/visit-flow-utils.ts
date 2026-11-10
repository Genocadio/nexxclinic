import { DepartmentKind, type Visit, type VisitDepartment } from "@/lib/api-types";

export interface ParsedLocationSummary {
  id?: string;
  name: string;
  kind?: DepartmentKind | string;
  status?: string;
  awaitingRole?: string;
}

export interface VisitFlowBadge {
  id: string;
  label: string;
  variant: "amber" | "emerald" | "sky" | "purple" | "teal" | "blue" | "default";
  iconName: "rotate-ccw" | "flask" | "activity" | "bed" | "receipt" | "clock" | "check";
}

/**
 * Safely parse the denormalized JSON string `visit.currentLocations`.
 */
export function parseCurrentLocations(
  rawLocations?: string | null,
): ParsedLocationSummary[] {
  if (!rawLocations || typeof rawLocations !== "string") {
    return [];
  }
  try {
    const parsed = JSON.parse(rawLocations);
    if (Array.isArray(parsed)) {
      return parsed.map((loc) => ({
        id: loc?.id ? String(loc.id) : undefined,
        name: loc?.name ? String(loc.name) : "Unknown",
        kind: loc?.kind,
        status: loc?.status,
        awaitingRole: loc?.awaitingRole,
      }));
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * A visit is discharged if explicitly marked isDischarged or status is terminal.
 */
export function isVisitDischarged(visit: Visit): boolean {
  if (visit.isDischarged === true) return true;
  return visit.status === "COMPLETED" || visit.status === "FINALISED";
}

/**
 * Patient returned from billing back to clinician / previous service.
 */
export function isVisitReturnedFromBilling(visit: Visit): boolean {
  if (isVisitDischarged(visit) || visit.status === "CANCELLED") return false;
  if (visit.hasReturnedFromBilling === true) return true;

  const depts = visit.departments || [];
  return depts.some(
    (d) =>
      d.lastRoutingAction === "SENT_BACK" ||
      (d.awaitingRole === "CLINICIAN" && Boolean(d.previousDepartment)),
  );
}

/**
 * Laboratory or Imaging results are ready for clinician review.
 */
export function isVisitResultsReady(visit: Visit): boolean {
  if (isVisitDischarged(visit) || visit.status === "CANCELLED") return false;

  const depts = visit.departments || [];
  const hasResultReadyAction = depts.some(
    (d) => d.lastRoutingAction === "RESULT_READY",
  );
  if (hasResultReadyAction) return true;

  // Has completed diagnostic test with no active diagnostic tests remaining
  const diagnosticDepts = depts.filter((d) => {
    const kind = d.department?.kind;
    const name = String(d.department?.name || "").toUpperCase();
    return (
      kind === "LABORATORY" ||
      kind === "IMAGING" ||
      name.includes("LAB") ||
      name.includes("IMAGING") ||
      name.includes("X-RAY") ||
      name.includes("SCAN")
    );
  });

  if (diagnosticDepts.length === 0) return false;

  const hasCompletedTest = diagnosticDepts.some(
    (d) => d.status === "COMPLETED" || d.status === "FINALISED",
  );
  const hasActiveTest = diagnosticDepts.some(
    (d) => d.status === "ACTIVE" || d.status === "PENDING",
  );

  return hasCompletedTest && !hasActiveTest && visit.hasPendingResults !== true;
}

/**
 * Check if a department is of a certain kind (with fallback to department name).
 */
export function isDepartmentOfKind(
  dept: VisitDepartment,
  kind: DepartmentKind | keyof typeof DepartmentKind | string,
): boolean {
  if (dept.department?.kind && String(dept.department.kind).toUpperCase() === String(kind).toUpperCase()) {
    return true;
  }
  const name = String(dept.department?.name || "").toUpperCase();
  const targetKind = String(kind).toUpperCase();
  switch (targetKind) {
    case DepartmentKind.LABORATORY:
    case "LABORATORY":
      return name.includes("LAB");
    case DepartmentKind.IMAGING:
    case "IMAGING":
      return name.includes("IMAG") || name.includes("X-RAY") || name.includes("SCAN") || name.includes("RADIO");
    case DepartmentKind.WARD:
    case "WARD":
      return name.includes("WARD") || name.includes("INPATIENT") || name.includes("ADMISSION");
    case DepartmentKind.PHARMACY:
    case "PHARMACY":
      return name.includes("PHARM");
    case DepartmentKind.TRIAGE:
    case "TRIAGE":
      return name.includes("TRIAGE") || name.includes("VITAL");
    case DepartmentKind.CONSULTATION:
    case "CONSULTATION":
      return name.includes("CONSULT") || name.includes("DOCTOR") || name.includes("OPHTHAL");
    default:
      return false;
  }
}

/**
 * 4.1 Clinician Dashboard: "Needs Me"
 * - Patient is newly arrived and unassigned in clinician's department OR assigned to this doctor.
 * - Consultation is actively in progress with this doctor.
 * - Visit sent back from Billing (highlighted with badge).
 * - Lab / Imaging results ready for review.
 */
export function isClinicianNeedsMe(
  visit: Visit,
  doctorId?: string | null,
  userDepartmentIds: string[] = [],
): boolean {
  if (isVisitDischarged(visit) || visit.status === "CANCELLED") return false;

  // 1. Returned from billing has top priority
  if (isVisitReturnedFromBilling(visit)) {
    return true;
  }

  // 2. Results ready from diagnostic services
  if (isVisitResultsReady(visit)) {
    return true;
  }

  const depts = visit.departments || [];
  const consultDepts = depts.filter(
    (d) =>
      d.status !== "CANCELLED" &&
      d.status !== "COMPLETED" &&
      d.status !== "FINALISED",
  );

  // Check if any consultation department needs clinician attention
  return consultDepts.some((dept) => {
    const deptId = String(dept.department?.id || dept.id || "");
    const isUserDept = userDepartmentIds.includes(deptId);
    const processors = (dept as any).processors || [];
    const isAssignedToDoctor = doctorId
      ? processors.some((p: any) => String(p?.id || "") === String(doctorId))
      : false;

    // Awaiting clinician role explicitly
    if (dept.awaitingRole === "CLINICIAN") {
      return isUserDept || isAssignedToDoctor;
    }

    // Pending in doctor's department (waiting room)
    if (dept.status === "PENDING" && isUserDept) {
      return true;
    }

    // Active consultation assigned to this doctor
    if (((dept.status as string) === "ACTIVE" || (dept.status as string) === "IN_PROGRESS") && isAssignedToDoctor) {
      return true;
    }

    // Fallback: If no processors assigned yet and in doctor's department
    if (isUserDept && processors.length === 0) {
      return true;
    }

    return false;
  });
}

/**
 * 4.1 Clinician Dashboard: "In Care"
 * Patient is seen / ongoing, but currently active in another service:
 * - Laboratory (sample/testing)
 * - Medical Imaging (x-ray/scan)
 * - Ward (inpatient admission)
 * - Billing (settling payment)
 */
export function isClinicianInCare(
  visit: Visit,
  doctorId?: string | null,
  userDepartmentIds: string[] = [],
): boolean {
  if (isVisitDischarged(visit) || visit.status === "CANCELLED") return false;

  // If visit needs clinician attention right now, it lands in "Needs Me", not "In Care"
  if (isClinicianNeedsMe(visit, doctorId, userDepartmentIds)) {
    return false;
  }

  // Check parsed locations
  const locations = parseCurrentLocations(visit.currentLocations);
  if (locations.length > 0) {
    const hasExternalLoc = locations.some(
      (loc) =>
        loc.kind === "LABORATORY" ||
        loc.kind === "IMAGING" ||
        loc.kind === "WARD" ||
        loc.kind === "PHARMACY" ||
        loc.status === "BILLING" ||
        loc.awaitingRole === "FINANCE" ||
        loc.awaitingRole === "LAB" ||
        loc.awaitingRole === "IMAGING" ||
        loc.awaitingRole === "WARD",
    );
    if (hasExternalLoc) return true;
  }

  // Check active departments
  const depts = visit.departments || [];
  const activeDepts = depts.filter(
    (d) =>
      d.status !== "CANCELLED" &&
      d.status !== "COMPLETED" &&
      d.status !== "FINALISED",
  );

  return activeDepts.some(
    (d) =>
      isDepartmentOfKind(d, "LABORATORY") ||
      isDepartmentOfKind(d, "IMAGING") ||
      isDepartmentOfKind(d, "WARD") ||
      isDepartmentOfKind(d, "PHARMACY") ||
      d.status === "BILLING",
  );
}

/**
 * 4.1 Clinician Dashboard: "On Hold"
 * Visit or department explicitly paused / on hold.
 */
export function isClinicianOnHold(visit: Visit): boolean {
  if (isVisitDischarged(visit) || visit.status === "CANCELLED") return false;
  if ((visit.status as string) === "PAUSED" || (visit.status as string) === "ON_HOLD") {
    return true;
  }
  const depts = visit.departments || [];
  return depts.some((d) => (d.status as string) === "ON_HOLD");
}

/**
 * Return human-readable live badges and location chips for a visit card.
 */
export function getVisitFlowBadges(visit: Visit): VisitFlowBadge[] {
  const badges: VisitFlowBadge[] = [];

  if (isVisitDischarged(visit)) {
    badges.push({
      id: "discharged",
      label: "Discharged",
      variant: "emerald",
      iconName: "check",
    });
    return badges;
  }

  // 1. Notice: Returned from Billing
  if (isVisitReturnedFromBilling(visit)) {
    badges.push({
      id: "returned_from_billing",
      label: "Returned from Billing",
      variant: "amber",
      iconName: "rotate-ccw",
    });
  }

  // 2. Notice: Diagnostic Results Ready
  if (isVisitResultsReady(visit)) {
    badges.push({
      id: "results_ready",
      label: "Lab: Results Ready",
      variant: "emerald",
      iconName: "flask",
    });
  }

  // 3. Location Chips from currentLocations
  const parsedLocs = parseCurrentLocations(visit.currentLocations);
  if (parsedLocs.length > 0) {
    for (const loc of parsedLocs) {
      if (loc.kind === "LABORATORY" || loc.awaitingRole === "LAB") {
        badges.push({
          id: `loc_lab_${loc.id || "0"}`,
          label: "At Laboratory",
          variant: "sky",
          iconName: "flask",
        });
      } else if (loc.kind === "IMAGING" || loc.awaitingRole === "IMAGING") {
        badges.push({
          id: `loc_imaging_${loc.id || "0"}`,
          label: "At Imaging",
          variant: "purple",
          iconName: "activity",
        });
      } else if (loc.kind === "WARD" || loc.awaitingRole === "WARD") {
        badges.push({
          id: `loc_ward_${loc.id || "0"}`,
          label: "In Ward",
          variant: "teal",
          iconName: "bed",
        });
      } else if (loc.status === "BILLING" || loc.awaitingRole === "FINANCE") {
        badges.push({
          id: `loc_billing_${loc.id || "0"}`,
          label: "At Billing",
          variant: "blue",
          iconName: "receipt",
        });
      }
    }
  } else {
    // Fallback inspection of active departments
    const activeDepts = (visit.departments || []).filter(
      (d) =>
        d.status !== "CANCELLED" &&
        d.status !== "COMPLETED" &&
        d.status !== "FINALISED",
    );
    for (const d of activeDepts) {
      if (isDepartmentOfKind(d, "LABORATORY")) {
        badges.push({
          id: `loc_lab_${d.id}`,
          label: "At Laboratory",
          variant: "sky",
          iconName: "flask",
        });
      } else if (isDepartmentOfKind(d, "IMAGING")) {
        badges.push({
          id: `loc_imaging_${d.id}`,
          label: "At Imaging",
          variant: "purple",
          iconName: "activity",
        });
      } else if (isDepartmentOfKind(d, "WARD")) {
        badges.push({
          id: `loc_ward_${d.id}`,
          label: "In Ward",
          variant: "teal",
          iconName: "bed",
        });
      } else if (d.status === "BILLING") {
        badges.push({
          id: `loc_billing_${d.id}`,
          label: "At Billing",
          variant: "blue",
          iconName: "receipt",
        });
      }
    }
  }

  return badges;
}
