import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, Fields, Files } from 'formidable';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import archiver from 'archiver';

export const config = {
  api: {
    bodyParser: false,
  },
};

interface FileContent {
  path: string;
  content: string;
  isDirectory: boolean;
}

interface ProjectStructure {
  [key: string]: ProjectStructure | FileContent;
}

// 并发控制
const CONCURRENT_TRANSLATIONS = 5;
const translationQueue: Promise<any>[] = [];

async function translateFile(content: string, inputLanguage: string, outputLanguage: string): Promise<string> {
  const maxRetries = 3;
  let retryCount = 0;
  
  while (retryCount < maxRetries) {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_OPENAI_API_BASE_URL!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: process.env.NEXT_PUBLIC_OPENAI_MODEL,
          messages: [
            {
              role: 'system',
              content: `你是一个专业的代码转换工具。请将以下${inputLanguage}代码转换为${outputLanguage}代码。请确保转换后的代码保持原有的功能和结构。同时，请保持代码的格式和注释。如果遇到无法转换的部分，请保持原样并添加注释说明。`
            },
            {
              role: 'user',
              content: content
            }
          ],
          stream: false,
          temperature: 0.2,
          max_tokens: 4000
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`翻译请求失败 (尝试 ${retryCount + 1}/${maxRetries}):`, errorText);
        
        if (retryCount < maxRetries - 1) {
          retryCount++;
          // 等待一段时间后重试
          await new Promise(resolve => setTimeout(resolve, 2000 * retryCount));
          continue;
        }
        
        throw new Error(`翻译请求失败: ${errorText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error(`翻译过程出错 (尝试 ${retryCount + 1}/${maxRetries}):`, error);
      
      if (retryCount < maxRetries - 1) {
        retryCount++;
        await new Promise(resolve => setTimeout(resolve, 2000 * retryCount));
        continue;
      }
      
      throw error;
    }
  }
  
  throw new Error('达到最大重试次数，翻译失败');
}

function getFileExtension(language: string): string {
  const extensions: { [key: string]: string } = {
    'Python': 'py',
    'C': 'c',
    'C++': 'cpp',
    'Java': 'java',
    'JavaScript': 'js',
    'TypeScript': 'ts',
    'Go': 'go',
    'Rust': 'rs',
    'Ruby': 'rb',
    'PHP': 'php',
    'Swift': 'swift',
    'Kotlin': 'kt',
    'Scala': 'scala',
    'R': 'r',
    'MATLAB': 'm',
    'Perl': 'pl',
    'Shell': 'sh',
    'PowerShell': 'ps1',
    'Batch': 'bat',
    'HTML': 'html',
    'CSS': 'css',
    'SQL': 'sql',
    'Markdown': 'md',
    'JSON': 'json',
    'XML': 'xml',
    'YAML': 'yaml',
    'TOML': 'toml',
    'INI': 'ini',
    'CSV': 'csv',
    'TXT': 'txt'
  };
  return extensions[language] || 'txt';
}

async function processDirectory(dirPath: string, projectStructure: ProjectStructure, basePath: string = '') {
  const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relativePath = path.join(basePath, entry.name);
    
    if (entry.isDirectory()) {
      projectStructure[entry.name] = {};
      await processDirectory(fullPath, projectStructure[entry.name] as ProjectStructure, relativePath);
    } else {
      const content = await fs.promises.readFile(fullPath, 'utf-8');
      projectStructure[entry.name] = {
        path: relativePath,
        content,
        isDirectory: false
      };
    }
  }
}

async function translateProject(projectStructure: ProjectStructure, inputLanguage: string, outputLanguage: string): Promise<ProjectStructure> {
  const translatedStructure: ProjectStructure = {};
  const filesToTranslate: { path: string; content: string }[] = [];
  
  // 收集所有需要翻译的文件
  function collectFiles(structure: ProjectStructure, basePath: string = '') {
    for (const [name, item] of Object.entries(structure)) {
      if (typeof item === 'object' && 'isDirectory' in item) {
        const fileContent = item as FileContent;
        if (!fileContent.isDirectory) {
          filesToTranslate.push({
            path: path.join(basePath, name),
            content: fileContent.content
          });
        }
      } else {
        collectFiles(item as ProjectStructure, path.join(basePath, name));
      }
    }
  }
  
  collectFiles(projectStructure);
  
  // 并行翻译文件
  const translatedFiles = await Promise.all(
    filesToTranslate.map(async (file) => {
      const translation = translateFile(file.content, inputLanguage, outputLanguage);
      translationQueue.push(translation);
      if (translationQueue.length >= CONCURRENT_TRANSLATIONS) {
        await Promise.race(translationQueue);
        translationQueue.splice(0, 1);
      }
      return {
        path: file.path,
        content: await translation
      };
    })
  );
  
  // 构建翻译后的结构
  function buildTranslatedStructure(structure: ProjectStructure, basePath: string = ''): ProjectStructure {
    const result: ProjectStructure = {};
    
    for (const [name, item] of Object.entries(structure)) {
      if (typeof item === 'object' && 'isDirectory' in item) {
        const fileContent = item as FileContent;
        if (!fileContent.isDirectory) {
          const translatedFile = translatedFiles.find(f => f.path === path.join(basePath, name));
          if (translatedFile) {
            result[name] = {
              path: translatedFile.path,
              content: translatedFile.content,
              isDirectory: false
            };
          }
        }
      } else {
        result[name] = buildTranslatedStructure(item as ProjectStructure, path.join(basePath, name));
      }
    }
    
    return result;
  }
  
  return buildTranslatedStructure(projectStructure);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = new IncomingForm({
      uploadDir: path.join(process.cwd(), 'uploads'),
      keepExtensions: true,
      multiples: true,
      maxFileSize: 50 * 1024 * 1024 // 限制单个文件大小为50MB
    });

    const [fields, files] = await new Promise<[Fields, Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    if (!fields.inputLanguage || !fields.outputLanguage) {
      return res.status(400).json({ error: '缺少必要的语言参数' });
    }

    const inputLanguage = Array.isArray(fields.inputLanguage) 
      ? fields.inputLanguage[0] 
      : fields.inputLanguage;
    const outputLanguage = Array.isArray(fields.outputLanguage) 
      ? fields.outputLanguage[0] 
      : fields.outputLanguage;

    // 创建项目结构
    const projectStructure: ProjectStructure = {};
    for (const file of Object.values(files)) {
      const fileArray = Array.isArray(file) ? file : [file];
      for (const f of fileArray) {
        if (!f) continue;
        const filePath = f.filepath;
        const stats = await fs.promises.stat(filePath);
        
        if (stats.isDirectory()) {
          projectStructure[f.originalFilename || f.newFilename || ''] = {};
          await processDirectory(filePath, projectStructure[f.originalFilename || f.newFilename || ''] as ProjectStructure);
        } else {
          const content = await fs.promises.readFile(filePath, 'utf-8');
          projectStructure[f.originalFilename || f.newFilename || ''] = {
            path: f.originalFilename || f.newFilename || '',
            content,
            isDirectory: false
          };
        }
      }
    }

    // 转换项目
    const translatedStructure = await translateProject(projectStructure, inputLanguage, outputLanguage);

    // 创建ZIP文件
    const output = fs.createWriteStream(path.join(process.cwd(), 'uploads', 'translated.zip'));
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    output.on('close', () => {
      console.log('ZIP文件创建完成');
    });

    archive.on('error', (err: Error) => {
      throw err;
    });

    archive.pipe(output);

    // 添加转换后的文件到ZIP
    async function addFilesToArchive(structure: ProjectStructure, currentPath: string = '') {
      for (const [name, item] of Object.entries(structure)) {
        if (typeof item === 'object' && 'isDirectory' in item) {
          const fileContent = item as FileContent;
          if (!fileContent.isDirectory) {
            archive.append(fileContent.content, { name: path.join(currentPath, fileContent.path) });
          }
        } else {
          await addFilesToArchive(item as ProjectStructure, path.join(currentPath, name));
        }
      }
    }

    await addFilesToArchive(translatedStructure);
    await archive.finalize();

    // 返回ZIP文件的下载链接
    res.status(200).json({
      message: '转换完成',
      downloadUrl: '/api/download/translated.zip'
    });

  } catch (error) {
    console.error('Error processing files:', error);
    res.status(500).json({ error: '处理文件时出错' });
  }
} 