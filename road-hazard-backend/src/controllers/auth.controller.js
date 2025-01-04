// controllers/auth.controller.js
export const authController = {
    // Admin Methods
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            // Check if user is admin
            const { data: user } = await supabase
                .from('users')
                .select('*')
                .eq('id', data.user.id)
                .single();

            if (!user.is_admin) {
                throw new Error('Not authorized as admin');
            }

            res.json({ 
                user,
                session: data.session
            });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    },

    async logout(req, res) {
        try {
            await supabase.auth.signOut();
            res.json({ message: 'Logged out successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getProfile(req, res) {
        try {
            const { data: { user }, error } = await supabase.auth.getUser(
                req.headers.authorization?.split(' ')[1]
            );

            if (error) throw error;

            res.json({ user });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    },

    // Mobile Methods
    async mobileRegister(req, res) {
        try {
            const { email, password, name, phone } = req.body;
            
            // Create auth user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password
            });
            if (authError) throw authError;

            // Create user profile
            const { data: userData, error: userError } = await supabase
                .from('users')
                .insert([{
                    id: authData.user.id,
                    email,
                    name,
                    phone,
                    trusted_score: 100,
                    is_admin: false
                }])
                .select()
                .single();

            if (userError) throw userError;

            res.status(201).json(userData);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async mobileLogin(req, res) {
        try {
            const { email, password } = req.body;
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            // Get user profile
            const { data: user } = await supabase
                .from('users')
                .select('*')
                .eq('id', data.user.id)
                .single();

            // Check if user is banned
            if (user.is_banned) {
                throw new Error('Account has been suspended');
            }

            res.json({ user, session: data.session });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    },

    async updateProfile(req, res) {
        try {
            const { name, phone } = req.body;
            const userId = req.user.id;  // From auth middleware

            const { data, error } = await supabase
                .from('users')
                .update({ name, phone })
                .eq('id', userId)
                .select()
                .single();

            if (error) throw error;
            res.json(data);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};