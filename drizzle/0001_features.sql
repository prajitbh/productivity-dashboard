-- Adds columns needed for: subtasks, recurring tasks, manual task ordering,
-- and archiving notes. All additive and nullable/defaulted, so existing
-- rows are unaffected.

ALTER TABLE "tasks" ADD COLUMN IF NOT EXISTS "parent_task_id" integer;
ALTER TABLE "tasks" ADD COLUMN IF NOT EXISTS "recurrence" text;
ALTER TABLE "tasks" ADD COLUMN IF NOT EXISTS "sort_order" integer NOT NULL DEFAULT 0;

ALTER TABLE "notes" ADD COLUMN IF NOT EXISTS "archived" boolean NOT NULL DEFAULT false;

DO $$ BEGIN
 ALTER TABLE "tasks" ADD CONSTRAINT "tasks_parent_task_id_tasks_id_fk" FOREIGN KEY ("parent_task_id") REFERENCES "public"."tasks"("id") ON DELETE CASCADE ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE INDEX IF NOT EXISTS "tasks_parent_task_id_idx" ON "tasks" ("parent_task_id");
