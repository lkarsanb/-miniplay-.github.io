/*
<This is the helper.js file for MiniPlay that allows for user authentication and database sotrage through Supabase.>
    Copyright (C) <2025>  <Jessica Webb and Lea Karsanbhai>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://sisudurvsaphfhvctgeb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpc3VkdXJ2c2FwaGZodmN0Z2ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxOTAzMDQsImV4cCI6MjA2MDc2NjMwNH0.kQWBC2hf8nzP9jOHMiz0yeW2GLlzgd_9tDTzoTZobAw';
export const supabase = createClient(supabaseUrl, supabaseKey);
