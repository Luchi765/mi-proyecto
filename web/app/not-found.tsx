import Link from "next/link";

export default function NoEncontrado() {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Página no encontrada</h1>
      <Link href="/" className="underline">
        Volver al listado
      </Link>
    </div>
  );
}
