<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChatMessage;
use App\Models\ChatSession;
use App\Services\ChatbotService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ChatbotController extends Controller
{
    public function index(Request $request)
    {
        $sessions = ChatSession::query()
            ->where('user_id', $request->user()->id)
            ->with(['messages' => fn ($query) => $query->latest()->limit(1)])
            ->latest()
            ->get();

        return response()->json([
            'data' => $sessions->map(fn (ChatSession $session) => $this->sessionPayload($session)),
        ]);
    }

    public function show(Request $request, ChatSession $chatSession)
    {
        abort_unless($chatSession->user_id === $request->user()->id, 403);

        $chatSession->load(['messages' => fn ($query) => $query->oldest()]);

        return response()->json([
            'data' => $this->sessionPayload($chatSession, true),
        ]);
    }

    public function message(Request $request, ChatbotService $chatbot)
    {
        $data = $request->validate([
            'message' => ['required', 'string', 'max:2000'],
            'session_id' => ['nullable', 'integer', 'exists:chat_sessions,id'],
        ]);

        $session = $this->resolveSession($request, $data);
        $userMessage = $session->messages()->create([
            'role' => 'user',
            'content' => $data['message'],
        ]);

        $reply = $chatbot->answer($data['message'], $request->user());
        $botMessage = $session->messages()->create([
            'role' => 'assistant',
            'content' => $reply['answer'],
            'metadata' => [
                'intent' => $reply['intent'],
                'sources' => $reply['sources'],
            ],
        ]);

        return response()->json([
            'data' => [
                'session' => $this->sessionPayload($session->fresh()),
                'messages' => [
                    $this->messagePayload($userMessage),
                    $this->messagePayload($botMessage),
                ],
            ],
        ], 201);
    }

    private function resolveSession(Request $request, array $data): ChatSession
    {
        if (! empty($data['session_id'])) {
            $session = ChatSession::findOrFail($data['session_id']);
            abort_unless($session->user_id === $request->user()->id, 403);

            return $session;
        }

        return ChatSession::create([
            'user_id' => $request->user()->id,
            'title' => Str::limit($data['message'], 60, ''),
        ]);
    }

    private function sessionPayload(ChatSession $session, bool $withMessages = false): array
    {
        $payload = [
            'id' => $session->id,
            'title' => $session->title,
            'created_at' => $session->created_at,
            'updated_at' => $session->updated_at,
        ];

        if ($withMessages || $session->relationLoaded('messages')) {
            $payload['messages'] = $session->messages->map(fn (ChatMessage $message) => $this->messagePayload($message))->values();
        }

        return $payload;
    }

    private function messagePayload(ChatMessage $message): array
    {
        return [
            'id' => $message->id,
            'role' => $message->role,
            'content' => $message->content,
            'metadata' => $message->metadata,
            'created_at' => $message->created_at,
        ];
    }
}
