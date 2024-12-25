CREATE TABLE "pizzas" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "pizzas_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pizzaTables" (
	"topping" varchar,
	"pizzaId" integer
);
--> statement-breakpoint
CREATE TABLE "toppings" (
	"topping" varchar PRIMARY KEY NOT NULL,
	CONSTRAINT "toppings_topping_unique" UNIQUE("topping")
);
--> statement-breakpoint
ALTER TABLE "pizzaTables" ADD CONSTRAINT "pizzaTables_topping_toppings_topping_fk" FOREIGN KEY ("topping") REFERENCES "public"."toppings"("topping") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pizzaTables" ADD CONSTRAINT "pizzaTables_pizzaId_pizzas_id_fk" FOREIGN KEY ("pizzaId") REFERENCES "public"."pizzas"("id") ON DELETE cascade ON UPDATE no action;