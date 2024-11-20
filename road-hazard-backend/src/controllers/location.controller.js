import { supabase } from '../config/supabase.js'

export const locationController = {
  async addLocation(req, res) {
    try {
      const { latitude, longitude, address } = req.body

      const { data, error } = await supabase
        .from('location')
        .insert([{ latitude, longitude, address }])
        .select()
        .single()

      if (error) throw error

      res.status(201).json(data)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async getLocation(req, res) {
    try {
      const { id } = req.params

      const { data, error } = await supabase
        .from('location')
        .select('*')
        .eq('location_id', id)
        .single()

      if (error) throw error

      res.json(data)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async getNearbyLocations(req, res) {
    try {
      const { latitude, longitude, radius = 5 } = req.query // radius in kilometers

      // Using Postgres Earth Distance functions
      const { data, error } = await supabase.rpc('get_nearby_locations', {
        lat: parseFloat(latitude),
        lng: parseFloat(longitude),
        radius_km: parseFloat(radius)
      })

      if (error) throw error

      res.json(data)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
}