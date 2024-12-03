<?php

namespace App\Models;

use App\Events\ChirpCreated; // tambahkan ini
use Illuminate\Database\Eloquent\Relations\BelongsTo; 
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chirp extends Model
{
    use HasFactory;
 
    protected $fillable = [
        'message',
    ];

    //tambahkan ini
    protected $dispatchesEvents = [
        'created' => ChirpCreated::class,
    ];

    // tambahkan ini
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
