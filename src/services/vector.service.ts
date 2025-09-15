// src/services/vector.service.ts
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';

const prisma = new PrismaClient();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function upsertEmbedding(chunkId: number, embedding: number[]) {
  await prisma.$executeRawUnsafe(`
        UPDATE "Chunk"
        SET embedding = '[${embedding.join(',')}]'::vector
        WHERE id = ${chunkId};
    `);
}

export async function searchDocuments(question: string) {
  // Get embedding for the question
  const resp = await client.embeddings.create({
    model: 'text-embedding-3-large',
    input: question,
  });

  const queryEmbedding: number[] = resp.data[0].embedding as number[];
  const embeddingString = `[${queryEmbedding.join(',')}]`;

  // Fetch most similar chunks
  const results = await prisma.$queryRawUnsafe<any[]>(`
        SELECT c.id, c."chunkText", (c.embedding <=> '${embeddingString}') AS distance
        FROM "Chunk" c
        ORDER BY distance ASC
        LIMIT 5;
    `);

  return results;
}
