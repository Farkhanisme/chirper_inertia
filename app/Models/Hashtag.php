<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hashtag extends Model
{
    protected $fillable = ['name', 'chirp_id'];

    public function chirp()
    {
        return $this->belongsTo(Chirp::class);
    }
}