"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

//vuelve a pedir los datos al servidor cada tanto, para que las tarjetas aparezcan y desaparezcan solas
export function AutoRefresh({ seconds = 15 }: { seconds?: number }) {
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      //con la pestaña en segundo plano no se gasta una petición
      if (document.visibilityState === "visible") router.refresh();
    }, seconds * 1000);

    return () => clearInterval(timer);
  }, [router, seconds]);

  return null;
}