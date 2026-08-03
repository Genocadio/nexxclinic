import { useMutation } from "@apollo/client";
import {
  ADD_PRODUCT_TO_VISIT_DEPARTMENT_MUTATION,
  REMOVE_VISIT_DEPARTMENT_PRODUCT_MUTATION,
  UPDATE_ACTION_QUANTITY_MUTATION,
  UPDATE_CONSUMABLE_QUANTITY_MUTATION,
  ADD_CHILD_VISIT_DEPARTMENT_MUTATION,
  COMPLETE_VISIT_DEPARTMENT_MUTATION,
  UPDATE_VISIT_DEPARTMENT_STATUS_MUTATION,
  ADD_DEPARTMENT_TO_VISIT_MUTATION,
  CHANGE_VISIT_DEPARTMENT_PROFILE_MUTATION,
  UPDATE_VISIT_DEPARTMENT_PRODUCT_QUANTITY_MUTATION,
  UPDATE_VISIT_DEPARTMENT_PRODUCT_STATUS_MUTATION,
} from "../mutations";
import type { ApiResponse } from "../types";
import { mapGqlVisitDepartment } from "@/lib/gql-mappers";

export function useRemoveActionFromVisitDepartment() {
  const [mutation, { loading, error }] = useMutation(
    REMOVE_VISIT_DEPARTMENT_PRODUCT_MUTATION,
  );
  const removeAction = async (
    visitId: string,
    departmentId: string,
    actionId: string,
  ): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({
        variables: { visitDepartmentProductId: actionId },
      });
      return result.data.removeVisitDepartmentProduct;
    } catch (err) {
      console.error("Remove action error:", err);
      throw err;
    }
  };

  return { removeAction, loading, error };
}

export function useRemoveConsumableFromVisitDepartment() {
  const [mutation, { loading, error }] = useMutation(
    REMOVE_VISIT_DEPARTMENT_PRODUCT_MUTATION,
  );
  const removeConsumable = async (
    visitId: string,
    departmentId: string,
    consumableId: string,
  ): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({
        variables: { visitDepartmentProductId: consumableId },
      });
      return result.data.removeVisitDepartmentProduct;
    } catch (err) {
      console.error("Remove consumable error:", err);
      throw err;
    }
  };

  return { removeConsumable, loading, error };
}

export function useRemoveProductFromVisitDepartment() {
  const [mutation, { loading, error }] = useMutation(
    REMOVE_VISIT_DEPARTMENT_PRODUCT_MUTATION,
  );
  const removeProduct = async (
    visitDepartmentProductId: string,
  ): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({
        variables: { visitDepartmentProductId },
      });
      return result.data.removeVisitDepartmentProduct;
    } catch (err) {
      console.error("Remove product error:", err);
      throw err;
    }
  };

  return { removeProduct, loading, error };
}

export function useUpdateActionQuantity() {
  const [mutation, { loading, error }] = useMutation(
    UPDATE_ACTION_QUANTITY_MUTATION,
  );
  const updateQuantity = async (
    visitId: string,
    departmentId: string,
    itemId: string,
    quantity: number,
  ): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({
        variables: { visitId, departmentId, itemId, quantity },
      });
      const response = result.data.updateActionQuantity;
      if (response.status !== "SUCCESS") {
        const errorMsg =
          response.messages?.[0]?.text ||
          `Update failed with status: ${response.status}`;
        console.error("Update action quantity failed:", errorMsg);
        throw new Error(errorMsg);
      }
      return response;
    } catch (err) {
      console.error("Update action quantity error:", err);
      throw err;
    }
  };

  return { updateQuantity, loading, error };
}

export function useUpdateConsumableQuantity() {
  const [mutation, { loading, error }] = useMutation(
    UPDATE_CONSUMABLE_QUANTITY_MUTATION,
  );
  const updateQuantity = async (
    visitId: string,
    departmentId: string,
    itemId: string,
    quantity: number,
  ): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({
        variables: { visitId, departmentId, itemId, quantity },
      });
      const response = result.data.updateConsumableQuantity;
      if (response.status !== "SUCCESS") {
        const errorMsg =
          response.messages?.[0]?.text ||
          `Update failed with status: ${response.status}`;
        console.error("Update consumable quantity failed:", errorMsg);
        throw new Error(errorMsg);
      }
      return response;
    } catch (err) {
      console.error("Update consumable quantity error:", err);
      throw err;
    }
  };

  return { updateQuantity, loading, error };
}

