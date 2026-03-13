import { useDropzone } from 'react-dropzone';

export default function DropZone({ onFiles }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => onFiles(acceptedFiles),
    accept: {
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
      'application/pdf': ['.pdf'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
        isDragActive
          ? 'border-primary-500 bg-primary-50 scale-[1.01]'
          : 'border-surface-300 hover:border-primary-400 hover:bg-surface-50'
      }`}
    >
      <input {...getInputProps()} />
      <div className="text-3xl mb-3 opacity-60">\u2191</div>
      {isDragActive ? (
        <p className="text-primary-700 font-medium">Drop files here...</p>
      ) : (
        <>
          <p className="text-ink-700 font-medium mb-1">Drag files here or click to upload</p>
          <p className="text-ink-500 text-sm">Supports .txt, .md, .pdf - up to 10MB each</p>
          <p className="text-ink-300 text-xs mt-2">For .docx and .pptx, export as PDF or copy text first</p>
        </>
      )}
    </div>
  );
}
