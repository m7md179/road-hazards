import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import hazardTypesRoutes from './routes/hazardTypes.routes.js';
import locationsRoutes from './routes/locations.routes.js';
import authRoutes from './routes/auth.routes.js';
import reportsRoutes from './routes/reports.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is running!' });
});

// Routes
app.use('/api/hazard-types', hazardTypesRoutes);
app.use('/api/locations', locationsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportsRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});