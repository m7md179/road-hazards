import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

// First try to load from .env.local, then fallback to .env
const envLocalPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envLocalPath)) {
  console.log('📄 Loading environment from .env.local')
  dotenv.config({ path: envLocalPath })
} else {
  console.log('📄 No .env.local found, falling back to .env')
  dotenv.config()
}

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

let supabase;

// Check if Supabase credentials are provided and valid
if (supabaseUrl && supabaseUrl.startsWith('http') && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase client initialized');
  } catch (error) {
    console.error('❌ Error initializing Supabase client:', error.message);
    supabase = createMockSupabaseClient();
  }
} else {
  console.warn('⚠️ No valid Supabase credentials found, using mock data');
  supabase = createMockSupabaseClient();
}

// Create a mock Supabase client for development without credentials
function createMockSupabaseClient() {
  console.log('🔄 Using mock Supabase client for development');

  return {
    from: (table) => ({
      select: (columns) => ({
        eq: () => ({
          single: async () => ({ data: getMockData(table), error: null }),
          order: () => ({ data: getMockData(table, true), error: null }),
          range: () => ({ data: getMockData(table, true), error: null, count: 15 })
        }),
        order: () => ({
          range: () => ({ data: getMockData(table, true), error: null, count: 15 })
        }),
        group: () => ({ data: getMockGroupedData(table), error: null })
      }),
      insert: () => ({
        select: () => ({
          single: async () => ({ data: { id: 'mock-id-' + Date.now() }, error: null })
        })
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: async () => ({ data: { id: 'mock-id', updated: true }, error: null })
          })
        })
      }),
      delete: () => ({
        eq: () => ({ error: null })
      })
    }),
    auth: {
      signInWithPassword: async () => ({
        data: {
          user: { id: 'mock-user-id', email: 'admin@example.com' },
          session: { access_token: 'mock-token' }
        },
        error: null
      }),
      signOut: async () => ({ error: null }),
      getUser: async () => ({
        data: { user: { id: 'mock-user-id', email: 'admin@example.com' } },
        error: null
      }),
      setSession: () => { }
    },
    rpc: (funcName, params) => ({
      data: getMockRpcData(funcName, params),
      error: null
    })
  };
}

// Mock data based on table name
function getMockData(table, isArray = false) {
  const mockData = {
    users: {
      id: 'mock-user-1',
      name: 'John Doe',
      email: 'john@example.com',
      trusted_score: 85,
      is_admin: true,
      is_banned: false
    },
    reports: {
      report_id: 'mock-report-1',
      user_id: 'mock-user-1',
      hazard_type_id: 'mock-hazard-type-1',
      description: 'Large pothole in the road',
      status: 'needs_review',
      created_at: new Date().toISOString(),
      users: {
        id: 'mock-user-1',
        name: 'John Doe',
        email: 'john@example.com',
        trusted_score: 85
      },
      hazard_types: {
        id: 'mock-hazard-type-1',
        name: 'Pothole'
      },
      locations: {
        location_id: 'mock-location-1',
        latitude: 51.505,
        longitude: -0.09
      },
      report_photos: []
    },
    hazards: {
      hazard_type_id: 'mock-hazard-type-1',
      hazard_name: 'Pothole',
      description: 'Large hole in the road',
      icon_id: 'mock-icon-1',
      location_id: 'mock-location-1'
    }
  };

  if (!isArray) {
    return mockData[table] || {};
  } else {
    return Array(5).fill(null).map((_, i) => ({
      ...mockData[table],
      id: `mock-${table}-${i + 1}`,
      report_id: `mock-report-${i + 1}`,
      hazard_type_id: `mock-hazard-type-${i + 1}`,
      location_id: `mock-location-${i + 1}`,
      created_at: new Date(Date.now() - i * 86400000).toISOString()
    }));
  }
}

function getMockGroupedData(table) {
  if (table === 'reports') {
    return [
      { status: 'needs_review', count: 12 },
      { status: 'approved', count: 45 },
      { status: 'rejected', count: 8 },
      { status: 'converted', count: 23 }
    ];
  }

  if (table === 'hazards') {
    return [
      { hazard_type_id: 'mock-type-1', hazard_types: { name: 'Pothole' }, count: 28 },
      { hazard_type_id: 'mock-type-2', hazard_types: { name: 'Roadwork' }, count: 22 },
      { hazard_type_id: 'mock-type-3', hazard_types: { name: 'Accident' }, count: 13 }
    ];
  }

  return [];
}

function getMockRpcData(funcName, params) {
  if (funcName === 'get_admin_dashboard_stats') {
    return {
      totalReports: 156,
      totalHazards: 83,
      totalUsers: 327,
      pendingReports: 12,
      reportsByStatus: [
        { name: 'Pending', value: 12 },
        { name: 'Approved', value: 87 },
        { name: 'Rejected', value: 32 },
        { name: 'Converted', value: 25 }
      ],
      hazardsByType: [
        { name: 'Pothole', value: 28 },
        { name: 'Roadwork', value: 22 },
        { name: 'Accident', value: 13 },
        { name: 'Flooding', value: 9 },
        { name: 'Other', value: 11 }
      ],
      reportsOverTime: [
        { name: 'Jan', reports: 12, hazards: 8 },
        { name: 'Feb', reports: 19, hazards: 11 },
        { name: 'Mar', reports: 22, hazards: 15 },
        { name: 'Apr', reports: 25, hazards: 14 },
        { name: 'May', reports: 18, hazards: 9 },
        { name: 'Jun', reports: 29, hazards: 17 },
        { name: 'Jul', reports: 31, hazards: 19 }
      ],
      userTrustDistribution: [
        { name: 'Low (0-30)', value: 45 },
        { name: 'Medium (31-70)', value: 187 },
        { name: 'High (71-100)', value: 95 }
      ]
    };
  }

  if (funcName === 'find_hazards_in_radius') {
    const { p_latitude, p_longitude, p_radius_meters } = params;
    return [
      { id: 'mock-hazard-1', hazard_type: 'Pothole', latitude: p_latitude + 0.01, longitude: p_longitude + 0.01, description: 'Large pothole', severity: 'high' },
      { id: 'mock-hazard-2', hazard_type: 'Roadwork', latitude: p_latitude - 0.01, longitude: p_longitude - 0.01, description: 'Road construction', severity: 'medium' },
      { id: 'mock-hazard-3', hazard_type: 'Accident', latitude: p_latitude + 0.02, longitude: p_longitude - 0.02, description: 'Vehicle collision', severity: 'high' }
    ];
  }

  return [];
}

export { supabase };