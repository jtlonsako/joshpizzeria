"use client";

import CreatePizza from "@/components/CreatePizza";
import PizzaButton from "@/components/PizzaButton";
import { getAllPizzas } from "@/db/queries";
import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

export default function PizzaManagement() {
    const [pizzaList, setPizzaList] = useState([{id: 0, name: ''}]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getPizzaList = async () => {
            try {
                const newPizzaList = await getAllPizzas();
                setPizzaList(newPizzaList);
            } catch (error) {
                console.error("Failed to fetch pizzas:", error);
            } finally {
                setIsLoading(false);
            }
        };

        getPizzaList();
    }, []);

    function updatePizzaName(pizzaId, newName) {
        setPizzaList((prevList) =>
            prevList.map((pizza) =>
                pizza.id === pizzaId ? { ...pizza, name: newName } : pizza
            )
        );
    }

    function addPizzaToList(newPizza) {
        setPizzaList((prevList) => [...prevList, newPizza]);
    }

    function removePizza(pizzaId) {
        setPizzaList((prevList) => prevList.filter(pizza => pizza.id !== pizzaId));
    }

    return (
        <div className="w-full grid justify-center">
            <div>
                <p className="text-3xl justify-self-center text-center">Master Pieces</p>
            </div>
            {isLoading ? (
                <div className="flex justify-center items-center mt-10">
                    <LoadingSpinner />
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-2">
                    {pizzaList.map((pizza) => (
                        <PizzaButton
                            key={pizza.id}
                            pizzaInfo={pizza}
                            updatePizzaNameDOM={updatePizzaName}
                            removePizza={removePizza}
                        />
                    ))}
                    <CreatePizza addPizzaToList={addPizzaToList} />
                </div>
            )}
        </div>
    );
}