import React, { useState } from 'react';
import {
  DocumentsHeader,
  DocumentToolbar,
  DocumentCards,
  DocumentUploader,
} from '@/components/documents';
import { DocumentItem } from '@/services/document.service';
import { CheckCircle2, FileText } from 'lucide-react';

export const DocumentLibraryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: 'doc-101',
      name: 'TR-102_Registration_2026.pdf',
      category: 'VEHICLE',
      fileType: 'PDF',
      sizeBytes: 2450000,
      url: '#',
      uploadedBy: 'Admin User',
      tags: ['registration', 'volvo', '2026'],
      createdAt: '2026-02-01T10:00:00Z',
    },
    {
      id: 'doc-102',
      name: 'Driver_License_JohnDoe.pdf',
      category: 'DRIVER',
      fileType: 'PDF',
      sizeBytes: 1800000,
      url: '#',
      uploadedBy: 'Fleet Manager',
      tags: ['compliance', 'cdl', 'license'],
      createdAt: '2026-01-28T14:30:00Z',
    },
    {
      id: 'doc-103',
      name: 'Maintenance_Invoice_WO-804.xlsx',
      category: 'MAINTENANCE',
      fileType: 'XLSX',
      sizeBytes: 3200000,
      url: '#',
      uploadedBy: 'Maintenance Lead',
      tags: ['invoice', 'radiator', 'service'],
      createdAt: '2026-02-02T11:15:00Z',
    },
    {
      id: 'doc-104',
      name: 'Waybill_WB-9941.pdf',
      category: 'SHIPMENT',
      fileType: 'PDF',
      sizeBytes: 950000,
      url: '#',
      uploadedBy: 'Dispatcher',
      tags: ['waybill', 'sector-4', 'delivered'],
      createdAt: '2026-02-03T09:40:00Z',
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
      notifyToast('Document Library refreshed.');
    }, 800);
  };

  const handleUpload = (file: File, category: string, tags: string[]) => {
    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      name: file.name,
      category: category as DocumentItem['category'],
      fileType: (file.name.split('.').pop()?.toUpperCase() as DocumentItem['fileType']) || 'PDF',
      sizeBytes: file.size,
      url: '#',
      uploadedBy: 'Admin User',
      tags,
      createdAt: new Date().toISOString(),
    };
    setDocuments((prev) => [newDoc, ...prev]);
    notifyToast(`Document "${file.name}" uploaded successfully.`);
  };

  const handleDelete = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    notifyToast('Document deleted.');
  };

  const handlePreview = (doc: DocumentItem) => {
    notifyToast(`Opening preview for ${doc.name}`);
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesCategory = selectedCategory === 'ALL' || doc.category === selectedCategory;
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <DocumentsHeader
        onRefresh={handleRefresh}
        onUpload={() => setUploaderOpen(true)}
        isRefreshing={isRefreshing}
        totalCount={documents.length}
      />

      {toastMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <DocumentToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {filteredDocuments.length > 0 ? (
        <DocumentCards
          documents={filteredDocuments}
          onPreview={handlePreview}
          onDelete={handleDelete}
        />
      ) : (
        <div className="rounded-2xl border border-border bg-card p-12 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <FileText className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">No documents found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Try adjusting your search criteria or category filter, or upload a new document to the library.
          </p>
        </div>
      )}

      <DocumentUploader
        open={uploaderOpen}
        onClose={() => setUploaderOpen(false)}
        onUpload={handleUpload}
      />
    </div>
  );
};

export default DocumentLibraryPage;
