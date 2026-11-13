"use client";

import { useState } from "react";

// Client Component con estado propio: marca una mascota como favorita.
// El estado vive en el navegador (useState), no en la API.
export function BotonFavorito() {
  const [favorito, setFavorito] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setFavorito(!favorito)}
      aria-pressed={favorito}
      className="rounded-full border border-orange-300 px-3 py-1 text-sm hover:bg-orange-100"
    >
      {favorito ? "★ Favorita" : "☆ Marcar favorita"}
    </button>
  );
}
