import { supabase } from '../config/supabase.js'

export const authController = {
  async signUp(req, res) {
    try {
      const { phone, email, username } = req.body

      // Start phone sign up with Supabase Auth
      const { data, error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          // Channel can be 'sms' or 'whatsapp'
          channel: 'sms'
        }
      })

      if (error) throw error

      // Store temporary user data in session
      req.session = {
        ...req.session,
        pendingUser: { phone, email, username }
      }

      res.json({ 
        message: 'OTP sent successfully',
        session: data.session 
      })
    } catch (error) {
      res.status(500).json({ 
        error: error.message 
      })
    }
  },

  async verifyOTP(req, res) {
    try {
      const { phone, token } = req.body

      // Verify OTP with Supabase Auth
      const { data: { session, user }, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms'
      })

      if (error) throw error

      // Get the pending user data
      const pendingUser = req.session?.pendingUser

      if (pendingUser) {
        // Create user profile in your users table
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: user.id, // Use Supabase Auth user ID
              phone_number: phone,
              email: pendingUser.email,
              username: pendingUser.username,
              trusted_score: 100,
              is_banned: false,
              total_reports: 0
            }
          ])
          .select()
          .single()

        if (profileError) throw profileError

        // Clear temporary session data
        delete req.session.pendingUser
      }

      res.json({
        user,
        session
      })
    } catch (error) {
      res.status(500).json({ 
        error: error.message 
      })
    }
  },

  async signIn(req, res) {
    try {
      const { phone } = req.body

      const { data, error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          channel: 'sms'
        }
      })

      if (error) throw error

      res.json({ 
        message: 'OTP sent successfully',
        session: data.session 
      })
    } catch (error) {
      res.status(500).json({ 
        error: error.message 
      })
    }
  },

  async signOut(req, res) {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) throw error

      res.json({ message: 'Signed out successfully' })
    } catch (error) {
      res.status(500).json({ 
        error: error.message 
      })
    }
  }
}