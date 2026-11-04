import app from './app';
import { connectDB, isDatabaseReady } from './config/database';

const PORT = Number(process.env.PORT || 5000);

const startServer = async () => {
  try {
    await connectDB(false);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Database status: ${isDatabaseReady ? 'connected' : 'mock mode'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
