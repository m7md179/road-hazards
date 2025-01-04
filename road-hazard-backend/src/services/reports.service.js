import { supabase } from '../config/supabase.config.js'

export const reportsService = {
    async getReports({ status, page = 1, limit = 20 }) {
        const from = (page - 1) * limit
        const to = from + limit - 1

        let query = supabase
            .from('reports')
            .select(`
                *,
                users (id, name, email, trusted_score),
                hazard_types (id, name),
                locations (latitude, longitude)
            `)
            .order('created_at', { ascending: false })
            .range(from, to)

        if (status) {
            query = query.eq('status', status)
        }

        const { data, error } = await query

        if (error) throw error

        return {
            reports: data,
            pagination: {
                page,
                limit,
                total: data.length  // You might want to get actual count
            }
        }
    },

    async updateReportStatus(reportId, status) {
        const { data, error } = await supabase
            .from('reports')
            .update({ status })
            .eq('report_id', reportId)
            .select()
            .single()

        if (error) throw error

        return data
    }
}