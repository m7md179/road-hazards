import { supabase } from '../config/supabase.config.js';

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'No auth token provided' });
        }

        // Set the token in the client
        supabase.auth.setSession(token);
        
        // Get user session
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        // Get user from our users table
        const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('email', user.email)
            .single();

        req.user = userData;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed' });
    }
};