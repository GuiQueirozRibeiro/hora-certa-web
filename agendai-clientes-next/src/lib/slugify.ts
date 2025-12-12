/**
 * Converte um nome em um slug amigável para URL
 * Remove acentos, caracteres especiais e converte para minúsculas
 */
export function slugify(text: string): string {
  if (!text) return '';
  
  return text
    .toString()
    .normalize('NFD') // Decompor caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Substituir espaços por hífens
    .replace(/[^\w\-]+/g, '') // Remover caracteres não-alfanuméricos
    .replace(/\-\-+/g, '-') // Substituir múltiplos hífens por um único
    .replace(/^-+/, '') // Remover hífens do início
    .replace(/-+$/, ''); // Remover hífens do final
}

/**
 * Cria um slug único baseado apenas no nome da empresa
 * Formato: nome-da-empresa
 */
export function createBusinessSlug(name: string): string {
  if (!name) return '';
  return slugify(name);
}
