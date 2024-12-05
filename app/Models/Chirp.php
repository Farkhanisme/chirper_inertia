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
        //tambahkan dua baris ini
        'media_path', 
        'media_type'
    ];

    protected $dispatchesEvents = [
        'created' => ChirpCreated::class,
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // tambahkan ini
    public function hashtags()
    {
        return $this->hasMany(Hashtag::class);
    }
}
