// controllers/users.controller.js
export const usersController = {
    // Admin Methods
    async getAll(req, res) {
        try {
            const { 
                trusted_score_min,
                trusted_score_max,
                is_banned,
                search,
                page = 1,
                limit = 20
            } = req.query;

            let query = supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: false });

            // Apply filters
            if (trusted_score_min) query = query.gte('trusted_score', trusted_score_min);
            if (trusted_score_max) query = query.lte('trusted_score', trusted_score_max);
            if (is_banned !== undefined) query = query.eq('is_banned', is_banned);
            if (search) {
                query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
            }

            // Apply pagination
            const from = (page - 1) * limit;
            const to = from + limit - 1;
            query = query.range(from, to);

            const { data, error, count } = await query;

            if (error) throw error;

            res.json({
                users: data,
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

    async updateUser(req, res) {
        try {
            const { userId } = req.params;
            const { is_banned, trusted_score, admin_note } = req.body;

            const { data, error } = await supabase
                .from('users')
                .update({ 
                    is_banned,
                    trusted_score,
                    admin_note,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId)
                .select()
                .single();

            if (error) throw error;

            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Mobile Methods
    async getUserProfile(req, res) {
        try {
            const userId = req.user.id;
            const { data, error } = await supabase
                .from('users')
                .select(`
                    *,
                    reports!user_id (
                        count,
                        status,
                        created_at
                    )
                `)
                .eq('id', userId)
                .single();

            if (error) throw error;
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async updateUserProfile(req, res) {
        try {
            const userId = req.user.id;
            const { name, phone } = req.body;

            const { data, error } = await supabase
                .from('users')
                .update({ 
                    name, 
                    phone,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId)
                .select()
                .single();

            if (error) throw error;
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getUserStats(req, res) {
        try {
            const userId = req.user.id;
            const { data, error } = await supabase
                .rpc('get_user_stats', { p_user_id: userId });

            if (error) throw error;
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getTrustScoreHistory(req, res) {
        try {
            const userId = req.user.id;
            const { data, error } = await supabase
                .from('audit_logs')
                .select('*')
                .eq('table_name', 'users')
                .eq('record_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};