/**
 * form-builder-types.ts - Shared types for the form builder (admin forms page,
 * FieldEditor and FormCatalogPreview). Previously defined inline in
 * app/admin/forms/page.tsx; extracted so the decomposed components can share
 * them.
 */
import type { FormAction, FormField, FormSection } from "@/lib/form-storage";

export type BackendFormStatus = "DRAFT" | "FINAL";

export interface BackendForm {
  id: string;
  title: string;
  description?: string;
  status: BackendFormStatus;
  version?: string;
  sections?: FormSection[];
  fields?: FormField[];
  actions?: FormAction[];
}

export interface BackendFormListItem {
  id: string;
  title: string;
  status: BackendFormStatus;
  version?: string;
  createdAt?: string;
  updatedAt?: string;
}
