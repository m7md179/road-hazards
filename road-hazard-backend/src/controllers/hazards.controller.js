// controllers/hazards.controller.js
export const hazardTypesController = {
    // Admin Methods
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
    },

    async convertReport(req, res) {
        try {
            const { reportId } = req.params;
            const { admin_note } = req.body;
            const adminId = req.user.id; // From auth middleware

            // Start a transaction
            const { data: report, error: reportError } = await supabase
                .from('reports')
                .select('*')
                .eq('report_id', reportId)
                .single();

            if (reportError) throw reportError;

            // Create hazard from report
            const { data: hazard, error: hazardError } = await supabase
                .from('hazards')
                .insert([{
                    hazard_type_id: report.hazard_type_id,
                    location_id: report.location_id,
                    description: report.description,
                    created_from_report_id: reportId,
                    status: 'active'
                }])
                .select()
                .single();

            if (hazardError) throw hazardError;

            // Update report status to converted
            const { error: updateError } = await supabase
                .from('reports')
                .update({
                    status: 'converted',
                    admin_note,
                    validated_at: new Date().toISOString()
                })
                .eq('report_id', reportId);

            if (updateError) throw updateError;

            // Log the admin action
            await supabase
                .from('audit_logs')
                .insert([{
                    table_name: 'reports',
                    record_id: reportId,
                    action: 'convert',
                    new_data: { status: 'converted', admin_note },
                    user_id: adminId
                }]);

            res.json({ 
                message: 'Report converted successfully',
                hazard: hazard
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getReportsNeedingReview(req, res) {
        try {
            const { data, error } = await supabase
                .from('reports')
                .select(`
                    *,
                    users (id, name, email, trusted_score),
                    hazard_types (*),
                    locations (*),
                    report_photos (*)
                `)
                .eq('status', 'needs_review')
                .order('created_at', { ascending: false });

            if (error) throw error;

            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Mobile Methods
    async getActiveHazardTypes(req, res) {
        try {
            const { data, error } = await supabase
                .from('hazard_types')
                .select('*')
                .eq('active', true)
                .order('name');

            if (error) throw error;
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getHazardAlerts(req, res) {
        try {
            const { latitude, longitude, speed } = req.query;
            const { data, error } = await supabase
                .rpc('get_hazard_alerts', {
                    p_latitude: parseFloat(latitude),
                    p_longitude: parseFloat(longitude),
                    p_speed: parseFloat(speed)
                });

            if (error) throw error;
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getHazardsInRadius(req, res) {
        try {
            const { latitude, longitude, radius = 5000 } = req.query;
            const { data, error } = await supabase
                .rpc('find_hazards_in_radius', {
                    p_latitude: parseFloat(latitude),
                    p_longitude: parseFloat(longitude),
                    p_radius_meters: parseInt(radius)
                });

            if (error) throw error;
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};