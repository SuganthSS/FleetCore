import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting FleetCore production database seed...');

  // 1. Seed SystemHealthAnchor
  const healthAnchor = await prisma.systemHealthAnchor.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
    },
  });
  console.log('✅ SystemHealthAnchor seeded:', healthAnchor.id);

  // 2. Migrate legacy user-role assignments before cleanup
  const adminRole = await prisma.role.findFirst({ where: { name: 'Administrator' } });
  const fleetManagerRole = await prisma.role.findFirst({ where: { name: 'Fleet Manager' } });

  const legacyAdminRoles = await prisma.role.findMany({
    where: { name: { in: ['Super Admin', 'Company Admin'] } },
  });
  const maintenanceManagerRole = await prisma.role.findFirst({ where: { name: 'Maintenance Manager' } });

  if (adminRole && legacyAdminRoles.length > 0) {
    const legacyAdminIds = legacyAdminRoles.map((r) => r.id);
    await prisma.user.updateMany({
      where: { roleId: { in: legacyAdminIds } },
      data: { roleId: adminRole.id },
    });
    console.log('✅ Migrated Super Admin and Company Admin users to Administrator role');
  }

  if (fleetManagerRole && maintenanceManagerRole) {
    await prisma.user.updateMany({
      where: { roleId: maintenanceManagerRole.id },
      data: { roleId: fleetManagerRole.id },
    });
    console.log('✅ Migrated Maintenance Manager users to Fleet Manager role');
  }

  // Delete legacy roles completely from DB
  await prisma.role.deleteMany({
    where: { name: { in: ['Super Admin', 'Company Admin', 'Maintenance Manager'] } },
  });
  console.log('✅ Removed legacy roles from database');

  // 3. Seed Simplified 5 Default Roles
  const defaultRoles = [
    {
      name: 'Administrator',
      description: 'Platform administrator with full unrestricted access to system configuration, user management, and organizational resources.',
      isSystem: true,
      permissions: {
        Dashboard: ['Manage'],
        Users: ['Manage'],
        Vehicles: ['Manage'],
        Drivers: ['Manage'],
        Trips: ['Manage'],
        Routes: ['Manage'],
        Shipments: ['Manage'],
        Fuel: ['Manage'],
        Maintenance: ['Manage'],
        Tracking: ['Manage'],
        Notifications: ['Manage'],
        Reports: ['Manage'],
        Analytics: ['Manage'],
        AI: ['Manage'],
        Settings: ['Manage'],
        Documents: ['Manage'],
        'Audit Logs': ['Manage'],
      },
    },
    {
      name: 'Fleet Manager',
      description: 'Fleet operations & maintenance manager managing vehicles, drivers, fuel, maintenance work orders, tracking, and operational analytics.',
      isSystem: true,
      permissions: {
        Vehicles: ['View', 'Create', 'Edit', 'Delete'],
        Drivers: ['View', 'Create', 'Edit', 'Delete'],
        Fuel: ['View', 'Create', 'Edit', 'Delete'],
        Maintenance: ['View', 'Create', 'Edit', 'Delete'],
        Tracking: ['View', 'Create', 'Edit'],
        Reports: ['View', 'Export'],
        Analytics: ['View'],
      },
    },
    {
      name: 'Dispatcher',
      description: 'Operational dispatcher managing trips, routes, shipments, tracking, and notifications.',
      isSystem: true,
      permissions: {
        Trips: ['View', 'Create', 'Edit', 'Delete'],
        Routes: ['View', 'Create', 'Edit', 'Delete'],
        Shipments: ['View', 'Create', 'Edit', 'Delete'],
        Tracking: ['View', 'Create', 'Edit'],
        Notifications: ['View', 'Create', 'Edit'],
      },
    },
    {
      name: 'Accountant',
      description: 'Financial officer managing fuel logs, financial reports, and cost analytics.',
      isSystem: true,
      permissions: {
        Fuel: ['View', 'Create', 'Edit', 'Delete'],
        Reports: ['View', 'Export'],
        Analytics: ['View'],
      },
    },
    {
      name: 'Driver',
      description: 'Operational driver executing assigned trips, logging fuel events, and updating live location.',
      isSystem: true,
      permissions: {
        Trips: ['View', 'Edit'],
        Fuel: ['Create'],
        Tracking: ['Create', 'Edit'],
        Settings: ['View', 'Edit'],
      },
    },
  ];

  const seededRoles: Record<string, string> = {};
  for (const roleData of defaultRoles) {
    const role = await prisma.role.upsert({
      where: { name: roleData.name },
      update: {
        description: roleData.description,
        isSystem: roleData.isSystem,
        permissions: roleData.permissions,
      },
      create: roleData,
    });
    seededRoles[roleData.name] = role.id;
  }
  console.log(`✅ Roles seeded: ${Object.keys(seededRoles).length}`);

  // 4. Seed Default Demo Company
  const defaultCompany = await prisma.company.upsert({
    where: { registrationNumber: 'DEMO-FC-2026' },
    update: {
      name: 'FleetCore Logistics',
      legalName: 'FleetCore Logistics Inc.',
      email: 'admin@fleetcore.demo',
      phone: '+1-800-555-0199',
      address: '100 FleetCore Boulevard',
      city: 'Austin',
      state: 'TX',
      country: 'USA',
      postalCode: '78701',
      website: 'https://fleetcore.demo',
    },
    create: {
      name: 'FleetCore Logistics',
      legalName: 'FleetCore Logistics Inc.',
      registrationNumber: 'DEMO-FC-2026',
      taxNumber: 'TX-998877665',
      email: 'admin@fleetcore.demo',
      phone: '+1-800-555-0199',
      address: '100 FleetCore Boulevard',
      city: 'Austin',
      state: 'TX',
      country: 'USA',
      postalCode: '78701',
      logoUrl: 'https://fleetcore.demo/assets/logo.png',
      website: 'https://fleetcore.demo',
    },
  });
  console.log(`✅ Company seeded: ${defaultCompany.name}`);

  // 5. Seed Canonical Users
  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash('Admin@123', salt);
  const fleetPasswordHash = await bcrypt.hash('Fleet@123', salt);
  const dispatchPasswordHash = await bcrypt.hash('Dispatch@123', salt);
  const driverPasswordHash = await bcrypt.hash('Driver@123', salt);
  const accountPasswordHash = await bcrypt.hash('Account@123', salt);

  const canonicalUsersData = [
    {
      firstName: 'Fleet',
      lastName: 'Administrator',
      email: 'admin@fleetcore.com',
      passwordHash: adminPasswordHash,
      roleName: 'Administrator',
      department: 'Executive Administration',
      designation: 'System Administrator',
    },
    {
      firstName: 'Fleet',
      lastName: 'Manager',
      email: 'fleetmanager@fleetcore.com',
      passwordHash: fleetPasswordHash,
      roleName: 'Fleet Manager',
      department: 'Fleet Operations',
      designation: 'Fleet Operations Manager',
    },
    {
      firstName: 'Dispatcher',
      lastName: 'User',
      email: 'dispatcher@fleetcore.com',
      passwordHash: dispatchPasswordHash,
      roleName: 'Dispatcher',
      department: 'Logistics & Dispatch',
      designation: 'Head Dispatcher',
    },
    {
      firstName: 'Fleet',
      lastName: 'Driver',
      email: 'driver@fleetcore.com',
      passwordHash: driverPasswordHash,
      roleName: 'Driver',
      department: 'Operations',
      designation: 'Professional Driver',
    },
    {
      firstName: 'Fleet',
      lastName: 'Accountant',
      email: 'accountant@fleetcore.com',
      passwordHash: accountPasswordHash,
      roleName: 'Accountant',
      department: 'Finance & Accounting',
      designation: 'Senior Fleet Accountant',
    },
  ];

  const canonicalEmails = canonicalUsersData.map(u => u.email);
  const seededUsers: Record<string, any> = {};

  for (const staff of canonicalUsersData) {
    const user = await prisma.user.upsert({
      where: { email: staff.email },
      update: {
        firstName: staff.firstName,
        lastName: staff.lastName,
        passwordHash: staff.passwordHash,
        companyId: defaultCompany.id,
        roleId: seededRoles[staff.roleName],
        department: staff.department,
        designation: staff.designation,
        emailVerified: true,
        status: 'ACTIVE',
        phone: '+1-800-555-0100',
        avatarUrl: 'https://fleetcore.demo/assets/avatar-placeholder.png',
      },
      create: {
        firstName: staff.firstName,
        lastName: staff.lastName,
        email: staff.email,
        phone: '+1-800-555-0100',
        passwordHash: staff.passwordHash,
        companyId: defaultCompany.id,
        roleId: seededRoles[staff.roleName],
        department: staff.department,
        designation: staff.designation,
        emailVerified: true,
        status: 'ACTIVE',
        avatarUrl: 'https://fleetcore.demo/assets/avatar-placeholder.png',
      },
    });
    seededUsers[staff.roleName] = user;
    console.log(`✅ Canonical User seeded (${staff.roleName}): ${user.email}`);
  }

  const adminUserId = seededUsers['Administrator'].id;
  const canonicalDriverId = seededUsers['Driver'].id;

  // Migrate foreign keys referencing existing non-canonical users
  const legacyUsers = await prisma.user.findMany({
    where: { email: { notIn: canonicalEmails } }
  });
  
  if (legacyUsers.length > 0) {
    const legacyUserIds = legacyUsers.map(u => u.id);
    
    // Migrate notifications to Admin
    await prisma.notification.updateMany({
      where: { userId: { in: legacyUserIds } },
      data: { userId: adminUserId },
    });
    
    // Set Driver userIds to NULL
    await prisma.driver.updateMany({
      where: { userId: { in: legacyUserIds } },
      data: { userId: null },
    });

    // Migrate Audit Logs to Admin
    await prisma.auditLog.updateMany({
      where: { userId: { in: legacyUserIds } },
      data: { userId: adminUserId },
    });
    
    // Delete the legacy users
    const deleteResult = await prisma.user.deleteMany({
      where: { id: { in: legacyUserIds } },
    });
    console.log(`✅ Deleted ${deleteResult.count} legacy users.`);
  }

  // 6. Seed Drivers
  const driverData = [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@fleetcore.demo',
      phone: '+1-555-0111',
      employeeId: 'DRV-001',
      licenseNumber: 'DL-99887766',
      experienceLevel: 'SENIOR' as const,
      licenseExpiry: new Date('2030-05-15'),
    },
    {
      firstName: 'Robert',
      lastName: 'Smith',
      email: 'robert.smith@fleetcore.demo',
      phone: '+1-555-0122',
      employeeId: 'DRV-002',
      licenseNumber: 'DL-55443322',
      experienceLevel: 'MID' as const,
      licenseExpiry: new Date('2029-10-22'),
    },
    {
      firstName: 'Michael',
      lastName: 'Johnson',
      email: 'michael.j@fleetcore.demo',
      phone: '+1-555-0133',
      employeeId: 'DRV-003',
      licenseNumber: 'DL-11223344',
      experienceLevel: 'EXPERT' as const,
      licenseExpiry: new Date('2032-01-12'),
    },
  ];

  const seededDrivers = [];

  for (let i = 0; i < driverData.length; i++) {
    const item = driverData[i];
    const driverUserId = i === 0 ? canonicalDriverId : null;

    const driver = await prisma.driver.upsert({
      where: { employeeId: item.employeeId },
      update: {
        experienceLevel: item.experienceLevel,
        availability: 'AVAILABLE',
        licenseNumber: item.licenseNumber,
        licenseExpiry: item.licenseExpiry,
        joiningDate: new Date('2025-01-01'),
        emergencyContactName: 'Emergency Contact',
        emergencyContactPhone: '+1-555-9999',
        userId: driverUserId,
      },
      create: {
        employeeId: item.employeeId,
        experienceLevel: item.experienceLevel,
        availability: 'AVAILABLE',
        licenseNumber: item.licenseNumber,
        licenseExpiry: item.licenseExpiry,
        joiningDate: new Date('2025-01-01'),
        emergencyContactName: 'Emergency Contact',
        emergencyContactPhone: '+1-555-9999',
        userId: driverUserId,
        companyId: defaultCompany.id,
      },
    });

    seededDrivers.push(driver);
  }
  console.log(`✅ Drivers seeded: ${seededDrivers.length}`);

  // 7. Seed Vehicles
  const vehicleData = [
    {
      registrationNumber: 'TX-FL-100',
      vin: '1FM5K8D8XGD29831',
      make: 'Volvo',
      model: 'FH16 Semi-Truck',
      manufacturingYear: 2023,
      vehicleType: 'TRUCK' as const,
      fuelType: 'DIESEL' as const,
      capacity: 36000,
    },
    {
      registrationNumber: 'TX-FL-200',
      vin: '1FM5K8D8XGD29832',
      make: 'Ford',
      model: 'Transit Cargo Van',
      manufacturingYear: 2024,
      vehicleType: 'VAN' as const,
      fuelType: 'PETROL' as const,
      capacity: 4500,
    },
    {
      registrationNumber: 'TX-FL-300',
      vin: '1FM5K8D8XGD29833',
      make: 'Scania',
      model: 'Streamline Trailer',
      manufacturingYear: 2022,
      vehicleType: 'TRAILER' as const,
      fuelType: 'DIESEL' as const,
      capacity: 40000,
    },
  ];

  const seededVehicles = [];
  for (const item of vehicleData) {
    const vehicle = await prisma.vehicle.upsert({
      where: { registrationNumber: item.registrationNumber },
      update: {
        vin: item.vin,
        make: item.make,
        model: item.model,
        manufacturingYear: item.manufacturingYear,
        vehicleType: item.vehicleType,
        fuelType: item.fuelType,
        capacity: item.capacity,
        status: 'AVAILABLE',
      },
      create: {
        registrationNumber: item.registrationNumber,
        vin: item.vin,
        make: item.make,
        model: item.model,
        manufacturingYear: item.manufacturingYear,
        vehicleType: item.vehicleType,
        fuelType: item.fuelType,
        capacity: item.capacity,
        status: 'AVAILABLE',
        companyId: defaultCompany.id,
      },
    });
    seededVehicles.push(vehicle);
  }
  console.log(`✅ Vehicles seeded: ${seededVehicles.length}`);

  // 8. Seed Customers
  const customerData = [
    {
      customerCode: 'CUST-ACME',
      companyName: 'Acme Corp Industrial',
      contactPerson: 'Alice Watterson',
      email: 'logistics@acme.com',
      phone: '+1-555-1234',
      address: '400 Industrial Way',
      city: 'Austin',
      state: 'TX',
      country: 'USA',
      postalCode: '78704',
    },
    {
      customerCode: 'CUST-GLOBAL',
      companyName: 'Global Trade & Logistics',
      contactPerson: 'George Miller',
      email: 'shipping@globaltrade.com',
      phone: '+1-555-5678',
      address: '150 Shipping Lane',
      city: 'Houston',
      state: 'TX',
      country: 'USA',
      postalCode: '77002',
    },
    {
      customerCode: 'CUST-TECH',
      companyName: 'Tech Solutions Hardware',
      contactPerson: 'Sarah Jenkins',
      email: 'hardware-supply@techsol.com',
      phone: '+1-555-9012',
      address: '1200 Silicon Hills Blvd',
      city: 'Austin',
      state: 'TX',
      country: 'USA',
      postalCode: '78759',
    },
  ];

  const seededCustomers = [];
  for (const item of customerData) {
    const customer = await prisma.customer.upsert({
      where: { customerCode: item.customerCode },
      update: {
        companyName: item.companyName,
        contactPerson: item.contactPerson,
        email: item.email,
        phone: item.phone,
        address: item.address,
        city: item.city,
        state: item.state,
        country: item.country,
        postalCode: item.postalCode,
      },
      create: {
        customerCode: item.customerCode,
        companyName: item.companyName,
        contactPerson: item.contactPerson,
        email: item.email,
        phone: item.phone,
        address: item.address,
        city: item.city,
        state: item.state,
        country: item.country,
        postalCode: item.postalCode,
        companyId: defaultCompany.id,
      },
    });
    seededCustomers.push(customer);
  }
  console.log(`✅ Customers seeded: ${seededCustomers.length}`);

  // 9. Seed Shipments & Routes
  const shipmentData = [
    {
      shipmentNumber: 'SHP-1001',
      title: 'Perishable Grocery Batch',
      description: 'Refrigerated grocery transport for Austin superstores.',
      cargoType: 'Groceries (Refrigerated)',
      weight: 12000,
      volume: 45,
      quantity: 120,
      pickupAddress: '150 Shipping Lane',
      pickupCity: 'Houston',
      pickupState: 'TX',
      pickupCountry: 'USA',
      pickupPostalCode: '77002',
      deliveryAddress: '400 Industrial Way',
      deliveryCity: 'Austin',
      deliveryState: 'TX',
      deliveryCountry: 'USA',
      deliveryPostalCode: '78704',
      priority: 'HIGH' as const,
      routeCode: 'RTE-HOU-AUS',
      plannedDistance: 260,
      estimatedDuration: 180,
    },
    {
      shipmentNumber: 'SHP-1002',
      title: 'Silicon Semiconductor Plates',
      description: 'Secure, temperature-regulated micro-components.',
      cargoType: 'Semiconductors',
      weight: 2500,
      volume: 8,
      quantity: 50,
      pickupAddress: '1200 Silicon Hills Blvd',
      pickupCity: 'Austin',
      pickupState: 'TX',
      pickupCountry: 'USA',
      pickupPostalCode: '78759',
      deliveryAddress: '400 Industrial Way',
      deliveryCity: 'Austin',
      deliveryState: 'TX',
      deliveryCountry: 'USA',
      deliveryPostalCode: '78704',
      priority: 'URGENT' as const,
      routeCode: 'RTE-AUS-INT',
      plannedDistance: 25,
      estimatedDuration: 30,
    },
    {
      shipmentNumber: 'SHP-1003',
      title: 'Automotive Spare Parts',
      description: 'Bulk spare tire & rim packages.',
      cargoType: 'Auto Parts',
      weight: 8000,
      volume: 30,
      quantity: 300,
      pickupAddress: '150 Shipping Lane',
      pickupCity: 'Houston',
      pickupState: 'TX',
      pickupCountry: 'USA',
      pickupPostalCode: '77002',
      deliveryAddress: '1200 Silicon Hills Blvd',
      deliveryCity: 'Austin',
      deliveryState: 'TX',
      deliveryCountry: 'USA',
      deliveryPostalCode: '78759',
      priority: 'MEDIUM' as const,
      routeCode: 'RTE-HOU-NTH',
      plannedDistance: 280,
      estimatedDuration: 195,
    },
  ];

  const seededShipments = [];
  const seededRoutes = [];

  for (let i = 0; i < shipmentData.length; i++) {
    const item = shipmentData[i];
    const customer = seededCustomers[i % seededCustomers.length];

    const shipment = await prisma.shipment.upsert({
      where: { shipmentNumber: item.shipmentNumber },
      update: {
        title: item.title,
        description: item.description,
        cargoType: item.cargoType,
        weight: item.weight,
        volume: item.volume,
        quantity: item.quantity,
        pickupAddress: item.pickupAddress,
        pickupCity: item.pickupCity,
        pickupState: item.pickupState,
        pickupCountry: item.pickupCountry,
        pickupPostalCode: item.pickupPostalCode,
        deliveryAddress: item.deliveryAddress,
        deliveryCity: item.deliveryCity,
        deliveryState: item.deliveryState,
        deliveryCountry: item.deliveryCountry,
        deliveryPostalCode: item.deliveryPostalCode,
        priority: item.priority,
        status: 'DISPATCHED',
      },
      create: {
        shipmentNumber: item.shipmentNumber,
        title: item.title,
        description: item.description,
        cargoType: item.cargoType,
        weight: item.weight,
        volume: item.volume,
        quantity: item.quantity,
        pickupAddress: item.pickupAddress,
        pickupCity: item.pickupCity,
        pickupState: item.pickupState,
        pickupCountry: item.pickupCountry,
        pickupPostalCode: item.pickupPostalCode,
        deliveryAddress: item.deliveryAddress,
        deliveryCity: item.deliveryCity,
        deliveryState: item.deliveryState,
        deliveryCountry: item.deliveryCountry,
        deliveryPostalCode: item.deliveryPostalCode,
        priority: item.priority,
        status: 'DISPATCHED',
        customerId: customer.id,
        companyId: defaultCompany.id,
      },
    });
    seededShipments.push(shipment);

    const route = await prisma.route.upsert({
      where: { routeCode: item.routeCode },
      update: {
        originAddress: item.pickupAddress,
        originCity: item.pickupCity,
        originState: item.pickupState,
        originCountry: item.pickupCountry,
        destinationAddress: item.deliveryAddress,
        destinationCity: item.deliveryCity,
        destinationState: item.deliveryState,
        destinationCountry: item.deliveryCountry,
        plannedDistance: item.plannedDistance,
        estimatedDuration: item.estimatedDuration,
        status: 'ACTIVE',
      },
      create: {
        routeCode: item.routeCode,
        originAddress: item.pickupAddress,
        originCity: item.pickupCity,
        originState: item.pickupState,
        originCountry: item.pickupCountry,
        destinationAddress: item.deliveryAddress,
        destinationCity: item.deliveryCity,
        destinationState: item.deliveryState,
        destinationCountry: item.deliveryCountry,
        plannedDistance: item.plannedDistance,
        estimatedDuration: item.estimatedDuration,
        status: 'ACTIVE',
        shipmentId: shipment.id,
        companyId: defaultCompany.id,
      },
    });
    seededRoutes.push(route);
  }
  console.log(`✅ Shipments seeded: ${seededShipments.length}`);
  console.log(`✅ Routes seeded: ${seededRoutes.length}`);

  // 10. Seed Trips
  const tripData = [
    {
      tripNumber: 'TRP-9001',
      status: 'IN_TRANSIT' as const,
      remarks: 'En-route following I-10 Westbound.',
    },
    {
      tripNumber: 'TRP-9002',
      status: 'COMPLETED' as const,
      remarks: 'Safe delivery confirmed, customer signed bill of lading.',
    },
    {
      tripNumber: 'TRP-9003',
      status: 'SCHEDULED' as const,
      remarks: 'Driver briefing complete.',
    },
  ];

  const seededTrips = [];
  for (let i = 0; i < tripData.length; i++) {
    const item = tripData[i];
    const driver = seededDrivers[i % seededDrivers.length];
    const vehicle = seededVehicles[i % seededVehicles.length];
    const shipment = seededShipments[i % seededShipments.length];
    const route = seededRoutes[i % seededRoutes.length];

    const trip = await prisma.trip.upsert({
      where: { tripNumber: item.tripNumber },
      update: {
        status: item.status,
        remarks: item.remarks,
        actualDistance: item.status === 'COMPLETED' ? route.plannedDistance : undefined,
        actualDuration: item.status === 'COMPLETED' ? route.estimatedDuration : undefined,
        actualStartTime: item.status !== 'SCHEDULED' ? new Date() : undefined,
        actualEndTime: item.status === 'COMPLETED' ? new Date() : undefined,
      },
      create: {
        tripNumber: item.tripNumber,
        status: item.status,
        remarks: item.remarks,
        companyId: defaultCompany.id,
        driverId: driver.id,
        vehicleId: vehicle.id,
        shipmentId: shipment.id,
        routeId: route.id,
        scheduledStartTime: new Date(),
        scheduledEndTime: new Date(Date.now() + 86400000),
      },
    });
    seededTrips.push(trip);
  }
  console.log(`✅ Trips seeded: ${seededTrips.length}`);

  // 11. Seed Fuel Records
  const seededFuelRecords = [];
  for (let i = 0; i < seededTrips.length; i++) {
    const trip = seededTrips[i];
    const vehicle = seededVehicles[i % seededVehicles.length];
    const driver = seededDrivers[i % seededDrivers.length];

    const record = await prisma.fuelRecord.upsert({
      where: { fuelRecordNumber: `REC-FUEL-00${i + 1}` },
      update: {
        quantity: 150.5,
        pricePerUnit: 3.85,
        totalCost: 579.43,
        odometerReading: 120500 + i * 1500,
        refueledAt: new Date(),
        notes: 'Refueled full tank, company card used.',
      },
      create: {
        fuelRecordNumber: `REC-FUEL-00${i + 1}`,
        fuelType: 'DIESEL',
        quantity: 150.5,
        pricePerUnit: 3.85,
        totalCost: 579.43,
        odometerReading: 120500 + i * 1500,
        stationName: 'Chevron Austin North',
        stationLocation: 'Austin, TX',
        refueledAt: new Date(),
        notes: 'Refueled full tank, company card used.',
        companyId: defaultCompany.id,
        vehicleId: vehicle.id,
        driverId: driver.id,
        tripId: trip.id,
      },
    });
    seededFuelRecords.push(record);
  }
  console.log(`✅ Fuel Records seeded: ${seededFuelRecords.length}`);

  // 12. Seed Maintenance Records
  const seededMaintenanceRecords = [];
  for (let i = 0; i < seededVehicles.length; i++) {
    const vehicle = seededVehicles[i];
    const driver = seededDrivers[i % seededDrivers.length];

    const record = await prisma.maintenanceRecord.upsert({
      where: { maintenanceRecordNumber: `WO-MTN-100${i + 1}` },
      update: {
        status: 'COMPLETED',
        serviceProvider: 'FleetCore Central Garage',
        description: 'Comprehensive preventative diagnostics, engine tuning, filter replacements.',
        cost: 450,
        odometerReading: 120000,
        notes: 'Vehicles passed all emissions and brake pad tolerances.',
      },
      create: {
        maintenanceRecordNumber: `WO-MTN-100${i + 1}`,
        maintenanceType: 'PREVENTIVE',
        status: 'COMPLETED',
        scheduledDate: new Date(Date.now() - 604800000),
        completedDate: new Date(),
        serviceProvider: 'FleetCore Central Garage',
        description: 'Comprehensive preventative diagnostics, engine tuning, filter replacements.',
        cost: 450,
        odometerReading: 120000,
        nextMaintenanceDate: new Date(Date.now() + 15552000000),
        notes: 'Vehicles passed all emissions and brake pad tolerances.',
        companyId: defaultCompany.id,
        vehicleId: vehicle.id,
        driverId: driver.id,
      },
    });
    seededMaintenanceRecords.push(record);
  }
  console.log(`✅ Maintenance Records seeded: ${seededMaintenanceRecords.length}`);

  // 13. Seed Vehicle Location History
  const activeTrip = seededTrips[0];
  const historyPoints = [
    { latitude: 29.7604, longitude: -95.3698, speed: 0, heading: 0, altitude: 15 },
    { latitude: 29.7891, longitude: -95.5682, speed: 85, heading: 275, altitude: 22 },
    { latitude: 29.8455, longitude: -96.1102, speed: 105, heading: 278, altitude: 48 },
    { latitude: 29.9812, longitude: -96.8812, speed: 108, heading: 279, altitude: 110 },
    { latitude: 30.1512, longitude: -97.4512, speed: 95, heading: 285, altitude: 145 },
  ];

  const seededHistories = [];
  for (let i = 0; i < historyPoints.length; i++) {
    const point = historyPoints[i];
    const rec = await prisma.vehicleLocationHistory.create({
      data: {
        latitude: point.latitude,
        longitude: point.longitude,
        speed: point.speed,
        heading: point.heading,
        altitude: point.altitude,
        recordedAt: new Date(Date.now() - (5 - i) * 1800000),
        companyId: defaultCompany.id,
        vehicleId: activeTrip.vehicleId,
        driverId: activeTrip.driverId,
        tripId: activeTrip.id,
      },
    });
    seededHistories.push(rec);
  }
  console.log(`✅ Vehicle Location History seeded: ${seededHistories.length}`);

  // 14. Seed Notifications
  const adminUser = await prisma.user.findFirstOrThrow({ where: { email: 'admin@fleetcore.com' } });
  const adminId = adminUser.id;
  const canonicalDriver = await prisma.user.findFirstOrThrow({ where: { email: 'driver@fleetcore.com' } });

  const notificationData = [
    { title: 'Trip Dispatched', message: 'Trip TRP-9001 has been dispatched to John Doe.', userId: adminId },
    { title: 'Fuel Threshold Alert', message: 'Vehicle TX-FL-100 recorded unusually high fuel consumption.', userId: adminId },
    { title: 'New Trip Assigned', message: 'You have been assigned to trip TRP-9001.', userId: canonicalDriver.id },
    { title: 'Maintenance Overdue Alert', message: 'Vehicle TX-FL-300 inspection is due in 3 days.', userId: adminId },
    { title: 'System Notice', message: 'System maintenance scheduled for Sunday at 02:00 UTC.', userId: adminId },
  ];

  for (let i = 0; i < notificationData.length; i++) {
    const item = notificationData[i];
    await prisma.notification.create({
      data: {
        title: item.title,
        message: item.message,
        type: 'SYSTEM',
        priority: 'MEDIUM',
        isRead: false,
        companyId: defaultCompany.id,
        userId: item.userId,
      },
    });
  }
  console.log(`✅ Notifications seeded`);

  console.log('🚀 FleetCore Database Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
