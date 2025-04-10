// middleware/admin.middleware.js
import { supabase } from '../config/supabase.config.js';

export const adminAuthMiddleware = async (req, res, next) => {
  // For development - check if we're using mock data
  if (process.env.NODE_ENV !== 'production' && !process.env.SUPABASE_URL?.startsWith('http')) {
    console.log('🔑 Development mode: Bypassing admin authentication');
    req.user = { 
      id: 'mock-admin-id', 
      email: 'admin@example.com', 
      name: 'Admin User' 
    };
    return next();
  }

  try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
          return res.status(401).json({ error: 'No token provided' });
      }

      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
          return res.status(401).json({ error: 'Invalid token' });
      }

      // Check if user is admin
      const { data: adminUser } = await supabase
          .from('users')
          .select('is_admin')
          .eq('id', user.id)
          .single();

      if (!adminUser?.is_admin) {
          return res.status(403).json({ error: 'Not authorized as admin' });
      }

      req.user = user;
      next();
  } catch (error) {
      res.status(401).json({ error: 'Authentication failed' });
  }
};