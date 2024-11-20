import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import taskRoutes from './routes/tasks';
import { mockDb } from './db/mockDb';

const app = express();
const port = process.env.PORT || 5000;

// Initialize database
let useLocalDb = false;

const initializeDatabase = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.log('Falling back to mock database');
    useLocalDb = true;
  }
};

initializeDatabase();

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Middleware to handle database selection
app.use((req, res, next) => {
  if (useLocalDb) {
    // Attach mockDb to request
    (req as any).db = mockDb;
  }
  next();
});

// Routes
app.use('/api/tasks', taskRoutes);

app.listen(port, () => {
  console.log(`Server running in development mode on port ${port}`);
  console.log(`CORS enabled for origin: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
});