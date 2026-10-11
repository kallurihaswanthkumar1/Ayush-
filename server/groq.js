const API_ROOT = 'https://api.groq.com/openai/v1';

async function groqRequest(url, key, options) {
    let response;
    for (let attempt = 0; attempt < 2; attempt++) {
        response = await fetch(url, {
            ...options,
            headers: { Authorization: `Bearer ${key}`, ...(options.headers || {}) },
            signal: AbortSignal.timeout(90000),
        });
        if (response.status < 500 || attempt === 1) return response;
        await new Promise((resolve) => setTimeout(resolve, 350));
    }
    return response;
}

function groqError(response, payload, feature) {
    const status = response.status;
    const detail = payload.error && (payload.error.message || payload.error) || 'Groq request failed.';
    let message = `${feature} request failed (${status}).`;
    if (status === 401 || status === 403) message = 'Groq rejected the configured API key. Check that the key is active and has access to this endpoint.';
    else if (status === 429) message = 'Groq rate or usage limit reached. Check the Groq console for the project limit and reset time.';
    else if (status === 400 || status === 404) message = `Groq rejected this model or request: ${detail}`;
    else if (status >= 500) message = 'Groq is temporarily unavailable. Try again shortly.';
    return Object.assign(new Error(message), { status: status >= 500 ? 502 : status, providerStatus: status });
}

function messageContent(parts = []) {
    const text = parts.map((part) => part.text || '').filter(Boolean).join('\n');
    const images = parts.flatMap((part) => {
        const inline = part.inlineData || part.inline_data;
        if (inline?.data && /^image\/(jpeg|png|webp)$/i.test(inline.mimeType || inline.mime_type || '')) {
            const mime = inline.mimeType || inline.mime_type;
            return [{ type: 'image_url', image_url: { url: `data:${mime};base64,${inline.data}` } }];
        }
        if (part.fileData || part.file_data || inline) {
            throw Object.assign(new Error('Groq vision accepts JPEG, PNG, or WebP images. PDFs are read through local text extraction/OCR.'), { status: 415 });
        }
        return [];
    });
    if (!images.length) return text;
    return [...(text ? [{ type: 'text', text }] : []), ...images];
}

export async function generateGroq({ key, model, contents, systemInstruction, generationConfig = {} }) {
    if (!key) throw Object.assign(new Error('GROQ_API_KEY is not configured on the server.'), { status: 503 });
    const messages = [];
    if (systemInstruction) messages.push({ role: 'system', content: systemInstruction });
    const hasImages = (contents || []).some((item) => (item.parts || []).some((part) => (part.inlineData || part.inline_data)?.data));
    for (const item of contents || []) {
        const role = item.role === 'model' ? 'assistant' : item.role === 'system' ? 'system' : 'user';
        messages.push({ role, content: messageContent(item.parts) });
    }
    const request = {
        model: model || (hasImages ? process.env.GROQ_VISION_MODEL : process.env.GROQ_MEDICAL_MODEL) || (hasImages ? 'qwen/qwen3.8-27b' : 'openai/gpt-oss-120b'),
        messages,
        max_completion_tokens: Math.max(Number(generationConfig.maxOutputTokens) || 900, 256),
    };
    if (generationConfig.responseMimeType === 'application/json') request.response_format = { type: 'json_object' };
    const response = await groqRequest(`${API_ROOT}/chat/completions`, key, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw groqError(response, payload, 'Groq chat');
    const choice = (payload.choices || [])[0];
    const text = choice && choice.message && typeof choice.message.content === 'string' ? choice.message.content : '';
    return { candidates: [{ content: { role: 'model', parts: text ? [{ text }] : [] }, finishReason: choice && choice.finish_reason }] };
}

export async function transcribeGroq({ key, audio, filename, mimeType, language }) {
    if (!key) throw Object.assign(new Error('GROQ_API_KEY is not configured on the server.'), { status: 503 });
    const form = new FormData();
    form.append('model', process.env.GROQ_STT_MODEL || 'whisper-large-v3-turbo');
    form.append('response_format', 'json');
    if (language) form.append('language', language);
    form.append('file', new Blob([audio], { type: mimeType }), filename);
    const response = await groqRequest(`${API_ROOT}/audio/transcriptions`, key, { method: 'POST', body: form });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw groqError(response, payload, 'Groq transcription');
    return String(payload.text || '').trim();
}
