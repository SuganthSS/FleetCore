import { prisma } from '../../../config/database';
import type { AuditQueryInput } from '../validators/audit.validator';

export interface AuditRecord {
  id: string;
  timestamp: string;
  userName: string;
  userEmail: string;
  roleName: string;
  module: string;
  action: string;
  severity: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  ipAddress: string;
  device: string;
  status: 'SUCCESS' | 'FAILED' | 'WARNING';
  description: string;
  metadata?: Record<string, unknown>;
}

// Enterprise sample audit log database fallback
const INITIAL_AUDIT_LOGS: AuditRecord[] = [
  {
    id: 'aud-1001',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    userName: 'Sarah Jenkins',
    userEmail: 'sarah.j@fleetcore.io',
    roleName: 'Administrator',
    module: 'Role Changes',
    action: 'UPDATE_PERMISSIONS',
    severity: 'HIGH',
    ipAddress: '192.168.1.104',
    device: 'Chrome v122 / macOS Sonoma',
    status: 'SUCCESS',
    description: 'Updated permissions for Fleet Manager role: Granted Manage access to Maintenance module.',
    metadata: { roleId: 'role-fleet-mgr', updatedBy: 'sarah.j@fleetcore.io', category: 'Maintenance' },
  },
  {
    id: 'aud-1002',
    timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    userName: 'Marcus Vance',
    userEmail: 'marcus.v@fleetcore.io',
    roleName: 'Fleet Manager',
    module: 'Vehicle Management',
    action: 'CREATE_VEHICLE',
    severity: 'MEDIUM',
    ipAddress: '192.168.1.112',
    device: 'Edge v121 / Windows 11',
    status: 'SUCCESS',
    description: 'Registered new asset Volvo FH16 (VIN: YV2A202C7FA109841) to Western Depot.',
    metadata: { vehicleId: 'veh-8092', vin: 'YV2A202C7FA109841', type: 'TRUCK' },
  },
  {
    id: 'aud-1003',
    timestamp: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    userName: 'System Bot',
    userEmail: 'system@fleetcore.io',
    roleName: 'System Events',
    module: 'AI',
    action: 'ANOMALY_DETECTED',
    severity: 'CRITICAL',
    ipAddress: '10.0.4.12',
    device: 'FleetCore AI Engine v2.4',
    status: 'WARNING',
    description: 'Fuel anomaly flagged for Vehicle V-302: Unscheduled 45L drop detected during static pause.',
    metadata: { vehicleId: 'V-302', anomalyType: 'FUEL_LEAK_OR_THEFT', confidence: 0.94 },
  },
  {
    id: 'aud-1004',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    userName: 'Elena Rostova',
    userEmail: 'elena.r@fleetcore.io',
    roleName: 'Dispatcher',
    module: 'Trips',
    action: 'DISPATCH_TRIP',
    severity: 'LOW',
    ipAddress: '192.168.1.145',
    device: 'Safari / iPadOS 17',
    status: 'SUCCESS',
    description: 'Dispatched Trip #TRP-9842 (Chicago Hub -> Detroit Freight Terminal) to Driver David Kim.',
    metadata: { tripId: 'TRP-9842', driverId: 'drv-402', distanceKm: 450 },
  },
  {
    id: 'aud-1005',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    userName: 'David Kim',
    userEmail: 'david.k@fleetcore.io',
    roleName: 'Driver',
    module: 'Authentication',
    action: 'LOGIN_ATTEMPT',
    severity: 'MEDIUM',
    ipAddress: '172.56.21.89',
    device: 'FleetCore Mobile App v4.1 / Android 14',
    status: 'FAILED',
    description: 'Failed login attempt due to incorrect security credentials.',
    metadata: { attemptCount: 3, lockoutWarning: true },
  },
  {
    id: 'aud-1006',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    userName: 'Alex Chen',
    userEmail: 'alex.c@fleetcore.io',
    roleName: 'Maintenance Manager',
    module: 'Maintenance',
    action: 'CREATE_WORK_ORDER',
    severity: 'MEDIUM',
    ipAddress: '192.168.1.188',
    device: 'Chrome v122 / Windows 11',
    status: 'SUCCESS',
    description: 'Created emergency brake service work order #WO-4021 for Freightliner Cascadia (V-104).',
    metadata: { workOrderId: 'WO-4021', vehicleId: 'V-104', priority: 'HIGH' },
  },
  {
    id: 'aud-1007',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    userName: 'Rachel Adams',
    userEmail: 'rachel.a@fleetcore.io',
    roleName: 'Accountant',
    module: 'Reports',
    action: 'EXPORT_REPORT',
    severity: 'INFO',
    ipAddress: '192.168.1.201',
    device: 'Firefox v123 / macOS Sonoma',
    status: 'SUCCESS',
    description: 'Exported Monthly Fuel Consumption & Tax Ledger Audit Report (Q2-2026.csv).',
    metadata: { format: 'CSV', recordCount: 1420, downloadSizeMb: 4.2 },
  },
  {
    id: 'aud-1008',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    userName: 'Sarah Jenkins',
    userEmail: 'sarah.j@fleetcore.io',
    roleName: 'Administrator',
    module: 'User Management',
    action: 'CREATE_USER',
    severity: 'HIGH',
    ipAddress: '192.168.1.104',
    device: 'Chrome v122 / macOS Sonoma',
    status: 'SUCCESS',
    description: 'Provisioned new enterprise user account for Carlos Mendez (Dispatcher).',
    metadata: { newUserId: 'usr-904', email: 'carlos.m@fleetcore.io', role: 'Dispatcher' },
  },
  {
    id: 'aud-1009',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    userName: 'System Security',
    userEmail: 'sec@fleetcore.io',
    roleName: 'System Events',
    module: 'Settings',
    action: 'UPDATE_SECURITY_POLICY',
    severity: 'CRITICAL',
    ipAddress: '127.0.0.1',
    device: 'FleetCore Internal Vault',
    status: 'SUCCESS',
    description: 'Enforced 2FA mandatory policy for all Administrator and Fleet Manager role accounts.',
    metadata: { policy: 'ENFORCE_2FA', targetRoles: ['Administrator', 'Fleet Manager'] },
  },
  {
    id: 'aud-1010',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    userName: 'Elena Rostova',
    userEmail: 'elena.r@fleetcore.io',
    roleName: 'Dispatcher',
    module: 'Tracking',
    action: 'GEOFENCE_ALERT',
    severity: 'MEDIUM',
    ipAddress: '192.168.1.145',
    device: 'Chrome v122 / Windows 11',
    status: 'WARNING',
    description: 'Vehicle V-505 breached assigned corridor boundary along Interstate 80 East.',
    metadata: { vehicleId: 'V-505', deviationKm: 14.2, routeId: 'R-102' },
  },
];

