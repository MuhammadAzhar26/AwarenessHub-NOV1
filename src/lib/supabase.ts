import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://jglhhlximslbdnwjaclm.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnbGhobHhpbXNsYmRud2phY2xtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MzYwNjUsImV4cCI6MjA3NzQxMjA2NX0.lVY600sweXQqkx7drARbEoYlxou_F1HRj7JnlASKU_w"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
