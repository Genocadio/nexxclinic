import rawLocations from "@devrw/rwanda-location/dist/db/locations.json"

export const COUNTRIES = [
  "Rwanda",
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Côte d'Ivoire",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Democratic Republic of the Congo",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kosovo",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
]

export const RWANDA_PROVINCES = [
  "Kigali City",
  "Eastern Province",
  "Northern Province",
  "Southern Province",
  "Western Province",
] as const

export type RwandaProvince = (typeof RWANDA_PROVINCES)[number]

const PROVINCE_MAP: Record<string, string> = {
  KIGALI: "Kigali City",
  EAST: "Eastern Province",
  NORTH: "Northern Province",
  SOUTH: "Southern Province",
  WEST: "Western Province",
  "Kigali City": "Kigali City",
  "Eastern Province": "Eastern Province",
  "Northern Province": "Northern Province",
  "Southern Province": "Southern Province",
  "Western Province": "Western Province",
}

function formatNameSpacing(str: string): string {
  if (!str) return ""
  return str
    .replace(/([a-zA-Z]+?)(I{1,3}|Ii|Il|IV|V|VI{0,3})$/, (_m, p1, p2) => {
      const roman = p2.toUpperCase().replace(/L/g, "I")
      return `${p1} ${roman}`
    })
    .trim()
}

export interface RwandaDistrictOption {
  district: string
  province: string
}

export interface RwandaSectorOption {
  sector: string
  district: string
  province: string
}

export interface RwandaCellOption {
  cell: string
  sector: string
  district: string
  province: string
}

export interface RwandaVillageOption {
  village: string
  cell: string
  sector: string
  district: string
  province: string
}

// ── Build normalized in-memory indexes ───────────────────────────────────────

interface IndexedCell {
  cell: string
  sector: string
  district: string
  province: string
  villages: string[]
}

interface IndexedSector {
  sector: string
  district: string
  province: string
  cells: Map<string, IndexedCell>
}

interface IndexedDistrict {
  district: string
  province: string
  sectors: Map<string, IndexedSector>
}

interface IndexedProvince {
  province: string
  districts: Map<string, IndexedDistrict>
}

const normKey = (s?: string | null) => s?.toLowerCase().replace(/[\s\-_]/g, "") || ""

const hierarchy = new Map<string, IndexedProvince>()
const allDistrictsList: RwandaDistrictOption[] = []
const allSectorsList: RwandaSectorOption[] = []
const allCellsList: RwandaCellOption[] = []
const allVillagesList: RwandaVillageOption[] = []

// Direct O(1) lookup maps by normalized name
const villageLookup = new Map<string, RwandaVillageOption[]>()
const cellLookup = new Map<string, RwandaCellOption[]>()
const sectorLookup = new Map<string, RwandaSectorOption[]>()
const districtLookup = new Map<string, RwandaDistrictOption[]>()

// Pre-computed cached selection arrays
const districtsByProvince = new Map<string, RwandaDistrictOption[]>()
const sectorsByProvince = new Map<string, RwandaSectorOption[]>()
const sectorsByDistrict = new Map<string, RwandaSectorOption[]>()
const sectorsByProvAndDist = new Map<string, RwandaSectorOption[]>()
const cellsBySectorKey = new Map<string, RwandaCellOption[]>()
const villagesByCellKey = new Map<string, RwandaVillageOption[]>()

// Initialize provinces
for (const p of RWANDA_PROVINCES) {
  hierarchy.set(p, { province: p, districts: new Map() })
}

// Process 14,842 official locations in a single pass
for (const raw of rawLocations) {
  const province = PROVINCE_MAP[raw.province_name] || raw.province_name
  const district = raw.district_name
  const sector = raw.sector_name
  const cell = formatNameSpacing(raw.cell_name)
  const village = formatNameSpacing(raw.village_name)

  let provObj = hierarchy.get(province)
  if (!provObj) {
    provObj = { province, districts: new Map() }
    hierarchy.set(province, provObj)
  }

  let distObj = provObj.districts.get(district)
  if (!distObj) {
    distObj = { district, province, sectors: new Map() }
    provObj.districts.set(district, distObj)
    const dOpt: RwandaDistrictOption = { district, province }
    allDistrictsList.push(dOpt)
    
    // Add to district lookup
    const dKey = normKey(district)
    const existingD = districtLookup.get(dKey) || []
    existingD.push(dOpt)
    districtLookup.set(dKey, existingD)
  }

  let sectObj = distObj.sectors.get(sector)
  if (!sectObj) {
    sectObj = { sector, district, province, cells: new Map() }
    distObj.sectors.set(sector, sectObj)
    const sOpt: RwandaSectorOption = { sector, district, province }
    allSectorsList.push(sOpt)

    // Add to sector lookup
    const sKey = normKey(sector)
    const existingS = sectorLookup.get(sKey) || []
    existingS.push(sOpt)
    sectorLookup.set(sKey, existingS)
  }

  let cellObj = sectObj.cells.get(cell)
  if (!cellObj) {
    cellObj = { cell, sector, district, province, villages: [] }
    sectObj.cells.set(cell, cellObj)
    const cOpt: RwandaCellOption = { cell, sector, district, province }
    allCellsList.push(cOpt)

    // Add to cell lookup
    const cKey = normKey(cell)
    const existingC = cellLookup.get(cKey) || []
    existingC.push(cOpt)
    cellLookup.set(cKey, existingC)
  }

  if (!cellObj.villages.includes(village)) {
    cellObj.villages.push(village)
    const vOpt: RwandaVillageOption = { village, cell, sector, district, province }
    allVillagesList.push(vOpt)

    // Add to village lookup
    const vKey = normKey(village)
    const existingV = villageLookup.get(vKey) || []
    existingV.push(vOpt)
    villageLookup.set(vKey, existingV)
  }
}

