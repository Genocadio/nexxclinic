import type { FormBlock } from "@/lib/formbuilder-storage";
import type { FormRendererExtension, MedicalBlockHandlers } from "./types";

export type {
  FormRendererExtension,
  FormRendererExtensionContext,
  MedicalBlockHandlers,
} from "./types";

export { useConsultationVisitExtension } from "./consultation-visit";

export function mergeBlockHandlers(
  extensions: FormRendererExtension[] | undefined,
  block: FormBlock,
): MedicalBlockHandlers | undefined {
  if (!extensions?.length) return undefined;

  let merged: MedicalBlockHandlers | undefined;
  for (const ext of extensions) {
    const handlers = ext.getBlockHandlers?.(block);
    if (handlers) {
      merged = { ...merged, ...handlers };
    }
  }
  return merged;
}

/** Logic-only helper: resolve per-block handlers from extensions. */
export function createExtensionBlockHandlersResolver(
  extensions: FormRendererExtension[] | undefined,
) {
  return (block: FormBlock) => mergeBlockHandlers(extensions, block);
}
