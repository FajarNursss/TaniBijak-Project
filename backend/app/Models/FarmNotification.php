<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FarmNotification extends Model
{
    use HasFactory;

    protected $table = 'notifications';

    protected $fillable = [
        'user_id',
        'type',
        'title',
        'message',
        'read_at',
        'source',
    ];

    protected $casts = [
        'read_at' => 'datetime',
    ];

    public function getReadAttribute(): bool
    {
        return ! is_null($this->read_at);
    }

    public function getTimeAttribute(): string
    {
        return $this->created_at?->diffForHumans() ?? '';
    }
}
