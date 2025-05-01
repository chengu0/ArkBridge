import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { filename } = req.query;
  const filePath = path.join(process.cwd(), 'uploads', filename as string);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: '文件不存在' });
  }

  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
} 