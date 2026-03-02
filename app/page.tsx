'use client';

import { useState } from "react";

export default function Home() {

  const [value, setValue] = useState(0);

  const handleClick = () => {
    setValue(value + 1);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <button onClick={handleClick} className="rounded bg-blue-500 px-4 py-2 text-white">
          Clicked {value} times
        </button>
      </main>
    </div>
  );
}
