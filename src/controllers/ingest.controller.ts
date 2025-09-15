import { Request, Response } from 'express';
import { parsePdf } from '../utils/pdf-parser';
import { chunkText } from '../utils/chunker';
import { saveDocumentAndChunks } from '../services/storage.service';
import { createEmbeddingsForChunks } from '../services/embeddings.service';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

export const uploadFile = [
    upload.single('file'),
    async (req: Request, res: Response) => {
        res.json({ ok: true, file: req.file });
    },
];

export const ingestDocuments = async (req: Request, res: Response) => {
    try {
        const files = req.body.files || []; // e.g. [{ path, filename, year, title }]
        for (const f of files) {
            const text = await parsePdf(f.path);
            const chunks = chunkText(text, { size: 1000, overlap: 200 });
            const doc = await saveDocumentAndChunks(
                { filename: f.filename, year: f.year, title: f.title },
                chunks
            );
            await createEmbeddingsForChunks(doc.id, chunks);
        }
        res.json({ status: 'ingested' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'ingest failed' });
    }
};
