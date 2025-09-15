import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function saveDocumentAndChunks(meta: { filename?: string; year?: number; title?: string }, chunks: Array<{ text: string }>) {
    const doc = await prisma.document.create({ data: { filename: meta.filename, year: meta.year, title: meta.title } });
    for (const c of chunks) {
        await prisma.chunk.create({ data: { documentId: doc.id, chunkText: c.text, chunkMeta: null } });
    }
    return doc;
}
