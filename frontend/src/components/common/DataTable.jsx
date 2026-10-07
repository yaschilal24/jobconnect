export default function DataTable({ columns, rows, empty = 'No data' }) {
  if (!rows?.length) return <p className="text-gray-500 text-sm py-6 text-center">{empty}</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-left text-gray-500 border-b">
          <tr>{columns.map((c) => <th key={c.key} className="py-2 pr-4">{c.label}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id || i} className="border-b last:border-0">
              {columns.map((c) => (
                <td key={c.key} className="py-3 pr-4">
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}