import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hbljxmyagifjzqboqvuc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhibGp4bXlhZ2lmanpxYm9xdnVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NzgyNjIsImV4cCI6MjA3NjM1NDI2Mn0.f7J7NHKWl1PrAPh-cvZo-IZaA3tajJf7R56XryHTzKc';

export const supabase = createClient(supabaseUrl, supabaseKey);