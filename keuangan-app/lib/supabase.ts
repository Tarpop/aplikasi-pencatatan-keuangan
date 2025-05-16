import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xratytdcmhdxyjmaxsnm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyYXR5dGRjbWhkeHlqbWF4c25tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMzI0NDUsImV4cCI6MjA2MjgwODQ0NX0.KsnfsUrc8wfxyE16fexGtNoYWUPtUiXEYf5SjG3xFPY'
export const supabase = createClient(supabaseUrl, supabaseKey)
