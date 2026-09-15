import { test, expect } from 'bun:test';
import { money, moneyRub } from '../lib/money';

test('money uses nbsp grouping and keeps the ruble sign', () => {
  expect(money(540000)).toBe('540\u00A0000');
  expect(money(540000)).not.toMatch(/\u202F/);
  expect(moneyRub(540000)).toContain('540\u00A0000');
  expect(moneyRub(540000)).toContain('₽');
  expect(moneyRub(540000)).not.toMatch(/\u202F/);
});
