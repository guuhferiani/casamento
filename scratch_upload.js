import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://swqkshcgwrhybgnjykhc.supabase.co';
const supabaseKey = 'sb_publishable_VbD4t0ObBrFaj4fNqg5jSg_6IjojbI2';

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadGuests() {
  const content = fs.readFileSync('lista_de_convidados - Convidados.csv', 'utf8');
  const names = content.split('\n')
    .map(line => line.trim())
    .filter((line, index) => index > 0 && line.length > 0);

  console.log(`Lido ${names.length} nomes.`);

  console.log("Limpando lista antiga...");
  // Use a Filter that matches all UUIDs
  const { error: deleteError } = await supabase
    .from('convidados')
    .delete()
    .gte('id', '00000000-0000-0000-0000-000000000000'); // Range delete

  if (deleteError) {
    console.error("Erro ao limpar lista:", deleteError.message);
    // Continue even if delete fails? No, better fix it.
    // Try another approach
    const { error: deleteError2 } = await supabase
        .from('convidados')
        .delete()
        .neq('nome_na_lista', '');
    
    if (deleteError2) {
        console.error("Erro ao limpar lista (tentativa 2):", deleteError2.message);
        return;
    }
  }

  const payload = names.map(name => ({
    nome_na_lista: name,
    confirmado: false
  }));

  console.log("Inserindo novos registros...");
  const { error } = await supabase
    .from('convidados')
    .insert(payload);

  if (error) {
    console.error("Erro ao inserir:", error.message);
  } else {
    console.log("Upload concluído com sucesso!");
  }
}

uploadGuests();
