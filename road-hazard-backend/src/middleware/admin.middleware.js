// middleware/admin.middleware.js
export const adminAuthMiddleware = async (req, res, next) => {
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