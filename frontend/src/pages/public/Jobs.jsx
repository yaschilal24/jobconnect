import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import JobCard from '../../components/jobs/JobCard';
import JobFilters from '../../components/jobs/JobFilters';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import { JobCardSkeleton } from '../../components/common/Skeleton';
import { jobApi } from '../../api/job.api';

export default function Jobs() {
  const [params] = useSearchParams();
  const [filters, setFilters] = useState({
    q: params.get('q') || '',
    location: params.get('location') || '',
    type: '',
    experienceLevel: '',
    category: params.get('category') || '',
    sort: 'newest',
    page: 1,
    limit: 10,
  });
  const [data, setData] = useState({ items: [], meta: {} });
  const [loading, setLoading] = useState(true);

  const load = async (f = filters) => {
    setLoading(true);
    try {
      const { data } = await jobApi.search(f);
      setData({ items: data.items, meta: data.meta });
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [filters.page]);

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <input className="input text-lg" placeholder="Search jobs…" value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && load()} />
        </div>
        <div className="grid md:grid-cols-[300px_1fr] gap-6">
          <JobFilters filters={filters} setFilters={setFilters} onApply={() => load()} />
          <div>
            {loading ? (
              <div className="grid gap-4">{[1,2,3].map((i) => <JobCardSkeleton key={i} />)}</div>
            ) : data.items.length === 0 ? (
              <EmptyState title="No jobs found" message="Try adjusting your filters." />
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-3">Showing {data.items.length} of {data.meta.total} jobs</p>
                <div className="grid gap-4">{data.items.map((j) => <JobCard key={j.id} job={j} />)}</div>
                <Pagination page={data.meta.page} pages={data.meta.pages} onPage={(p) => setFilters({ ...filters, page: p })} />
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}