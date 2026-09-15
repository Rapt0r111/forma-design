const tightSpace = /[\u00A0\u202F\u2009]/g;

function tighten(value: string) {
  return value.replace(tightSpace, '\u00A0');
}

export function money(n: number) {
  return tighten(new Intl.NumberFormat('ru-RU').format(n));
}

export function moneyRub(n: number) {
  return tighten(
    new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0,
    }).format(n),
  );
}
