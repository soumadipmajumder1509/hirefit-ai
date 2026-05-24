import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ACCEPTED = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'text/plain': ['.txt'],
};

export default function FileUpload({ file, onFile, label = 'Upload file', description }) {
  const onDrop = useCallback(accepted => { if (accepted.length) onFile(accepted[0]); }, [onFile]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop, accept: ACCEPTED, maxFiles: 1, maxSize: 10 * 1024 * 1024,
  });

  return (
    <AnimatePresence mode="wait">
      {file ? (
        <motion.div key="file"
          initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
          className="flex items-center gap-3 p-4 rounded-2xl"
          style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(16,185,129,0.12)' }}>
            <CheckCircle className="w-5 h-5" style={{ color: '#34d399' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: '#34d399' }}>{file.name}</p>
            <p className="text-xs mt-0.5" style={{ color: '#475569' }}>{(file.size / 1024).toFixed(1)} KB</p>
          </div>
          <button onClick={e => { e.stopPropagation(); onFile(null); }}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: '#475569' }}
            onMouseEnter={e => e.currentTarget.style.color = '#e2e8f0'}
            onMouseLeave={e => e.currentTarget.style.color = '#475569'}>
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      ) : (
        <motion.div key="drop"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          {...getRootProps()}
          className="relative cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-200"
          style={{
            borderColor: isDragActive && !isDragReject ? 'rgba(124,58,237,0.6)'
              : isDragReject ? 'rgba(239,68,68,0.5)'
              : 'rgba(255,255,255,0.08)',
            background: isDragActive && !isDragReject ? 'rgba(109,40,217,0.06)'
              : isDragReject ? 'rgba(239,68,68,0.04)'
              : 'rgba(255,255,255,0.02)',
          }}
          onMouseEnter={e => { if (!isDragActive) { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.35)'; e.currentTarget.style.background = 'rgba(109,40,217,0.04)'; }}}
          onMouseLeave={e => { if (!isDragActive) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200"
              style={{ background: isDragActive ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              {isDragActive
                ? <FileText className="w-7 h-7" style={{ color: '#a78bfa' }} />
                : <Upload className="w-7 h-7" style={{ color: '#475569' }} />}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">
                {isDragActive ? 'Drop it here' : label}
              </p>
              <p className="text-xs mt-1" style={{ color: '#475569' }}>
                {description || 'PDF, DOCX, or TXT — up to 10 MB'}
              </p>
            </div>
            <span className="text-xs font-medium px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(124,58,237,0.12)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.2)' }}>
              Click or drag & drop
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
