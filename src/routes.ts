import { Router } from 'express';
import { health } from './controllers/health.controller';
import { uploadFile, ingestDocuments } from './controllers/ingest.controller';
import { queryHandler } from './controllers/query.controller';
import { streamHandler } from './controllers/stream.controller';

const router = Router();

router.get('/health', health);
router.post('/upload', uploadFile);
router.post('/ingest', ingestDocuments);
router.post('/query', queryHandler);
router.get('/stream', streamHandler);

export default router;
