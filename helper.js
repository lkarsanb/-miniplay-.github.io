import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://sisudurvsaphfhvctgeb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpc3VkdXJ2c2FwaGZodmN0Z2ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxOTAzMDQsImV4cCI6MjA2MDc2NjMwNH0.kQWBC2hf8nzP9jOHMiz0yeW2GLlzgd_9tDTzoTZobAw';
export const supabase = createClient(supabaseUrl, supabaseKey);