// Sort all global lists once at startup
allDistrictsList.sort((a, b) => a.district.localeCompare(b.district))
allSectorsList.sort((a, b) => a.sector.localeCompare(b.sector))
allCellsList.sort((a, b) => a.cell.localeCompare(b.cell))
allVillagesList.sort((a, b) => a.village.localeCompare(b.village))

// Pre-build all hierarchical selection caches
for (const [provName, provObj] of hierarchy.entries()) {
  const pDistricts: RwandaDistrictOption[] = []
  const pSectors: RwandaSectorOption[] = []

  for (const [distName, distObj] of provObj.districts.entries()) {
    pDistricts.push({ district: distName, province: provName })

    const dSectors: RwandaSectorOption[] = []
    for (const [sectName, sectObj] of distObj.sectors.entries()) {
      const sOpt: RwandaSectorOption = { sector: sectName, district: distName, province: provName }
      dSectors.push(sOpt)
      pSectors.push(sOpt)

      const sCells: RwandaCellOption[] = []
      for (const [cellName, cellObj] of sectObj.cells.entries()) {
        const cOpt: RwandaCellOption = { cell: cellName, sector: sectName, district: distName, province: provName }
        sCells.push(cOpt)

        const cVillages: RwandaVillageOption[] = cellObj.villages.map((v) => ({
          village: v,
          cell: cellName,
          sector: sectName,
          district: distName,
          province: provName,
        }))
        cVillages.sort((a, b) => a.village.localeCompare(b.village))
        villagesByCellKey.set(`${provName}::${distName}::${sectName}::${cellName}`, cVillages)
        villagesByCellKey.set(`*::*::${sectName}::${cellName}`, cVillages)
        villagesByCellKey.set(`*::*::*::${cellName}`, cVillages)
      }
      sCells.sort((a, b) => a.cell.localeCompare(b.cell))
      cellsBySectorKey.set(`${provName}::${distName}::${sectName}`, sCells)
      cellsBySectorKey.set(`*::${distName}::${sectName}`, sCells)
      cellsBySectorKey.set(`*::*::${sectName}`, sCells)
    }

    dSectors.sort((a, b) => a.sector.localeCompare(b.sector))
    sectorsByDistrict.set(distName, dSectors)
    sectorsByProvAndDist.set(`${provName}::${distName}`, dSectors)
  }

  pDistricts.sort((a, b) => a.district.localeCompare(b.district))
  pSectors.sort((a, b) => a.sector.localeCompare(b.sector))
  districtsByProvince.set(provName, pDistricts)
  sectorsByProvince.set(provName, pSectors)
}

// ── Hierarchy querying helpers ──────────────────────────────────────────────

export function getRwandaDistricts(province?: string | null): string[] {
  if (!province) return allDistrictsList.map((d) => d.district)
  const cached = districtsByProvince.get(province)
  return cached ? cached.map((d) => d.district) : []
}

export function getRwandaSectors(
  province?: string | null,
  district?: string | null,
): string[] {
  if (province && district) {
    const cached = sectorsByProvAndDist.get(`${province}::${district}`)
    return cached ? cached.map((s) => s.sector) : []
  }
  if (district) {
    const cached = sectorsByDistrict.get(district)
    return cached ? cached.map((s) => s.sector) : []
  }
  if (province) {
    const cached = sectorsByProvince.get(province)
    return cached ? cached.map((s) => s.sector) : []
  }
  return allSectorsList.map((s) => s.sector)
}

export function getRwandaCells(
  province?: string | null,
  district?: string | null,
  sector?: string | null,
): string[] {
  if (!sector) return []
  if (province && district) {
    const cached = cellsBySectorKey.get(`${province}::${district}::${sector}`)
    if (cached) return cached.map((c) => c.cell)
  }
  if (district) {
    const cached = cellsBySectorKey.get(`*::${district}::${sector}`)
    if (cached) return cached.map((c) => c.cell)
  }
  const cached = cellsBySectorKey.get(`*::*::${sector}`)
  return cached ? cached.map((c) => c.cell) : []
}

export function getRwandaVillages(
  province?: string | null,
  district?: string | null,
  sector?: string | null,
  cell?: string | null,
): string[] {
  if (!cell) return []
  if (province && district && sector) {
    const cached = villagesByCellKey.get(`${province}::${district}::${sector}::${cell}`)
    if (cached) return cached.map((v) => v.village)
  }
  if (sector) {
    const cached = villagesByCellKey.get(`*::*::${sector}::${cell}`)
    if (cached) return cached.map((v) => v.village)
  }
  const cached = villagesByCellKey.get(`*::*::*::${cell}`)
  return cached ? cached.map((v) => v.village) : []
}