export function useAddActionToVisitDepartment() {
  const [mutation, { loading, error }] = useMutation(
    ADD_PRODUCT_TO_VISIT_DEPARTMENT_MUTATION,
  );

  const addAction = async (
    visitId: string,
    departmentId: string,
    actionId: string,
    quantity?: number,
  ): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({
        variables: {
          input: {
            visitId,
            departmentId,
            productId: actionId,
            quantity: quantity ?? 1,
            status: "PENDING",
          },
        },
      });
      const payload = result.data?.addVisitDepartmentProduct;
      return {
        status: payload?.status || "ERROR",
        messages: payload?.message
          ? [{ text: payload.message, type: payload.status || "ERROR" }]
          : undefined,
        data: payload?.data
          ? mapGqlVisitDepartment(payload.data)
          : undefined,
      };
    } catch (err) {
      console.error("Add action error:", err);
      throw err;
    }
  };

  return { addAction, loading, error };
}

export function useAddChildVisitDepartment() {
  const [mutation, { loading, error }] = useMutation(
    ADD_CHILD_VISIT_DEPARTMENT_MUTATION,
  );

  const addChildVisitDepartment = async (input: {
    parentVisitDepartmentId: string;
    departmentId: string;
    products: Array<{ productId: string; quantity: number }>;
    processorId?: string;
  }): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({
        variables: {
          input: {
            parentVisitDepartmentId: input.parentVisitDepartmentId,
            departmentId: input.departmentId,
            products: input.products.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
            processorId: input.processorId,
          },
        },
      });
      const payload = result.data?.addChildVisitDepartment;
      return {
        status: payload?.status || "ERROR",
        messages: payload?.message
          ? [{ text: payload.message, type: payload.status || "ERROR" }]
          : undefined,
        data: payload?.data
          ? mapGqlVisitDepartment(payload.data)
          : undefined,
      };
    } catch (err) {
      console.error("Add child visit department error:", err);
      throw err;
    }
  };

  return { addChildVisitDepartment, loading, error };
}

export function useAddConsumableToVisitDepartment() {
  const [mutation, { loading, error }] = useMutation(
    ADD_PRODUCT_TO_VISIT_DEPARTMENT_MUTATION,
  );

  const addConsumable = async (
    visitId: string,
    departmentId: string,
    consumableId: string,
    quantity?: number,
  ): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({
        variables: {
          input: {
            visitId,
            departmentId,
            productId: consumableId,
            quantity: quantity ?? 1,
            status: "PENDING",
          },
        },
      });
      const payload = result.data?.addVisitDepartmentProduct;
      return {
        status: payload?.status || "ERROR",
        messages: payload?.message
          ? [{ text: payload.message, type: payload.status || "ERROR" }]
          : undefined,
        data: payload?.data
          ? mapGqlVisitDepartment(payload.data)
          : undefined,
      };
    } catch (err) {
      console.error("Add consumable error:", err);
      throw err;
    }
  };

  return { addConsumable, loading, error };
}

export function useAddProductToVisitDepartment() {
  const [mutation, { loading, error }] = useMutation(
    ADD_PRODUCT_TO_VISIT_DEPARTMENT_MUTATION,
  );

  const addProduct = async (
    visitId: string,
    departmentId: string,
    productId: string,
    quantity?: number,
  ): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({
        variables: {
          input: {
            visitId,
            departmentId,
            productId,
            quantity: quantity ?? 1,
            status: "PENDING",
          },
        },
      });
      const payload = result.data?.addVisitDepartmentProduct;
      return {
        status: payload?.status || "ERROR",
        messages: payload?.message
          ? [{ text: payload.message, type: payload.status || "ERROR" }]
          : undefined,
        data: payload?.data
          ? mapGqlVisitDepartment(payload.data)
          : undefined,
      };
    } catch (err) {
      console.error("Add product error:", err);
      throw err;
    }
  };

  return { addProduct, loading, error };
}

