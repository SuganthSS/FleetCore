import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Truck,
  Users,
  MapPin,
  Wrench,
  Fuel,
  AlertTriangle,
  Clock,
  TrendingUp,
  Activity,
  CheckCircle2,
  Navigation,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const FleetManagerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const operationalKPIs = [
    {
      title: 'Fleet Availability',
      value: '94.2%',
      change: '+2.1%',
      trend: 'up',
      description: '45 of 48 active vehicles ready',
      icon: Truck,
      color: 'text-[#10b981]',
      bgColor: 'bg-[#10b981]/10',
    },
    {
      title: 'Vehicles Online',
      value: '42 / 48',
      change: 'Live GPS',
      trend: 'neutral',
      description: 'Active streaming telemetry',
      icon: Navigation,
      color: 'text-[#2563eb]',
      bgColor: 'bg-[#2563eb]/10',
    },
    {
      title: 'Trips Today',
      value: '28 Active',
      change: '14 Completed',
      trend: 'up',
      description: 'Dispatch efficiency 96%',
      icon: MapPin,
      color: 'text-[#2563eb]',
      bgColor: 'bg-[#2563eb]/10',
    },
    {
      title: 'Drivers On Duty',
      value: '36 Drivers',
      change: '4 Shift Rest',
      trend: 'neutral',
      description: '100% license compliance',
      icon: Users,
      color: 'text-[#10b981]',
      bgColor: 'bg-[#10b981]/10',
    },
    {
      title: 'Fuel Consumption',
      value: '1,420 L',
      change: '-4.3% vs avg',
      trend: 'down',
      description: 'Avg 28.4 L/100km fleet efficiency',
      icon: Fuel,
      color: 'text-[#f59e0b]',
      bgColor: 'bg-[#f59e0b]/10',
    },
    {
      title: 'Maintenance Due',
      value: '4 Vehicles',
      change: '2 Urgent',
      trend: 'down',
      description: 'Scheduled within next 48 hours',
      icon: Wrench,
      color: 'text-[#ef4444]',
      bgColor: 'bg-[#ef4444]/10',
    },
    {
      title: 'Delayed Trips',
      value: '2 Delayed',
      change: 'Traffic Impact',
      trend: 'down',
      description: 'Trip #TR-8924 & #TR-8911',
      icon: Clock,
      color: 'text-[#f59e0b]',
      bgColor: 'bg-[#f59e0b]/10',
    },
    {
      title: 'Vehicle Utilization',
      value: '88.5%',
      change: '+3.4%',
      trend: 'up',
      description: 'Peak operational efficiency',
      icon: TrendingUp,
      color: 'text-[#2563eb]',
      bgColor: 'bg-[#2563eb]/10',
    },
  ];

  const recentAlerts = [
    {
      id: 'ALT-101',
      time: '10 mins ago',
      type: 'Low Fuel Warning',
      vehicle: 'Volvo FH16 (VH-004)',
      severity: 'warning',
    },
    {
      id: 'ALT-102',
      time: '25 mins ago',
      type: 'Inspection Overdue',
      vehicle: 'Scania R500 (VH-012)',
      severity: 'critical',
    },
    {
      id: 'ALT-103',
      time: '1 hour ago',
      type: 'Route Deviation Detected',
      vehicle: 'Mercedes Actros (VH-019)',
      severity: 'warning',
    },
    {
      id: 'ALT-104',
      time: '2 hours ago',
      type: 'Trip Completed On Time',
      vehicle: 'MAN TGX (VH-008)',
      severity: 'success',
    },
  ];

  const todayTasks = [
    { title: 'Approve Maintenance Work Order for VH-012', due: '12:00 PM', status: 'Pending' },
    { title: 'Assign Driver to Shipment #SH-4092 (Chicago Route)', due: '01:30 PM', status: 'Pending' },
    { title: 'Verify Fuel Receipt Batch for Driver Marcus Vance', due: '03:00 PM', status: 'Completed' },
    { title: 'Review Weekly Operational Dispatch Log', due: '05:00 PM', status: 'In Progress' },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#c3c6d7]/30 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#2563eb]/10 text-[#2563eb] flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> Fleet Manager Workspace
            </span>
            <span className="text-xs text-[#737686]">Operational Command Center</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#191c1e] mt-2 font-['Plus_Jakarta_Sans'] tracking-tight">
            Welcome back, {user?.firstName || 'Manager'}
          </h1>
          <p className="text-sm text-[#434655] mt-1">
            Real-time fleet operations, dispatch metrics, and maintenance tracking.
          </p>
        </div>

        {/* Quick Dispatch Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate('/fleet-manager/trips')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563eb] text-white text-sm font-semibold hover:bg-[#1d4ed8] transition-colors shadow-sm shadow-[#2563eb]/30"
          >
            <MapPin className="w-4 h-4" /> Dispatch Trip
          </button>
          <button
            onClick={() => navigate('/fleet-manager/maintenance')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#c3c6d7] text-[#191c1e] bg-white text-sm font-semibold hover:bg-[#f2f4f6] transition-colors"
          >
            <Wrench className="w-4 h-4 text-[#505f76]" /> Schedule Service
          </button>
        </div>
      </div>

      {/* Operational KPIs Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#191c1e] font-['Plus_Jakarta_Sans'] flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#2563eb]" /> Fleet Operational Metrics
          </h2>
          <span className="text-xs text-[#737686] font-medium">Auto-refreshed live</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {operationalKPIs.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-[#c3c6d7]/30 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#737686] uppercase tracking-wider">{kpi.title}</span>
                  <div className={`p-2 rounded-xl ${kpi.bgColor}`}>
                    <Icon className={`w-5 h-5 ${kpi.color}`} />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-[#191c1e] font-['Plus_Jakarta_Sans']">{kpi.value}</span>
                  <span className={`text-xs font-semibold ${kpi.trend === 'up' ? 'text-[#10b981]' : kpi.trend === 'down' ? 'text-[#ef4444]' : 'text-[#737686]'}`}>
                    {kpi.change}
                  </span>
                </div>
                <p className="text-xs text-[#434655] mt-1.5">{kpi.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Split Section: Active Operations & Task Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Operations Control Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tracking Teaser Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#c3c6d7]/30 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#191c1e] font-['Plus_Jakarta_Sans'] flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-[#2563eb]" /> Live GPS Fleet Telemetry
                </h3>
                <p className="text-xs text-[#737686] mt-0.5">42 active vehicles broadcasting telemetry</p>
              </div>
              <button
                onClick={() => navigate('/fleet-manager/tracking')}
                className="text-xs font-semibold text-[#2563eb] hover:underline flex items-center gap-1"
              >
                Full Map View <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="h-48 bg-[#eceef0] rounded-xl flex items-center justify-center border border-[#c3c6d7]/40 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2563eb]/5 to-[#10b981]/5 flex flex-col items-center justify-center p-6 text-center">
                <MapPin className="w-10 h-10 text-[#2563eb] animate-bounce mb-2" />
                <p className="text-sm font-semibold text-[#191c1e]">Real-Time GPS Tracking Active</p>
                <p className="text-xs text-[#737686] max-w-sm mt-1">
                  Monitor active routes, driver speeds, geofence compliance, and live ETA updates.
                </p>
                <button
                  onClick={() => navigate('/fleet-manager/tracking')}
                  className="mt-3 px-4 py-1.5 rounded-lg bg-[#2563eb] text-white text-xs font-semibold shadow-sm"
                >
                  Open Live Map
                </button>
              </div>
            </div>
          </div>

          {/* Today's Operations Tasks */}
          <div className="bg-white p-6 rounded-2xl border border-[#c3c6d7]/30 shadow-sm">
            <h3 className="text-base font-bold text-[#191c1e] font-['Plus_Jakarta_Sans'] flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-[#10b981]" /> Today's Operational Tasks
            </h3>
            <div className="space-y-3">
              {todayTasks.map((task, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-[#c3c6d7]/30 bg-[#f7f9fb] hover:bg-[#eceef0] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" />
                    <div>
                      <p className="text-sm font-medium text-[#191c1e]">{task.title}</p>
                      <p className="text-xs text-[#737686]">Target completion: {task.due}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                      task.status === 'Completed'
                        ? 'bg-[#10b981]/10 text-[#10b981]'
                        : task.status === 'In Progress'
                        ? 'bg-[#2563eb]/10 text-[#2563eb]'
                        : 'bg-[#f59e0b]/10 text-[#f59e0b]'
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Operational Alerts & Fleet Status */}
        <div className="space-y-6">
          {/* Operational Alerts */}
          <div className="bg-white p-6 rounded-2xl border border-[#c3c6d7]/30 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#191c1e] font-['Plus_Jakarta_Sans'] flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#ef4444]" /> Real-Time Operational Alerts
              </h3>
            </div>
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3.5 rounded-xl border border-[#c3c6d7]/30 bg-[#f7f9fb] space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#191c1e]">{alert.type}</span>
                    <span className="text-[10px] text-[#737686]">{alert.time}</span>
                  </div>
                  <p className="text-xs text-[#434655] font-medium">{alert.vehicle}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-white p-6 rounded-2xl border border-[#c3c6d7]/30 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-[#191c1e] font-['Plus_Jakarta_Sans'] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#2563eb]" /> Fleet Manager Shortcuts
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => navigate('/fleet-manager/vehicles')}
                className="p-3 rounded-xl border border-[#c3c6d7]/40 bg-[#f7f9fb] hover:bg-[#2563eb]/10 hover:border-[#2563eb]/40 text-left transition-all text-xs font-semibold text-[#191c1e]"
              >
                Vehicles Registry
              </button>
              <button
                onClick={() => navigate('/fleet-manager/drivers')}
                className="p-3 rounded-xl border border-[#c3c6d7]/40 bg-[#f7f9fb] hover:bg-[#2563eb]/10 hover:border-[#2563eb]/40 text-left transition-all text-xs font-semibold text-[#191c1e]"
              >
                Drivers Roster
              </button>
              <button
                onClick={() => navigate('/fleet-manager/fuel')}
                className="p-3 rounded-xl border border-[#c3c6d7]/40 bg-[#f7f9fb] hover:bg-[#2563eb]/10 hover:border-[#2563eb]/40 text-left transition-all text-xs font-semibold text-[#191c1e]"
              >
                Fuel Records
              </button>
              <button
                onClick={() => navigate('/fleet-manager/reports')}
                className="p-3 rounded-xl border border-[#c3c6d7]/40 bg-[#f7f9fb] hover:bg-[#2563eb]/10 hover:border-[#2563eb]/40 text-left transition-all text-xs font-semibold text-[#191c1e]"
              >
                Fleet Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
