/**
 * Seeds Supabase with curriculum from data/*.ts
 *
 * Usage:
 *   npm run seed:supabase
 *
 * Requires in .env:
 *   EXPO_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import "dotenv/config";

import { LANGUAGES } from "../data/languages";
import { LESSONS } from "../data/lessons";
import { UNITS } from "../data/units";
import { collectAllExerciseTemplates } from "../lib/curriculum/exerciseTemplates/collect";
import {
  exerciseTemplateToRow,
  languageToRow,
  lessonToRow,
  unitToRow,
} from "../lib/supabase/mappers";
import { getSupabaseAdmin } from "../lib/supabase/admin";

const SCHEMA_MISSING = "PGRST205";

function printSchemaInstructions(): void {
  console.error(`
╔══════════════════════════════════════════════════════════════════╗
║  Supabase tables are missing — seed cannot run yet.              ║
╠══════════════════════════════════════════════════════════════════╣
║  1. Open https://supabase.com/dashboard → your project           ║
║  2. SQL Editor → New query                                         ║
║  3. Paste the FULL file: supabase/schema.sql                     ║
║  4. Click Run (wait for success)                                 ║
║  5. Table Editor → confirm: languages, units, lessons,             ║
║     exercise_step_templates                                        ║
║  6. Run again:  bun run seed:supabase                             ║
╚══════════════════════════════════════════════════════════════════╝
`);
}

async function assertTablesExist(
  supabase: ReturnType<typeof getSupabaseAdmin>
): Promise<void> {
  const { error } = await supabase.from("languages").select("code").limit(1);
  if (error?.code === SCHEMA_MISSING) {
    printSchemaInstructions();
    process.exit(1);
  }
  if (error) throw error;
}

async function main() {
  const supabase = getSupabaseAdmin();

  console.log("Checking database schema…");
  await assertTablesExist(supabase);

  console.log("Seeding languages…");
  const { error: langError } = await supabase
    .from("languages")
    .upsert(LANGUAGES.map(languageToRow), { onConflict: "code" });
  if (langError) throw langError;

  console.log("Seeding units…");
  const { error: unitError } = await supabase
    .from("units")
    .upsert(UNITS.map(unitToRow), { onConflict: "id" });
  if (unitError) throw unitError;

  console.log("Seeding lessons…");
  const { error: lessonError } = await supabase
    .from("lessons")
    .upsert(LESSONS.map(lessonToRow), { onConflict: "id" });
  if (lessonError) throw lessonError;

  const exerciseTemplates = collectAllExerciseTemplates();
  console.log(`Seeding ${exerciseTemplates.length} exercise step templates…`);

  const BATCH_SIZE = 200;
  const templateRows = exerciseTemplates.map(exerciseTemplateToRow);
  for (let i = 0; i < templateRows.length; i += BATCH_SIZE) {
    const batch = templateRows.slice(i, i + BATCH_SIZE);
    const { error: templateError } = await supabase
      .from("exercise_step_templates")
      .upsert(batch, { onConflict: "id" });
    if (templateError) throw templateError;
  }

  console.log(
    `Done: ${LANGUAGES.length} languages, ${UNITS.length} units, ${LESSONS.length} lessons, ${exerciseTemplates.length} exercise templates.`
  );
}

main().catch((err) => {
  if (err && typeof err === "object" && "code" in err && err.code === SCHEMA_MISSING) {
    printSchemaInstructions();
  } else {
    console.error(err);
  }
  process.exit(1);
});
