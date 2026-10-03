import { describe, expect, it } from "vitest"
import {
  RWANDA_PROVINCES,
  findRwandaCellInfo,
  findRwandaVillageInfo,
  getAllRwandaCells,
  getAllRwandaDistricts,
  getAllRwandaSectors,
  getAllRwandaVillages,
  getCellsForSelection,
  getDistrictsForSelection,
  getRwandaCells,
  getRwandaDistricts,
  getRwandaSectors,
  getRwandaVillages,
  getSectorsForSelection,
  getVillagesForSelection,
  isRwandaSelected,
} from "@/lib/location-data"

describe("location-data helpers", () => {
  it("identifies Rwanda properly", () => {
    expect(isRwandaSelected("Rwanda")).toBe(true)
    expect(isRwandaSelected("rwanda")).toBe(true)
    expect(isRwandaSelected("Uganda")).toBe(false)
    expect(isRwandaSelected(null)).toBe(false)
  })

  it("lists all 5 provinces", () => {
    expect(RWANDA_PROVINCES).toHaveLength(5)
    expect(RWANDA_PROVINCES).toContain("Kigali City")
    expect(RWANDA_PROVINCES).toContain("Northern Province")
  })

  it("retrieves districts for a specific province", () => {
    const kigaliDistricts = getRwandaDistricts("Kigali City")
    expect(kigaliDistricts).toContain("Gasabo")
    expect(kigaliDistricts).toContain("Kicukiro")
    expect(kigaliDistricts).toContain("Nyarugenge")
    expect(kigaliDistricts).not.toContain("Musanze")
  })

  it("retrieves sectors for a specific province and district", () => {
    const gasaboSectors = getRwandaSectors("Kigali City", "Gasabo")
    expect(gasaboSectors).toContain("Remera")
    expect(gasaboSectors).toContain("Gisozi")
    expect(gasaboSectors).toContain("Kacyiru")
  })

  it("retrieves cells for a specific sector", () => {
    const remeraCells = getRwandaCells("Kigali City", "Gasabo", "Remera")
    expect(remeraCells).toContain("Nyabisindu")
    expect(remeraCells).toContain("Rukiri I")
    expect(remeraCells).toContain("Rukiri II")
    expect(remeraCells).toContain("Nyarutarama")
  })

  it("retrieves villages for a specific cell", () => {
    const rukiri1Villages = getRwandaVillages("Kigali City", "Gasabo", "Remera", "Rukiri I")
    expect(rukiri1Villages).toContain("Kisimenti")
    expect(rukiri1Villages).toContain("Agashyitsi")
    expect(rukiri1Villages).toContain("Amajyambere")
    expect(rukiri1Villages).toContain("Izuba")
  })

  it("flattens full national lists", () => {
    expect(getAllRwandaDistricts()).toHaveLength(30)
    expect(getAllRwandaSectors().length).toBeGreaterThanOrEqual(416)
    expect(getAllRwandaCells().length).toBeGreaterThanOrEqual(2140)
    expect(getAllRwandaVillages().length).toBeGreaterThanOrEqual(14800)
  })

  it("findRwandaVillageInfo auto-resolves full parent hierarchy", () => {
    const info = findRwandaVillageInfo("Kisimenti")
    expect(info).toBeDefined()
    expect(info?.village).toBe("Kisimenti")
    expect(info?.cell).toBe("Rukiri I")
    expect(info?.sector).toBe("Remera")
    expect(info?.district).toBe("Gasabo")
    expect(info?.province).toBe("Kigali City")
  })

  it("findRwandaCellInfo auto-resolves parent hierarchy", () => {
    const info = findRwandaCellInfo("Nyabisindu", "Remera")
    expect(info).toBeDefined()
    expect(info?.cell).toBe("Nyabisindu")
    expect(info?.sector).toBe("Remera")
    expect(info?.district).toBe("Gasabo")
    expect(info?.province).toBe("Kigali City")
  })

  it("getCellsForSelection filters when sector is chosen", () => {
    const cells = getCellsForSelection("Kigali City", "Gasabo", "Remera")
    expect(cells.length).toBe(4)
    expect(cells.map((c) => c.cell)).toEqual(["Nyabisindu", "Nyarutarama", "Rukiri I", "Rukiri II"])
  })

  it("getVillagesForSelection filters when cell is chosen", () => {
    const villages = getVillagesForSelection("Kigali City", "Gasabo", "Remera", "Rukiri I")
    expect(villages.length).toBe(7)
    expect(villages.some((v) => v.village === "Kisimenti")).toBe(true)
  })
})
