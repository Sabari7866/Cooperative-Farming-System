export function arrayToCSV(items: any[], columns?: string[]) {
  if (!items || items.length === 0) return '';
  const keys = columns && columns.length ? columns : Object.keys(items[0]);
  const lines = [keys.join(',')];
  for (const item of items) {
    const row = keys.map((key) => {
      const val = item[key];
      if (val === null || val === undefined) return '';
      const s = typeof val === 'object' ? JSON.stringify(val) : String(val);
      // escape double quotes
      return `"${s.replace(/"/g, '""')}"`;
    });
    lines.push(row.join(','));
  }
  return lines.join('\n');
}

export function downloadCSV(filename: string, items: any[], columns?: string[]) {
  const csv = arrayToCSV(items, columns);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
