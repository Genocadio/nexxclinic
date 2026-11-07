/**
 * Modified Early Warning Score (MEWS) & Abnormal Vital Signs Alert Engine
 * 
 * Provides automated clinical decision support by flagging abnormal vital signs:
 * - 🔴 Hypertension Alert (BP ≥ 140/90 mmHg, Hypertensive Crisis ≥ 180/120) & Hypotension
 * - 🔴 Hypoxemia Alert (SpO2 < 95%, Severe < 90%)
 * - 🟠 Fever / Hypothermia (T ≥ 38.5°C or < 35.5°C)
 * - 🟡 Tachycardia / Bradycardia (tailored for Adult vs Pediatric ranges)
 * - 🟡 Tachypnea / Bradypnea (Respiratory Rate alerts)
 * - 📊 Aggregate MEWS score (0-14) assessing overall deterioration risk
 */

export type VitalAlertSeverity = "NORMAL" | "MILD" | "WARNING" | "CRITICAL";

export type VitalMetricType = "BP" | "HEART_RATE" | "TEMPERATURE" | "SPO2" | "RESPIRATORY_RATE" | "OTHER";

export interface VitalAlert {
  metric: VitalMetricType;
  severity: VitalAlertSeverity;
  title: string;
  badgeLabel: string;
  shortLabel: string;
  detail: string;
  icon: "alert-triangle" | "alert-circle" | "activity" | "thermometer" | "wind" | "heart" | "check";
  badgeClassName: string;
  mewsPoints: number;
}

export type MewsRiskLevel = "NORMAL" | "LOW" | "MEDIUM" | "HIGH";

export interface MewsEvaluation {
  score: number;
  maxPossibleRecordedScore: number;
  level: MewsRiskLevel;
  title: string;
  description: string;
  badgeClassName: string;
  alerts: VitalAlert[];
  hasCriticalAlert: boolean;
  hasWarningAlert: boolean;
}

/**
 * Extracts systolic and diastolic numbers from a BP string.
 * Handles formats: "140/90", "140 / 90", "140/90 mmHg", "140 - 90", "SBP: 140, DBP: 90", etc.
 */
export function parseBloodPressure(value: string | number | null | undefined): { systolic: number; diastolic: number } | null {
  if (value == null) return null;
  const str = String(value).trim();
  if (!str) return null;

  // Match pattern like 120/80 or 120 / 80 or 120-80
  const match = str.match(/(\d{2,3})\s*(?:\/|\-|\bover\b)\s*(\d{2,3})/i);
  if (match) {
    const systolic = parseInt(match[1], 10);
    const diastolic = parseInt(match[2], 10);
    if (!Number.isNaN(systolic) && !Number.isNaN(diastolic) && systolic > 0 && diastolic > 0) {
      return { systolic, diastolic };
    }
  }

  return null;
}

/**
 * Extracts a numeric value from strings like "38.5°C", "94%", "115 bpm", "72.4 kg".
 */
export function parseNumericVital(value: string | number | null | undefined): number | null {
  if (value == null) return null;
  if (typeof value === "number") return Number.isNaN(value) ? null : value;
  const str = String(value).trim();
  if (!str) return null;

  const match = str.match(/-?\d+(?:\.\d+)?/);
  if (!match) return null;

  const num = parseFloat(match[0]);
  return Number.isNaN(num) ? null : num;
}

/**
 * Extracts temperature in Celsius.
 * Automatically converts Fahrenheit to Celsius if value > 50 or marked with 'F'.
 */
export function parseTemperature(value: string | number | null | undefined): number | null {
  const num = parseNumericVital(value);
  if (num == null) return null;

  const str = String(value || "").toLowerCase();
  const isFahrenheit = str.includes("f") || num > 50;

  if (isFahrenheit) {
    const inC = (num - 32) * (5 / 9);
    return Math.round(inC * 10) / 10;
  }

  return Math.round(num * 10) / 10;
}

