"use client";

import { useActionState } from "react";
import type { EstadoFormulario } from "../acciones";
import type { Mascota } from "../lib/api";

type Props = {
  accion: (estado: EstadoFormulario, formData: FormData) => Promise<EstadoFormulario>;
  mascota?: Mascota;
  textoBoton: string;
};

const estilosCampo = "w-full rounded border border-stone-300 bg-white p-2";

function ErrorCampo({ mensajes }: { mensajes?: string[] }) {
  if (!mensajes) return null;
  return <span className="text-sm text-red-700">{mensajes[0]}</span>;
}

// Formulario compartido para crear y editar. Muestra los errores 422 de Laravel.
export function FormularioMascota({ accion, mascota, textoBoton }: Props) {
  const [estado, accionFormulario, pendiente] = useActionState(accion, {});
  const errores = estado.errores ?? {};
  // Si la API devolvió errores, mostramos lo que el usuario había escrito;
  // si no, los datos de la mascota (al editar) o vacío (al crear).
  const valores = estado.valores ?? {
    nombre: mascota?.nombre ?? "",
    especie: mascota?.especie ?? "",
    edad: mascota ? String(mascota.edad) : "",
    vacunada: mascota?.vacunada ?? false,
    proxima_vacuna: mascota?.proxima_vacuna ?? "",
  };

  return (
    <form action={accionFormulario} className="flex max-w-md flex-col gap-4">
      {estado.mensaje && (
        <p className="rounded bg-red-100 p-3 text-red-800" role="alert">
          {estado.mensaje}
        </p>
      )}

      <label className="flex flex-col gap-1">
        Nombre
        <input name="nombre" defaultValue={valores.nombre} className={estilosCampo} />
        <ErrorCampo mensajes={errores.nombre} />
      </label>

      <label className="flex flex-col gap-1">
        Especie
        <input
          name="especie"
          defaultValue={valores.especie}
          placeholder="perro, gato, conejo..."
          className={estilosCampo}
        />
        <ErrorCampo mensajes={errores.especie} />
      </label>

      <label className="flex flex-col gap-1">
        Edad (años)
        <input name="edad" type="number" defaultValue={valores.edad} className={estilosCampo} />
        <ErrorCampo mensajes={errores.edad} />
      </label>

      <label className="flex items-center gap-2">
        <input name="vacunada" type="checkbox" defaultChecked={valores.vacunada} />
        Tiene las vacunas al día
      </label>
      <ErrorCampo mensajes={errores.vacunada} />

      <label className="flex flex-col gap-1">
        Próxima vacuna
        <input
          name="proxima_vacuna"
          type="date"
          defaultValue={valores.proxima_vacuna}
          className={estilosCampo}
        />
        <ErrorCampo mensajes={errores.proxima_vacuna} />
      </label>

      <button
        type="submit"
        disabled={pendiente}
        className="rounded bg-orange-700 px-4 py-2 font-semibold text-white hover:bg-orange-800 disabled:opacity-50"
      >
        {pendiente ? "Guardando..." : textoBoton}
      </button>
    </form>
  );
}
