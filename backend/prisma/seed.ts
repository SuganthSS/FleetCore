import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting FleetCore initial database seed...');

  // 1. Seed SystemHealthAnchor
  const healthAnchor = await prisma.systemHealthAnchor.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
    },
  });
  console.log('✅ SystemHealthAnchor seeded:', healthAnchor.id);

  // 2. Seed Default Roles (Idempotent upsert by name)
  const defaultRoles = [
    {
      name: 'Super Admin',
      description: 'System administrator with unrestricted global access across all platform resources.',
      isSystem: true,
      permissions: {
        all: true,
        scope: '*',
      },
    },
    {
      name: 'Company Admin',
      description: 'Organization administrator with full management rights within a single tenant company.',
      isSystem: true,
      permissions: {
        company: ['read', 'write', 'delete'],
        users: ['read', 'write', 'delete'],
        drivers: ['read', 'write', 'delete'],
        vehicles: ['read', 'write', 'delete'],
        shipments: ['read', 'write', 'delete'],
        routes: ['read', 'write', 'delete'],
        trips: ['read', 'write', 'delete'],
        fuel: ['read', 'write', 'delete'],
        maintenance: ['read', 'write', 'delete'],
        reports: ['read', 'export'],
      },
    },
    {
      name: 'Fleet Manager',
      description: 'Fleet operations manager managing vehicles, drivers, maintenance, and fuel tracking.',
      isSystem: true,
      permissions: {
        vehicles: ['read', 'write'],
        drivers: ['read', 'write'],
        trips: ['read', 'write'],
        fuel: ['read', 'write'],
        maintenance: ['read', 'write'],
        reports: ['read'],
      },
    },
    {
      name: 'Dispatcher',
      description: 'Operational dispatcher managing shipments, routes, and trip assignments.',
      isSystem: true,
      permissions: {
        shipments: ['read', 'write'],
        routes: ['read', 'write'],
        trips: ['read', 'write'],
        vehicles: ['read'],
        drivers: ['read'],
      },
    },
    {
      name: 'Driver',
      description: 'Operational driver executing trips, recording fuel events, and location updates.',
      isSystem: true,
      permissions: {
        trips: ['read', 'update_status'],
        fuel: ['write'],
        location: ['write'],
        notifications: ['read'],
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
    console.log(`✅ Role seeded: ${role.name} (${role.id})`);
  }

  // 3. Seed Default Demo Company
  const defaultCompany = await prisma.company.upsert({
    where: { registrationNumber: 'DEMO-FC-2026' },
    update: {
      name: 'FleetCore Demo Company',
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
      name: 'FleetCore Demo Company',
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
  console.log(`✅ Company seeded: ${defaultCompany.name} (${defaultCompany.id})`);

  // 4. Seed Administrator User
  const adminEmail = 'admin@fleetcore.demo';
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Admin@FleetCore2026!', salt);

  const superAdminRoleId = seededRoles['Super Admin'];

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      firstName: 'FleetCore',
      lastName: 'Administrator',
      passwordHash,
      companyId: defaultCompany.id,
      roleId: superAdminRoleId,
      department: 'Executive Administration',
      designation: 'Super Administrator',
      emailVerified: true,
    },
    create: {
      firstName: 'FleetCore',
      lastName: 'Administrator',
      email: adminEmail,
      phone: '+1-800-555-0100',
      passwordHash,
      companyId: defaultCompany.id,
      roleId: superAdminRoleId,
      department: 'Executive Administration',
      designation: 'Super Administrator',
      emailVerified: true,
    },
  });

  console.log(`✅ Administrator User seeded: ${adminUser.email} (${adminUser.id})`);

  console.log('🎉 FleetCore initial seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
