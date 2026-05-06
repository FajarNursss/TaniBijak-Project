<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LocalWisdom extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'category',
        'region',
        'relevance',
        'description',
        'benefits',
        'crops',
        'status',
        'icon',
    ];

    protected $casts = [
        'benefits' => 'array',
        'crops' => 'array',
    ];
}
