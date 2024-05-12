import {
  numeric,
  pgTable,
  serial,
  text,
  index,
  timestamp,
  date,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";

export const expenses = pgTable(
  "expenses",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    title: text("title").notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    date: date("date").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (countries) => {
    return {
      userIdIndex: index("name_idx").on(countries.userId),
    };
  }
);

export const insertExpenseSchema = createInsertSchema(expenses, {
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, {
    message: "Amount must be a number with up to 2 decimal places",
  }),
  // date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
  //   message: "Date must be in the format YYYY-MM-DD",
  // }),
});
export const selectExpenseSchema = createSelectSchema(expenses);