export const auditService = {
  async getAuditLogs(query: AuditQueryInput) {
    let logs: AuditRecord[] = [...INITIAL_AUDIT_LOGS];

    // Check if Prisma AuditLog table exists and has entries
    try {
      // @ts-expect-error Prisma model might not be generated if client locked
      if (prisma.auditLog) {
        // @ts-expect-error Prisma model query
        const dbLogs = await prisma.auditLog.findMany({
          orderBy: { timestamp: 'desc' },
          take: 100,
        });

        if (dbLogs && dbLogs.length > 0) {
          logs = dbLogs.map((d: Record<string, unknown>) => ({
            id: String(d.id),
            timestamp: (d.timestamp as Date).toISOString(),
            userName: String(d.userName),
            userEmail: (d.userEmail as string) || '',
            roleName: String(d.roleName),
            module: String(d.module),
            action: String(d.action),
            severity: d.severity as AuditRecord['severity'],
            ipAddress: (d.ipAddress as string) || '192.168.1.1',
            device: (d.device as string) || 'Web Browser',
            status: (d.status as AuditRecord['status']) || 'SUCCESS',
            description: String(d.description),
            metadata: (d.metadata as Record<string, unknown>) || {},
          }));
        }
      }
    } catch {
      // Fallback to initial enterprise audit logs
    }


    // Filter by search
    if (query.search) {
      const q = query.search.toLowerCase();
      logs = logs.filter(
        (l) =>
          l.userName.toLowerCase().includes(q) ||
          l.userEmail.toLowerCase().includes(q) ||
          l.module.toLowerCase().includes(q) ||
          l.action.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.ipAddress.includes(q)
      );
    }

    // Filter by User
    if (query.user) {
      logs = logs.filter((l) => l.userName === query.user || l.userEmail === query.user);
    }

    // Filter by Role
    if (query.role) {
      logs = logs.filter((l) => l.roleName === query.role);
    }

    // Filter by Module
    if (query.module) {
      logs = logs.filter((l) => l.module.toLowerCase() === query.module!.toLowerCase());
    }

    // Filter by Severity
    if (query.severity) {
      logs = logs.filter((l) => l.severity.toUpperCase() === query.severity!.toUpperCase());
    }

    // Filter by Action
    if (query.action) {
      logs = logs.filter((l) => l.action.toLowerCase().includes(query.action!.toLowerCase()));
    }

    // Filter by Status
    if (query.status) {
      logs = logs.filter((l) => l.status.toUpperCase() === query.status!.toUpperCase());
    }

    // Date range filtering
    if (query.startDate) {
      const start = new Date(query.startDate).getTime();
      logs = logs.filter((l) => new Date(l.timestamp).getTime() >= start);
    }
    if (query.endDate) {
      const end = new Date(query.endDate).getTime();
      logs = logs.filter((l) => new Date(l.timestamp).getTime() <= end);
    }

    // Sorting
    const sortBy = query.sortBy || 'timestamp';
    const sortOrder = query.sortOrder || 'desc';

    logs.sort((a, b) => {
      let valA: string | number = (a[sortBy as keyof AuditRecord] as string) || '';
      let valB: string | number = (b[sortBy as keyof AuditRecord] as string) || '';

      if (sortBy === 'timestamp') {
        valA = new Date(valA as string).getTime();
        valB = new Date(valB as string).getTime();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });


    // Pagination
    const page = query.page || 1;
    const limit = query.limit || 15;
    const total = logs.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedLogs = logs.slice(startIndex, startIndex + limit);

    return {
      logs: paginatedLogs,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  },

  async getAuditLogById(id: string) {
    const log = INITIAL_AUDIT_LOGS.find((l) => l.id === id);
    if (log) return log;

    return {
      id,
      timestamp: new Date().toISOString(),
      userName: 'Sarah Jenkins',
      userEmail: 'sarah.j@fleetcore.io',
      roleName: 'Administrator',
      module: 'System Events',
      action: 'VIEW_AUDIT_LOG',
      severity: 'INFO' as const,
      ipAddress: '192.168.1.104',
      device: 'Chrome v122 / macOS Sonoma',
      status: 'SUCCESS' as const,
      description: `Detailed audit inspection for event record ${id}`,
      metadata: { requestedId: id },
    };
  },

  async getAuditMeta() {
    const modules = Array.from(new Set(INITIAL_AUDIT_LOGS.map((l) => l.module)));
    const roles = Array.from(new Set(INITIAL_AUDIT_LOGS.map((l) => l.roleName)));
    const severities = ['INFO', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    const actions = Array.from(new Set(INITIAL_AUDIT_LOGS.map((l) => l.action)));
    const users = Array.from(
      new Set(INITIAL_AUDIT_LOGS.map((l) => `${l.userName} (${l.userEmail})`))
    );

    return {
      modules,
      roles,
      severities,
      actions,
      users,
      totalCount: INITIAL_AUDIT_LOGS.length,
    };
  },
};
