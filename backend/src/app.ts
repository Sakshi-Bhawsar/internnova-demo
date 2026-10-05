import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import { corsOptions } from './config/cors';
import { env } from './config/env';
import routes from './routes';
import { generalRateLimiter } from './middleware/rateLimit.middleware';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(generalRateLimiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Local file uploads (dev)
app.use('/uploads', express.static(path.join(process.cwd(), env.UPLOAD_DIR)));

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
