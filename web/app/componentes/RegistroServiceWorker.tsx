"use client";

import { useEffect } from "react";

export function RegistroServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("Service Worker registrado"))
        .catch((error) => console.error("Error al registrar el Service Worker:", error));
    }
  }, []);

  return null;
}
