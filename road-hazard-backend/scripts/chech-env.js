import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file
const envPath = join(__dirname, '..', '.env');
const envExists = fs.existsSync(envPath);

console.log('\nEnvironment Check:');
console.log('----------------');

if (!envExists) {
    console.log('❌ .env file not found!');
    console.log('Please create a .env file in the project root with the following variables:');
    console.log('SUPABASE_URL=your_supabase_url');
    console.log('SUPABASE_KEY=your_supabase_key');
    console.log('PORT=3000');
    process.exit(1);
}

// Check env variables
const env = dotenv.config().parsed;

const required = ['SUPABASE_URL', 'SUPABASE_KEY'];
const missing = required.filter(key => !env[key]);

if (missing.length) {
    console.log('❌ Missing required environment variables:');
    missing.forEach(key => console.log(`- ${key}`));
    process.exit(1);
}

console.log('✅ .env file found');
console.log('✅ All required variables present');
console.log('\nValues:');
console.log(`SUPABASE_URL: ${env.SUPABASE_URL.slice(0, 20)}...`);
console.log(`SUPABASE_KEY: ${env.SUPABASE_KEY.slice(0, 10)}...`);
console.log(`PORT: ${env.PORT || 3000}`);