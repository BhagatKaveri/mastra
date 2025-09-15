export function chunkText(text: string, opts: { size: number; overlap: number }) {
    const { size, overlap } = opts;
    const chunks: Array<{ text: string; meta?: any }> = [];
    let start = 0;
    while (start < text.length) {
        const end = Math.min(start + size, text.length);
        const chunk = text.slice(start, end).trim();
        if (chunk) chunks.push({ text: chunk });
        start = Math.max(end - overlap, end);
        if (start >= text.length) break;
    }
    return chunks;
}
