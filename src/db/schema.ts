import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  boolean,
  date,
  real,
  unique,
} from "drizzle-orm/pg-core";

// ================= Core: Goals / Tasks =================

export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("active"), // active | completed | archived
  targetDate: date("target_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("todo"), // todo | in_progress | done
  priority: text("priority").notNull().default("medium"), // low | medium | high
  dueDate: date("due_date"),
  goalId: integer("goal_id").references(() => goals.id, { onDelete: "set null" }),
  sortOrder: integer("sort_order").notNull().default(0),
  // Recurrence: null (one-off) | daily | weekdays | weekly | monthly
  recurrence: text("recurrence"),
  // Self-reference for subtasks — a task with parentTaskId set is a subtask of another task.
  parentTaskId: integer("parent_task_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

// ================= Habits (Reading / TV / Journaling subtabs) =================

export const habits = pgTable("habits", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull().default("sage"), // sage | amber | brick
  category: text("category").notNull().default("general"), // reading | tv | journaling | general
  targetPerWeek: integer("target_per_week").notNull().default(7),
  archived: boolean("archived").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const habitLogs = pgTable(
  "habit_logs",
  {
    id: serial("id").primaryKey(),
    habitId: integer("habit_id")
      .notNull()
      .references(() => habits.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    habitDateUnique: unique("habit_date_unique").on(table.habitId, table.date),
  })
);

// ================= Media (Movies / Shows, lives under Habits > TV) =================

export const mediaEntries = pgTable("media_entries", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  mediaType: text("media_type").notNull().default("movie"), // movie | show
  posterUrl: text("poster_url"),
  tmdbId: integer("tmdb_id"),
  status: text("status").notNull().default("want_to_watch"), // want_to_watch | watching | completed
  rating: real("rating"), // 0-10, user's own rating
  genres: text("genres").notNull().default(""), // comma-separated
  releaseDate: date("release_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ================= Notes =================

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull().default(""), // plain-text fallback
  contentHtml: text("content_html").notNull().default(""), // formatted rich text
  pinned: boolean("pinned").notNull().default(false),
  width: integer("width"),
  height: integer("height"),
  // If set, this note is the "sticky note" pinned to the top of a specific tab
  // (e.g. "career", "university", "habits", "home"). Null = a regular note.
  tabKey: text("tab_key"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ================= Career: Network tracker =================

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  linkedinUrl: text("linkedin_url"),
  description: text("description"),
  company: text("company"),
  howMet: text("how_met"),
  lastContactedDate: date("last_contacted_date"),
  industry: text("industry"), // fixed category
  position: text("position"), // fixed category
  locationType: text("location_type"), // in_state | out_of_state
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ================= University =================

export const classes = pgTable("classes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  term: text("term"),
  instructor: text("instructor"),
  grade: text("grade"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const clubs = pgTable("clubs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role"),
  schedule: text("schedule"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ================= Working Out =================

export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  type: text("type").notNull(), // e.g. "Push", "Run", "Legs"
  durationMinutes: integer("duration_minutes"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Goal = typeof goals.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type Habit = typeof habits.$inferSelect;
export type HabitLog = typeof habitLogs.$inferSelect;
export type MediaEntry = typeof mediaEntries.$inferSelect;
export type Note = typeof notes.$inferSelect;
export type Contact = typeof contacts.$inferSelect;
export type Class = typeof classes.$inferSelect;
export type Club = typeof clubs.$inferSelect;
export type Workout = typeof workouts.$inferSelect;
