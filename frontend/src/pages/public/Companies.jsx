import { useEffect, useState } from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import { companyApi } from '../../api/company.api';

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    companyApi.list()
      .then(({ data }) => setCompanies(data.items))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Companies</h1>
        {loading ? <Spinner /> : companies.length === 0 ? (
          <EmptyState title="No companies yet" icon="🏢" />
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {companies.map((c) => (
              <div key={c.id} className="card">
                <div className="w-14 h-14 rounded-lg bg-primary/10 grid place-items-center text-primary font-bold text-xl mb-3">
                  {c.name[0]}
                </div>
                <h3 className="font-bold">{c.name}</h3>
                <p className="text-sm text-gray-500">{c.industry} · {c.location}</p>
                <p className="text-sm text-gray-700 mt-2 line-clamp-2">{c.description}</p>
                <p className="text-xs text-gray-500 mt-3">{c.jobs_count} open jobs</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}