import { getSql, isValidUuid } from './_db.js';

export default async function handler(req, res) {
  try {
    const sql = getSql();

    if (req.method === 'GET') {
      const onlyConfirmed = req.query?.confirmado === 'true';
      const rows = onlyConfirmed
        ? await sql`
            SELECT id, nome_na_lista, confirmado, created_at
            FROM public.convidados
            WHERE confirmado = true
            ORDER BY nome_na_lista ASC
          `
        : await sql`
            SELECT id, nome_na_lista, confirmado
            FROM public.convidados
            ORDER BY nome_na_lista ASC
          `;
      return res.status(200).json(rows);
    }

    if (req.method === 'PATCH') {
      const { id, confirmado } = req.body || {};
      if (!isValidUuid(id) || typeof confirmado !== 'boolean') {
        return res.status(400).json({ error: 'Dados inválidos para atualizar convidado.' });
      }

      const rows = await sql`
        UPDATE public.convidados
        SET confirmado = ${confirmado}
        WHERE id = ${id}
        RETURNING id, nome_na_lista, confirmado
      `;

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Convidado não encontrado.' });
      }

      return res.status(200).json(rows[0]);
    }

    res.setHeader('Allow', 'GET, PATCH');
    return res.status(405).json({ error: 'Método não permitido.' });
  } catch (error) {
    console.error('Erro em /api/convidados:', error);
    return res.status(500).json({ error: 'Erro interno ao processar convidados.' });
  }
}

