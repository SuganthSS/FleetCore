import React from 'react';
import {
  Shield,
  Users,
  Truck,
  UserCheck,
  Map,
  Compass,
  Package,
  Fuel,
  Wrench,
  Navigation,
  Bell,
  FileText,
  TrendingUp,
  Bot,
  Settings,
  Activity,
} from 'lucide-react';

interface ModuleBadgeProps {
  module: string;
}

export const ModuleBadge: React.FC<ModuleBadgeProps> = ({ module }) => {
  const getModuleIcon = (mod: string) => {
    const lower = mod.toLowerCase();
    if (lower.includes('auth')) return <Shield className="h-3 w-3 text-purple-600" />;
    if (lower.includes('user')) return <Users className="h-3 w-3 text-blue-600" />;
    if (lower.includes('role')) return <Shield className="h-3 w-3 text-indigo-600" />;
    if (lower.includes('vehicle')) return <Truck className="h-3 w-3 text-emerald-600" />;
    if (lower.includes('driver')) return <UserCheck className="h-3 w-3 text-amber-600" />;
    if (lower.includes('trip')) return <Map className="h-3 w-3 text-teal-600" />;
    if (lower.includes('route')) return <Compass className="h-3 w-3 text-cyan-600" />;
    if (lower.includes('shipment')) return <Package className="h-3 w-3 text-orange-600" />;
    if (lower.includes('fuel')) return <Fuel className="h-3 w-3 text-rose-600" />;
    if (lower.includes('maintenance')) return <Wrench className="h-3 w-3 text-[#004ac6]" />;
    if (lower.includes('tracking')) return <Navigation className="h-3 w-3 text-sky-600" />;
    if (lower.includes('notification')) return <Bell className="h-3 w-3 text-amber-600" />;
    if (lower.includes('report')) return <FileText className="h-3 w-3 text-slate-600" />;
    if (lower.includes('analytics')) return <TrendingUp className="h-3 w-3 text-emerald-600" />;
    if (lower.includes('ai')) return <Bot className="h-3 w-3 text-purple-600" />;
    if (lower.includes('setting')) return <Settings className="h-3 w-3 text-slate-600" />;
    return <Activity className="h-3 w-3 text-slate-500" />;
  };

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#eff4ff] text-[#004ac6] border border-[#c3c6d7] text-[11px] font-semibold">
      {getModuleIcon(module)}
      {module}
    </span>
  );
};
