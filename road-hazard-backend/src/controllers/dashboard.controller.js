// controllers/dashboard.controller.js
export const dashboardController = {
    async getStats(req, res) {
        try {
            const { data: stats, error } = await supabase
                .rpc('get_admin_dashboard_stats');

            if (error) throw error;

            res.json(stats);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};