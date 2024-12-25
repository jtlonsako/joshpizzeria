"use client"
import { addTopping, deleteTopping, getAllToppings, updateTopping } from "@/db/queries";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "./ui/table";
import { useState, useEffect } from "react";
import { FaPenToSquare, FaPlus, FaTrashCan } from "react-icons/fa6";

export default function ToppingsTable() {
    const [toppings, setToppings] = useState(['']);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchToppings = async () => {
            try {
                const fetchedToppings = await getAllToppings();
                setToppings(fetchedToppings.map(toppingObg => toppingObg.topping));
            } catch (error) {
                console.error("Error fetching toppings:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchToppings();
    }, [])

    const handleDeleteTopping = async (topping) => {
        try {
            await deleteTopping(topping);
            setToppings(prev => prev.filter(t => t !== topping));
            setError('');
        } catch (err) {
            console.error("Error deleting topping:", err);
            setError(err.message || 'Failed to delete topping.');
        }
    };

    const handleAddTopping = async (newTopping) => {
        try {
            await addTopping(newTopping);
            setToppings(prev => [...prev, newTopping]);
            setError('');
        } catch (err) {
            console.error("Error adding topping:", err);
            setError(err.message || 'Failed to add topping.');
        }
    };

    const handleUpdateTopping = async (oldTopping, updatedTopping) => {
        try {
            await updateTopping(oldTopping, updatedTopping);
            setToppings(prev => prev.map(t => t === oldTopping ? updatedTopping : t));
            setError('');
        } catch (err) {
            console.error("Error updating topping:", err);
            setError(err.message || 'Failed to update topping.');
        }
    };

    const allToppings = toppings.length > 0 ? (
        toppings.map((topping) => (
            <ToppingRow
                key={topping}
                topping={topping}
                onDelete={handleDeleteTopping}
                onUpdate={handleUpdateTopping}
            />
        ))
    ) : (
        <TableRow key="no-toppings">
            <TableCell colSpan={2} className="text-center">
                No toppings available.
            </TableCell>
        </TableRow>
    );

    return (
        <div className="w-1/2">
            {error && <div className="mb-4 text-red-500">{error}</div>}
            {isLoading ? (
                <div className="flex justify-center items-center">
                    <div className="loader"></div>
                </div>
            ) : (
                <Table>
                    <TableCaption>Available Toppings</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]">Topping</TableHead>
                            <TableHead className="text-right w-[30px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allToppings}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <AddToppingRow onAdd={handleAddTopping} />
                        </TableRow>
                    </TableFooter>
                </Table>
            )}
            <style jsx>{`
                .loader {
                    border: 8px solid #f3f3f3; /* Light gray */
                    border-top: 8px solid #3498db; /* Blue */
                    border-radius: 50%;
                    width: 60px;
                    height: 60px;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
        
    );
}


function ToppingRow({ topping, onDelete, onUpdate }) {
    const [rowState, setRowState] = useState('view');
    const [error, setError] = useState('');

    return (
        <TableRow>
            {rowState === 'view' ? (
                <ViewRow
                    topping={topping}
                    setRowState={setRowState}
                    onDelete={onDelete}
                    setError={setError}
                />
            ) : (
                <EditRow
                    currentTopping={topping}
                    setRowState={setRowState}
                    onUpdate={onUpdate}
                    setError={setError}
                />
            )}
            {/* Display row-specific error if any */}
            {error && (
                <TableCell colSpan={2} className="text-red-500 text-sm">
                    {error}
                </TableCell>
            )}
        </TableRow>
    );
}


function ViewRow({ topping, setRowState, onDelete, setError }) {
    const handleDelete = async () => {
        try {
            await onDelete(topping);
        } catch (err) {
            setError(err.message || 'Failed to delete topping.');
        }
    };

    return (
        <>
            <TableCell className="font-medium">
                {topping}
            </TableCell>
            <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                    <button onClick={() => setRowState("edit")}>
                        <span>
                            <FaPenToSquare />
                        </span>
                    </button>
                    <button onClick={handleDelete}>
                        <span>
                            <FaTrashCan />
                        </span>
                    </button>
                </div>
            </TableCell>
        </>
    );
}

function EditRow({ currentTopping, setRowState, onUpdate, setError }) {
    const [updatedTopping, setUpdatedTopping] = useState(currentTopping);

    async function handleToppingUpdate(oldToppingName, newToppingName) {
        if (newToppingName.trim() === '') {
            setError('Topping name cannot be empty.');
            return;
        }

        try {
            await onUpdate(oldToppingName, newToppingName);
        } catch (err) {
            setError(err.message || 'Failed to update topping.');
        }
    }

    return (
        <>
            <TableCell>
                <input
                    className="bg-white border-2 border-blue-200"
                    value={updatedTopping}
                    onChange={e => {
                        setUpdatedTopping(e.target.value);
                        if (e.target.value.trim() !== '') setError('');
                    }}
                    placeholder="Enter topping name"
                />
                {/* Display row-specific error if any */}
            </TableCell>
            <TableCell className="text-right">
                <div className="flex gap-2 justify-end text-white">
                    <button
                        className="px-2 py-1 bg-gray-500 hover:bg-gray-300 hover:text-black transition-colors rounded-md"
                        onClick={() => {
                            setRowState("view");
                            setUpdatedTopping(currentTopping);
                            setError('');
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        className={`px-2 py-1 ${
                            updatedTopping.trim() === '' 
                                ? 'bg-gray-700 text-gray-50' 
                                : 'bg-green-500 hover:bg-green-300 hover:text-black'
                        } transition-colors rounded-md`}
                        onClick={() => handleToppingUpdate(currentTopping, updatedTopping)}
                        disabled={updatedTopping.trim() === ''}
                    >
                        Save
                    </button>
                </div>
            </TableCell>
        </>
    );
}

function AddToppingRow({ onAdd }) {
    const [toppingName, setToppingName] = useState('');
    const [rowState, setRowState] = useState('view');
    const [error, setError] = useState('');

    async function handleAddTopping(toppingName) {
        if (toppingName.trim() === '') {
            setError('Topping name cannot be empty.');
            console.error('Cannot set empty topping name');
            return;
        }

        try {
            await onAdd(toppingName);
            setToppingName('');
            setError('');
            setRowState("view");
        } catch (err) {
            setError(err.message || 'Failed to add topping.');
        }
    }

    return (
        <>
            {rowState === 'view' ? (
                <>
                    <TableCell className="font-medium">
                        <p>Add new topping</p>
                    </TableCell>
                    <TableCell className="text-right">
                        <button onClick={() => setRowState('add')}>
                            <span>
                                <FaPlus />
                            </span>
                        </button>
                    </TableCell>
                </>
            ) : (
                <>
                    <TableCell>
                        <input
                            className={`bg-white border-2 border-blue-200 ${error ? 'border-red-500' : 'border-blue-200'}`}
                            value={toppingName}
                            onChange={e => {
                                setToppingName(e.target.value);
                                if (e.target.value.trim() !== '') setError('');
                            }}
                            placeholder="Enter topping name"
                        />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="flex gap-2 justify-end text-white">
                            <button
                                onClick={() => {
                                    setRowState("view");
                                    setToppingName('');
                                    setError('');
                                }}
                                className="px-2 py-1 bg-gray-500 hover:bg-gray-300 hover:text-black transition-colors rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleAddTopping(toppingName)}
                                className={`px-2 py-1 ${
                                    toppingName.trim() === '' 
                                        ? 'bg-gray-700 text-gray-50' 
                                        : 'bg-green-500 hover:bg-green-300 hover:text-black'
                                } transition-colors rounded-md`}
                                disabled={toppingName.trim() === ''}
                            >
                                Save
                            </button>
                        </div>
                    </TableCell>
                </>
            )}
        </>
    );
}