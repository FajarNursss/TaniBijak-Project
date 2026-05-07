<?php

use App\Http\Controllers\Api\AdminUserController;
use App\Http\Controllers\Api\ActivityController;
use App\Http\Controllers\Api\CalendarEventController;
use App\Http\Controllers\Api\ChatbotController;
use App\Http\Controllers\Api\ChatbotFaqController;
use App\Http\Controllers\Api\CropHistoryController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CuacaController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\LocalWisdomController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\RecommendationController;
use App\Http\Controllers\Api\LahanController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::get('/health', fn () => response()->json(['status' => 'ok', 'app' => 'TaniBijak API']));

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/profile', [AuthController::class, 'profile']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);
        Route::put('/change-password', [AuthController::class, 'changePassword']);
    });
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user/dashboard', [DashboardController::class, 'user']);
    Route::get('/user/lahan', [LahanController::class, 'mine']);
    Route::post('/user/lahan', [LahanController::class, 'store']);
    Route::get('/user/lahan/{lahan}', [LahanController::class, 'show']);
    Route::put('/user/lahan/{lahan}', [LahanController::class, 'update']);
    Route::delete('/user/lahan/{lahan}', [LahanController::class, 'destroy']);
    Route::get('/user/lahan/{lahan}/rekomendasi', [LahanController::class, 'rekomendasi']);
    Route::get('/user/rekomendasi', [RecommendationController::class, 'index']);
    Route::get('/user/rekomendasi/featured', [RecommendationController::class, 'featured']);
    Route::get('/user/riwayat-tanam', [CropHistoryController::class, 'index']);
    Route::post('/user/riwayat-tanam', [CropHistoryController::class, 'store']);
    Route::put('/user/riwayat-tanam/{cropHistory}', [CropHistoryController::class, 'update']);
    Route::delete('/user/riwayat-tanam/{cropHistory}', [CropHistoryController::class, 'destroy']);
    Route::get('/user/kalender', [CalendarEventController::class, 'index']);
    Route::post('/user/kalender', [CalendarEventController::class, 'store']);
    Route::get('/user/kearifan', [LocalWisdomController::class, 'index']);
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications', [NotificationController::class, 'store']);
    Route::post('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllRead']);
    Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy']);
    Route::get('/activities', [ActivityController::class, 'index']);

    Route::prefix('chatbot')->group(function () {
        Route::get('/sessions', [ChatbotController::class, 'index']);
        Route::get('/sessions/{chatSession}', [ChatbotController::class, 'show']);
        Route::post('/message', [ChatbotController::class, 'message']);
    });

    Route::get('/admin/dashboard', [DashboardController::class, 'admin']);
    Route::apiResource('/admin/users', AdminUserController::class);
    Route::get('/admin/lahan', [LahanController::class, 'adminIndex']);
    Route::get('/admin/kearifan', [LocalWisdomController::class, 'adminIndex']);
    Route::post('/admin/kearifan', [LocalWisdomController::class, 'store']);
    Route::put('/admin/kearifan/{localWisdom}', [LocalWisdomController::class, 'update']);
    Route::delete('/admin/kearifan/{localWisdom}', [LocalWisdomController::class, 'destroy']);
    Route::apiResource('/admin/chatbot-faqs', ChatbotFaqController::class)->except(['show']);
});

Route::prefix('cuaca')->middleware('auth:sanctum')->group(function () {
    Route::get('/current', [CuacaController::class, 'current']);
    Route::get('/forecast', [CuacaController::class, 'forecast']);
    Route::get('/klimatologi', [CuacaController::class, 'klimatologi']);
    Route::get('/risk/{lahanId}', [CuacaController::class, 'risk']);
    Route::get('/history', [CuacaController::class, 'history']);
});
