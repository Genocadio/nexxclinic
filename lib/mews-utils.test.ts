import { describe, it, expect } from "vitest";
import {
  parseBloodPressure,
  parseNumericVital,
  parseTemperature,
  evaluateBloodPressure,
  evaluateOxygenSaturation,
  evaluateTemperature,
  evaluateHeartRate,
  evaluateRespiratoryRate,
  evaluateVitalSignAlert,
  calculateMewsScore,
  calculateAnthropometrics,
  extractLatestWeightKg,
  extractLatestHeightCm,
} from "./mews-utils";

describe("mews-utils parsing", () => {
  it("parses blood pressure formats correctly", () => {
    expect(parseBloodPressure("120/80")).toEqual({ systolic: 120, diastolic: 80 });
    expect(parseBloodPressure("140 / 90")).toEqual({ systolic: 140, diastolic: 90 });
    expect(parseBloodPressure("150/95 mmHg")).toEqual({ systolic: 150, diastolic: 95 });
    expect(parseBloodPressure("180 - 120")).toEqual({ systolic: 180, diastolic: 120 });
    expect(parseBloodPressure("130 over 85")).toEqual({ systolic: 130, diastolic: 85 });
    expect(parseBloodPressure("")).toBeNull();
    expect(parseBloodPressure("invalid")).toBeNull();
  });

  it("parses numeric vitals with units", () => {
    expect(parseNumericVital("38.5°C")).toBe(38.5);
    expect(parseNumericVital("94%")).toBe(94);
    expect(parseNumericVital("115 bpm")).toBe(115);
    expect(parseNumericVital("24/min")).toBe(24);
    expect(parseNumericVital(98)).toBe(98);
    expect(parseNumericVital("")).toBeNull();
  });

  it("parses temperature and converts Fahrenheit when applicable", () => {
    expect(parseTemperature("37.2°C")).toBe(37.2);
    expect(parseTemperature("38.5")).toBe(38.5);
    // 101.3°F is 38.5°C: (101.3 - 32) * 5/9 = 38.5
    expect(parseTemperature("101.3°F")).toBe(38.5);
    expect(parseTemperature("98.6 F")).toBe(37.0);
  });
});

describe("Blood Pressure Alerts", () => {
  it("flags Hypertensive Crisis for BP >= 180/120", () => {
    const alert1 = evaluateBloodPressure(185, 110);
    expect(alert1?.severity).toBe("CRITICAL");
    expect(alert1?.title).toBe("Hypertensive Crisis");

    const alert2 = evaluateBloodPressure(150, 125);
    expect(alert2?.severity).toBe("CRITICAL");
    expect(alert2?.badgeLabel).toContain("≥180/120");
  });

  it("flags Hypertension Alert for BP >= 140/90", () => {
    const alert = evaluateBloodPressure(145, 88);
    expect(alert?.severity).toBe("WARNING");
    expect(alert?.badgeLabel).toContain("≥140/90");

    const alertDiastolic = evaluateBloodPressure(130, 95);
    expect(alertDiastolic?.severity).toBe("WARNING");
    expect(alertDiastolic?.badgeLabel).toContain("≥140/90");
  });

  it("flags Hypotension for SBP < 90 or DBP < 60", () => {
    const alert = evaluateBloodPressure(85, 55);
    expect(alert?.severity).toBe("WARNING");
    expect(alert?.badgeLabel).toContain("<90/60");
  });

  it("flags Severe Hypotension for SBP <= 70", () => {
    const alert = evaluateBloodPressure(68, 40);
    expect(alert?.severity).toBe("CRITICAL");
    expect(alert?.title).toBe("Severe Hypotension");
  });

  it("returns null for normal BP", () => {
    expect(evaluateBloodPressure(120, 80)).toBeNull();
    expect(evaluateBloodPressure(115, 75)).toBeNull();
  });
});

describe("Oxygen Saturation Alerts", () => {
  it("flags Hypoxemia Alert for SpO2 < 95%", () => {
    const alert = evaluateOxygenSaturation(93);
    expect(alert?.severity).toBe("WARNING");
    expect(alert?.badgeLabel).toContain("<95%");
  });

  it("flags Severe Hypoxemia for SpO2 < 90%", () => {
    const alert = evaluateOxygenSaturation(88);
    expect(alert?.severity).toBe("CRITICAL");
    expect(alert?.badgeLabel).toContain("<90%");
  });

  it("returns null for normal SpO2 >= 95%", () => {
    expect(evaluateOxygenSaturation(98)).toBeNull();
    expect(evaluateOxygenSaturation(95)).toBeNull();
  });
});