// ── Smart Selection List Helpers (O(1) Cached) ─────────────────────────────

export function getAllRwandaDistricts(): RwandaDistrictOption[] {
  return allDistrictsList
}

export function getAllRwandaSectors(): RwandaSectorOption[] {
  return allSectorsList
}

export function getAllRwandaCells(): RwandaCellOption[] {
  return allCellsList
}

export function getAllRwandaVillages(): RwandaVillageOption[] {
  return allVillagesList
}

export function getDistrictsForSelection(
  province?: string | null,
): RwandaDistrictOption[] {
  if (province) {
    return districtsByProvince.get(province) || allDistrictsList
  }
  return allDistrictsList
}

export function getSectorsForSelection(
  province?: string | null,
  district?: string | null,
): RwandaSectorOption[] {
  if (province && district) {
    return sectorsByProvAndDist.get(`${province}::${district}`) || allSectorsList
  }
  if (district) {
    return sectorsByDistrict.get(district) || allSectorsList
  }
  if (province) {
    return sectorsByProvince.get(province) || allSectorsList
  }
  return allSectorsList
}

export function getCellsForSelection(
  province?: string | null,
  district?: string | null,
  sector?: string | null,
): RwandaCellOption[] {
  if (province && district && sector) {
    const cached = cellsBySectorKey.get(`${province}::${district}::${sector}`)
    if (cached) return cached
  }
  if (district && sector) {
    const cached = cellsBySectorKey.get(`*::${district}::${sector}`)
    if (cached) return cached
  }
  if (sector) {
    const cached = cellsBySectorKey.get(`*::*::${sector}`)
    if (cached) return cached
  }
  return allCellsList
}

export function getVillagesForSelection(
  province?: string | null,
  district?: string | null,
  sector?: string | null,
  cell?: string | null,
): RwandaVillageOption[] {
  if (province && district && sector && cell) {
    const cached = villagesByCellKey.get(`${province}::${district}::${sector}::${cell}`)
    if (cached) return cached
  }
  if (sector && cell) {
    const cached = villagesByCellKey.get(`*::*::${sector}::${cell}`)
    if (cached) return cached
  }
  if (cell) {
    const cached = villagesByCellKey.get(`*::*::*::${cell}`)
    if (cached) return cached
  }
  return allVillagesList
}

// ── Smart Auto-Fill Fast O(1) Lookup Finders ─────────────────────────────────

export function findRwandaVillageInfo(
  village: string,
  cell?: string | null,
  sector?: string | null,
  district?: string | null,
  province?: string | null,
): RwandaVillageOption | undefined {
  const vKey = normKey(village)
  if (!vKey) return undefined

  const matches = villageLookup.get(vKey)
  if (!matches || matches.length === 0) return undefined

  if (matches.length === 1 && !cell && !sector && !district && !province) {
    return matches[0]
  }

  const cKey = normKey(cell)
  const sKey = normKey(sector)
  const dKey = normKey(district)
  const pKey = normKey(province)

  return matches.find((item) => {
    if (cKey && normKey(item.cell) !== cKey) return false
    if (sKey && normKey(item.sector) !== sKey) return false
    if (dKey && normKey(item.district) !== dKey) return false
    if (pKey && normKey(item.province) !== pKey) return false
    return true
  }) || matches[0]
}

export function findRwandaCellInfo(
  cell: string,
  sector?: string | null,
  district?: string | null,
  province?: string | null,
): RwandaCellOption | undefined {
  const cKey = normKey(cell)
  if (!cKey) return undefined

  const matches = cellLookup.get(cKey)
  if (!matches || matches.length === 0) return undefined

  if (matches.length === 1 && !sector && !district && !province) {
    return matches[0]
  }

  const sKey = normKey(sector)
  const dKey = normKey(district)
  const pKey = normKey(province)

  return matches.find((item) => {
    if (sKey && normKey(item.sector) !== sKey) return false
    if (dKey && normKey(item.district) !== dKey) return false
    if (pKey && normKey(item.province) !== pKey) return false
    return true
  }) || matches[0]
}

export function findRwandaSectorInfo(
  sector: string,
  district?: string | null,
  province?: string | null,
): RwandaSectorOption | undefined {
  const sKey = normKey(sector)
  if (!sKey) return undefined

  const matches = sectorLookup.get(sKey)
  if (!matches || matches.length === 0) return undefined

  if (matches.length === 1 && !district && !province) {
    return matches[0]
  }

  const dKey = normKey(district)
  const pKey = normKey(province)

  return matches.find((item) => {
    if (dKey && normKey(item.district) !== dKey) return false
    if (pKey && normKey(item.province) !== pKey) return false
    return true
  }) || matches[0]
}

export function isRwandaSelected(country: string | null | undefined): boolean {
  return country?.toLowerCase() === "rwanda"
}

