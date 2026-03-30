export interface InsuranceRecord {
  id: number
  name: string
  acronym: string
  coveragePercentage: number
}

// In-memory store for demo purposes. In production, replace with persistent storage.
let nextId = 3
export const insuranceStore: InsuranceRecord[] = [
  { id: 1, name: "Rwanda Social Security Board", acronym: "RSSB", coveragePercentage: 12 },
  { id: 2, name: "Private Health", acronym: "PRV", coveragePercentage: 80 },
]

export const getNextId = () => nextId++
