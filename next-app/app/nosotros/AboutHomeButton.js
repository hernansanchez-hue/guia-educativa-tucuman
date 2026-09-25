"use client";

import { useRouter } from "next/navigation";

export default function AboutHomeButton() {
  const router = useRouter();
  return <button className="btn" type="button" onClick={() => router.push("/")}>Comenzar a explorar</button>;
}