/**
 * Evaluate Blood Pressure.
 * - Crisis: SBP ≥ 180 or DBP ≥ 120
 * - Stage 2 / Severe Hypertension: SBP ≥ 140 or DBP ≥ 90
 * - Severe Hypotension: SBP ≤ 70
 * - Hypotension: SBP < 90 or DBP < 60
 */
export function evaluateBloodPressure(
  systolic: number,
  diastolic: number,
): VitalAlert | null {
  // MEWS points calculation based on systolic BP:
  // ≤ 70: 3 pts
  // 71-80: 2 pts
  // 81-100: 1 pt
  // 101-199: 0 pts
  // ≥ 200: 2 pts
  let mewsPoints = 0;
  if (systolic <= 70) {
    mewsPoints = 3;
  } else if (systolic <= 80) {
    mewsPoints = 2;
  } else if (systolic <= 100) {
    mewsPoints = 1;
  } else if (systolic >= 200) {
    mewsPoints = 2;
  }

  // Clinical Alert Level
  if (systolic >= 180 || diastolic >= 120) {
    return {
      metric: "BP",
      severity: "CRITICAL",
      title: "Hypertensive Crisis",
      badgeLabel: "🔴 Hypertensive Crisis (≥180/120)",
      shortLabel: "BP Crisis",
      detail: `BP ${systolic}/${diastolic} mmHg is critically high (Systolic ≥ 180 or Diastolic ≥ 120). Immediate clinical evaluation required to rule out acute organ damage.`,
      icon: "alert-circle",
      badgeClassName: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
      mewsPoints: Math.max(mewsPoints, 2),
    };
  }

  if (systolic <= 70) {
    return {
      metric: "BP",
      severity: "CRITICAL",
      title: "Severe Hypotension",
      badgeLabel: "🔴 Severe Hypotension (≤70 SBP)",
      shortLabel: "Severe Low BP",
      detail: `Systolic BP ${systolic} mmHg is critically low (≤ 70 mmHg). High risk of hemodynamic shock and poor organ perfusion.`,
      icon: "alert-circle",
      badgeClassName: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
      mewsPoints: 3,
    };
  }

  if (systolic >= 140 || diastolic >= 90) {
    return {
      metric: "BP",
      severity: "WARNING",
      title: "Hypertension Alert",
      badgeLabel: "🔴 Hypertension (≥140/90)",
      shortLabel: "High BP",
      detail: `BP ${systolic}/${diastolic} mmHg is elevated (Systolic ≥ 140 or Diastolic ≥ 90 mmHg). Patient requires clinical monitoring.`,
      icon: "activity",
      badgeClassName: "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30",
      mewsPoints,
    };
  }

  if (systolic < 90 || diastolic < 60) {
    return {
      metric: "BP",
      severity: "WARNING",
      title: "Hypotension Alert",
      badgeLabel: "🟡 Hypotension (<90/60)",
      shortLabel: "Low BP",
      detail: `BP ${systolic}/${diastolic} mmHg is below normal range (Systolic < 90 or Diastolic < 60 mmHg). Monitor for dizziness, dehydration or shock.`,
      icon: "activity",
      badgeClassName: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
      mewsPoints: Math.max(mewsPoints, 1),
    };
  }

  return null;
}

/**
 * Evaluate Oxygen Saturation (SpO2).
 * - Severe Hypoxemia: SpO2 < 90% (Critical)
 * - Hypoxemia Alert: SpO2 < 95% (Warning)
 */
