import Link from "next/link";
import { API_URL, type Mascota } from "../../../lib/api";
import { actualizarMascota } from "../../../acciones";
import { FormularioMascota } from "../../../componentes/FormularioMascota";

export default async function EditarMascota({ params }: PageProps<"/mascotas/[id]/editar">) {
  const { id } = await params;

  let respuesta: Response;
  try {
    respuesta = await fetch(`${API_URL}/mascotas/${id}`, { cache: "no-store" });
  } catch {
    return <p role="alert">No se pudo conectar con la API.</p>;
  }

  if (!respuesta.ok) {
    return (
      <div className="flex flex-col gap-2">
        <p role="alert">
          {respuesta.status === 404
            ? "Esa mascota no existe."
            : `La API respondió con el código ${respuesta.status}.`}
        </p>
        <Link href="/" className="underline">
          Volver al listado
        </Link>
      </div>
    );
  }

  const mascota: Mascota = await respuesta.json();
  const actualizar = actualizarMascota.bind(null, mascota.id);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Editar a {mascota.nombre}</h1>
      <FormularioMascota accion={actualizar} mascota={mascota} textoBoton="Guardar cambios" />
      <Link href={`/mascotas/${mascota.id}`} className="underline">
        Cancelar
      </Link>
    </div>
  );
}
