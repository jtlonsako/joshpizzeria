import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const toppingsTable = pgTable("toppings", {
  topping: varchar().primaryKey().unique(),
});

export const pizzaTable = pgTable("pizzas", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar().notNull()
})

export const pizzaToppings = pgTable("pizzaTables", {
    topping: varchar().references(() => toppingsTable.topping, { onDelete: 'cascade' }),
    pizzaId: integer().references(() => pizzaTable.id, { onDelete: 'cascade' })
})