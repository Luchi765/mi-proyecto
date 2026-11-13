import { crearMascota } from "../../acciones";
import { FormularioMascota } from "../../componentes/FormularioMascota";

export default function NuevaMascota() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Nueva mascota</h1>
      <FormularioMascota accion={crearMascota} textoBoton="Guardar mascota" />
    </div>
  );
}
