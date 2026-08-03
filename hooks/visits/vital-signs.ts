import type { VisitVitalSignsGroup } from "../types";
import { mapGqlWorkerRef } from "@/lib/gql-mappers";

const EMPTY_TIMESTAMP = "";

const toGroupCreatedAt = (value?: string | null) => {
  if (!value) return "unknown";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "unknown" : parsed.toISOString();
};

export const normalizeVisitVitalSigns = (
  vitalSigns: any[] = [],
): VisitVitalSignsGroup[] => {
  if (!Array.isArray(vitalSigns) || vitalSigns.length === 0) return [];

  const hasGroupedShape = Array.isArray(vitalSigns[0]?.measurements);

  if (hasGroupedShape) {
    return vitalSigns
      .map((group: any, index: number) => ({
        id: String(group?.id || group?.createdAt || `group-${index}`),
        createdAt: toGroupCreatedAt(group?.createdAt),
        addedBy: mapGqlWorkerRef(group?.addedBy) ?? null,
        measurements: (group?.measurements || [])
          .map((measurement: any, measurementIndex: number) => ({
            id: String(
              measurement?.id ||
                `${group?.id || group?.createdAt || "group"}-${measurementIndex}`,
            ),
            measurementName: String(measurement?.measurementName || ""),
            value: String(measurement?.value || ""),
            unit: String(measurement?.unit || ""),
            createdAt:
              measurement?.createdAt || group?.createdAt || EMPTY_TIMESTAMP,
          }))
          .filter(
            (measurement: {
              measurementName: string;
              value: string;
              unit: string;
            }) =>
              measurement.measurementName ||
              measurement.value ||
              measurement.unit,
          ),
      }))
      .filter((group) => group.measurements.length > 0)
      .sort((a, b) => {
        if (a.createdAt === "unknown") return 1;
        if (b.createdAt === "unknown") return -1;
        return (
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
        );
      }) as VisitVitalSignsGroup[];
  }

  const grouped = new Map<string, any[]>();
  vitalSigns.forEach((vitalSign: any) => {
    const key = toGroupCreatedAt(vitalSign?.createdAt);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(vitalSign);
  });

  return Array.from(grouped.entries())
    .map(([createdAt, items], index) => ({
      id: `group-${index}-${createdAt}`,
      createdAt,
      measurements: items.map((vitalSign: any, measurementIndex: number) => ({
        id: String(vitalSign?.id || `${createdAt}-${measurementIndex}`),
        measurementName: String(vitalSign?.measurementName || ""),
        value: String(vitalSign?.value || ""),
        unit: String(vitalSign?.unit || ""),
        createdAt: vitalSign?.createdAt || createdAt || EMPTY_TIMESTAMP,
      })),
      addedBy: mapGqlWorkerRef(items[0]?.addedBy) ?? null,
    }))
    .sort((a, b) => {
      if (a.createdAt === "unknown") return 1;
      if (b.createdAt === "unknown") return -1;
      return (
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
      );
    });
};