export function useCompleteVisitDepartment() {
  const [mutation, { loading, error }] = useMutation(
    COMPLETE_VISIT_DEPARTMENT_MUTATION,
  );

  const completeDepartment = async (
    visitId: string,
    departmentId: string,
  ): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({ variables: { visitId, departmentId } });
      return result.data.completeVisitDepartment;
    } catch (err) {
      console.error("Complete department error:", err);
      throw err;
    }
  };

  return { completeDepartment, loading, error };
}

export function useUpdateVisitDepartmentStatus() {
  const [mutation, { loading, error }] = useMutation(
    UPDATE_VISIT_DEPARTMENT_STATUS_MUTATION,
  );

  const updateDepartmentStatus = async (
    visitDepartmentId: string,
    status: "ACTIVE" | "PENDING" | "COMPLETED",
  ): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({
        variables: { input: { visitDepartmentId, status } },
      });
      return result.data.updateVisitDepartmentStatus;
    } catch (err) {
      console.error("Update visit department status error:", err);
      throw err;
    }
  };

  return { updateDepartmentStatus, loading, error };
}

export function useAddDepartmentToVisit() {
  const [mutation, { loading, error }] = useMutation(
    ADD_DEPARTMENT_TO_VISIT_MUTATION,
  );

  const addDepartmentToVisit = async (
    visitId: string,
    departmentId: string,
    processorId?: string | null,
    profileId?: string | null,
  ): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({
        variables: {
          visitId,
          departmentId,
          processorId: processorId || null,
          profileId: profileId || null,
        },
        refetchQueries: ["GetVisits", "GetVisit"],
        awaitRefetchQueries: true,
      });
      return result.data?.addVisitDepartment;
    } catch (err) {
      console.error("Add department to visit error:", err);
      throw err;
    }
  };

  return { addDepartmentToVisit, loading, error };
}

export function useChangeVisitDepartmentProfile() {
  const [mutation, { loading, error }] = useMutation(
    CHANGE_VISIT_DEPARTMENT_PROFILE_MUTATION,
  );

  const changeVisitDepartmentProfile = async (
    visitDepartmentId: string,
    profileId?: string | null,
  ): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({
        variables: {
          visitDepartmentId,
          profileId: profileId || null,
        },
        refetchQueries: ["GetVisits", "GetVisit"],
        awaitRefetchQueries: true,
      });
      const payload = result.data?.changeVisitDepartmentProfile;
      return {
        status: payload?.status || "ERROR",
        message: payload?.message,
        data: payload?.data
          ? mapGqlVisitDepartment(payload.data)
          : undefined,
      };
    } catch (err) {
      console.error("Change visit department profile error:", err);
      throw err;
    }
  };

  return { changeVisitDepartmentProfile, loading, error };
}

export function useUpdateProductQuantity() {
  const [mutation, { loading, error }] = useMutation(
    UPDATE_VISIT_DEPARTMENT_PRODUCT_QUANTITY_MUTATION,
  );

  const updateQuantity = async (
    visitDepartmentProductId: string,
    quantity: number,
  ): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({
        variables: {
          input: {
            visitDepartmentProductId,
            quantity: parseFloat(quantity.toString()),
          },
        },
      });
      const payload = result.data?.updateVisitDepartmentProductQuantity;
      return {
        status: payload?.status || "ERROR",
        message: payload?.message,
        data: payload?.data,
      };
    } catch (err) {
      console.error("Update product quantity error:", err);
      throw err;
    }
  };

  return { updateQuantity, loading, error };
}

export function useUpdateProductStatus() {
  const [mutation, { loading, error }] = useMutation(
    UPDATE_VISIT_DEPARTMENT_PRODUCT_STATUS_MUTATION,
  );

  const updateStatus = async (
    visitDepartmentProductId: string,
    status: string,
  ): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({
        variables: {
          input: {
            visitDepartmentProductId,
            status,
          },
        },
      });
      const payload = result.data?.updateVisitDepartmentProductStatus;
      return {
        status: payload?.status || "ERROR",
        message: payload?.message,
        data: payload?.data,
      };
    } catch (err) {
      console.error("Update product status error:", err);
      throw err;
    }
  };

  return { updateStatus, loading, error };
}