export function evaluateOxygenSaturation(spo2: number): VitalAlert | null {
  if (spo2 < 90) {
    return {
      metric: "SPO2",
      severity: "CRITICAL",
      title: "Severe Hypoxemia",
      badgeLabel: "🔴 Severe Hypoxemia (<90%)",
      shortLabel: "SpO2 <90%",
      detail: `SpO2 ${spo2}% indicates severe respiratory compromise (< 90%). Immediate supplemental oxygen and urgent clinician review required.`,
      icon: "alert-circle",
      badgeClassName: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
      mewsPoints: 3,
    };
  }

  if (spo2 < 95) {
    return {
      metric: "SPO2",
      severity: "WARNING",
      title: "Hypoxemia Alert",
      badgeLabel: "🔴 Hypoxemia (<95%)",
      shortLabel: "SpO2 <95%",
      detail: `SpO2 ${spo2}% is below the target threshold (< 95%). Evaluate airway, breathing effort, and respiratory history.`,
      icon: "wind",
      badgeClassName: "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30",
      mewsPoints: 1,
    };
  }

  return null;
}

/**
 * Evaluate Body Temperature (°C).
 * - Hyperpyrexia / High Fever: T ≥ 39.5°C
 * - Fever: T ≥ 38.5°C
 * - Low-Grade Fever: 37.5°C ≤ T < 38.5°C
 * - Hypothermia: T < 35.5°C (Severe < 35.0°C)
 */
export function evaluateTemperature(tempC: number): VitalAlert | null {
  // MEWS points for temperature:
  // < 35.0°C: 2 pts
  // 35.0 - 38.4°C: 0 pts
  // ≥ 38.5°C: 2 pts
  let mewsPoints = 0;
  if (tempC < 35.0 || tempC >= 38.5) {
    mewsPoints = 2;
  }

  if (tempC >= 39.5) {
    return {
      metric: "TEMPERATURE",
      severity: "CRITICAL",
      title: "High Fever / Hyperpyrexia",
      badgeLabel: "🔴 High Fever (≥39.5°C)",
      shortLabel: `High Fever ${tempC}°C`,
      detail: `Temperature ${tempC}°C is dangerously high (≥ 39.5°C). Urgent antipyretic management and infection screening recommended.`,
      icon: "thermometer",
      badgeClassName: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
      mewsPoints: 2,
    };
  }

  if (tempC >= 38.5) {
    return {
      metric: "TEMPERATURE",
      severity: "WARNING",
      title: "Fever Alert",
      badgeLabel: "🟠 Fever (≥38.5°C)",
      shortLabel: `Fever ${tempC}°C`,
      detail: `Temperature ${tempC}°C indicates significant pyrexia (≥ 38.5°C). Investigate potential infectious etiology.`,
      icon: "thermometer",
      badgeClassName: "bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30",
      mewsPoints: 2,
    };
  }

  if (tempC >= 37.5) {
    return {
      metric: "TEMPERATURE",
      severity: "MILD",
      title: "Mild Fever",
      badgeLabel: "🟡 Mild Fever (37.5–38.4°C)",
      shortLabel: `Mild Fever ${tempC}°C`,
      detail: `Temperature ${tempC}°C is slightly elevated (37.5–38.4°C). Re-check if patient exhibits other symptoms.`,
      icon: "thermometer",
      badgeClassName: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
      mewsPoints: 0,
    };
  }

  if (tempC < 35.0) {
    return {
      metric: "TEMPERATURE",
      severity: "CRITICAL",
      title: "Severe Hypothermia",
      badgeLabel: "🟠 Severe Hypothermia (<35.0°C)",
      shortLabel: `Hypothermia ${tempC}°C`,
      detail: `Temperature ${tempC}°C is critically subnormal (< 35.0°C). Active rewarming and metabolic/sepsis investigation required.`,
      icon: "thermometer",
      badgeClassName: "bg-orange-600/15 text-orange-800 dark:text-orange-300 border-orange-600/30",
      mewsPoints: 2,
    };
  }

  if (tempC < 35.5) {
    return {
      metric: "TEMPERATURE",
      severity: "WARNING",
      title: "Hypothermia Alert",
      badgeLabel: "🟠 Hypothermia (<35.5°C)",
      shortLabel: `Low Temp ${tempC}°C`,
      detail: `Temperature ${tempC}°C is below standard physiological range (< 35.5°C). Ensure patient is warm and reassess.`,
      icon: "thermometer",
      badgeClassName: "bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30",
      mewsPoints: 1,
    };
  }

  return null;
}

