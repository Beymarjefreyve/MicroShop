export function formatCOP(amount: number): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '$ 0';
  }
  // Formato de pesos colombianos robusto: símbolo '$' seguido de separador de miles con punto
  const rounded = Math.round(amount);
  const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `$ ${formatted}`;
}
