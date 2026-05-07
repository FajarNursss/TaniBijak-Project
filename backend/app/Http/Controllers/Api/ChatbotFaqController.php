<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChatbotFaq;
use Illuminate\Http\Request;

class ChatbotFaqController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => ChatbotFaq::latest()->get()->map(fn (ChatbotFaq $faq) => $this->payload($faq)),
        ]);
    }

    public function store(Request $request)
    {
        $faq = ChatbotFaq::create($this->validatePayload($request));

        return response()->json(['data' => $this->payload($faq)], 201);
    }

    public function update(Request $request, ChatbotFaq $chatbotFaq)
    {
        $chatbotFaq->update($this->validatePayload($request));

        return response()->json(['data' => $this->payload($chatbotFaq->fresh())]);
    }

    public function destroy(ChatbotFaq $chatbotFaq)
    {
        $chatbotFaq->delete();

        return response()->json(['message' => 'FAQ chatbot berhasil dihapus.']);
    }

    private function validatePayload(Request $request): array
    {
        return $request->validate([
            'question' => ['required', 'string', 'max:255'],
            'answer' => ['required', 'string'],
            'category' => ['required', 'string', 'max:255'],
            'keywords' => ['nullable', 'array'],
            'keywords.*' => ['string', 'max:100'],
            'status' => ['required', 'string', 'max:50'],
        ]);
    }

    private function payload(ChatbotFaq $faq): array
    {
        return [
            'id' => $faq->id,
            'question' => $faq->question,
            'answer' => $faq->answer,
            'category' => $faq->category,
            'keywords' => $faq->keywords ?: [],
            'status' => $faq->status,
            'created_at' => $faq->created_at,
            'updated_at' => $faq->updated_at,
        ];
    }
}
