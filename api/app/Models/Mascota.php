<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mascota extends Model
{
    protected $fillable = ["nombre", "especie", "edad", "vacunada", "proxima_vacuna"];

    protected $casts = [
        'edad' => 'integer',
        'vacunada' => 'boolean',
        'proxima_vacuna' => 'date:Y-m-d',
    ];
}
