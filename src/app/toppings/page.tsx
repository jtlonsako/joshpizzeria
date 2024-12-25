"use server"
import ToppingsTable from "@/components/ToppingsTable";
import { auth } from "@/auth";

export default async function Toppings() {
    const session = await auth();

    if (!session) {
        return <div>Please sign in to access this page.</div>;
    }

    if (session.user?.role !== "owner") {
        return <div>You are not authorized to view this page!</div>;
    }

    return (
        <div className="w-full flex justify-center min-h-screen">
            <ToppingsTable />
        </div>
    );
}