/**
 * Evaluate Heart Rate / Pulse.
 * Tailored for Adult vs Pediatric ranges:
 * - Infant (< 1 year): Normal 100-160 bpm, Bradycardia < 100, Tachycardia > 160
 * - Child (1-11 years): Normal 70-130 bpm, Bradycardia < 70, Tachycardia > 130
 * - Adult (≥ 12 years / unspecified): Normal 60-100 bpm, Bradycardia < 60, Tachycardia > 100
 */
export function evaluateHeartRate(
  hr: number,
  patientAge?: number | null,
): VitalAlert | null {
  const isInfant = patientAge != null && patientAge < 1;
  const isChild = patientAge != null && patientAge >= 1 && patientAge < 12;

  // MEWS points for Heart Rate (Adult standard):
  // ≤ 40: 2 pts
  // 41-50: 1 pt
  // 51-100: 0 pts
  // 101-110: 1 pt
  // 111-129: 2 pts
  // ≥ 130: 3 pts
  let mewsPoints = 0;
  if (hr <= 40) mewsPoints = 2;
  else if (hr <= 50) mewsPoints = 1;
  else if (hr >= 130) mewsPoints = 3;
  else if (hr >= 111) mewsPoints = 2;
  else if (hr >= 101) mewsPoints = 1;

  if (isInfant) {
    if (hr < 80) {
      return {
        metric: "HEART_RATE",
        severity: "CRITICAL",
        title: "Severe Pediatric Bradycardia",
        badgeLabel: "🔴 Severe Bradycardia (<80 bpm)",
        shortLabel: `Infant HR ${hr}`,
        detail: `Infant heart rate ${hr} bpm is critically low (< 80 bpm). Urgent clinical assessment required.`,
        icon: "heart",
        badgeClassName: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
        mewsPoints: 3,
      };
    }
    if (hr < 100) {
      return {
        metric: "HEART_RATE",
        severity: "WARNING",
        title: "Pediatric Bradycardia",
        badgeLabel: "🟡 Bradycardia (<100 bpm)",
        shortLabel: `Infant HR ${hr}`,
        detail: `Infant heart rate ${hr} bpm is below normal infant resting range (100–160 bpm).`,
        icon: "heart",
        badgeClassName: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
        mewsPoints: 2,
      };
    }
    if (hr > 180) {
      return {
        metric: "HEART_RATE",
        severity: "CRITICAL",
        title: "Severe Pediatric Tachycardia",
        badgeLabel: "🔴 Severe Tachycardia (>180 bpm)",
        shortLabel: `Infant HR ${hr}`,
        detail: `Infant heart rate ${hr} bpm is markedly elevated (> 180 bpm). Check for fever, dehydration, or arrhythmia.`,
        icon: "heart",
        badgeClassName: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
        mewsPoints: 3,
      };
    }
    if (hr > 160) {
      return {
        metric: "HEART_RATE",
        severity: "WARNING",
        title: "Pediatric Tachycardia",
        badgeLabel: "🟡 Tachycardia (>160 bpm)",
        shortLabel: `Infant HR ${hr}`,
        detail: `Infant heart rate ${hr} bpm exceeds normal resting limits (100–160 bpm).`,
        icon: "heart",
        badgeClassName: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
        mewsPoints: 1,
      };
    }
    return null;
  }

  if (isChild) {
    if (hr < 60) {
      return {
        metric: "HEART_RATE",
        severity: "CRITICAL",
        title: "Severe Pediatric Bradycardia",
        badgeLabel: "🔴 Severe Bradycardia (<60 bpm)",
        shortLabel: `Child HR ${hr}`,
        detail: `Pediatric heart rate ${hr} bpm is critically slow (< 60 bpm). Immediate clinician review needed.`,
        icon: "heart",
        badgeClassName: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
        mewsPoints: 3,
      };
    }
    if (hr < 70) {
      return {
        metric: "HEART_RATE",
        severity: "WARNING",
        title: "Pediatric Bradycardia",
        badgeLabel: "🟡 Bradycardia (<70 bpm)",
        shortLabel: `Child HR ${hr}`,
        detail: `Child heart rate ${hr} bpm is below normal pediatric range (70–130 bpm).`,
        icon: "heart",
        badgeClassName: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
        mewsPoints: 1,
      };
    }
    if (hr > 150) {
      return {
        metric: "HEART_RATE",
        severity: "CRITICAL",
        title: "Severe Pediatric Tachycardia",
        badgeLabel: "🔴 Severe Tachycardia (>150 bpm)",
        shortLabel: `Child HR ${hr}`,
        detail: `Child heart rate ${hr} bpm is dangerously high (> 150 bpm).`,
        icon: "heart",
        badgeClassName: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
        mewsPoints: 3,
      };
    }
    if (hr > 130) {
      return {
        metric: "HEART_RATE",
        severity: "WARNING",
        title: "Pediatric Tachycardia",
        badgeLabel: "🟡 Tachycardia (>130 bpm)",
        shortLabel: `Child HR ${hr}`,
        detail: `Child heart rate ${hr} bpm is elevated above normal pediatric limit (70–130 bpm).`,
        icon: "heart",
        badgeClassName: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
        mewsPoints: 1,
      };
    }
    return null;
  }

  // Adult (≥ 12 yrs or unspecified)
  if (hr >= 130) {
    return {
      metric: "HEART_RATE",
      severity: "CRITICAL",
      title: "Severe Tachycardia",
      badgeLabel: "🔴 Severe Tachycardia (≥130 bpm)",
      shortLabel: `HR ${hr} bpm`,
      detail: `Heart rate ${hr} bpm is markedly elevated (≥ 130 bpm). High MEWS risk for hemodynamic compromise.`,
      icon: "heart",
      badgeClassName: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
      mewsPoints: 3,
    };
  }

  if (hr > 100) {
    return {
      metric: "HEART_RATE",
      severity: "WARNING",
      title: "Tachycardia Alert",
      badgeLabel: "🟡 Tachycardia (>100 bpm)",
      shortLabel: `Tachycardia (${hr} bpm)`,
      detail: `Heart rate ${hr} bpm is elevated above normal resting rate (60–100 bpm). Assess for pain, anxiety, infection, or hypovolemia.`,
      icon: "heart",
      badgeClassName: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
      mewsPoints: hr >= 111 ? 2 : 1,
    };
  }

  if (hr <= 40) {
    return {
      metric: "HEART_RATE",
      severity: "CRITICAL",
      title: "Severe Bradycardia",
      badgeLabel: "🔴 Severe Bradycardia (≤40 bpm)",
      shortLabel: `HR ${hr} bpm`,
      detail: `Heart rate ${hr} bpm is critically slow (≤ 40 bpm). Risk of syncope, conduction block, or hypoperfusion.`,
      icon: "heart",
      badgeClassName: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
      mewsPoints: 2,
    };
  }

  if (hr < 60) {
    return {
      metric: "HEART_RATE",
      severity: "WARNING",
      title: "Bradycardia Alert",
      badgeLabel: "🟡 Bradycardia (<60 bpm)",
      shortLabel: `Bradycardia (${hr} bpm)`,
      detail: `Heart rate ${hr} bpm is below normal resting rate (< 60 bpm). Ensure absence of dizziness or beta-blocker overdose.`,
      icon: "heart",
      badgeClassName: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
      mewsPoints: hr <= 50 ? 1 : 0,
    };
  }

  return null;
}

