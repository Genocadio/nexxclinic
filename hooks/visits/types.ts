import type { SearchVisitsInput } from "../types";
import type { GqlVisit, GqlVisitDepartment } from "@/lib/gql-mappers";

/** @deprecated Use SearchVisitsInput from api-input-types */
export type VisitFilterInput = SearchVisitsInput & {
  fromDate?: string;
  toDate?: string;
};

export interface VisitsQueryData {
  visits: {
    status: string;
    message?: string;
    data: GqlVisit[];
    pagination?: {
      total: number;
      totalPages: number;
    };
  };
}

export interface GetVisitQueryData {
  visit: {
    status: string;
    message?: string;
    data: GqlVisit;
  };
}

export interface LastPatientDepartmentVisitQueryData {
  lastPatientDepartmentVisit: {
    status: string;
    message?: string;
    data?: {
      lastVisit?: GqlVisit | null;
      lastDepartmentVisit?: {
        visitId?: string | null;
        visitDepartment?: GqlVisitDepartment | null;
      } | null;
    } | null;
  };
}

export interface CreateVisitPayload {
  createVisit: {
    status: string;
    message?: string;
    data?: GqlVisit | null;
  };
}

export interface DashboardStatsData {
  getDashboardStats: {
    status: string;
    message?: string;
    data?: {
      totalVisits: number;
      totalOpen: number;
      totalCompleted: number;
      totalWaitingForBilling: number;
    } | null;
  };
}
