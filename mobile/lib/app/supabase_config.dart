import 'package:supabase_flutter/supabase_flutter.dart';

Future<void> initSupabase() async {
  await Supabase.initialize(
    url: 'https://qaeeebxebvhtbfxuvbdx.supabase.co', // ضع رابط المشروع هنا
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhZWVlYnhlYnZodGJmeHV2YmR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE2Nzc5MjYsImV4cCI6MjA0NzI1MzkyNn0.lXyDApKZHXtSDEe-MKJxoi2CqmmDfw4cl3CD8Fh4vJ4', // ضع المفتاح العام (anon key)
  );
}