/**
 * Evaluate Respiratory Rate (breaths/min).
 * - Severe Bradypnea: ≤ 8 (Critical)
 * - Bradypnea: < 10 (Warning)
 * - Severe Tachypnea: ≥ 30 (Critical)
 * - Tachypnea: ≥ 21 (Warning)
 * - Mild Tachypnea: 15-20 (Normal/Mild)
 */
export function evaluateRespiratoryRate(
  rr: number,
  _patientAge?: number | null,
): VitalAlert | null {
  // MEWS points for Respiratory Rate:
  // ≤ 8: 2 pts
  // 9-14: 0 pts
  // 15-20: 1 pt
  // 21-29: 2 pts
  // ≥ 30: 3 pts
  let mewsPoints = 0;
  if (rr <= 8) mewsPoints = 2;
  else if (rr >= 30) mewsPoints = 3;
  else if (rr >= 21) mewsPoints = 2;
  else if (rr >= 15) mewsPoints = 1;

  if (rr <= 8) {
    return {
      metric: "RESPIRATORY_RATE",
      severity: "CRITICAL",
      title: "Severe Bradypnea",
      badgeLabel: "🔴 Severe Bradypnea (≤8 /min)",
      shortLabel: `RR ${rr} /min`,
      detail: `Respiratory rate ${rr} breaths/min is critically depressed (≤ 8 /min). High risk of respiratory failure or opioid toxicity.`,
      icon: "wind",
      badgeClassName: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
      mewsPoints: 2,
    };
  }

  if (rr >= 30) {
    return {
      metric: "RESPIRATORY_RATE",
      severity: "CRITICAL",
      title: "Severe Tachypnea",
      badgeLabel: "🔴 Severe Tachypnea (≥30 /min)",
      shortLabel: `RR ${rr} /min`,
      detail: `Respiratory rate ${rr} breaths/min indicates severe respiratory distress (≥ 30 /min). Urgent clinical review required.`,
      icon: "wind",
      badgeClassName: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
      mewsPoints: 3,
    };
  }

  if (rr >= 21) {
    return {
      metric: "RESPIRATORY_RATE",
      severity: "WARNING",
      title: "Tachypnea Alert",
      badgeLabel: "🟡 Tachypnea (≥21 /min)",
      shortLabel: `RR ${rr} /min`,
      detail: `Respiratory rate ${rr} breaths/min is elevated (≥ 21 /min). Assess work of breathing and oxygenation.`,
      icon: "wind",
      badgeClassName: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
      mewsPoints: 2,
    };
  }

  if (rr < 10) {
    return {
      metric: "RESPIRATORY_RATE",
      severity: "WARNING",
      title: "Bradypnea Alert",
      badgeLabel: "🟡 Bradypnea (<10 /min)",
      shortLabel: `RR ${rr} /min`,
      detail: `Respiratory rate ${rr} breaths/min is lower than typical physiological rate (< 10 /min).`,
      icon: "wind",
      badgeClassName: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
      mewsPoints: 1,
    };
  }

  return null;
}

