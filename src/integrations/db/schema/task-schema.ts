import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";



import { relations } from "drizzle-orm";
import { user } from "./auth-schema";

export const tasks = pgTable("tasks", {
    id: text("id").primaryKey().notNull(),
    title: text("title").notNull(),
    description: text("description"),
    assigneeId: text("assignee_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    completed: boolean("completed").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

export const tasksRelations = relations(tasks, ({ one }) => ({
    assignee: one(user, {
        fields: [tasks.assigneeId],
        references: [user.id],
    }),
}));