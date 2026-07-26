export function exportCSV(filename: string, headers: string[], rows: string[][]) {
  const csv = [
    headers.join(','),
    ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')),
  ].join('\n')

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export function printTable(title: string, headers: string[], rows: string[][]) {
  const w = window.open('', '_blank')
  if (!w) return

  w.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', -apple-system, sans-serif; padding: 40px; color: #111; }
        h1 { font-size: 24px; margin-bottom: 8px; }
        .date { color: #666; font-size: 13px; margin-bottom: 24px; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        th { background: #f5f5f5; text-align: left; padding: 10px 14px; font-weight: 600; border-bottom: 2px solid #ddd; }
        td { padding: 9px 14px; border-bottom: 1px solid #eee; }
        tr:nth-child(even) td { background: #fafafa; }
        @media print {
          body { padding: 20px; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="margin-bottom:20px">
        <button onclick="window.print()" style="padding:8px 20px;background:#4361ee;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:14px">Imprimer / PDF</button>
      </div>
      <h1>${title}</h1>
      <div class="date">Généré le ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
      <table>
        <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
        <tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
      </table>
    </body>
    </html>
  `)
  w.document.close()
}