/**
 * Normalizes measurement name for comparison.
 */
function cleanMetricName(name: string): string {
  return (name || "").toLowerCase().trim().replace(/[\s_\-]+/g, " ");
}

/**
 * Evaluates an individual vital sign measurement entry.
 */
export function evaluateVitalSignAlert(
  measurementName: string,
  value: string | number | null | undefined,
  patientAge?: number | null,
): VitalAlert | null {
  if (value == null) return null;
  const rawStr = String(value).trim();
  if (!rawStr) return null;

  const key = cleanMetricName(measurementName);

  // Blood Pressure
  if (
    key === "blood pressure" ||
    key === "bp" ||
    key === "tension" ||
    key === "tension arterielle" ||
    key === "ta" ||
    key.includes("blood pressure")
  ) {
    const parsed = parseBloodPressure(rawStr);
    if (parsed) {
      return evaluateBloodPressure(parsed.systolic, parsed.diastolic);
    }
    return null;
  }

  // Heart Rate / Pulse
  if (
    key === "heart rate" ||
    key === "pulse" ||
    key === "pulse rate" ||
    key === "hr" ||
    key === "pouls" ||
    key.includes("heart rate") ||
    key.includes("pulse")
  ) {
    const num = parseNumericVital(rawStr);
    if (num != null) {
      return evaluateHeartRate(num, patientAge);
    }
    return null;
  }

  // Temperature
  if (
    key === "temperature" ||
    key === "temp" ||
    key === "body temperature" ||
    key === "température" ||
    key.includes("temperature")
  ) {
    const tempC = parseTemperature(rawStr);
    if (tempC != null) {
      return evaluateTemperature(tempC);
    }
    return null;
  }

  // Oxygen Saturation
  if (
    key === "oxygen saturation" ||
    key === "spo2" ||
    key === "o2 sat" ||
    key === "sao2" ||
    key.includes("oxygen") ||
    key.includes("spo2")
  ) {
    const spo2 = parseNumericVital(rawStr);
    if (spo2 != null) {
      return evaluateOxygenSaturation(spo2);
    }
    return null;
  }

  // Respiratory Rate
  if (
    key === "respiratory rate" ||
    key === "resp rate" ||
    key === "rr" ||
    key === "fr" ||
    key.includes("respiratory") ||
    key.includes("breathing")
  ) {
    const rr = parseNumericVital(rawStr);
    if (rr != null) {
      return evaluateRespiratoryRate(rr, patientAge);
    }
    return null;
  }

  return null;
}

