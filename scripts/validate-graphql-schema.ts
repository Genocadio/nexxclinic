/**
 * validate-graphql-schema.ts
 *
 * Build-time guard that keeps the hand-written base types (lib/api-types.ts)
 * in sync with the GraphQL schema (.graphqls files).
 *
 * Checks:
 *  1. Every schema enum exists in api-types.ts with the exact same members.
 *  2. Every enum in api-types.ts still exists in the schema (no stale enums).
 *  3. For object types that share a name between schema and api-types.ts,
 *     every required scalar/enum field from the schema must exist in the
 *     TypeScript interface (warn-only — mapped types may intentionally flatten
 *     or add fields).
 *
 * Exit code 1 on any enum mismatch. Run via: bun scripts/validate-graphql-schema.ts
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildASTSchema,
  parse,
  getNamedType,
  isLeafType,
  type GraphQLEnumType,
  type GraphQLField,
} from "graphql";
import ts from "typescript";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SCHEMA_FILES = ["user.graphqls", "forms.graphqls", "visits.graphqls", "Newforms.graphqls"];
const TYPES_FILE = join(ROOT, "lib", "api-types.ts");

// ── Load & parse schema ────────────────────────────────────────────────────────
const schemaSdl = SCHEMA_FILES.map((file) =>
  readFileSync(join(ROOT, file), "utf8"),
).join("\n");

let schema;
try {
  schema = buildASTSchema(parse(schemaSdl));
} catch (err) {
  console.error("✖ Failed to parse .graphqls schema files:");
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
}

const schemaEnums = new Map<string, Set<string>>();
const schemaObjectTypes = new Map<string, Map<string, GraphQLField<unknown, unknown>>>();

for (const [name, type] of Object.entries(schema.getTypeMap())) {
  if (name.startsWith("__")) continue;
  if ((type as GraphQLEnumType).getValues) {
    try {
      const values = (type as GraphQLEnumType).getValues().map((v) => v.name);
      schemaEnums.set(name, new Set(values));
    } catch {
      /* not an enum */
    }
    continue;
  }
  if ((type as any).getFields && !name.startsWith("Query") && !name.startsWith("Mutation") && !name.startsWith("Subscription")) {
    const fields = (type as any).getFields() as Record<string, GraphQLField<unknown, unknown>>;
    schemaObjectTypes.set(name, new Map(Object.entries(fields)));
  }
}

// ── Parse api-types.ts with the TS compiler API ─────────────────────────────────
const sourceText = readFileSync(TYPES_FILE, "utf8");
const sourceFile = ts.createSourceFile(TYPES_FILE, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

const tsEnums = new Map<string, Set<string>>();
const tsInterfaces = new Map<string, Set<string>>();

function walk(node: ts.Node) {
  if (ts.isEnumDeclaration(node)) {
    const members = new Set<string>();
    for (const member of node.members) {
      const initializer = member.initializer;
      const name = initializer && ts.isStringLiteral(initializer)
        ? initializer.text
        : member.name.getText(sourceFile);
      members.add(name);
    }
    tsEnums.set(node.name.getText(sourceFile), members);
  } else if (ts.isInterfaceDeclaration(node)) {
    const fields = new Set<string>();
    for (const member of node.members) {
      if (ts.isPropertySignature(member) && member.name) {
        fields.add(member.name.getText(sourceFile));
      }
    }
    tsInterfaces.set(node.name.getText(sourceFile), fields);
  }
  ts.forEachChild(node, walk);
}
walk(sourceFile);

// ── Checks ──────────────────────────────────────────────────────────────────────
const errors: string[] = [];
const warnings: string[] = [];

// 1 + 2. Enum bidirectional check
for (const [name, schemaValues] of schemaEnums) {
  const tsValues = tsEnums.get(name);
  if (!tsValues) {
    errors.push(`Enum "${name}" exists in the GraphQL schema but is missing from lib/api-types.ts`);
    continue;
  }
  const missing = [...schemaValues].filter((v) => !tsValues.has(v));
  const extra = [...tsValues].filter((v) => !schemaValues.has(v));
  if (missing.length) {
    errors.push(`Enum "${name}" in api-types.ts is missing schema members: ${missing.join(", ")}`);
  }
  if (extra.length) {
    errors.push(`Enum "${name}" in api-types.ts has members not in the schema: ${extra.join(", ")}`);
  }
}

for (const [name] of tsEnums) {
  if (!schemaEnums.has(name)) {
    errors.push(`Enum "${name}" in api-types.ts does not exist in the GraphQL schema (stale enum)`);
  }
}

// 3. Object field presence (warn-only, leaf scalar/enum fields)
for (const [name, schemaFields] of schemaObjectTypes) {
  const tsFields = tsInterfaces.get(name);
  if (!tsFields) continue; // no 1:1 TS interface — skip
  for (const [fieldName, field] of schemaFields) {
    if (field.args.length > 0) continue; // resolvers/connections — skip
    // Only warn for leaf fields (scalar/enum). Object-typed and list fields are
    // allowed to be flattened/denormalized in the TS mapping layer.
    const namedType = getNamedType(field.type);
    if (!isLeafType(namedType)) continue;
    if (!tsFields.has(fieldName)) {
      warnings.push(`Type "${name}" in api-types.ts is missing schema field "${fieldName}: ${field.type}"`);
    }
  }
}

// ── Report ──────────────────────────────────────────────────────────────────────
for (const w of warnings) console.warn(`  ⚠ ${w}`);
if (errors.length) {
  console.error(`\n✖ GraphQL schema ↔ lib/api-types.ts drift detected (${errors.length}):`);
  for (const e of errors) console.error(`  ✖ ${e}`);
  process.exit(1);
}

const enumCount = schemaEnums.size;
const typeCount = schemaObjectTypes.size;
console.log(`✔ Schema valid: ${SCHEMA_FILES.join(", ")}`);
console.log(`✔ ${enumCount} enums and ${typeCount} object types checked against lib/api-types.ts`);
console.log(`✔ No drift found${warnings.length ? ` (${warnings.length} non-blocking warnings)` : ""}`);
