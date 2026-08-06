import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Search,
  Filter,
  RefreshCw,
  Send,
  Navigation,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import { shipmentService } from '@/services/shipment.service';
import type { Shipment, ShipmentStatus } from '@/types/shipment';
import { cn } from '@/utils/cn';

export const DispatcherShipmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [podModalOpen, setPodModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<ShipmentStatus>('DISPATCHED');

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch Shipments using shipmentService
  const { data: shipmentData, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['dispatcher-shipments', search, statusFilter],
    queryFn: async () => {
      const res = await shipmentService.getShipments({
        search: search || undefined,
        status: statusFilter ? (statusFilter as ShipmentStatus) : undefined,
        limit: 50,
      });
      return res.data;
    },
  });

  // Status update mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ShipmentStatus }) => {
      return shipmentService.updateShipment(id, { status });
    },
    onSuccess: (res) => {
      setSuccessMsg(`Shipment #${res.data.shipmentNumber} status updated to ${res.data.status}`);
      setErrorMsg(null);
      void queryClient.invalidateQueries({ queryKey: ['dispatcher-shipments'] });
      setStatusModalOpen(false);
      setSelectedShipment(null);
      setTimeout(() => setSuccessMsg(null), 4000);
    },
    onError: (err: any) => {
      setErrorMsg(err.message || 'Failed to update shipment status');
      setSuccessMsg(null);
    },
  });

  const shipments = shipmentData?.items || [];

  const handleOpenStatusModal = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setNewStatus(shipment.status);
    setStatusModalOpen(true);
  };

  const handleOpenPodModal = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setPodModalOpen(true);
  };

  const handleConfirmStatusChange = () => {
    if (selectedShipment) {
      updateStatusMutation.mutate({ id: selectedShipment.id, status: newStatus });
    }
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#c3c6d7]/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-[#2563eb]" />
            <h1 className="text-xl font-black tracking-tight text-[#191c1e]">
              Cargo & Shipment Logistics
            </h1>
          </div>
          <p className="text-xs font-semibold text-[#737686] mt-0.5">
            Operational cargo tracking, shipment assignments, proof of delivery & driver communications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => void refetch()}
            disabled={isFetching}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#c3c6d7] text-xs font-bold text-[#434655] hover:bg-[#eceef0] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', isFetching && 'animate-spin')} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => navigate('/dispatcher/dispatch-center')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563eb] text-white text-xs font-bold shadow-md shadow-[#2563eb]/25 hover:bg-[#1d4ed8] transition-colors"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Assign Cargo to Trip</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-50 p-4 text-xs font-bold text-emerald-800">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-50 p-4 text-xs font-bold text-red-800">
          <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Filter & Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#c3c6d7]/30 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#737686]" />
          <input
            type="text"
            placeholder="Search shipment # or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#c3c6d7]/40 text-xs focus:outline-none focus:border-[#2563eb]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-[#737686]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-[#c3c6d7]/40 text-xs focus:outline-none focus:border-[#2563eb] bg-white font-bold"
            >
              <option value="">All Shipment Statuses</option>
              <option value="PENDING">Pending Assignment</option>
              <option value="DISPATCHED">Dispatched</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shipments List */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-[#737686]">Loading shipments...</div>
      ) : shipments.length === 0 ? (
        <div className="py-16 text-center text-xs text-[#737686]">No shipments found matching the criteria.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shipments.map((shipment) => (
            <div
              key={shipment.id}
              className="p-5 rounded-2xl border border-[#c3c6d7]/30 bg-white shadow-xs hover:border-[#2563eb]/40 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-sm text-[#191c1e]">#{shipment.shipmentNumber}</span>
                  <span
                    className={cn(
                      'px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase',
                      shipment.status === 'DELIVERED' && 'bg-emerald-100 text-emerald-700',
                      shipment.status === 'IN_TRANSIT' && 'bg-purple-100 text-purple-700',
                      shipment.status === 'DISPATCHED' && 'bg-blue-100 text-blue-700',
                      shipment.status === 'PENDING' && 'bg-amber-100 text-amber-700',
                      shipment.status === 'CANCELLED' && 'bg-red-100 text-red-700'
                    )}
                  >
                    {shipment.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-black text-[#191c1e] line-clamp-1">{shipment.title}</h3>
                  <p className="text-[11px] text-[#737686] mt-0.5">
                    Customer: {shipment.customer?.companyName || 'Enterprise Client'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#f7f9fb] p-2.5 rounded-xl text-[#434655]">
                  <div>
                    <span className="block text-[9px] text-[#737686] font-extrabold uppercase">Origin</span>
                    <span className="font-bold truncate block">{shipment.pickupAddress || 'Origin Hub'}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-[#737686] font-extrabold uppercase">Destination</span>
                    <span className="font-bold truncate block">{shipment.deliveryAddress || 'Delivery Location'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#737686]">
                  <span>Weight: <strong>{shipment.weight ? `${shipment.weight} kg` : 'N/A'}</strong></span>
                  <span>Volume: <strong>{shipment.volume ? `${shipment.volume} m³` : 'N/A'}</strong></span>
                </div>
              </div>

              {/* Action Buttons for Dispatcher */}
              <div className="pt-3 border-t border-[#c3c6d7]/20 flex flex-wrap items-center justify-between gap-2">
                <button
                  onClick={() => navigate('/dispatcher/tracking')}
                  className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  <span>GPS Track</span>
                </button>

                <button
                  onClick={() => handleOpenPodModal(shipment)}
                  className="flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-slate-900"
                >
                  <FileCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>View POD</span>
                </button>

                <button
                  onClick={() => handleOpenStatusModal(shipment)}
                  className="px-2.5 py-1 rounded-lg bg-[#2563eb]/10 text-[#2563eb] text-[11px] font-bold hover:bg-[#2563eb] hover:text-white transition-colors"
                >
                  Update Status
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Proof of Delivery (POD) Modal */}
      {podModalOpen && selectedShipment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#c3c6d7]/30 pb-3">
              <div className="flex items-center gap-2 text-emerald-600">
                <FileCheck className="h-5 w-5" />
                <h3 className="text-sm font-black text-[#191c1e]">Proof of Delivery (POD)</h3>
              </div>
              <button onClick={() => setPodModalOpen(false)} className="text-[#737686] hover:text-[#191c1e]">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#434655]">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <p className="font-bold text-emerald-900">Shipment #{selectedShipment.shipmentNumber}</p>
                <p className="text-[11px] text-emerald-700">{selectedShipment.title}</p>
              </div>

              <div className="space-y-1.5">
                <p><strong>Recipient:</strong> John Williams (Site Manager)</p>
                <p><strong>Delivered Date:</strong> {new Date().toLocaleDateString()}</p>
                <p><strong>Digital Signature:</strong> Verified (Cryptographic Hash #8820A)</p>
              </div>

              {/* Simulated POD Signature Canvas Display */}
              <div className="h-24 w-full bg-slate-100 rounded-xl border border-slate-300 flex items-center justify-center text-slate-400 italic font-serif">
                [ Verified E-Signature Signed on Terminal ]
              </div>
            </div>

            <button
              onClick={() => setPodModalOpen(false)}
              className="w-full py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
            >
              Close POD Record
            </button>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {statusModalOpen && selectedShipment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#c3c6d7]/30 pb-3">
              <h3 className="text-sm font-black text-[#191c1e]">Update Shipment Status</h3>
              <button onClick={() => setStatusModalOpen(false)} className="text-[#737686] hover:text-[#191c1e]">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-[#737686]">Select new operational status for shipment #{selectedShipment.shipmentNumber}:</p>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as ShipmentStatus)}
                className="w-full p-2.5 rounded-xl border border-[#c3c6d7] font-bold text-xs focus:outline-none focus:border-[#2563eb]"
              >
                <option value="PENDING">Pending Assignment</option>
                <option value="DISPATCHED">Dispatched</option>
                <option value="IN_TRANSIT">In Transit</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setStatusModalOpen(false)}
                className="px-3.5 py-2 rounded-xl border border-[#c3c6d7] text-xs font-bold text-[#434655]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStatusChange}
                disabled={updateStatusMutation.isPending}
                className="px-4 py-2 rounded-xl bg-[#2563eb] text-white text-xs font-bold hover:bg-[#1d4ed8]"
              >
                {updateStatusMutation.isPending ? 'Updating...' : 'Save Status'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DispatcherShipmentsPage;
