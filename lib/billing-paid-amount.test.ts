import { describe, expect, it } from "vitest"
import { parsePaidAmountInput } from "./billing-paid-amount"

describe("paid amount input", () => {
  it("keeps an empty input empty while treating it as zero for billing", () => {
    expect(parsePaidAmountInput("", 1000)).toEqual({
      displayValue: "",
      amount: 0,
    })
  })

  it("preserves valid input text and its numeric amount", () => {
    expect(parsePaidAmountInput("12.50", 1000)).toEqual({
      displayValue: "12.50",
      amount: 12.5,
    })
  })

  it("clamps values below zero and above the total", () => {
    expect(parsePaidAmountInput("-5", 1000)).toEqual({
      displayValue: "0",
      amount: 0,
    })
    expect(parsePaidAmountInput("1500", 1000)).toEqual({
      displayValue: "1000",
      amount: 1000,
    })
  })
})
