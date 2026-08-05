import { Request, Response } from 'express';
import { prisma } from '../../../config/database';

export class SearchController {
  async globalSearch(req: Request, res: Response): Promise<void> {
    try {
      const q = (req.query.q as string || '').trim().toLowerCase();
      if (!q) {
        res.status(200).json({ success: true, data: [] });
        return;
      }

      // Parallel search across core entity tables
      const [vehicles, drivers, trips, shipments, customers, users, maintenance, fuel] = await Promise.all([
        prisma.vehicle.findMany({
          where: {
            OR: [
              { registrationNumber: { contains: q, mode: 'insensitive' } },
              { make: { contains: q, mode: 'insensitive' } },
              { model: { contains: q, mode: 'insensitive' } },
            ],
          },
          take: 5,
        }),
        prisma.driver.findMany({
          where: {
            OR: [
              { user: { firstName: { contains: q, mode: 'insensitive' } } },
              { user: { lastName: { contains: q, mode: 'insensitive' } } },
              { licenseNumber: { contains: q, mode: 'insensitive' } },
            ],
          },
          include: { user: true },
          take: 5,
        }),
        prisma.trip.findMany({
          where: {
            OR: [
              { tripNumber: { contains: q, mode: 'insensitive' } },
            ],
          },
          take: 5,
        }),
        prisma.shipment.findMany({
          where: {
            OR: [
              { shipmentNumber: { contains: q, mode: 'insensitive' } },
              { title: { contains: q, mode: 'insensitive' } },
            ],
          },
          take: 5,
        }),
        prisma.customer.findMany({
          where: {
            OR: [
              { companyName: { contains: q, mode: 'insensitive' } },
              { email: { contains: q, mode: 'insensitive' } },
            ],
          },
          take: 5,
        }),
        prisma.user.findMany({
          where: {
            OR: [
              { firstName: { contains: q, mode: 'insensitive' } },
              { lastName: { contains: q, mode: 'insensitive' } },
              { email: { contains: q, mode: 'insensitive' } },
            ],
          },
          take: 5,
        }),
        prisma.maintenanceRecord.findMany({
          where: {
            OR: [
              { description: { contains: q, mode: 'insensitive' } },
            ],
          },
          take: 5,
        }),
        prisma.fuelRecord.findMany({
          where: {
            OR: [
              { stationLocation: { contains: q, mode: 'insensitive' } },
            ],
          },
          take: 5,
        }),
      ]);

      const results = [
        ...vehicles.map((v) => ({
          id: v.id,
          category: 'Vehicles',
          title: `${v.make} ${v.model} (${v.registrationNumber})`,
          subtitle: `Status: ${v.status} | Year: ${v.manufacturingYear}`,
          url: `/vehicles/${v.id}`,
        })),
        ...drivers.map((d) => ({
          id: d.id,
          category: 'Drivers',
          title: d.user ? `${d.user.firstName} ${d.user.lastName}` : `Driver ${d.employeeId}`,
          subtitle: `License: ${d.licenseNumber} | Availability: ${d.availability}`,
          url: `/drivers/${d.id}`,
        })),
        ...trips.map((t) => ({
          id: t.id,
          category: 'Trips',
          title: `Trip ${t.tripNumber}`,
          subtitle: `Status: ${t.status}`,
          url: `/trips/${t.id}`,
        })),
        ...shipments.map((s) => ({
          id: s.id,
          category: 'Shipments',
          title: `Shipment ${s.shipmentNumber} - ${s.title}`,
          subtitle: `Status: ${s.status} | Priority: ${s.priority}`,
          url: `/shipments/${s.id}`,
        })),
        ...customers.map((c) => ({
          id: c.id,
          category: 'Customers',
          title: c.companyName,
          subtitle: `Email: ${c.email} | Status: ${c.status}`,
          url: `/customers/${c.id}`,
        })),
        ...users.map((u) => ({
          id: u.id,
          category: 'Users',
          title: `${u.firstName} ${u.lastName}`,
          subtitle: `${u.email}`,
          url: `/users`,
        })),
        ...maintenance.map((m) => ({
          id: m.id,
          category: 'Maintenance',
          title: `Work Order: ${m.id}`,
          subtitle: `Cost: $${m.cost || 0} | Status: ${m.status}`,
          url: `/maintenance`,
        })),
        ...fuel.map((f) => ({
          id: f.id,
          category: 'Fuel Logs',
          title: `Refuel at ${f.stationLocation}`,
          subtitle: `Quantity: ${f.quantity}L | Cost: $${f.totalCost}`,
          url: `/fuel`,
        })),
      ];

      res.status(200).json({
        success: true,
        data: results,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Search error';
      res.status(500).json({ success: false, message });
    }
  }
}

export const searchController = new SearchController();
