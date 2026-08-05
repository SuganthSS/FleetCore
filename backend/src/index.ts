import express, { Application } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { config } from './config/env';
import { logger } from './utils/logger';
import { errorHandler } from './middlewares/errorHandler';
import { apiLimiter, aiLimiter } from './middlewares/rateLimit.middleware';
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
import { userRoutes } from './modules/user';
import { roleRoutes } from './modules/role';
import { auditRoutes } from './modules/audit';
import { settingsRoutes } from './modules/settings';
import { aiRoutes } from './modules/ai';
import { searchRoutes } from './modules/search';
import { initSocket } from './socket';

const app: Application = express();
const server = http.createServer(app);

// Trust Proxy for deployment platforms (e.g. Render, Heroku) to ensure rate limiting correctly reads client IP
app.set('trust proxy', 1);

// Security Headers via Helmet
app.use(
  helmet({
    contentSecurityPolicy: false, // Disabled to prevent blocking Swagger UI or frontend SPA assets
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allows cross-origin asset loading for Cloudinary images
  })
);

// Middlewares
const allowedOrigins = Array.from(new Set([
  'http://localhost:3000',
  'http://localhost:5173',
  'https://fleet-core.vercel.app',
  ...(config.frontendUrl ? [config.frontendUrl] : []),
]));

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy error: Origin ${origin} not allowed`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
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

// Health check route (Excluded from global API rate limiter)
app.use('/api/v1', healthRoutes);

// Apply Global API Rate Limiter to all feature endpoints
app.use('/api/v1', apiLimiter);

// Specific Routes
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
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/roles', roleRoutes);
app.use('/api/v1/audit', auditRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/ai', aiLimiter, aiRoutes);
app.use('/api/v1/search', searchRoutes);




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
