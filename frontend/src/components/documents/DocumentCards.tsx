import React from 'react';
import { Download, Trash2, Eye, Tag } from 'lucide-react';
import { DocumentItem } from '@/services/document.service';

interface DocumentCardsProps {
  documents: DocumentItem[];
  onPreview: (doc: DocumentItem) => void;
  onDelete: (id: string) => void;
}

export const DocumentCards: React.FC<DocumentCardsProps> = ({ documents, onPreview, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="group rounded-2xl border border-border bg-card p-5 shadow-sm hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
                {doc.fileType}
              </div>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground uppercase border border-border">
                {doc.category}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-foreground text-sm line-clamp-1 group-hover:text-primary transition-colors">
                {doc.name}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {(doc.sizeBytes / 1024 / 1024).toFixed(2)} MB • {new Date(doc.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {doc.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-md bg-background px-2 py-0.5 text-[10px] font-medium text-muted-foreground border border-border"
                >
                  <Tag className="h-2.5 w-2.5" /> {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-border flex items-center justify-between">
            <span className="text-[11px] font-medium text-muted-foreground">By {doc.uploadedBy}</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onPreview(doc)}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                title="Preview"
              >
                <Eye className="h-4 w-4" />
              </button>
              <a
                href={doc.url}
                download
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                title="Download"
              >
                <Download className="h-4 w-4" />
              </a>
              <button
                onClick={() => onDelete(doc.id)}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-rose-500/10 hover:text-rose-600 transition-colors"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
