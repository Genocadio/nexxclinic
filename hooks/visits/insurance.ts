import { useMutation } from "@apollo/client";
import {
  LINK_VISIT_INSURANCES_MUTATION,
  UNLINK_VISIT_INSURANCES_MUTATION,
} from "../mutations";
import type { ApiResponse } from "../types";

export function useLinkVisitInsurances() {
  const [mutation, { loading, error }] = useMutation(
    LINK_VISIT_INSURANCES_MUTATION,
  );

  const linkVisitInsurances = async (
    visitId: string,
    insuranceIds: string[],
  ): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({
        variables: {
          visitId,
          insuranceIds,
        },
      });
      return result.data?.linkVisitInsurances;
    } catch (err) {
      console.error("Link visit insurances error:", err);
      throw err;
    }
  };

  return { linkVisitInsurances, loading, error };
}

export function useUnlinkVisitInsurances() {
  const [mutation, { loading, error }] = useMutation(
    UNLINK_VISIT_INSURANCES_MUTATION,
  );

  const unlinkVisitInsurances = async (
    visitId: string,
    insuranceIds: string[],
  ): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({
        variables: {
          visitId,
          insuranceIds,
        },
      });
      return result.data?.unlinkVisitInsurances;
    } catch (err) {
      console.error("Unlink visit insurances error:", err);
      throw err;
    }
  };

  return { unlinkVisitInsurances, loading, error };
}
