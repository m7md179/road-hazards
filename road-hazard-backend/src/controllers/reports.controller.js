import { supabase } from '../config/supabase.config.js';

const reportsController = {
    // Get all reports
    getAll: async (req, res) => {
        try {
            const { data, error } = await supabase
                .from('report')
                .select(`
                    *,
                    users:user_id(*),
                    hazards:hazard_type_id(*),
                    location:location_id(*)
                `)
                .order('report_timestamp', { ascending: false });

            if (error) throw error;

            res.json(data);
        } catch (error) {
            console.error('Error fetching reports:', error);
            res.status(500).json({
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    },

    // Create new report
    create: async (req, res) => {
        try {
            const { 
                hazard_type_id, 
                location_id, 
                speed_at_reporting, 
                reported_where
            } = req.body;

            // Get user_id from authenticated user
            const user_id = req.user.id;

            // Validate required fields
            if (!hazard_type_id || !location_id) {
                return res.status(400).json({
                    error: 'hazard_type_id and location_id are required'
                });
            }

            // Validate hazard_type exists
            const { data: hazardType, error: hazardError } = await supabase
                .from('hazards')
                .select('hazard_type_id')
                .eq('hazard_type_id', hazard_type_id)
                .single();

            if (hazardError || !hazardType) {
                return res.status(400).json({
                    error: 'Invalid hazard_type_id'
                });
            }

            // Validate location exists
            const { data: location, error: locationError } = await supabase
                .from('location')
                .select('location_id')
                .eq('location_id', location_id)
                .single();

            if (locationError || !location) {
                return res.status(400).json({
                    error: 'Invalid location_id'
                });
            }

            // Create report
            const { data, error } = await supabase
                .from('report')
                .insert([{
                    report_timestamp: new Date().toISOString(),
                    user_id,
                    hazard_type_id,
                    location_id,
                    speed_at_reporting,
                    status: 'pending',
                    reported_where
                }])
                .select(`
                    *,
                    users:user_id (*),
                    hazards:hazard_type_id (*),
                    location:location_id (*)
                `)
                .single();

            if (error) {
                console.error('Database error:', error);
                throw error;
            }

            // Update user's total_reports
            const { error: updateError } = await supabase
                .from('users')
                .update({ 
                    total_reports: supabase.rpc('increment_total_reports', { user_row_id: user_id })
                })
                .eq('id', user_id);

            if (updateError) {
                console.error('Error updating total_reports:', updateError);
            }

            res.status(201).json(data);
        } catch (error) {
            console.error('Error creating report:', error);
            res.status(500).json({
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    },

    // Get specific report
    getById: async (req, res) => {
        try {
            const { id } = req.params;

            const { data, error } = await supabase
                .from('report')
                .select(`
                    *,
                    users:user_id(*),
                    hazards:hazard_type_id(*),
                    location:location_id(*)
                `)
                .eq('report_id', id)
                .single();

            if (error) throw error;
            if (!data) {
                return res.status(404).json({ error: 'Report not found' });
            }

            res.json(data);
        } catch (error) {
            console.error('Error fetching report:', error);
            res.status(500).json({
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    },

    // Update report status
    updateStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!['pending', 'validated', 'rejected'].includes(status)) {
                return res.status(400).json({
                    error: 'Invalid status. Must be pending, validated, or rejected'
                });
            }

            const { data, error } = await supabase
                .from('report')
                .update({ status })
                .eq('report_id', id)
                .select()
                .single();

            if (error) throw error;
            if (!data) {
                return res.status(404).json({ error: 'Report not found' });
            }

            res.json(data);
        } catch (error) {
            console.error('Error updating report status:', error);
            res.status(500).json({
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    },

    // Delete report
    delete: async (req, res) => {
        try {
            const { id } = req.params;

            const { error } = await supabase
                .from('report')
                .delete()
                .eq('report_id', id);

            if (error) throw error;

            res.json({
                message: 'Report deleted successfully',
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error deleting report:', error);
            res.status(500).json({
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    },

    // Get reports by user
    getByUser: async (req, res) => {
        try {
            const { userId } = req.params;

            const { data, error } = await supabase
                .from('report')
                .select(`
                    *,
                    hazards:hazard_type_id(*),
                    location:location_id(*)
                `)
                .eq('user_id', userId)
                .order('report_timestamp', { ascending: false });

            if (error) throw error;

            res.json(data);
        } catch (error) {
            console.error('Error fetching user reports:', error);
            res.status(500).json({
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }
};

export default reportsController;