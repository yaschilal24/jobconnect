export default function Pagination({ page, pages, onPage }) {
  if (pages <= 1) return null;
  const nums = Array.from({ length: pages }, (_, i) => i + 1).filter(
    (n) => n === 1 || n === pages || Math.abs(n - page) <= 1
  );
  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button disabled={page === 1} onClick={() => onPage(page - 1)} className="btn-outline text-sm">Prev</button>
      {nums.map((n, i, arr) => (
        <span key={n} className="flex items-center gap-2">
          {i > 0 && n - arr[i - 1] > 1 && <span className="text-gray-400">…</span>}
          <button
            onClick={() => onPage(n)}
            className={`w-9 h-9 rounded-lg text-sm font-medium ${
              n === page ? 'bg-primary text-white' : 'bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >{n}</button>
        </span>
      ))}
      <button disabled={page === pages} onClick={() => onPage(page + 1)} className="btn-outline text-sm">Next</button>
    </div>
  );
}