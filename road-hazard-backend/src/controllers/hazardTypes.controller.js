import { supabase } from '../config/supabase.js'

export const hazardTypesController = {
  async getAllTypes(req, res) {
    try {
      const { data, error } = await supabase
        .from('hazards')
        .select('*')
        .order('hazard_name', { ascending: true })

      if (error) throw error

      res.json(data)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async createType(req, res) {
    try {
      const { hazard_name, description, icon_id } = req.body

      const { data, error } = await supabase
        .from('hazards')
        .insert([{ hazard_name, description, icon_id }])
        .select()
        .single()

      if (error) throw error

      res.status(201).json(data)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async updateType(req, res) {
    try {
      const { id } = req.params
      const { hazard_name, description, icon_id } = req.body

      const { data, error } = await supabase
        .from('hazards')
        .update({ hazard_name, description, icon_id })
        .eq('hazard_type_id', id)
        .select()
        .single()

      if (error) throw error

      res.json(data)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async deleteType(req, res) {
    try {
      const { id } = req.params

      const { error } = await supabase
        .from('hazards')
        .delete()
        .eq('hazard_type_id', id)

      if (error) throw error

      res.json({ message: 'Hazard type deleted successfully' })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
}