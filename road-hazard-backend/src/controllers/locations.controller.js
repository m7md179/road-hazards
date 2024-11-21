import { supabase } from '../config/supabase.config.js';

export const locationsController = {
    // Get all locations
    async getAll(req, res) {
        try {
            const { data, error } = await supabase
                .from('location')
                .select('*')
                .order('location_id', { ascending: true });

            if (error) throw error;

            res.json(data);
        } catch (error) {
            console.error('Error fetching locations:', error);
            res.status(500).json({
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    },

    // Create new location
    async create(req, res) {
        try {
            const { latitude, longitude, address } = req.body;

            if (!latitude || !longitude) {
                return res.status(400).json({
                    error: 'latitude and longitude are required'
                });
            }

            if (latitude < -90 || latitude > 90) {
                return res.status(400).json({
                    error: 'latitude must be between -90 and 90'
                });
            }

            if (longitude < -180 || longitude > 180) {
                return res.status(400).json({
                    error: 'longitude must be between -180 and 180'
                });
            }

            const { data, error } = await supabase
                .from('location')
                .insert([{ latitude, longitude, address }])
                .select();

            if (error) throw error;

            res.status(201).json(data);
        } catch (error) {
            console.error('Error creating location:', error);
            res.status(500).json({
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    },

    // Get specific location
    async getById(req, res) {
        try {
            const { id } = req.params;

            const { data, error } = await supabase
                .from('location')
                .select('*')
                .eq('location_id', id)
                .single();

            if (error) throw error;
            if (!data) {
                return res.status(404).json({ error: 'Location not found' });
            }

            res.json(data);
        } catch (error) {
            console.error('Error fetching location:', error);
            res.status(500).json({
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    },

    // Update location
    async update(req, res) {
        try {
            const { id } = req.params;
            const { latitude, longitude, address } = req.body;

            if (latitude !== undefined && (latitude < -90 || latitude > 90)) {
                return res.status(400).json({
                    error: 'latitude must be between -90 and 90'
                });
            }

            if (longitude !== undefined && (longitude < -180 || longitude > 180)) {
                return res.status(400).json({
                    error: 'longitude must be between -180 and 180'
                });
            }

            const { data, error } = await supabase
                .from('location')
                .update({ latitude, longitude, address })
                .eq('location_id', id)
                .select();

            if (error) throw error;
            if (!data || data.length === 0) {
                return res.status(404).json({ error: 'Location not found' });
            }

            res.json(data);
        } catch (error) {
            console.error('Error updating location:', error);
            res.status(500).json({
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    },

    // Delete location
    async delete(req, res) {
        try {
            const { id } = req.params;

            const { error } = await supabase
                .from('location')
                .delete()
                .eq('location_id', id);

            if (error) throw error;

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
    }
};