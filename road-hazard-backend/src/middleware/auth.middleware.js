// src/middleware/auth.middleware.js
import { supabase } from '../config/supabase.js'

export const authenticateUser = async (req, res, next) => {
  try {
    // Get the auth header
    const authHeader = req.headers.authorization
    
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' })
    }

    // Get the current session
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session) {
      return res.status(401).json({ message: 'Invalid session' })
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (profileError || !profile) {
      return res.status(401).json({ message: 'User profile not found' })
    }

    if (profile.is_banned) {
      return res.status(403).json({ message: 'Account is banned' })
    }

    // Attach user profile to request
    req.user = profile
    next()
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' })
  }
}