import { Request, Response } from 'express';
import { searchDocuments } from '../services/vector.service';
import OpenAI from 'openai';

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function streamHandler(req: Request, res: Response) {
    try {
        const { question } = req.query;
        if (!question || typeof question !== 'string') {
            return res.status(400).json({ error: "Question is required" });
        }

        // Step 1: Search top relevant documents
        const docs = await searchDocuments(question, 3);
        const context = docs.map(d => d.pageContent).join("\n\n");

        // Step 2: Set response headers for SSE (Server-Sent Events)
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.flushHeaders();

        // Step 3: Create streaming completion
        const completion = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a helpful assistant about Warren Buffett." },
                { role: "user", content: `Context: ${context}\n\nQuestion: ${question}` }
            ],
            stream: true
        });

        completion.on("data", (data: any) => {
            const chunk = data.choices[0]?.delta?.content;
            if (chunk) {
                res.write(`data: ${chunk}\n\n`);
            }
        });

        completion.on("end", () => {
            res.write("data: [DONE]\n\n");
            res.end();
        });

        completion.on("error", (err: any) => {
            console.error(err);
            res.write(`data: Error occurred\n\n`);
            res.end();
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Streaming failed" });
    }
}
