"use client";

import { useSession, signIn as naSignIn, signOut as naSignOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function AuthButton() {
  const { data: session, status } = useSession();

  async function handleSignOut() {
    try {
      await naSignOut({ redirect: false });
      await naSignIn();
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error signing out: " + err.message);
      }
    }
  }

  async function handleSignIn() {
    try {
      await naSignIn();
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error signing in: " + err.message);
      }
    }
  }

  if (status === "loading") {
    return (
      <Button disabled className="w-60">
        Loading...
      </Button>
    );
  }

  return session?.user ? (
    <Button className="w-60" onClick={handleSignOut}>
      {session.user.name} : Sign Out
    </Button>
  ) : (
    <Button className="w-60" onClick={handleSignIn}>
      Sign In
    </Button>
  );
}