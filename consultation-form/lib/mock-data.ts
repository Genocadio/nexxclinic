export type RecordType = "vital-signs" | "medication" | "products" | "exam" | "note"
export type ProductType = "action" | "consumable"

export type PlanStatus = "pending" | "completed" | "overdue"
export type PlanFrequency = "once" | "daily" | "twice-daily" | "three-times-daily" | "weekly"

export interface RecordItem {
  id: string
  type: RecordType
  details: {
    [key: string]: string | number
  }
}

export interface ConsultationRecord {
  id: string
  timestamp: Date
  createdBy: string
  role: "Doctor" | "Nurse"
  summary: string
  items: RecordItem[]
  editable: boolean
  admissionTime?: Date
  dischargeTime?: Date
  isCompleted?: boolean
}

export interface CarePlan {
  id: string
  type: RecordType
  productType?: ProductType // For products type plans
  description: string
  frequency: PlanFrequency
  scheduledTimes: string[] // e.g., ["08:00", "20:00"] for twice daily
  startDate: Date
  endDate?: Date
  createdBy: string
  role: "Doctor" | "Nurse"
}

export interface ScheduledTask {
  id: string
  planId: string
  plan: CarePlan
  scheduledTime: Date
  status: PlanStatus
  completedBy?: string
  completedAt?: Date
  recordId?: string // Link to the actual record when completed
}

export interface PatientAlert {
  id: string
  type: "allergy" | "warning" | "note"
  title: string
  description: string
  severity: "high" | "medium" | "low"
  createdBy: string
  createdAt: Date
}

export const mockRecords: ConsultationRecord[] = [
  {
    id: "1",
    timestamp: new Date("2025-01-19T08:00:00"),
    createdBy: "Dr. Sarah Johnson",
    role: "Doctor",
    summary: "Morning vitals recorded",
    items: [
      {
        id: "item-1",
        type: "vital-signs",
        details: {
          "Blood Pressure": "120/80 mmHg",
          "Heart Rate": "72 bpm",
          Temperature: "98.6°F",
          "Oxygen Saturation": "98%",
        },
      },
    ],
    admissionTime: new Date("2025-01-19T08:00:00"),
    editable: false,
    isCompleted: false,
  },
  {
    id: "2",
    timestamp: new Date("2025-01-19T09:30:00"),
    createdBy: "Nurse Emily Chen",
    role: "Nurse",
    summary: "Morning assessment - vitals and medication",
    items: [
      {
        id: "item-2a",
        type: "vital-signs",
        details: {
          "Blood Pressure": "119/79 mmHg",
          "Heart Rate": "70 bpm",
          Temperature: "98.5°F",
          "Oxygen Saturation": "98%",
        },
      },
      {
        id: "item-2b",
        type: "medication",
        details: {
          Medication: "Lisinopril 10mg",
          Route: "Oral",
          Dosage: "1 tablet",
          Notes: "Patient tolerated well",
        },
      },
    ],
    admissionTime: new Date("2025-01-19T08:00:00"),
    editable: false,
    isCompleted: false,
  },
  {
    id: "3",
    timestamp: new Date("2025-01-19T14:00:00"),
    createdBy: "Dr. Michael Park",
    role: "Doctor",
    summary: "Afternoon examination and assessment",
    items: [
      {
        id: "item-3",
        type: "exam",
        details: {
          "Examination Type": "Physical examination",
          Findings: "Patient stable, no acute distress",
          Assessment: "Improving condition",
          Plan: "Continue current treatment",
        },
      },
    ],
    admissionTime: new Date("2025-01-19T08:00:00"),
    editable: false,
    isCompleted: false,
  },
  {
    id: "4",
    timestamp: new Date("2025-01-20T08:15:00"),
    createdBy: "Nurse James Wilson",
    role: "Nurse",
    summary: "Morning round - vitals, medication, and notes",
    items: [
      {
        id: "item-4a",
        type: "vital-signs",
        details: {
          "Blood Pressure": "118/78 mmHg",
          "Heart Rate": "68 bpm",
          Temperature: "98.4°F",
          "Oxygen Saturation": "99%",
        },
      },
      {
        id: "item-4b",
        type: "medication",
        details: {
          Medication: "Lisinopril 10mg",
          Route: "Oral",
          Dosage: "1 tablet",
          Notes: "No adverse reactions",
        },
      },
      {
        id: "item-4c",
        type: "note",
        details: {
          Subject: "Patient stability",
          Note: "Patient appears well, sleeping peacefully, no complaints.",
        },
      },
    ],
    admissionTime: new Date("2025-01-19T08:00:00"),
    editable: true,
    isCompleted: false,
  },
  {
    id: "5",
    timestamp: new Date("2025-01-20T11:30:00"),
    createdBy: "Dr. Sarah Johnson",
    role: "Doctor",
    summary: "Patient discharged - stable condition",
    items: [
      {
        id: "item-5",
        type: "products",
        details: {
          "Product Type": "action",
          Action: "Patient Discharge",
          Reason: "Patient showing significant improvement. Vital signs stable. Ready for discharge.",
        },
      },
    ],
    admissionTime: new Date("2025-01-19T08:00:00"),
    dischargeTime: new Date("2025-01-20T11:30:00"),
    editable: false,
    isCompleted: true,
  },
]

