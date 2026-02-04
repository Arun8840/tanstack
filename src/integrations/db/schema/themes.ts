import { boolean, pgTable, text } from "drizzle-orm/pg-core";



export const themes = pgTable(
    "themes",
    {
        id: text("id").primaryKey(),
        title: text("title").notNull(),
        description: text("description"),
        favorite: boolean("favorite").default(false)
    },
);