describe("Temperature Alerts", () => {
  it("flags Fever for T >= 38.5°C", () => {
    const alert = evaluateTemperature(38.8);
    expect(alert?.severity).toBe("WARNING");
    expect(alert?.badgeLabel).toContain("≥38.5°C");
  });

  it("flags High Fever / Hyperpyrexia for T >= 39.5°C", () => {
    const alert = evaluateTemperature(39.8);
    expect(alert?.severity).toBe("CRITICAL");
    expect(alert?.badgeLabel).toContain("≥39.5°C");
  });

  it("flags Hypothermia for T < 35.5°C and severe for < 35.0°C", () => {
    const alertWarn = evaluateTemperature(35.2);
    expect(alertWarn?.severity).toBe("WARNING");
    expect(alertWarn?.badgeLabel).toContain("<35.5°C");

    const alertCrit = evaluateTemperature(34.8);
    expect(alertCrit?.severity).toBe("CRITICAL");
    expect(alertCrit?.badgeLabel).toContain("<35.0°C");
  });

  it("returns null for normal temperature", () => {
    expect(evaluateTemperature(36.8)).toBeNull();
    expect(evaluateTemperature(37.0)).toBeNull();
  });
});

describe("Heart Rate Alerts (Adult vs Pediatric)", () => {
  it("flags adult tachycardia > 100 bpm and severe tachycardia >= 130 bpm", () => {
    const adultTachy = evaluateHeartRate(115, 30);
    expect(adultTachy?.severity).toBe("WARNING");
    expect(adultTachy?.badgeLabel).toContain(">100 bpm");

    const adultCrit = evaluateHeartRate(135, 30);
    expect(adultCrit?.severity).toBe("CRITICAL");
    expect(adultCrit?.badgeLabel).toContain("≥130 bpm");
  });

  it("flags adult bradycardia < 60 bpm and severe <= 40 bpm", () => {
    const adultBrady = evaluateHeartRate(52, 45);
    expect(adultBrady?.severity).toBe("WARNING");
    expect(adultBrady?.badgeLabel).toContain("<60 bpm");

    const adultCrit = evaluateHeartRate(38, 45);
    expect(adultCrit?.severity).toBe("CRITICAL");
    expect(adultCrit?.badgeLabel).toContain("≤40 bpm");
  });

  it("adjusts ranges for pediatric child (age 5)", () => {
    // In child: 115 bpm is normal (70-130)
    expect(evaluateHeartRate(115, 5)).toBeNull();

    // 140 bpm is tachycardia for child (> 130)
    const childTachy = evaluateHeartRate(140, 5);
    expect(childTachy?.severity).toBe("WARNING");
    expect(childTachy?.badgeLabel).toContain(">130 bpm");

    // 65 bpm is bradycardia for child (< 70)
    const childBrady = evaluateHeartRate(65, 5);
    expect(childBrady?.severity).toBe("WARNING");
    expect(childBrady?.badgeLabel).toContain("<70 bpm");
  });

  it("adjusts ranges for infant (age 0)", () => {
    // 145 bpm is normal for infant (100-160)
    expect(evaluateHeartRate(145, 0)).toBeNull();

    // 175 bpm is tachycardia for infant (> 160)
    const infantTachy = evaluateHeartRate(175, 0);
    expect(infantTachy?.severity).toBe("WARNING");
    expect(infantTachy?.badgeLabel).toContain(">160 bpm");

    // 90 bpm is bradycardia for infant (< 100)
    const infantBrady = evaluateHeartRate(90, 0);
    expect(infantBrady?.severity).toBe("WARNING");
    expect(infantBrady?.badgeLabel).toContain("<100 bpm");
  });
});

describe("Respiratory Rate Alerts", () => {
  it("flags tachypnea >= 21 and severe >= 30", () => {
    const tachy = evaluateRespiratoryRate(24);
    expect(tachy?.severity).toBe("WARNING");
    expect(tachy?.badgeLabel).toContain("≥21 /min");

    const severeTachy = evaluateRespiratoryRate(32);
    expect(severeTachy?.severity).toBe("CRITICAL");
    expect(severeTachy?.badgeLabel).toContain("≥30 /min");
  });

  it("flags bradypnea < 10 and severe <= 8", () => {
    const brady = evaluateRespiratoryRate(9);
    expect(brady?.severity).toBe("WARNING");
    expect(brady?.badgeLabel).toContain("<10 /min");

    const severeBrady = evaluateRespiratoryRate(7);
    expect(severeBrady?.severity).toBe("CRITICAL");
    expect(severeBrady?.badgeLabel).toContain("≤8 /min");
  });

  it("returns null for normal respiratory rate", () => {
    expect(evaluateRespiratoryRate(16)).toBeNull();
  });
});

