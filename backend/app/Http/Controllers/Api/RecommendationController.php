<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\MlRecommendationService;
use Illuminate\Http\Request;

class RecommendationController extends Controller
{
    public function __construct(private readonly MlRecommendationService $mlRecommendation)
    {
    }

    public function index(Request $request)
    {
        try {
            $recommendation = $this->mlRecommendation->generateFromUserLocation(
                $request->user(),
                $request->boolean('refresh')
            );

            return response()->json([
                'data' => $this->mlRecommendation->recommendationItems($recommendation),
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        } catch (\Throwable) {
            return response()->json(['message' => 'Gagal mengambil rekomendasi tanaman.'], 500);
        }
    }

    public function featured(Request $request)
    {
        return $this->index($request);
    }
}
