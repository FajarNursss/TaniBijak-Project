<?php

namespace Tests\Feature;

use App\Models\Recommendation;
use App\Models\ChatbotFaq;
use App\Models\Lahan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ChatbotTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_start_chatbot_session_and_get_recommendation_answer(): void
    {
        $user = User::factory()->create();

        Recommendation::create([
            'tanaman' => 'Padi IR64',
            'skor' => 95,
            'musim' => 'Hujan',
            'suhu' => '24-28C',
            'curah_hujan' => '200-300mm',
            'jenis_tanah' => 'Liat',
            'ph' => '5.5-7.0',
            'alasan' => 'Curah hujan optimal dan suhu ideal untuk pertumbuhan padi.',
            'tips' => 'Jaga ketinggian air irigasi 5-10cm.',
            'kategori' => 'Pangan',
            'featured' => true,
        ]);

        $response = $this->actingAs($user)->postJson('/api/chatbot/message', [
            'message' => 'rekomendasi tanaman padi',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('data.messages.1.role', 'assistant')
            ->assertJsonPath('data.messages.1.metadata.intent', 'recommendation')
            ->assertJsonFragment(['title' => 'Padi IR64']);

        $this->assertDatabaseCount('chat_sessions', 1);
        $this->assertDatabaseCount('chat_messages', 2);
    }

    public function test_user_cannot_read_other_user_chat_session(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();

        $sessionId = $this->actingAs($owner)->postJson('/api/chatbot/message', [
            'message' => 'daun cabai menguning',
        ])->json('data.session.id');

        $this->actingAs($otherUser)
            ->getJson('/api/chatbot/sessions/' . $sessionId)
            ->assertForbidden();
    }

    public function test_chatbot_uses_user_land_context_when_answering(): void
    {
        Http::fake([
            '*' => Http::response([
                'success' => true,
                'data' => [
                    'crop' => 'Padi IR64',
                    'score' => 93,
                    'weather' => [
                        'weather' => 'Hujan',
                        'temperature' => 28,
                        'rainfall' => 140,
                    ],
                    'explanation' => 'Cocok berdasarkan kondisi cuaca dan lahan.',
                ],
            ]),
        ]);

        $user = User::factory()->create();
        Lahan::create([
            'user_id' => $user->id,
            'nama' => 'Sawah Utara',
            'lokasi' => 'Kab. Semarang',
            'luas' => 1.75,
            'jenis_tanah' => 'Aluvial',
            'tanaman' => 'Padi IR64',
            'kondisi' => 'perhatian',
            'catatan' => 'Drainase perlu dipantau.',
        ]);

        Recommendation::create([
            'tanaman' => 'Padi IR64',
            'skor' => 95,
            'musim' => 'Hujan',
            'suhu' => '24-28C',
            'curah_hujan' => '200-300mm',
            'jenis_tanah' => 'Aluvial',
            'ph' => '5.5-7.0',
            'alasan' => 'Cocok untuk tanah aluvial.',
            'tips' => 'Jaga tinggi air irigasi.',
            'kategori' => 'Pangan',
            'featured' => true,
        ]);

        $this->actingAs($user)->postJson('/api/chatbot/message', [
            'message' => 'rekomendasi untuk Sawah Utara',
        ])
            ->assertCreated()
            ->assertJsonPath('data.messages.1.metadata.intent', 'recommendation')
            ->assertJsonFragment(['type' => 'lahan', 'title' => 'Sawah Utara'])
            ->assertJsonFragment(['type' => 'ml_recommendation'])
            ->assertJsonFragment(['title' => 'ML: Padi IR64']);
    }

    public function test_chatbot_can_answer_from_faq_knowledge_base(): void
    {
        $user = User::factory()->create();
        ChatbotFaq::create([
            'question' => 'Kapan waktu pemupukan yang baik?',
            'answer' => 'Pemupukan dilakukan saat tanah cukup lembab dan tidak hujan lebat.',
            'category' => 'Pemupukan',
            'keywords' => ['pupuk', 'pemupukan', 'waktu pupuk'],
            'status' => 'aktif',
        ]);

        $this->actingAs($user)->postJson('/api/chatbot/message', [
            'message' => 'kapan waktu pupuk yang baik?',
        ])
            ->assertCreated()
            ->assertJsonPath('data.messages.1.metadata.intent', 'faq')
            ->assertJsonFragment(['type' => 'chatbot_faq']);
    }
}
