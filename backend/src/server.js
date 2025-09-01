import express from 'express';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import { clerkMiddleware } from '@clerk/express';
import { serve } from 'inngest/express';
//import { inngest, functions } from './inngest/setup.js'; // Adjust if needed
// ...existing code...
import { inngest, functions } from './config/inngest.js';
// ...existing code...

const app = express();
app.use(express.json());

// Middleware
app.use(clerkMiddleware());

// Inngest route
app.use('/api/inngest', serve({ client: inngest, functions }));

// Root route
app.get('/', (req, res) => {
  res.send('Hello World!123456789');
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => {
      console.log(`🚀 Server is running on port: ${ENV.PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();


export default app;