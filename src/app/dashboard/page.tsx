"use client";

import { signOut, useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="text-lg">Hello, {session?.user.name}</div>
        <button
          className="bg-red-400 p-3 px-4 mt-8 rounded-lg hover:bg-red-500"
          onClick={() => signOut()}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
