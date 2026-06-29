import { useMemo } from "react";
import { useQuery } from "@apollo/client";

import { SEARCH_WORKERS_QUERY } from "@/hooks/queries/workers";

type SearchWorkersVars = {
  name?: string;
  role?: string;
  activeOnly?: boolean;
  departmentId?: string;
};

export function useSearchWorkers(variables: SearchWorkersVars) {
  const { data, loading, error, refetch } = useQuery(SEARCH_WORKERS_QUERY, {
    variables,
    skip: !variables?.name || String(variables.name).trim().length < 2,
    fetchPolicy: "network-only",
  });

  const workers = useMemo(() => {
    const list = data?.searchWorkers?.data;
    return Array.isArray(list) ? list : [];
  }, [data]);

  return {
    workers,
    loading,
    error,
    refetch,
  };
}
