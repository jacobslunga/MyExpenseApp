import {
  numeric,
  pgTable,
  serial,
  text,
  index,
  timestamp,
} from "drizzle-orm/pg-core";

export const expenses = pgTable(
  "expenses",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    title: text("title").notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (countries) => {
    return {
      userIdIndex: index("name_idx").on(countries.userId),
    };
  }
);
