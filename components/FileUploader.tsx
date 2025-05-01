import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiFolder, FiFile, FiDownload, FiUpload, FiAlertCircle } from 'react-icons/fi';

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  status?: 'uploading' | 'completed' | 'error';
}

interface FileUploaderProps {
  inputLanguage: string;
  outputLanguage: string;
  onUploadComplete?: (files: File[]) => void;
}

export const FileUploader = ({ inputLanguage, outputLanguage, onUploadComplete }: FileUploaderProps) => {
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const updateFileStatus = useCallback((path: string, status: 'uploading' | 'completed' | 'error') => {
    setFileTree(prevTree => {
      const updateNode = (nodes: FileNode[]): FileNode[] => {
        return nodes.map(node => {
          if (node.path === path) {
            return { ...node, status };
          }
          if (node.children) {
            return { ...node, children: updateNode(node.children) };
          }
          return node;
        });
      };
      return updateNode(prevTree);
    });
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    setError(null);
    setProgress(0);
    setUploadedFiles(acceptedFiles);
    
    const newFileTree: FileNode[] = [];
    
    // 处理上传的文件
    acceptedFiles.forEach((file) => {
      const path = file.webkitRelativePath || file.name;
      const parts = path.split('/');
      
      let currentLevel = newFileTree;
      parts.forEach((part, index) => {
        const isLast = index === parts.length - 1;
        const existingNode = currentLevel.find(node => node.name === part);
        
        if (existingNode) {
          currentLevel = existingNode.children || [];
        } else {
          const newNode: FileNode = {
            name: part,
            path: parts.slice(0, index + 1).join('/'),
            type: isLast ? 'file' : 'directory',
            children: isLast ? undefined : [],
            status: isLast ? 'uploading' : undefined
          };
          currentLevel.push(newNode);
          currentLevel = newNode.children || [];
        }
      });
    });
    
    setFileTree(newFileTree);
    
    // 创建FormData对象
    const formData = new FormData();
    formData.append('inputLanguage', inputLanguage);
    formData.append('outputLanguage', outputLanguage);
    acceptedFiles.forEach(file => {
      formData.append('files', file, file.webkitRelativePath || file.name);
    });

    try {
      const response = await fetch('/api/translate-project', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('上传失败');
      }

      const result = await response.json();
      console.log('上传结果:', result);
      
      if (result.downloadUrl) {
        setDownloadUrl(result.downloadUrl);
        // 更新所有文件状态为完成
        acceptedFiles.forEach(file => {
          updateFileStatus(file.webkitRelativePath || file.name, 'completed');
        });
      }
      
      if (onUploadComplete) {
        onUploadComplete(acceptedFiles);
      }
    } catch (error) {
      console.error('上传错误:', error);
      setError('文件上传失败，请重试');
      // 更新所有文件状态为错误
      acceptedFiles.forEach(file => {
        updateFileStatus(file.webkitRelativePath || file.name, 'error');
      });
    } finally {
      setUploading(false);
      setProgress(100);
    }
  }, [inputLanguage, outputLanguage, onUploadComplete, updateFileStatus]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    directory: true,
    multiple: true
  });

  const renderFileTree = (nodes: FileNode[]) => {
    return (
      <ul className="list-none pl-4">
        {nodes.map((node) => (
          <li key={node.path} className="py-1">
            <div className="flex items-center">
              {node.type === 'directory' ? (
                <FiFolder className="mr-2 text-yellow-500" />
              ) : (
                <FiFile className="mr-2 text-blue-500" />
              )}
              <span className="text-sm">{node.name}</span>
              {node.status === 'uploading' && (
                <span className="ml-2 text-xs text-gray-500">上传中...</span>
              )}
              {node.status === 'completed' && (
                <span className="ml-2 text-xs text-green-500">✓</span>
              )}
              {node.status === 'error' && (
                <span className="ml-2 text-xs text-red-500">✗</span>
              )}
            </div>
            {node.children && renderFileTree(node.children)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <FiUpload className="text-4xl mb-4 text-gray-400" />
          <p className="text-gray-600">
            {isDragActive
              ? '释放文件开始上传'
              : '拖拽文件或文件夹到这里，或点击选择文件'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            支持整个项目文件夹上传
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg flex items-center">
          <FiAlertCircle className="mr-2" />
          {error}
        </div>
      )}

      {uploading && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">正在处理文件...</p>
        </div>
      )}

      {fileTree.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium mb-2">文件结构</h3>
          {renderFileTree(fileTree)}
        </div>
      )}

      {downloadUrl && (
        <div className="mt-4">
          <a
            href={downloadUrl}
            download
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <FiDownload className="mr-2" />
            下载转换后的文件
          </a>
        </div>
      )}
    </div>
  );
}; 