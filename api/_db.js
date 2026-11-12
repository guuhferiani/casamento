import { neon } from '@neondatabase/serverless';

/**
 * Retorna uma instância do cliente SQL do Neon usando DATABASE_URL.
 */
export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL não configurada.');
  }
  return neon(url);
}

/**
 * Valida se uma string tem formato UUID v4/genérico.
 */
export function isValidUuid(value) {
  return (
    typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
  );
}

