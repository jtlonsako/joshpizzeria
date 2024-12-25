import { deletePizzaTopping, getAllToppings, getPizzaToppingsByPizzaId, addPizzaTopping } from "@/db/queries";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "./ui/table";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { useEffect, useState } from "react";
import { FaAngleDown, FaPlus, FaTrashCan } from "react-icons/fa6";


export default function PizzaToppingList({ pizzaInfo }: {pizzaInfo: {name: string, id: number}}) {
    const [pizzaToppings, setPizzaToppings] = useState([]);
    const [availableToppings, setAvailableToppings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchToppings = async () => {
            setLoading(true);
            try {
                const allToppings = await getAllToppings();
                const fullPizzaToppingInfo = await getPizzaToppingsByPizzaId(pizzaInfo.id);
                const pizzaToppingsOnly = fullPizzaToppingInfo.map((toppingInfo) => toppingInfo.topping);

                setAvailableToppings(allToppings.filter(toppingFromAll => !pizzaToppingsOnly.includes(toppingFromAll.topping)));
                setPizzaToppings(pizzaToppingsOnly);
                setError("");
            } catch (error) {
                console.error("Error fetching toppings:", error);
                setError("Failed to fetch toppings.");
            } finally {
                setLoading(false);
            }
        };

        fetchToppings();
    }, [pizzaInfo.id]);

    const handleDeleteTopping = async (topping) => {
        setLoading(true);
        try {
            await deletePizzaTopping(pizzaInfo.id, topping);
            setPizzaToppings((prev) => prev.filter((t) => t !== topping));
            setAvailableToppings((prev) => [...prev, { topping }]);
            setError("");
        } catch (error) {
            console.error("Error deleting topping:", error);
            setError("Failed to delete topping.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddTopping = async (topping) => {
        setLoading(true);
        try {
            await addPizzaTopping(pizzaInfo.id, topping);
            setPizzaToppings((prev) => [...prev, topping]);
            setAvailableToppings((prev) => prev.filter((t) => t.topping !== topping));
            setError("");
        } catch (error) {
            console.error("Error adding topping:", error);
            setError(error.message || "Failed to add topping.");
            throw error; // Re-throw to allow the child component to handle it
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {error && <div className="mb-4 text-red-500">{error}</div>}
            <Table>
                <TableCaption>Master Pizza Toppings</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[200px]">Topping</TableHead>
                        <TableHead className="text-right w-[50px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={2} className="text-center">
                                Loading...
                            </TableCell>
                        </TableRow>
                    ) : (
                        pizzaToppings.map((topping) => (
                            <PizzaToppingRow
                                key={topping}
                                pizzaId={pizzaInfo.id}
                                topping={topping}
                                onDelete={handleDeleteTopping}
                            />
                        ))
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <AddPizzaToppingRow
                            pizzaId={pizzaInfo.id}
                            availableToppings={availableToppings}
                            onAdd={handleAddTopping}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
}

function PizzaToppingRow({ pizzaId, topping, onDelete }) {
    const [error, setError] = useState("");

    const handleDelete = async () => {
        try {
            await onDelete(topping);
            setError("");
        } catch (err) {
            setError(err.message || "Failed to delete topping.");
        }
    };

    return (
        <TableRow>
            <TableCell className="font-medium">{topping}</TableCell>
            <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                    <button onClick={handleDelete}>
                        <span>
                            <FaTrashCan />
                        </span>
                    </button>
                </div>
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </TableCell>
        </TableRow>
    );
}

function AddPizzaToppingRow({ pizzaId, availableToppings, onAdd }) {
    const [rowState, setRowState] = useState("view");
    const [selectedTopping, setSelectedTopping] = useState("");
    const [error, setError] = useState("");

    const handleAdd = async () => {
        if (selectedTopping.trim() === "") {
            setError("Please select a topping.");
            return;
        }

        try {
            await onAdd(selectedTopping);
            setRowState("view");
            setSelectedTopping("");
            setError("");
        } catch (err) {
            setError(err.message || "Failed to add topping.");
        }
    };

    return (
        <>
            {rowState === "view" ? (
                <>
                    <TableCell className="font-medium">
                        <p>Add new topping</p>
                    </TableCell>
                    <TableCell className="text-right">
                        <button onClick={() => setRowState("add")}>
                            <span>
                                <FaPlus />
                            </span>
                        </button>
                    </TableCell>
                </>
            ) : (
                <>
                    <TableCell>
                        <Popover>
                            <PopoverTrigger asChild>
                                <button className={`flex px-2 py-1 rounded-md border ${error ? 'border-red-500' : 'border-gray-300'} bg-gray-300`}>
                                    {selectedTopping || "Select a Topping"}
                                    <span className="ml-2 content-center"><FaAngleDown /></span>
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64">
                                {availableToppings.length > 0 ? (
                                    availableToppings.map((toppingObj) => (
                                        <PopoverClose asChild key={toppingObj.topping}>
                                            <button
                                                className={`w-full text-left hover:bg-gray-300 transition-colors px-2 py-1 ${selectedTopping === toppingObj.topping ? 'bg-gray-400' : ''}`}
                                                onClick={() => {
                                                    setSelectedTopping(toppingObj.topping);
                                                    setError("");
                                                }}
                                            >
                                                {toppingObj.topping}
                                            </button>
                                        </PopoverClose>
                                    ))
                                ) : (
                                    <div className="px-2 py-1 text-gray-500">No available toppings</div>
                                )}
                            </PopoverContent>
                        </Popover>
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setRowState("view");
                                    setSelectedTopping("");
                                    setError("");
                                }}
                                className="px-2 py-1 bg-gray-500 hover:bg-gray-300 hover:text-black transition-colors rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAdd}
                                className="px-2 py-1 bg-green-500 hover:bg-green-300 hover:text-black transition-colors rounded-md"
                                disabled={selectedTopping.trim() === ""}
                            >
                                Add
                            </button>
                        </div>
                    </TableCell>
                </>
            )}
        </>
    );
}