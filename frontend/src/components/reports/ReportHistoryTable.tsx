import React from 'react';
import { Download, FileText, Clock, Trash2, Eye } from 'lucide-react';

export interface ReportHistoryRecord {
  id: string;
  reportName: string;
  category: string;
  format: 'CSV' | 'EXCEL' | 'PDF';
  generatedAt: string;
  generatedBy: string;
  fileSize: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
}

interface ReportHistoryTableProps {
  history: ReportHistoryRecord[];
  onDownload: (record: ReportHistoryRecord) => void;
  onViewPreview: (record: ReportHistoryRecord) => void;
  onDelete?: (id: string) => void;
}

export const ReportHistoryTable: React.FC<ReportHistoryTableProps> = ({
  history,
  onDownload,
  onViewPreview,
  onDelete,
}) => {
  if (history.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-border rounded-2xl bg-card">
        <Clock className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <h4 className="text-xs font-bold text-foreground">No Generated Report History</h4>
        <p className="text-xs text-muted-foreground mt-1">
          Reports created via the builder or templates will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-2xs">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-border bg-muted/40 font-mono text-[10px] uppercase text-muted-foreground">
            <th className="p-3.5 font-bold">Report Name</th>
            <th className="p-3.5 font-bold">Category</th>
            <th className="p-3.5 font-bold">Format</th>
            <th className="p-3.5 font-bold">Generated At</th>
            <th className="p-3.5 font-bold">File Size</th>
            <th className="p-3.5 font-bold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60 font-medium">
          {history.map((item) => (
            <tr key={item.id} className="hover:bg-muted/30 transition-colors">
              <td className="p-3.5 font-bold text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary shrink-0" />
                <span className="truncate max-w-[220px]">{item.reportName}</span>
              </td>
              <td className="p-3.5 font-mono text-[11px] text-muted-foreground">
                <span className="px-2 py-0.5 rounded-md bg-muted font-bold text-foreground">
                  {item.category}
                </span>
              </td>
              <td className="p-3.5 font-mono font-bold text-foreground">{item.format}</td>
              <td className="p-3.5 text-muted-foreground">{item.generatedAt}</td>
              <td className="p-3.5 font-mono text-muted-foreground">{item.fileSize}</td>
              <td className="p-3.5 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => onViewPreview(item)}
                    className="p-1.5 rounded-lg border border-input bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    title="Preview Report Details"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => onDownload(item)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary text-white font-bold text-xs hover:bg-primary/90 transition-colors"
                    title="Download Report File"
                  >
                    <Download className="h-3 w-3" />
                    Download
                  </button>
                  {onDelete && (
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title="Delete Report Entry"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportHistoryTable;
