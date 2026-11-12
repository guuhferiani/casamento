async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error || 'Erro ao comunicar com o servidor.');
  }

  return data;
}

export function getConvidados({ onlyConfirmed = false } = {}) {
  const query = onlyConfirmed ? '?confirmado=true' : '';
  return request(`/api/convidados${query}`);
}

export function confirmarConvidado(id) {
  return request('/api/convidados', {
    method: 'PATCH',
    body: JSON.stringify({ id, confirmado: true }),
  });
}

export function getMensagens() {
  return request('/api/mensagens');
}

export function createMensagem({ nome, mensagem }) {
  return request('/api/mensagens', {
    method: 'POST',
    body: JSON.stringify({ nome, mensagem }),
  });
}

export function getFotos() {
  return request('/api/fotos');
}

