// URL base de la API de Laravel. Se puede cambiar con la variable API_URL
// (por ejemplo en web/.env.local) si la API corre en otro puerto.
export const API_URL = process.env.API_URL ?? "http://127.0.0.1:8000/api";

export type Mascota = {
  id: number;
  nombre: string;
  especie: string;
  edad: number;
  vacunada: boolean;
  proxima_vacuna: string; // formato AAAA-MM-DD
};

// Muestra una fecha AAAA-MM-DD como DD/MM/AAAA.
export function formatearFecha(fecha: string) {
  const [anio, mes, dia] = fecha.split("-");
  return `${dia}/${mes}/${anio}`;
}
