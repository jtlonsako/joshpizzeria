'use server'

import AuthButton from "@/app/AuthButton.server";
import Link from "next/link";

export default async function Navbar() {
    return(
            <div className="relative w-screen top-0 h-fit m-2 grid grid-cols-2">
                <Link href="/" className="text-3xl">Josh&apos;s Pizzeria</Link>
                <div className="justify-self-end mr-8">
                    <AuthButton />
                </div>
            </div>
    );
}