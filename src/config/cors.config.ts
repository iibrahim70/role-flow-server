import { CorsOptions } from 'cors';
import httpStatus from 'http-status';
import { config } from './config';
import { ApiError } from '@/errors';

const whitelist = config.server.corsOrigin as string;

export const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow server-to-server requests

    if (whitelist?.includes(origin)) {
      callback(null, true);
    } else {
      callback(
        new ApiError(
          httpStatus.FORBIDDEN,
          'CORS request strictly prohibited from this origin',
        ),
      );
    }
  },
  credentials: true,
};
