import { createClient } from '@supabase/supabase-js';

// Credenciais para o banco de dados de Cor, Produtos e Relatórios
const supabaseColorUrl = 'https://cugfezglvaclawbhtola.supabase.co';
const supabaseColorKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1Z2ZlemdsdmFjbGF3Ymh0b2xhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NzM0OTEsImV4cCI6MjA1ODA0OTQ5MX0.3gT5tWcu1fboof_qWWtu-05QhCoiVdTccLirTIPbUTk';

// Credenciais para o banco de dados de Controle de Processo
const supabaseProcessUrl = 'https://myffywxacmoyhtawvlgn.supabase.co';
const supabaseProcessKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15ZmZ5d3hhY21veWh0YXd2bGduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NjQ4MzQsImV4cCI6MjA2NTE0MDgzNH0.vt8aSUBjLAPOT7qlhWWzva0fh1m59HiXPTpkLgCT3Uk';

// Cria e exporta os clientes Supabase
export const supabaseColor = createClient(supabaseColorUrl, supabaseColorKey);
export const supabaseProcess = createClient(supabaseProcessUrl, supabaseProcessKey);
