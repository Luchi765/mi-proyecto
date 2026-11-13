import Link from "next/link";
import { API_URL, formatearFecha, type Mascota } from "../../lib/api";
import { BotonFavorito } from "../../componentes/BotonFavorito";
import { borrarMascota } from "../../acciones";

type Resultado =
  | { tipo: "ok"; mascota: Mascota }
  | { tipo: "no-encontrada" }
  | { tipo: "error"; mensaje: string };

// Pide una mascota a la API y devuelve qué pasó, sin romper la página si falla.
async function buscarMascota(id: string): Promise<Resultado> {
  try {
    const respuesta = await fetch(`${API_URL}/mascotas/${id}`, { cache: "no-store" });
    if (respuesta.status === 404) return { tipo: "no-encontrada" };
    if (!respuesta.ok) {
      return { tipo: "error", mensaje: `La API respondió con el código ${respuesta.status}.` };
    }
    return { tipo: "ok", mascota: await respuesta.json() };
  } catch {
    return { tipo: "error", mensaje: "No se pudo conectar con la API. ¿Está iniciada?" };
  }
}

export default async function DetalleMascota({ params }: PageProps<"/mascotas/[id]">) {
  const { id } = await params;
  const resultado = await buscarMascota(id);

  if (resultado.tipo === "no-encontrada") {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Mascota no encontrada</h1>
        <p>No existe una mascota con el número {id}.</p>
        <Link href="/" className="underline">
          Volver al listado
        </Link>
      </div>
    );
  }

  if (resultado.tipo === "error") {
    return (
      <div className="rounded bg-red-100 p-4 text-red-800" role="alert">
        <h1 className="text-xl font-bold">No se pudo cargar la mascota</h1>
        <p>{resultado.mensaje}</p>
        <Link href="/" className="underline">
          Volver al listado
        </Link>
      </div>
    );
  }

  const { mascota } = resultado;
  const borrar = borrarMascota.bind(null, mascota.id);

  return (
    <article className="flex flex-col gap-3 rounded-lg bg-white p-6 shadow">
      <h1 className="text-3xl font-bold text-orange-800">{mascota.nombre}</h1>
      <p>
        <strong>Especie:</strong> <span className="capitalize">{mascota.especie}</span>
      </p>
      <p>
        <strong>Edad:</strong> {mascota.edad} {mascota.edad === 1 ? "año" : "años"}
      </p>
      <p>
        <strong>Vacunas al día:</strong> {mascota.vacunada ? "Sí" : "No"}
      </p>
      <p>
        <strong>Próxima vacuna:</strong> {formatearFecha(mascota.proxima_vacuna)}
      </p>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <BotonFavorito />
        <Link
          href={`/mascotas/${mascota.id}/editar`}
          className="rounded border border-stone-300 px-3 py-1 text-sm hover:bg-stone-100"
        >
          Editar
        </Link>
        <form action={borrar}>
          <button className="rounded bg-red-700 px-3 py-1 text-sm text-white hover:bg-red-800">Borrar</button>
        </form>
      </div>

      <Link href="/" className="pt-2 underline">
        Volver al listado
      </Link>
    </article>
  );
}
