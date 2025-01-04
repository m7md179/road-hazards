// controllers/reports.controller.js
export const reportsController = {
    // Admin Methods
    async getAll(req, res) {
        try {
            const { 
                status, 
                page = 1, 
                limit = 20,
                hazard_type_id,
                date_from,
                date_to 
            } = req.query;

            let query = supabase
                .from('reports')
                .select(`
                    *,
                    users (id, name, email, trusted_score),
                    hazard_types (*),
                    locations (*),
                    report_photos (*)
                `)
                .order('created_at', { ascending: false });

            // Apply filters
            if (status) query = query.eq('status', status);
            if (hazard_type_id) query = query.eq('hazard_type_id', hazard_type_id);
            if (date_from) query = query.gte('created_at', date_from);
            if (date_to) query = query.lte('created_at', date_to);

            // Apply pagination
            const from = (page - 1) * limit;
            const to = from + limit - 1;
            query = query.range(from, to);

            const { data, error, count } = await query;

            if (error) throw error;

            res.json({
                reports: data,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: count
                }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async updateStatus(req, res) {
        try {
            const { reportId } = req.params;
            const { status, admin_note } = req.body;

            const { data, error } = await supabase
                .from('reports')
                .update({ 
                    status,
                    admin_note,
                    updated_at: new Date().toISOString()
                })
                .eq('report_id', reportId)
                .select()
                .single();

            if (error) throw error;

            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Mobile Methods
    async submitReport(req, res) {
        try {
            const userId = req.user.id;
            const { 
                hazard_type_id, 
                latitude, 
                longitude, 
                description,
                speed_at_reporting
            } = req.body;

            // Get user's trust score
            const { data: user } = await supabase
                .from('users')
                .select('trusted_score')
                .eq('id', userId)
                .single();

            if (user.trusted_score < 30) {
                throw new Error('Trust score too low to submit reports');
            }

            // Insert location first
            const { data: location, error: locationError } = await supabase
                .from('locations')
                .insert([{
                    latitude,
                    longitude
                }])
                .select()
                .single();

            if (locationError) throw locationError;

            // Create report
            const { data: report, error: reportError } = await supabase
                .from('reports')
                .insert([{
                    user_id: userId,
                    hazard_type_id,
                    location_id: location.location_id,
                    description,
                    speed_at_reporting,
                    status: 'pending'
                }])
                .select()
                .single();

            if (reportError) throw reportError;

            res.status(201).json(report);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async getNearbyHazards(req, res) {
        try {
            const { latitude, longitude, radius = 1000 } = req.query;

            const { data, error } = await supabase
                .rpc('find_nearby_hazards', {
                    p_latitude: parseFloat(latitude),
                    p_longitude: parseFloat(longitude),
                    p_radius_meters: parseInt(radius)
                });

            if (error) throw error;
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async uploadReportPhoto(req, res) {
        try {
            const { report_id } = req.params;
            const { photo } = req.files;

            // Upload to storage
            const filename = `${Date.now()}_${photo.name}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('report-photos')
                .upload(filename, photo.data);

            if (uploadError) throw uploadError;

            // Create photo record
            const { data: photoRecord, error: photoError } = await supabase
                .from('report_photos')
                .insert([{
                    report_id,
                    photo_url: uploadData.path
                }])
                .select()
                .single();

            if (photoError) throw photoError;

            res.json(photoRecord);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getUserReports(req, res) {
        try {
            const userId = req.user.id;
            const { data, error } = await supabase
                .from('reports')
                .select(`
                    *,
                    hazard_types (*),
                    locations (*),
                    report_photos (*)
                `)
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};