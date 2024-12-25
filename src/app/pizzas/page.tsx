import { auth } from "@/auth";
import PizzaManagement from "@/components/PizzaManagement";

export default async function PizzasPage() {
    const session = await auth();

    if (!session) {
        return <div>Please sign in to access this page.</div>;
    }

    if (session.user?.role !== "chef") {
        return <div>You are not authorized to view this page!</div>;
    }

    return <PizzaManagement />;
}