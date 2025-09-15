import fs from 'fs';
import pdfParse from 'pdf-parse';

export async function parsePdf(path: string) {
    const dataBuffer = fs.readFileSync(path);
    const data = await pdfParse(dataBuffer);
    return data.text;
}
