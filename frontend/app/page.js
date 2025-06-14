'use client';

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      router.replace("/myjourneys");
    } else {
      router.replace("/signin");
    }
  }, [router]);
  return null;
}
