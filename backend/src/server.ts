import app from './app';
import { connectDB } from './config/db';
import './models';
import { env } from './config/env';

async function startServer(): Promise<void> {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`🚀 Internova API running on http://localhost:${env.PORT}`);
    console.log(`   Environment: ${env.NODE_ENV}`);
    console.log(`   Health: http://localhost:${env.PORT}/api/health`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
