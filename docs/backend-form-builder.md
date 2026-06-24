# Backend Guide: Form Builder Persistence

This document outlines the requirements and recommended implementation for persisting form structures and their answers in the backend.

## 1. Technology Stack
- **Language/Framework:** Spring Boot (Java/Kotlin)
- **Database:** PostgreSQL
- **API:** GraphQL (using existing structure)

## 2. Database Schema (PostgreSQL)

We recommend using a relational structure with JSONB fields for the flexible block-based content.

### Table: `forms`
Stores the high-level metadata of a form.
```sql
CREATE TABLE forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL, -- e.g., 'consultation', 'consent', 'custom'
    category TEXT,
    current_version_id UUID, -- References form_versions
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `form_versions`
Stores the actual structure of the form at a specific version.
```sql
CREATE TABLE form_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
    version_label TEXT NOT NULL, -- e.g., "0.1", "1.0"
    major_version INTEGER NOT NULL,
    minor_version INTEGER NOT NULL,
    blocks JSONB NOT NULL, -- The array of FormBlock objects
    sections JSONB, -- The array of FormSection objects (optional)
    actions JSONB, -- The array of FormAction objects (optional)
    theme JSONB, -- FormTheme object
    status TEXT NOT NULL DEFAULT 'DRAFT', -- 'DRAFT', 'FINAL'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(form_id, major_version, minor_version)
);
```

### Table: `form_answers`
Stores user-submitted answers. Each answer set is linked to a specific version of the form.
```sql
CREATE TABLE form_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_version_id UUID NOT NULL REFERENCES form_versions(id),
    clinic_id UUID, -- For multi-tenancy if applicable
    patient_id UUID,
    provider_id UUID,
    answers JSONB NOT NULL, -- Key-value map: { "block_id": "value" }
    status TEXT NOT NULL DEFAULT 'DRAFT', -- 'DRAFT', 'SUBMITTED'
    submitted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 3. Versioning Logic

The system uses a `major.minor` versioning scheme.
- **Initial Version:** `0.0`
- **While Editing (Draft):** The version stays the same during successive saves until marked as **FINAL**.
- **After Mark as Final:** The next save/update creates a new version record.
- **Increment Logic:**
    - `minor` increments by 1 (e.g., `0.1` -> `0.2`).
    - When `minor` reaches `10`, the `major` version increments and `minor` resets to `0` (e.g., `0.10` -> `1.0`).
- **Traceability:** Answers always point to the `form_version_id` they were created with. If a form is updated to a new version, existing answers remain linked to the old version structure to ensure data integrity.

## 4. GraphQL Schema Definitions

Align with existing `user.graphqls` and `forms.graphqls` patterns.

### Types
```graphql
type Form {
  id: ID!
  name: String!
  description: String
  type: String!
  category: String
  currentVersion: FormVersion
  versions: [FormVersion!]
  createdAt: String!
  updatedAt: String!
}

type FormVersion {
  id: ID!
  formId: ID!
  versionLabel: String!
  majorVersion: Int!
  minorVersion: Int!
  blocks: JSON!
  sections: JSON
  theme: JSON
  status: FormStatus!
  createdAt: String!
}

type FormAnswer {
  id: ID!
  formVersion: FormVersion!
  answers: JSON!
  status: AnswerStatus!
  patientId: ID
  providerId: ID
  submittedAt: String
  createdAt: String!
  updatedAt: String!
}
```

### Operations
```graphql
extend type Query {
  # Standalone form queries
  getAllForms(category: String): [Form!]!
  getFormById(id: ID!): Form
  getFormVersion(versionId: ID!): FormVersion
  
  # Answer queries
  getAnswersByForm(formId: ID!): [FormAnswer!]!
  getAnswersByVersion(versionId: ID!): [FormAnswer!]!
  getAnswerById(id: ID!): FormAnswer
}

extend type Mutation {
  # Form Management
  createStandaloneForm(input: FormInput!): Form!
  updateStandaloneForm(id: ID!, input: FormInput!): FormVersion!
  markFormAsFinal(versionId: ID!): FormVersion!
  deleteForm(id: ID!): Boolean!
  deleteFormVersion(versionId: ID!): Boolean!

  # Answer Management
  saveFormAnswer(versionId: ID!, answers: JSON!, patientId: ID): FormAnswer!
  updateFormAnswer(answerId: ID!, answers: JSON!): FormAnswer!
  deleteFormAnswer(answerId: ID!): Boolean!
}
```

## 5. Business Rules & Logic

### Deletion Constraint
- A `FormVersion` **cannot** be deleted if it has any associated `FormAnswer` records.
- To delete a version with answers, the backend must require a confirmation flag (e.g., `cascadeDeleteAnswers: true`) or return an error indicating that answers exist.
- A `Form` cannot be deleted if any of its versions have answers (unless cascading is confirmed).

### Version Incremental Logic (Pseudo-code)
```kotlin
fun getNextVersion(currentMajor: Int, currentMinor: Int): Pair<Int, Int> {
    return if (currentMinor >= 10) {
        Pair(currentMajor + 1, 0)
    } else {
        Pair(currentMajor, currentMinor + 1)
    }
}
```

### Persistence of Blocks
The `blocks` and `sections` should be stored as JSONB to accommodate the evolving nature of the form builder without requiring schema migrations for every new block type.

## 6. Traceability Best Practice
When fetching an answer, always return the `FormVersion` structure it belongs to. This allows the frontend to render the "historical" version of the form even if the current template has changed significantly.
