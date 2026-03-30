import { NextResponse } from "next/server"
import { insuranceStore, getNextId, type InsuranceRecord } from "./data"

export async function GET() {
  return NextResponse.json({
    data: insuranceStore,
    message: { type: "SUCCESS", content: "Insurances fetched" },
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const items: Partial<InsuranceRecord>[] = Array.isArray(body) ? body : [body]

    const created: InsuranceRecord[] = []
    for (const item of items) {
      if (!item.name || !item.acronym || item.coveragePercentage == null) {
        return NextResponse.json(
          { message: { type: "ERROR", content: "name, acronym and coveragePercentage are required" } },
          { status: 400 }
        )
      }
      const record: InsuranceRecord = {
        id: getNextId(),
        name: item.name,
        acronym: item.acronym,
        coveragePercentage: Number(item.coveragePercentage),
      }
      insuranceStore.push(record)
      created.push(record)
    }

    return NextResponse.json({
      data: created,
      message: { type: "SUCCESS", content: "Insurance created" },
    }, { status: 201 })
  } catch (error) {
    console.error("Insurance POST error", error)
    return NextResponse.json(
      { message: { type: "ERROR", content: "Failed to create insurance" } },
      { status: 500 }
    )
  }
}
