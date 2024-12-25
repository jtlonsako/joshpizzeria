import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { createPizza } from "@/db/queries";
import { DialogClose } from "@radix-ui/react-dialog";
import { useState } from "react";

export default function CreatePizza({ addPizzaToList }) {
    const [pizzaName, setPizzaName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        const trimmedName = pizzaName.trim();
        if (trimmedName === "") {
            setErrorMessage("Pizza name cannot be empty.");
            return;
        }

        setIsLoading(true);
        setErrorMessage("");

        try {
            const newPizza = await createPizza(trimmedName);
            if(newPizza && newPizza.length > 0) {
                addPizzaToList(newPizza[0]);
                setPizzaName("");
                setIsOpen(false);
            } else {
                setErrorMessage("Failed to create pizza. Please try again.");
            }
        } catch (error) {
            console.error("Error creating pizza:", error);
            setErrorMessage(error.message || "Failed to create pizza. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return(
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button className="w-62 h-full px-4 border border-black bg-gray-300 rounded-md hover:bg-gray-500 hover:text-white transition-colors m-4">
                    Create New Pizza
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Create New Pizza
                    </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="flex items-center">
                        <label className="mr-2 font-medium">Pizza Name:</label>
                        <input
                            type="text"
                            value={pizzaName}
                            onChange={(e) => {
                                setPizzaName(e.target.value);
                                if (e.target.value.trim() !== "") {
                                    setErrorMessage("");
                                }
                            }}
                            className={`border rounded px-2 py-1 ml-2 focus:outline-none ${
                                errorMessage ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter pizza name"
                        />
                    </div>
                    
                    {errorMessage && (
                        <div className="text-red-500 text-sm">
                            {errorMessage}
                        </div>
                    )}
                    
                    <div className="flex justify-center">
                        <div className="flex gap-2">
                            <DialogClose asChild>
                                <button
                                    className="px-4 py-2 bg-gray-500 hover:bg-gray-300 hover:text-black transition-colors rounded-md"
                                    onClick={() => {
                                        setPizzaName("");
                                        setErrorMessage("");
                                    }}
                                    disabled={isLoading} // Disable during loading
                                >
                                    Cancel
                                </button>
                            </DialogClose>
                            
                            <button
                                className={`px-4 py-2 transition-colors rounded-md w-32 ${
                                    (pizzaName.trim() === "" || isLoading) 
                                        ? 'bg-gray-700 text-gray-50' 
                                        : 'bg-green-500 hover:bg-green-300 hover:text-black'
                                }`}
                                onClick={handleSave}
                                disabled={pizzaName.trim() === "" || isLoading}
                            >
                                {isLoading ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>    
    )
}