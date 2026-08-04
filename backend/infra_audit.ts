import { prisma } from './src/config/database';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

async function runAudit() {
  console.log('=== PART 1: NEON DATABASE AUDIT ===');
  
  // 1. Roles
  const roles = await prisma.role.findMany({ select: { id: true, name: true } });
  console.log(`Roles Count: ${roles.length}`);
  console.log('Roles:', roles.map(r => r.name).join(', '));

  // 2. Core Counts
  const companiesCount = await prisma.company.count();
  const usersCount = await prisma.user.count();
  const vehiclesCount = await prisma.vehicle.count();
  const driversCount = await prisma.driver.count();
  const routesCount = await prisma.route.count();
  const customersCount = await prisma.customer.count();
  const shipmentsCount = await prisma.shipment.count();
  const tripsCount = await prisma.trip.count();
  const fuelLogsCount = await prisma.fuelRecord.count();
  const maintenanceCount = await prisma.maintenanceRecord.count();
  const notificationsCount = await prisma.notification.count();
  const auditLogsCount = await prisma.auditLog.count();

  console.log({
    companiesCount,
    usersCount,
    vehiclesCount,
    driversCount,
    routesCount,
    customersCount,
    shipmentsCount,
    tripsCount,
    fuelLogsCount,
    maintenanceCount,
    notificationsCount,
    auditLogsCount,
  });

  // 3. Orphan check
  const usersWithRole = await prisma.user.count({
    where: { roleId: { equals: '' } }
  });
  console.log(`Users with empty roleId: ${usersWithRole}`);

  console.log('\n=== PART 2: CLOUDINARY AUDIT ===');
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    const testUpload = await cloudinary.uploader.upload('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', {
      folder: 'FleetCore_Test',
      public_id: 'test_asset_audit',
    });
    console.log('✅ Cloudinary Upload Test Success:', testUpload.secure_url);

    const deleteResult = await cloudinary.uploader.destroy(testUpload.public_id);
    console.log('✅ Cloudinary Destroy Test Success:', deleteResult.result);
  } catch (err) {
    console.error('❌ Cloudinary Audit Error:', err);
  }
}

runAudit().finally(() => prisma.$disconnect());
