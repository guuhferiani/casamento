import { getSql } from './_db.js';

export default async function handler(req, res) {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
    return res.status(403).json({ error: 'O envio de novas fotos está desativado.' });
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  try {
    const sql = getSql();
    const rows = await sql`
      SELECT id, nome_convidado, legenda, foto_url, created_at
      FROM public.fotos_casamento
      ORDER BY created_at DESC
    `;
    return res.status(200).json(rows);
  } catch (error) {
    console.error('Erro em /api/fotos:', error);
    return res.status(500).json({ error: 'Erro interno ao buscar fotos.' });
  }
}

