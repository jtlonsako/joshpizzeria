"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  const currentRole = session?.user?.role;

  if (status === "loading") {
    return (
      <div className="w-screen h-screen grid place-content-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen grid md:grid-cols-2 place-content-center">
      <Link
        href="toppings"
        className={`p-5 mx-5 border-2 border-black rounded-lg ${
          currentRole === "owner"
            ? "bg-gray-200 hover:bg-gray-500 hover:text-white transition-colors"
            : "bg-gray-300 text-gray-600 pointer-events-none"
        }`}
        tabIndex={currentRole === "owner" ? 0 : -1}
      >
        <p className="text-2xl md:text-3xl text-center">Manage Toppings</p>
      </Link>
      <Link
        href="/pizzas"
        className={`p-5 mx-5 border-2 border-black rounded-lg ${
          currentRole === "chef"
            ? "bg-gray-200 hover:bg-gray-500 hover:text-white transition-colors"
            : "bg-gray-300 text-gray-600 pointer-events-none"
        }`}
        tabIndex={currentRole === "chef" ? 0 : -1}
      >
        <p className="text-2xl md:text-3xl text-center">Manage Pizzas</p>
      </Link>
    </div>
  );
}