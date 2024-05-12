import { insertExpenseSchema } from "./db/schema/expenses";

export const createExpenseSchema = insertExpenseSchema.omit({
  userId: true,
  createdAt: true,
});
