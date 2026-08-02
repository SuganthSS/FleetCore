import {
  VehicleStatus,
  DriverAvailability,
  ShipmentStatus,
  TripStatus,
  MaintenanceStatus,
  CustomerStatus,
} from '@prisma/client';
import { prisma } from '../../../config/database';

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

export class DashboardService {
  /**
   * Aggregates read-only analytics statistics across Fleet, Drivers, Shipments, Trips,
   * Maintenance, Fuel, Customers, and Notifications.
   *
   * @param companyId Optional company tenant isolation filter. If omitted, global statistics are computed.
   * @returns DashboardOverviewResult containing aggregated KPI metrics.
   */
  async getDashboardOverview(
    companyId?: string
  ): Promise<DashboardOverviewResult> {
    const tenantWhere = companyId ? { companyId } : {};

    const [
      vehiclesGroup,
      totalVehicles,
      driversGroup,
      totalDrivers,
      shipmentsGroup,
      totalShipments,
      tripsGroup,
      totalTrips,
      maintenanceGroup,
      totalMaintenanceRecords,
      fuelAggregate,
      customersGroup,
      totalCustomers,
      unreadNotifications,
      totalNotifications,
    ] = await Promise.all([
      // Fleet aggregation
      prisma.vehicle.groupBy({
        by: ['status'],
        where: tenantWhere,
        _count: { status: true },
      }),
      prisma.vehicle.count({ where: tenantWhere }),

      // Drivers aggregation
      prisma.driver.groupBy({
        by: ['availability'],
        where: tenantWhere,
        _count: { availability: true },
      }),
      prisma.driver.count({ where: tenantWhere }),

      // Shipments aggregation
      prisma.shipment.groupBy({
        by: ['status'],
        where: tenantWhere,
        _count: { status: true },
      }),
      prisma.shipment.count({ where: tenantWhere }),

      // Trips aggregation
      prisma.trip.groupBy({
        by: ['status'],
        where: tenantWhere,
        _count: { status: true },
      }),
      prisma.trip.count({ where: tenantWhere }),

      // Maintenance aggregation
      prisma.maintenanceRecord.groupBy({
        by: ['status'],
        where: tenantWhere,
        _count: { status: true },
      }),
      prisma.maintenanceRecord.count({ where: tenantWhere }),

      // Fuel aggregation
      prisma.fuelRecord.aggregate({
        where: tenantWhere,
        _count: { id: true },
        _sum: {
          quantity: true,
          totalCost: true,
        },
      }),

      // Customers aggregation
      prisma.customer.groupBy({
        by: ['status'],
        where: tenantWhere,
        _count: { status: true },
      }),
      prisma.customer.count({ where: tenantWhere }),

      // Notifications aggregation
      prisma.notification.count({
        where: {
          ...tenantWhere,
          isRead: false,
        },
      }),
      prisma.notification.count({ where: tenantWhere }),
    ]);

    // Map Vehicle status counts
    const vehicleStatusMap = new Map<string, number>(
      vehiclesGroup.map((item: { status: string; _count: { status: number } }) => [item.status, item._count.status])
    );
    const activeVehicles =
      (vehicleStatusMap.get(VehicleStatus.AVAILABLE) || 0) +
      (vehicleStatusMap.get(VehicleStatus.ON_TRIP) || 0);
    const maintenanceVehicles =
      vehicleStatusMap.get(VehicleStatus.MAINTENANCE) || 0;
    const inactiveVehicles =
      (vehicleStatusMap.get(VehicleStatus.OUT_OF_SERVICE) || 0) +
      (vehicleStatusMap.get(VehicleStatus.DECOMMISSIONED) || 0);

    // Map Driver availability counts
    const driverAvailMap = new Map<string, number>(
      driversGroup.map((item: { availability: string; _count: { availability: number } }) => [item.availability, item._count.availability])
    );
    const activeDrivers =
      (driverAvailMap.get(DriverAvailability.AVAILABLE) || 0) +
      (driverAvailMap.get(DriverAvailability.ON_TRIP) || 0);
    const inactiveDrivers =
      (driverAvailMap.get(DriverAvailability.OFF_DUTY) || 0) +
      (driverAvailMap.get(DriverAvailability.ON_LEAVE) || 0) +
      (driverAvailMap.get(DriverAvailability.SUSPENDED) || 0);

    // Map Shipment status counts
    const shipmentStatusMap = new Map<string, number>(
      shipmentsGroup.map((item: { status: string; _count: { status: number } }) => [item.status, item._count.status])
    );
    const shipmentPending = shipmentStatusMap.get(ShipmentStatus.PENDING) || 0;
    const shipmentInTransit =
      (shipmentStatusMap.get(ShipmentStatus.DISPATCHED) || 0) +
      (shipmentStatusMap.get(ShipmentStatus.IN_TRANSIT) || 0);
    const shipmentDelivered =
      shipmentStatusMap.get(ShipmentStatus.DELIVERED) || 0;
    const shipmentCancelled =
      (shipmentStatusMap.get(ShipmentStatus.CANCELLED) || 0) +
      (shipmentStatusMap.get(ShipmentStatus.FAILED) || 0);

    // Map Trip status counts
    const tripStatusMap = new Map<string, number>(
      tripsGroup.map((item: { status: string; _count: { status: number } }) => [item.status, item._count.status])
    );
    const tripPlanned = tripStatusMap.get(TripStatus.SCHEDULED) || 0;
    const tripActive =
      (tripStatusMap.get(TripStatus.DISPATCHED) || 0) +
      (tripStatusMap.get(TripStatus.IN_TRANSIT) || 0) +
      (tripStatusMap.get(TripStatus.PAUSED) || 0);
    const tripCompleted = tripStatusMap.get(TripStatus.COMPLETED) || 0;
    const tripCancelled =
      (tripStatusMap.get(TripStatus.CANCELLED) || 0) +
      (tripStatusMap.get(TripStatus.FAILED) || 0);

    // Map Maintenance status counts
    const maintenanceStatusMap = new Map<string, number>(
      maintenanceGroup.map((item: { status: string; _count: { status: number } }) => [item.status, item._count.status])
    );
    const maintenanceScheduled =
      maintenanceStatusMap.get(MaintenanceStatus.SCHEDULED) || 0;
    const maintenanceInProgress =
      maintenanceStatusMap.get(MaintenanceStatus.IN_PROGRESS) || 0;
    const maintenanceCompleted =
      maintenanceStatusMap.get(MaintenanceStatus.COMPLETED) || 0;
    const maintenanceOverdue =
      maintenanceStatusMap.get(MaintenanceStatus.OVERDUE) || 0;

    // Map Customer status counts
    const customerStatusMap = new Map<string, number>(
      customersGroup.map((item: { status: string; _count: { status: number } }) => [item.status, item._count.status])
    );
    const activeCustomers =
      customerStatusMap.get(CustomerStatus.ACTIVE) || 0;

    return {
      fleet: {
        totalVehicles,
        activeVehicles,
        inactiveVehicles,
        maintenanceVehicles,
      },
      drivers: {
        totalDrivers,
        activeDrivers,
        inactiveDrivers,
      },
      shipments: {
        totalShipments,
        pending: shipmentPending,
        inTransit: shipmentInTransit,
        delivered: shipmentDelivered,
        cancelled: shipmentCancelled,
      },
      trips: {
        totalTrips,
        planned: tripPlanned,
        active: tripActive,
        completed: tripCompleted,
        cancelled: tripCancelled,
      },
      maintenance: {
        totalRecords: totalMaintenanceRecords,
        scheduled: maintenanceScheduled,
        inProgress: maintenanceInProgress,
        completed: maintenanceCompleted,
        overdue: maintenanceOverdue,
      },
      fuel: {
        totalRecords: fuelAggregate._count.id,
        totalFuelConsumed: fuelAggregate._sum.quantity || 0,
        totalFuelCost: fuelAggregate._sum.totalCost || 0,
      },
      customers: {
        totalCustomers,
        activeCustomers,
      },
      notifications: {
        unread: unreadNotifications,
        total: totalNotifications,
      },
    };
  }
}

export const dashboardService = new DashboardService();
