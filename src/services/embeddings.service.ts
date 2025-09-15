import OpenAI from 'openai';
import { upsertEmbedding } from './vector.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function createEmbeddingsForChunks(
    documentId: number,
    chunks: Array<{ text: string }>
) {
    const chunkRows = await prisma.chunk.findMany({
        where: { documentId },
        orderBy: { id: 'asc' },
    });

    for (let i = 0; i < chunkRows.length; i++) {
        const chunk = chunkRows[i];
        const resp = await client.embeddings.create({
            model: 'text-embedding-3-large',
            input: chunk.chunkText,
        });

        const emb = resp.data[0].embedding;
        await upsertEmbedding(chunk.id, emb as number[]);
    }
}
