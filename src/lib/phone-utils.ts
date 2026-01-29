/**
 * Formata um número de telefone brasileiro
 * Aceita números com 10 dígitos (8 + DDD) ou 11 dígitos (9 + DDD)
 * Exemplos:
 * - 8899999999 -> (88) 9999-9999
 * - 88999999999 -> (88) 99999-9999
 */
export function formatPhoneNumber(phone: string): string {
  // Remove todos os caracteres não numéricos
  const digits = phone.replace(/\D/g, '');
  
  // Se não houver dígitos suficientes, retorna o original
  if (digits.length < 10) {
    return phone;
  }
  
  // Extrai DDD (2 primeiros dígitos)
  const ddd = digits.substring(0, 2);
  
  // Verifica se é número de 10 dígitos (8 + DDD) ou 11 dígitos (9 + DDD)
  if (digits.length === 10) {
    // Formato: (XX) XXXX-XXXX
    const part1 = digits.substring(2, 6);
    const part2 = digits.substring(6, 10);
    return `(${ddd}) ${part1}-${part2}`;
  } else {
    // Formato: (XX) XXXXX-XXXX
    const part1 = digits.substring(2, 7);
    const part2 = digits.substring(7, 11);
    return `(${ddd}) ${part1}-${part2}`;
  }
}

/**
 * Valida se um número de telefone contém apenas dígitos
 */
export function validatePhoneNumber(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 11;
}

/**
 * Remove formatação de telefone, mantendo apenas os dígitos
 */
export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/\D/g, '');
}