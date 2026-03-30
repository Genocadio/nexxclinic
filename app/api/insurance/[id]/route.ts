import { NextResponse } from "next/server"
import { insuranceStore, type InsuranceRecord } from "../data"

const findIndexById = (id: number) => insuranceStore.findIndex(item => item.id === id)

export async function PUT(_req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const idx = findIndexById(id)
  if (idx === -1) {
    return NextResponse.json({ message: { type: "ERROR", content: "Insurance not found" } }, { status: 404 })
  }

  try {
    const payload = await _req.json() as Partial<InsuranceRecord>
    if (!payload.name || !payload.acronym || payload.coveragePercentage == null) {
      return NextResponse.json(
        { message: { type: "ERROR", content: "name, acronym and coveragePercentage are required" } },
        { status: 400 }
      )
    }
    insuranceStore[idx] = {
      ...insuranceStore[idx],
      name: payload.name,
      acronym: payload.acronym,
      coveragePercentage: Number(payload.coveragePercentage),
    }

    return NextResponse.json({
      data: insuranceStore[idx],
      message: { type: "SUCCESS", content: "Insurance updated" },
    })
  } catch (error) {
    console.error("Insurance PUT error", error)
    return NextResponse.json({ message: { type: "ERROR", content: "Failed to update insurance" } }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const idx = findIndexById(id)
  if (idx === -1) {
    return NextResponse.json({ message: { type: "ERROR", content: "Insurance not found" } }, { status: 404 })
  }
  const removed = insuranceStore.splice(idx, 1)[0]
  return NextResponse.json({ data: removed, message: { type: "SUCCESS", content: "Insurance deleted" } })
}
