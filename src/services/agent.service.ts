import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';
import { searchSimilarVectors } from './vector.service';

const prisma = new PrismaClient();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function createChatCompletion(question: string, conversationId?: number) {
    // 1. embed query
    const embResp = await client.embeddings.create({ model: 'text-embedding-3-large', input: question });
    const queryEmbedding = embResp.data[0].embedding as number[];
    // 2. search
    const hits = await searchSimilarVectors(queryEmbedding, 5);
    const contexts = hits.map((h: any) => `SOURCE (chunk_id=${h.chunk_id}): ${h.chunk_text}`).join('\n\n');

    // 3. create prompt
    const system = `You are a financial analyst specialized in Warren Buffett and Berkshire Hathaway. Use only provided sources to answer.`;
    const userPrompt = `Question: ${question}\n\nRelevant excerpts:\n${contexts}`;

    // 4. call LLM (non-streaming)
    const completion = await client.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            { role: 'system', content: system },
            { role: 'user', content: userPrompt }
        ],
        max_tokens: 800
    });

    const text = completion.choices[0].message?.content || '';
    // return with sources
    return { answer: text, sources: hits };
}

export async function streamChatCompletion(question: string, onDelta: (delta: string) => void) {
    // Similar to createChatCompletion but using streaming API if available.
    // Current demo emulates streaming by chunking the final response.
    const embResp = await client.embeddings.create({ model: 'text-embedding-3-large', input: question });
    const queryEmbedding = embResp.data[0].embedding as number[];
    const hits = await searchSimilarVectors(queryEmbedding, 5);
    const contexts = hits.map((h: any) => `SOURCE (chunk_id=${h.chunk_id}): ${h.chunk_text}`).join('\n\n');
    const system = `You are a financial analyst specialized in Warren Buffett and Berkshire Hathaway. Use only provided sources to answer.`;
    const userPrompt = `Question: ${question}\n\nRelevant excerpts:\n${contexts}`;

    const completion = await client.chat.completions.create({ model: 'gpt-4o', messages: [{ role: 'system', content: system }, { role: 'user', content: userPrompt }], max_tokens: 800 });
    const text = completion.choices[0].message?.content || '';
    // naive tokenization for streaming demo
    const tokens = text.split(/(\s+)/);
    for (const t of tokens) {
        onDelta(t);
        await new Promise((r) => setTimeout(r, 10));
    }
}
