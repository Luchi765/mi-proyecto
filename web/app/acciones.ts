"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { API_URL, type Mascota } from "./lib/api";

export type EstadoFormulario = {
  mensaje?: string;
  errores?: Record<string, string[]>;
  // Lo que escribió el usuario, para no perderlo si hay errores.
  valores?: {
    nombre: string;
    especie: string;
    edad: string;
    vacunada: boolean;
    proxima_vacuna: string;
  };
};

type Resultado = { estado: EstadoFormulario } | { mascota: Mascota };

// Arma el cuerpo JSON a partir de los datos del formulario.
function datosDelFormulario(formData: FormData) {
  return {
    nombre: formData.get("nombre"),
    especie: formData.get("especie"),
    edad: formData.get("edad") === "" ? null : Number(formData.get("edad")),
    vacunada: formData.get("vacunada") === "on",
    proxima_vacuna: formData.get("proxima_vacuna"),
  };
}

// Envía la petición a la API y traduce la respuesta a un estado del formulario.
async function enviar(url: string, metodo: "POST" | "PUT", formData: FormData): Promise<Resultado> {
  const valores = {
    nombre: String(formData.get("nombre") ?? ""),
    especie: String(formData.get("especie") ?? ""),
    edad: String(formData.get("edad") ?? ""),
    vacunada: formData.get("vacunada") === "on",
    proxima_vacuna: String(formData.get("proxima_vacuna") ?? ""),
  };

  let respuesta: Response;
  try {
    respuesta = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(datosDelFormulario(formData)),
    });
  } catch {
    return { estado: { mensaje: "No se pudo conectar con la API. ¿Está iniciada?", valores } };
  }

  if (respuesta.status === 422) {
    const cuerpo = await respuesta.json();
    return { estado: { mensaje: "Revisá los datos del formulario.", errores: cuerpo.errors, valores } };
  }
  if (respuesta.status === 404) {
    return { estado: { mensaje: "La mascota ya no existe." } };
  }
  if (!respuesta.ok) {
    return { estado: { mensaje: `La API respondió con el código ${respuesta.status}.`, valores } };
  }
  return { mascota: await respuesta.json() };
}

export async function crearMascota(
  _estadoAnterior: EstadoFormulario,
  formData: FormData
): Promise<EstadoFormulario> {
  const resultado = await enviar(`${API_URL}/mascotas`, "POST", formData);
  if ("estado" in resultado) return resultado.estado;

  revalidatePath("/");
  redirect(`/mascotas/${resultado.mascota.id}`);
}

export async function actualizarMascota(
  id: number,
  _estadoAnterior: EstadoFormulario,
  formData: FormData
): Promise<EstadoFormulario> {
  const resultado = await enviar(`${API_URL}/mascotas/${id}`, "PUT", formData);
  if ("estado" in resultado) return resultado.estado;

  revalidatePath("/");
  revalidatePath(`/mascotas/${id}`);
  redirect(`/mascotas/${id}`);
}

export async function borrarMascota(id: number) {
  const respuesta = await fetch(`${API_URL}/mascotas/${id}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });

  // 404 significa que ya estaba borrada: en ese caso también volvemos al listado.
  if (!respuesta.ok && respuesta.status !== 404) {
    throw new Error(`No se pudo borrar (código ${respuesta.status}).`);
  }

  revalidatePath("/");
  redirect("/");
}
