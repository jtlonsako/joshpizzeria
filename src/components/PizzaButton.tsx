import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import PizzaToppingList from "./PizzaToppingsList"
import { deletePizza, updatePizzaName } from "@/db/queries";
import { useState } from "react";
import { DialogClose } from "@radix-ui/react-dialog";

export default function PizzaButton({pizzaInfo, updatePizzaNameDOM, removePizza}) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempTitle, setTempTitle] = useState(pizzaInfo.name);

    const handleEditClick = () => {
        setTempTitle(pizzaInfo.name);
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
    };

    async function handleSaveClick() {
        try {
            await updatePizzaName(pizzaInfo.id, tempTitle);
            updatePizzaNameDOM(pizzaInfo.id, tempTitle);
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating pizza name:", error);
        };
    }

    async function handleDelete() {
        await deletePizza(pizzaInfo.id);
        removePizza(pizzaInfo.id);
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="w-62 h-full px-4 border border-black bg-gray-300 rounded-md hover:bg-gray-500 hover:text-white transition-colors m-4">
                    {pizzaInfo.name}
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        <div>
                        {isEditing ? (
                        <div className="flex items-center">
                            <input
                                type="text"
                                value={tempTitle}
                                onChange={(e) => setTempTitle(e.target.value)}
                                className="border rounded px-2 py-1"
                            />
                            <button
                                onClick={handleSaveClick}
                                className="ml-2 bg-green-500 text-white px-2 py-1 rounded"
                            >
                                Save
                            </button>
                            <button
                                onClick={handleCancelClick}
                                className="ml-2 bg-gray-500 text-white px-2 py-1 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <h2 className="text-xl font-bold">{pizzaInfo.name}</h2>
                            <button
                                onClick={handleEditClick}
                                className="ml-auto mr-3 bg-blue-500 text-white px-3 py-1 rounded"
                            >
                                Edit
                            </button>
                        </div>
                    )}
                </div>
                    </DialogTitle>
                </DialogHeader>
                <div>
                    <PizzaToppingList pizzaInfo={pizzaInfo} />
                </div>
                <DialogClose>
                    <button onClick={handleDelete} className="px-4 py-2 bg-red-500 rounded-md hover:bg-red-700 hover:text-white transition-colors">Delete Pizza</button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    )
}