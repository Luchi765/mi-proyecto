import Link from "next/link";
import { API_URL, formatearFecha, type Mascota } from "./lib/api";
import { BotonFavorito } from "./componentes/BotonFavorito";

export default async function Inicio({ searchParams }: PageProps<"/">) {
  const { q } = await searchParams;
  const busqueda = typeof q === "string" ? q.trim() : "";

  let mascotas: Mascota[];
  try {
    const respuesta = await fetch(`${API_URL}/mascotas`, { cache: "no-store" });
    if (!respuesta.ok) {
      throw new Error(`La API respondió con el código ${respuesta.status}.`);
    }
    mascotas = await respuesta.json();
  } catch (error) {
    return (
      <div className="rounded bg-red-100 p-4 text-red-800" role="alert">
        <h1 className="text-xl font-bold">No se pudieron cargar las mascotas</h1>
        <p>{error instanceof Error ? error.message : String(error)}</p>
        <p className="text-sm">Revisá que la API de Laravel esté iniciada.</p>
      </div>
    );
  }

  // Filtro del buscador: por nombre o especie, sin distinguir mayúsculas.
  const filtradas = mascotas.filter((m) =>
    `${m.nombre} ${m.especie}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Mis mascotas</h1>

      <form className="flex gap-2" role="search">
        <input
          name="q"
          defaultValue={busqueda}
          placeholder="Buscar por nombre o especie"
          className="flex-1 rounded border border-stone-300 bg-white p-2"
        />
        <button className="rounded bg-orange-700 px-4 py-2 text-white hover:bg-orange-800">Buscar</button>
        {busqueda && (
          <Link href="/" className="self-center text-sm underline">
            Limpiar
          </Link>
        )}
      </form>

      {filtradas.length === 0 ? (
        <p>{busqueda ? `No hay mascotas que coincidan con "${busqueda}".` : "No hay mascotas cargadas."}</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {filtradas.map((mascota) => (
            <li key={mascota.id} className="flex flex-col gap-2 rounded-lg bg-white p-4 shadow">
              <Link
                href={`/mascotas/${mascota.id}`}
                className="text-lg font-semibold text-orange-800 hover:underline"
              >
                {mascota.nombre}
              </Link>
              <p>
                <span className="capitalize">{mascota.especie}</span> · {mascota.edad} {mascota.edad === 1 ? "año" : "años"}
              </p>
              <p className="text-sm">
                {mascota.vacunada ? "✅ Vacunas al día" : "⚠️ Vacunas pendientes"} · Próxima:{" "}
                {formatearFecha(mascota.proxima_vacuna)}
              </p>
              <div>
                <BotonFavorito />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
