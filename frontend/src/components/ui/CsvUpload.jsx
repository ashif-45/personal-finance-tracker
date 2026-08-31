import { useState, useRef } from 'react';
import {
  Upload, FileSpreadsheet, CheckCircle, XCircle, AlertTriangle,
  Download, HelpCircle, Info,
} from 'lucide-react';
import Button from './Button.jsx';

export default function CsvUpload({
  onUpload,
  templateColumns = [],
  templateExamples = [],
  entityName = 'data',
  instructions = [],
  fieldDescriptions = [],
}) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [showGuide, setShowGuide] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
      setResult({ error: 'Invalid file format. Please select a valid .csv file.' });
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setResult({ error: 'File size too large. Must be less than 5MB.' });
      return;
    }
    setFile(selectedFile);
    setResult(null);
  };

  const handleInputChange = (e) => {
    handleFileSelect(e.target.files[0]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setResult(null);
    try {
      const res = await onUpload(file);
      setResult(res.data);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setResult({ error: err.message || 'Upload failed. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    if (!templateColumns.length) return;
    const rows = [templateColumns.join(',')];
    templateExamples.forEach((example) => {
      rows.push(example.join(','));
    });
    const csvContent = rows.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${entityName.toLowerCase().replace(/\s+/g, '_')}_template.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const resetForm = () => {
    setFile(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-4">
      {/* Help & Template Row */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setShowGuide(!showGuide)}
          className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors"
        >
          <HelpCircle size={15} />
          {showGuide ? 'Hide guide' : 'How to use bulk upload?'}
        </button>

        {templateColumns.length > 0 && (
          <button
            type="button"
            onClick={downloadTemplate}
            className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Download size={14} />
            Download Template
          </button>
        )}
      </div>

      {/* Instructions Guide */}
      {showGuide && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-start gap-2">
            <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-900 mb-2">How to Use Bulk Upload</p>
              <ol className="list-decimal list-inside text-xs text-blue-900 space-y-1 mb-3 leading-relaxed">
                <li>Click <strong>"Download Template"</strong> above to get a sample CSV file.</li>
                <li>Open the CSV in Excel, Google Sheets, or any text editor.</li>
                <li>Fill in your data following the column format. Keep the header row.</li>
                <li>Save the file as <code className="bg-blue-100 px-1 rounded">.csv</code> format (comma-separated).</li>
                <li>Drag &amp; drop the file below, or click to select.</li>
                <li>Click <strong>"Upload"</strong> to import. Review any errors shown after.</li>
              </ol>

              {fieldDescriptions.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-blue-900 mb-1.5">Field Requirements:</p>
                  <ul className="space-y-1">
                    {fieldDescriptions.map((desc, idx) => (
                      <li key={idx} className="text-xs text-blue-800 flex gap-2">
                        <span className="text-blue-500 shrink-0">•</span>
                        <span>{desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {instructions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="text-xs font-semibold text-blue-900 mb-1.5">Important Notes:</p>
                  <ul className="space-y-1">
                    {instructions.map((note, idx) => (
                      <li key={idx} className="text-xs text-blue-800 flex gap-2">
                        <span className="text-blue-500 shrink-0">⚠</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Drop Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : file
            ? 'border-green-400 bg-green-50/50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleInputChange}
          className="hidden"
        />
        {file ? (
          <div className="flex flex-col items-center gap-2">
            <FileSpreadsheet size={32} className="text-green-600" />
            <div>
              <p className="font-semibold text-gray-800">{file.name}</p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024).toFixed(1)} KB · Ready to upload
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                resetForm();
              }}
              className="text-xs text-red-600 hover:text-red-800 font-medium mt-1"
            >
              Remove file
            </button>
          </div>
        ) : (
          <div>
            <Upload size={32} className="mx-auto text-gray-400 mb-3" />
            <p className="text-sm text-gray-700 font-semibold">
              {dragActive ? 'Drop the CSV file here' : 'Drag & drop your CSV file here'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              or <span className="text-blue-600 font-medium">click to browse</span>
            </p>
            <p className="text-xs text-gray-400 mt-2">Maximum file size: 5MB</p>
          </div>
        )}
      </div>

      {file && (
        <Button onClick={handleUpload} loading={uploading} className="w-full">
          <Upload size={16} className="mr-1.5" />
          {uploading ? 'Uploading...' : `Upload ${entityName}`}
        </Button>
      )}

      {/* Results */}
      {result && !result.error && (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-900">Upload Complete</p>
            <button type="button" onClick={resetForm} className="text-xs text-gray-500 hover:text-gray-800">
              Upload another file
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
              <p className="text-xs text-gray-500 mb-1">Total Rows</p>
              <p className="text-lg font-bold text-gray-800">{result.totalRows}</p>
            </div>
            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 text-center">
              <p className="text-xs text-emerald-600 mb-1 flex items-center justify-center gap-1">
                <CheckCircle size={12} /> Success
              </p>
              <p className="text-lg font-bold text-emerald-700">{result.successCount}</p>
            </div>
            <div className={`p-3 rounded-lg border text-center ${result.failureCount > 0 ? 'bg-red-50 border-red-200' : 'bg-gray-100 border-gray-200'}`}>
              <p className={`text-xs mb-1 flex items-center justify-center gap-1 ${result.failureCount > 0 ? 'text-red-600' : 'text-gray-500'}`}>
                <XCircle size={12} /> Failed
              </p>
              <p className={`text-lg font-bold ${result.failureCount > 0 ? 'text-red-700' : 'text-gray-700'}`}>
                {result.failureCount}
              </p>
            </div>
          </div>

          {result.errors && result.errors.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-red-600 mb-1.5 flex items-center gap-1">
                <AlertTriangle size={12} /> Failed rows (fix these and re-upload):
              </p>
              <div className="max-h-48 overflow-y-auto space-y-1 border border-red-200 rounded-lg bg-red-50/50 p-2">
                {result.errors.map((err, idx) => (
                  <p key={idx} className="text-xs text-red-700 bg-white px-2 py-1.5 rounded border border-red-100">
                    <strong>Row {err.rowNumber}:</strong> {err.message}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* General Error (File rejection, network error) */}
      {result?.error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 flex items-start gap-2">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Upload Error</p>
            <p className="text-xs mt-0.5">{result.error}</p>
          </div>
          <button type="button" onClick={resetForm} className="text-xs text-red-600 hover:text-red-800 font-medium">
            Try again
          </button>
        </div>
      )}
    </div>
  );
}