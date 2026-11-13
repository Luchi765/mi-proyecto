<?php

namespace App\Http\Controllers;

use App\Models\Mascota;
use Illuminate\Http\Request;

class MascotaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Mascota::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $datos = $request->validate($this->reglas(), $this->mensajes(), $this->atributos());
        $mascota = Mascota::create($datos);
        return response()->json($mascota, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($mascota)
    {
        return Mascota::findOrFail($mascota);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $mascota)
    {
        $mascota = Mascota::findOrFail($mascota);
        $datos = $request->validate($this->reglas(), $this->mensajes(), $this->atributos());
        $mascota->update($datos);
        return response()->json($mascota);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($mascota)
    {
        $mascota = Mascota::findOrFail($mascota);
        $mascota->delete();
        return response()->json(['mensaje' => 'Mascota eliminada'], 200);
    }

    /**
     * Reglas de validación compartidas por store y update.
     */
    private function reglas(): array
    {
        return [
            'nombre' => 'required|string|max:100',
            'especie' => 'required|string|max:50',
            'edad' => 'required|integer|min:0|max:100',
            'vacunada' => 'required|boolean',
            'proxima_vacuna' => 'required|date',
        ];
    }

    /**
     * Mensajes de validación en castellano.
     */
    private function mensajes(): array
    {
        return [
            'required' => 'El campo :attribute es obligatorio.',
            'string' => 'El campo :attribute tiene que ser un texto.',
            'integer' => 'El campo :attribute tiene que ser un número entero.',
            'boolean' => 'El campo :attribute tiene que ser verdadero o falso.',
            'date' => 'El campo :attribute tiene que ser una fecha válida (AAAA-MM-DD).',
            'nombre.max' => 'El nombre no puede tener más de :max caracteres.',
            'especie.max' => 'La especie no puede tener más de :max caracteres.',
            'edad.min' => 'La edad no puede ser negativa.',
            'edad.max' => 'La edad no puede ser mayor a :max años.',
        ];
    }

    /**
     * Nombres de los campos para mostrar en los mensajes.
     */
    private function atributos(): array
    {
        return [
            'proxima_vacuna' => 'próxima vacuna',
        ];
    }
}
