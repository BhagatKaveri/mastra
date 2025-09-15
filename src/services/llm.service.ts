import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Ask LLM a question using context
 */
export async function askLLM(question: string, context: string) {
    const resp = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            { role: 'system', content: 'You are a financial assistant. Use the provided context to answer.' },
            { role: 'user', content: `Question: ${question}\n\nContext:\n${context}` },
        ],
        temperature: 0.3,
    });

    return resp.choices[0].message?.content || '';
}
