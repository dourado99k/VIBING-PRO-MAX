export default function Table({ columns, data, keyField = 'id', emptyMessage = 'Nenhum registro' }) {
  if (!data?.length) {
    return (
      <p className="py-8 text-center text-sm text-muted">{emptyMessage}</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-sand-200">
      <table className="w-full min-w-[600px] text-left text-sm">
        <thead className="bg-sand-100 text-xs uppercase tracking-wide text-muted">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 font-semibold">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-sand-100">
          {data.map((row) => (
            <tr key={row[keyField]} className="bg-white hover:bg-sand-50">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-dark">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
