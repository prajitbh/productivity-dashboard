CREATE TABLE IF NOT EXISTS "goals" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"status" text DEFAULT 'active' NOT NULL,
	"target_date" date,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"status" text DEFAULT 'todo' NOT NULL,
	"priority" text DEFAULT 'medium' NOT NULL,
	"due_date" date,
	"goal_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);

CREATE TABLE IF NOT EXISTS "habits" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"color" text DEFAULT 'sage' NOT NULL,
	"target_per_week" integer DEFAULT 7 NOT NULL,
	"archived" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "habit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"habit_id" integer NOT NULL,
	"date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "habit_date_unique" UNIQUE("habit_id","date")
);

CREATE TABLE IF NOT EXISTS "notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"pinned" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

DO $$ BEGIN
 ALTER TABLE "tasks" ADD CONSTRAINT "tasks_goal_id_goals_id_fk" FOREIGN KEY ("goal_id") REFERENCES "public"."goals"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "habit_logs" ADD CONSTRAINT "habit_logs_habit_id_habits_id_fk" FOREIGN KEY ("habit_id") REFERENCES "public"."habits"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE INDEX IF NOT EXISTS "tasks_status_idx" ON "tasks" ("status");
CREATE INDEX IF NOT EXISTS "tasks_goal_id_idx" ON "tasks" ("goal_id");
CREATE INDEX IF NOT EXISTS "habit_logs_habit_id_idx" ON "habit_logs" ("habit_id");
