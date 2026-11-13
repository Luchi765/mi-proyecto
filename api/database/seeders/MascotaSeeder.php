<?php

namespace Database\Seeders;

use App\Models\Mascota;
use Illuminate\Database\Seeder;

class MascotaSeeder extends Seeder
{
    public function run(): void
    {
        $mascotas = [
            ['nombre' => 'Lola', 'especie' => 'vaca', 'edad' => 6, 'vacunada' => true, 'proxima_vacuna' => '2027-11-14'],
            ['nombre' => 'Tristán', 'especie' => 'perro', 'edad' => 7, 'vacunada' => true, 'proxima_vacuna' => '2026-12-21'],
            ['nombre' => 'Lily', 'especie' => 'conejo', 'edad' => 1, 'vacunada' => false, 'proxima_vacuna' => '2026-10-31'],
            ['nombre' => 'Eevee', 'especie' => 'gato', 'edad' => 8, 'vacunada' => true, 'proxima_vacuna' => '2026-11-14'],
            ['nombre' => 'Pancho', 'especie' => 'loro', 'edad' => 3, 'vacunada' => false, 'proxima_vacuna' => '2027-02-10'],
        ];

        foreach ($mascotas as $mascota) {
            Mascota::create($mascota);
        }
    }
}
