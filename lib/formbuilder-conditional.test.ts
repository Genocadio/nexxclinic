import { describe, it, expect } from "vitest";
import {
  shouldShowBlock,
  getConditionSummary,
  type ProductItem,
} from "./formbuilder-conditional";
import type { FormBlock } from "./formbuilder-storage";
import { shouldRenderBlock } from "../components/formbuilder/renderer/utils";

describe("formbuilder-conditional", () => {
  const parentBlock: FormBlock = {
    id: "block_products_1",
    type: "product_listener",
    label: "Consultation Products",
  };

  const targetBlock: FormBlock = {
    id: "block_target_1",
    type: "text_input",
    label: "Medication Details",
    conditionalRendering: {
      dependsOn: "block_products_1",
      condition: "hasItem",
      value: "prod_paracetamol_123",
      itemLabel: "Paracetamol 500mg",
    },
  };

  const allBlocks: FormBlock[] = [parentBlock, targetBlock];

  describe("getConditionSummary", () => {
    it("renders human-friendly label when itemLabel is present", () => {
      const summary = getConditionSummary(targetBlock.conditionalRendering!, allBlocks);
      expect(summary).toBe('"Consultation Products" (products) has "Paracetamol 500mg"');
    });

    it("falls back to value when itemLabel is missing", () => {
      const summary = getConditionSummary(
        {
          dependsOn: "block_products_1",
          condition: "hasItem",
          value: "prod_ecg_999",
        },
        allBlocks,
      );
      expect(summary).toBe('"Consultation Products" (products) has "prod_ecg_999"');
    });

    it("renders itemType summary when type filter is set", () => {
      const summary = getConditionSummary(
        {
          dependsOn: "block_products_1",
          condition: "hasItem",
          itemType: "consumable",
        },
        allBlocks,
      );
      expect(summary).toBe('"Consultation Products" (products) has a consumable');
    });

    it("renders any product summary when value and itemType are absent", () => {
      const summary = getConditionSummary(
        {
          dependsOn: "block_products_1",
          condition: "hasItem",
        },
        allBlocks,
      );
      expect(summary).toBe('"Consultation Products" (products) has any product');
    });
  });

  describe("shouldShowBlock", () => {
    it("shows block when matching product ID is in fieldActions", () => {
      const fieldActions: Record<string, ProductItem[]> = {
        block_products_1: [
          {
            id: "visit-prod-1",
            catalogProductId: "prod_paracetamol_123",
            name: "Paracetamol 500mg",
            type: "DRUG",
          },
        ],
      };

      const result = shouldShowBlock(targetBlock, {}, fieldActions);
      expect(result).toBe(true);
    });

    it("shows block when matching product name / itemLabel is present", () => {
      const fieldActions: Record<string, ProductItem[]> = {
        block_products_1: [
          {
            id: "visit-prod-1",
            backendId: "line-88",
            name: "Paracetamol 500mg",
            type: "DRUG",
          },
        ],
      };

      const result = shouldShowBlock(targetBlock, {}, fieldActions);
      expect(result).toBe(true);
    });

    it("hides block when no matching product is present", () => {
      const fieldActions: Record<string, ProductItem[]> = {
        block_products_1: [
          {
            id: "visit-prod-2",
            catalogProductId: "prod_amoxicillin_456",
            name: "Amoxicillin 250mg",
            type: "DRUG",
          },
        ],
      };

      const result = shouldShowBlock(targetBlock, {}, fieldActions);
      expect(result).toBe(false);
    });

    it("respects product itemType filter", () => {
      const consumableBlock: FormBlock = {
        id: "block_consumable_target",
        type: "textarea_input",
        label: "Consumables Notes",
        conditionalRendering: {
          dependsOn: "block_products_1",
          condition: "hasItem",
          itemType: "consumable",
        },
      };

      // Actions only
      const onlyActions: Record<string, ProductItem[]> = {
        block_products_1: [
          {
            id: "act-1",
            name: "Consultation",
            type: "MEDICAL_ACT",
          },
        ],
      };
      expect(shouldShowBlock(consumableBlock, {}, onlyActions)).toBe(false);

      // With consumable
      const withConsumable: Record<string, ProductItem[]> = {
        block_products_1: [
          {
            id: "act-1",
            name: "Consultation",
            type: "MEDICAL_ACT",
          },
          {
            id: "cons-1",
            name: "Syringe 5ml",
            type: "CONSUMABLE_DEVICE",
          },
        ],
      };
      expect(shouldShowBlock(consumableBlock, {}, withConsumable)).toBe(true);
    });
  });

  describe("shouldRenderBlock with extension handlers", () => {
    it("evaluates live products directly from getBlockHandlers resolver", () => {
      const getBlockHandlers = (block: FormBlock) => {
        if (block.id === "block_products_1" || block.type === "product_listener") {
          return {
            productActions: [
              {
                id: "visit-prod-10",
                name: "Paracetamol 500mg",
                type: "action" as const,
                quantity: 1,
                rawData: {
                  product: {
                    id: "prod_paracetamol_123",
                    name: "Paracetamol 500mg",
                  },
                },
              },
            ],
          };
        }
        return null;
      };

      const isVisible = shouldRenderBlock(
        targetBlock,
        {},
        getBlockHandlers,
        allBlocks,
      );
      expect(isVisible).toBe(true);
    });

    it("evaluates to false when product has not been added to the visit", () => {
      const getBlockHandlers = () => ({
        productActions: [],
      });

      const isVisible = shouldRenderBlock(
        targetBlock,
        {},
        getBlockHandlers,
        allBlocks,
      );
      expect(isVisible).toBe(false);
    });
  });
});
