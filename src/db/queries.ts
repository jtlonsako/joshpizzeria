import "dotenv/config"
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { pizzaTable, pizzaToppings, toppingsTable } from "./schema";
import { and, eq } from "drizzle-orm";

// const databaseUrl = process.env.DATABASE_URL;
// if (!databaseUrl) {
//     throw new Error('DATABASE_URL is not defined in the environment variables.');
//   }
  
const sql = neon("postgresql://neondb_owner:xvg0AHkSE7ws@ep-sweet-lab-a54gj8lo.us-east-2.aws.neon.tech/neondb?sslmode=require");
export const db = drizzle({ client: sql });

export async function getAllToppings() {
    try {
        return await db.select().from(toppingsTable);
    } catch (error) {
        throw error;
    }
}

export async function updateTopping(oldToppingName, newToppingName) {
    try {
        return await db.update(toppingsTable).set({topping: newToppingName}).where(eq(toppingsTable.topping, oldToppingName));
    } catch (error) {
        throw error;
    }
}

export async function addTopping(toppingName) {
    try {
        return await db.insert(toppingsTable).values({topping: toppingName});
    } catch (error) {
        throw error;
    }
}

export async function deleteTopping(key) {
    try {
        return await db.delete(toppingsTable).where(eq(toppingsTable.topping, key));
    } catch (error) {
        throw error;
    }
}

export async function getAllPizzas() {
    try {
        return await db.select().from(pizzaTable);
    } catch (error) {
        throw error;
    }
}

export async function createPizza(pizzaName) {
    try{
        return await db.insert(pizzaTable).values({name: pizzaName}).returning();
    } catch(error) {
        throw error;
    }
}

export async function deletePizza(pizzaId) {
    try {
        return await db.delete(pizzaTable).where(eq(pizzaTable.id, pizzaId));
    } catch(error) {
        throw error;
    }
}

export async function getPizzaToppingsByPizzaId(pizzaId) {
    try {
        return await db.select().from(pizzaToppings).where(eq(pizzaToppings.pizzaId, pizzaId));
    } catch (error) {
        throw error;
    }
}

export async function updatePizzaName(pizzaId, pizzaName) {
    try {
        return await db.update(pizzaTable).set({name: pizzaName}).where(eq(pizzaTable.id, pizzaId));
    } catch (error) {
        throw error;
    }
}

export async function addPizzaTopping(pizzaId, topping) {
    try {
        return await db.insert(pizzaToppings).values({pizzaId: pizzaId, topping: topping})
    } catch (error) {
        throw error;
    }
}

export async function deletePizzaTopping(pizzaId, topping) {
    try {
        return await db.delete(pizzaToppings).where(and(eq(pizzaToppings.pizzaId, pizzaId), eq(pizzaToppings.topping, topping)));
    } catch (error) {
        throw error;
    }
}