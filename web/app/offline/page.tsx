import Link from "next/link";

export default function SinConexion() {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <p className="text-5xl">📡🐾</p>
      <h1 className="text-2xl font-bold">Estás sin conexión</h1>
      <p>No pudimos cargar esta página. Las páginas que ya visitaste siguen disponibles.</p>
      <Link href="/" className="underline">
        Ir al listado
      </Link>
    </div>
  );
}
