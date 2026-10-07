const TYPES = ['INTERNSHIP', 'FULL_TIME', 'PART_TIME', 'CONTRACT'];

export default function JobFilters({ filters, setFilters, onApply }) {
  const set = (k, v) => setFilters({ ...filters, [k]: v });
  return (
    <aside className="card sticky top-24">
      <h3 className="font-bold mb-4">Filters</h3>
      <div className="mb-5">
        <label className="label">Job Type</label>
        <select className="input" value={filters.type || ''} onChange={(e) => set('type', e.target.value)}>
          <option value="">All</option>
          {TYPES.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
        </select>
      </div>
      <div className="mb-5">
        <label className="label">Experience</label>
        <select className="input" value={filters.experienceLevel || ''} onChange={(e) => set('experienceLevel', e.target.value)}>
          <option value="">All</option>
          <option value="ENTRY">Entry</option>
          <option value="MID">Mid</option>
          <option value="SENIOR">Senior</option>
        </select>
      </div>
      <div className="mb-5">
        <label className="label">Location</label>
        <input className="input" placeholder="Remote, Addis…" value={filters.location || ''} onChange={(e) => set('location', e.target.value)} />
      </div>
      <div className="mb-5">
        <label className="label">Sort by</label>
        <select className="input" value={filters.sort || 'newest'} onChange={(e) => set('sort', e.target.value)}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="salary_desc">Salary: High → Low</option>
          <option value="salary_asc">Salary: Low → High</option>
        </select>
      </div>
      <button className="btn-primary w-full" onClick={onApply}>Apply Filters</button>
    </aside>
  );
}