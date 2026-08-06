import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Radio,
  Map,
  Package,
  Navigation,
  Users,
  Truck,
  Activity,
  Bell,
  FileText,
  Sparkles,
  Search,
  User,
  ArrowLeft,
  Construction,
} from 'lucide-react';

interface PlaceholderProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  specCode: string;
}

const GenericDispatcherPlaceholder: React.FC<PlaceholderProps> = ({
  title,
  description,
  icon: Icon,
  specCode,
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-[#c3c6d7]/30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#2563eb]/10 text-[#2563eb]">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#191c1e]">{title}</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                {specCode}
              </span>
            </div>
            <p className="text-xs text-[#737686]">{description}</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/dispatcher/dashboard')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#c3c6d7] text-xs font-bold text-[#434655] hover:bg-[#eceef0] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Placeholder Content Box */}
      <div className="rounded-2xl border border-[#c3c6d7]/30 bg-white p-12 text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2563eb]/10 text-[#2563eb]">
          <Construction className="h-8 w-8" />
        </div>
        <div className="max-w-md mx-auto space-y-2">
          <h2 className="text-base font-bold text-[#191c1e]">
            {title} Module Foundation Prepared
          </h2>
          <p className="text-xs text-[#737686] leading-relaxed">
            The layout routing, navigation sidebar entry, role permissions, and breadcrumbs for{' '}
            <strong className="text-[#191c1e]">{title}</strong> have been registered in SPEC-301.
            Detailed operational interfaces for this view are scheduled for upcoming milestone releases.
          </p>
        </div>
        <div className="pt-2">
          <button
            onClick={() => navigate('/dispatcher/dashboard')}
            className="px-4 py-2 rounded-xl bg-[#2563eb] text-white text-xs font-bold shadow-md shadow-[#2563eb]/25 hover:bg-[#1d4ed8] transition-colors"
          >
            Go to Dispatcher Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export const DispatchCenterPage: React.FC = () => (
  <GenericDispatcherPlaceholder
    title="Dispatch Center"
    description="Real-time trip dispatch execution, active route assignments & driver communication."
    icon={Radio}
    specCode="SPEC-302 PREP"
  />
);

export const DispatcherTripsPage: React.FC = () => (
  <GenericDispatcherPlaceholder
    title="Dispatcher Trips"
    description="Trip manifests, schedule timeline, and dispatch statuses."
    icon={Map}
    specCode="SPEC-301"
  />
);

export const DispatcherShipmentsPage: React.FC = () => (
  <GenericDispatcherPlaceholder
    title="Shipments Management"
    description="Active cargo waybills, customer delivery SLAs, and shipment tracking."
    icon={Package}
    specCode="SPEC-301"
  />
);

export const DispatcherRoutesPage: React.FC = () => (
  <GenericDispatcherPlaceholder
    title="Route Optimization"
    description="Interstate corridors, waypoint navigation, and detour management."
    icon={Navigation}
    specCode="SPEC-301"
  />
);

export const DispatcherDriversPage: React.FC = () => (
  <GenericDispatcherPlaceholder
    title="Driver Roster & Availability"
    description="On-duty drivers, HOS status, and vehicle assignment eligibility."
    icon={Users}
    specCode="SPEC-301"
  />
);

export const DispatcherVehiclesPage: React.FC = () => (
  <GenericDispatcherPlaceholder
    title="Fleet Vehicles"
    description="Operational vehicle fleet, active dispatches, and availability."
    icon={Truck}
    specCode="SPEC-301"
  />
);

export const DispatcherTrackingPage: React.FC = () => (
  <GenericDispatcherPlaceholder
    title="Live GPS Tracking"
    description="Real-time telematics corridor map, speed, heading, and unit ping history."
    icon={Activity}
    specCode="SPEC-301"
  />
);

export const DispatcherNotificationsPage: React.FC = () => (
  <GenericDispatcherPlaceholder
    title="Dispatcher Alerts & Notifications"
    description="Urgent delay warnings, HOS alerts, and priority dispatch broadcasts."
    icon={Bell}
    specCode="SPEC-301"
  />
);

export const DispatcherDocumentsPage: React.FC = () => (
  <GenericDispatcherPlaceholder
    title="Dispatcher Document Library"
    description="Waybills, proof of delivery receipts, and fuel logs."
    icon={FileText}
    specCode="SPEC-301"
  />
);

export const DispatcherAIPage: React.FC = () => (
  <GenericDispatcherPlaceholder
    title="AI Dispatch Assistant"
    description="Groq-powered AI copilot for route optimization and delay predictions."
    icon={Sparkles}
    specCode="SPEC-301"
  />
);

export const DispatcherSearchPage: React.FC = () => (
  <GenericDispatcherPlaceholder
    title="Dispatcher Global Search"
    description="Fast lookup for trips, drivers, shipments, waybills, and vehicles."
    icon={Search}
    specCode="SPEC-301"
  />
);

export const DispatcherProfilePage: React.FC = () => (
  <GenericDispatcherPlaceholder
    title="Dispatcher Profile"
    description="Account credentials, notification preferences, and shift details."
    icon={User}
    specCode="SPEC-301"
  />
);
