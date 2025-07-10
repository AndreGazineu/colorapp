// src/js/supabase-init.js - VERSÃO SEGURA

import { createClient } from '@supabase/supabase-js';

// O Vite vai substituir estas variáveis magicamente durante o build!
const supabaseColorUrl = import.meta.env.VITE_SUPABASE_COLOR_URL;
const supabaseColorKey = import.meta.env.VITE_SUPABASE_COLOR_KEY;

const supabaseProcessUrl = import.meta.env.VITE_SUPABASE_PROCESS_URL;
const supabaseProcessKey = import.meta.env.VITE_SUPABASE_PROCESS_KEY;

// Cria e exporta os clientes Supabase
export const supabaseColor = createClient(supabaseColorUrl, supabaseColorKey);
export const supabaseProcess = createClient(supabaseProcessUrl, supabaseProcessKey);
