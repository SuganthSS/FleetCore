export interface DashboardOverviewResult {
  fleet: {
    totalVehicles: number;
    activeVehicles: number;
    inactiveVehicles: number;
    maintenanceVehicles: number;
  };
  drivers: {
    totalDrivers: number;
    activeDrivers: number;
    inactiveDrivers: number;
  };
  shipments: {
    totalShipments: number;
    pending: number;
    inTransit: number;
    delivered: number;
    cancelled: number;
  };
  trips: {
    totalTrips: number;
    planned: number;
    active: number;
    completed: number;
    cancelled: number;
  };
  maintenance: {
    totalRecords: number;
    scheduled: number;
    inProgress: number;
    completed: number;
    overdue: number;
  };
  fuel: {
    totalRecords: number;
    totalFuelConsumed: number;
    totalFuelCost: number;
  };
  customers: {
    totalCustomers: number;
    activeCustomers: number;
  };
  notifications: {
    unread: number;
    total: number;
  };
}
