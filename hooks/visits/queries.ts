import { useQuery } from "@apollo/client";
import { useMemo } from "react";
import {
  GET_VISIT_QUERY,
  VISITS_QUERY,
  DASHBOARD_STATS_QUERY,
  LAST_PATIENT_DEPARTMENT_VISIT_QUERY,
} from "../queries";
import type { Visit } from "../types";
import type { LastPatientDepartmentVisitOutput } from "@/lib/api-types";
import {
  mapGqlVisit,
  mapGqlVisitListItem,
  mapGqlLastPatientDepartmentVisitOutput,
} from "@/lib/gql-mappers";
import { normalizeVisitVitalSigns } from "./vital-signs";
import type {
  VisitsQueryData,
  GetVisitQueryData,
  LastPatientDepartmentVisitQueryData,
  VisitFilterInput,
  DashboardStatsData,
} from "./types";

export function useVisits(
  size?: number,
  page?: number,
  filter?: VisitFilterInput,
) {
  const visitDate =
    filter?.fromDate && filter?.toDate
      ? filter.fromDate === filter.toDate
        ? filter.fromDate
        : undefined
      : filter?.fromDate || filter?.toDate;

  const input = {
    ...(filter?.status ? { status: filter.status } : {}),
    ...(filter?.patientName ? { patientName: filter.patientName } : {}),
    ...(visitDate ? { visitDate } : {}),
    page: page ?? 0,
    size: size ?? 20,
  };

  const { data, loading, error, refetch } = useQuery<VisitsQueryData>(
    VISITS_QUERY,
    {
      variables: { input },
      fetchPolicy: "cache-and-network",
    },
  );

  const errorKind = error?.networkError
    ? "network"
    : error?.graphQLErrors?.length
      ? "graphql"
      : null;
  const errorMessage =
    error?.graphQLErrors?.[0]?.message ||
    error?.networkError?.message ||
    error?.message ||
    null;

  const visits: Visit[] = (data?.visits?.data || []).map((v) => {
    const mapped = mapGqlVisitListItem(v);
    mapped.vitalSigns = normalizeVisitVitalSigns(v.vitalSigns || []);
    return mapped;
  });

  return {
    visits,
    totalPages: data?.visits?.pagination?.totalPages || 0,
    totalElements: data?.visits?.pagination?.total || 0,
    loading,
    error: errorMessage,
    errorKind,
    refetch,
  };
}

export function useDashboardStats(
  days: number = 1,
  options?: { skip?: boolean },
) {
  const { data, loading, error, refetch } = useQuery<DashboardStatsData>(
    DASHBOARD_STATS_QUERY,
    {
      variables: { days },
      fetchPolicy: "cache-and-network",
      skip: options?.skip,
    },
  );

  const stats = data?.getDashboardStats?.data || null;

  return {
    stats: stats
      ? {
          totalVisits: Number(stats.totalVisits || 0),
          totalOpen: Number(stats.totalOpen || 0),
          totalCompleted: Number(stats.totalCompleted || 0),
          totalWaitingForBilling: Number(stats.totalWaitingForBilling || 0),
        }
      : null,
    loading,
    error: error?.message || null,
    refetch,
  };
}

export function useVisit(id: string | null) {
  const { data, loading, error, refetch } = useQuery<GetVisitQueryData>(
    GET_VISIT_QUERY,
    {
      variables: { id },
      skip: !id,
      fetchPolicy: "cache-and-network",
    },
  );

  const visitData = data?.visit?.data;
  const visit: Visit | undefined = useMemo(() => {
    if (!visitData) return undefined;
    const mapped = mapGqlVisit(visitData);
    mapped.vitalSigns = normalizeVisitVitalSigns(visitData.vitalSigns || []);
    return mapped;
  }, [visitData]);
  const errorMessage = error?.message || null;

  return {
    visit,
    loading,
    error: errorMessage,
    refetch,
  };
}

export function useLastPatientDepartmentVisit(
  visitId: string | null,
  departmentId: string | null,
  options?: { skip?: boolean },
) {
  const { data, loading, error, refetch } =
    useQuery<LastPatientDepartmentVisitQueryData>(
      LAST_PATIENT_DEPARTMENT_VISIT_QUERY,
      {
        variables: { visitId, departmentId },
        skip: !visitId || !departmentId || options?.skip,
        fetchPolicy: "cache-and-network",
      },
    );

  const result: LastPatientDepartmentVisitOutput | null = useMemo(() => {
    return mapGqlLastPatientDepartmentVisitOutput(
      data?.lastPatientDepartmentVisit?.data || null,
    );
  }, [data]);

  return {
    data: result,
    loading,
    error: error?.message || null,
    refetch,
  };
}
