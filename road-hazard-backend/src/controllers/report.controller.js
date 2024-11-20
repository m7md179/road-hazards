import { supabase } from '../config/supabase.js'

export const reportController = {
  async createReport(req, res) {
    try {
      const { 
        hazard_type_id, 
        location_id, 
        speed_at_reporting,
        reported_where,
        user_id = 1 // Default user_id for testing
      } = req.body

      const { data, error } = await supabase
        .from('report')
        .insert([{
          user_id,
          hazard_type_id,
          location_id,
          speed_at_reporting,
          reported_where,
          status: 'pending',
          report_timestamp: new Date()
        }])
        .select()

      if (error) throw error

      res.status(201).json(data)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async getReports(req, res) {
    try {
      const { data, error } = await supabase
        .from('report')
        .select(`
          *,
          location (*),
          hazards (*)
        `)
        .order('report_timestamp', { ascending: false })

      if (error) throw error

      res.json(data)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
}
