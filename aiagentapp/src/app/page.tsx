"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/loading"); // use replace() to avoid a useless entry
  }, [router]);

  return null; // render nothing during the redirect
}
