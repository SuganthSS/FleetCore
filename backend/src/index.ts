import express, { Application } from 'express';
import http from 'http';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { config } from './config/env';
import { logger } from './utils/logger';
import { errorHandler } from './middlewares/errorHandler';
import healthRoutes from './routes/health.routes';
import { authRoutes } from './modules/auth';
import { vehicleRoutes } from './modules/vehicle';
import { driverRoutes } from './modules/driver';
import { customerRoutes } from './modules/customer';
import { shipmentRoutes } from './modules/shipment';
import { routeRoutes } from './modules/route';
import { tripRoutes } from './modules/trip';
import { fuelRoutes } from './modules/fuel';
import { maintenanceRoutes } from './modules/maintenance';
import { trackingRoutes } from './modules/tracking';
import { notificationRoutes } from './modules/notification';
import { dashboardRoutes } from './modules/dashboard';
import { initSocket } from './socket';

const app: Application = express();
const server = http.createServer(app);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Swagger documentation placeholder
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'FleetCore API',
    version: '1.0.0',
    description: 'FleetCore Fleet Management Platform Backend API Specs',
  },
  paths: {},
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/v1', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/drivers', driverRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/shipments', shipmentRoutes);
app.use('/api/v1/routes', routeRoutes);
app.use('/api/v1/trips', tripRoutes);
app.use('/api/v1/fuel', fuelRoutes);
app.use('/api/v1/maintenance', maintenanceRoutes);
app.use('/api/v1/tracking', trackingRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Socket initialization
initSocket(server);

const PORT = config.port;

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} in ${config.nodeEnv} mode`);
  });
}

export { app, server };
