const API_ROOT = 'https://generativelanguage.googleapis.com/v1beta/models';

async function geminiFetch(url, key, body) {
    let response;
    for (let attempt = 0; attempt < 2; attempt++) {
        response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(90000),
        });
        if (response.status < 500 || attempt === 1) return response;
        await new Promise((resolve) => setTimeout(resolve, 350));
    }
    return response;
}

export async function generateGemini({ key, model, contents, systemInstruction, generationConfig = {} }) {
    if (!key) throw Object.assign(new Error('Gemini is not configured. Add a Gemini API key in the server .env file.'), { status: 503 });
    const response = await geminiFetch(`${API_ROOT}/${encodeURIComponent(model)}:generateContent`, key, { contents, ...(systemInstruction ? { systemInstruction: { parts: [{ text: systemInstruction }] } } : {}), generationConfig });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
        const code = response.status;
        const detail = payload.error && payload.error.message || 'Gemini request failed.';
        const message = code === 429 ? 'Gemini free-tier quota or rate limit reached. Wait for the quota window to reset, or check Google AI Studio usage.' : code === 400 || code === 404 ? `Gemini rejected this request: ${detail}` : code === 403 ? 'Gemini access was denied. Check that the API key is valid and the selected model is available to this project.' : 'Gemini is temporarily unavailable. Try again shortly.';
        throw Object.assign(new Error(message), { status: code >= 500 ? 502 : code, providerStatus: code });
    }
    return payload;
}

export async function generateGeminiTts({ key, model, text, voice, style }) {
    if (!key) throw Object.assign(new Error('Gemini voice is not configured.'), { status: 503 });
    const response = await geminiFetch('https://generativelanguage.googleapis.com/v1beta/interactions', key, {
        model,
        store: false,
        input: [{ type: 'user_input', content: [{ type: 'text', text, annotations: [{ type: 'speech_metadata', style }] }] }],
        response_format: { type: 'audio' },
        generation_config: { speech_config: [{ voice }] },
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
        const code = response.status;
        const detail = payload.error && payload.error.message || 'Gemini voice request failed.';
        const message = code === 429 ? 'Gemini free-tier quota or rate limit reached. Wait for the quota window to reset, or check Google AI Studio usage.' : code === 400 || code === 404 ? `Gemini rejected this voice request: ${detail}` : code === 403 ? 'Gemini access was denied. Check that the voice model is available to this API key.' : 'Gemini voice is temporarily unavailable. Try again shortly.';
        throw Object.assign(new Error(message), { status: code >= 500 ? 502 : code, providerStatus: code });
    }
    return payload;
}

export function geminiText(response) {
    const candidates = response.candidates || [];
    const content = candidates[0] && candidates[0].content;
    return ((content && content.parts) || []).filter((part) => typeof part.text === 'string').map((part) => part.text).join('').trim();
}

export function geminiAudio(response) {
    for (const step of response.steps || []) {
        if (step.type !== 'model_output') continue;
        for (const part of step.content || []) {
            const data = part.data || (part.inlineData && part.inlineData.data) || (part.inline_data && part.inline_data.data);
            if (data) return { buffer: Buffer.from(data, 'base64'), mimeType: part.mime_type || part.mimeType || (part.inlineData && part.inlineData.mimeType) || (part.inline_data && part.inline_data.mime_type) || 'audio/wav' };
        }
    }
    const candidates = response.candidates || [];
    const content = candidates[0] && candidates[0].content;
    for (const part of(content && content.parts) || []) {
        const data = (part.inlineData && part.inlineData.data) || (part.inline_data && part.inline_data.data);
        if (data) return { buffer: Buffer.from(data, 'base64'), mimeType: (part.inlineData && part.inlineData.mimeType) || (part.inline_data && part.inline_data.mime_type) || 'audio/L16;rate=24000' };
    }
    return null;
}

export function pcm16ToWav(pcm, sampleRate = 24000, channels = 1) {
    const header = Buffer.alloc(44);
    header.write('RIFF', 0);
    header.writeUInt32LE(36 + pcm.length, 4);
    header.write('WAVE', 8);
    header.write('fmt ', 12);
    header.writeUInt32LE(16, 16);
    header.writeUInt16LE(1, 20);
    header.writeUInt16LE(channels, 22);
    header.writeUInt32LE(sampleRate, 24);
    header.writeUInt32LE(sampleRate * channels * 2, 28);
    header.writeUInt16LE(channels * 2, 32);
    header.writeUInt16LE(16, 34);
    header.write('data', 36);
    header.writeUInt32LE(pcm.length, 40);
    return Buffer.concat([header, pcm]);
}

export function wavSampleRate(mimeType) {
    const match = mimeType.match(/rate=(\d+)/i);
    return Number(match ? match[1] : 24000);
}