import { describe, it, expect } from "vitest"
import {
  splitFullName,
  splitWorkerName,
  getPatientDisplayName,
  formatPatientGender,
  getPatientPhone,
} from "./patient-display-utils"
import { Gender, type Patient } from "@/lib/api-types"

describe("splitFullName", () => {
  it("handles empty, null, undefined, or whitespace-only values", () => {
    expect(splitFullName("")).toEqual({ firstName: "", middleName: undefined, lastName: undefined })
    expect(splitFullName("   ")).toEqual({ firstName: "", middleName: undefined, lastName: undefined })
    expect(splitFullName(null)).toEqual({ firstName: "", middleName: undefined, lastName: undefined })
    expect(splitFullName(undefined)).toEqual({ firstName: "", middleName: undefined, lastName: undefined })
  })

  it("handles a single name", () => {
    expect(splitFullName("John")).toEqual({
      firstName: "John",
      middleName: undefined,
      lastName: undefined,
    })
    expect(splitFullName("  Alice  ")).toEqual({
      firstName: "Alice",
      middleName: undefined,
      lastName: undefined,
    })
  })

  it("handles two names into firstName and lastName", () => {
    expect(splitFullName("John Doe")).toEqual({
      firstName: "John",
      middleName: undefined,
      lastName: "Doe",
    })
    expect(splitFullName("  Eric   Habimana  ")).toEqual({
      firstName: "Eric",
      middleName: undefined,
      lastName: "Habimana",
    })
  })

  it("handles three names into firstName, middleName, and lastName", () => {
    expect(splitFullName("Jean Paul Habimana")).toEqual({
      firstName: "Jean",
      middleName: "Paul",
      lastName: "Habimana",
    })
  })

  it("handles four or more names into firstName, middleName (combined), and lastName", () => {
    expect(splitFullName("Jean Pierre Paul Habimana")).toEqual({
      firstName: "Jean",
      middleName: "Pierre Paul",
      lastName: "Habimana",
    })
    expect(splitFullName("Mary Anne Elizabeth Jane Smith")).toEqual({
      firstName: "Mary",
      middleName: "Anne Elizabeth Jane",
      lastName: "Smith",
    })
  })
})

describe("splitWorkerName", () => {
  it("handles empty or whitespace strings", () => {
    expect(splitWorkerName("")).toEqual({ firstName: "", lastName: undefined })
    expect(splitWorkerName(null)).toEqual({ firstName: "", lastName: undefined })
  })

  it("handles a single name", () => {
    expect(splitWorkerName("Eric")).toEqual({
      firstName: "Eric",
      lastName: undefined,
    })
  })

  it("handles two names", () => {
    expect(splitWorkerName("Eric Habimana")).toEqual({
      firstName: "Eric",
      lastName: "Habimana",
    })
  })

  it("handles three or more names by preserving all remaining tokens in lastName", () => {
    expect(splitWorkerName("Dr. Eric Habimana")).toEqual({
      firstName: "Dr.",
      lastName: "Eric Habimana",
    })
    expect(splitWorkerName("Jean Paul Habimana")).toEqual({
      firstName: "Jean",
      lastName: "Paul Habimana",
    })
  })
})

describe("patient-display-utils general helpers", () => {
  const dummyPatient = {
    id: "p-1",
    firstName: "Jean",
    middleName: "Paul",
    lastName: "Habimana",
    gender: Gender.MALE,
    dateOfBirth: "1995-05-15",
    primaryPhoneNumber: "+250788123456",
  } as unknown as Patient

  it("constructs display name correctly", () => {
    expect(getPatientDisplayName(dummyPatient)).toBe("Jean Paul Habimana")
  })

  it("formats gender correctly", () => {
    expect(formatPatientGender(Gender.MALE)).toBe("Male")
    expect(formatPatientGender(Gender.FEMALE)).toBe("Female")
    expect(formatPatientGender(Gender.OTHER)).toBe("Other")
  })

  it("retrieves phone correctly", () => {
    expect(getPatientPhone(dummyPatient)).toBe("+250788123456")
  })
})
