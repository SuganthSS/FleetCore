import React from 'react';

export const DriverSkeleton: React.FC = () => {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm animate-pulse">
      {/* Table Toolbar Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 border-b border-border">
        <div className="h-10 w-full sm:w-64 bg-muted rounded-lg" />
        <div className="flex flex-wrap gap-2 sm:ml-auto">
          <div className="h-10 w-32 bg-muted rounded-lg" />
          <div className="h-10 w-32 bg-muted rounded-lg" />
          <div className="h-10 w-32 bg-muted rounded-lg" />
          <div className="h-10 w-10 bg-muted rounded-lg" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              {[...Array(9)].map((_, idx) => (
                <th key={idx} className="p-4">
                  <div className="h-4 w-20 bg-muted rounded" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, rowIdx) => (
              <tr key={rowIdx} className="border-b border-border/60">
                <td className="p-4">
                  <div className="h-10 w-10 bg-muted rounded-lg" />
                </td>
                <td className="p-4">
                  <div className="h-4 w-28 bg-muted rounded" />
                </td>
                <td className="p-4">
                  <div className="h-4 w-32 bg-muted rounded" />
                </td>
                <td className="p-4">
                  <div className="h-4 w-16 bg-muted rounded" />
                </td>
                <td className="p-4">
                  <div className="h-4 w-24 bg-muted rounded" />
                </td>
                <td className="p-4">
                  <div className="h-4.5 w-16 bg-muted rounded-full" />
                </td>
                <td className="p-4">
                  <div className="h-4 w-12 bg-muted rounded" />
                </td>
                <td className="p-4">
                  <div className="h-4 w-24 bg-muted rounded" />
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <div className="h-8 w-8 bg-muted rounded-lg" />
                    <div className="h-8 w-8 bg-muted rounded-lg" />
                    <div className="h-8 w-8 bg-muted rounded-lg" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between p-4 border-t border-border bg-card">
        <div className="h-4 w-32 bg-muted rounded" />
        <div className="flex gap-2">
          <div className="h-8 w-16 bg-muted rounded" />
          <div className="h-8 w-16 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
};
export default DriverSkeleton;
