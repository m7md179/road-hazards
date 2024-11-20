import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const { SUPABASE_URL, SUPABASE_KEY, PORT = 3000 } = process.env;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Error: Missing Supabase credentials in .env.local file');
    process.exit(1);
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is running!' });
});

// Hazards Routes
// Get all hazards
app.get('/api/hazards', async (req, res) => {
    try {
        console.log('Fetching all hazards...');
        
        const { data, error } = await supabase
            .from('hazards')
            .select('*');

        if (error) {
            console.error('Error fetching hazards:', error);
            throw error;
        }

        console.log(`Found ${data?.length || 0} hazards`);
        res.json(data);
    } catch (error) {
        res.status(500).json({ 
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Create new hazard
app.post('/api/hazards', async (req, res) => {
    try {
        const { hazard_name, description, icon_id, location_id } = req.body;

        // Validate required fields
        if (!hazard_name) {
            return res.status(400).json({ 
                error: 'hazard_name is required' 
            });
        }

        console.log('Creating new hazard:', req.body);

        const { data, error } = await supabase
            .from('hazards')
            .insert([{
                hazard_name,
                description,
                icon_id,
                location_id
            }])
            .select();

        if (error) {
            console.error('Error creating hazard:', error);
            throw error;
        }

        console.log('Hazard created successfully:', data);
        res.status(201).json(data);
    } catch (error) {
        console.error('Error in POST /api/hazards:', error);
        res.status(500).json({ 
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Get specific hazard
app.get('/api/hazards/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Fetching hazard with id: ${id}`);

        const { data, error } = await supabase
            .from('hazards')
            .select('*')
            .eq('hazard_type_id', id)
            .single();

        if (error) {
            console.error('Error fetching hazard:', error);
            throw error;
        }

        if (!data) {
            return res.status(404).json({ 
                error: 'Hazard not found' 
            });
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ 
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Update hazard
app.put('/api/hazards/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { hazard_name, description, icon_id, location_id } = req.body;

        console.log(`Updating hazard ${id}:`, req.body);

        const { data, error } = await supabase
            .from('hazards')
            .update({
                hazard_name,
                description,
                icon_id,
                location_id
            })
            .eq('hazard_type_id', id)
            .select();

        if (error) {
            console.error('Error updating hazard:', error);
            throw error;
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ 
                error: 'Hazard not found' 
            });
        }

        console.log('Hazard updated successfully:', data);
        res.json(data);
    } catch (error) {
        res.status(500).json({ 
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Delete hazard
app.delete('/api/hazards/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Deleting hazard with id: ${id}`);

        const { error } = await supabase
            .from('hazards')
            .delete()
            .eq('hazard_type_id', id);

        if (error) {
            console.error('Error deleting hazard:', error);
            throw error;
        }

        res.json({ 
            message: 'Hazard deleted successfully',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ 
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

app.post('/api/location', async (req, res) => {
    try {
        const { latitude, longitude, address } = req.body;

        // Validate required fields
        if (!latitude || !longitude) {
            return res.status(400).json({
                error: 'latitude and longitude are required',
                timestamp: new Date().toISOString()
            });
        }

        // Validate latitude and longitude ranges
        if (latitude < -90 || latitude > 90) {
            return res.status(400).json({
                error: 'latitude must be between -90 and 90',
                timestamp: new Date().toISOString()
            });
        }

        if (longitude < -180 || longitude > 180) {
            return res.status(400).json({
                error: 'longitude must be between -180 and 180',
                timestamp: new Date().toISOString()
            });
        }

        console.log('Creating new location:', { latitude, longitude, address });

        const { data, error } = await supabase
            .from('location')
            .insert([{ latitude, longitude, address }])
            .select();

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }

        console.log('Location created successfully:', data);
        res.status(201).json(data);
    } catch (error) {
        console.error('Error creating location:', error);
        res.status(500).json({
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Get all locations
app.get('/api/location', async (req, res) => {
    try {
        console.log('Fetching all locations...');
        
        const { data, error } = await supabase
            .from('location')
            .select('*')
            .order('location_id', { ascending: true });

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }

        console.log(`Found ${data?.length || 0} locations`);
        res.json(data);
    } catch (error) {
        console.error('Error fetching locations:', error);
        res.status(500).json({
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Get specific location
app.get('/api/location/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Fetching location with id: ${id}`);

        const { data, error } = await supabase
            .from('location')
            .select('*')
            .eq('location_id', id)
            .single();

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }

        if (!data) {
            return res.status(404).json({
                error: 'Location not found',
                timestamp: new Date().toISOString()
            });
        }

        res.json(data);
    } catch (error) {
        console.error('Error fetching location:', error);
        res.status(500).json({
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Update location
app.put('/api/location/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { latitude, longitude, address } = req.body;

        // Validate latitude and longitude if provided
        if (latitude !== undefined && (latitude < -90 || latitude > 90)) {
            return res.status(400).json({
                error: 'latitude must be between -90 and 90',
                timestamp: new Date().toISOString()
            });
        }

        if (longitude !== undefined && (longitude < -180 || longitude > 180)) {
            return res.status(400).json({
                error: 'longitude must be between -180 and 180',
                timestamp: new Date().toISOString()
            });
        }

        console.log(`Updating location ${id}:`, { latitude, longitude, address });

        const { data, error } = await supabase
            .from('location')
            .update({ latitude, longitude, address })
            .eq('location_id', id)
            .select();

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }

        if (!data || data.length === 0) {
            return res.status(404).json({
                error: 'Location not found',
                timestamp: new Date().toISOString()
            });
        }

        console.log('Location updated successfully:', data);
        res.json(data);
    } catch (error) {
        console.error('Error updating location:', error);
        res.status(500).json({
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Delete location
app.delete('/api/location/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Deleting location with id: ${id}`);

        const { error } = await supabase
            .from('location')
            .delete()
            .eq('location_id', id);

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }

        res.json({
            message: 'Location deleted successfully',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error deleting location:', error);
        res.status(500).json({
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});