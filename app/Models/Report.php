<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Report extends Model
{
    protected $fillable = [
        'reporter_id',
        'reported_id',
        'chirp_id',
        'reason',
        'reviewed',
    ];

    protected $casts = [
        'reviewed' => 'boolean'
    ];

    public function reporter()
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    public function reported()
    {
        return $this->belongsTo(User::class, 'reported_id');
    }

    public function chirp()
    {
        return $this->belongsTo(Chirp::class);
    }
}
