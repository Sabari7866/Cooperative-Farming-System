import { arrayToCSV } from './export';

describe('arrayToCSV', () => {
  it('produces a CSV string with headers and rows', () => {
    const input = [
      { name: 'Alpha', price: 10, tags: ['a', 'b'] },
      { name: 'Beta', price: 25, tags: ['c'] },
    ];

    const csv = arrayToCSV(input, ['name', 'price', 'tags']);
    expect(csv).toContain('name,price,tags');
    expect(csv).toContain('"Alpha"');
    expect(csv).toContain('"[""a"",""b""]"');
  });
});
