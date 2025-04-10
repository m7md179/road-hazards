// controllers/users.controller.js
import { supabase } from '../config/supabase.config.js';

export const usersController = {
    // Admin Methods
    async getAll(req, res) {
        try {
            console.log('Fetching users from Supabase...');
            
            const { 
                trusted_score_min,
                trusted_score_max,
                is_banned,
                search,
                page = 1,
                limit = 20
            } = req.query;

            // First, check if the 'users' table exists
            console.log('Checking if users table exists...');
            const { data: tableInfo, error: tableError } = await supabase
                .from('users')
                .select('count(*)', { count: 'exact', head: true });
                
            if (tableError) {
                console.error('Error checking users table:', tableError);
                throw tableError;
            }
            
            console.log('Users table exists, count result:', tableInfo);

            // Continue with regular query
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

            console.log('Executing users query...');
            const { data, error, count } = await query;

            if (error) {
                console.error('Error fetching users:', error);
                throw error;
            }

            console.log(`Found ${data?.length || 0} users`);
            
            res.json({
                users: data,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: count
                }
            });
        } catch (error) {
            console.error('Error in getAll users:', error);
            res.status(500).json({ error: error.message });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, email, phone, is_admin, is_banned, trusted_score, admin_note } = req.body;

            const { data, error } = await supabase
                .from('users')
                .update({ 
                    name,
                    email,
                    phone,
                    is_admin,
                    is_banned,
                    trusted_score,
                    admin_note,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    async delete(req, res) {
        try {
            const { id } = req.params;
            const { error } = await supabase
                .from('users')
                .delete()
                .eq('id', id);

            if (error) throw error;
            
            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async updateTrustScore(req, res) {
        try {
            const { id } = req.params;
            const { trusted_score, admin_note } = req.body;
            
            const { data, error } = await supabase
                .from('users')
                .update({ 
                    trusted_score,
                    admin_note,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();
                
            if (error) throw error;
            
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    async banUser(req, res) {
        try {
            const { id } = req.params;
            const { admin_note } = req.body;
            
            const { data, error } = await supabase
                .from('users')
                .update({ 
                    is_banned: true,
                    admin_note,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();
                
            if (error) throw error;
            
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    async unbanUser(req, res) {
        try {
            const { id } = req.params;
            const { admin_note } = req.body;
            
            const { data, error } = await supabase
                .from('users')
                .update({ 
                    is_banned: false,
                    admin_note,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
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