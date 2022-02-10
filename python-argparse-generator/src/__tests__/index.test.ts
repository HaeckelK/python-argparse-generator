import { Greeter } from '../index';

test('My Greeter', () => {
  expect(Greeter('Albert')).toBe('Hello Albert');
});