describe("Compound MEWS Score Calculation", () => {
  it("evaluates a high risk patient with multiple abnormal vitals", () => {
    const result = calculateMewsScore(
      [
        { measurementName: "Blood Pressure", value: "145/95" },
        { measurementName: "Heart Rate", value: "125" }, // 2 pts
        { measurementName: "Temperature", value: "39.0" }, // 2 pts
        { measurementName: "Oxygen Saturation", value: "92%" }, // warning
        { measurementName: "Respiratory Rate", value: "26" }, // 2 pts
      ],
      35,
    );

    expect(result.score).toBeGreaterThanOrEqual(5);
    expect(result.level).toBe("HIGH");
    expect(result.alerts.length).toBe(5);
    expect(result.hasWarningAlert).toBe(true);
  });

  it("evaluates a normal set of vitals as NORMAL", () => {
    const result = calculateMewsScore(
      [
        { measurementName: "Blood Pressure", value: "118/76" },
        { measurementName: "Heart Rate", value: "72" },
        { measurementName: "Temperature", value: "36.8" },
        { measurementName: "Oxygen Saturation", value: "99%" },
      ],
      40,
    );

    expect(result.score).toBe(0);
    expect(result.level).toBe("NORMAL");
    expect(result.alerts.length).toBe(0);
  });

  it("identifies aliases like 'Pouls', 'Tension', 'Temp', 'SpO2'", () => {
    const alertBP = evaluateVitalSignAlert("Tension", "150/95");
    expect(alertBP?.metric).toBe("BP");
    expect(alertBP?.severity).toBe("WARNING");

    const alertHR = evaluateVitalSignAlert("Pouls", "115");
    expect(alertHR?.metric).toBe("HEART_RATE");

    const alertTemp = evaluateVitalSignAlert("Temp", "38.9°C");
    expect(alertTemp?.metric).toBe("TEMPERATURE");

    const alertSpO2 = evaluateVitalSignAlert("SpO2", "91%");
    expect(alertSpO2?.metric).toBe("SPO2");
  });
});

describe("Anthropometrics (BMI, BSA & Pediatric Weight)", () => {
  it("extracts weight in kg and height in cm (including meter conversion)", () => {
    expect(
      extractLatestWeightKg([{ measurementName: "Weight", value: "18.5 kg" }]),
    ).toBe(18.5);
    expect(
      extractLatestHeightCm([{ measurementName: "Height", value: "110 cm" }]),
    ).toBe(110);
    expect(
      extractLatestHeightCm([{ measurementName: "Taille", value: "1.75 m" }]),
    ).toBe(175);
  });

  it("calculates BMI, category, and Mosteller BSA accurately", () => {
    const normal = calculateAnthropometrics(
      [
        { measurementName: "Weight", value: "70" },
        { measurementName: "Height", value: "175" },
      ],
      30,
    );
    expect(normal.bmi).toBe(22.9);
    expect(normal.bmiCategory).toBe("NORMAL");
    expect(normal.bmiLabel).toBe("Normal");
    expect(normal.bsaM2).toBe(1.84);

    const underweight = calculateAnthropometrics(
      [
        { measurementName: "Weight", value: "45" },
        { measurementName: "Height", value: "170" },
      ],
      25,
    );
    expect(underweight.bmi).toBe(15.6);
    expect(underweight.bmiCategory).toBe("UNDERWEIGHT");
    expect(underweight.bmiLabel).toBe("Underweight");

    const overweight = calculateAnthropometrics(
      [
        { measurementName: "Weight", value: "82" },
        { measurementName: "Height", value: "170" },
      ],
      40,
    );
    expect(overweight.bmi).toBe(28.4);
    expect(overweight.bmiCategory).toBe("OVERWEIGHT");
    expect(overweight.bmiLabel).toBe("Overweight");

    const obese = calculateAnthropometrics(
      [
        { measurementName: "Weight", value: "98" },
        { measurementName: "Height", value: "170" },
      ],
      40,
    );
    expect(obese.bmi).toBe(33.9);
    expect(obese.bmiCategory).toBe("OBESE");
    expect(obese.bmiLabel).toBe("Obese");
  });

  it("returns weightKg even when height is missing (for pediatric dosing)", () => {
    const ped = calculateAnthropometrics(
      [{ measurementName: "Weight", value: "14.2" }],
      4,
    );
    expect(ped.weightKg).toBe(14.2);
    expect(ped.heightCm).toBeNull();
    expect(ped.bmi).toBeNull();
  });
});
