import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  boolean,
  date,
  unique,
} from "drizzle-orm/pg-core";

// ---------- Goals ----------
export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("active"), // active | completed | archived
  targetDate: date("target_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ---------- Tasks ----------
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("todo"), // todo | in_progress | done
  priority: text("priority").notNull().default("medium"), // low | medium | high
  dueDate: date("due_date"),
  goalId: integer("goal_id").references(() => goals.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

// ---------- Habits ----------
export const habits = pgTable("habits", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull().default("sage"), // sage | amber | brick
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

// ---------- Notes ----------
export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull().default(""),
  pinned: boolean("pinned").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Goal = typeof goals.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type Habit = typeof habits.$inferSelect;
export type HabitLog = typeof habitLogs.$inferSelect;
export type Note = typeof notes.$inferSelect;
