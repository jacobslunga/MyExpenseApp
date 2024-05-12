import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createExpenseSchema } from "../sharedTypes";

import { getUser } from "../kinde";

import { db } from "../db/index";
import {
  expenses as expensesTable,
  insertExpenseSchema,
} from "../db/schema/expenses";
import { and, desc, eq, sum } from "drizzle-orm";

export const expensesRoute = new Hono()
  .get("/", getUser, async (c) => {
    const user = c.var.user;
    const expenses = await db
      .select()
      .from(expensesTable)
      .where(eq(expensesTable.userId, user.id))
      .orderBy(desc(expensesTable.createdAt))
      .limit(100);
    return c.json(expenses);
  })
  .post("/", getUser, zValidator("json", createExpenseSchema), async (c) => {
    const user = c.var.user;
    const expense = c.req.valid("json");

    const validatedExpense = insertExpenseSchema.parse({
      ...expense,
      userId: user.id,
    });

    const newExpense = await db
      .insert(expensesTable)
      .values(validatedExpense)
      .returning();

    c.status(201);
    return c.json({ newExpense });
  })
  .get("/total-spent", getUser, async (c) => {
    const user = c.var.user;
    const result = await db
      .select({ total: sum(expensesTable.amount) })
      .from(expensesTable)
      .where(eq(expensesTable.userId, user.id))
      .then((d) => d[0]);
    return c.json(result);
  })
  .get("/:id{[0-9]+}", getUser, async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const user = c.var.user;
    const expense = await db
      .select()
      .from(expensesTable)
      .where(and(eq(expensesTable.userId, user.id), eq(expensesTable.id, id)))
      .then((d) => d[0]);

    if (!expense) {
      c.status(404);
      return c.json({ error: "Not found" });
    }

    return c.json({ expense });
  })
  .delete("/:id{[0-9]+}", getUser, async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const user = c.var.user;
    const expense = await db
      .delete(expensesTable)
      .where(and(eq(expensesTable.userId, user.id), eq(expensesTable.id, id)))
      .returning()
      .then((d) => d[0]);

    if (!expense) {
      c.status(404);
      return c.json({ error: "Not found" });
    }

    return c.json({ expense });
  });
