import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseForm = (req: NextApiRequest): Promise<{ file: formidable.File }> =>
  new Promise((resolve, reject) => {
    const form = formidable();
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ file: files.file as formidable.File });
    });
  });

const extractText = async (file: formidable.File): Promise<string> => {
  if (file.mimetype === 'application/pdf') {
    const buffer = fs.readFileSync(file.filepath);
    const data = await pdfParse(buffer);
    return data.text;
  } else if (
    file.mimetype ===
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    const buffer = fs.readFileSync(file.filepath);
    const { value } = await mammoth.extractRawText({ buffer });
    return value;
  } else if (file.mimetype === 'text/plain') {
    return fs.readFileSync(file.filepath, 'utf8');
  }
  return '';
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }
  try {
    const { file } = await parseForm(req);
    const text = await extractText(file);
    res.status(200).json({ text });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to extract text' });
  }
}
