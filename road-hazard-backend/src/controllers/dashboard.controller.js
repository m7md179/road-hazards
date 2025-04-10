// controllers/dashboard.controller.js
import { supabase } from '../config/supabase.config.js';

export const dashboardController = {
    async getStats(req, res) {
        try {
            // Attempt to use RPC function if available
            try {
                console.log('Trying to call RPC function get_admin_dashboard_stats...');
                const { data: stats, error } = await supabase
                    .rpc('get_admin_dashboard_stats');

                if (error) {
                    console.error('Error calling RPC function:', error);
                    throw error;
                }
                
                if (stats) {
                    console.log('✅ Successfully got data from RPC function');
                    console.log('Data sample:', JSON.stringify(stats).substring(0, 200) + '...');
                    return res.json(stats);
                }
            } catch (rpcError) {
                console.warn('RPC function not available, using fallback queries', rpcError);
            }

            // Fallback implementation with multiple queries
            const dashboardStats = {};

            // Get total reports count
            const { count: totalReports, error: reportsError } = await supabase
                .from('reports')
                .select('*', { count: 'exact', head: true });

            if (reportsError) throw reportsError;
            dashboardStats.totalReports = totalReports || 0;

            // Get total hazards count
            const { count: totalHazards, error: hazardsError } = await supabase
                .from('hazards')
                .select('*', { count: 'exact', head: true });

            if (hazardsError) throw hazardsError;
            dashboardStats.totalHazards = totalHazards || 0;

            // Get total users count
            const { count: totalUsers, error: usersError } = await supabase
                .from('users')
                .select('*', { count: 'exact', head: true });

            if (usersError) throw usersError;
            dashboardStats.totalUsers = totalUsers || 0;

            // Get pending reports count
            const { count: pendingReports, error: pendingError } = await supabase
                .from('reports')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'needs_review');

            if (pendingError) throw pendingError;
            dashboardStats.pendingReports = pendingReports || 0;

            // Get reports by status
            const { data: reportsByStatus, error: statusError } = await supabase
                .from('reports')
                .select('status, count')
                .group('status');

            if (statusError) throw statusError;
            dashboardStats.reportsByStatus = (reportsByStatus || []).map(item => ({
                name: item.status === 'needs_review' ? 'Pending' : 
                      item.status.charAt(0).toUpperCase() + item.status.slice(1),
                value: item.count
            }));

            // Get hazards by type
            const { data: hazardsByType, error: typeError } = await supabase
                .from('hazards')
                .select('hazard_type_id, hazard_types(name), count')
                .group('hazard_type_id, hazard_types(name)');

            if (typeError) throw typeError;
            dashboardStats.hazardsByType = (hazardsByType || []).map(item => ({
                name: item.hazard_types?.name || 'Unknown',
                value: item.count
            }));

            // Get reports over time (last 7 months)
            const { data: reportsOverTime, error: timeError } = await supabase
                .rpc('get_reports_by_month', { months_back: 7 });

            if (timeError) throw timeError;
            dashboardStats.reportsOverTime = reportsOverTime || [];

            // Get user trust distribution
            const { data: trustDistribution, error: trustError } = await supabase
                .rpc('get_user_trust_distribution');

            if (trustError) throw trustError;
            if (trustDistribution) {
                dashboardStats.userTrustDistribution = [
                    { name: 'Low (0-30)', value: trustDistribution.low_trust || 0 },
                    { name: 'Medium (31-70)', value: trustDistribution.medium_trust || 0 },
                    { name: 'High (71-100)', value: trustDistribution.high_trust || 0 }
                ];
            } else {
                dashboardStats.userTrustDistribution = [
                    { name: 'Low (0-30)', value: 0 },
                    { name: 'Medium (31-70)', value: 0 },
                    { name: 'High (71-100)', value: 0 }
                ];
            }

            res.json(dashboardStats);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            res.status(500).json({ error: error.message });
        }
    }
};