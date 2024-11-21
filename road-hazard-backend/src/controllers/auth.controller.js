import { supabase } from '../config/supabase.config.js';

// Create controller as an object with arrow functions
const authController = {
    async getNextId() {
        const { data, error } = await supabase
            .from('users')
            .select('id')
            .order('id', { ascending: false })
            .limit(1);
        
        if (error) throw error;
        return data && data.length > 0 ? data[0].id + 1 : 1;
    },

    signIn: async (req, res) => {
      try {
          const { email, password } = req.body;

          if (!email || !password) {
              return res.status(400).json({ 
                  error: 'Email and password are required' 
              });
          }

          // Sign in with Supabase Auth
          const { data: { session }, error: authError } = await supabase.auth.signInWithPassword({
              email,
              password
          });

          if (authError) {
              return res.status(401).json({ 
                  error: 'Invalid email or password' 
              });
          }

          // Get user from users table
          const { data: user, error: userError } = await supabase
              .from('users')
              .select('*')
              .eq('email', email)
              .single();

          if (userError || !user) {
              return res.status(401).json({ 
                  error: 'Invalid email or password' 
              });
          }

          res.json({
              message: 'Signed in successfully',
              user: {
                  id: user.id,
                  email: user.email,
                  name: user.name,
                  phone: user.phone,
                  trusted_score: user.trusted_score,
                  is_banned: user.is_banned,
                  total_reports: user.total_reports,
                  created_at: user.created_at
              },
              session: {
                  access_token: session.access_token,
                  refresh_token: session.refresh_token
              }
          });
      } catch (error) {
          console.error('Error in signIn:', error);
          res.status(500).json({
              error: error.message,
              timestamp: new Date().toISOString()
          });
      }
  },

  signUp: async (req, res) => {
      try {
          const { email, password, name, phone } = req.body;

          // Validate required fields
          if (!email || !password || !name) {
              return res.status(400).json({ 
                  error: 'Email, password, and name are required' 
              });
          }

          // Create user in Supabase Auth
          const { data: authData, error: authError } = await supabase.auth.signUp({
              email,
              password,
              options: {
                  data: { name }
              }
          });

          if (authError) throw authError;

          // Get next ID
          const { data: lastUser } = await supabase
              .from('users')
              .select('id')
              .order('id', { ascending: false })
              .limit(1);

          const nextId = lastUser && lastUser.length > 0 ? lastUser[0].id + 1 : 1;

          // Create user in our users table
          const { data: user, error: userError } = await supabase
              .from('users')
              .insert([{
                  id: nextId,
                  email,
                  name,
                  phone,
                  trusted_score: 100,
                  is_banned: false,
                  total_reports: 0,
                  created_at: new Date().toISOString()
              }])
              .select()
              .single();

          if (userError) throw userError;

          res.status(201).json({
              message: 'User created successfully',
              user,
              session: authData.session
          });
      } catch (error) {
          console.error('Error in signUp:', error);
          res.status(500).json({
              error: error.message,
              timestamp: new Date().toISOString()
          });
      }
  },

    getProfile: async (req, res) => {
        try {
            const { email } = req.body; // In production, get this from JWT token

            if (!email) {
                return res.status(401).json({ 
                    error: 'Not authenticated' 
                });
            }

            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();

            if (error) throw error;

            res.json(data);
        } catch (error) {
            console.error('Error in getProfile:', error);
            res.status(500).json({
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    },

    updateProfile: async (req, res) => {
        try {
            const { email, name, phone } = req.body; // In production, get email from JWT token

            if (!email) {
                return res.status(401).json({ 
                    error: 'Not authenticated' 
                });
            }

            const updates = {};
            if (name) updates.name = name;
            if (phone) updates.phone = phone;

            const { data, error } = await supabase
                .from('users')
                .update(updates)
                .eq('email', email)
                .select()
                .single();

            if (error) throw error;

            res.json(data);
        } catch (error) {
            console.error('Error in updateProfile:', error);
            res.status(500).json({
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }
};

export default authController;