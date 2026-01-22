import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import requestIp from 'request-ip';
import helmet from 'helmet';
import express, { Request, Response } from 'express';
import { globalErrorHandler, notFound, rateLimiter } from './middlewares';
import { requestLogger } from './logger';
import router from './app/routes';
import { config } from './config/config';
import { corsOptions } from './config/cors.config';

const app = express();

// Middleware setup
app.use(cors(corsOptions)); // CORS
app.use(cookieParser()); // Cookie parsing
app.use(compression()); // Compress responses
app.use(requestIp.mw()); // Extract IP address
app.use(rateLimiter); // Rate limiting
app.use(
  helmet({
    xPoweredBy: false, // Hide Express info
    hsts: { maxAge: 31536000, includeSubDomains: true }, // Enforce HTTPS
    noSniff: true, // Prevent MIME sniffing
    referrerPolicy: { policy: 'no-referrer' }, // Hide referrer info
  }),
); // Apply security headers
app.use(express.json({ limit: '16kb' })); // Limit JSON payload
app.use(requestLogger); // Log requests

// Root route - API status check
app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    message: 'Role Flow API is up and running.',
    environment: config.server.nodeEnv,
    version: 'v1.0.0',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    database: 'connected',
    health: 'Healthy',
    author: {
      name: 'Ibrahim Khalil',
      email: 'iibrahiim.dev@gmail.com',
      website: 'https://iibrahim-dev.vercel.app/',
    },
  });
});

// API routes
app.use('/api', router);

// Error-handling middlewares
app.use(globalErrorHandler); // Global error handler
app.use(notFound); // 404 handler

export default app;
