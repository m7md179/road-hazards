import { supabase } from '../config/supabase.config.js';

export const hazardTypesController = {
    // Get all hazard types
    async getAll(req, res) {
        try {
            console.log('Fetching all hazard types...');
            
            const { data, error } = await supabase
                .from('hazards')
                .select('*');

            if (error) throw error;

            console.log(`Found ${data?.length || 0} hazard types`);
            res.json(data);
        } catch (error) {
            console.error('Error fetching hazard types:', error);
            res.status(500).json({ 
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    },

    // Create new hazard type
    async create(req, res) {
        try {
            const { hazard_name, description, icon_id, location_id } = req.body;

            if (!hazard_name) {
                return res.status(400).json({ error: 'hazard_name is required' });
            }

            const { data, error } = await supabase
                .from('hazards')
                .insert([{ hazard_name, description, icon_id, location_id }])
                .select();

            if (error) throw error;

            res.status(201).json(data);
        } catch (error) {
            console.error('Error creating hazard type:', error);
            res.status(500).json({ 
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    },

    // Get specific hazard type
    async getById(req, res) {
        try {
            const { id } = req.params;

            const { data, error } = await supabase
                .from('hazards')
                .select('*')
                .eq('hazard_type_id', id)
                .single();

            if (error) throw error;
            if (!data) {
                return res.status(404).json({ error: 'Hazard type not found' });
            }

            res.json(data);
        } catch (error) {
            console.error('Error fetching hazard type:', error);
            res.status(500).json({ 
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    },

    // Update hazard type
    async update(req, res) {
        try {
            const { id } = req.params;
            const { hazard_name, description, icon_id, location_id } = req.body;

            const { data, error } = await supabase
                .from('hazards')
                .update({ hazard_name, description, icon_id, location_id })
                .eq('hazard_type_id', id)
                .select();

            if (error) throw error;
            if (!data || data.length === 0) {
                return res.status(404).json({ error: 'Hazard type not found' });
            }

            res.json(data);
        } catch (error) {
            console.error('Error updating hazard type:', error);
            res.status(500).json({ 
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    },

    // Delete hazard type
    async delete(req, res) {
        try {
            const { id } = req.params;

            const { error } = await supabase
                .from('hazards')
                .delete()
                .eq('hazard_type_id', id);

            if (error) throw error;

            res.json({ 
                message: 'Hazard type deleted successfully',
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error deleting hazard type:', error);
            res.status(500).json({ 
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }
};