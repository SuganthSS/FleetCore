import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  Upload,
  RefreshCw,
  Eye,
  Download,
  CheckCircle2,
  Lock,
  Tag,
  X,
  FileCheck,
} from 'lucide-react';
import { DocumentItem } from '@/services/document.service';
import { DocumentUploader } from '@/components/documents';
import { cn } from '@/utils/cn';

export const DispatcherDocumentsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);

  // Operational document store
  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: 'doc-dispatcher-1',
      name: 'Waybill_WB-9941_CargoExpress.pdf',
      category: 'SHIPMENT',
      fileType: 'PDF',
      sizeBytes: 1250000,
      url: '#',
      uploadedBy: 'Dispatcher Center',
      tags: ['waybill', 'cargo', 'interstate'],
      createdAt: '2026-08-04T10:00:00Z',
    },
    {
      id: 'doc-dispatcher-2',
      name: 'Proof_Of_Delivery_POD_SH-882.pdf',
      category: 'SHIPMENT',
      fileType: 'PDF',
      sizeBytes: 850000,
      url: '#',
      uploadedBy: 'Driver Terminal',
      tags: ['pod', 'signature', 'delivered'],
      createdAt: '2026-08-05T14:30:00Z',
    },
    {
      id: 'doc-dispatcher-3',
      name: 'CDL_License_Verification_SarahJenkins.pdf',
      category: 'DRIVER',
      fileType: 'PDF',
      sizeBytes: 1800000,
      url: '#',
      uploadedBy: 'Compliance Safety',
      tags: ['cdl', 'driver', 'compliance'],
      createdAt: '2026-07-28T09:15:00Z',
    },
    {
      id: 'doc-dispatcher-4',
      name: 'Vehicle_Registration_TRK-9902.pdf',
      category: 'VEHICLE',
      fileType: 'PDF',
      sizeBytes: 2100000,
      url: '#',
      uploadedBy: 'Fleet Lead',
      tags: ['registration', 'freightliner', 'dot'],
      createdAt: '2026-06-15T11:40:00Z',
    },
    {
      id: 'doc-dispatcher-5',
      name: 'Delivery_Note_DN-4402_SiteB.pdf',
      category: 'SHIPMENT',
      fileType: 'PDF',
      sizeBytes: 920000,
      url: '#',
      uploadedBy: 'Dispatcher',
      tags: ['delivery-note', 'boston', 'receipt'],
      createdAt: '2026-08-06T08:20:00Z',
    },
  ]);

  const notifyToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      notifyToast('Dispatcher Document Library refreshed.');
    }, 600);
  };

  const handleUpload = (file: File, category: string, tags: string[]) => {
    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      name: file.name,
      category: category as DocumentItem['category'],
      fileType: (file.name.split('.').pop()?.toUpperCase() as DocumentItem['fileType']) || 'PDF',
      sizeBytes: file.size,
      url: '#',
      uploadedBy: 'Dispatcher User',
      tags,
      createdAt: new Date().toISOString(),
    };
    setDocuments((prev) => [newDoc, ...prev]);
    notifyToast(`Document "${file.name}" uploaded to operational library.`);
  };

  const handlePreview = (doc: DocumentItem) => {
    setPreviewDoc(doc);
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesCategory = selectedCategory === 'ALL' || doc.category === selectedCategory;
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#c3c6d7]/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#2563eb]" />
            <h1 className="text-xl font-black tracking-tight text-[#191c1e]">
              Operational Document Vault & Proof of Delivery
            </h1>
          </div>
          <p className="text-xs font-semibold text-[#737686] mt-0.5">
            Waybills, delivery notes, shipment docs, driver CDL records & vehicle registrations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#c3c6d7] text-xs font-bold text-[#434655] hover:bg-[#eceef0] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', isRefreshing && 'animate-spin')} />
            <span>Refresh Vault</span>
          </button>

          <button
            onClick={() => setUploaderOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563eb] text-white text-xs font-bold shadow-md shadow-[#2563eb]/25 hover:bg-[#1d4ed8] transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {toastMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-50 p-4 text-xs font-bold text-emerald-800">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Toolbar & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#c3c6d7]/30 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#737686]" />
          <input
            type="text"
            placeholder="Search document name or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#c3c6d7]/40 text-xs focus:outline-none focus:border-[#2563eb]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-[#737686]" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl border border-[#c3c6d7]/40 text-xs focus:outline-none focus:border-[#2563eb] bg-white font-bold"
            >
              <option value="ALL">All Categories</option>
              <option value="SHIPMENT">Waybills & PODs</option>
              <option value="DRIVER">Driver CDL & Permits</option>
              <option value="VEHICLE">Vehicle Registration & DOT</option>
              <option value="MAINTENANCE">Maintenance Invoices</option>
            </select>
          </div>
        </div>
      </div>

      {/* Document Grid Cards (Dispatcher Read-Only Deletion Protection) */}
      {filteredDocuments.length === 0 ? (
        <div className="rounded-2xl border border-[#c3c6d7]/30 bg-white p-12 text-center space-y-3 shadow-xs">
          <FileText className="h-8 w-8 text-[#737686] mx-auto" />
          <h3 className="text-sm font-black text-[#191c1e]">No matching documents found</h3>
          <p className="text-xs text-[#737686]">Try adjusting your search filter or upload a new operational document.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="p-5 rounded-2xl border border-[#c3c6d7]/30 bg-white shadow-xs hover:border-[#2563eb]/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563eb] font-mono font-black text-xs border border-blue-100">
                    {doc.fileType}
                  </div>
                  <span className="rounded-full bg-[#f7f9fb] px-2.5 py-0.5 text-[10px] font-extrabold text-[#434655] uppercase border border-[#c3c6d7]/30">
                    {doc.category}
                  </span>
                </div>

                <div>
                  <h3 className="font-black text-[#191c1e] text-xs line-clamp-1 hover:text-[#2563eb] transition-colors cursor-pointer" onClick={() => handlePreview(doc)}>
                    {doc.name}
                  </h3>
                  <p className="text-[11px] text-[#737686] mt-0.5">
                    {(doc.sizeBytes / 1024 / 1024).toFixed(2)} MB • {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {doc.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-md bg-[#f7f9fb] px-2 py-0.5 text-[10px] font-bold text-[#434655] border border-[#c3c6d7]/30"
                    >
                      <Tag className="h-2.5 w-2.5 text-[#737686]" /> {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Footer for Dispatcher */}
              <div className="pt-3 border-t border-[#c3c6d7]/20 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#737686]">By {doc.uploadedBy}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handlePreview(doc)}
                    className="p-1.5 rounded-lg text-[#434655] hover:bg-blue-50 hover:text-[#2563eb] transition-colors"
                    title="Preview Document"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <a
                    href={doc.url}
                    download
                    className="p-1.5 rounded-lg text-[#434655] hover:bg-blue-50 hover:text-[#2563eb] transition-colors"
                    title="Download File"
                  >
                    <Download className="h-4 w-4" />
                  </a>

                  {/* Explicit Deletion Lock badge */}
                  <span
                    className="p-1.5 rounded-lg text-slate-300 cursor-not-allowed"
                    title="Company document deletion restricted to Fleet Administrators"
                  >
                    <Lock className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document Uploader Modal */}
      <DocumentUploader
        open={uploaderOpen}
        onClose={() => setUploaderOpen(false)}
        onUpload={handleUpload}
      />

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#c3c6d7]/30 pb-3">
              <div className="flex items-center gap-2 text-[#2563eb]">
                <FileCheck className="h-5 w-5" />
                <h3 className="text-sm font-black text-[#191c1e]">Document Viewer</h3>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="text-[#737686] hover:text-[#191c1e]">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <p className="font-black text-[#191c1e] text-sm">{previewDoc.name}</p>
                <p className="text-[11px] text-[#737686] mt-0.5">
                  Category: <strong>{previewDoc.category}</strong> • Size: {(previewDoc.sizeBytes / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              <div className="h-48 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center text-slate-400 font-mono text-xs">
                [ Simulated PDF Document Preview Stream ]
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 rounded-xl bg-[#2563eb] text-white text-xs font-bold hover:bg-[#1d4ed8]"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DispatcherDocumentsPage;
