import { getSql } from './_db.js';

export default async function handler(req, res) {
  try {
    const sql = getSql();

    if (req.method === 'GET') {
      const rows = await sql`
        SELECT id, nome, mensagem, created_at
        FROM public.mensagens_noivos
        ORDER BY created_at DESC
      `;
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const nome = typeof req.body?.nome === 'string' ? req.body.nome.trim() : '';
      const mensagem = typeof req.body?.mensagem === 'string' ? req.body.mensagem.trim() : '';

      if (!nome || !mensagem) {
        return res.status(400).json({ error: 'Nome e mensagem são obrigatórios.' });
      }

      if (nome.length > 120 || mensagem.length > 2000) {
        return res.status(400).json({ error: 'Nome ou mensagem excede o tamanho máximo.' });
      }

      const rows = await sql`
        INSERT INTO public.mensagens_noivos (nome, mensagem)
        VALUES (${nome}, ${mensagem})
        RETURNING id, nome, mensagem, created_at
      `;
      return res.status(201).json(rows[0]);
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Método não permitido.' });
  } catch (error) {
    console.error('Erro em /api/mensagens:', error);
    return res.status(500).json({ error: 'Erro interno ao processar mensagens.' });
  }
}