export const mockCarePlans: CarePlan[] = [
  {
    id: "plan-1",
    type: "medication",
    description: "Administer Insulin injection",
    frequency: "twice-daily",
    scheduledTimes: ["08:00", "20:00"],
    startDate: new Date("2025-01-19"),
    createdBy: "Dr. Sarah Johnson",
    role: "Doctor",
  },
  {
    id: "plan-2",
    type: "vital-signs",
    description: "Check vital signs",
    frequency: "three-times-daily",
    scheduledTimes: ["08:00", "14:00", "20:00"],
    startDate: new Date("2025-01-19"),
    createdBy: "Dr. Sarah Johnson",
    role: "Doctor",
  },
  {
    id: "plan-3",
    type: "medication",
    description: "Administer Lisinopril 10mg",
    frequency: "daily",
    scheduledTimes: ["09:00"],
    startDate: new Date("2025-01-19"),
    createdBy: "Dr. Michael Park",
    role: "Doctor",
  },
]

export const mockPatientAlerts: PatientAlert[] = [
  {
    id: "alert-1",
    type: "allergy",
    title: "Penicillin Allergy",
    description: "Patient has severe allergic reaction to penicillin. Use alternative antibiotics.",
    severity: "high",
    createdBy: "Dr. Sarah Johnson",
    createdAt: new Date("2025-01-15"),
  },
  {
    id: "alert-2",
    type: "warning",
    title: "Fall Risk",
    description: "Patient is at high risk for falls. Assist with ambulation.",
    severity: "high",
    createdBy: "Nurse Emily Chen",
    createdAt: new Date("2025-01-18"),
  },
  {
    id: "alert-3",
    type: "note",
    title: "Dietary Restriction",
    description: "Patient is on a low-sodium diet. Monitor fluid intake.",
    severity: "medium",
    createdBy: "Dr. Michael Park",
    createdAt: new Date("2025-01-19"),
  },
]

export const generateScheduledTasks = (plans: CarePlan[], date: Date = new Date()): ScheduledTask[] => {
  const tasks: ScheduledTask[] = []
  const today = new Date(date)
  today.setHours(0, 0, 0, 0)

  plans.forEach((plan) => {
    plan.scheduledTimes.forEach((time) => {
      const [hours, minutes] = time.split(":").map(Number)
      const scheduledTime = new Date(today)
      scheduledTime.setHours(hours, minutes, 0, 0)

      // Determine status based on time and completion
      let status: PlanStatus = "pending"
      const now = new Date()

      if (scheduledTime < now) {
        // Check if this task was completed in mockRecords
        const completed = mockRecords.some(
          (record) =>
            record.type === plan.type &&
            record.timestamp.getHours() === hours &&
            record.timestamp.getMinutes() === minutes &&
            record.timestamp.toDateString() === today.toDateString(),
        )
        status = completed ? "completed" : "overdue"
      }

      tasks.push({
        id: `task-${plan.id}-${time}`,
        planId: plan.id,
        plan,
        scheduledTime,
        status,
      })
    })
  })

  return tasks.sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime())
}

export const getRecordIcon = (type: RecordType, productType?: ProductType): string => {
  const icons: Record<RecordType, string> = {
    "vital-signs": "❤️",
    medication: "💊",
    products: productType === "action" ? "⚡" : "📦",
    exam: "🔍",
    note: "📝",
  }
  return icons[type]
}

export const getRecordColor = (type: RecordType, productType?: ProductType): string => {
  const colors: Record<RecordType, string> = {
    "vital-signs": "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
    medication: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    products: productType === "action" 
      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
      : "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
    exam: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
    note: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  }
  return colors[type]
}
