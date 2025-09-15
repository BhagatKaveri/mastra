// src/controllers/query.controller.ts
import { Request, Response } from 'express';
import { searchDocuments } from '../services/vector.service';
import { askLLM } from '../services/llm.service';

export const queryHandler = async (req: Request, res: Response) => {
    try {
        const { question } = req.body;
        if (!question) {
            return res.status(400).json({ error: 'Question is required' });
        }

        console.log('[Query] Incoming question:', question);

        const docs = await searchDocuments(question);
        console.log('[Query] Retrieved documents:', docs);

        // Use chunkText instead of content
        const context = docs.map((d: any) => d.chunkText).join('\n---\n');
        console.log('[Query] Context length:', context.length);

        const answer = await askLLM(question, context);
        console.log('[Query] LLM raw answer:', answer);

        res.json({
            answer,
            // Right now we only have id + chunkText + distance
            sources: docs.map((d: any) => ({
                id: d.id,
                text: d.chunkText,
                similarity: d.distance
            })),
        });
    } catch (err: any) {
        console.error('[Query] Error stack:', err);
        res.status(500).json({ error: 'Failed to answer question' });
    }

};