/**
 * Calculates compound Modified Early Warning Score (MEWS) across a set of measurements.
 * Standard WHO/NHS Early Warning Scoring:
 * - Score 0: Normal physiological state
 * - Score 1-2: Low clinical risk (routine ward care)
 * - Score 3-4: Medium clinical risk (increased monitoring frequency)
 * - Score ≥ 5: High clinical risk (immediate medical review and escalation)
 */
export function calculateMewsScore(
  measurements: Array<{ measurementName: string; value: string | number }>,
  patientAge?: number | null,
): MewsEvaluation {
  const alerts: VitalAlert[] = [];
  let totalPoints = 0;
  let hasCriticalAlert = false;
  let hasWarningAlert = false;

  for (const m of measurements || []) {
    const alert = evaluateVitalSignAlert(m.measurementName, m.value, patientAge);
    if (alert) {
      alerts.push(alert);
      totalPoints += alert.mewsPoints || 0;
      if (alert.severity === "CRITICAL") {
        hasCriticalAlert = true;
      } else if (alert.severity === "WARNING") {
        hasWarningAlert = true;
      }
    }
  }

  let level: MewsRiskLevel = "NORMAL";
  let title = "Normal Vitals";
  let description = "All recorded vital signs fall within standard physiological ranges.";
  let badgeClassName = "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30";

  if (totalPoints >= 5 || hasCriticalAlert) {
    level = "HIGH";
    title = `Critical Risk • MEWS ${totalPoints}`;
    description = "Immediate clinician review required. Patient shows marked physiological deterioration or critical single-vital alert.";
    badgeClassName = "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/40 animate-pulse";
  } else if (totalPoints >= 3 || hasWarningAlert) {
    level = "MEDIUM";
    title = `Medium Risk • MEWS ${totalPoints}`;
    description = "Potential clinical deterioration. Increase vital sign monitoring frequency and inform attending clinician.";
    badgeClassName = "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30";
  } else if (totalPoints >= 1) {
    level = "LOW";
    title = `Low Risk • MEWS ${totalPoints}`;
    description = "Mild physiological deviation. Re-check vitals per ward protocol.";
    badgeClassName = "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/30";
  }

  return {
    score: totalPoints,
    maxPossibleRecordedScore: 14,
    level,
    title,
    description,
    badgeClassName,
    alerts,
    hasCriticalAlert,
    hasWarningAlert,
  };
}
