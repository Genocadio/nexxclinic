export interface PaidAmountInputValue {
  displayValue: string
  amount: number
}

export function parsePaidAmountInput(
  rawValue: string,
  maximum: number,
): PaidAmountInputValue | null {
  if (rawValue === "") {
    return { displayValue: "", amount: 0 }
  }

  const parsed = Number(rawValue)
  if (!Number.isFinite(parsed)) return null

  const amount = Math.min(maximum, Math.max(0, parsed))
  return {
    displayValue: amount === parsed ? rawValue : String(amount),
    amount,
  }
}
